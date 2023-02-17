import express from "express";
import createHttpError from "http-errors";
import TravelUsersModel from "../USER/model.js";
import { createAccessToken } from "../../lib/tools/tools.js";
import passport from "passport";

const { NotFound } = createHttpError;

const authRouter = express.Router();

// REGISTER
authRouter.post("/register", async (req, res, next) => {
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
    const user = await TravelUsersModel.checkCredentials(email, password);

    if (user) {
      const payload = { _id: user._id, role: user.role };
      const accessToken = await createAccessToken(payload);

      res.status(201).send({ accessToken });
    } else {
      next(createHttpError(401, "Credentials are not ok!"));
    }
  } catch (error) {
    next(error);
  }
});

// Google OAUTH
authRouter.get("/googleLogin", passport.authenticate("google", { scope: ["profile", "email"] }));
// The purpose of this endpoint is to redirect users to Google Consent Screen

authRouter.get("/googleRedirect", passport.authenticate("google", { session: false }), async (req, res, next) => {
  console.log(req.user);
  res.redirect(`${process.env.FE_DEV_URL}?accessToken=${req.user.accessToken}`);
});
// The purpose of this endpoint is to bring users back, receiving a response from Google, then execute the callback function, then send a response to the client

export default authRouter;
