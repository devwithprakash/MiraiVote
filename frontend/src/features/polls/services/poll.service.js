import { getAnonymousId } from "./anonymous.js";
import { api } from "../../../shared/lib/api.js";

export const pollService = {
  async createPoll(
    { title, mode, expireAt, questions },
    token,
    isEditMode,
    pollId,
  ) {
    if (!isEditMode) {
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
    } else {
      console.log("Hit the route");
      const { data } = await api.patch(
        `/poll/${pollId}`,
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
    }
  },

  async fetchAllPolls(token) {
    const { data } = await api.get("/poll", {
      headers: { Authorization: `Bearer ${token}` },
    });

    return data;
  },

  async fetchAnalytics(pollId, days, token) {
    const { data } = await api.get(`/poll/${pollId}/analytics?days=${days}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data;
  },

  async fetchPoll(id, token) {
    const { data } = await api.get(`/poll/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data;
  },
  async fetchPublicPoll(slug, token) {
    const { data } = await api.get(`/poll/public/${slug}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data;
  },

  async submitPoll(slug, pollInfo, token) {
    const { data } = await api.post(
      `/poll/${slug}/submit`,
      {
        pollInfo,
        anonymousId: getAnonymousId(),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return data;
  },

  async deletePoll(pollId, token) {
    const { data } = await api.delete(`/poll/${pollId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data;
  },
};
