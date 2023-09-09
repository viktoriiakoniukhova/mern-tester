const express = require("express");

const {
  fetchQuestion,
  fetchAllQuestions,
  fetchQuestionsByTest,
} = require("../controller/questionCtrl");
const router = express.Router();

router.get("/all", fetchAllQuestions);
router.get("/test/:testId", fetchQuestionsByTest);
router.get("/:id", fetchQuestion);

module.exports = router;
