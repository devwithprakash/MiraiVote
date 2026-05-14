import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/auth.service";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);


  // run ONLY ONCE on app load
  useEffect(() => {


    const getAccessToken = async () => {
      if (!accessToken) {
        setLoading(true);
        try {
          const res = await authService.refresh();
          setAccessToken(res.data.accessToken);
        } catch (err) {
          setAccessToken(null);
        } finally {
          setLoading(false);
        }
      }
    };

    getAccessToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        setAccessToken,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
