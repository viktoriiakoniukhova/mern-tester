const { generateToken } = require("../config/jwt");
const { generateRefreshToken } = require("../config/refreshToken");
const { User, Test, Question } = require("../config/db");

const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const createUser = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const findUser = await User.findOne({ email: email });

  if (!findUser) {
    const newUser = await User.create(req.body);
    res.json(newUser);
  } else throw new Error("Користувач з таким email вже зареєстрований.");
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const findUser = await User.findOne({ email: email });
  const isPasswordMatched = await findUser.isPasswordMatched(password);

  if (findUser && isPasswordMatched) {
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
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.json({
      ...findUser._doc,
      token: generateToken(findUser?._id),
    });
  } else throw new Error("Невірний логін або пароль.");
});

const handleRefreshToken = asyncHandler(async (req, res) => {
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
});

const logout = asyncHandler(async (req, res) => {
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
});

const fetchAllUsers = asyncHandler(async (req, res) => {
  try {
    const findUsers = await User.find({});
    res.json(findUsers);
  } catch (error) {
    throw new Error();
  }
});

const fetchUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const findUser = await User.findById(id).populate({
      path: "tests",
      Model: Test,
    });

    res.json(findUser);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  try {
    const findandDeleteUser = await User.findByIdAndDelete(_id);
    const deletedTestsCount = await Test.deleteMany({
      owner: new mongoose.Types.ObjectId(_id),
    });
    const deletedQuestionsCount = await Question.deleteMany({
      owner: new mongoose.Types.ObjectId(_id),
    });
    res.json(findandDeleteUser);
  } catch (error) {
    throw new Error();
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const updatedData = req.body;

  try {
    const findandUpdateUser = await User.findByIdAndUpdate(_id, updatedData, {
      new: true,
    });
    res.json(findandUpdateUser);
  } catch (error) {
    throw new Error();
  }
});

const fetchUserTests = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  try {
    const user = await User.findById(_id).populate({
      path: "tests",
      Model: Test,
    });

    res.json(user.tests);
  } catch (error) {
    throw new Error(error);
  }
});

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
