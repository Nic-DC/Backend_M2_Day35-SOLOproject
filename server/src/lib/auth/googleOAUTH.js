import GoogleStrategy from "passport-google-oauth20";
import TravelUsersModel from "../../api/USER/model.js";
import { createAccessToken } from "../tools/tools.js";
import passport from "passport";

// const { GOOGLE_OUTH_CLIENT_ID, GOOGLE_OUTH_SECRET, BE_URL } = process.env;
// console.log("GOOGLE_OUTH_CLIENT_ID", GOOGLE_OUTH_CLIENT_ID);

const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: `${process.env.BE_URL}/users/googleRedirect`, // this needs to match EXACTLY with the redirect URL you have configured on Google
  },
  async (_, __, profile, passportNext) => {
    console.log("googleStrategy PROFILE: ", profile);
    // This function is executed when Google sends us a successfull response
    // Here we are going to receive some informations about the user from Google (scopes --> profile, email)
    try {
      const { picture, email, given_name, family_name } = profile._json;

      // 1. Check if the user is already in db
      const user = await TravelUsersModel.findOne({ email });

      if (user) {
        console.log("user", user);
        // 2. If he is there --> generate an accessToken (optionally a refresh token)
        const accessToken = await createAccessToken({ _id: user._id, role: user.role });

        // 2.1 Then we can go next (to /googleRedirect route handler function), passing the token
        passportNext(null, { accessToken });
      } else {
        const newUser = new TravelUsersModel({
          firstName: given_name,
          lastName: family_name,
          username: given_name + family_name,
          email: email,
          picture: picture,
          googleID: profile.id,
        });
        console.log("newUser ", newUser);

        const createdUser = await newUser.save();
        console.log("createdUser ", createdUser);

        // 3.1 Then generate an accessToken (optionally a refresh token)
        const accessToken = await createAccessToken({ _id: createdUser._id, role: createdUser.role });

        // 3.2 Then we can go next (to /googleRedirect route handler function), passing the token
        passportNext(null, { accessToken });
      }
    } catch (error) {
      console.log("googleStrategy ERROR: ", error);
      passportNext(error);
    }
  }
);
export default googleStrategy;
