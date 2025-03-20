import React from 'react'
import Link from 'next/link'
import { Key, Mail, User2 } from 'lucide-react'
export default function RegisterPage() {
    return (
        <section className="flex h-screen">
            <div className="w-1/2 bg-base-100 p-8 flex flex-col justify-center items-center">
                <div className='w-full mx-auto p-8'>
                    <h1 className="text-4xl font-bold text-center text-primary py-5 my-5" style={{ fontFamily: 'Instrument Sans' }}>Register</h1>
                    <form className='w-full flex flex-col items-center'>
                        <label className="input validator w-full">
                            <User2 className="h-[1em] opacity-50" />
                            <input className='px-3 py-2 my-2 w-full text-primary' type="input" required placeholder="Full Name" minLength="2" maxLength="30" title="Invalid name format" />
                        </label>
                        <p className="validator-hint w-full text-center my-2">
                            Enter a valid name.
                        </p>
                        <label className="input validator w-full">
                            <Mail className="h-[1em] opacity-50" />
                            <input className='px-3 py-2 my-2 w-full text-primary' type="input" required placeholder="Email" minLength="3" maxLength="30" title="Only letters, numbers or dash" />
                        </label>
                        <p className="validator-hint w-full text-center my-2">
                            Must be a valid email.
                        </p>

                        <label className="input validator w-full">
                            <Key className="h-[1em] opacity-50" />
                            <input className='w-full text-primary' type="password" required placeholder="Password" minLength="4" title="Must be more than 8 characters, including number, lowercase letter, uppercase letter" />
                        </label>
                        <p className="validator-hint hidden w-full text-center my-2 mt-4">
                            Invalid password.
                        </p>
                        <Link href="/login" className="link link-primary text-center my-2">Already got an account?</Link>
                        <div className="w-full flex justify-end">
                            <button className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg bg-base-content text-primary-content my-8 py-5" type="submit">Sign up</button>
                        </div>
                    </form>
                </div>
            </div>
            <div className="w-1/2 p-4" style={{ backgroundImage: "url('gallery1.png')", backgroundSize: "cover", backgroundPosition: "center" }} />
        </section>
    )
}
