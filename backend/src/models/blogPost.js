import mongoose from "mongoose";

const blogPostSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        category: { type: String, default: "" },
        readTime: { type: String, default: "5 min" },
        date: { type: String, default: "" },
        published: { type: Boolean, default: false },
        author: { type: String, default: "" },
    },
    { timestamps: true }
);

const BlogPost = mongoose.model("BlogPost", blogPostSchema);

export default BlogPost;
