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

const fetchAllPolls = async (userId) => {
  const polls = await Poll.find({ creatorId: userId }).lean();

  const pollsWithStats = await Promise.all(
    polls.map(async (poll) => {
      const people = await Participant.countDocuments({
        pollId: poll._id,
      });

      const votes = await Answer.countDocuments({
        pollId: poll._id,
      });

      return {
        ...poll,
        people,
        votes,
      };
    }),
  );

  return pollsWithStats;
};

const fetchAnalytics = async (userId, pollId) => {
  // =========================================
  // FETCH USER POLLS
  // =========================================

  const userPolls = await Poll.find({
    creatorId: userId,
  }).lean();

  // =========================================
  // FILTER POLLS
  // =========================================

  const filteredPolls =
    pollId && pollId !== "all"
      ? userPolls.filter((poll) => poll._id.toString() === pollId.toString())
      : userPolls;

  const pollIds = filteredPolls.map((poll) => poll._id);

  // if no polls
  if (!pollIds.length) {
    return {
      selectedPoll: pollId || "all",

      stats: {
        totalPolls: 0,
        totalVotes: 0,
        totalParticipants: 0,
        totalQuestions: 0,
        activePolls: 0,
      },

      timelineData: [],
      engagementData: [],
      topPoll: null,
      polls: [],
    };
  }

  // =========================================
  // GLOBAL COUNTS
  // =========================================

  const [totalVotes, totalParticipants, totalQuestions] = await Promise.all([
    Answer.countDocuments({
      pollId: { $in: pollIds },
    }),

    Participant.countDocuments({
      pollId: { $in: pollIds },
    }),

    Question.countDocuments({
      pollId: { $in: pollIds },
    }),
  ]);

  // =========================================
  // ACTIVE POLLS
  // =========================================

  const activePolls = filteredPolls.filter(
    (poll) => !poll.expireAt || new Date(poll.expireAt) > new Date(),
  ).length;

  // =========================================
  // PER POLL STATS
  // =========================================

  const pollsWithStats = await Promise.all(
    filteredPolls.map(async (poll) => {
      const [votes, people, questions] = await Promise.all([
        Answer.countDocuments({
          pollId: poll._id,
        }),

        Participant.countDocuments({
          pollId: poll._id,
        }),

        Question.countDocuments({
          pollId: poll._id,
        }),
      ]);

      return {
        _id: poll._id,

        title: poll.title,

        expireAt: poll.expireAt,

        votes,

        people,

        questions,
      };
    }),
  );

  // =========================================
  // TIMELINE DATA
  // =========================================

  const timelineData = pollsWithStats.map((poll, index) => ({
    name: `Poll ${index + 1}`,

    votes: poll.votes,
  }));

  // =========================================
  // ENGAGEMENT DATA
  // =========================================

  const engagementData = pollsWithStats.map((poll) => ({
    name: poll.title.length > 12 ? poll.title.slice(0, 12) + "..." : poll.title,

    votes: poll.votes,

    participants: poll.people,
  }));

  // =========================================
  // TOP POLL
  // =========================================

  const topPoll = pollsWithStats.sort((a, b) => b.votes - a.votes)[0] || null;

  // =========================================
  // RESPONSE
  // =========================================

  return {
    selectedPoll: pollId || "all",

    stats: {
      totalPolls: filteredPolls.length,

      totalVotes,

      totalParticipants,

      totalQuestions,

      activePolls,
    },

    timelineData,

    engagementData,

    topPoll,

    polls: pollsWithStats,
  };
};

const fetchPoll = async (pollId) => {
  const poll = await Poll.findById(pollId);

  if (!poll) {
    throw ApiError.notfound("Poll not found");
  }

  // =========================
  // EXPIRE CHECK
  // =========================
  const isExpired = poll.expireAt && new Date() > new Date(poll.expireAt);

  // =========================
  // QUESTIONS
  // =========================
  const questions = await Question.find({
    pollId: poll._id,
  });

  // =========================
  // BUILD QUESTIONS
  // =========================
  const questionsWithOptions = await Promise.all(
    questions.map(async (question) => {
      const options = await Option.find({
        questionId: question._id,
      });

      // total votes per question
      const totalVotes = await Answer.countDocuments({
        questionId: question._id,
      });

      // build options (HIDDEN unless expired)
      const optionsMapped = await Promise.all(
        options.map(async (option) => {
          const votes = await Answer.countDocuments({
            optionId: option._id,
          });

          return {
            ...option.toObject(),

            // 🔥 IMPORTANT: hide results until expiry
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

        // 🔥 hide totalVotes until expiry
        ...(isExpired && {
          totalVotes,
        }),
      };
    }),
  );

  // =========================
  // STATS
  // =========================
  const people = await Participant.countDocuments({
    pollId: poll._id,
  });

  const votes = await Answer.countDocuments({
    pollId: poll._id,
  });

  // =========================
  // RESPONSE
  // =========================
  return {
    ...poll.toObject(),

    isExpired,

    // 🔥 SAFE QUESTIONS (no leakage before expiry)
    questions: questionsWithOptions,

    people,
    votes,
  };
};

const submitPoll = async (pollId, userId, pollInfo, anonymousId) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // find poll
    const poll = await Poll.findById(pollId).session(session);

    if (!poll) {
      throw ApiError.notfound("Poll not found");
    }

    // poll expired
    if (poll.expireAt && new Date() > poll.expireAt) {
      throw ApiError.badRequest("Poll has expired");
    }

    // auth poll requires login
    if (poll.mode === "auth" && !userId) {
      throw ApiError.unauthorized("First login to submit poll");
    }

    // anonymous poll requires anonymous id
    if (poll.mode === "anonymous" && !anonymousId) {
      throw ApiError.badRequest("Anonymous ID is required");
    }

    // prevent duplicate submission (auth)
    if (poll.mode === "auth") {
      const alreadySubmitted = await Participant.findOne({
        pollId: poll._id,
        userId,
      }).session(session);

      if (alreadySubmitted) {
        throw ApiError.badRequest("You already submitted this poll");
      }
    }

    // prevent duplicate submission (anonymous)
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

    // create participant
    const [participant] = await Participant.create(
      [
        {
          pollId: poll._id,
          userId: userId || null,
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

    // commit transaction
    await session.commitTransaction();

    // =========================
    // SOCKET LIVE UPDATE
    // =========================

    // total participants
    const people = await Participant.countDocuments({
      pollId: poll._id,
    });

    // total votes
    const votes = await Answer.countDocuments({
      pollId: poll._id,
    });

    // votes per question
    // =========================
    // LIVE QUESTION + OPTION RESULTS
    // =========================

    const questionVotes = await Promise.all(
      questions.map(async (question) => {
        // total votes for question
        const totalVotes = await Answer.countDocuments({
          questionId: question._id,
        });

        // all options of this question
        const questionOptions = await Option.find({
          questionId: question._id,
        });

        // option vote stats
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

    // =========================
    // EMIT LIVE UPDATE
    // =========================

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

export {
  createPoll,
  fetchPoll,
  submitPoll,
  pollResult,
  fetchAllPolls,
  fetchAnalytics,
};
