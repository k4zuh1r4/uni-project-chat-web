import { create } from "zustand"
import { axiosInstance } from "./axios.js"
import toast from "react-hot-toast"
import { io } from "socket.io-client"

const BASE_URL = "http://localhost:5001";
export const useAuthStore = create((set, get) => ({
    authUser: null,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,
    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check")
            if (res.status === 200) {
                set({ authUser: res.data })
                get().connectSocket()
            }
            else if (res.status === 401) {
                console.log("User not authenticated")
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                set({ authUser: null });
                toast.error("Session expired. Please log in again.");
            } else {
                console.error("Error checking authentication:", error);
            }
        } finally {
            set({ isCheckingAuth: false })
        }
    },
    register: async (data) => {
        set({ isRegistering: true })
        try {
            const res = await axiosInstance.post("/auth/register", data)
            set({ authUser: res.data })
            toast.success("Registration successful")
            get().connectSocket()
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Registration failed"
            toast.error(errorMessage)
            console.error("Registration error:", error)
        } finally {
            set({ isRegistering: false })
        }
    },
    login: async (data) => {
        set({ isLoggingIn: true })
        try {
            const res = await axiosInstance.post("/auth/login", data)
            set({ authUser: res.data })
            toast.success("Logged in successfully")
            get().connectSocket()
        } catch (error) {
            toast.error("Error logging in:", error)
        } finally {
            set({ isLoggingIn: false })
        }
    },
    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout")
            set({ authUser: null })
            get().disconnectSocket()
            toast.success("Logged out successfully")
        } catch (error) {
            toast.error("Error logging out:", error.response.data.message)
        }
    },
    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put("/auth/update-profile", data);
            set({ authUser: res.data });
            toast.success("Profile updated successfully");
        } catch (error) {
            console.error("Error in update profile:", error);

            if (error.response) {
                const errorMessage = error.response.data.message || "Failed to update profile";
                toast.error(errorMessage);
            } else if (error.request) {

                toast.error("No response from server. Check your connection.");
            } else {
                toast.error("Error updating profile. Please try again.");
            }
        } finally {
            set({ isUpdatingProfile: false });
        }
    },
    connectSocket: () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected) return
        const socket = io(BASE_URL, {
            query: { userID: authUser._id },
        })
        socket.connect()
        set({ socket: socket })
        socket.on("getOnlineUsers", (users) => {
            set({ onlineUsers: users })
        })
    },
    disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
    },
}))