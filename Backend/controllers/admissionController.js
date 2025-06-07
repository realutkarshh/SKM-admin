const Admission = require("../models/Admission");

// 🔢 Helper to generate unique key like MNI-593214
const generateUniqueKey = () => {
  return "MNI-" + Math.floor(100000 + Math.random() * 900000);
};

// 📥 Public - Submit Admission Form
exports.submitAdmission = async (req, res) => {
  try {
    const data = req.body;
    const uniqueKey = generateUniqueKey();

    const admission = new Admission({
      ...data,
      uniqueKey,
    });

    await admission.save();

    res.status(201).json({
      message: "Admission submitted successfully!",
      reference: uniqueKey,
    });
  } catch (err) {
    console.error("Admission Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔐 Admin - Get all admission entries
exports.getAllAdmissions = async (req, res) => {
  try {
    const admissions = await Admission.find().sort({ submittedAt: -1 });
    res.status(200).json(admissions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch admissions" });
  }
};
