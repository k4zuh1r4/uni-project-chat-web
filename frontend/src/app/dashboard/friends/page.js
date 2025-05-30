"use client";
import { useEffect, useState, useCallback } from "react"
import { useFriendStore } from "@/lib/friendStore"
import { useAuthStore } from "@/lib/authStore"
import Image from "next/image"
import { User, User2Icon, UserMinus, UserMinus2, UserPlus, UserPlus2, Search } from "lucide-react"
import { MessageNavbar } from "@/components/messageNavbar"
import UserSearch from "@/components/UserSearch"

export default function FriendsPage() {
    const [activeTab, setActiveTab] = useState("friends")
    const [searchResults, setSearchResults] = useState([])

    const {
        friends,
        friendRequests,
        isFriendsLoading,
        isRequestsLoading,
        isActionInProgress,
        getFriends,
        getFriendRequests,
        sendFriendRequest,
        acceptFriendRequest,
        rejectFriendRequest,
        removeFriend,
        listenToFriendEvents,
        unlistenFriendEvents,
    } = useFriendStore()

    const { isAuthenticated, socket } = useAuthStore()

    // Create a memoized refresh function
    const refreshData = useCallback(() => {
        console.log("Refreshing friend data...")
        getFriends()
        getFriendRequests()
    }, [getFriends, getFriendRequests])

    // Handle search results
    const handleSearchResults = (results) => {
        setSearchResults(results)
        setActiveTab("search")
    }

    // Handle add friend action
    const handleAddFriend = async (userId) => {
        await sendFriendRequest(userId)
        refreshData()
    }

    // Run on component mount if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            console.log("Component mounted and authenticated, fetching initial data")
            refreshData();
        }
    }, [isAuthenticated, refreshData])

    // Setup socket listeners when socket is available
    useEffect(() => {
        console.log("Socket status:", socket ? "connected" : "not connected")

        if (isAuthenticated && socket) {
            console.log("Socket connected, setting up real-time listeners")
            listenToFriendEvents()

            // Setup additional direct listeners in the component
            socket.on("connect", () => {
                console.log("Socket connected, refreshing data");
                refreshData()
            });

            socket.on("friendUpdate", () => {
                console.log("Friend update event received");
                refreshData()
            });
        }

        return () => {
            unlistenFriendEvents()
            if (socket) {
                socket.off("connect")
                socket.off("friendUpdate")
            }
        }
    }, [isAuthenticated, socket, listenToFriendEvents, unlistenFriendEvents, refreshData])

    const handleAcceptRequest = async (userId) => {
        try {
            await acceptFriendRequest(userId)
            // Force immediate refresh after action
            refreshData()
        } catch (error) {
            console.error("Failed to accept friend request:", error)
        }
    }

    const handleRejectRequest = async (userId) => {
        try {
            await rejectFriendRequest(userId);
            // Force immediate refresh after action
            refreshData();
        } catch (error) {
            console.error("Failed to reject friend request:", error);
        }
    }

    // Handle remove friend with automatic refresh
    const handleRemoveFriend = async (userId) => {
        try {
            await removeFriend(userId);
            // Force immediate refresh after action
            refreshData();
        } catch (error) {
            console.error("Failed to remove friend:", error);
        }
    }

    return (
        <>
            <MessageNavbar />
            <div className="container mx-auto py-8 px-4">
                <h1 className="text-3xl font-bold mb-6 text-primary">Friends</h1>
                <UserSearch
                    onResultsFound={handleSearchResults}
                    onAddFriend={handleAddFriend}
                    onAcceptRequest={handleAcceptRequest}
                    onRejectRequest={handleRejectRequest}
                    onRemoveFriend={handleRemoveFriend}
                    isActionInProgress={isActionInProgress}
                />
                <div className="flex border-b border-base-content/20 mb-6">
                    <button
                        onClick={() => setActiveTab("friends")}
                        className={`px-4 py-2 font-medium ${activeTab === "friends"
                            ? "border-b-2 border-accent text-primary"
                            : "text-base-content/70 hover:bg-base-200 transition-colors"
                            }`}
                    >
                        <span className="flex items-center gap-2">
                            <User /> Friends ({friends.length})
                        </span>
                    </button>
                    <button
                        onClick={() => setActiveTab("requests")}
                        className={`px-4 py-2 font-medium ${activeTab === "requests"
                            ? "border-b-2 border-accent text-primary"
                            : "text-base-content/70 hover:bg-base-200 transition-colors"
                            }`}
                    >
                        <span className="flex items-center gap-2">
                            <UserPlus /> Friend Requests ({friendRequests.length})
                        </span>
                    </button>
                    {searchResults.length > 0 && (
                        <button
                            onClick={() => setActiveTab("search")}
                            className={`px-4 py-2 font-medium ${activeTab === "search"
                                ? "border-b-2 border-accent text-primary"
                                : "text-base-content/70 hover:bg-base-200 transition-colors"
                                }`}
                        >
                            <span className="flex items-center gap-2">
                                <Search /> Search Results ({searchResults.length})
                            </span>
                        </button>
                    )}
                    <button
                        onClick={refreshData}
                        className="ml-auto btn btn-sm btn-primary"
                    >
                        Refresh Lists
                    </button>
                </div>

                {activeTab === "friends" && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold mb-4 text-primary">My Friends</h2>

                        {isFriendsLoading ? (
                            <div className="flex justify-center p-8">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
                            </div>
                        ) : friends.length === 0 ? (
                            <div className="text-center py-8 bg-base-300 rounded-lg">
                                <User2Icon className="mx-auto text-4xl text-base-content/50 mb-2" />
                                <p className="text-base-content/70">You don't have any friends yet.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {friends.map((friend) => (
                                    <div
                                        key={friend._id}
                                        className="flex items-center p-4 bg-base-100 rounded-lg shadow hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex-shrink-0 h-12 w-12 relative">
                                            {friend.profilePicture ? (
                                                <Image
                                                    src={friend.profilePicture}
                                                    alt={friend.fullName}
                                                    fill
                                                    className="rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-base-300 rounded-full text-base-content">
                                                    {friend.fullName.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>

                                        <div className="ml-4 flex-grow">
                                            <h3 className="font-medium text-primary">{friend.fullName}</h3>
                                            <p className="text-sm text-base-content/70">{friend.email}</p>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveFriend(friend._id)}
                                            disabled={isActionInProgress}
                                            className="p-2 text-error hover:bg-base-300 rounded-full transition-colors disabled:opacity-50"
                                        >
                                            <UserMinus className="text-lg" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "requests" && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold mb-4 text-primary">Friend Requests</h2>

                        {isRequestsLoading ? (
                            <div className="flex justify-center p-8">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
                            </div>
                        ) : friendRequests.length === 0 ? (
                            <div className="text-center py-8 bg-base-300 rounded-lg">
                                <UserPlus className="mx-auto text-4xl text-base-content/50 mb-2" />
                                <p className="text-base-content/70">You don't have any friend requests.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {friendRequests.map((request) => (
                                    <div
                                        key={request._id}
                                        className="flex items-center p-4 bg-base-100 rounded-lg shadow"
                                    >
                                        <div className="flex-shrink-0 h-12 w-12 relative">
                                            {request.profilePicture ? (
                                                <Image
                                                    src={request.profilePicture}
                                                    alt={request.fullName}
                                                    fill
                                                    className="rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-base-300 rounded-full text-base-content">
                                                    {request.fullName.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>

                                        <div className="ml-4 flex-grow">
                                            <h3 className="font-medium text-primary">{request.fullName}</h3>
                                            <p className="text-sm text-base-content/70">{request.email}</p>
                                        </div>

                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleAcceptRequest(request._id)}
                                                disabled={isActionInProgress}
                                                className="p-2 text-success hover:bg-base-300 rounded-full transition-colors disabled:opacity-50"
                                                title="Accept"
                                            >
                                                <UserPlus2 className="text-xl" />
                                            </button>
                                            <button
                                                onClick={() => handleRejectRequest(request._id)}
                                                disabled={isActionInProgress}
                                                className="p-2 text-error hover:bg-base-300 rounded-full transition-colors disabled:opacity-50"
                                                title="Reject"
                                            >
                                                <UserMinus2 className="text-xl" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "search" && searchResults.length > 0 && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold mb-4 text-primary">Search Results</h2>

                        <div className="space-y-4">
                            {searchResults.map((user) => (
                                <div
                                    key={user._id}
                                    className="flex items-center p-4 bg-base-100 rounded-lg shadow"
                                >
                                    <div className="flex-shrink-0 h-12 w-12 relative">
                                        {user.profilePicture ? (
                                            <Image
                                                src={user.profilePicture}
                                                alt={user.fullName}
                                                fill
                                                className="rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-base-300 rounded-full text-base-content">
                                                {user.fullName.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>

                                    <div className="ml-4 flex-grow">
                                        <h3 className="font-medium text-primary">{user.fullName}</h3>
                                        <p className="text-sm text-base-content/70">{user.email}</p>
                                        <div className="mt-1">
                                            {user.status === "friend" && (
                                                <span className="badge badge-success">Already Friends</span>
                                            )}
                                            {user.status === "requested" && (
                                                <span className="badge badge-warning">Request Sent</span>
                                            )}
                                            {user.status === "pending" && (
                                                <span className="badge badge-info">Request Pending</span>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        {user.status === "none" && (
                                            <button
                                                onClick={() => handleAddFriend(user._id)}
                                                disabled={isActionInProgress}
                                                className="btn btn-sm btn-primary"
                                            >
                                                <UserPlus className="h-4 w-4 mr-1" />
                                                Add Friend
                                            </button>
                                        )}
                                        {user.status === "friend" && (
                                            <button
                                                onClick={() => handleRemoveFriend(user._id)}
                                                disabled={isActionInProgress}
                                                className="btn btn-sm btn-error"
                                            >
                                                <UserMinus className="h-4 w-4 mr-1" />
                                                Remove
                                            </button>
                                        )}
                                        {user.status === "pending" && (
                                            <div className="flex flex-col gap-2">
                                                <button
                                                    onClick={() => handleAcceptRequest(user._id)}
                                                    disabled={isActionInProgress}
                                                    className="btn btn-sm btn-success"
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => handleRejectRequest(user._id)}
                                                    disabled={isActionInProgress}
                                                    className="btn btn-sm btn-error"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}