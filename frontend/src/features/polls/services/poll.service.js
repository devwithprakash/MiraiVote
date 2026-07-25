import { getAnonymousId } from "./anonymous.js";
import { api } from "../../../shared/lib/api.js";

export const pollService = {
  async createPoll({ title, mode, expireAt, questions }, token) {
    const { data } = await api.post(
      "/poll",
      {
        title,
        mode,
        expireAt,
        questions,
      },
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return data;
  },

  async fetchAllPolls() {
    const { data } = await api.get("/poll");

    return data;
  },

  async fetchAnalytics(pollId) {
    const { data } = await api.get(`/poll/analytics/${pollId}`);

    return data;
  },

  async fetchPoll(id) {
    const { data } = await api.get(`/poll/${id}`, {
      withCredentials: true,
    });

    return data;
  },
  async fetchPublicPoll(id) {
    const { data } = await api.get(`/poll/public/${id}`, {
      withCredentials: true,
    });

    return data;
  },

  async submitPoll(id, pollInfo) {
    const { data } = await api.post(`/poll/${id}/submit`, {
      pollInfo,
      anonymousId: getAnonymousId(),
    });

    return data;
  },

  async pollResult(shareToken) {
    const { data } = await api.get(`/poll/${shareToken}/result`);

    return data;
  },

  async deletePoll(pollId) {
    const { data } = await api.delete(`/poll/${pollId}`, {
      withCredentials: true,
    });

    return data;
  },
};
