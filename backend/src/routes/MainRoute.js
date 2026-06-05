import express from "express";
import {
	createUser,
	deleteUser,
	getAllUsers,
	getUserById,
	loginUser,
	updateUser,
} from "../controller/userController.js";
import {
	createContact,
	getAllContacts,
} from "../controller/contactController.js";

const router = express.Router();

router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.post("/users", createUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

router.post("/contact", createContact);
router.get("/contact", getAllContacts);

router.post("/login", loginUser);

export default router;