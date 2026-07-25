import mongoose from "mongoose";

const pollSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    mode: {
      type: String,
      enum: ["auth", "anonymous"],
      default: "auth",
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    expireAt: {
      type: Date,
      required: [true, "Poll expirey required"],
    },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

export const Poll = mongoose.model("Poll", pollSchema);
