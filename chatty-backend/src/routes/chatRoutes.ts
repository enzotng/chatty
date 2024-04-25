import { Router } from "express";
import { handleMessage } from "../services/chatService";

const router = Router();

router.post("/", handleMessage);

export default router;
