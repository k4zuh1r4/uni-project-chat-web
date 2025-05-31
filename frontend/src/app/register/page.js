'use client'
import React from 'react'
import Link from 'next/link'
import { Key, Mail, User2 } from 'lucide-react'
import { HomeNavbar } from '@/components/navbar'
import { useEffect } from 'react'
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/authStore.js"
import { Loader } from "lucide-react"
import { Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import OTPVerification from '@/components/VerifyOTP'

export default function RegisterPage() {
    const { authUser, checkAuth, isCheckingAuth, pendingVerification } = useAuthStore()
    const router = useRouter()
    const [showPassword, setShowPassword] = React.useState(false)
    const [showOTPVerification, setShowOTPVerification] = React.useState(false)
    const [formData, setFormData] = React.useState({
        fullName: "",
        email: "",
        password: ""
    })
    const { register, isRegistering } = useAuthStore()

    const validateForm = () => {
        if (!formData.fullName.trim()) {
            return toast.error("Name is required")
        }
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            return toast.error("Invalid email address")
        }
        if (!formData.password) {
            return toast.error("Password is required")
        }
        if (formData.password.length < 6) {
            return toast.error("Password must be at least 6 characters long")
        }
        return true
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const success = validateForm()
        if (success) {
            const result = await register(formData)
            if (result.success && result.requiresVerification) {
                setShowOTPVerification(true)
            }
        }
    }

    const handleBackToRegister = () => {
        setShowOTPVerification(false)
        // Clear form data if needed
        setFormData({
            fullName: "",
            email: "",
            password: ""
        })
    }

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    useEffect(() => {
        if (authUser) {
            router.push("/dashboard")
        }
    }, [authUser, router]);

    if (isCheckingAuth && !authUser) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader className="size-10 animate-spin" />
            </div>
        );
    }

    // Show OTP verification if registration was successful and requires verification
    if (showOTPVerification && pendingVerification) {
        return <OTPVerification onBack={handleBackToRegister} />
    }

    return (
        <>
            <div>
                <HomeNavbar />
            </div>
            <section className="flex h-screen">
                <div className="w-1/2 bg-base-100 p-8 flex flex-col justify-center items-center">
                    <div className='w-full mx-auto p-8'>
                        <h1 className="text-4xl font-bold text-center text-primary py-5 my-5" style={{ fontFamily: 'Instrument Sans' }}>Register</h1>
                        <div className='form-control'>
                            <form className='w-full flex flex-col items-center' onSubmit={handleSubmit}>
                                <label className="input validator w-full my-2">
                                    <User2 className="h-[1em] opacity-50" />
                                    <input
                                        className='px-3 py-2 my-2 w-full text-primary'
                                        type="input"
                                        required
                                        placeholder="Full Name"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        disabled={isRegistering}
                                    />
                                </label>
                                <label className="input validator w-full my-2">
                                    <Mail className="h-[1em] opacity-50" />
                                    <input
                                        className='px-3 py-2 my-2 w-full text-primary'
                                        type="email"
                                        required
                                        placeholder="Email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        disabled={isRegistering}
                                    />
                                </label>
                                <label className="input validator w-full my-2">
                                    <Key className="h-[1em] opacity-50" />
                                    <input
                                        className='w-full text-primary'
                                        type={showPassword ? "text" : "password"}
                                        required
                                        placeholder="Password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        disabled={isRegistering}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                                        onClick={() => setShowPassword(!showPassword)}
                                        disabled={isRegistering}
                                    >
                                        {showPassword ? <EyeOff className="h-[1em] opacity-50" /> : <Eye className="h-[1em] opacity-50" />}
                                    </button>
                                </label>
                                <Link href="/login" className="link link-primary text-center my-2">Already got an account?</Link>
                                <div className="w-full flex justify-end">
                                    <button
                                        className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg bg-base-content text-primary-content my-8 py-5"
                                        type="submit"
                                        disabled={isRegistering}
                                    >
                                        {isRegistering ? (
                                            <>
                                                <Loader className="w-4 h-4 animate-spin mr-2" />
                                                Signing up...
                                            </>
                                        ) : (
                                            "Sign up"
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="w-1/2 p-4" style={{ backgroundImage: "url('gallery1.png')", backgroundSize: "cover", backgroundPosition: "center" }} />
            </section>
        </>
    )
}