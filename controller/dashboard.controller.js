import mongoose from "mongoose";
import FileModel from "../Model/file.model.js";

const dashboard = async (req, res)=>{
    try {
        const data = await FileModel.aggregate([
            {
                $match : {
                    user: mongoose.Types.ObjectId.createFromHexString(req.user.id)
                }
            },
            {
                $group: {
                    _id: '$type',
                    totalSize: {
                        $sum: '$size'
                    }
                }
            }
        ])
        res.status(200).json(data)
    } 
    catch (err) {
    res.status(500).json({message:err.message});
    }
}

export default dashboard