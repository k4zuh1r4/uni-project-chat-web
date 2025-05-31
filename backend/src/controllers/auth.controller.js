import { generateToken } from "../lib/utils.js"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import cloudinary from "../lib/cloudinary.js"
import { sendOTPEmail } from "../lib/mail.js"
import crypto from 'crypto'

export const register = async (req, res) => {
    const { fullName, email, password } = req.body
    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }
        else if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" })
        }

        const existingUser = await User.findOne({ email })
        if (existingUser && existingUser.isVerified) {
            return res.status(400).json({ message: "User with this email already exists" })
        }

        const density = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, density)

        // Generate 6-digit OTP
        const otp = crypto.randomInt(100000, 999999).toString()
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

        let user
        if (existingUser && !existingUser.isVerified) {
            // Update existing unverified user
            user = await User.findByIdAndUpdate(existingUser._id, {
                fullName,
                password: hashedPassword,
                otp,
                otpExpires
            }, { new: true })
        } else {
            // Create new user
            user = new User({
                fullName,
                email,
                password: hashedPassword,
                otp,
                otpExpires,
                isVerified: false
            })
            await user.save()
        }

        // Send OTP email
        await sendOTPEmail(email, otp, fullName)

        res.status(201).json({
            message: "Registration successful. Please check your email for OTP verification.",
            userId: user._id,
            email: user.email
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
    }
}

export const verifyOTP = async (req, res) => {
    const { userId, otp } = req.body
    try {
        if (!userId || !otp) {
            return res.status(400).json({ message: "User ID and OTP are required" })
        }

        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        if (user.isVerified) {
            return res.status(400).json({ message: "User is already verified" })
        }

        if (!user.otp || !user.otpExpires) {
            return res.status(400).json({ message: "No OTP found. Please request a new one." })
        }

        if (new Date() > user.otpExpires) {
            return res.status(400).json({ message: "OTP has expired. Please request a new one." })
        }

        if (user.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" })
        }

        // Verify user and clear OTP
        user.isVerified = true
        user.otp = null
        user.otpExpires = null
        await user.save()

        // Generate token and log user in
        generateToken(user._id, res)

        res.status(200).json({
            message: "Email verified successfully",
            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                profilePicture: user.profilePicture,
                isVerified: user.isVerified
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
    }
}

export const resendOTP = async (req, res) => {
    const { userId } = req.body
    try {
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        if (user.isVerified) {
            return res.status(400).json({ message: "User is already verified" })
        }

        // Generate new OTP
        const otp = crypto.randomInt(100000, 999999).toString()
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

        user.otp = otp
        user.otpExpires = otpExpires
        await user.save()

        // Send OTP email
        await sendOTPEmail(user.email, otp, user.fullName)

        res.status(200).json({ message: "OTP sent successfully" })
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
            return res.status(400).json({ message: "Invalid email or password" })
        }

        if (!user.isVerified) {
            return res.status(400).json({
                message: "Please verify your email first",
                userId: user._id,
                requiresVerification: true
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" })
        }

        generateToken(user._id, res)
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePicture: user.profilePicture,
            isVerified: user.isVerified
        })
    } catch (error) {
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
        const { profilePicture, fullName, email } = req.body;
        const userId = req.user._id;

        // Create an update object
        const updateData = {};

        // Handle profile picture upload if provided
        if (profilePicture) {
            try {
                // Check if the image is too large (limit to ~10MB)
                if (profilePicture.length > 10000000) {
                    return res.status(400).json({ message: "Profile picture is too large. Please use an image under 10MB." });
                }

                // Upload to cloudinary with specific options
                const uploadResponse = await cloudinary.uploader.upload(profilePicture, {
                    folder: "user_profiles",
                    resource_type: "image",
                    allowed_formats: ["jpg", "png", "jpeg", "gif"],
                    transformation: [{ width: 500, height: 500, crop: "limit" }]
                });

                updateData.profilePicture = uploadResponse.secure_url;
            } catch (cloudinaryError) {
                console.error("Cloudinary upload error:", cloudinaryError);
                return res.status(400).json({
                    message: "Failed to upload profile picture. Please try a different image."
                });
            }
        }

        // Add other fields if provided
        if (fullName) updateData.fullName = fullName;
        if (email) updateData.email = email;

        // Only proceed if there's something to update
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "No update data provided" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            _id: updatedUser._id,
            fullName: updatedUser.fullName,
            email: updatedUser.email,
            profilePicture: updatedUser.profilePicture
        });
    } catch (error) {
        console.error("Error in update profile:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}
export const checkAuth = async (req, res) => {
    try {
        res.status(200).json(req.user)
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" })
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
    }
}
