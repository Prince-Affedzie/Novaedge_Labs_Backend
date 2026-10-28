import { Router } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authRoutes = Router();

authRoutes.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.matches(password)))
      return res.status(401).json({ message: "Invalid credentials" });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token });
  } catch (e) { next(e); }
});

export default authRoutes;