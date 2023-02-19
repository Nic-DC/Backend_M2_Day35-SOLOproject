import mongoose from "mongoose";
const { Schema, model } = mongoose;

const travelerSchema = new Schema(
  {
    // duration: { type: Number, required: false },
    // guests: { type: Number, required: false },

    //  user: { type: Schema.Types.ObjectId, ref: "TravelUser" },
    user: { type: String, required: false },
    host: { type: [Schema.Types.ObjectId], ref: "TravelUser" },
    accommodation: { type: [Schema.Types.ObjectId], ref: "Accommodation" },
  },
  {
    timestamps: true,
  }
);

export default model("Booking", travelerSchema);
