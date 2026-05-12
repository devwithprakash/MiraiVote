import * as service from "../services/poll.service.js";
import ApiResponse from "../utils/api-response.js";

const createPoll = async (req, res) => {
  const result = await service.createPoll(req.body, req.userId);

  ApiResponse.created(res, "Poll created successfully", result);
};

const fetchPoll = async (req, res) => {
  const result = await service.fetchPoll(req.params.token);

  ApiResponse.ok(res, "Poll fetched successfully", result);
};

const submitPoll = async (req, res) => {
  const result = await service.submitPoll(
    req.params.token,
    req.userId,
    req.body.pollInfo,
  );

  ApiResponse.ok(res, "Poll submitted successfully", result);
};

const pollResult = async (req, res) => {
  const result = await service.pollResult(req.params.token, req.userId);

  ApiResponse.ok(res, "Poll result", result);
};

export { createPoll, fetchPoll, submitPoll, pollResult };
