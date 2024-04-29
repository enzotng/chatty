import { Request, Response } from "express";
import axios, { AxiosError } from "axios";

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

export const handleMessage = async (req: Request, res: Response) => {
    const { message } = req.body;

    const payload = {
        model: "gpt-3.5-turbo",
        messages: [{
            role: "user",
            content: message
        }],
        max_tokens: 150,
        temperature: 0.5,
    };

    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    };

    try {
        const response = await axios.post(OPENAI_API_URL, payload, { headers });
        const reply = response.data.choices[0].message.content;
        res.json({ reply: reply });
    } catch (error: any) {
        const axiosError = error as AxiosError;
        console.error("Erreur de l'appel vers OpenAI API:", axiosError.response ? JSON.stringify(axiosError.response.data) : axiosError.message);
        const status = axiosError.response ? axiosError.response.status : 500;
        res.status(status).json({
            error: "Erreur lors de l'utilisation de l'API OpenAI",
            details: axiosError.response ? axiosError.response.data : { message: axiosError.message }
        });
    }
};