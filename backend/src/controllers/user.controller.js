import { getAuth } from "@clerk/express";
import * as userService from "../services/user.service.js";
import ApiResponse from "../utils/api-response.js";

export const syncUser = async (req, res) => {
  const { userId } = getAuth(req);

  const result = await userService.syncUser({ clerkUserId: userId });

  ApiResponse.ok(res, "User synced successfully", result);
};
