"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const chatRoute_1 = __importDefault(require("./routes/chatRoute"));
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const conversationRoute_1 = __importDefault(require("./routes/conversationRoute"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/chat", chatRoute_1.default);
app.use("/api/auth", authRoute_1.default);
app.use("/api/conversations", conversationRoute_1.default);
app.get("/", (req, res) => {
    res.send("Bienvenue sur le serveur backend de Chatty !");
});
exports.default = app;
