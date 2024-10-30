import express from 'express'
import cors from 'cors'
import {getRoutes} from "./route/api";
import {getUserRoutes} from "./route/user";
import mysql from 'mysql2/promise'
import {getRepository} from "./repository/repository";
import {App} from "./type/app";
import * as process from "node:process";

const server = express()
const port = 3009

const database = mysql.createPool({
    host: process.env.DB_HOST,
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "express"
})

server.use(cors())

const repository = getRepository(database)

const app: App = {
    repository
}

const routes = getRoutes(app)
const userRoutes = getUserRoutes()

server.use(express.json())
server.use(express.static("./public"))

server.use(routes)
server.use("/user", userRoutes)


server.use((req, res, next) => {
    res.status(404)
    res.json({
        message: "t'es perdu"
    })
})

server.listen(port, () => console.log(`App running on port ${port}`))
