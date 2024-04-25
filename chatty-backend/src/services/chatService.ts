import { Request, Response } from "express";
import { client } from "@gradio/client";

const app = await client("ysharma/CodeGemma", {
    hf_token: process.env.HF_API_KEY,
});

interface PredictionResult {
    data: { text: string };
}

export const handleMessage = async (req: Request, res: Response) => {
    const { message } = req.body;
    try {
        const result = (await app.predict("/chat", [
            message,
            0.5,
            150,
        ])) as PredictionResult; // Type assertion here

        res.json({ reply: result.data.text });
    } catch (error: any) {
        console.error("Error calling Gradio API:", error);
        if (error.status === 429) {
            res.status(429).json({
                error: "Vous avez dépassé votre quota pour l'API Gradio.",
            });
        } else {
            res.status(500).send(
                "Erreur interne du serveur lors de l'utilisation de l'API Gradio."
            );
        }
    }
};
