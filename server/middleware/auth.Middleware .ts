import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY as string;

// Ajoutez un champ `auth` dans l'interface Request pour accéder à `userId`
declare module 'express-serve-static-core' {
    interface Request {
        auth?: { userId: string };
    }
}

// Middleware d'authentification
const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    try {
        // Récupération et validation du token
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
             throw new Error('No token provided');
        }

        // Vérification du token
        const decodedToken = jwt.verify(token, SECRET_KEY) as jwt.JwtPayload;
        const userId = decodedToken.userId;

        // Stockage de `userId` dans `req.auth`
        req.auth = { userId };

        next(); // Passe au prochain middleware ou route
    } catch (error) {
        res.status(403).json({ error: 'Unauthorized request' });
    }
};

export default authMiddleware;
