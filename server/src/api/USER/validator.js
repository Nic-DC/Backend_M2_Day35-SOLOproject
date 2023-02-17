import { checkSchema, validationResult } from "express-validator";
import createHttpError from "http-errors";

const userSchema = {
  email: {
    in: ["body"],
    isEmail: {
      errorMessage: "email is a mandatory field",
    },
  },
  password: {
    in: ["body"],
    isString: {
      errorMessage: "password is a mandatory field",
    },
  },
};

export const checkUserSchema = checkSchema(userSchema);

export const triggerBadRequest = (req, res, next) => {
  const errorList = validationResult(req);

  if (!errorList.isEmpty()) {
    next(createHttpError(400, "Error during post validation", { errors: errorList.array() }));
    // next(createHttpError(400, "Error during post validation"));
  } else {
    next();
  }
};
