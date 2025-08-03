const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

router.post("/register", async (req, res) => {
    const { username, password } = req.body;
  
    try {
      // Check if username already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
  
      // Proceed with registration
      const hashed = await bcrypt.hash(password, 10);
      const user = new User({ username, password: hashed });
      await user.save();
      res.send({ message: "Registered successfully" });
  
    } catch (err) {
      console.error("Registration error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).send({ message: "Invalid credentials" });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
  res.send({ token });
});

module.exports = router;

