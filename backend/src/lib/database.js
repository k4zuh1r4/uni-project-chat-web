import mongoose from "mongoose"
export const OpenConnection = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGODB_STRING)
        console.log(`Connected to database: ${connection.connection.host}`)
    } catch (error) {
        console.log(`Error connecting to database: ${error}`)
    }
}
