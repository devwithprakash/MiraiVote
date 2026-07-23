import { createBrowserRouter } from "react-router-dom";

import Home from "../features/landing/Home";
import Dashboard from "../features/polls/pages/Dashboard";
import Analytics from "../features/polls/pages/Analytics";
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
