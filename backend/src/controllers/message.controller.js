import Message from "../models/message.model.js"
import User from "../models/user.model.js"
export const sidebarList = async (req, res) => {
    try {
        const selfID = req.user._id
        const filteredList = await User.find({ _id: { $ne: selfID } }).select("-password")
        res.status(200).json(filteredList)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: "Internal server error" })
    }
}
export const getMessages = async (req, res) => {
    try {
        const { id: targetID } = req.params
        const senderID = req.user._id

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
        res.status(201).json(newMessage)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: "Internal server error" })
    }
}