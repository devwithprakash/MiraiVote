import mongoose from "mongoose";

const participantSchema = new mongoose.Schema(
  {
    pollId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Poll",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    anonymousId: {
      type: String,
    },
    submittedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

export const Participant = mongoose.model("Participant", participantSchema);
