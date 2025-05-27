'use client'
import { MessageNavbar } from '@/components/messageNavbar.js'
import { useMessageStore } from '@/lib/messageStore'
import { NoChatSelected } from '@/components/NoChatSelected.js'
import { ChatWindow } from '@/components/ChatWindow.js'
import { Sidebar } from '@/components/Sidebar.js'

export default function UserDashboard() {
    const { selectedUser } = useMessageStore()
    return (
        <div className="flex flex-col h-screen">
            <MessageNavbar />
            <div className="flex-1 p-4 overflow-hidden bg-base-200">
                <div className="h-full bg-base-100 rounded-lg shadow-lg overflow-hidden">
                    <div className="flex h-full">
                        <Sidebar />
                        {!selectedUser ? <NoChatSelected /> : <ChatWindow />}
                    </div>
                </div>
            </div>
        </div>
    )
}