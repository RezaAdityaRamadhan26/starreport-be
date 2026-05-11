import express from "express";
import {
    fetchComments,
    addComment,
    editComments,
    removeComment
} from "../controllers/commentController.js";
import { verifyToken } from "../middlewares/authMiddlewares.js";

const commentRoute = express.Router();

commentRoute.get("/:reportId", fetchComments);
commentRoute.post("/", verifyToken, addComment);
commentRoute.put("/:id", verifyToken, editComments);
commentRoute.delete("/:id", verifyToken, removeComment);

export default commentRoute;