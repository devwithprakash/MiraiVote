import { createBrowserRouter } from "react-router-dom";

import Home from "../features/landing/Home";
import Dashboard from "../features/polls/pages/Dashboard";
import PollsList from "../features/polls/pages/PollsList";
import PollAnalytics from "../features/polls/pages/PollAnalytics";
import CreatePoll from "../features/polls/pages/CreatePoll";
import PollDetail from "../features/polls/pages/PollDetail";
import PublicPollPage from "../features/polls/pages/PublicPollPage";

import { ProtectedLayout } from "./ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/public/:slug",
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
        path: "/polls",
        element: <PollsList />,
      },
      {
        path: "/polls/:id/analytics",
        element: <PollAnalytics />,
      },
      {
        path: "/polls/:id/edit",
        element: <CreatePoll />,
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
