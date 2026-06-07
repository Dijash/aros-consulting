import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true, lowercase: true },
        phone: { type: String, default: "" },
        course: { type: String, required: true },
        enrolled: { type: String, default: "" },
        status: { type: String, enum: ["active", "completed", "dropped"], default: "active" },
    },
    { timestamps: true }
);

const Student = mongoose.model("Student", studentSchema);

export default Student;
