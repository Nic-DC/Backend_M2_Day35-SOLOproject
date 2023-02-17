import createHttpError from "http-errors";

export const hostOnlyMiddleware = async (req, res, next) => {
  if (req.user.role === "Host") {
    next();
  } else {
    next(createHttpError(403, "Hosts only endpoint"));
  }
};
