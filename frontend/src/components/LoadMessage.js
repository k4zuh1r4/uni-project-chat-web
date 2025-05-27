import React from 'react'

export const LoadMessage = () => {
    const skeletonMessages = [
        { id: 1, isSent: true, size: 'w-32' },
        { id: 2, isSent: false, size: 'w-48' },
        { id: 3, isSent: true, size: 'w-64' },
        { id: 4, isSent: false, size: 'w-40' },
        { id: 5, isSent: true, size: 'w-56' },
    ]

    return (
        <div className="flex-1 flex flex-col h-full">
            <div className="border-b border-base-300 p-3 flex items-center gap-3">
                <div className="lg:hidden p-1">
                    <div className="skeleton w-5 h-5 rounded-full" />
                </div>
                <div className="relative">
                    <div className="skeleton size-10 rounded-full" />
                </div>
                <div className="flex-1">
                    <div className="skeleton h-4 w-32 mb-2" />
                    <div className="skeleton h-3 w-16" />
                </div>
                <div className="p-2">
                    <div className="skeleton w-5 h-5 rounded-full" />
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {skeletonMessages.map(message => (
                    <div
                        key={message.id}
                        className={`flex ${message.isSent ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`skeleton ${message.size} h-10 rounded-2xl ${message.isSent ? 'rounded-tr-none' : 'rounded-tl-none'
                                }`}
                        />
                    </div>
                ))}
            </div>
            <div className="p-3 border-t border-base-300">
                <div className="flex items-center gap-2">
                    <div className="skeleton w-full h-10 rounded-full" />
                    <div className="skeleton w-10 h-10 rounded-full" />
                </div>
            </div>
        </div>
    )
}