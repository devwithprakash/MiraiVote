import { User } from "../models/user.model.js";
import ApiError from "../utils/api-error.js";
import { verifyAccessToken } from "../utils/jwt.utils.js";

export const authMiddleware = async (req, res, next) => {
  let token = "";


  if (req.headers.authorization.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  
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
