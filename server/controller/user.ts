import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';
import cursor from '../services/sql.service';
import {v4 as uuidv4} from 'uuid';
import * as mysql from 'mysql2/promise';
dotenv.config();

const KEY = process.env.SECRET_KEY as string;

interface SignupRequest extends Request {
    body: {
        email: string;
        password: string;
        prenom : string;
        nom : string;
    };
}

interface User{
    password: string;
    nom:string;
    prenom:string;
    uuid: string;

}

interface LoginRequest extends Request {
    body: {
        email: string;
        password: string;
        nom:string;
    };
}

export async function signup(req: SignupRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        const hash = await bcrypt.hash(req.body.password, 10);
        const { email, nom, prenom} = req.body;
        let myuuid = uuidv4();
        await cursor.execute(`INSERT INTO users (id ,email, nom, prenom, password) VALUES (?, ?, ?, ?, ?)`, [myuuid,email, nom, prenom, hash]);
        res.status(200).json({message:"User was created"});
    } catch (error) {
        res.status(500).json({ error });
    }
}

export async function login(req: LoginRequest, res: Response, next: NextFunction): Promise<void> {
      
    try {
        const { email, password } = req.body;
        
        const [rows] = await cursor.execute<mysql.RowDataPacket[]>(`SELECT * FROM users WHERE email = ?`, [email]);
        const user = rows[0];
    
        if (user) {
            const valid = await bcrypt.compare(password, user.password);
            console.log(valid);
            if (!valid) {
                res.status(401).json({ message: 'Incorrect email or password'});
            } else {

                res.status(201).json({
                    usernom: user.nom,
                    userprenom: user.prenom,
                    useremail: user.email,
                    token: jwt.sign(
                        { userId: user.id },
                        KEY,
                        { expiresIn: '1h' }
                    )
                });
            }
        } else {
            res.status(401).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error, data: req.body.email});
    }
}
