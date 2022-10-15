const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(

    // Schema for User //
  {
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
     phone: { type: String, required: true, unique: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    role: {
      type: String,
      required: true
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);