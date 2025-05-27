import { useMessageStore } from '@/lib/messageStore'
import React, { useEffect } from 'react'
import { ChatHeader } from './ChatHeader'
import { MessageInput } from './MessageInput'
import { LoadMessage } from './LoadMessage'
import { useAuthStore } from '@/lib/authStore'
import { formatMessageTime } from '@/utils/utils'

export const ChatWindow = () => {
    const { messages, getMessages, selectedUser, isMessagesLoading, listenToMessages, unlistenMessages } = useMessageStore()
    const { authUser } = useAuthStore()
    const messagesEndRef = React.useRef(null)

    React.useEffect(() => {
        if (selectedUser) {
            getMessages(selectedUser._id)
            listenToMessages()
            return () => {
                unlistenMessages()
            }
        }
    }, [selectedUser, getMessages, listenToMessages, unlistenMessages])

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages])

    if (isMessagesLoading) return <LoadMessage />

    return (
        <div className="flex-1 flex flex-col h-full">
            <ChatHeader />
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                    <div className="text-center text-zinc-500 py-4">
                        No messages yet.
                    </div>
                )}
                {messages.map((message) => (
                    <div
                        key={message._id}
                        className={`chat ${message.senderID === authUser._id ? "chat-end" : "chat-start"}`}
                    >
                        <div className="chat-image avatar">
                            <div className="size-10 rounded-full border">
                                <img
                                    src={
                                        message.senderID === authUser._id
                                            ? authUser.profilePicture || "/avatar.png"
                                            : selectedUser.profilePicture || "/avatar.png"
                                    }
                                    alt="profile pic"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "/avatar.png";
                                    }}
                                />
                            </div>
                        </div>
                        <div className="chat-header mb-1">
                            <time className='text-xs opacity-50'>
                                {formatMessageTime(message.createdAt)}
                            </time>
                        </div>
                        <div className="chat-bubble flex flex-col">
                            {message.media && (
                                <img
                                    src={message.media}
                                    alt="Attachment"
                                    className="sm:max-w-[200px] rounded-md mb-2"
                                />
                            )}
                            {message.text && <p>{message.text}</p>}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <MessageInput />
        </div>
    )
}