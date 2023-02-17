import express from "express";
import createHttpError from "http-errors";
import TravelUsersModel from "../USER/model.js";
import { createAccessToken } from "../../lib/tools/tools.js";
import passport from "passport";
import { checkUserSchema, triggerBadRequest } from "../USER/validator.js";
import { JWTAuthMiddleware } from "../../lib/auth/JWTAuth.js";

const { NotFound } = createHttpError;

const authRouter = express.Router();

// REGISTER
authRouter.post("/register", checkUserSchema, triggerBadRequest, async (req, res, next) => {
  try {
    const body = req.body;
    body.isRegistered = true;

    const user = new TravelUsersModel(body);

    const payload = { _id: user._id, role: user.role };
    const accessToken = await createAccessToken(payload);

    const newUser = await user.save();
    res.status(201).send({ newUser, accessToken });
  } catch (error) {
    next(error);
  }
});

// LOGIN
authRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log("email:", email, "password:", password);
    const user = await TravelUsersModel.checkCredentials(email, password);
    console.log("user in POST auth:", user);
    if (user) {
      const payload = { _id: user._id, role: user.role };
      const accessToken = await createAccessToken(payload);

      console.log("accessToken in POST auth: ", accessToken);

      res.status(200).send({ accessToken });
    } else {
      next(createHttpError(401, "Credentials are not ok!"));
    }
  } catch (error) {
    console.log(error);
    next(createHttpError(500, "An error occurred while logging in"));
  }
});

export default authRouter;
