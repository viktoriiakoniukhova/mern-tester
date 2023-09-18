const express = require("express");

const {
  fetchQuestion,
  fetchAllQuestions,
  fetchQuestionsByTest,
  uploadImage,
  deleteImage,
} = require("../controller/questionCtrl");
const { fileUpload } = require("../middlewares/uploadImages");
const router = express.Router();

router.get("/all", fetchAllQuestions);
router.get("/test/:testId", fetchQuestionsByTest);
router.get("/:id", fetchQuestion);
router.post("/upload", fileUpload.single("image"), uploadImage);
router.post("/delete", deleteImage);
module.exports = router;
