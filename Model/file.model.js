import mongoose, { Schema, model } from 'mongoose';

const fileSchema = new Schema({
    user: {
        type: mongoose.Types.ObjectId,       //will store as ID
        ref: 'User'                          // it should be same as collection name where we store the user ID's
    },
    filename: {
        type: String,
        lowercase: true,
        trim: true,
        required: true
    },
    type: {
        type: String,
        lowercase: true,
        trim: true,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    path:{
        type: String,
        trim: true,
        required: true
    }
}, { timestamps: true})

const FileModel = model('File', fileSchema)    //here File is for the collection name

export default FileModel