import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/DBConfig.js";
import router from "./routes/MainRoute.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(router);

app.get("/", (req, res) => {
	res.status(200).json({ message: "API is running" });
});

connectDB();

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
