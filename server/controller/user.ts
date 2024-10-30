import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';

dotenv.config();

const KEY = process.env.RANDOM_KEY as string;

interface SignupRequest extends Request {
    body: {
        email: string;
        password: string;
        prenom : string;
        nom : string;
    };
}

interface LoginRequest extends Request {
    body: {
        email: string;
        password: string;
    };
}

export async function signup(req: SignupRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        const hash = await bcrypt.hash(req.body.password, 10);
        const { nom, prenom, email} = req.body;
        // await userDatabase.createUser({
        //     data: {
        //         nom,
        //         prenom,
        //         email,
        //         password: hash
        //     }
        // });
        res.status(200).json({message:"User was created", data:{
            "name": nom,
            "firstname": prenom,
            "email": email,
            "password": hash
        }});
    } catch (error) {
        res.status(500).json({ error });
    }
}

export async function login(req: LoginRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        // const user = await userDatabase.getOneUser({
        //     where: {
        //         email: req.body.email
        //     }});
    
        const user =  {
            uuid: "123456",
            email: "test@test.com",
            password:await bcrypt.hash("123456", 10)
        }   
    
        if (user) {
            const valid = await bcrypt.compare(req.body.password, user.password);
            if (!valid) {
                res.status(401).json({ message: 'Incorrect email or password' });
            } else {
                res.status(201).json({
                    userId: user.uuid,
                    token: jwt.sign(
                        { userId: user.uuid },
                        KEY,
                        { expiresIn: '1h' }
                    )
                });
            }
        } else {
            res.status(401).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error });
    }
}
