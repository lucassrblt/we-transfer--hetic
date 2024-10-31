import express from 'express'
import cors from 'cors'
// import {getRoutes} from "./route/api";
// import {getAdminRoutes} from "./route/admin";
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

// const routes = getRoutes(app)
// const adminRoutes = getAdminRoutes()
const filesRoutes = getFilesRoutes(app)

server.use(express.json())
server.use(express.static("./public"))

// server.use(routes)
server.use("/files", filesRoutes)
// server.use("/admin", adminRoutes)


server.use((req, res, next) => {
    res.status(404)
    res.json({
        message: "t'es perdu"
    })
})

server.listen(port, () => console.log(`App running on port ${port}`))
