import express from "express";
import createHttpError from "http-errors";
import TravelUsersModel from "./model.js";
import AccommodationsModel from "../ACCOMMODATION/model.js";
import { JWTAuthMiddleware } from "../../lib/auth/JWTAuth.js";
import { hostOnlyMiddleware } from "../../lib/auth/hostOnly.js";
import { createAccessToken } from "../../lib/tools/tools.js";
import passport from "passport";
import { checkUserSchema, triggerBadRequest } from "./validator.js";

const { NotFound } = createHttpError;

const usersRouter = express.Router();

// GET - your own user profile
usersRouter.route("/me").get(JWTAuthMiddleware, async (req, res, next) => {
  try {
    const { _id } = req.user;

    const myUserProfile = await TravelUsersModel.findById(_id);
    if (myUserProfile) {
      res.send({ myUserProfile });
    } else {
      next(NotFound(`The user with id: ${_id} is not in our database`));
    }
  } catch (error) {
    console.log(`/me - GET user ERROR: ${error}`);
    next(error);
  }
});

// GET - all accommodations created by a certain HOST
usersRouter.route("/me/accommodations").get(JWTAuthMiddleware, hostOnlyMiddleware, async (req, res, next) => {
  try {
    const hostID = req.user._id;

    const accommodations = await AccommodationsModel.find({ host: hostID });

    if (accommodations.length > 0) {
      res.send({ accommodations });
    } else {
      next(NotFound(`You have not made any accommodations yet`));
    }
  } catch (error) {
    console.log("GET /me/accommodations - ERROR: ", error);
    next(error);
  }
});

export default usersRouter;
