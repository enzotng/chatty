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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatService = void 0;
const client_1 = require("@prisma/client");
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
const OPENAI_API_URL = process.env.OPENAI_API_URL;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_URL) {
    throw new Error("La variable d'environnement OPENAI_API_URL n'est pas définie.");
}
if (!OPENAI_API_KEY) {
    throw new Error("La variable d'environnement OPENAI_API_KEY n'est pas définie.");
}
const formatCodeInResponse = (response) => {
    const codeRegex = /```([^`]+)```/g;
    return response.replace(codeRegex, (match, p1) => `\`\`\`${p1.trim()}\`\`\``);
};
const chatService = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { message, conversationId } = req.body;
    const { user } = req;
    if (!user) {
        console.log("Utilisateur non connecté.");
        return res.status(401).json({ error: "Vous n'êtes pas connecté !" });
    }
    try {
        let currentConversationId = conversationId;
        console.log("Début de la gestion du message:", message);
        if (!currentConversationId) {
            console.log("Création d'une nouvelle conversation pour l'utilisateur:", user.id);
            const newConversation = yield prisma.conversation.create({
                data: {
                    userId: user.id,
                },
            });
            currentConversationId = newConversation.id;
            console.log("Nouvelle conversation créée avec ID:", currentConversationId);
        }
        else {
            console.log("Utilisation de la conversation existante avec ID:", currentConversationId);
        }
        console.log("Récupération des messages précédents pour la conversation ID:", currentConversationId);
        const previousMessages = yield prisma.chat.findMany({
            where: { conversationId: currentConversationId },
            orderBy: { createdAt: "asc" },
        });
        console.log("Messages précédents récupérés:", previousMessages);
        const conversationHistory = previousMessages
            .flatMap((msg) => [
            { role: "user", content: msg.message },
            { role: "assistant", content: msg.reply },
        ])
            .concat({ role: "user", content: message });
        console.log("Historique de la conversation construit:", conversationHistory);
        const payload = {
            model: "gpt-3.5-turbo-16k-0613",
            messages: conversationHistory,
            max_tokens: 4096,
            temperature: 0.2,
        };
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
        };
        console.log("Envoi de la requête à l'API OpenAI avec le payload:", payload);
        const response = yield axios_1.default.post(OPENAI_API_URL, payload, { headers });
        let reply = response.data.choices[0].message.content;
        console.log("Réponse reçue de l'API OpenAI:", reply);
        reply = formatCodeInResponse(reply);
        yield prisma.chat.create({
            data: {
                userId: user.id,
                message,
                reply,
                conversationId: currentConversationId,
            },
        });
        console.log("Message et réponse stockés dans la base de données.");
        res.json({ reply, conversationId: currentConversationId });
    }
    catch (error) {
        const axiosError = error;
        console.error("Erreur de l'appel vers OpenAI API:", axiosError.response
            ? JSON.stringify(axiosError.response.data)
            : axiosError.message);
        const status = axiosError.response ? axiosError.response.status : 500;
        res.status(status).json({
            error: "Erreur lors de l'utilisation de l'API OpenAI",
            details: axiosError.response
                ? axiosError.response.data
                : { message: axiosError.message },
        });
    }
});
exports.chatService = chatService;
