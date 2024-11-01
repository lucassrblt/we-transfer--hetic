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
        const checkUser = await cursor.execute<mysql.RowDataPacket[]>(`SELECT * FROM users WHERE email = ?`, [req.body.email]); 
        if(!req.body.email || !req.body.password || !req.body.nom || !req.body.prenom){
            res.status(400).json({ message: 'Please fill all the fields' });
            return
        }
        if (checkUser[0].length > 0) {
            res.status(409).json({ message: 'User already exists' });
            return
        }
        if(req.body.password.length < 8){
            res.status(400).json({ message: 'Password must be at least 8 characters long' });
            return
        }
        console.log("test");
        const hash = await bcrypt.hash(req.body.password, 10);
        const { email, nom, prenom} = req.body;
        let myuuid = uuidv4();
        const response =await cursor.execute<mysql.RowDataPacket[]>(`INSERT INTO users (email, password, nom, prenom, id) VALUES (?, ?, ?, ?, ?)`, [email, hash, nom, prenom, myuuid]);
        if(response[0].length === 0){
            res.status(500).json({ message: 'User not created' });
            return
        }
        const getUser = await cursor.execute<mysql.RowDataPacket[]>(`SELECT * FROM users WHERE email = ?`, [email]);
        res.status(200).json({message:"User was created", data: {
            email: getUser[0][0].email,
            name: getUser[0][0].nom,
            prenom: getUser[0][0].prenom,
            id: getUser[0][0].id,
            token: jwt.sign(
                { userId: getUser[0][0].id },
                KEY,
                { expiresIn: '1h' }
            )
        }
    });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
}

export async function login(req: LoginRequest, res: Response, next: NextFunction): Promise<void> {
      
    try {
        const { email, password } = req.body;
        if(!email || !password){
            res.status(400).json({ message: 'Please fill all the fields' });
            return
        }
        
        const [rows] = await cursor.execute<mysql.RowDataPacket[]>(`SELECT * FROM users WHERE email = ?`, [email]);
        const user = rows[0];
    
        if (user) {
            const valid = await bcrypt.compare(password, user.password);
            console.log(valid);
            if (!valid) {
                res.status(401).json({ message: 'Incorrect email or password'});
            } else {

                res.status(201).json({
                    id: user.id,
                    name: user.nom,
                    prenom: user.prenom,
                    email: user.email,
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
