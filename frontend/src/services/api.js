import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export const api = axios.create({
  baseURL: BASE_URL,

  headers: {
    "Content-Type": "application/json",
  },
});

// api.interceptors.request.use(
//   (config) => {
//     const token = tokenStore.getAccess();

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
//   },

//   (error) => {
//     return Promise.reject(error);
//   },
// );

// api.interceptors.response.use(
//   (response) => response,

//   async (error) => {
//     if (error.response?.status === 401) {
//       // token expired
//       // logout user
//       // redirect login
//       // refresh token
//     }

//     return Promise.reject(error);
//   },
// );
