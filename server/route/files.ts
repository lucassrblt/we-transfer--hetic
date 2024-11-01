import express from "express";
import {App} from "../type/app";
import multer from "multer";
import path from "path";
import jwt from "jsonwebtoken";
import fs from "fs";
import archiver from "archiver";
import { Request, Response, NextFunction } from 'express';
import dotenv from "dotenv";

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const KEY = process.env.SECRET_KEY as string;
const uploadDir = path.join(__dirname, 'uploads'); // Chemin vers le dossier 'uploads' dans 'server'
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Utilise le dossier 'uploads' dans 'server'
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Nom unique basé sur l'horodatage
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

    router.get('/:id', (req, res, next) => {
        const response = app.repository.filesRepository.getOne(req.params.id)
        res.send(response)

    })

    router.put('/:id', (req, res, next) => {
        const data = req.body
        const response = app.repository.filesRepository.update(req.params.id, data)
        res.send(response)
    })

    router.delete('/:id', (req, res, next) => {
        const response = app.repository.filesRepository.delete(req.params.id)
        res.send(response)
    })

    router.post('', upload.single('file'), async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.file) {
                 res.status(400).json({ message: 'Aucun fichier uploadé.' });
            }
    
            // Création du fichier ZIP
            
            else{
                const zipFileName = `zip-${req.file.filename}.zip`;
                await createZip(req.file.filename, zipFileName);
                const token = jwt.sign({ filePath: zipFileName },KEY , { expiresIn: '1h' });
            const temporaryLink = `${req.protocol}://${req.get('host')}/download/${token}`;
    
            res.status(201).json({ message: 'Fichier uploadé et compressé avec succès', link: temporaryLink });
            }
            
        } catch (error) {
            res.status(500).json({ message: 'Erreur lors de l\'upload et de la création du ZIP', error });
        }
    })
    return router
}

export function getFileRoute() {
    const router = express.Router();

    router.get('/:token', async (req: Request, res: Response): Promise<void> => {
        console.log("je suis dans download");

        try {
            const { token } = req.params;
            console.log(token);

            const decoded = jwt.verify(token, KEY) as { filePath: string };
            const zipFilePath = path.join(__dirname, 'uploads', decoded.filePath);

            if (!fs.existsSync(zipFilePath)) {
             res.status(404).json({ message: 'Fichier non trouvé' });
            }

            res.download(zipFilePath);
        } catch (error) {
            res.status(403).json({ message: 'Lien expiré ou non autorisé' });
        }
    });


    return router
}