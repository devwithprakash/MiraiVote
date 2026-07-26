import { getAuth } from "@clerk/express";
import * as service from "../services/poll.service.js";
import ApiResponse from "../utils/api-response.js";

const createPoll = async (req, res) => {
  const { userId } = getAuth(req);

  const result = await service.createPoll(req.body, userId);

  ApiResponse.created(res, "Poll created successfully", result);
};

const fetchPoll = async (req, res) => {
  const { userId } = getAuth(req);
  const result = await service.fetchPoll(req.params.id, userId);

  ApiResponse.ok(res, "Poll fetched successfully", result);
};

const fetchPollBySlug = async (req, res) => {
  const { userId } = getAuth(req);
  const result = await service.fetchPollBySlug(req.params.slug, userId);

  ApiResponse.ok(res, "Poll fetched successfully", result);
};

const fetchAnalytics = async (req, res) => {
  const { userId } = getAuth(req);

  const days = Number(req.query.days) || 7;
  const result = await service.fetchAnalytics(req.params.pollId, days, userId);

  ApiResponse.ok(res, "polls analytics", result);
};

const fetchAllPolls = async (req, res) => {
  const { userId } = getAuth(req);
  const result = await service.fetchAllPolls(userId);

  ApiResponse.ok(res, "All polls", result);
};

const updatePoll = async (req, res) => {
  const { userId } = getAuth(req);
  const result = await service.updatePoll(req.body, req.params.pollId, userId);

  ApiResponse.ok(res, "Poll updated successfully", result);
};

const submitPoll = async (req, res) => {
  const {userId} = getAuth(req)
  const result = await service.submitPoll(
    req.params.slug,
    req.body.pollInfo,
    req.body.anonymousId,
    userId
  );

  ApiResponse.ok(res, "Poll submitted successfully", result);
};

const pollResult = async (req, res) => {
  const result = await service.pollResult(req.params.token, req.userId);

  ApiResponse.ok(res, "Poll result", result);
};

const deletePoll = async (req, res) => {
  const { userId } = getAuth(req);
  const result = await service.deletePoll(req.params.id, userId);
  ApiResponse.ok(res, "Poll deleted successfully", result);
};

export {
  createPoll,
  fetchPoll,
  submitPoll,
  pollResult,
  fetchAllPolls,
  fetchAnalytics,
  deletePoll,
  updatePoll,
  fetchPollBySlug
};
