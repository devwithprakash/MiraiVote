import { api } from "./api.js";

export const authService = {
  async register({ name, email, password }) {
    const { data } = await api.post("/users/register", {
      name,
      email,
      password,
    });
    console.log(data);
    return data;
  },

  async login({ email, password }) {
    const { data } = await api.post(
      "/users/login",
      {
        email,
        password,
      },
      { withCredentials: true },
    );
    console.log(data);
    return data;
  },

  async logout(token) {
    const data = await api.post(
      "/users/logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      },
    );

    return data;
  },

  async verifyEmail(token) {
    const { data } = await api.post(
      `/users/verify-email/${token}`,
      {},
      { withCredentials: true },
    );
    console.log(data);
    return data;
  },
  async forgotPassword(email) {
    const { data } = await api.post(`/users/forgot-password`, { email });

    return data;
  },
  async resetPassword(token, password) {
    const { data } = await api.post(`/users/reset-password/${token}`, {
      password,
    });

    return data;
  },

  async refresh() {
    const { data } = await api.get("/users/refresh", { withCredentials: true });

    console.log(data);
    return data;
  },
};
