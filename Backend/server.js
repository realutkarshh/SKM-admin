const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const contactRoutes = require("./routes/contact");
const admissionRoutes = require("./routes/admission");
const newsRoutes = require("./routes/news");
const bankRoutes = require("./routes/bank");


dotenv.config();

const app = express();

const corsOptions = {
  origin: [
    'http://localhost:3000',  // Next.js default port
    'http://localhost:5173',  // Alternative frontend port
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'https://skm-admin-delta.vercel.app',
    'https://skm-college-website.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use("/api/admin", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admission", admissionRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/bank", bankRoutes);


// Test Route
app.get("/", (req, res) => {
  res.send("API is running 🎉");
});



// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ MongoDB error:", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});


const upload = require("./utils/multer");
app.post("/api/test-upload", upload.single("image"), (req, res) => {
  res.json({
    message: "Image uploaded successfully!",
    url: req.file.path,
  });
});
