import express from "express";
import {App} from "../type/app";
import multer from "multer";
import path from "path";
import fs from "fs";
import archiver from "archiver";
import { Request, Response, NextFunction } from 'express';
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import {mailOptions, transporter} from "../services/nodemailer.service";


dotenv.config();

const KEY = process.env.SECRET_KEY as string;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadPath = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath);
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
            console.log('ici')
            // Call mail history
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log("error", error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });

            // const mailData = JSON.parse(req.body.mailData)
            // console.log(mailData)
            // const userId = JSON.parse(req.body.filedata).userId
            // const response = await app.repository.mailRepository.insert(mailData, userId)
            // res.send(response)

        } catch (error) {
            res.status(500).json({ message: 'Erreur lors de l\'upload et de la création du ZIP', error });
        }
    })
    return router
}