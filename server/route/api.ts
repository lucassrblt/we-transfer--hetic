import express from "express";
import {getAll, getOne, postThings, createToken} from "../controller/api_controller";
import {login} from "../controller/user";
import {checkSchema} from "express-validator";
import {user_schema} from "../schema/user_schema";
import {TodoRepositoryI} from "../type/todo";
import {App} from "../type/app";
import jwt from "jsonwebtoken";


export function getRoutes(app: App) {
    const router = express.Router()

    // router.use((req, res, next) => {
    //     res.write("Début du middleware \n")
    //     // res.send()
    //
    //     next()
    //
    //     res.write("Fin du middleware \n")
    //     res.send()
    // })

    router.get('/', getAll(app))

    router.get('/api', createToken())
    router.get('/api/login', login)

    router.post('/', checkSchema(user_schema), postThings())

    router.get('/:id(\\d+)', getOne(app))

    router.get('/private', (req, res, next) => {
        res.download("./public/image.png")
    })


    return router
}
