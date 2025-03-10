import jwt from "jsonwebtoken"
import User from "../models/user.model.js"
export const protectRoute = async (req, res, next) => {
    const token = req.cookies.jwt
    try {
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        const decoded = jwt.verify(token, process.env.TOKEN_KEY)
        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        const user = await User.findById(decoded.userID).select("-password")
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        req.user = user
        next()
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
    }
}