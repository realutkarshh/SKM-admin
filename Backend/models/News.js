const mongoose = require("mongoose");

const NewsSchema = new mongoose.Schema({
  title: String,
  description: String,
  imageUrl: String, // Cloudinary URL
  date: {
    type: Date,
    default: Date.now
  },
  visible: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model("News", NewsSchema);
