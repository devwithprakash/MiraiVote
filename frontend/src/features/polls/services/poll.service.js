import { getAnonymousId } from "./anonymous.js";
import { api } from "../../../shared/lib/api.js";

export const pollService = {
  async createPoll({ title, mode, expireAt, questions }) {
    const { data } = await api.post(
      "/polls",
      {
        title,
        mode,
        expireAt,
        questions,
      },
      { withCredentials: true },
    );

    return data;
  },

  async fetchAllPolls() {
    const { data } = await api.get("/polls");

    return data;
  },

  async fetchAnalytics(pollId) {
    const { data } = await api.get(`/polls/analytics/${pollId}`);

    return data;
  },

  async fetchPoll(id) {
    const { data } = await api.get(`/polls/${id}`, {
      withCredentials: true,
    });

    return data;
  },
  async fetchPublicPoll(id) {
    const { data } = await api.get(`/polls/public/${id}`, {
      withCredentials: true,
    });

    return data;
  },

  async submitPoll(id, pollInfo) {
    const { data } = await api.post(
      `/polls/${id}/submit`,
      {
        pollInfo,
        anonymousId: getAnonymousId(),
      }
    );

    return data;
  },

  async pollResult(shareToken) {
    const { data } = await api.get(`/poll/${shareToken}/result`);

    return data;
  },

  async deletePoll(pollId) {
    const { data } = await api.delete(`/polls/${pollId}`, {
      withCredentials: true,
    });

    return data;
  },
};
