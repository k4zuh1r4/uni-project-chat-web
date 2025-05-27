import { create } from "zustand"
import toast from "react-hot-toast"
import { axiosInstance } from "./axios.js"
import { useAuthStore } from "./authStore.js"
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

            if (!selectedUser?._id) {
                toast.error("No user selected");
                return;
            }

            try {
                const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData)
                set({ messages: [...messages, res.data] })
                return res.data;
            } catch (error) {
                const errorMsg = error.response?.data?.message || error.message;
                toast.error("Error sending message: " + errorMsg);
                throw error;
            }
        },
        listenToMessages: () => {
            const { selectedUser } = get()
            if (!selectedUser) return
            const socket = useAuthStore.getState().socket
            //todo
            socket.on("newMessage", (newMessage) => {
                set({
                    messages: [...get().messages, newMessage]
                });
            });
        },
        unlistenMessages: () => {
            const socket = useAuthStore.getState().socket
            socket.off("newMessage");
        },
        setSelectedUser: (user) => {
            set({ selectedUser: user })
        },
    }))