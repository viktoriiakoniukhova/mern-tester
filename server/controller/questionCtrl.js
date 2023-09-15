const asyncHandler = require("express-async-handler");
const { Test, Question } = require("../config/db");
const mongoose = require("mongoose");
const { tryCatch } = require("../utils/tryCatch");

const createQuestion = asyncHandler(async (req, res, question, testId) => {
  const ownerId = req.user._id;
  // const { testId } = req.params;

  const newQuestion = await Question.create({
    // ...req.body,
    ...question,
    owner: ownerId,
    test: testId,
  });

  //add Question To Test
  const newTest = await Test.findByIdAndUpdate(
    { _id: testId },
    { $push: { questions: newQuestion._id } },
    { new: true }
  );

  // res.json(newQuestion);
});

const fetchQuestion = asyncHandler(
  tryCatch(async (req, res) => {
    const { id } = req.params;
    const findQuestion = await Question.findOne({ _id: id });
    res.json(findQuestion);
  })
);

const fetchAllQuestions = asyncHandler(
  tryCatch(async (req, res) => {
    const allQuestions = await Question.find({});
    res.json(allQuestions);
  })
);

const fetchQuestionsByTest = asyncHandler(
  tryCatch(async (req, res) => {
    const { testId } = req.params;

    const testQuestions = await Question.find({ test: testId });
    res.json(testQuestions);
  })
);

const deleteQuestion = asyncHandler(async (req, res, question, testId) => {
  // const { id } = req.params;
  const id = question._id;
  const findQuestion = await Question.findById(id);
  // const testId = question.test;

  try {
    //delete Question From Test
    const newTest = await Test.findByIdAndUpdate(
      testId,
      { $pull: { questions: new mongoose.Types.ObjectId(id) } },
      { new: true }
    );

    const findandDeleteQuestion = await Question.findByIdAndDelete(id);
    // res.json(findandDeleteQuestion);
  } catch (error) {
    throw new Error(error);
  }
});

const updateQuestion = asyncHandler(async (req, res, question, testId) => {
  // const { id } = req.params;
  const updatedData = question;
  const id = question._id ? question._id : null;

  // const test = await Question.findById(testId);
  // const testId = test.test;

  try {
    if (id === null) {
      createQuestion(req, res, question, testId);
      //update Question In Test
      const newTest = await Test.findByIdAndUpdate(
        testId,
        { $push: { questions: id } },
        { new: true }
      );
    } else {
      const findQuestion = await Question.findById(id);
      if (findQuestion) {
        const findandUpdateTest = await Question.findByIdAndUpdate(
          id,
          updatedData,
          {
            new: true,
          }
        );
      }
    }
    // res.json(findandUpdateTest);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  fetchQuestion,
  fetchQuestionsByTest,
  fetchAllQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
};
