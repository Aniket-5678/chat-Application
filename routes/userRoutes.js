import express from "express"
import { getOtheruser, login, logout, register } from "../controllers/userController.js"
import { isAuthenticated } from "../middlewear/isAuthenticated.js"


const router = express.Router()

router.post('/register' , register)

router.post('/login'  , login)

router.get('/logout', logout)

router.get('/', isAuthenticated, getOtheruser)

export default router