import { PrismaClient } from "@prisma/client";
import axios, { AxiosError } from "axios";
import { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();

const prisma = new PrismaClient();
const OPENAI_API_URL = process.env.OPENAI_API_URL;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_URL) {
    throw new Error(
        "La variable d'environnement OPENAI_API_URL n'est pas définie."
    );
}

if (!OPENAI_API_KEY) {
    throw new Error(
        "La variable d'environnement OPENAI_API_KEY n'est pas définie."
    );
}

export const chatService = async (req: Request, res: Response) => {
    const { message, conversationId } = req.body;
    const { user } = req;

    if (!user) {
        console.log("Utilisateur non connecté.");
        return res.status(401).json({ error: "Vous n'êtes pas connecté !" });
    }

    try {
        let currentConversationId = conversationId;

        // Log initial
        console.log("Début de la gestion du message:", message);

        // Crée une nouvelle conversation si aucun conversationId n'est fourni
        if (!currentConversationId) {
            console.log(
                "Création d'une nouvelle conversation pour l'utilisateur:",
                user.id
            );
            const newConversation = await prisma.conversation.create({
                data: {
                    userId: user.id,
                },
            });
            currentConversationId = newConversation.id;
            console.log(
                "Nouvelle conversation créée avec ID:",
                currentConversationId
            );
        } else {
            console.log(
                "Utilisation de la conversation existante avec ID:",
                currentConversationId
            );
        }

        // Récupérer l'historique des messages pour la conversation actuelle
        console.log(
            "Récupération des messages précédents pour la conversation ID:",
            currentConversationId
        );
        const previousMessages = await prisma.chat.findMany({
            where: { conversationId: currentConversationId },
            orderBy: { createdAt: "asc" },
        });
        console.log("Messages précédents récupérés:", previousMessages);

        // Construire l'historique de la conversation
        const conversationHistory = previousMessages
            .flatMap((msg) => [
                { role: "user", content: msg.message },
                { role: "assistant", content: msg.reply },
            ])
            .concat({ role: "user", content: message });

        console.log(
            "Historique de la conversation construit:",
            conversationHistory
        );

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

        console.log(
            "Envoi de la requête à l'API OpenAI avec le payload:",
            payload
        );
        const response = await axios.post(OPENAI_API_URL, payload, { headers });
        const reply = response.data.choices[0].message.content;
        console.log("Réponse reçue de l'API OpenAI:", reply);

        // Stocker le nouveau message et la réponse
        await prisma.chat.create({
            data: {
                userId: user.id,
                message,
                reply,
                conversationId: currentConversationId,
            },
        });

        console.log("Message et réponse stockés dans la base de données.");

        res.json({ reply, conversationId: currentConversationId });
    } catch (error: any) {
        const axiosError = error as AxiosError;
        console.error(
            "Erreur de l'appel vers OpenAI API:",
            axiosError.response
                ? JSON.stringify(axiosError.response.data)
                : axiosError.message
        );
        const status = axiosError.response ? axiosError.response.status : 500;
        res.status(status).json({
            error: "Erreur lors de l'utilisation de l'API OpenAI",
            details: axiosError.response
                ? axiosError.response.data
                : { message: axiosError.message },
        });
    }
};

const cleanUpOldChats = async () => {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

    try {
        await prisma.chat.deleteMany({
            where: {
                createdAt: {
                    lt: thirtyMinutesAgo,
                },
            },
        });
        console.log("Anciennes conversations supprimées.");
    } catch (error) {
        console.error(
            "Erreur lors de la suppression des anciennes conversations:",
            error
        );
    }
};

// Changer l'intervalle à 30 minutes (30 * 60 * 1000 millisecondes)
setInterval(cleanUpOldChats, 30 * 60 * 1000);
