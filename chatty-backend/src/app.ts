import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chatRoutes from "./routes/chatRoutes";

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());

app.use("/api/chat", chatRoutes);

app.get("/", (req, res) => {
    res.send("Bienvenue sur le serveur backend de Chatty !");
});

export default app;
