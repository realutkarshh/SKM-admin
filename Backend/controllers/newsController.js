const News = require("../models/News");

// 📥 POST - Create news with image
exports.createNews = async (req, res) => {
  try {
    const { title, description } = req.body;
    const imageUrl = req.file?.path; // Cloudinary gives full URL

    const news = new News({
      title,
      description,
      imageUrl,
    });

    await news.save();
    res.status(201).json({ message: "News created successfully", news });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🌐 GET - Public: All visible news
exports.getAllNews = async (req, res) => {
  try {
    const newsList = await News.find({ visible: true }).sort({ date: -1 });
    res.status(200).json(newsList);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔐 GET - Admin: All news
exports.getAllNewsAdmin = async (req, res) => {
  try {
    const newsList = await News.find().sort({ date: -1 });
    res.status(200).json(newsList);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// 📝 PUT - Update news
exports.updateNews = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await News.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
};

// ❌ DELETE - Delete news
exports.deleteNews = async (req, res) => {
  try {
    const { id } = req.params;
    await News.findByIdAndDelete(id);
    res.status(200).json({ message: "News deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Delete failed" });
  }
};
