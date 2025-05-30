import User from "../models/user.model.js";
import { getReceiverSocketID, io } from "../lib/socket.js";

// Send friend request
export const sendFriendRequest = async (req, res) => {
    try {
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        // Check if users exist
        const receiver = await User.findById(receiverId);
        if (!receiver) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if request already sent
        if (receiver.friendRequests.includes(senderId)) {
            return res.status(400).json({ message: "Friend request already sent" });
        }

        // Check if already friends
        if (receiver.friends.includes(senderId)) {
            return res.status(400).json({ message: "Already friends" });
        }

        // Add friend request
        await User.findByIdAndUpdate(receiverId, {
            $push: { friendRequests: senderId }
        });

        // Notify the receiver through socket if online
        const receiverSocketID = getReceiverSocketID(receiverId);
        if (receiverSocketID) {
            io.to(receiverSocketID).emit("newFriendRequest", {
                requestFrom: req.user
            });
        }

        res.status(200).json({ message: "Friend request sent" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get friend requests
export const getFriendRequests = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId).populate("friendRequests", "fullName email profilePicture");

        res.status(200).json(user.friendRequests);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Accept friend request
export const acceptFriendRequest = async (req, res) => {
    try {
        const { id: requesterId } = req.params;
        const userId = req.user._id;

        // Check if request exists
        const user = await User.findById(userId);
        if (!user.friendRequests.includes(requesterId)) {
            return res.status(400).json({ message: "No friend request from this user" });
        }

        // Add each user to the other's friends list
        await User.findByIdAndUpdate(userId, {
            $pull: { friendRequests: requesterId },
            $push: { friends: requesterId }
        });

        await User.findByIdAndUpdate(requesterId, {
            $push: { friends: userId }
        });

        // Notify the requester through socket if online
        const requesterSocketID = getReceiverSocketID(requesterId);
        if (requesterSocketID) {
            io.to(requesterSocketID).emit("friendRequestAccepted", {
                acceptedBy: req.user
            });
        }

        res.status(200).json({ message: "Friend request accepted" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Reject friend request
export const rejectFriendRequest = async (req, res) => {
    try {
        const { id: requesterId } = req.params;
        const userId = req.user._id;

        await User.findByIdAndUpdate(userId, {
            $pull: { friendRequests: requesterId }
        });

        res.status(200).json({ message: "Friend request rejected" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get friends list
export const getFriends = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId).populate("friends", "fullName email profilePicture");

        res.status(200).json(user.friends);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Remove friend
export const removeFriend = async (req, res) => {
    try {
        const { id: friendId } = req.params;
        const userId = req.user._id;

        // Remove from both users' friend lists
        await User.findByIdAndUpdate(userId, {
            $pull: { friends: friendId }
        });

        await User.findByIdAndUpdate(friendId, {
            $pull: { friends: userId }
        });

        res.status(200).json({ message: "Friend removed" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};