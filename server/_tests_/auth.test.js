import server from "../src/server";
import supertest from "supertest";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createAccessToken } from "../src/lib/tools/tools.js";
import TravelUsersModel from "../src/api/USER/model.js";

dotenv.config();

const client = supertest(server);

const registeredUser = {
  email: "Halle56@yahoo.com",
  password: "123",
  role: "Guest",
};

const invalidUser = {
  email: "invalidUser@test.com",
  password: "12KLO$*EW",
  role: "Guest",
};

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URL_TEST);

  console.log("MONGO_URL_TEST: ", process.env.MONGO_URL_TEST);

  const hashedPassword = await bcrypt.hash("1$}{blalblabla", 12);

  const user = new TravelUsersModel({
    email: "jest@test.com",
    password: hashedPassword,
    role: "Guest",
  });
  await user.save();
});

afterAll(async () => {
  await TravelUsersModel.deleteMany();
  await mongoose.connection.close();
});

describe(`Authentication tests: `, () => {
  // Testing the env variables
  it("Should test that the env vars are set correctly", () => {
    expect(process.env.MONGO_URL_TEST).toBeDefined();
  });

  // Test #2
  it("should return 201 and a valid JWT token with a valid request", async () => {
    const response = await client.post("/auth/register").send(registeredUser).expect(201);

    expect(response.body.accessToken).toBeDefined();

    const payload = jwt.verify(response.body.accessToken, process.env.JWT_SECRET);

    expect(response.body.newUser.email).toEqual("Halle56@yahoo.com");
    expect(response.body.newUser.role).toEqual("Guest");
  });

  // Test #3
  it("should return 400 with an invalid request", async () => {
    const response = await client
      .post("/auth/register")
      .send({
        email: "invalid_email",
        password: "1$}{blalblabla",
        role: "Guest",
      })
      .expect(400);

    expect(response.body.accessToken).toBeUndefined();
  });

  // Test #4
  it("with a valid request must return 200 and must return a valid JWT token", async () => {
    const response = await client.post("/auth/login").send(registeredUser).expect(200);

    const payload = jwt.verify(response.body.accessToken, process.env.JWT_SECRET);

    expect(payload).toBeDefined();
  });

  // Test #5
  it("with a NOT valid request must return 401", async () => {
    const response = await client.post("/auth/login").send(invalidUser).expect(401);
  });
});
