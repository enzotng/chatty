import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET_KEY || "default_secret_key";

export const register = async (req: Request, res: Response) => {
    const { email, password, firstName, lastName } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                fullName: `${firstName} ${lastName}`,
            },
        });
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({
            error: "Erreur lors de la création de l'utilisateur",
        });
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign({ id: user.id }, SECRET_KEY, {
                expiresIn: "1h",
            });
            res.json({ token, user });
        } else {
            res.status(401).json({ error: "Email ou mot de passe incorrect" });
        }
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la connexion" });
    }
};

export const authenticate = async (
    req: Request,
    res: Response,
    next: () => void
) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
        const invalidToken = await prisma.invalidToken.findUnique({
            where: { token },
        });
        if (invalidToken) {
            return res.status(401).json({ error: "Token invalide" });
        }

        jwt.verify(token, SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: "Token invalide" });
            }
            req.user = decoded as jwt.JwtPayload;
            next();
        });
    } else {
        res.status(401).json({ error: "Token manquant" });
    }
};

export const logout = async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
        try {
            await prisma.invalidToken.create({ data: { token } });
            res.status(200).json({ message: "Déconnexion réussie" });
        } catch (error) {
            res.status(500).json({ error: "Erreur lors de la déconnexion" });
        }
    } else {
        res.status(400).json({ error: "Token manquant" });
    }
};
