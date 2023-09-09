const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var testSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
    ],
    candidates: [
      {
        firstname: String,
        lastname: String,
        email: String,
        score: Number,
      },
    ],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

//Export the schema
module.exports = testSchema;
