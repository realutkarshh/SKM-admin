const express = require("express");
const router = express.Router();
const verifyAdmin = require("../middleware/verifyAdmin");
const upload = require("../utils/multer");

const {
  createNews,
  getAllNews,
  getAllNewsAdmin,
  updateNews,
  deleteNews
} = require("../controllers/newsController");

// 🌐 Public - Get all visible news
router.get("/", getAllNews);

// 🔐 Admin - Get all news
router.get("/admin", verifyAdmin, getAllNewsAdmin);

// 🔐 Admin - Create news (with image)
router.post("/", verifyAdmin, upload.single("image"), createNews);

// 🔐 Admin - Update
router.put("/:id", verifyAdmin, updateNews);

// 🔐 Admin - Delete
router.delete("/:id", verifyAdmin, deleteNews);

module.exports = router;
