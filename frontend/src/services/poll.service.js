import { api } from "./api.js";

export const pollService = {
  async createPoll({ title, mode, expireAt, questions }) {
    const { data } = await api.post("/poll", {
      title,
      mode,
      expireAt,
      questions,
    });
    console.log(data);
    return data;
  },
  async fetchPoll() {
    const { data } = await api.get(`/poll/${token}`);

    console.log(data);
    return data;
  },

  async submitPoll(pollInfo) {
    const { data } = await api.post(`/poll/${token}/submit`, {
      pollInfo,
    });

    console.log(data);
    return data;
  },

  async pollResult() {
    const { data } = await api.get(`/poll/${token}/result`);

    console.log(data);
    return data;
  },
};
