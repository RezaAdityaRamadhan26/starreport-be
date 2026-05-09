import express from "express";
import { fetchComments, addComment } from "../controllers/commentController.js";
import { verifyToken } from "../middlewares/authMiddlewares.js";

const commentRoute = express.Router();

commentRoute.get("/:reportId", fetchComments);
commentRoute.post("/", verifyToken, addComment);

export default commentRoute;