import { createBrowserRouter } from "react-router-dom";

import Home from "../pages/Home";
import Dashboard from "../pages/poll/Dashboard";
import Analytics from "../pages/poll/Analytics";
import CreatePoll from "../pages/poll/CreatePoll";
import PollDetail from "../pages/poll/PollDetail";

import { LoginPage } from "../pages/auth/Login";
import { RegisterPage } from "../pages/auth/Register";
import VerifyEmail from "../pages/auth/VerifyEmail";
import VerifyNotice from "../pages/auth/VerifyNotice";

import { Layout } from "../components/Layout";
import ProtectedRoute from "./ProtectedRoute";
import {
  ForgotPassword,
} from "../pages/auth/ForgotPassword";
import NewPasswordPage from "../pages/auth/NewPassword";
import ForgotPasswordNotice from "../pages/auth/ForgotPasswordNotice";
import PublicPollPage from "../pages/poll/PublicPollPage";

const ProtectedLayout = () => (
  <ProtectedRoute>
    <Layout />
  </ProtectedRoute>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/verify-email/:token",
    element: <VerifyEmail />,
  },
  {
    path: "/verify-notice",
    element: <VerifyNotice />,
  },
  {
    path: "/forgot-password-notice",
    element: <ForgotPasswordNotice />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password/:token",
    element: <NewPasswordPage />,
  },
  {
    path: "/public/:pollId",
    element: <PublicPollPage />,
  },

  // protected routes
  {
    element: <ProtectedLayout />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/analytics",
        element: <Analytics />,
      },
      {
        path: "/create",
        element: <CreatePoll />,
      },
      {
        path: "/poll/:id",
        element: <PollDetail />,
      },
    ],
  },
]);
