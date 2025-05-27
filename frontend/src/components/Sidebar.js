import React, { useEffect } from 'react'
import { Users } from 'lucide-react';
import { useMessageStore } from '@/lib/messageStore'
import { useAuthStore } from '@/lib/authStore';
const SidebarSkeleton = () => {
    const skeletonContacts = Array(8).fill(null);

    return (
        <aside
            className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
            {/* Header */}
            <div className="border-b border-base-300 w-full p-5">
                <div className="flex items-center gap-2">
                    <Users className="w-6 h-6" />
                    <span className="font-medium hidden lg:block">Contacts</span>
                </div>
            </div>
            <div className="overflow-y-auto w-full py-3">
                {skeletonContacts.map((_, idx) => (
                    <div key={idx} className="w-full p-3 flex items-center gap-3">
                        {/* Avatar skeleton */}
                        <div className="relative mx-auto lg:mx-0">
                            <div className="skeleton size-12 rounded-full" />
                        </div>

                        {/* User info skeleton - only visible on larger screens */}
                        <div className="hidden lg:block text-left min-w-0 flex-1">
                            <div className="skeleton h-4 w-32 mb-2" />
                            <div className="skeleton h-3 w-16" />
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    );
};
export const Sidebar = () => {
    const { getUsers, users, selectedUser, setSelectedUser, isUserLoading } = useMessageStore()
    const { onlineUsers } = useAuthStore()
    useEffect(() => {
        getUsers()
    }, [getUsers])
    if (isUserLoading) return <SidebarSkeleton />
    return (
        <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
            <div className="border-b border-base-300 w-full p-5">
                <div className="flex items-center gap-2">
                    <Users className="w-6 h-6" />
                    <span className="font-medium hidden lg:block">Contacts</span>
                </div>
            </div>
            <div className="overflow-y-auto w-full py-3">
                {users.map((user) => (
                    <button
                        key={user._id}
                        onClick={() => setSelectedUser(user)}
                        className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}`}
                    >
                        <div className="relative mx-auto lg:mx-0">
                            <img
                                src={user.profilePicture || "/avatar.png"}
                                alt={user.fullName || "User"}
                                className="size-12 object-cover rounded-full bg-base-200"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "/avatar.png";
                                }}
                            />
                            {onlineUsers.includes(user._id) && (
                                <span
                                    className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900"
                                />
                            )}
                        </div>
                        <div className="hidden lg:block text-left min-w-0">
                            <div className="font-medium truncate">{user.fullName}</div>
                            <div className="text-sm text-zinc-400">
                                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                            </div>
                        </div>
                    </button>
                ))}
                {users.length === 0 && (
                    <div className="text-center text-zinc-500 py-4">No online users</div>
                )}
            </div>
        </aside>
    )
}