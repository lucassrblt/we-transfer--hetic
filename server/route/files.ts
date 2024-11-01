import express from "express";
import {App} from "../type/app";
import multer from "multer";
import path from "path";
import jwt from "jsonwebtoken";
import fs from "fs";
import archiver from "archiver";
import {Request, Response, NextFunction} from 'express';
import dotenv from "dotenv";
import { v4 as uuidv4 } from 'uuid';

import {fileURLToPath} from 'url';
import {CompleteFileEntityRequest} from "../type/todo";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const KEY = process.env.SECRET_KEY as string;
const uploadDir = path.join(__dirname, 'uploads'); // Chemin vers le dossier 'uploads' dans 'server'
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, {recursive: true});
}
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Utilise le dossier 'uploads' dans 'server'
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Nom unique basé sur l'horodatage
    }
});

const upload = multer({storage: storage});

const createZip = (fileName: string, zipName: string): Promise<void> => {
    const filePath = path.join(__dirname, 'uploads', fileName);
    const outputZip = path.join(__dirname, 'uploads', zipName);

    return new Promise((resolve, reject) => {
        const output = fs.createWriteStream(outputZip);
        const archive = archiver('zip', {zlib: {level: 9}});

        output.on('close', () => resolve());
        archive.on('error', (err) => reject(err));

        archive.pipe(output);
        archive.file(filePath, {name: fileName});
        archive.finalize();
    });
};

export function getFilesRoutes(app: App) {
    const router = express.Router()
    async function checker(id: string){
        const checkIfExist = await app.repository.filesRepository.getOne(id)
        if(checkIfExist){
            return {
                status: true,
                fileData: checkIfExist
            }
        }
        return {
            status: false
        }
    }
    router.get('', (req, res, next) => {
        const response = res.json('test')
        res.send(response)
    })
    router.get('/all/:userId', async (req, res, next) => {
        try{
        const response = await app.repository.filesRepository.getAll(req.params.userId)
        console.log(response)
        res.send(response)
        }
        catch(e){
            res.status(500).json({message: "Erreur lors de la récupération des fichiers", error: e})
        }
    })

    router.get('/:id', (req, res, next) => {
        try{
        const response = app.repository.filesRepository.getOne(req.params.id)
        res.send(response)
        }
        catch(e){
            res.status(500).json({message: "Erreur lors de la récupération du fichier", error: e})
        }

    })

    router.put('/:id', async (req, res, next) => {
        try {
        const data = req.body
        const response = await app.repository.filesRepository.update(req.params.id, data)
        res.send(response).status(200)
        }
        catch(e){
            console.log(e)
            res.status(500).json({message: "Erreur lors de la modification du fichier", error: e})
        }
    })

    router.delete('/:id', async(req, res, next) => {
        try {
        const response =await app.repository.filesRepository.delete(req.params.id)
        res.send(response).status(response.status)
        }
        catch(e){
            res.status(500).json({message: "Erreur lors de la suppression du fichier", error: e})
        }
    })

    router.post('/upload', upload.single('file'), async (req: Request, res: Response): Promise<void> => {
        try {
            console.log(req.body)
            const fileData = JSON.parse(req.body.filedata)
            const mailData = JSON.parse(req.body.mailData)
            const metaData = JSON.parse(req.body.metadata)
            const fileId = uuidv4()




            if (!req.file) {
                res.status(400).json({message: 'Aucun fichier uploadé.'});
            }
            else {
                const zipFileName = `zip-${req.file.filename}.zip`;
                await createZip(req.file.filename, zipFileName);
                const CompleteFileEntityRequest: CompleteFileEntityRequest = {
                    file : { user_id : fileData.userId, endpoint: zipFileName},
                    metadata : {name : metaData.name, size: metaData.size}
                }

                const fileSave = await app.repository.filesRepository.insert(CompleteFileEntityRequest, fileId)
                const mailSave = await app.repository.mailRepository.insert(mailData, fileData.userId, fileId)


                const token = jwt.sign({filePath: zipFileName}, KEY, {expiresIn: '1h'});
                const temporaryLink = `${req.protocol}://${req.get('host')}/download/${token}`;
                const response = res.status(201).json({message: 'Fichier uploadé et compressé avec succès', link: temporaryLink});
            }
        } catch (error) {
            res.status(500).json({message: 'Erreur lors de l\'upload et de la création du ZIP', error});
        }
    })

    router.get('/upload/:token', async (req: Request, res: Response): Promise<void> => {

        try {
            const {token} = req.params;
            console.log(token);

            const decoded = jwt.verify(token, KEY) as { filePath: string };
            const zipFilePath = path.join(__dirname, 'uploads', decoded.filePath);

            if (!fs.existsSync(zipFilePath)) {
                res.status(404).json({message: 'Fichier non trouvé'});
            }

            res.download(zipFilePath);
        } catch (error) {
            res.status(403).json({message: 'Lien expiré ou non autorisé'});
        }
    });
    return router
}




