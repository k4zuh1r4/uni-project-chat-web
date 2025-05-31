'use client'
import React from 'react'
import { useAuthStore } from '@/lib/authStore.js'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export const MessageNavbar = () => {
    const { logout, authUser } = useAuthStore()
    const router = useRouter()

    const handleLogout = () => {
        try {
            logout()
            router.push('/')
        } catch (error) {
            console.error("Logout failed:", error)
        }
    }

    return (
        <div className="navbar bg-base-100 shadow-sm border-b-2 border-base-content/10">
            <div className="flex-1">
                <Link href="/dashboard"><div className="btn btn-ghost text-xl">Chat Application Project</div></Link>
            </div>
            <div className="flex-none">
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">
                            <img
                                alt="profilePic"
                                src={authUser?.profilePicture || "/avatar.png"} />
                        </div>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        <li>
                            <Link href="/dashboard/profile" className="justify-between text-base-content">
                                Profile
                            </Link>
                        </li>
                        <li>
                            <Link href="/dashboard/friends" className="justify-between text-base-content">
                                Friends
                            </Link>
                        </li>
                        <li>
                            <Link href="/dashboard/settings" className="justify-between text-base-content">
                                Settings
                            </Link>
                        </li>
                        <li>
                            <button onClick={handleLogout} className="justify-between text-base-content">
                                Logout
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}