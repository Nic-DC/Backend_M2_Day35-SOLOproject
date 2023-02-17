import mongoose from "mongoose";

const { Schema, model } = mongoose;

const accommodationSchema = new Schema(
  {
    name: { type: String, required: true },
    host: { type: Schema.Types.ObjectId, ref: "TravelUser" },
    description: { type: String, required: true },
    maxGuests: { type: Number, required: true },
    city: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

accommodationSchema.methods.toJSON = function () {
  const accomodationDocument = this;
  console.log("this in methods.toJSON: ", this);
  const accomodation = accomodationDocument.toObject();

  delete accomodation.password;
  delete accomodation.createdAt;
  delete accomodation.updatedAt;
  delete accomodation.__v;
  return accomodation;
};

export default model("Accomodation", accommodationSchema);
