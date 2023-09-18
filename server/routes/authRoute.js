const express = require("express");
const {
  createUser,
  loginUser,
  fetchAllUsers,
  fetchUser,
  deleteUser,
  updateUser,
  handleRefreshToken,
  logout,
  fetchUserTests,
} = require("../controller/userCtrl");
const { authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);

router.get("/all", fetchAllUsers);
router.get("/refresh", handleRefreshToken);
router.get("/logout", logout);

router.get("/tests", fetchUserTests);
router.get("/:id", authMiddleware, fetchUser);
router.delete("/delete", authMiddleware, deleteUser);
router.put("/edit", authMiddleware, updateUser);

module.exports = router;
