import crypto from "crypto";
import mongoose from "mongoose";

import { Poll } from "../models/poll.model.js";
import { Question } from "../models/question.model.js";
import { Option } from "../models/option.model.js";
import ApiError from "../utils/api-error.js";
import { Participant } from "../models/participant.model.js";
import { Answer } from "../models/answer.model.js";
import { User } from "../models/user.model.js";
import { io } from "../../server.js";

const MAX_RANGE_DAYS = 365;

function generateSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
}

async function getUniqueSlug(title) {
  const base = generateSlug(title);

  const existing = await Poll.find(
    { slug: { $regex: `${base}` } },
    {
      slug: 1,
      _id: 0,
    },
  );

  if (existing.length === 0) return base;

  const existingSet = new Set(existing.map((r) => r.slug));

  if (!existingSet.has(base)) return base;

  let counter = 1;

  while (existingSet.has(`${base}-${counter}`)) {
    counter++;
  }

  return `${base}-${counter}`;
}

async function getUser(userId) {
  const user = await User.findOne({ clerkUserId: userId });

  if (!user) {
    throw ApiError.notfound("User not found");
  }

  return user;
}

const createPoll = async ({ title, mode, expireAt, questions }, userId) => {
  const user = await getUser(userId);
  const slug = await getUniqueSlug(title);

  const session = await mongoose.startSession();

  try {
    let poll;

    await session.withTransaction(async () => {
      const createdPolls = await Poll.create(
        [
          {
            title,
            mode,
            expireAt,
            slug,
            creatorId: user._id,
          },
        ],
        { session },
      );
      poll = createdPolls[0];

      const createdQuestions = await Question.insertMany(
        questions.map((q, index) => ({
          text: q.text,
          order: index,
          pollId: poll._id,
        })),
        { session },
      );

      const optionsData = questions.flatMap((q, questionIndex) =>
        q.options.map((option, optionIndex) => ({
          text: option.text,
          order: optionIndex,
          questionId: createdQuestions[questionIndex]._id,
        })),
      );

      await Option.insertMany(optionsData, { session });
    });

    return poll;
  } finally {
    await session.endSession();
  }
};

const fetchPoll = async (pollId, userId) => {
  try {
    const user = await getUser(userId);

    const poll = await Poll.findOne({ _id: pollId, creatorId: user._id });

    if (!poll) {
      throw ApiError.notfound("Poll not found");
    }

    const isExpired = poll.expireAt && new Date() > new Date(poll.expireAt);

    const questions = await Question.find({
      pollId: poll._id,
    });

    const questionsWithOptions = await Promise.all(
      questions.map(async (question) => {
        const options = await Option.find({
          questionId: question._id,
        });

        const totalVotes = await Answer.countDocuments({
          questionId: question._id,
        });

        const optionsMapped = await Promise.all(
          options.map(async (option) => {
            const votes = await Answer.countDocuments({
              optionId: option._id,
            });

            return {
              ...option.toObject(),

              ...(isExpired && {
                votes,
                percentage:
                  totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0,
              }),
            };
          }),
        );

        return {
          ...question.toObject(),

          options: optionsMapped,

          ...(isExpired && {
            totalVotes,
          }),
        };
      }),
    );

    const people = await Participant.countDocuments({
      pollId: poll._id,
    });

    const votes = await Answer.countDocuments({
      pollId: poll._id,
    });

    return {
      ...poll.toObject(),

      isExpired,

      questions: questionsWithOptions,

      people,
      votes,
    };
  } catch (error) {
    console.log("error", error);
  }
};

const fetchAllPolls = async (userId) => {
  const user = await getUser(userId);

  const polls = await Poll.find({ creatorId: user._id }).lean();

  return polls;
};

const updatePoll = async (payload, pollId, userId) => {
  const { title, mode, expireAt, questions } = payload;

  const user = await getUser(userId);

  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      const updatedPoll = await Poll.findByIdAndUpdate(pollId, {
        title,
        mode,
        expireAt,
      });

      const questions = await Question.find({ pollId: updatedPoll._id });
    });
  } catch (error) {
    console.error(error);
  }
};

const deletePoll = async (pollId, userId) => {
  const user = await getUser(userId);
  const poll = await Poll.findOne({ _id: pollId, creatorId: user._id });

  if (!poll) {
    throw ApiError.notfound("Poll not found");
  }

  const questions = await Question.find({ pollId: poll._id });
  const questionIds = questions.map((q) => q._id);

  await Answer.deleteMany({
    questionId: { $in: questionIds },
  });

  await Option.deleteMany({
    questionId: { $in: questionIds },
  });

  await Question.deleteMany({
    pollId: poll._id,
  });

  await Participant.deleteMany({
    pollId: poll._id,
  });

  await Poll.findByIdAndDelete(pollId);
};

const fetchAnalytics = async (pollId, days, userId) => {
  try {
    const user = await getUser(userId);

    const poll = await Poll.findOne({ _id: pollId, creatorId: user._id });

    if (!poll) {
      throw ApiError.notfound("Form not found");
    }

    const safeDays = Math.min(Math.max(1, Math.floor(days)), MAX_RANGE_DAYS);

    const startDate = new Date();

    startDate.setHours(0, 0, 0, 0);
    startDate.setDate(startDate.getDate() - (safeDays - 1));

    const rows = await Participant.aggregate([
      {
        $match: {
          pollId: new mongoose.Types.ObjectId(pollId),
          submittedAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$submittedAt",
            },
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          count: 1,
        },
      },
      {
        $sort: {
          date: 1,
        },
      },
    ]);

    const [totalParticipants, lastParticipant, totalQuestions, responsesToday] =
      await Promise.all([
        Participant.countDocuments({ pollId }),

        Participant.findOne({ pollId })
          .sort({ submittedAt: -1 })
          .select("submittedAt")
          .lean(),

        Question.find({ pollId }),

        Participant.countDocuments({
          pollId,
          submittedAt: { $gte: startDate },
        }),
      ]);

    const result = {
      rows,
      totalParticipants,
      lastParticipant,
      responsesToday,
      totalQuestions: totalQuestions.length ?? 0,
    };

    return result;
  } catch (error) {
    console.log(error);
  }
};

const fetchPollBySlug = async (slug, userId) => {
  try {
    const poll = await Poll.findOne({ slug });

    if (!poll) {
      throw ApiError.notfound("Poll not found");
    }

    if (poll.mode === "auth" && !userId) {
      throw ApiError.forbidden("First login to submit poll");
    }

    const isExpired = poll.expireAt && new Date() > new Date(poll.expireAt);

    const questions = await Question.find({
      pollId: poll._id,
    });

    const questionsWithOptions = await Promise.all(
      questions.map(async (question) => {
        const options = await Option.find({
          questionId: question._id,
        });

        const totalVotes = await Answer.countDocuments({
          questionId: question._id,
        });

        const optionsMapped = await Promise.all(
          options.map(async (option) => {
            const votes = await Answer.countDocuments({
              optionId: option._id,
            });

            return {
              ...option.toObject(),

              ...(isExpired && {
                votes,
                percentage:
                  totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0,
              }),
            };
          }),
        );

        return {
          ...question.toObject(),

          options: optionsMapped,

          ...(!isExpired && {
            totalVotes,
          }),
        };
      }),
    );

    const people = await Participant.countDocuments({
      pollId: poll._id,
    });

    const votes = await Answer.countDocuments({
      pollId: poll._id,
    });

    return {
      ...poll.toObject(),

      isExpired,

      questions: questionsWithOptions,

      people,
      votes,
    };
  } catch (error) {
    console.log("error", error);
  }
};

// Remaining services

const submitPoll = async (slug, pollInfo, anonymousId, userId) => { 
  const user = await getUser(userId);
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const poll = await Poll.findOne({ slug }).session(session);

    if (!poll) {
      throw ApiError.notfound("Poll not found");
    }

    if (poll.expireAt && new Date() > poll.expireAt) {
      throw ApiError.badRequest("Poll has expired");
    }

    if (poll.mode === "auth" && !userId) {
      throw ApiError.forbidden("First login to submit poll");
    }

    if (poll.mode === "anonymous" && !anonymousId) {
      throw ApiError.badRequest("Anonymous ID is required");
    }

    if (poll.mode === "auth") {
      const alreadySubmitted = await Participant.findOne({
        pollId: poll._id,
        userId: user._id,
      }).session(session);

      if (alreadySubmitted) {
        throw ApiError.badRequest("You already submitted this poll");
      }
    }

    if (poll.mode === "anonymous") {
      const alreadySubmitted = await Participant.findOne({
        pollId: poll._id,
        anonymousId,
      }).session(session);

      if (alreadySubmitted) {
        throw ApiError.badRequest("You already submitted this poll");
      }
    }

    // duplicate question protection
    const uniqueQuestions = new Set(
      pollInfo.map((p) => p.questionId.toString()),
    );

    if (uniqueQuestions.size !== pollInfo.length) {
      throw ApiError.badRequest("Duplicate question answers found");
    }

    // validate questions
    const questionIds = pollInfo.map((p) => p.questionId);

    const questions = await Question.find({
      _id: { $in: questionIds },
      pollId: poll._id,
    }).session(session);

    if (questions.length !== questionIds.length) {
      throw ApiError.badRequest("Invalid questions");
    }

    // validate options
    const optionIds = pollInfo.map((p) => p.optionId);

    const options = await Option.find({
      _id: { $in: optionIds },
    }).session(session);

    const questionMap = new Map(questions.map((q) => [q._id.toString(), q]));

    const optionMap = new Map(options.map((o) => [o._id.toString(), o]));

    // validate option belongs to question
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

    const [participant] = await Participant.create(
      [
        {
          pollId: poll._id,
          userId: user._id || null,
          anonymousId: anonymousId || null,
          submittedAt: new Date(),
        },
      ],
      { session },
    );

    // create answers
    const answerData = pollInfo.map((p) => ({
      pollId: poll._id,
      participantId: participant._id,
      questionId: p.questionId,
      optionId: p.optionId,
    }));

    await Answer.insertMany(answerData, {
      session,
    });

    await session.commitTransaction();

    const people = await Participant.countDocuments({
      pollId: poll._id,
    });

    // total votes
    const votes = await Answer.countDocuments({
      pollId: poll._id,
    });

    const questionVotes = await Promise.all(
      questions.map(async (question) => {
        const totalVotes = await Answer.countDocuments({
          questionId: question._id,
        });

        const questionOptions = await Option.find({
          questionId: question._id,
        });

        const optionResults = await Promise.all(
          questionOptions.map(async (option) => {
            const optionVotes = await Answer.countDocuments({
              optionId: option._id,
            });

            const percentage =
              totalVotes === 0
                ? 0
                : Math.round((optionVotes / totalVotes) * 100);

            return {
              optionId: option._id.toString(),

              votes: optionVotes,

              percentage,
            };
          }),
        );

        return {
          questionId: question._id.toString(),

          totalVotes,

          options: optionResults,
        };
      }),
    );

    io.to(`poll:${poll._id}`).emit("poll_updated", {
      people,
      votes,
      questionVotes,
    });

    return {
      success: true,
      participantId: participant._id,
    };
  } catch (error) {
    console.log(error);
    await session.abortTransaction();

    throw error;
  } finally {
    session.endSession();
  }
};


export {
  createPoll,
  fetchPoll,
  submitPoll,
  fetchAllPolls,
  fetchAnalytics,
  deletePoll,
  updatePoll,
  fetchPollBySlug,
};
