import { create } from "zustand"
import toast from "react-hot-toast"
import { axiosInstance } from "./axios.js"

export const useMessageStore = create((set, get) => (
    {
        messages: [],
        users: [],
        selectedUser: null,
        isUsersLoading: false,
        isMessagesLoading: false,
        isMessagesLoading: false,

        getUsers: async () => {
            set({ isUsersLoading: true })
            try {
                const res = await axiosInstance.get("/messages/users")
                set({ users: res.data })
            } catch (error) {
                toast.error("Error fetching users: " + error.response.data.message || error.message)
            } finally {
                set({ isUsersLoading: false })
            }
        },
        getMessages: async (userID) => {
            set({ isMessagesLoading: true })
            try {
                const res = await axiosInstance.get(`/messages/${userID}`)
                set({ messages: res.data })
            } catch (error) {
                toast.error("Error fetching messages: " + error.response.data.message || error.message)
            } finally {
                set({ isMessagesLoading: false })
            }
        },
        sendMessage: async (messageData) => {
            const { selectedUser, messages } = get()
            try {
                const res = await axiosInstance.post(`/messages/${selectedUser._id}`, messageData)
                set({ messages: [...messages, res.data] })
            } catch (error) {
                toast.error("Error sending message: " + error.response.data.message || error.message)
            }
        },
        setSelectedUser: (user) => {
            set({ selectedUser: user })
        },
    }))