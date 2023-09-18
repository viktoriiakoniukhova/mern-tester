const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var questionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: false,
    },
    options: [
      {
        type: String,
        required: true,
      },
    ],
    answer: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      default: 1,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    test: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test",
    },
  },
  { timestamps: true }
);

//Export the schema
module.exports = questionSchema;
