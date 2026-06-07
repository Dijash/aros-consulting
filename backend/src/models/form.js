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

        // Used by Admin panel (frontend/src/Pages/Admin/body.tsx)
        // PATCH /contact/:id sends: { status: "read" | "replied" }
        status: {
            type: String,
            enum: ["new", "read", "replied"],
            default: "new",
        },
    },
    {
        timestamps: true,
    }
);


const Contact = mongoose.model("Contact", contactSchema);

export default Contact;
