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
