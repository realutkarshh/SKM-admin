const Admission = require("../models/Admission");
const ExcelJS = require("exceljs");


// 🔢 Helper to generate unique key like MNI-593214
const generateUniqueKey = () => {
  return "SKM-" + Math.floor(100000 + Math.random() * 900000);
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

// 🔐 Admin - Export as Excel (.xlsx)
exports.exportAdmissionsExcel = async (req, res) => {
  try {
    const admissions = await Admission.find();

    if (admissions.length === 0) {
      return res.status(404).json({ message: "No admissions found" });
    }

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Admissions");

    // Define columns
    sheet.columns = [
      { header: "Reference Key", key: "uniqueKey", width: 20 },
      { header: "First Name", key: "firstName", width: 15 },
      { header: "Last Name", key: "lastName", width: 15 },
      { header: "Email", key: "email", width: 25 },
      { header: "Phone", key: "phone", width: 15 },
      { header: "DOB", key: "dob", width: 15 },
      { header: "Gender", key: "gender", width: 10 },
      { header: "Address", key: "address", width: 25 },
      { header: "City", key: "city", width: 15 },
      { header: "State", key: "state", width: 15 },
      { header: "Pincode", key: "pincode", width: 10 },
      { header: "Program", key: "program", width: 15 },
      { header: "Qualification", key: "qualification", width: 15 },
      { header: "School", key: "school", width: 20 },
      { header: "Board", key: "board", width: 15 },
      { header: "Passing Year", key: "passingYear", width: 10 },
      { header: "Percentage", key: "percentage", width: 10 },
      { header: "Hostel Required", key: "hostelRequired", width: 10 },
      { header: "Heard From", key: "howDidYouHear", width: 20 },
      { header: "Questions", key: "questions", width: 20 },
      { header: "Agree to Terms", key: "agreeToTerms", width: 10 },
      { header: "Confirm Info", key: "confirmInformation", width: 10 },
      { header: "Submitted At", key: "submittedAt", width: 25 },
    ];

    // Add rows
    admissions.forEach(ad => {
      sheet.addRow(ad.toObject());
    });

    // Set headers for download
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=admissions.xlsx");

    // Stream Excel to response
    await workbook.xlsx.write(res);
    res.end();

  } catch (err) {
    console.error("Excel export error:", err);
    res.status(500).json({ message: "Excel export failed" });
  }
};