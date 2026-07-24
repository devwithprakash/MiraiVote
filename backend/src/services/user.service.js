import { User } from "../models/user.model.js";
import ApiError from "../utils/api-error.js";
import { createClerkClient } from "@clerk/backend";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

export const syncUser = async ({ clerkUserId }) => {
  try {
    const existingUser = await User.findOne({ clerkUserId });

    if (existingUser) {
      return existingUser;
    }
  } catch (error) {
    console.log(error);
  }

  const clerkUser = await clerkClient.users.getUser(clerkUserId);

  const primaryEmail =
    clerkUser.emailAddresses.find(
      (email) => email.id === clerkUser.primaryEmailAddressId,
    ).emailAddress ?? null;

  if (!primaryEmail) {
    throw ApiError.badRequest(`No primary email found for user ${clerkUserId}`);
  }

  const fullName =
    [clerkUser.firstName, clerkUser.lastName]
      .filter(Boolean)
      .join(" ")
      .trim() || "Unknown";

  const newUser = await User.create({
    clerkUserId,
    fullName,
    email: primaryEmail,
    imageUrl: clerkUser.imageUrl,
  });

  if (!newUser) {
    throw ApiError.badRequest("Failed to create new user");
  }

  return newUser;
};
