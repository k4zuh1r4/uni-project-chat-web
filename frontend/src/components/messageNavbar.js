'use client'
import React from 'react'
import { useAuthStore } from '@/lib/authStore.js'
import Link from 'next/link'
export const MessageNavbar = () => {
    const { logout, authUser } = useAuthStore()
    return (
        <div className="navbar bg-base-100 shadow-sm border-b-2 border-base-content/10">
            <div className="flex-1">
                <a className="btn btn-ghost text-xl">Chat Application Project</a>
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
                            <Link href="/dashboard/settings" className="justify-between text-base-content">
                                Settings
                            </Link>
                        </li>
                        <Link href="/">
                            <li onClick={logout}>
                                <button className="justify-between text-base-content">Logout</button>
                            </li>
                        </Link>
                    </ul>
                </div>
            </div>
        </div>
    )
}
