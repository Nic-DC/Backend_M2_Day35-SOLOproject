import express from "express";
import passport from "passport";

const googleAuthRouter = express.Router();
// Google OAUTH
googleAuthRouter.get("/googleLogin", passport.authenticate("google", { scope: ["profile", "email"] }));
// The purpose of this endpoint is to redirect users to Google Consent Screen

googleAuthRouter.get("/googleRedirect", passport.authenticate("google", { session: false }), async (req, res, next) => {
  console.log(req.user);
  res.redirect(`${process.env.FE_DEV_URL}?accessToken=${req.user.accessToken}`);
});
// The purpose of this endpoint is to bring users back, receiving a response from Google, then execute the callback function, then send a response to the client
export default googleAuthRouter;
