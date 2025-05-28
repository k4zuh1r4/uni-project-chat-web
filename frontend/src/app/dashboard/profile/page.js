'use client'
import React, { useState } from 'react'
import { useAuthStore } from '@/lib/authStore.js'
import { MessageNavbar } from '@/components/messageNavbar'
import { Camera, User, Mail } from 'lucide-react'
import Link from 'next/link'

export default function Profile() {
    const { authUser, updateProfile, isUpdatingProfile } = useAuthStore()
    const [selectedImg, setSelectedImg] = useState(null)
    const [formData, setFormData] = useState({
        fullName: authUser?.fullName || '',
        email: authUser?.email || ''
    })

    const handleImageUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = async () => {
            const base64Image = reader.result
            setSelectedImg(base64Image)
            try {
                // Update just the profile picture immediately
                await updateProfile({ profilePicture: base64Image })
            } catch (error) {
                console.error("Error uploading image:", error);
                toast.error("Failed to upload image. Please try again with a different image.");
                setSelectedImg(null);
            }
        }
    }
    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        await updateProfile(formData)
    }

    const handleCancel = () => {
        // Reset form to original values
        setFormData({
            fullName: authUser?.fullName || '',
            email: authUser?.email || ''
        })
        setSelectedImg(null)
    }

    return (
        <>
            <MessageNavbar />
            <div className="flex flex-col items-center justify-center h-screen bg-base-100">
                <h1 className="text-3xl font-bold mb-4">Profile</h1>
                <div className="flex items-center gap-4 my-4">
                    <div className="relative">
                        <img
                            src={selectedImg || authUser?.profilePicture || "/avatar.png"}
                            alt="Profile"
                            className="size-32 rounded-full object-cover border-4 "
                        />
                        <label
                            htmlFor="avatar-upload"
                            className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
                        >
                            <Camera className="w-5 h-5 text-base-200" />
                            <input
                                type="file"
                                id="avatar-upload"
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={isUpdatingProfile}
                            />
                        </label>
                    </div>
                    <p className="text-sm text-zinc-400">
                        {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
                    </p>
                </div>
                <div>
                    <form className="flex flex-col gap-4 w-full max-w-md mx-auto" onSubmit={handleSubmit}>
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text">Full name</span>
                            </label>
                            <input
                                type="text"
                                name="fullName"
                                placeholder="Name"
                                className="input input-bordered w-full"
                                value={formData.fullName}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                className="input input-bordered w-full"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                        </div>
                        <button
                            type="submit"
                            className={`btn btn-primary ${isUpdatingProfile ? "loading" : ""}`}
                            disabled={isUpdatingProfile}
                        >
                            {isUpdatingProfile ? "Updating..." : "Update Profile"}
                        </button>
                        <Link href="/dashboard">
                            <button
                                type="button"
                                className="btn btn-secondary w-full"
                                onClick={handleCancel}
                                disabled={isUpdatingProfile}
                            >
                                Cancel
                            </button>
                        </Link>
                    </form>
                </div>
            </div>
        </>
    )
}