import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/users.js";
import dotenv from "dotenv";

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const existing = await User.findOne({ email: "admin@aros.com" });
    if (existing) {
      console.log("Admin user already exists: admin@aros.com / admin123");
      await mongoose.disconnect();
      return;
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);
    await User.create({
      name: "Admin",
      email: "admin@aros.com",
      password: hashedPassword,
      role: "admin",
    });

    console.log("Admin user created: admin@aros.com / admin123");
    await mongoose.disconnect();
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

seedAdmin();
