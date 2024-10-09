import { response } from "express";
import UserModel from "../Model/user.model.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import path from 'path';

export const signup = async (req, res)=>{
    try {
      const newUser =  new UserModel(req.body);
      await newUser.save();
      res.status(200).json({message: 'SignUp success'});
    } 
    catch (err) {
        res.status(500).json({message: err.message});
    }
}

export const login = async (req, res)=>{
   try {
     const { email, password } = req.body;
     const user = await UserModel.findOne({email})

     if (!user)
        return res.status(404).json({message:'User does not exist'});

     const isLogin = await bcrypt.compare(password, user.password)
     if (!isLogin)
        return res.status(401).json({message: 'Incorrect password'})

     const payload = {
      id: user._id,
      fullname: user.fullname,
      email: user.email,
      picture: user.picture
     }

   // jwt.sign(payload, secret, options)   
   // here we pass basically three arguments, in payload we pass the object from which we want to create as token, in secret we pass the secret key which is we we have generated , in options we pass the timing like after what time token should be expired, watch the recording for more details .
   // like here self understand is - if session is expired then in next request in front end we came to know that session is expired.

     const token = await jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '7d'
     })
     
     res.status(200).json({message: 'Login Success', token})

   } catch (err) {
    res.status(401).json({message: 'login failed, please try again'});
   }
}

export const uploadProfilePic = async (req, res) => {
   try {
       if (!req.file) {
           return res.status(400).json({ message: 'No file uploaded' });
       }

       const picture = path.join("pictures", req.file.filename).replace(/\\/g, '/');
       const user = await UserModel.findByIdAndUpdate(req.user.id, { picture });

       if (!user) {
           return res.status(401).json({ message: 'Failed to upload picture' });
       }
       const payload = {
         id: req.user.id,
         fullname: req.user.fullname,
         email: req.user.email,
         picture: picture
        }

        const token = await jwt.sign(payload, process.env.JWT_SECRET, {
         expiresIn: '7d'
        })

       res.status(200).json({ message: 'Successfully uploaded picture', token });

   } catch (error) {
       res.status(500).json({ message: 'Failed to upload profile' });
   }
};
