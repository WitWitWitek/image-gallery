import mongoose, { mongo } from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    }
    // email
})

export default mongoose.model('User', userSchema)