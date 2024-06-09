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
exports.logout = exports.authenticate = exports.login = exports.register = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET_KEY || "default_secret_key";
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, firstName, lastName } = req.body;
    try {
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const user = yield prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                fullName: `${firstName} ${lastName}`,
            },
        });
        res.status(201).json(user);
    }
    catch (error) {
        res.status(500).json({
            error: "Erreur lors de la création de l'utilisateur",
        });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield prisma.user.findUnique({ where: { email } });
        if (user && (yield bcrypt_1.default.compare(password, user.password))) {
            const token = jsonwebtoken_1.default.sign({ id: user.id }, SECRET_KEY, {
                expiresIn: "1h",
            });
            res.json({ token, user });
        }
        else {
            res.status(401).json({ error: "Email ou mot de passe incorrect" });
        }
    }
    catch (error) {
        res.status(500).json({ error: "Erreur lors de la connexion" });
    }
});
exports.login = login;
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (token) {
        const invalidToken = yield prisma.invalidToken.findUnique({
            where: { token },
        });
        if (invalidToken) {
            return res.status(401).json({ error: "Token invalide" });
        }
        jsonwebtoken_1.default.verify(token, SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: "Token invalide" });
            }
            req.user = decoded;
            next();
        });
    }
    else {
        res.status(401).json({ error: "Token manquant" });
    }
});
exports.authenticate = authenticate;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const token = (_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.split(" ")[1];
    if (token) {
        try {
            yield prisma.invalidToken.create({ data: { token } });
            res.status(200).json({ message: "Déconnexion réussie" });
        }
        catch (error) {
            res.status(500).json({ error: "Erreur lors de la déconnexion" });
        }
    }
    else {
        res.status(400).json({ error: "Token manquant" });
    }
});
exports.logout = logout;
