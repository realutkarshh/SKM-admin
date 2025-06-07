const express = require("express");
const router = express.Router();
const verifyAdmin = require("../middleware/verifyAdmin");
const {
  createMessage,
  getAllMessages,
} = require("../controllers/contactController");

// 📥 Public - Contact form submit
router.post("/", createMessage);

// 🔐 Admin - Fetch all messages
router.get("/", verifyAdmin, getAllMessages);

module.exports = router;
