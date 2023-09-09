const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const { User } = require("../config/db");

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    try {
      if (token) {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const findUser = await User.findById(decodedToken?.id);
        req.user = findUser;
        next();
      }
    } catch (error) {
      throw new Error("Not Authorized, please login again.");
    }
  } else throw new Error("No token attached to the header.");
});

// const isAdmin = asyncHandler(async (req, res, next) => {
//   const { email } = req.user;
//   const findAdmin = await User.findOne({ email });

//   if (findAdmin.role !== "admin") throw new Error("You are not admin.");
//   else next();
// });

module.exports = { authMiddleware };
