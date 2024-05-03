import mongoose from "mongoose"

const connectionDB = async() => {
    try {
        const connectDB = await mongoose.connect(process.env.MONGODB_URI )
        console.log(`MONGODB connect to database successfully${connectDB.connection.host}`);
    } catch (error) {
        console.log(`MONGODB connection failed`);
    }
}


export default connectionDB