import createHttpError from "http-errors";

export const guestsOnlyMiddleware = async (req, res, next) => {
  if (req.user.role === "Guest") {
    next();
  } else {
    next(createHttpError(403, "Guest only endpoint"));
  }
};
