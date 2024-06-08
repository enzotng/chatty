import express from "express";
import {
    getUserConversations,
    getConversationMessages,
} from "../services/conversationService";
import { authenticate } from "../services/authService";

const router = express.Router();

router.get("/", authenticate, getUserConversations);
router.get("/:conversationId", authenticate, getConversationMessages);

export default router;
