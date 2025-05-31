import express from "express"
import { checkAuth, login, logout, register, verifyOTP, resendOTP } from "../controllers/auth.controller.js"
import { protectRoute } from "../middleware/auth.middleware.js"
import { updateProfile } from "../controllers/auth.controller.js"

const router = express.Router()

router.post("/register", register)
router.post("/verify-otp", verifyOTP)
router.post("/resend-otp", resendOTP)
router.post("/login", login)
router.post("/logout", logout)
router.get("/check", protectRoute, checkAuth)
router.put("/update-profile", protectRoute, updateProfile)

export default router