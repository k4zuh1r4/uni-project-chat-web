import Message from "../models/message.model.js"
import User from "../models/user.model.js"
import cloudinary from "../lib/cloudinary.js"
import { getReceiverSocketID } from "../lib/socket.js"
import { io } from "../lib/socket.js"

export const sidebarList = async (req, res) => {
    try {
        const selfID = req.user._id
        // Get user with populated friends
        const user = await User.findById(selfID).populate("friends", "-password")

        // Return only friends instead of all users
        res.status(200).json(user.friends)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: "Internal server error" })
    }
}

export const getMessages = async (req, res) => {
    try {
        const { id: targetID } = req.params
        const senderID = req.user._id

        // Check if users are friends
        const user = await User.findById(senderID)
        if (!user.friends.includes(targetID)) {
            return res.status(403).json({ message: "You can only view messages from friends" })
        }

        const messages = await Message.find({
            $or: [
                { senderID, receiverID: targetID },
                { senderID: targetID, receiverID: senderID }
            ]
        }).sort({ createdAt: 1 })
        res.status(200).json(messages)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: "Internal server error" })
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { text, media } = req.body
        const { id: receiverID } = req.params
        const senderID = req.user._id

        // Check if users are friends
        const user = await User.findById(senderID)
        if (!user.friends.includes(receiverID)) {
            return res.status(403).json({ message: "You can only send messages to friends" })
        }

        let mediaURL;
        if (media) {
            const uploadResponse = await cloudinary.uploader.upload(media)
            mediaURL = uploadResponse.secure_url
        }
        const newMessage = new Message({
            senderID,
            receiverID,
            text,
            media: mediaURL
        })
        await newMessage.save()
        const receiverSocketID = getReceiverSocketID(receiverID)
        if (receiverSocketID) {
            io.to(receiverSocketID).emit("newMessage", newMessage)
        }
        res.status(201).json(newMessage)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: "Internal server error" })
    }
}