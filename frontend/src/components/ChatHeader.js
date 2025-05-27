import { useAuthStore } from '@/lib/authStore'
import { useMessageStore } from '@/lib/messageStore'
import React from 'react'
import { ArrowLeft, MoreVertical } from 'lucide-react'
export const ChatHeader = () => {
    const { selectedUser, setSelectedUser } = useMessageStore()
    const { onlineUsers } = useAuthStore()
    if (!selectedUser) return null

    const isOnline = onlineUsers.includes(selectedUser._id)

    return (
        <div className="border-b border-base-300 p-3 flex items-center gap-3">
            {/* Back button - only visible on mobile */}
            <button
                onClick={() => setSelectedUser(null)}
                className="lg:hidden p-1 rounded-full hover:bg-base-300"
            >
                <ArrowLeft size={20} />
            </button>

            {/* User avatar */}
            <div className="relative">
                <img
                    src={selectedUser.profilePicture || selectedUser.avatar || "/avatar.png"}
                    alt={selectedUser.fullName || "User"}
                    className="size-10 object-cover rounded-full bg-base-200"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/avatar.png";
                    }}
                />
                {isOnline && (
                    <span className="absolute bottom-0 right-0 size-2.5 bg-green-500 rounded-full ring-2 ring-base-100" />
                )}
            </div>

            {/* User info */}
            <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{selectedUser.fullName}</h3>
                <p className="text-sm text-zinc-400">
                    {isOnline ? "Online" : "Offline"}
                </p>
            </div>

            {/* Actions menu */}
            <button className="p-2 rounded-full hover:bg-base-300">
                <MoreVertical size={20} />
            </button>
        </div>
    )
}
