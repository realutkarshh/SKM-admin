const express = require("express");
const router = express.Router();
const verifyAdmin = require("../middleware/verifyAdmin");
const {
  submitAdmission,
  getAllAdmissions,
} = require("../controllers/admissionController");

const { exportAdmissionsExcel } = require("../controllers/admissionController");


// 📥 Public - Submit admission form
router.post("/", submitAdmission);

// 🔐 Admin - Get all applications
router.get("/", verifyAdmin, getAllAdmissions);

router.get("/export/excel", verifyAdmin, exportAdmissionsExcel);


module.exports = router;
