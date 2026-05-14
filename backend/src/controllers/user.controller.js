import * as service from "../services/user.service.js";
import ApiError from "../utils/api-error.js";
import ApiResponse from "../utils/api-response.js";

const register = async (req, res) => {
  const result = await service.register(req.body);

  ApiResponse.created(res, "User registered successfully", result);
};

const login = async (req, res) => {
  const result = await service.login(req.body);

  console.log(result);

  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 15 * 60 * 1000,
  });

  ApiResponse.ok(res, "User logged in successfully", result);
};

const logout = async (req, res) => {
  await service.logout(req.userId);

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 15 * 60 * 1000,
  });

  ApiResponse.ok(res, "User logged out successfully");
};

const verifyEmail = async (req, res) => {
  const result = await service.verifyEmail(req.params.token);

  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  ApiResponse.ok(res, "Email verified successfully", result);
};

const forgotPassword = async (req, res) => {
  await service.forgotPassword(req.body.email);

  ApiResponse.noContent(res, "Reset password token sent to email");
};

const resetPassword = async (req, res) => {
  await service.resetPassword(req.params.token, req.body.password);

  ApiResponse.ok(res, "New password set successfully");
};

const refresh = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      message: "Refresh token missing",
    });
  }

  const result = await service.refresh(refreshToken);

  ApiResponse.ok(res, "Token refreshed", result);
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
