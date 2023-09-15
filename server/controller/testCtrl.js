const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const { User, Test, Question } = require("../config/db");
const {
  createQuestion,
  updateQuestion,
  deleteQuestion,
} = require("./questionCtrl");
const { tryCatch } = require("../utils/tryCatch");

const createTest = asyncHandler(
  tryCatch(async (req, res) => {
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
  })
);

const fetchAllTests = asyncHandler(
  tryCatch(async (req, res) => {
    const findTests = await Test.find({}).populate({
      path: "questions",
      model: Question,
    });
    res.json(findTests);
  })
);

const fetchTest = asyncHandler(
  tryCatch(async (req, res) => {
    const { id } = req.params;

    const updatedTest = await Test.findById(id)
      .populate({
        path: "questions",
        model: Question,
      })
      .populate({
        path: "owner",
        model: User,
      });
    if (updatedTest) res.json(updatedTest);
    else throw new Error("Test was not found.");
  })
);

const deleteTest = asyncHandler(
  tryCatch(async (req, res) => {
    const { id } = req.params;
    const ownerId = req.user._id;
    // const { questions } = await Test.findById(id);
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
  })
);

const updateTest = asyncHandler(
  tryCatch(async (req, res) => {
    const { id } = req.params;
    // const updatedData = req.body;
    const ownerId = req.user._id;
    const { title, description, questions } = req.body;
    const test = await Test.findById(id).populate({
      path: "questions",
      model: Question,
    });
    const findandUpdateTest = await Test.findByIdAndUpdate(
      id,
      { title, description },
      {
        new: true,
      }
    );
    console.log(questions);

    // Delete question
    if (test.questions.length > questions.length) {
      test.questions.forEach((question) => {
        const foundObject = questions.find((q) => q._id == question._id);

        if (foundObject === undefined) {
          deleteQuestion(req, res, question, id);
        }
      });
    }

    await questions.forEach(async (question) => {
      updateQuestion(req, res, question, id);
    });

    res.json(findandUpdateTest);
  })
);

const addCandidateToTest = asyncHandler(
  tryCatch(async (req, res) => {
    const { id } = req.params;
    const candidate = req.body;
    const test = await Test.findById(id);
    const newTest = await Test.findByIdAndUpdate(
      id,
      { $push: { candidates: candidate } },
      { new: true }
    );

    res.json(test);
  })
);

module.exports = {
  createTest,
  fetchAllTests,
  fetchTest,
  deleteTest,
  updateTest,
  addCandidateToTest,
};
