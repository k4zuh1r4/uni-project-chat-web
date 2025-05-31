"use client";
import { useState } from "react";
import { Search, UserMinus, UserPlus, UserPlus2 } from "lucide-react";
import Image from "next/image";
import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";

export default function UserSearch({
    onResultsFound,
    onAddFriend,
    onAcceptRequest,
    onRejectRequest,
    onRemoveFriend,
    isActionInProgress
}) {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    // Handle search form submission
    const handleSearch = async (e) => {
        e.preventDefault();

        if (!searchTerm.trim()) {
            toast.error("Please enter an email to search");
            return;
        }

        setIsSearching(true);
        setSearchResults([]);

        try {
            const response = await axiosInstance.get(`/friends/search?email=${searchTerm}`);
            setSearchResults(response.data);

            // Notify parent component about results
            if (onResultsFound) {
                onResultsFound(response.data);
            }
        } catch (error) {
            console.error("Search error:", error);
            toast.error("Error searching for users: " + (error.response?.data?.message || error.message));
        } finally {
            setIsSearching(false);
        }
    };

    // Handle sending friend request from search results
    const handleSendRequest = async (userId) => {
        try {
            await onAddFriend(userId);

            // Update the status in search results
            setSearchResults(prev =>
                prev.map(user =>
                    user._id === userId
                        ? { ...user, status: "requested" }
                        : user
                )
            );
        } catch (error) {
            console.error("Failed to send friend request:", error);
        }
    };

    return (
        <div>
            {/* Search form */}
            <form onSubmit={handleSearch} className="mb-6">
                <div className="flex gap-2">
                    <div className="form-control flex-grow">
                        <div className="input-group">
                            <input
                                type="text"
                                placeholder="Search for friends by email..."
                                className="input input-bordered w-full"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="btn btn-primary p-3 my-3"
                                disabled={isSearching || !searchTerm.trim()}
                            >
                                {isSearching ? (
                                    <div className="loading loading-spinner loading-sm"></div>
                                ) : (
                                    <Search />
                                )}
                                Search
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}