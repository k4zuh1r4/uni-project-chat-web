import React from 'react'
import Link from 'next/link'
export const HomeNavbar = () => {
    return (
        <div className="navbar bg-base-100 shadow-sm border-b-2 border-base-content/10">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                    </div>
                </div>
                <a className="text-xl font-bold px-4">Chat Application Project</a>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    <li><a>About us</a></li>
                    <li>
                        <details>
                            <summary>Details</summary>
                            <ul className="p-2 w-52 bg-base-100">
                                <li><a>Technology Stack</a></li>
                                <li><a>How we do it</a></li>
                            </ul>
                        </details>
                    </li>
                    <li><a>Contact</a></li>
                </ul>
            </div>
            <div className="navbar-end">
                <Link href="/login"><div className="btn">Login</div></Link>
            </div>
        </div>
    )
}
