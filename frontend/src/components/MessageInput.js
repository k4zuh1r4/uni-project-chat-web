import React from 'react'
import { useState } from 'react'
import { useMessageStore } from '@/lib/messageStore'
import { Image, X, Send } from 'lucide-react'
export const MessageInput = () => {
    const [text, setText] = useState('')
    const [imagePreview, setImagePreview] = useState(null)
    const fileInputRef = React.useRef(null)
    const { sendMessage } = useMessageStore()
    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result)
            }
            reader.readAsDataURL(file)
        } else {
            setImagePreview(null)
        }
    }
    const handleSendMessage = async () => {

    }
    const removeImage = () => {
        setImagePreview(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = null
        }
    }
    return (
        <div className='p-4 w-full'>
            {imagePreview && (
                <div className="mb-3 flex items-center gap-2">
                    <div className="relative">
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
                        />
                        <button
                            onClick={removeImage}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
                            type="button"
                        >
                            <X className="size-3" />
                        </button>
                    </div>
                </div>
            )}
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <div className="flex-1 flex gap-2">
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Type a message..."
                        className="input w-full rounded-full input-sm sm:input-md text-accent-content"
                    />
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        className="hidden"
                    />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current.click()}
                        className={`hidden sm:flex btn btn-circle ${imagePreview ? 'text-accent' : 'text-base-content'} btn-sm sm:btn-md`}
                    >
                        <Image className="size-4 sm:size-5" />
                    </button>
                </div>
                <button
                    type="submit"
                    className="btn btn-sm btn-circle"
                    disabled={!text.trim() && !imagePreview}
                >
                    <Send size={22} />
                </button>
            </form>
        </div>
    )
}
