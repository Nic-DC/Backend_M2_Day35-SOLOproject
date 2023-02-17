import server from "../src/server";
import supertest from "supertest";
import dotenv from "dotenv";
import mongoose from "mongoose";
import TravelUsersModel from "../src/api/USER/model.js";

dotenv.config();

const client = supertest(server);

server.get("/users", (req, res) => {
  res.status(200).json({ message: "Users endpoint is working!" });
});

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URL_TEST);

  console.log("MONGO_URL_TEST: ", process.env.MONGO_URL_TEST);

  const user = new TravelUsersModel({ email: "jest@test.com", password: "1$}{blalblabla", role: "Guest" });
  await user.save();
});

afterAll(async () => {
  await TravelUsersModel.deleteMany();
  await mongoose.connection.close();
});

describe(`M5-Day95-SOLO:`, () => {
  it("should return 200 OK", async () => {
    const response = await client.get("/users");
    expect(response.status).toBe(200);
  });
});
