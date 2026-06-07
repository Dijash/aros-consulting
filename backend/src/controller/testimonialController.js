import Testimonial from "../models/testimonial.js";

export const getAllTestimonials = async (req, res) => {
    try {
        const testimonials = await Testimonial.find().sort({ createdAt: -1 });
        res.status(200).json(testimonials);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createTestimonial = async (req, res) => {
    try {
        const newTestimonial = new Testimonial(req.body);
        const saved = await newTestimonial.save();
        res.status(201).json(saved);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateTestimonial = async (req, res) => {
    try {
        const updated = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: "Testimonial not found" });
        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getVisibleTestimonials = async (req, res) => {
    try {
        const testimonials = await Testimonial.find({ visible: true }).sort({ createdAt: -1 });
        res.status(200).json(testimonials);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteTestimonial = async (req, res) => {
    try {
        const deleted = await Testimonial.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Testimonial not found" });
        res.status(200).json({ message: "Testimonial deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createUserTestimonial = async (req, res) => {
    try {
        const { quote, role } = req.body;
        if (!quote) {
            return res.status(400).json({ message: "Quote is required" });
        }
        const newTestimonial = new Testimonial({
            name: req.user.name,
            role: role || "",
            quote,
            visible: false,
            date: new Date().toISOString().slice(0, 10),
        });
        const saved = await newTestimonial.save();
        res.status(201).json(saved);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
