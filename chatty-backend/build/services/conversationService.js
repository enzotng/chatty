"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConversationMessages = exports.getUserConversations = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getUserConversations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req;
    console.log(user);
    if (!user) {
        return res.status(401).json({ error: "Vous n'êtes pas connecté !" });
    }
    try {
        const conversations = yield prisma.conversation.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: "desc" },
        });
        res.json(conversations);
    }
    catch (error) {
        console.error("Erreur lors de la récupération des conversations :", error);
        res.status(500).json({
            error: "Erreur lors de la récupération des conversations",
        });
    }
});
exports.getUserConversations = getUserConversations;
const getConversationMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req;
    const { conversationId } = req.params;
    if (!user) {
        return res.status(401).json({ error: "Vous n'êtes pas connecté !" });
    }
    try {
        const messages = yield prisma.chat.findMany({
            where: { conversationId },
            orderBy: { createdAt: "asc" },
        });
        res.json(messages);
    }
    catch (error) {
        console.error("Erreur lors de la récupération des messages de la conversation :", error);
        res.status(500).json({
            error: "Erreur lors de la récupération des messages de la conversation",
        });
    }
});
exports.getConversationMessages = getConversationMessages;
