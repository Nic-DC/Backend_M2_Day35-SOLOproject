import jwt from "jsonwebtoken";
export const createAccessToken = (payload) => {
  console.log("JWT_SECRET: ", process.env.JWT_SECRET);
  return new Promise((resolve, reject) =>
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1 week" }, (err, token) => {
      if (err) reject(err);
      else resolve(token);
    })
  );
};

export const verifyAccessToken = (token) =>
  new Promise((resolve, reject) =>
    jwt.verify(token, process.env.JWT_SECRET, (err, originalPayload) => {
      if (err) reject(err);
      else resolve(originalPayload);
    })
  );
