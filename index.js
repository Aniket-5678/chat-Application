import express from "express"
import dotenv from "dotenv"
import connectionDB from "./db/db.js"
import userRoutes from "./routes/userRoutes.js"
import messageRoutes from "./routes/messageRoutes.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import morgan from "morgan"
import {app,  server} from "./socket/socketio.js"
 import path from "path"

 const __dirname = path.dirname(new URL(import.meta.url).pathname);

//dotenv configuration
dotenv.config()

// MONGODB connection



app.use(express.json())

app.use(cookieParser())
app.use(morgan('dev'))
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}))
 

app.use(express.static(path.join(__dirname, "./client/build")));

app.use('/api/v1/user',  userRoutes)
app.use('/api/v1/message',  messageRoutes)
 
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./client/build", "index.html"));
  });

server.listen(process.env.PORT , () => {
    connectionDB()
    console.log(`server is running on PORT ${process.env.PORT}`);
})

