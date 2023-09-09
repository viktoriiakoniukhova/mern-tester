const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const { User, Test, Question } = require("../config/db");
const {
  createQuestion,
  updateQuestion,
  deleteQuestion,
} = require("./questionCtrl");

const createTest = asyncHandler(async (req, res) => {
  const ownerId = req.user._id;
  const { title, description, questions } = req.body;

  const newTest = await Test.create({
    title,
    description,
    owner: ownerId,
  });

  questions.forEach((question) => {
    createQuestion(req, res, question, newTest._id);
  });
  //add Test To Owner
  const newUser = await User.findByIdAndUpdate(
    { _id: ownerId },
    { $push: { tests: newTest._id } },
    { new: true }
  );

  res.json(newTest);
});

const fetchAllTests = asyncHandler(async (req, res) => {
  try {
    const findTests = await Test.find({}).populate({
      path: "questions",
      model: Question,
    });
    res.json(findTests);
  } catch (error) {
    throw new Error(error);
  }
});

const fetchTest = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const updatedTest = await Test.findById(id)
      .populate({
        path: "questions",
        model: Question,
      })
      .populate({
        path: "owner",
        model: User,
      });
    res.json(updatedTest);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteTest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const ownerId = req.user._id;
  // const { questions } = await Test.findById(id);

  try {
    //delete Test From Owner
    const newUser = await User.findByIdAndUpdate(
      ownerId,
      { $pull: { tests: new mongoose.Types.ObjectId(id) } },
      { new: true }
    );

    //delete Questions from Test
    const deletedQuestionsCount = await Question.deleteMany({
      test: new mongoose.Types.ObjectId(id),
    });

    const findandDeleteTest = await Test.findByIdAndDelete(id);
    res.json(findandDeleteTest);
  } catch (error) {
    throw new Error(error);
  }
});

const updateTest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // const updatedData = req.body;
  const ownerId = req.user._id;
  const { title, description, questions } = req.body;
  const test = await Test.findById(id).populate({
    path: "questions",
    model: Question,
  });
  try {
    const findandUpdateTest = await Test.findByIdAndUpdate(
      id,
      { title, description },
      {
        new: true,
      }
    );

    // Delete question
    if (test.questions.length > questions.length) {
      test.questions.forEach((question) => {
        const foundObject = questions.find((q) => q.id !== question._id);

        if (foundObject) {
          deleteQuestion(req, res, question, id);
        }
      });
    }

    await questions.forEach(async (question) => {
      updateQuestion(req, res, question, id);
    });

    res.json(findandUpdateTest);
  } catch (error) {
    throw new Error(error);
  }
});

const addCandidateToTest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const candidate = req.body;
  const test = await Test.findById(id);
  try {
    const newTest = await Test.findByIdAndUpdate(
      id,
      { $push: { candidates: candidate } },
      { new: true }
    );

    res.json(test);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createTest,
  fetchAllTests,
  fetchTest,
  deleteTest,
  updateTest,
  addCandidateToTest,
};
