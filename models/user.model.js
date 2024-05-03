import mongoose from "mongoose"


const userSchema = new mongoose.Schema({
   
    fullName: {
        type: String,
        required: true
    },

    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profilePhoto: {
        type: String,
        default: "",
    
    },
    gender: {
        type: "string",
        enum: ["male", "female"],
        required: true
    }



}, {timestamps: true})


export const userModel = mongoose.model("Users", userSchema)

