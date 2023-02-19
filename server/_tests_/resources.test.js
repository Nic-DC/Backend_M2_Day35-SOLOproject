import server from "../src/server";
import supertest from "supertest";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createAccessToken } from "../src/lib/tools/tools.js";
import TravelUsersModel from "../src/api/USER/model.js";
import AccommodationsModel from "../src/api/ACCOMMODATION/model.js";

dotenv.config();

const client = supertest(server);

server.get("/users", (req, res) => {
  res.status(200).json({ message: "Users endpoint is working!" });
});

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URL_TEST);

  console.log("MONGO_URL_TEST: ", process.env.MONGO_URL_TEST);

  // const hashedPassword = await bcrypt.hash("1$}{blalblabla", 12);

  // const user = new TravelUsersModel({
  //   email: "jest@test.com",
  //   password: hashedPassword,
  //   role: "Guest",
  // });
  // await user.save();

  // Generate access token for testing
  const payload = {
    _id: "63f0b393d1724423124ac292",
    role: "Guest",
  };
});

afterAll(async () => {
  await TravelUsersModel.deleteMany();
  // await mongoose.connection.close();
});

describe(`Accommodation tests: `, () => {
  // Testing the DB connection
  // it("should return 200 OK", async () => {
  //   const response = await client.get("/users");
  //   expect(response.status).toBe(200);
  // });

  // GET all accommodations made by host OR all accommodations for a traveler
  it("Should return an array of accommodations", async () => {
    const payload = {
      _id: "63f0b393d1724423124ac292",
      role: "Guest",
    };
    // console.log("JWT _ SECRET: ", process.env.JWT_SECRET);
    const accessToken = await createAccessToken(payload);
    // console.log("accessToken - GET accommodations: ", accessToken);
    const response = await client.get("/accommodations").set("Authorization", `Bearer ${accessToken}`);
    // console.log("response.body - GET accommodations: ", response.body);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.any(Array));
  });
});

describe("GET /accommodations/:id", () => {
  it("should return the accommodation if it exists", async () => {
    // create a test accommodation
    const user = new TravelUsersModel({
      email: "user@test.com",
      role: "Guest",
    });
    await user.save();

    const accommodation = new AccommodationsModel({
      name: "Test Accommodation",
      // host: user._id,
      host: "63f0b393d1724423124ac294",
      description: "Test Description",
      maxGuests: 2,
      city: "X",
    });
    await accommodation.save();

    // generate an access token for the test user
    const payload = {
      _id: "63f0b393d1724423124ac294",
      role: "Guest",
    };
    const accessToken = await createAccessToken(payload);

    // make a request to the endpoint with the accommodation id
    const response = await client
      .get(`/accommodations/${accommodation._id}`)
      .set("Authorization", `Bearer ${accessToken}`);

    // check that the response contains the expected accommodation data
    expect(response.status).toBe(200);

    expect(response.body.accommodation).toMatchObject({
      name: "Test Accommodation",
      // host: user._id,
      host: "63f0b393d1724423124ac294",
      description: "Test Description",
      maxGuests: 2,
      city: "X",
    });
  });

  it("should return a 404 error if the accommodation doesn't exist", async () => {
    // generate an access token for the test user
    const payload = {
      _id: "63f0b393d1724423124ac293",
      role: "Guest",
    };
    const accessToken = await createAccessToken(payload);

    // make a request to the endpoint with a non-existent accommodation id
    const response = await client.get("/accommodations/123456789012").set("Authorization", `Bearer ${accessToken}`);

    // check that the response is a 404 error
    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Accommodation with id: 123456789012 not in our db");
  });

  it("should return the user profile for the authenticated user", async () => {
    // generate an access token for the test user
    const payload = {
      _id: "63f0b393d1724423124ac293",
      role: "Guest",
    };
    const accessToken = await createAccessToken(payload);

    // create a user document with the matching _id
    const user = new TravelUsersModel({
      _id: "63f0b393d1724423124ac293",
      role: "Guest",
      email: "testuser@example.com",
    });
    await user.save();

    // make a request to the endpoint with the access token
    const response = await client.get("/users/me").set("Authorization", `Bearer ${accessToken}`);

    // check that the response contains the expected user data
    expect(response.status).toBe(200);
    console.log("response.body for GET users/me: ", response.body);
    expect(response.body.myUserProfile).toMatchObject({
      _id: "63f0b393d1724423124ac293",
      role: "Guest",
      email: "testuser@example.com",
    });
  });
});
