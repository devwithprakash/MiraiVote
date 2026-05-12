import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    participantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Participant",
    },
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
    },
    optionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Option",
    },
  },
  { timestamps: true },
);

export const Answer = mongoose.model("Answer", answerSchema);
