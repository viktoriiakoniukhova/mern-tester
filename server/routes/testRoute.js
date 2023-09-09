const express = require("express");

const { authMiddleware } = require("../middlewares/authMiddleware");
const { isOwner } = require("../middlewares/testMiddleware");

const {
  fetchAllTests,
  fetchTest,
  deleteTest,
  updateTest,
  createTest,
  addCandidateToTest,
} = require("../controller/testCtrl");
const router = express.Router();

router.get("/all", fetchAllTests);
router.post("/add", authMiddleware, createTest);
router.get("/:id", fetchTest);
router.delete("/:id", authMiddleware, deleteTest);
router.put("/:id", authMiddleware, updateTest);
router.put("/:id/candidate", addCandidateToTest);
module.exports = router;
