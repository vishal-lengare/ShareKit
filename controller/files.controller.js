import FileModel from '../Model/file.model.js'
import nodemailer from 'nodemailer';

const emailTemplate = (data)=>{
    return `
    <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f4f4f4;
                }
                .email-container {
                    max-width: 600px;
                    margin: 20px auto;
                    padding: 20px;
                    background-color: #fff;
                    border: 1px solid #ddd;
                    border-radius: 10px;
                }
                .email-header {
                    background-color: #007bff;
                    color: #ffffff;
                    padding: 20px;
                    text-align: center;
                    border-radius: 10px 10px 0 0;
                }
                .email-body {
                    padding: 20px;
                    color: #333333;
                }
                .email-footer {
                    padding: 10px;
                    background-color: #f4f4f4;
                    color: #999999;
                    text-align: center;
                    border-radius: 0 0 10px 10px;
                }
                .button {
                    display: inline-block;
                    padding: 10px 20px;
                    margin: 20px 0;
                    background-color: #007bff;
                    color: #ffffff;
                    text-decoration: none;
                    border-radius: 5px;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="email-header">
                    <h1>Welcome, ${data.user}!</h1>
                </div>
                <div class="email-body">
                    <p style="text-transform: capatalize">Hello ${data.user},</p>
                    <p>you have recieved the file form sharekit! <br> to download the file click on the below button.</p>
                    <a href="${data.file}" download='demo' style="color: white;" class="button">Take Action</a>
                    <p>If you have any questions, feel free to contact us.</p>
                    <p>Thank you!</p>
                </div>
                <div class="email-footer">
                    <p>&copy; 2024 Vishal Lengare. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>

    `
}

export const createFile = async (req, res)=>{
    try {
        const file  = req.file
        const neweFile = new FileModel({
            user: req.user.id,
            filename: file.originalname,
            type: file.mimetype,
            size: file.size,
            path: `storage/files/${file.filename}`
        })

        await neweFile.save()
        res.status(200).json(neweFile)
    } 
    catch (err) {
        console.log(err.message)
        res.status(500).json({message: 'Failed to uplaod file'})
    }
}

export const fetchFiles = async (req, res)=>{
   try {
    const files = await FileModel.find()
    res.status(200).json(files)
   } 
   catch (err) {
    res.status(500).json({message: 'Failed to fetch files'})
   }
}


export const deleteFiles = async (req, res)=>{
   try {
    const file = await FileModel.findByIdAndDelete(req.params.id)

    if (!file)
        return res.status(404).json({ error: 'file not found'});
    
    res.status(200).json(file)
   } 
   catch (err) {
    res.status(500).json({message: 'Failed to delete files'})
   }
}

export const downloadFile = async(req, res)=>{
    try {
        const file = req.body
        res.download(file.path, (err)=>{
            if (err) {
                return res.status(404).send('File not found')
            }
        })
    } 
    catch (err) {
        res.status(500).json({message: 'failed to download the file'})
    }
}

export const shareFile = async (req, res) => {
    try {

        const smtp = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD
            }
        }) 

        
        await smtp.sendMail({
            from: process.env.SMTP_EMAIL,
            to: 'vishal.logimetrix@gmail.com',
            subject: 'ShareKit - New File Received!',
            html: emailTemplate(req.body)
        })
        res.status(200).json({
            message: 'File sent'
        })
    } 
    catch (err) {
        console.log(err.message)
    }
}