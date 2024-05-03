
import mongoose from "mongoose"

const messageSchema = new mongoose.Schema({
 
    senderID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },
    receiverID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },
    message: {
        type: String,
        required: true
    },

   

}, {timestamps: true})


export const messageModel = mongoose.model("Message", messageSchema)