import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    shopId: {
      type: String,
      required: true,
    },
    shopName: {
      type: String,
      required: true,
    },
    bookingDate: {
      type: String,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    services: [
      {
        name: String,
        price: Number,
        duration: Number,
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    bookingStatus: {
      type: String,
      default: "confirmed",
    },
    paymentStatus: {
      type: String,
      default: "not paid",
    },
    amountPaid: {
      type: Number,
    },
    bookingTimestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
