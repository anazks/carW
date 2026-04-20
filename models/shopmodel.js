import mongoose from "mongoose";

const shopSchema = new mongoose.Schema(
  {
    ShopName: {
      type: String,
      required: true,
    },
    ProfileImage: {
      type: String,
      default: "",
    },
    City: {
      type: String,
      required: true,
    },
    ExactLocation: {
      type: String,
      required: true,
    },
    ExactLocationCoord: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    Mobile: {
      type: Number,
      required: true,
    },
    Timing: {
      type: String,
      required: true,
    },
    website: {
      type: String,
      default: "",
    },
    media: [
      {
        url: String,
        title: String,
        description: String,
      },
    ],
    ShopOwnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    IsPremium: {
      type: Boolean,
      default: false,
    },
    PremiumStartDate: {
      type: Date,
    },
    PremiumEndDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Create a 2dsphere index for geolocation queries
shopSchema.index({ ExactLocationCoord: "2dsphere" });

const Shop = mongoose.model("Shop", shopSchema);

export default Shop;
