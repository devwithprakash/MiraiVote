import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
    },
    pollId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Poll",
    },
  },
  { timestamps: true },
);

export const Question = mongoose.model("Question", questionSchema);
