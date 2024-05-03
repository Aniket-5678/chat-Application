import {userModel} from "../models/user.model.js"
import bcrypt from "bcrypt"
import JWT from "jsonwebtoken"


//Register controller

export const register = async(req, res) => {
 try {
    const {fullName, username, password, confirmPassword , gender} = req.body
   // validation
   if ( !fullName || !username || !password || !confirmPassword  || !gender) {
       return res.status(400).json({
        success: false,
        message: "All fields Required"
       })
   }

   if (password !== confirmPassword) {
    return res.status(400).json({
        success: false,
        message: "password do not match "
    })
   }
     const existeduser = await userModel.findOne({username})
     if (existeduser) {
        return res.status(400).json({
            success: false,
            message: "username already exist try diffrent"
        })
     }
   
     const hashedPassword = await bcrypt.hash(password, 10)

     const maleProfilePhoto = `https://avatar.iran.liara.run/public/boy?username=${username}`
     const femaleProfilePhoto = `https://avatar.iran.liara.run/public/girl=${username}`

     const user = await userModel.create({
        fullName,
        username,
        password: hashedPassword,
        profilePhoto : gender === "male" ? maleProfilePhoto: femaleProfilePhoto ,
        gender
     })

     res.status(200).json({
        success: true,
        message: "user Register successfully",
        user
     })


 } catch (error) {
    console.log(error);
   res.status(500).json({
    success: false,
    message: "error in user Registeration"
   })
 }

}


// Login controller

export const login = async(req, res) => {
try {
    const {username, password} = req.body
    
    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: "All fields Required"
           })
    }

const user = await userModel.findOne({username})
if (!user) {
    return res.status(400).json({
        success:false,
        message: "incorrect userName and password"
    })
}

const isPasswordMatch = await bcrypt.compare(password, user.password)

if (!isPasswordMatch) {
    return res.status(400).json({
        success: false,
        message: "Invalid password"
    })
}

const tokenData = {
    userID: user._id
}

const token = await JWT.sign(tokenData, process.env.JWT_SCERET , {expiresIn: "1d"})

 res.status(200).cookie("token", token, {maxAge:1*24*60*60*1000, httpOnly:true, sameSite: 'strict'}).json({
    success: true,
    message: "login successfully",
    _id: user._id,
    username: user.username,
    fullName: user.fullName,
    profilePhoto: user.profilePhoto,
    token,
  
 })

 

} catch (error) {
    console.log(error);
    res.status(500).json({
        success: false,
        message: "error in Login"
       })
    
}

}



// Logout controller

export  const logout = async(req, res) => {
    try {
        res.status(200).cookie("token ",  ""  ,{maxAge:0}).json({
            success: true,
            message: "logged out successfully"
        }) 

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "error in Logout"
           })
    }
}


export const getOtheruser = async(req, res) => {
try {
    const loggedinUserId = req.id
const otherUser = await userModel.find({_id: {$ne: loggedinUserId }}).select("-password")

res.status(200).json(otherUser)

} catch (error) {
    console.log(error);
}
}