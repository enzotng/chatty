"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const conversationService_1 = require("../services/conversationService");
const authService_1 = require("../services/authService");
const router = express_1.default.Router();
router.get("/", authService_1.authenticate, conversationService_1.getUserConversations);
router.get("/:conversationId", authService_1.authenticate, conversationService_1.getConversationMessages);
exports.default = router;
