import dotenv from 'dotenv';
dotenv.config()

//conned to db
import mongoose from 'mongoose';
mongoose.connect(process.env.DB_URL);

//imports
import express from 'express';
import bodyParser from 'body-parser';
import multer from 'multer';
import { v4 as uniqueId } from 'uuid';
import { login, signup, uploadProfilePic } from './controller/user.controller.js';
import verifyToken from './controller/token.controller.js';
import Authorization from './middleware/authorization.middleware.js';
import { createFile, deleteFiles, downloadFile, fetchFiles, shareFile } from './controller/files.controller.js';
import Download from './middleware/download.middleware.js';

const app = express();
app.listen(8000);

//middlewares

app.use(express.static('view'))
app.use(express.static('storage'))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//setup upload destination
const storage = multer.diskStorage({
    destination: (req, file, next)=>{
        const path = (file.fieldname === 'picture' ? 'storage/pictures' : 'storage/files')
        next(null, path)
    },
    filename: (req, file, next)=>{
        const nameArray = file.originalname.split('.')
        const lastIndex = nameArray.length-1;
        const ext = nameArray[lastIndex];
        const path = (file.fieldname === 'picture' ? `${req.user.id}.${ext}` : `${uniqueId()}.${ext}`)
        next(null, path)
    }
})

const upload = multer({
    storage: storage
})

// public APIS
app.post('/api/signup', signup)
app.post('/api/login', login)
app.post('/api/verify-token', verifyToken)

// private APIS
app.post('/api/upload-profile-picture', Authorization, upload.single('picture'), uploadProfilePic)
app.post('/api/file', Authorization,  upload.single('file'), createFile)
app.get('/api/file', Authorization, fetchFiles)
app.delete('/api/file/:id', Authorization, deleteFiles)
app.post('/api/file/download', Authorization, downloadFile)
app.get('/api/file/download', Download, downloadFile)
app.post('/api/file/share', shareFile)


