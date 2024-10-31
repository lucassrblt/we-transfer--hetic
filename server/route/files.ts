import express from "express";
// import {getFiles} from "../services/files.services";
import {App} from "../type/app";
import {getFileRepository} from "../repository/files.repository";
import multer from "multer";
import path from "path";
import jwt from "jsonwebtoken";
import fs from "fs";
import archiver from "archiver";
import { Request, Response, NextFunction } from 'express';
import dotenv from "dotenv";

dotenv.config();

const KEY = process.env.SECRET_KEY as string;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

const createZip = (fileName: string, zipName: string): Promise<void> => {
    const filePath = path.join(__dirname, 'uploads', fileName);
    const outputZip = path.join(__dirname, 'uploads', zipName);

    return new Promise((resolve, reject) => {
        const output = fs.createWriteStream(outputZip);
        const archive = archiver('zip', { zlib: { level: 9 } });

        output.on('close', () => resolve());
        archive.on('error', (err) => reject(err));

        archive.pipe(output);
        archive.file(filePath, { name: fileName });
        archive.finalize();
    });
};

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

    router.post('/upload', upload.single('file'), async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.file) {
                 res.status(400).json({ message: 'Aucun fichier uploadé.' });
            }
    
            // Création du fichier ZIP
            
            else{
                const zipFileName = `zip-${req.file.filename}.zip`;
                await createZip(req.file.filename, zipFileName);
                const token = jwt.sign({ filePath: zipFileName },KEY , { expiresIn: '1h' });
            const temporaryLink = `${req.protocol}://${req.get('host')}/file/${token}`;
    
            res.status(201).json({ message: 'Fichier uploadé et compressé avec succès', link: temporaryLink });
            }
            
        } catch (error) {
            res.status(500).json({ message: 'Erreur lors de l\'upload et de la création du ZIP', error });
        }
    })
    return router
}