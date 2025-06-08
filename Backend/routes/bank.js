const express = require("express");
const router = express.Router();
const verifyAdmin = require("../middleware/verifyAdmin");
const upload = require("../utils/multer");

const {
  getBankDetails,
  updateBankDetails
} = require("../controllers/bankController");

// 🌐 Public - Get current bank details
router.get("/", getBankDetails);

// 🔐 Admin - Update bank details + QR
router.put("/", verifyAdmin, upload.single("qr"), updateBankDetails);

module.exports = router;
