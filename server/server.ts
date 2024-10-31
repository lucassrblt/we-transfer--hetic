import express from 'express'
import cors from 'cors'
import {getUserRoutes} from "./route/user";
import mysql from 'mysql2/promise'
import {getRepository} from "./repository/repository";
import {App} from "./type/app";
import cursor from "./services/sql.service";
import {getFilesRoutes} from "./route/files";

const server = express()
const port = 3009

server.use(cors())

const repository = getRepository(cursor)
const app: App = {
    repository
}

const userRoutes = getUserRoutes()
const filesRoutes = getFilesRoutes(app)

server.use(express.json())
server.use(express.static("./public"))

server.use("/files", filesRoutes)
server.use("/user", userRoutes)


server.use((req, res, next) => {
    res.status(404)
    res.json({
        message: "t'es perdu"
    })
})

server.listen(port, () => console.log(`App running on port ${port}`))
