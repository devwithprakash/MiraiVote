import crypto from "crypto";
import mongoose from "mongoose";

import { Poll } from "../models/poll.model.js";
import { Question } from "../models/question.model.js";
import { Option } from "../models/option.model.js";
import ApiError from "../utils/api-error.js";
import { Participant } from "../models/participant.model.js";
import { Answer } from "../models/answer.model.js";
import { User } from "../models/user.model.js";

function generateShareToken() {
  return crypto.randomBytes(24).toString("base64url");
}

const createPoll = async ({ title, mode, expireAt, questions }, userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw ApiError.notfound("User not found");
  }

  if (!user.isVerified) {
    throw ApiError.badRequest("User email is not verified");
  }

  const poll = await Poll.create({
    title,
    mode,
    expireAt,
    shareToken: generateShareToken(),
    creatorId: userId,
  });

  const createdQuestions = await Question.insertMany(
    questions.map((q) => ({
      text: q.text,
      order: q.order,
      pollId: poll._id,
    })),
  );

  const optionsData = questions.flatMap((q, i) =>
    q.options.map((opt) => ({
      text: opt.text,
      order: opt.order,
      questionId: createdQuestions[i]._id,
    })),
  );

  await Option.insertMany(optionsData);

  return poll;
};

const fetchPoll = async (shareToken) => {
  if (!shareToken) {
    throw ApiError.badRequest("Share token is required");
  }

  const poll = await Poll.findOne({ shareToken });

  if (!poll) {
    throw ApiError.notfound("Poll not found");
  }

  if (Date.now() > poll.expireAt) {
    throw ApiError.badRequest("Poll has expired");
  }

  const questions = await Question.find({ pollId: poll._id });

  const questionsWithOptions = await Promise.all(
    questions.map(async (question) => {
      const options = await Option.find({
        questionId: question._id,
      });

      return {
        ...question.toObject(),
        options,
      };
    }),
  );

  const pollData = {
    ...poll.toObject(),
    questions: questionsWithOptions,
  };

  return pollData;
};

const submitPoll = async (shareToken, userId, pollInfo) => {
  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    const poll = await Poll.findOne({ shareToken }).session(session);

    if (!poll) {
      throw ApiError.notfound("Poll not found");
    }

    if (poll.expireAt && new Date() > poll.expireAt) {
      throw ApiError.badRequest("Poll has expired");
    }

    if (poll.mode === "auth" && !userId) {
      throw ApiError.unauthorized("First login to submit poll");
    }

    if (poll.mode === "auth") {
      const alreadySubmitted = await Participant.findOne({
        pollId: poll._id,
        userId,
      }).session(session);

      if (alreadySubmitted) {
        throw ApiError.badRequest("You already submitted this poll");
      }
    }

    const uniqueQuestions = new Set(
      pollInfo.map((p) => p.questionId.toString()),
    );

    if (uniqueQuestions.size !== pollInfo.length) {
      throw ApiError.badRequest("Duplicate question answers found");
    }

    const questionIds = pollInfo.map((p) => p.questionId);
    const optionIds = pollInfo.map((p) => p.optionId);

    const questions = await Question.find({
      _id: { $in: questionIds },
      pollId: poll._id,
    }).session(session);

    const options = await Option.find({
      _id: { $in: optionIds },
    }).session(session);

    const questionMap = new Map(questions.map((q) => [q._id.toString(), q]));

    const optionMap = new Map(options.map((o) => [o._id.toString(), o]));

    for (const p of pollInfo) {
      const question = questionMap.get(p.questionId.toString());

      if (!question) {
        throw ApiError.badRequest("Invalid question");
      }

      const option = optionMap.get(p.optionId.toString());

      if (!option || option.questionId.toString() !== question._id.toString()) {
        throw ApiError.badRequest("Invalid option");
      }
    }

    const participant = await Participant.create(
      [
        {
          pollId: poll._id,
          userId: userId || null,
          submittedAt: new Date(),
        },
      ],
      { session },
    );

    const answerData = pollInfo.map((p) => ({
      participantId: participant[0]._id,
      questionId: p.questionId,
      optionId: p.optionId,
    }));

    await Answer.insertMany(answerData, { session });

    await session.commitTransaction();

    return {
      success: true,
      participantId: participant[0]._id,
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const pollResult = async (shareToken, userId) => {
  const poll = await Poll.findOne({ shareToken });

  if (!poll) {
    throw ApiError.notfound("Poll not found");
  }

  if (poll.mode === "auth" && !userId) {
    throw ApiError.unauthorized("First login to see result");
  }

  const questions = await Question.find({
    pollId: poll._id,
  });

  const options = await Option.find({
    questionId: {
      $in: questions.map((q) => q._id),
    },
  });

  const answers = await Answer.aggregate([
    {
      $match: {
        questionId: {
          $in: questions.map((q) => q._id),
        },
      },
    },
    {
      $group: {
        _id: "$optionId",
        totalVotes: {
          $sum: 1,
        },
      },
    },
  ]);

  const totalParticipants = await Participant.countDocuments({
    pollId: poll._id,
  });

  const voteMap = new Map();

  answers.forEach((a) => {
    voteMap.set(a._id.toString(), a.totalVotes);
  });

  const formattedQuestions = questions.map((question) => {
    const questionOptions = options
      .filter(
        (option) => option.questionId.toString() === question._id.toString(),
      )
      .map((option) => ({
        optionId: option._id,
        text: option.text,
        votes: voteMap.get(option._id.toString()) || 0,
      }));

    return {
      questionId: question._id,
      title: question.title,
      options: questionOptions,
    };
  });

  return {
    pollId: poll._id,
    title: poll.title,
    totalParticipants,
    questions: formattedQuestions,
  };
};

export { createPoll, fetchPoll, submitPoll, pollResult };
