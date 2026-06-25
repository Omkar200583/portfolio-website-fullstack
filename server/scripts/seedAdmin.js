// server/scripts/seedAdmin.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["admin", "user"], default: "user" },
  isActive: { type: Boolean, default: true },
  lastLogin: Date,
  refreshToken: String,
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

const seedAdmin = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected");

    // Delete existing
    await User.deleteOne({ email: "omkarjadhav415523@gmail.com" });

    // ✅ FIX: Hash password BEFORE saving (inline schema has no pre-save hook)
    const hashedPassword = await bcrypt.hash("Omkar@9696", 12);

    const admin = await User.create({
      name: "Omkar",
      email: "omkarjadhav415523@gmail.com",
      password: hashedPassword,   // ← Store the hash, not plain text
      role: "admin",
      isActive: true,
    });

    console.log("✅ Admin created:", admin.email);

    // Verify
    const isMatch = await bcrypt.compare("Omkar@9696", admin.password);
    console.log("✅ Password verified:", isMatch);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

seedAdmin();