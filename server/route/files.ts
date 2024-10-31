import express from "express";
// import {getFiles} from "../services/files.services";
import {App} from "../type/app";
import {getFileRepository} from "../repository/files.repository";


export function getFilesRoutes(app: App){
    const router = express.Router()

    // router.get('/files', getFiles)
    // router.get('', app.repository.filesRepository.getAll)
    router.get('', (req, res, next) => {
        const response = res.json('test')
        res.send(response)
    })
    router.post('', (req, res, next) => {
        const data = req.body
        const response = app.repository.filesRepository.insert(data)
        res.send(response)
    })
    return router
}