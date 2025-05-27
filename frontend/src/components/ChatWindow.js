import { useMessageStore } from '@/lib/messageStore'
import React from 'react'
import { ChatHeader } from './ChatHeader'
import { MessageInput } from './MessageInput'
import { LoadMessage } from './LoadMessage'
export const ChatWindow = () => {
    const { messages, getMessages, selectedUser, isMessagesLoading } = useMessageStore()
    React.useEffect(() => {
        if (selectedUser) {
            getMessages(selectedUser._id)
        }
    }, [selectedUser, getMessages])
    if (isMessagesLoading) return <LoadMessage />
    return (
        <div className="flex-1 flex flex-col overflow-y-auto p-4">
            <ChatHeader />
            <div className="flex-1 overflow-y-auto">
                {/* Display messages */}
            </div>
            <MessageInput />
        </div>
    )
}
