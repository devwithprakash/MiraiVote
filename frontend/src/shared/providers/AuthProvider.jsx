import { useAuth } from "@clerk/clerk-react";
import { useEffect, useRef } from "react";
import { api } from "../lib/api.js";

export function AuthProvider({ children }) {
  const { isLoaded, isSignedIn, getToken } = useAuth();

  const synced = useRef(false);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || synced.current) return;

    const syncUser = async () => {
      try {
        const token = await getToken();

        const res = await api.post(
          "/users/sync",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        synced.current = true;
      } catch (err) {
        console.log(err);
        console.log(err.response?.data);
      }
    };

    syncUser();
  }, [isLoaded, isSignedIn, getToken]);

  return children;
}
