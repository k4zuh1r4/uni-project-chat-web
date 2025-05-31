import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

export const sendOTPEmail = async (email, otp, fullName) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Email Verification - OTP Code',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Welcome to Chat App, ${fullName}!</h2>
                <p>Your OTP verification code is:</p>
                <div style="background-color: #f4f4f4; padding: 20px; 
                text-align: center; font-size: 24px; 
                font-weight: bold; letter-spacing: 5px; 
                margin: 20px 0;">
                    ${otp}
                </div>
                <p>This code will expire in 10 minutes.</p>
                <p>If you didn't request this code, please ignore this email.</p>
            </div>
        `
    }
    return transporter.sendMail(mailOptions)
}