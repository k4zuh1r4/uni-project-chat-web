import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import {
    sendFriendRequest,
    getFriendRequests,
    acceptFriendRequest,
    rejectFriendRequest,
    getFriends,
    removeFriend
} from '../controllers/friend.controller.js';

const router = express.Router();

// Friend requests
router.post("/request/:id", protectRoute, sendFriendRequest);
router.get("/requests", protectRoute, getFriendRequests);
router.post("/accept/:id", protectRoute, acceptFriendRequest);
router.post("/reject/:id", protectRoute, rejectFriendRequest);

// Friends management
router.get("/", protectRoute, getFriends);
router.delete("/:id", protectRoute, removeFriend);

export default router;