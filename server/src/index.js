import listEndpoints from "express-list-endpoints";
import mongoose from "mongoose";
import server from "./server.js";

const port = process.env.PORT || 3008;

mongoose.connect(process.env.MONGO_URL);

mongoose.connection.on("connected", () => {
  console.log("Successfully connected to Mongo!");
  server.listen(port, () => {
    console.table(listEndpoints(server));
    console.log(`Server is running on port ${port}`);
  });
});
