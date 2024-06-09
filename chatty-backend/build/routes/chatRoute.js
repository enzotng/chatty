"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chatService_1 = require("../services/chatService");
const authService_1 = require("../services/authService");
const router = express_1.default.Router();
router.post("/", authService_1.authenticate, chatService_1.chatService);
exports.default = router;
