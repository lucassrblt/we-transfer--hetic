import {Request, Response, NextFunction} from "express";
import {validationResult} from "express-validator";
import {App} from "../type/app";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config()

export function createToken() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const createToken = (data: any) => {
            try {
                const secretkey: string | undefined = process.env.SECRET_KEY
                if (!secretkey) {
                    throw new Error('SECRET_KEY is not defined in the environment variables');
                }
                const token = jwt.sign(data, secretkey)
                return token
            } catch (error) {
                console.log(error)
                return null
            }
        }

        const dataJson = {
            email: "test@test.com",
            password: "123456"
        }
        
        const token = createToken(dataJson)

        if(token){
            res.json({token: token})
        } else {
            res.status(500).json({message: "Erreur lors de la création du token"})
        }
    
    }
}
export function getAll(app: App) {
    return async (req: Request, res: Response, next: NextFunction) => {

        app.repository.todoRepository.getAll().then(data => console.log(data))
        

        res.write("Je suis dans le controller \n")
        
        res.send()

        // res.json({
        //     message: "Hello monde incroyable de gens beaux"
        // })
    }
}

export function getOne(app: App) {
    return async (req: Request, res: Response, next: NextFunction) => {
        app.repository.todoRepository.getOne(parseInt(req.params.id) || 0).then(data => console.log(data))

        res.write("Je suis dans le controller \n")
        res.send()

        // res.json({
        //     message: "Hello monde incroyable de gens beaux"
        // })
    }
}

export function postThings() {
    return async (req: Request, res: Response, next: NextFunction) => {
        // console.log(req.body)

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.json(errors.array())
        }

        console.log(req.body)

        res.status(201)
        res.send()
    }
}




