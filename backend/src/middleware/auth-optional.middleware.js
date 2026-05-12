import { User } from "../models/user.model.js";
import ApiError from "../utils/api-error.js";
import { verifyAccessToken } from "../utils/jwt.utils.js";

export const authOptional = async (req, res, next) => {
  let authHeader = req.headers.authorization;

  if (!authHeader.startsWith("Bearer")) {
    return next();
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    throw ApiError.unauthorized("Invalid or expired token");
  }

  const decoded = verifyAccessToken(token);

  const user = await User.findById(decoded.id);

  if (!user) {
    throw ApiError.unauthorized("User no longer exist");
  }

  req.userId = decoded.id;

  next();
};
