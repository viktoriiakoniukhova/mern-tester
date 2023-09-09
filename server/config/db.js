const mongoose = require("mongoose");

const db = mongoose.createConnection(process.env.MONGODB_URL);

const User = db.model("User", require("../schemas/User"));
const Test = db.model("Test", require("../schemas/Test"));
const Question = db.model("Question", require("../schemas/Question"));

db.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

module.exports = {
  User,
  Test,
  Question,
};
