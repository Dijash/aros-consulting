import express from "express";
import {
	createUser,
	deleteUser,
	getAllUsers,
	getUserById,
	loginUser,
	registerUser,
	updateUser,
	getCurrentUser,
	getUserDashboard,
	updateProfile,
} from "../controller/userController.js";
import {
	createContact,
	getAllContacts,
	updateContact,
	deleteContact,
} from "../controller/contactController.js";
import {
	getAllStudents,
	createStudent,
	updateStudent,
	deleteStudent,
} from "../controller/studentController.js";
import {
	getAllTestimonials,
	createTestimonial,
	updateTestimonial,
	deleteTestimonial,
	getVisibleTestimonials,
	createUserTestimonial,
} from "../controller/testimonialController.js";
import {
	getAllPosts,
	createPost,
	updatePost,
	deletePost,
	getPublishedPosts,
} from "../controller/blogController.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/users", authenticate, requireAdmin, getAllUsers);
router.get("/users/:id", authenticate, requireAdmin, getUserById);
router.post("/users", createUser);
router.put("/users/:id", authenticate, requireAdmin, updateUser);
router.delete("/users/:id", authenticate, requireAdmin, deleteUser);

router.post("/contact", createContact);
router.get("/contact", authenticate, requireAdmin, getAllContacts);
router.patch("/contact/:id", authenticate, requireAdmin, updateContact);
router.delete("/contact/:id", authenticate, requireAdmin, deleteContact);

router.get("/students", authenticate, requireAdmin, getAllStudents);
router.post("/students", authenticate, requireAdmin, createStudent);
router.put("/students/:id", authenticate, requireAdmin, updateStudent);
router.delete("/students/:id", authenticate, requireAdmin, deleteStudent);

router.post("/testimonials/user", authenticate, createUserTestimonial);
router.get("/testimonials/public", getVisibleTestimonials);
router.get("/testimonials", authenticate, requireAdmin, getAllTestimonials);
router.post("/testimonials", authenticate, requireAdmin, createTestimonial);
router.put("/testimonials/:id", authenticate, requireAdmin, updateTestimonial);
router.delete("/testimonials/:id", authenticate, requireAdmin, deleteTestimonial);

router.get("/posts/public", getPublishedPosts);
router.get("/posts", authenticate, requireAdmin, getAllPosts);
router.post("/posts", authenticate, requireAdmin, createPost);
router.put("/posts/:id", authenticate, requireAdmin, updatePost);
router.delete("/posts/:id", authenticate, requireAdmin, deletePost);

router.post("/enroll", createStudent);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/admin/me", authenticate, getCurrentUser);
router.get("/user/dashboard", authenticate, getUserDashboard);
router.put("/user/profile", authenticate, updateProfile);

export default router;