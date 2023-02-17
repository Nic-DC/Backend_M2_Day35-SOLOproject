import server from "../src/server";
import supertest from "supertest";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import TravelUsersModel from "../src/api/USER/model.js";

dotenv.config();

const client = supertest(server);

server.get("/users", (req, res) => {
  res.status(200).json({ message: "Users endpoint is working!" });
});

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

describe(`M5-Day95-SOLO:`, () => {
  // Testing the DB connection
  it("should return 200 OK", async () => {
    const response = await client.get("/users");
    expect(response.status).toBe(200);
  });

  // Test #2
  it("should return 201 and a valid JWT token with a valid request", async () => {
    const response = await client
      .post("/auth/register")
      .send({
        email: "jest2@test.com",
        password: "1$}{blalblabla",
        role: "Guest",
      })
      .expect(201);
    console.log("response.body", response.body);

    expect(response.body.accessToken).toBeDefined();

    const payload = jwt.verify(response.body.accessToken, process.env.JWT_SECRET);
    console.log("payload", payload);

    expect(response.body.newUser.email).toEqual("jest2@test.com");
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
});
