import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        role: { type: String, default: "" },
        quote: { type: String, required: true },
        visible: { type: Boolean, default: false },
        date: { type: String, default: "" },
    },
    { timestamps: true }
);

const Testimonial = mongoose.model("Testimonial", testimonialSchema);

export default Testimonial;
