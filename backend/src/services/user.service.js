import {
  sendResetPasswordEmail,
  sendVerificationEmail,
} from "../config/email.js";
import { User } from "../models/user.model.js";
import ApiError from "../utils/api-error.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import {
  generateResetToken,
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "../utils/jwt.utils.js";

const hashToken = (rawToken) => {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
};

const register = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw ApiError.conflict("Email already registered");
  }

  const { rawToken, hashed } = generateResetToken();

  const user = await User.create({
    name,
    email,
    password,
    verificationToken: hashed,
    verificationTokenExpires: Date.now() + 15 * 60 * 1000,
  });

  try {
    await sendVerificationEmail(email, rawToken);
  } catch (error) {
    console.error("Failed to send verification token", error.message);
  }

  const userObj = user.toObject();

  delete userObj.password;
  delete userObj.verificationToken;

  return userObj;
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  const comparePassword = bcrypt.compare(password, user.password);

  if (!comparePassword) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  if (!user.isVerified) {
    throw ApiError.forbidden("Please verify email before login");
  }

  const accessToken = generateAccessToken({ id: user._id });
  const refreshToken = generateRefreshToken({ id: user._id });

  user.refreshToken = hashToken(refreshToken);

  await user.save();

  const userObj = user.toObject();

  delete userObj.password;
  delete userObj.refreshToken;

  return { user: userObj, accessToken, refreshToken };
};

const logout = async (userId) => {
  await User.findByIdAndUpdate(userId, { refreshToken: null });
};

const verifyEmail = async (token) => {
  const hashedToken = hashToken(token);

  
  const user = await User.findOne({
    verificationToken: hashedToken,
  }).select("+isVerified +verificationToken +verificationTokenExpires");
  
  if (!user) {
    throw ApiError.notfound("User no longer exist");
  }
  
  if (Date.now() > user.verificationTokenExpires) {
    throw ApiError.badRequest("Verification token has expired");
  }
  
  const accessToken = generateAccessToken({ id: user._id });
  const refreshToken = generateRefreshToken({ id: user._id });
  
  console.log("inside service")
  user.refreshToken = hashToken(refreshToken);

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpires = undefined;

  await user.save();

  const userObj = user.toObject();

  delete userObj.password;
  delete userObj.refreshToken;

  return { user: userObj, accessToken, refreshToken };
};

const forgotPassword = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw ApiError.notfound("User not found");
  }

  if (!user.isVerified) {
    throw ApiError.badRequest("User email is not verified");
  }

  const { rawToken, hashed } = generateResetToken();

  user.resetPasswordToken = hashed;
  user.resetPasswordTokenExpires = Date.now() + 15 * 60 * 1000;

  await user.save();

  try {
    await sendResetPasswordEmail(email, rawToken);
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpires = undefined;

    await user.save();

    console.error("Failed to send reset password email", error.message);

    throw ApiError.internal("Failed to send reset password email");
  }
};

const resetPassword = async (token, password) => {
  const hashedToken = hashToken(token);

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordTokenExpires: {
      $gt: Date.now(),
    },
  });

  if (!user) {
    throw ApiError.badRequest("Invalid or expired token");
  }

  if (!user.isVerified) {
    throw ApiError.badRequest("User email is not verified");
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordTokenExpires = undefined;

  await user.save();
};

const refresh = async (token) => {
  let payload;

  try {
    payload = verifyRefreshToken(token);
  } catch (err) {
    throw ApiError.unauthorized("Invalid or expired token");
  }

  if (!payload?.id) {
    throw ApiError.unauthorized("Invalid token payload");
  }

  const hashedToken = hashToken(token);

  const user = await User.findOne({
    _id: payload.id,
    refreshToken: hashedToken,
  });

  if (!user) {
    throw ApiError.unauthorized("Invalid refresh session");
  }

  const accessToken = generateAccessToken({ id: user._id });

  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.refreshToken;

  return { user: userObj, accessToken };
};

export {
  register,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  refresh,
};
