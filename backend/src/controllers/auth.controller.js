import { generateToken } from "../lib/utils.js"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
export const register = async (req, res) => {
    const { fullName, email, password } = req.body
    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }
        else if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" })
        }
        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({ message: "User with this email already exists" })
        }
        const density = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, density)
        const newUser = new User(
            {
                fullName,
                email,
                password: hashedPassword
            })
        if (newUser) {
            generateToken(newUser._id, res)
            await newUser.save()
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePicture: newUser.profilePicture
            })
        }
        else {
            res.status(400).json({ message: "Invalid user data" })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
    }
}
export const login = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email })
        if (!user) {
            res.status(400).json({ message: "Invalid email or password" })
        }
        else {
            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) {
                res.status(400).json({ message: "Invalid email or password" })
            }
            else
                if (isMatch) {
                    generateToken(user._id, res)
                    res.status(200).json({
                        _id: user._id,
                        fullName: user.fullName,
                        email: user.email,
                        profilePicture: user.profilePicture
                    })
                }
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
    }
}
export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 })
        res.status(200).json({ message: "Logged out successfully" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
    }
}
export const updateProfile = async (req, res) => {
    try {
        const { profilePicture } = req.body
        const user = req.user._id
        if (!profilePicture) {
            return res.status(400).json({ message: "Profile picture is required" })
        }
        const uploadResponse = await cloudinary.uploader.upload(profilePicture)
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
    }
}
export const checkAuth = async (req, res) => {
    try {
        res.status(200).json(req.user)
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
    }
}
