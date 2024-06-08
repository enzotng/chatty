import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const getUserConversations = async (req: Request, res: Response) => {
    const { user } = req;

    console.log(user);

    if (!user) {
        return res.status(401).json({ error: "Vous n'êtes pas connecté !" });
    }

    try {
        const conversations = await prisma.conversation.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: "desc" },
        });

        res.json(conversations);
    } catch (error) {
        console.error(
            "Erreur lors de la récupération des conversations :",
            error
        );
        res.status(500).json({
            error: "Erreur lors de la récupération des conversations",
        });
    }
};

export const getConversationMessages = async (req: Request, res: Response) => {
    const { user } = req;
    const { conversationId } = req.params;

    if (!user) {
        return res.status(401).json({ error: "Vous n'êtes pas connecté !" });
    }

    try {
        const messages = await prisma.chat.findMany({
            where: { conversationId },
            orderBy: { createdAt: "asc" },
        });

        res.json(messages);
    } catch (error) {
        console.error(
            "Erreur lors de la récupération des messages de la conversation :",
            error
        );
        res.status(500).json({
            error: "Erreur lors de la récupération des messages de la conversation",
        });
    }
};
