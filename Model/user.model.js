import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';


const validateEmail = (email)=>{
   // const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/    //checking any type of email.
    const pattern = /^[a-zA-Z0-9._%+-]+@gmail+\.[a-zA-Z]{2,}$/                // checking only for the gmail 
    return pattern.test(email) 
}

const userSchema = new Schema({
    fullname:{
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: validateEmail,
             message: 'please enter correct email address'
        }
    },
    password:{
        type: String,
        required: true,
        trim: true,
    },
    picture: {
        type: String,
        trim: true,
        
    }
}, {timestamps: true});


userSchema.pre('save', async function(next){
    const user = await model('User').countDocuments({email: this.email});
    if (user)
        throw next(new Error('User already exists'));

    next();
})

userSchema.pre('save', async function(next){
    const encrypted = await bcrypt.hash(this.password.toString(), 12)
    this.password = encrypted;
    next();
})


const UserModel = model("User", userSchema)   //here create the new collection and applied above schema on that collection
export default UserModel