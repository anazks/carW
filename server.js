import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import connectDb from "./config/db.js";
import User from "./models/usermodel.js";
import Booking from "./models/bookingmodel.js";
import Shop from "./models/shopmodel.js";
import Service from "./models/servicemodel.js";
import { verifyToken } from "./middleware/auth.js";
import UserRouter from "./Routers/UserRouter/UserRouter.js";


const app = express();

app.use(cors());
app.use(express.json());
app.use("/users", UserRouter);

connectDb();

// ✅ Log DB Info to verify connection
mongoose.connection.on('connected', () => {
  console.log("DB Host:", mongoose.connection.host);
  console.log("DB Port:", mongoose.connection.port);
  console.log("DB Name:", mongoose.connection.name);
});

/* ================= TEST ROUTE ================= */

app.get("/", (req, res) => {
  res.json({
    message: "API Running 🚀",
  });
});

/* ================= CREATE USER ================= */

app.post("/auth/user/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      ...req.body,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: savedUser,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

/* ================= CREATE SHOP OWNER ================= */

app.post("/auth/shop/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      ...req.body,
      password: hashedPassword,
      role: "owner", // ✅ Force owner role for this route
    });

    const savedUser = await newUser.save();
    res.status(201).json({
      success: true,
      message: "Owner registered successfully",
      user: savedUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ================= GET ALL USERS ================= */

app.get("/users", async (req, res) => {
  try {

    const users = await User.find();

    res.json(users);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
});

/* ================= LOGIN ================= */

app.post("/login", async (req, res) => {

  try {

    const { email, password, role } = req.body;
    console.log("LOGIN ATTEMPT for:", email, "Expected Role:", role);

    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(400).json({
        message: "Account not found with this email",
      });
    }

    // Role check
    if (role && user.role !== role) {
      return res.status(401).json({
        message: `Incorrect credentials. This account is registered as a ${user.role}.`,
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({
        message: "Incorrect password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      "secretkey",
      {
        expiresIn: "1d",
      }
    );
    res.json({
  success: true,
  token,
  user: {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    mobileNo: user.mobileNo,
    city: user.city,
    role: user.role,
  },
});

  } catch (error) {

    res.status(500).json({
      message: "Server error",
    });

  }

});

/* ================= SHOP OWNER PROFILE (Alias) ================= */

app.get("/shop/getMyProfile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "Owner not found" });
    }
    res.json({
      success: true,
      data: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        mobileNo: user.mobileNo,
        city: user.city,
        role: user.role,
        createdAt: user.createdAt,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ================= PROFILE ================= */

app.get("/auth/user/getProfile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.json({
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobileNo: user.mobileNo,
      city: user.city,
      role: user.role,
      createdAt: user.createdAt,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// 🛠️ DEBUG: Check owner bookings query
app.get("/debug/ownerBookings", verifyToken, async (req, res) => {
  try {
    const ownerShops = await Shop.find({ ShopOwnerId: req.user.id });
    const shopIds = ownerShops.map((s) => s._id.toString());

    const allBookings = await Booking.find({});
    const bookingShopIds = allBookings.map((b) => b.shopId);

    res.json({
      ownerId: req.user.id,
      ownerShopsFound: ownerShops.length,
      shopIds,
      totalBookingsInDB: allBookings.length,
      bookingShopIds, // compare these with shopIds above
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🛠️ DEBUG: See ALL bookings in DB
app.get("/debug/allBookings", async (req, res) => {
  try {
    const bookings = await Booking.find({});
    res.json({ count: bookings.length, bookings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/debug/ownerBookings/:ownerId", async (req, res) => {
  try {
    const { ownerId } = req.params;

    const ownerShops = await Shop.find({
      $or: [
        { ShopOwnerId: ownerId },
        { ShopOwnerId: new mongoose.Types.ObjectId(ownerId) }
      ]
    });

    const shopIds = ownerShops.map((s) => s._id.toString());
    const allBookings = await Booking.find({});
    const matchingBookings = allBookings.filter(b => shopIds.includes(b.shopId));

    res.json({
      ownerId,
      shopsFound: ownerShops.length,
      shopIds,
      allBookingShopIds: allBookings.map(b => b.shopId),
      matchingBookings: matchingBookings.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= BOOKING ================= */

// ✅ Create Booking
app.post("/booking/BookNow", verifyToken, async (req, res) => {
  try {
        console.log("Booking request body:", req.body); // 👈 add this
    console.log("User ID:", req.user.id);           // 👈 add this

    const bookingData = {
      ...req.body,
      userId: req.user.id, // Attach user ID from token
    };

    const newBooking = new Booking(bookingData);
    const savedBooking = await newBooking.save();

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: savedBooking,
    });
  } catch (error) {
    console.error("Create Booking Error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating booking",
      error: error.message,
    });
  }
});

// ✅ Fetch My Bookings
app.post("/booking/myBookings", verifyToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      bookings: bookings,
    });
  } catch (error) {
    console.error("Fetch Bookings Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching bookings",
      error: error.message,
    });
  }
});
// ✅ Fetch Bookings for Owner's Shop(s)
app.get("/booking/ownerBookings", verifyToken, async (req, res) => {
  try {
    const ownerShops = await Shop.find({ ShopOwnerId: req.user.id });
    const shopIds = ownerShops.map((s) => s._id.toString());

    const bookings = await Booking.find({ shopId: { $in: shopIds } })
      .populate("userId", "firstName lastName")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, bookings });
  } catch (error) {
    console.error("Owner Bookings Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ Update Booking Status (Owner only)
app.put("/booking/updateStatus/:id", verifyToken, async (req, res) => {
  try {
    const { bookingStatus } = req.body;
    const updated = await Booking.findByIdAndUpdate(
      req.params.id,
      { bookingStatus },
      { new: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: "Booking not found" });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ Fetch Available Time Slots
app.post("/booking/fetchAllAvailableTimeSlots", async (req, res) => {
  try {
    // Dynamic slots (dummy for now)
    const slots = [
      "09:00 AM - 10:00 AM",
      "10:00 AM - 11:00 AM",
      "11:00 AM - 12:00 PM",
      "12:00 PM - 01:00 PM",
      "02:00 PM - 03:00 PM",
      "03:00 PM - 04:00 PM",
      "04:00 PM - 05:00 PM"
    ];
    res.status(200).json({ success: true, availableSlots: slots });
  } catch (error) {
    console.error("Fetch Slots Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching available slots",
      error: error.message,
    });
  }
});

/* ================= SHOP ================= */

// ✅ Add Shop
app.post("/shop/addShop", verifyToken, async (req, res) => {
  try {
    console.log("Adding shop for owner ID:", req.user.id);
    const shopData = {
      ...req.body,
      ShopOwnerId: new mongoose.Types.ObjectId(req.user.id), // Force ObjectId
    };

    const newShop = new Shop(shopData);
    const savedShop = await newShop.save();
    console.log("Shop saved successfully with ID:", savedShop._id);

    res.status(201).json({
      success: true,
      message: "Shop added successfully",
      data: savedShop,
    });
  } catch (error) {
    console.error("Add Shop Error:", error);
    res.status(500).json({
      success: false,
      message: "Error adding shop",
      error: error.message,
    });
  }
});

// ✅ Find Nearby Shops (Global for now)
app.get("/shop/findNearByShops", async (req, res) => {
  try {
    // Return all shops as requested ("global")
    const shops = await Shop.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      shops: shops,
    });
  } catch (error) {
    console.error("Fetch Shops Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching shops",
      error: error.message,
    });
  }
});

// ✅ View Single Shop
app.post("/shop/viewSigleShop", async (req, res) => {
  try {
    const { id } = req.body;
    const shop = await Shop.findById(id).populate("ShopOwnerId", "firstName lastName email");

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    res.status(200).json({
      success: true,
      data: shop,
    });
  } catch (error) {
    console.error("View Shop Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching shop details",
      error: error.message,
    });
  }
});

// ✅ View My Shops (For Owner)
app.get("/shop/viewMyshop", verifyToken, async (req, res) => {
  try {
    console.log("Fetching shops for owner ID (req.user.id):", req.user.id);
    
    // Try finding by both ObjectId and String to be safe
    let shops = await Shop.find({ ShopOwnerId: req.user.id });
    
    if (shops.length === 0) {
      try {
        const ownerId = new mongoose.Types.ObjectId(req.user.id);
        shops = await Shop.find({ ShopOwnerId: ownerId });
      } catch (e) {
        console.log("ObjectId conversion failed, skipping ObjectId search");
      }
    }

    console.log("Found shops count:", shops.length);

    res.status(200).json({
      success: true,
      data: shops,
    });
  } catch (error) {
    console.error("Fetch My Shops Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching your shops",
      error: error.message,
    });
  }
});

// 🛠️ DEBUG ROUTE: List ALL shops in DB
app.get("/debug/all-shops", async (req, res) => {
  try {
    const shops = await Shop.find().populate("ShopOwnerId", "email role");
    res.json({ count: shops.length, shops });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete Shop (also removes all services for that shop)
app.delete("/shop/deleteShop/:id", verifyToken, async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    if (!shop) {
      return res.status(404).json({ success: false, message: "Shop not found" });
    }
    // Only allow the owner to delete their own shop
    if (shop.ShopOwnerId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this shop" });
    }
    // Delete all services linked to this shop
    await Service.deleteMany({ shopId: req.params.id });
    // Delete the shop
    await Shop.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Shop and its services deleted successfully" });
  } catch (error) {
    console.error("Delete Shop Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/* ================= SERVICES ================= */

// ✅ Add Service
app.post("/shop/addService", verifyToken, async (req, res) => {
  try {
    const { shopId, name, price, duration, description, vehicleType } = req.body;
    const newService = new Service({ 
      shopId, 
      name, 
      price, 
      duration, 
      description, 
      vehicleType: vehicleType || "Car" 
    });
    const savedService = await newService.save();
    res.status(201).json({ success: true, message: "Service added successfully", data: savedService });
  } catch (error) {
    console.error("Add Service Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ Delete Service
app.delete("/shop/deleteService/:id", verifyToken, async (req, res) => {
  try {
    const deleted = await Service.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }
    res.status(200).json({ success: true, message: "Service deleted successfully" });
  } catch (error) {
    console.error("Delete Service Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ View Shop Services
app.get("/shop/viewSingleShopService/:id", async (req, res) => {
  try {
    const services = await Service.find({ shopId: req.params.id });
    res.status(200).json({ success: true, data: services });
  } catch (error) {
    console.error("Fetch Services Error:", error);
    res.status(500).json({ success: false, message: error.message || "Error fetching services" });
  }
});

/* ================= START SERVER ================= */

app.listen(8081, () => {
  console.log("Server running on port 8081 🚀");
});