import { getAnonymousId } from "./anonymous.js";
import { api } from "./api.js";

export const pollService = {
  async createPoll({ title, mode, expireAt, questions }, token) {
    const { data } = await api.post(
      "/polls",
      {
        title,
        mode,
        expireAt,
        questions,
      },
      { headers: { Authorization: `Bearer ${token}` }, withCredentials: true },
    );
    console.log(data);
    return data;
  },

  async fetchAllPolls(token) {
    const { data } = await api.get("/polls", {
      headers: { Authorization: `Bearer ${token}` },
    });

    return data;
  },

  async fetchAnalytics(token, pollId) {
    const { data } = await api.get(`/polls/analytics/${pollId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return data
  },

  async fetchPoll(id, token) {
    const { data } = await api.get(`/polls/${id}`, {
      withCredentials: true,
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log(data);
    return data;
  },
  async fetchPublicPoll(id, token) {
    const { data } = await api.get(`/polls/public/${id}`, {
      withCredentials: true,
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log(data);
    return data;
  },

  async submitPoll(id, pollInfo, token) {
    const { data } = await api.post(
      `/polls/${id}/submit`,
      {
        pollInfo,
        anonymousId: getAnonymousId(),
      },
      { headers: { Authorization: `Bearer ${token}` } },
    );

    console.log(data);
    return data;
  },

  async pollResult() {
    const { data } = await api.get(`/poll/${token}/result`);

    console.log(data);
    return data;
  },
};
