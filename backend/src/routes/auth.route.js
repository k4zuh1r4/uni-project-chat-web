import express from "express"
import { login, logout, register } from "../controllers/auth.controller.js"
import { protectRoute } from "../middleware/auth.middleware.js"
import { updateProfile } from "../controllers/auth.controller.js"
const router = express.Router()

router.post("/register", register)
router.post("/login", login)
router.post("/logout", logout)

router.put("/update-profile", protectRoute, updateProfile)
export default router