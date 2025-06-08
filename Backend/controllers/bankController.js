const BankDetails = require("../models/BankDetails");

// 🌐 GET - Public - Get bank details
exports.getBankDetails = async (req, res) => {
  try {
    const bank = await BankDetails.findOne();
    res.status(200).json(bank);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not fetch bank details" });
  }
};

// 🔐 PUT - Admin - Update bank details + QR code
exports.updateBankDetails = async (req, res) => {
  try {
    const data = req.body;
    const qrCodeUrl = req.file?.path;

    // Check if bank details already exist
    let bank = await BankDetails.findOne();

    if (bank) {
      // Update existing
      bank.set({
        ...data,
        qrCodeUrl: qrCodeUrl || bank.qrCodeUrl,
        updatedAt: new Date()
      });
    } else {
      // Create new
      bank = new BankDetails({
        ...data,
        qrCodeUrl
      });
    }

    await bank.save();
    res.status(200).json({ message: "Bank details updated", bank });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
};
