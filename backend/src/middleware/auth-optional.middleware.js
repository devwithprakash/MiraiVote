import { User } from "../models/user.model.js";
import ApiError from "../utils/api-error.js";
import { verifyAccessToken } from "../utils/jwt.utils.js";

export const authOptional = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // no token → continue as anonymous
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next();
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return next();
    }

    const decoded = verifyAccessToken(token);

    if (!decoded) {
      return next();
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      return next();
    }

    req.userId = user._id;

    next();
  } catch (error) {
    next();
  }
};
