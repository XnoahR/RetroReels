import mongoose from "mongoose";
import validator from "validator";
import Rental from "./Rental.js";
import bcrypt from "bcrypt";

const { Schema } = mongoose;
const isEmail = validator.isEmail;

const userSchema = new Schema({
  name: {
    type: "string",
    required: [true, "Please enter your Name"],
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
  role: { type: String, enum: ["admin", "user"], default: "user" },
  borrowedTapes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Rental",
    },
  ],
});

userSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10); // Await the salt generation
  this.password = await bcrypt.hash(this.password, salt); // Hash the password with the salt
});

const User = mongoose.model("User", userSchema);
export default User;
