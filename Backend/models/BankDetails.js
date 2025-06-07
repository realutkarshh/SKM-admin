const mongoose = require("mongoose");

const BankDetailsSchema = new mongoose.Schema({
  accountName: String,
  accountNumber: String,
  bankName: String,
  ifscCode: String,
  branchName: String,
  upiId: String,
  qrCodeUrl: String, // Cloudinary URL
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("BankDetails", BankDetailsSchema);
