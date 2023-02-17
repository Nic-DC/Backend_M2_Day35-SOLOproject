import createHttpError from "http-errors";

export const hallPassMiddleware = async (req, res, next) => {
  if (req.user.role === "Guest" || req.user.role === "Host") {
    next();
  } else {
    next(createHttpError(403, "Host / Guest only endpoint"));
  }
};
