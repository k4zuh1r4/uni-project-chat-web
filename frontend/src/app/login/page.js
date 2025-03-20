import React from 'react'
import Link from 'next/link'
import { Key, Mail } from 'lucide-react'
export default function LoginPage() {
    return (
        <section className="flex h-screen">
            <div className="w-1/2 bg-base-100 p-8 flex flex-col justify-center items-center">
                <div className='w-full mx-auto p-8'>
                    <h1 className="text-4xl font-bold text-center text-primary py-5 my-5" style={{ fontFamily: 'Instrument Sans' }}>Login</h1>
                    <form className='w-full flex flex-col items-center'>
                        <label className="input w-full mb-4">
                            <Mail className="h-[1em] opacity-50" />
                            <input className='px-3 py-2 my-2 w-full text-primary' type="input" required placeholder="Email" minLength="3" maxLength="30" title="Only letters, numbers or dash" />
                        </label>
                        <label className="input w-full mb-4">
                            <Key className="h-[1em] opacity-50" />
                            <input className='w-full text-primary' type="password" required placeholder="Password" minLength="4" title="Must be more than 8 characters, including number, lowercase letter, uppercase letter" />
                        </label>
                        <div className='w-full flex justify-between items-center'>
                            <Link href="/register" className="link link-primary text-center my-3">I do not have an account.</Link>
                            <Link href="/register" className="link link-primary text-center my-3">Forgot password?</Link>
                        </div>
                        <div className="w-full flex justify-end">
                            <button className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg bg-base-content text-primary-content my-8 py-5" type="submit">Login</button>
                        </div>
                    </form>
                </div>
            </div>
            <div className="w-1/2 p-4" style={{ backgroundImage: "url('gallery1.png')", backgroundSize: "cover", backgroundPosition: "center" }} />
        </section>
    )
}
