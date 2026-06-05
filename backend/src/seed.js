import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/users.js";
import dotenv from "dotenv";

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

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
