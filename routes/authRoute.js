// routes/auth.routes.js
import Joi from "joi";
import bcrypt from "bcrypt";
import express from "express";
import jwt from "jsonwebtoken";
import { db, schema } from "../db.js";
import rateLimit from "express-rate-limit";
import { loginUser, registerUser } from "../controllers/authController.js";

const router = express.Router();


const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  statusCode :429,
  message: { message: "Too many login attempts, try again later" },
});

router.post("/register",registerUser);

router.post("/login", loginLimiter,loginUser);

export default router;