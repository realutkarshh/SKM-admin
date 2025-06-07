const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const password = await bcrypt.hash("admin123", 10); // change this
    const newAdmin = new Admin({
      username: "admin",
      password: password
    });

    await newAdmin.save();
    console.log("✅ Admin created");
    mongoose.disconnect();
  })
  .catch((err) => console.error("❌ MongoDB error:", err));
