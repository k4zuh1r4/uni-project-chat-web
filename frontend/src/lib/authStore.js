import { create } from "zustand"
import { axiosInstance } from "./axios.js"
import toast from "react-hot-toast"
import { io } from "socket.io-client"

const BASE_URL = "http://localhost:5001";
export const useAuthStore = create((set, get) => ({
    authUser: null,
    isLoggingIn: false,
    isRegistering: false,
    isVerifyingOTP: false,
    isResendingOTP: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,
    pendingVerification: null, // Store user data for OTP verification

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

            // Store pending verification data
            set({
                pendingVerification: {
                    userId: res.data.userId,
                    email: res.data.email,
                    message: res.data.message
                }
            })

            toast.success("Registration successful! Please check your email for OTP.")
            return { success: true, requiresVerification: true }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Registration failed"
            toast.error(errorMessage)
            console.error("Registration error:", error)
            return { success: false }
        } finally {
            set({ isRegistering: false })
        }
    },

    verifyOTP: async (otp) => {
        set({ isVerifyingOTP: true })
        try {
            const { pendingVerification } = get()

            if (!pendingVerification?.userId) {
                toast.error("No pending verification found")
                return { success: false }
            }

            const res = await axiosInstance.post("/auth/verify-otp", {
                userId: pendingVerification.userId,
                otp: otp
            })

            // Set authenticated user and connect socket
            set({
                authUser: res.data.user,
                pendingVerification: null
            })

            toast.success("Email verified successfully! You are now logged in.")
            get().connectSocket()
            return { success: true }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "OTP verification failed"
            toast.error(errorMessage)
            console.error("OTP verification error:", error)
            return { success: false }
        } finally {
            set({ isVerifyingOTP: false })
        }
    },

    resendOTP: async () => {
        set({ isResendingOTP: true })
        try {
            const { pendingVerification } = get()

            if (!pendingVerification?.userId) {
                toast.error("No pending verification found")
                return { success: false }
            }

            await axiosInstance.post("/auth/resend-otp", {
                userId: pendingVerification.userId
            })

            toast.success("OTP sent successfully! Please check your email.")
            return { success: true }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to resend OTP"
            toast.error(errorMessage)
            console.error("Resend OTP error:", error)
            return { success: false }
        } finally {
            set({ isResendingOTP: false })
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true })
        try {
            const res = await axiosInstance.post("/auth/login", data)
            set({ authUser: res.data })
            toast.success("Logged in successfully")
            get().connectSocket()
            return { success: true }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Login failed"

            // Check if user needs email verification
            if (error.response?.data?.requiresVerification) {
                set({
                    pendingVerification: {
                        userId: error.response.data.userId,
                        email: data.email,
                        message: errorMessage
                    }
                })
                toast.error(errorMessage)
                return { success: false, requiresVerification: true }
            }

            toast.error(errorMessage)
            return { success: false }
        } finally {
            set({ isLoggingIn: false })
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout")
            set({
                authUser: null,
                pendingVerification: null
            })
            get().disconnectSocket()
            toast.success("Logged out successfully")
        } catch (error) {
            toast.error("Error logging out:", error.response?.data?.message || "Logout failed")
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