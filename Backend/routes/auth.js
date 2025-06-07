const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// 🔐 Admin Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check admin exists
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(401).json({ message: "Admin not found" });

    // Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // Sign JWT
    const token = jwt.sign(
      { id: admin._id, username: admin.username, isAdmin: admin.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({ token });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
