import {conversationModel}  from "../models/conversation.model.js"
import { messageModel } from "../models/message.model.js";
import { getreciverSocketId, io } from "../socket/socketio.js";


export const sendMessage = async(req, res) => {
try {
    const senderID = req.id;
    const receiverID = req.params.id;
    const {message} = req.body;
    

    let gotConversation = await  conversationModel.findOne({
        participants : {$all : [senderID, receiverID]}
     })
   
     if (!gotConversation) {
       gotConversation = await conversationModel.create({
        participants : [senderID, receiverID]
       })
     }

     const newMessage = await messageModel.create({
          senderID,
          receiverID,
          message
     })

     if (newMessage) {
         gotConversation.messages.push(newMessage._id)
     }
     
    // socket 

    const reciverSocketId = getreciverSocketId(receiverID)

    if (reciverSocketId) {
          io.to(reciverSocketId).emit("newMessage", newMessage);
    }



     await Promise.all([gotConversation.save(), newMessage.save()])

   

     res.status(200).json({
        newMessage,
     })
} catch (error) {
    console.log(error);

    res.status(500).json({
        success: false,
        message: "error in sending a message"
    })
}


}

export const getMessage = async(req, res) => {
    try {
        const receiverID = req.params.id
        const senderID = req.id
   
        const conversation = await conversationModel.findOne({
            participants : {$all : [senderID, receiverID]}
        }).populate("messages")
  

        return res.status(200).json(conversation?.messages )
    } catch (error) {
     
        console.log( error);
        res.status(500).json({
            success: false,
            message: "error in sending a message"
          
        })
    }
}
