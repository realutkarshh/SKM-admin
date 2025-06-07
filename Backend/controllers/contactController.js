const ContactMessage = require("../models/ContactMessage");

// 📥 Save a new contact message
exports.createMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    const newMessage = new ContactMessage({
      name,
      email,
      phone,
      subject,
      message,
    });

    await newMessage.save();
    res.status(201).json({ message: "Message received successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔐 Get all contact messages (admin only)
exports.getAllMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ submittedAt: -1 });
    res.status(200).json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};
