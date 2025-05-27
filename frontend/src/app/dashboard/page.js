'use client'
import { MessageNavbar } from '@/components/messageNavbar.js'
import { useMessageStore } from '@/lib/messageStore'
import { NoChatSelected } from '@/components/NoChatSelected.js'
import { ChatWindow } from '@/components/ChatWindow.js'
import { Sidebar } from '@/components/Sidebar.js'
import React from 'react'

export default function UserDashboard() {
    const { selectedUser } = useMessageStore()
    return (
        <>
            <div>
                <MessageNavbar />
            </div>
            <div className="h-fit bg-base-200">
                <div className="flex items-center justify-center pt-2 px-4 py-2">
                    <div className="bg-base-100 rounded-lg w-full h-fit shadow-lg">
                        <div className="flex h-fit rounded-lg overflow-hidden">
                            <Sidebar />
                            {!selectedUser ? <NoChatSelected /> : <ChatWindow />}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
