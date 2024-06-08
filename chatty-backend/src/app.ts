import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chatRoute from "./routes/chatRoute";
import authRoute from "./routes/authRoute";
import conversationRoute from "./routes/conversationRoute";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/chat", chatRoute);
app.use("/api/auth", authRoute);
app.use("/api/conversations", conversationRoute);

app.get("/", (req, res) => {
    res.send("Bienvenue sur le serveur backend de Chatty !");
});

export default app;
