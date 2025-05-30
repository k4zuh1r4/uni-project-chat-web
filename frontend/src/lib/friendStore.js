import { create } from "zustand"
import toast from "react-hot-toast"
import { axiosInstance } from "./axios.js"
import { useAuthStore } from "./authStore.js"

export const useFriendStore = create((set, get) => ({
    friends: [],
    friendRequests: [],
    isFriendsLoading: false,
    isRequestsLoading: false,
    isActionInProgress: false,

    getFriends: async () => {
        set({ isFriendsLoading: true })
        try {
            const res = await axiosInstance.get("/friends")
            set({ friends: res.data })
        } catch (error) {
            toast.error("Error fetching friends: " + error.response?.data?.message || error.message)
        } finally {
            set({ isFriendsLoading: false })
        }
    },
    getFriendRequests: async () => {
        set({ isRequestsLoading: true })
        try {
            const res = await axiosInstance.get("/friends/requests")
            set({ friendRequests: res.data })
        } catch (error) {
            toast.error("Error fetching friend requests: " + error.response?.data?.message || error.message)
        } finally {
            set({ isRequestsLoading: false })
        }
    },
    sendFriendRequest: async (userId) => {
        set({ isActionInProgress: true })
        try {
            console.log("Sending friend request to:", userId);
            await axiosInstance.post(`/friends/request/${userId}`)
            toast.success("Friend request sent successfully")
        } catch (error) {
            console.error("Error sending friend request:", error);
            toast.error("Error sending friend request: " + (error.response?.data?.message || error.message))
            throw error
        } finally {
            set({ isActionInProgress: false })
        }
    },
    acceptFriendRequest: async (userId) => {
        set({ isActionInProgress: true })
        try {
            await axiosInstance.post(`/friends/accept/${userId}`)

            // Update local state by removing from requests and adding to friends
            const { friendRequests, friends } = get()
            const acceptedUser = friendRequests.find(user => user._id === userId)

            if (acceptedUser) {
                set({
                    friendRequests: friendRequests.filter(user => user._id !== userId),
                    friends: [...friends, acceptedUser]
                })
            } else {
                // If not found in local state, refresh the lists
                get().getFriendRequests()
                get().getFriends()
            }

            toast.success("Friend request accepted")
        } catch (error) {
            toast.error("Error accepting friend request: " + error.response?.data?.message || error.message)
            throw error
        } finally {
            set({ isActionInProgress: false })
        }
    },
    rejectFriendRequest: async (userId) => {
        set({ isActionInProgress: true })
        try {
            await axiosInstance.post(`/friends/reject/${userId}`)

            // Update local state
            const { friendRequests } = get()
            set({
                friendRequests: friendRequests.filter(user => user._id !== userId)
            })

            toast.success("Friend request rejected")
        } catch (error) {
            toast.error("Error rejecting friend request: " + error.response?.data?.message || error.message)
            throw error
        } finally {
            set({ isActionInProgress: false })
        }
    },
    removeFriend: async (userId) => {
        set({ isActionInProgress: true })
        try {
            await axiosInstance.delete(`/friends/${userId}`)

            // Update local state
            const { friends } = get()
            set({
                friends: friends.filter(user => user._id !== userId)
            })

            toast.success("Friend removed successfully")
        } catch (error) {
            toast.error("Error removing friend: " + error.response?.data?.message || error.message)
            throw error
        } finally {
            set({ isActionInProgress: false })
        }
    },


    listenToFriendEvents: () => {
        const socket = useAuthStore.getState().socket;
        if (!socket) {
            console.error("Socket is not initialized in friendStore.listenToFriendEvents");
            return;
        }

        console.log("Setting up friend event listeners...");

        // Listen for new friend requests
        socket.on("newFriendRequest", (data) => {
            console.log("New friend request received:", data)
            toast.success(`New friend request from ${data.requestFrom.fullName}`)
            get().getFriendRequests()
        })

        // Listen for accepted friend requests
        socket.on("friendRequestAccepted", (data) => {
            console.log("Friend request accepted:", data)
            toast.success(`${data.acceptedBy.fullName} accepted your friend request`)
            get().getFriends()
        })
    },

    unlistenFriendEvents: () => {
        const socket = useAuthStore.getState().socket
        if (!socket) return;

        socket.off("newFriendRequest")
        socket.off("friendRequestAccepted")
    }
}))