import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";

export const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await prisma.user.findUnique({
                where: {
                    id: decoded.id,
                },
                omit: {
                    password: true
                }
            });

            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "Not authorized, user not found."
                });
            }

            next();
        } catch (error) {
            console.error("JWT verification failed:", error.message);
            return res.status(401).json({
                success: false,
                message: "Not authorized, token failed."
            });
        }
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Not authorized, no token provided."
        });
    }
};
