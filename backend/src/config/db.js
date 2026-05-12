import mongoose from "mongoose";

export const connectDB = async (url) => {
  try {
    await mongoose.connect(url);
    console.log("Database connected");
  } catch (error) {
    console.error("Database connection failed!", error);
  }
};
