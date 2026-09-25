import Joi from "joi";
import env from "dotenv/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as Model from "../models/authModel.js";
import * as Schema from "../schemas/authSchema.js";

export const registerUser = async (req, res, next) => {
  const { error, value } = Schema.registerSchema.validate(req.body);
  if (error) {
    const error = new Error("Invalid Schema ");
    error.statusCode = 400;
    return next(error);
  }
  const email = value.email.toLowerCase();
  const password = await bcrypt.hash(value.password, 10);
  try {
    const val = [value.username, email, password];
    const exist = await Model.loginUser(email);

    if (exist) {
      const error = new Error(" User Already Registered ");
      error.statusCode = 400;
      return next(error);
    }
    const registered = await Model.registerNewUser(val);
    if (registered.length === 0) {
      const error = new Error(" Data not registered ");
      error.statusCode = 400;
      return next(error);
    }
    return res
      .status(201)
      .json({
        success: true,
        message: "User registered successfully",
        user: req.headers.authorization,
      });
  } catch (err) {
    console.log(err);
    const error = new Error(err.message);
    error.statusCode = 500;
    return next(error);
  }
};

export const loginUser = async (req, res, next) => {
  const { error, value } = Schema.loginSchema.validate(req.body);
  if (error) {
    const error = new Error("Invalid Schema ");
    error.statusCode = 400;
    return next(error);
  }
  const email = value.email.toLowerCase();
  const password = await bcrypt.hash(value.password, 10);
  try {
    const exist = await Model.loginUser(email);
    if (!exist) {
      const error = new Error(" User Not Found on this email ");
      error.statusCode = 401;
      return next(error);
    }
    const match = bcrypt.compare(password, exist.password);
    if (!exist || !match) {
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      return next(error);
    }
    const token = jwt.sign(
      {
        username: exist.username,
        email: exist.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "5m",
      },
    );
    return res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.log(err);
    const error = new Error(err.message);
    error.statusCode = 500;
    return next(error);
  }
};
