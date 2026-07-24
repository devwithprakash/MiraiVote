import { api } from "../../../shared/lib/api";
import { useAuth } from "@clerk/clerk-react";

const { getToken } = await useAuth();

export const userService = {
  async syncUser() {
    const token = await getToken();

    const { data } = await api.post(
      "/users/sync",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return data;
  },
};
