import express from 'express'
import cors from 'cors'
import {getUserRoutes} from "./route/user";
import mysql from 'mysql2/promise'
import {getRepository} from "./repository/repository";
import {App} from "./type/app";
import authMiddleware from "./middleware/auth.Middleware "
import cursor from "./services/sql.service";
import {getFilesRoutes, getFilesUploadRoutes, getFileRoute} from "./route/files";

const server = express()
const port = 3009

server.use(cors())

const repository = getRepository(cursor)
const app: App = {
    repository
}

const userRoutes = getUserRoutes()
const filesRoutes = getFilesRoutes(app)
const filesUploadRoutes = getFilesUploadRoutes()
const fileRoute = getFileRoute()
server.use(express.json())
server.use(express.static("./public"))
server.use('/download', fileRoute)
server.use("/files", filesRoutes)
server.use((req, res, next) => {
    res.status(404)
    res.json({
        message: "t'es perdu"
    })
})
server.use(authMiddleware)
server.use("/user", userRoutes)
server.use("/files/upload", filesUploadRoutes) 



server.listen(port, () => console.log(`App running on port ${port}`))
