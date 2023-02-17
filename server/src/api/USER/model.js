import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const { Schema, model } = mongoose;

const travelUsersSchema = new Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: false },
    role: { type: String, enum: ["Host", "Guest"], default: "Guest" },

    isRegistered: { type: Boolean, enum: [false, true], default: false },
    googleID: { type: String, required: false },
    picture: { type: String, required: false },
  },
  {
    timestamps: true, // this option automatically handles createdAt and updatedAt fields
  }
);

/* -------------------------------------------------------------------------  
  used for the POST fetch to encrypt the password ONLY when the user is created
  OR
  when we want to change the password 
---------------------------------------------------------------------------*/
travelUsersSchema.pre("save", async function (next) {
  // BEFORE saving the user in db, executes this custom function automagically
  // Here I am not using arrow functions as I normally do because of "this" keyword
  // (it would be undefined in case of arrow function, it is the current user in the case of a normal function)

  const currentUser = this;
  console.log("this: ", this);

  if (currentUser.isModified("password")) {
    // only if the user is modifying the pw (or if the user is being created) I would like to spend some precious CPU cycles on hashing the pw
    const plainPW = currentUser.password;

    const hash = await bcrypt.hash(plainPW, 11);
    currentUser.password = hash;
  }
  // When we are done with this function --> next
  next();
});

/* -------------------------------------------------------------------------  
  used for the GET fetch in order to not show the password and other info 
---------------------------------------------------------------------------*/
travelUsersSchema.methods.toJSON = function () {
  // This .toJSON method is used EVERY TIME Express does a res.send(user/s)
  // This does mean that we could override the default behaviour of this method to remove the passwords
  // (and other unnecessary things as well) and then return the users

  const userDocument = this;
  console.log("this in methods.toJSON", this);
  const user = userDocument.toObject();

  delete user.password;
  delete user.createdAt;
  delete user.updatedAt;
  delete user.__v;
  return user;
};

/* -------------------------------------------------------------------------  
  create a custom middleware: "checkCredentials" that we'll use to 
---------------------------------------------------------------------------*/
travelUsersSchema.static("checkCredentials", async function (email, password) {
  const user = await this.findOne({ email });

  if (user) {
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      return user;
    } else {
      return null;
    }
  } else {
    return null;
  }
});

export default model("TravelUser", travelUsersSchema); // this model is now binded to the "users" collection, if the collection does not exist, mongoose will create it automagically
