const { generateToken } = require("../config/jwt");
const { generateRefreshToken } = require("../config/refreshToken");
const { User, Test, Question } = require("../config/db");

const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { tryCatch } = require("../utils/tryCatch");

const createUser = asyncHandler(
  tryCatch(async (req, res) => {
    const { email } = req.body;
    const findUser = await User.findOne({ email: email });

    if (!findUser) {
      const newUser = await User.create(req.body);
      res.json(newUser);
    } else throw new Error("User with such email already exists");
  })
);

const loginUser = asyncHandler(
  tryCatch(async (req, res) => {
    const { email, password } = req.body;
    const findUser = await User.findOne({ email: email });

    if (!findUser) throw new Error("There is no user with such email.");

    const isPasswordMatched = await findUser.isPasswordMatched(password);

    if (isPasswordMatched) {
      const refreshToken = generateRefreshToken(findUser._id);
      const updateUser = await User.findByIdAndUpdate(
        findUser.id,
        { refreshToken: refreshToken },
        {
          new: true,
        }
      );
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        domain: "https://mern-tester-front.vercel.app",
        maxAge: 72 * 60 * 60 * 1000,
      });
      res.json({
        ...findUser._doc,
        token: generateToken(findUser?._id),
      });
    } else throw new Error("Password is incorrect.");
  })
);

const handleRefreshToken = asyncHandler(
  tryCatch(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error("No refresh token in Cookies.");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) throw new Error("No refresh token in db or not matched.");
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
      if (err || user.id !== decoded.id)
        throw new Error("Something is wrong with refresh token.");
      const accessToken = generateToken(user?._id);
      res.json({ accessToken });
    });
  })
);

const logout = asyncHandler(
  tryCatch(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error("No refresh token in Cookies.");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
      });
      return res.sendStatus(204); //forbidden
    }
    await User.findOneAndUpdate(
      { refreshToken: refreshToken },
      { refreshToken: "" }
    );
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    res.sendStatus(204); //forbidden
  })
);

const fetchAllUsers = asyncHandler(
  tryCatch(async (req, res) => {
    const findUsers = await User.find({});
    res.json(findUsers);
  })
);

const fetchUser = asyncHandler(
  tryCatch(async (req, res) => {
    const { id } = req.params;

    const findUser = await User.findById(id).populate({
      path: "tests",
      Model: Test,
    });

    if (findUser) res.json(findUser);
    else throw new Error("User was not found.");
  })
);

const deleteUser = asyncHandler(
  tryCatch(async (req, res) => {
    const { _id } = req.user;

    const findandDeleteUser = await User.findByIdAndDelete(_id);
    const deletedTestsCount = await Test.deleteMany({
      owner: new mongoose.Types.ObjectId(_id),
    });
    const deletedQuestionsCount = await Question.deleteMany({
      owner: new mongoose.Types.ObjectId(_id),
    });
    res.json(findandDeleteUser);
  })
);

const updateUser = asyncHandler(
  tryCatch(async (req, res) => {
    const { _id } = req.user;
    const updatedData = req.body;

    const findandUpdateUser = await User.findByIdAndUpdate(_id, updatedData, {
      new: true,
    });
    res.json(findandUpdateUser);
  })
);

const fetchUserTests = asyncHandler(
  tryCatch(async (req, res) => {
    const { _id } = req.user;

    const user = await User.findById(_id).populate({
      path: "tests",
      Model: Test,
    });

    res.json(user.tests);
  })
);

module.exports = {
  createUser,
  loginUser,
  fetchAllUsers,
  fetchUser,
  deleteUser,
  updateUser,
  handleRefreshToken,
  logout,
  fetchUserTests,
};
