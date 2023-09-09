const asyncHandler = require("express-async-handler");
const { Test } = require("../config/db");

const isOwner = asyncHandler(async (req, res, next) => {
  const { id } = req.params; // test id
  const { _id } = req.user;
  const findTest = await Test.findById(id);

  if (!findTest.owner.equals(_id))
    throw new Error("Only owner can modify test assignment.");
  else {
    next();
  }
});

module.exports = { isOwner };
