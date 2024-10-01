import mongoose from "mongoose";
import validator from "validator";
import Rental from "./Rental.js";

const { Schema } = mongoose;
const isEmail = validator.isEmail;

const userSchema = new Schema({
  name: {
    type: "string",
    required: true,
  },
  credential: {
    username: {
      type: "string",
      required: [true, "please enter an username"],
      unique: [true, "username already exist"],
    },
    email: {
      type: "string",
      required: [true, "please enter an email"],
      unique: [true, "email already exist"],
      validate: [isEmail, "please enter a valid email"],
    },
    password: {
      type: "string",
      required: [true, "please enter a password"],
      minLength: [8, "Minimum password length is 8 characters."],
    },
  },
  borrowedTapes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Rental",
    },
  ],
});
