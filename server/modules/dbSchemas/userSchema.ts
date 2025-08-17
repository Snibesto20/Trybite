// Package imports
const mongoose = require("mongoose");
const { customAlphabet } = require("nanoid");

const nanoid = customAlphabet(
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
  12,
);

const db_userSchema = new mongoose.Schema({
  _id: { type: String, default: () => nanoid() },
  username: { type: String, required: true },
  password: { type: String, required: true },
});

export const db_userModel = mongoose.model("User", db_userSchema);
