import express from "express";
import { chatService } from "../services/chatService";
import { authenticate } from "../services/authService";

const router = express.Router();

router.post("/", authenticate, chatService);

export default router;
