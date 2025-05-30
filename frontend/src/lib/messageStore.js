import { create } from "zustand"
import toast from "react-hot-toast"
import { axiosInstance } from "./axios.js"
import { useAuthStore } from "./authStore.js"

export const useMessageStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({ isUsersLoading: true })
        try {
            const res = await axiosInstance.get("/messages/users")
            set({ users: res.data })
        } catch (error) {
            toast.error("Error fetching users: " + (error.response?.data?.message || error.message))
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
            toast.error("Error fetching messages: " + (error.response?.data?.message || error.message))
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
        const { selectedUser } = get();
        if (!selectedUser) {
            console.log("No user selected for message listening");
            return;
        }

        const socket = useAuthStore.getState().socket;
        if (!socket) {
            console.error("Socket is not initialized in messageStore.listenToMessages");

            // Try to attach listeners once socket becomes available
            const checkSocketInterval = setInterval(() => {
                const updatedSocket = useAuthStore.getState().socket;
                if (updatedSocket) {
                    console.log("Socket now available, setting up message listeners");
                    clearInterval(checkSocketInterval);

                    updatedSocket.on("newMessage", (newMessage) => {
                        console.log("New message received:", newMessage);
                        set({
                            messages: [...get().messages, newMessage]
                        });
                    });
                }
            }, 1000); // Check every second

            // Store the interval ID to clear it later if needed
            set({ socketCheckInterval: checkSocketInterval });
            return;
        }

        console.log("Setting up message listeners...");
        socket.on("newMessage", (newMessage) => {
            console.log("New message received:", newMessage);
            set({
                messages: [...get().messages, newMessage]
            });
        });
    },

    unlistenMessages: () => {
        const socket = useAuthStore.getState().socket;
        if (!socket) {
            console.log("No socket available when trying to unlisten messages");
            return;
        }

        console.log("Removing message listeners");
        socket.off("newMessage");

        // Clear any interval if it exists
        const { socketCheckInterval } = get();
        if (socketCheckInterval) {
            clearInterval(socketCheckInterval);
            set({ socketCheckInterval: null });
        }
    },

    setSelectedUser: (user) => {
        set({ selectedUser: user });
    },
}))