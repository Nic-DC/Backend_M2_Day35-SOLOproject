import express from "express";
import createHttpError from "http-errors";
import TravelUsersModel from "../USER/model.js";
import AccommodationsModel from "./model.js";
import BookingsModel from "./bookingModel.js";
import { JWTAuthMiddleware } from "../../lib/auth/JWTAuth.js";
import { hostOnlyMiddleware } from "../../lib/auth/hostOnly.js";
import { hallPassMiddleware } from "../../lib/auth/hallPassAuth.js";
import { createAccessToken } from "../../lib/tools/tools.js";
import passport from "passport";
import mongoose from "mongoose";

// Bad Request (400)
// Unauthorized (401)
// Forbidden (403)
// Not Found (404)
const { BadRequest, Unauthorized, Forbidden, NotFound } = createHttpError;

const accommodationRouter = express.Router();

// POST - accommodation
accommodationRouter.route("/").post(JWTAuthMiddleware, hostOnlyMiddleware, async (req, res, next) => {
  try {
    const { name, description, maxGuests, city } = req.body;

    if (!name || !description || !maxGuests || !city) {
      return res.status(400).send({ error: "Missing required fields" });
    }

    // if (!mongoose.Types.ObjectId.isValid(host)) {
    //   return res.status(400).send({ error: "Invalid host id" });
    // }

    // const travelUser = await TravelUsersModel.findById(host);
    // if (!travelUser) {
    //   return res.status(400).send({ error: "Host not found" });
    // }
    // {

    const accommodation = new AccommodationsModel({
      name,
      host: req.user._id,
      description,
      maxGuests,
      city,
    });

    const newAccommodation = await accommodation.save();

    const booking = new BookingsModel({
      user: name,
      host: req.user._id,
      accommodation: newAccommodation._id,
    });
    await booking.save();

    // console.log("booking: ", booking);
    res.send({ newAccommodation });
  } catch (error) {
    console.log(`POST accommodation - ERROR: ${error}`);
    next(error);
  }
});
// GET - all accommodations that a HOST made or all the accommodations a travel has
accommodationRouter.route("/").get(JWTAuthMiddleware, hallPassMiddleware, async (req, res, next) => {
  try {
    const { _id, role } = req.user;
    let accommodations = [];

    if (role === "Host") {
      accommodations = await AccommodationsModel.find({ host: _id });
    } else if (role === "Guest") {
      accommodations = await AccommodationsModel.find({ role: "Guest" });
    }
    // const accommodations = await AccommodationsModel.find({ host: req.user._id });
    // console.log("accommodations", accommodations);
    // if (accommodations.length === 0) {
    //   res.send({ error: "There are no accommodations made" });
    // }

    res.send(accommodations);
  } catch (error) {
    console.log("/ - GET - ERROR: ", error);
    next(error);
  }
});

// GET - specific accommodation [HOSTS & GUESTS]
accommodationRouter.route("/:id").get(JWTAuthMiddleware, hallPassMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    const accommodation = await AccommodationsModel.findById(id).populate("host");

    if (accommodation) {
      res.send({ accommodation });
    } else {
      next(NotFound(`Accommodation with id: ${id} not in our db`));
    }
  } catch (error) {
    console.log("GET / - ERROR: ", error);
    next(error);
  }
});

// EDIT - specific accommodation [only the HOST who made it / only the guest who has it]
accommodationRouter.put("/:id", JWTAuthMiddleware, hallPassMiddleware, async (req, res, next) => {
  try {
    let accommodation = await AccommodationsModel.findById(req.params.id);
    if (!accommodation) {
      next(NotFound(`Accommodation with id: ${id} not found`));
    }

    const currentUser = req.user;

    const host = await TravelUsersModel.findById(accommodation.host);

    if (currentUser._id === host._id.toString() || currentUser.role === "Guest") {
      Object.assign(accommodation, req.body);

      await accommodation.save();

      res.send({ message: "Accommodation updated successfully", editedAccommodation: accommodation });
    } else {
      next(Unauthorized(`You are not authorized to edit this accommodation`));
    }
  } catch (error) {
    console.log("PUT /:id - ERROR: ", error);
    next(error);
  }
});

accommodationRouter.route("/:id").delete(JWTAuthMiddleware, hallPassMiddleware, async (req, res, next) => {
  try {
    const accommodation = await AccommodationsModel.findById(req.params.id);

    if (!accommodation) {
      next(NotFound(`Accommodation with id: ${req.params.id} not found`));
    }

    const currentUser = req.user;
    const host = await TravelUsersModel.findById(accommodation.host);

    if (currentUser._id === host._id.toString() || currentUser.role === "Guest") {
      await accommodation.delete();
      res.send({ success: `Accommodation with id: ${req.params.id} deleted successfully` });
    } else {
      next(NotFound(`Accommodation with id: ${req.params.id} deleted successfully`));
    }
  } catch (error) {
    console.log("DELETE /:id - ERROR: ", error);
    next(error);
  }
});

export default accommodationRouter;
