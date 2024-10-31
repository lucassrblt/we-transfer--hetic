import express from "express";
// import {getFiles} from "../services/files.services";
import {App} from "../type/app";
import {getFileRepository} from "../repository/files.repository";


export function getFilesRoutes(app: App){
    const router = express.Router()

    // router.get('/files', getFiles)
    router.get('', (req, res, next) => {
        const response = res.json('test')
        res.send(response)
    })
    router.get('/all', (req, res, next) => {

        const response = app.repository.filesRepository.getAll()
        res.send(response)
    })
    router.get('/:id(\\d+)', (req, res, next) => {
        const response = app.repository.filesRepository.getOne(parseInt(req.params.id))
    })
    router.get('/all', (req, res, next) => {

        const response = app.repository.filesRepository.getAll()
        res.send(response)
    })

    router.post('', (req, res, next) => {
        const data = req.body
        const response = app.repository.filesRepository.insert(data)
        res.send(response)
    })
    return router
}