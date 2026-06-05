import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        interest: {
            type: String,
            default: "",
        },
        message: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;
