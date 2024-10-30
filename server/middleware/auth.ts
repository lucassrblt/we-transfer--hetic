import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';

dotenv.config();

const KEY = process.env.RANDOM_KEY as string;
declare module 'express-serve-static-core' {
    interface Request {
        auth?: { userId: string };
    }
}

export default (req: Request, res: Response, next: NextFunction): void => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            throw new Error('Token missing');
        }

        const decodedToken = jwt.verify(token, KEY) as jwt.JwtPayload;
        const userId = decodedToken.userId;
        req.auth = { userId };
        next();
    } catch (error) {
        res.status(403).json({ error: "Unauthorized request." });
    }
};
