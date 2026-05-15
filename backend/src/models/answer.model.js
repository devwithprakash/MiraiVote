import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    pollId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Poll",
      required: true,
    },

    participantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Participant",
      required: true,
    },

    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },

    optionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Option",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Answer = mongoose.model("Answer", answerSchema);
