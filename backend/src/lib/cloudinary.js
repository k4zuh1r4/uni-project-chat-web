import { v2 as cloudinary } from 'cloudinary'
import { config } from 'dotenv'
config()
cloudinary.config({
    name: process.env.CLOUDINARY_CLOUD_NAME,
    key: process.env.CLOUDINARY_API_KEY,
    secret: process.env.CLOUDINARY_API_SECRET
})
export default cloudinary;