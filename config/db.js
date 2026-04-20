import mongoose from "mongoose";

const connectDb = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://user:rush123@cluster0.0y5qey6.mongodb.net/testnew?retryWrites=true&w=majority"  
    );
    console.log("MongoDB Connected Successfully 🎉");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

export default connectDb;