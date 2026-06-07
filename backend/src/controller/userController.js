import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/users.js";
import Student from "../models/student.js";

export const getAllUsers = async (req, res) => {
    try {
        const allUsers = await User.find().select("-password");
        res.status(200).json(allUsers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createUser = async (req, res) => {
    try {
        const { password, ...rest } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ ...rest, password: hashedPassword });
        const savedUser = await newUser.save();
        const { password: _, ...userWithoutPassword } = savedUser.toObject();
        res.status(201).json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const registerUser = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email, and password are required" });
        }
        const existing = await User.findOne({ email: email.toLowerCase().trim() });
        if (existing) {
            return res.status(409).json({ message: "An account with this email already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email: email.toLowerCase().trim(), password: hashedPassword, phone: phone || "" });
        const savedUser = await newUser.save();
        const token = jwt.sign(
            { id: savedUser._id, role: savedUser.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
        const { password: _, ...userWithoutPassword } = savedUser.toObject();
        return res.status(201).json({ token, user: userWithoutPassword });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        const { password: _, ...userWithoutPassword } = user.toObject();
        return res.status(200).json({ token, user: userWithoutPassword });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getCurrentUser = async (req, res) => {
    res.status(200).json(req.user);
};

export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, projection: { password: 0 } }
        );
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUserDashboard = async (req, res) => {
  try {
    const { password: _, ...userData } = req.user.toObject();
    const enrollments = await Student.find({ email: req.user.email }).sort({ createdAt: -1 });
    res.status(200).json({ user: userData, enrollments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
    try {
        const { name, password, photo, phone } = req.body;
        const updates = {};
        if (name !== undefined) updates.name = name;
        if (photo !== undefined) updates.photo = photo;
        if (phone !== undefined) updates.phone = phone;
        if (password) {
            updates.password = await bcrypt.hash(password, 10);
        }
        const updated = await User.findByIdAndUpdate(
            req.user._id,
            updates,
            { new: true, projection: { password: 0 } }
        );
        if (!updated) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};  