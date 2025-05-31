'use client'
import React from 'react'
import Link from 'next/link'
import { Key, Mail } from 'lucide-react'
import { useEffect } from 'react'
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/authStore.js"
import { Loader } from "lucide-react"
import { HomeNavbar } from '@/components/navbar'
import { Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import OTPVerification from '@/components/VerifyOTP'

export default function LoginPage() {
    const { authUser, checkAuth, isCheckingAuth, pendingVerification } = useAuthStore()
    const router = useRouter()
    const [showPassword, setShowPassword] = React.useState(false)
    const [showOTPVerification, setShowOTPVerification] = React.useState(false)
    const [formData, setFormData] = React.useState({
        email: "",
        password: ""
    })
    const { login, isLoggingIn } = useAuthStore()

    const validateForm = () => {
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
            const result = await login(formData)
            if (!result.success && result.requiresVerification) {
                setShowOTPVerification(true)
            }
        }
    }

    const handleBackToLogin = () => {
        setShowOTPVerification(false)
        // Clear password for security
        setFormData({
            ...formData,
            password: ""
        })
    }

    useEffect(() => {
        checkAuth()
    }, [checkAuth])

    useEffect(() => {
        if (authUser) {
            router.push("/dashboard")
        }
    }, [authUser, router])

    if (isCheckingAuth && !authUser) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader className="size-10 animate-spin" />
            </div>
        )
    }

    // Show OTP verification if login failed due to unverified email
    if (showOTPVerification && pendingVerification) {
        return <OTPVerification onBack={handleBackToLogin} />
    }

    return (
        <>
            <div className="bg-base-100">
                <HomeNavbar />
            </div>
            <section className="flex h-screen">
                <div className="w-1/2 bg-base-100 p-8 flex flex-col justify-center items-center">
                    <div className='w-full mx-auto p-8'>
                        <h1 className="text-4xl font-bold text-center text-primary py-5 my-5" style={{ fontFamily: 'Instrument Sans' }}>Login</h1>
                        <form className='justify-center flex flex-col items-center' onSubmit={handleSubmit}>
                            <label className="input w-full mb-4">
                                <Mail className="h-[1em] opacity-50" />
                                <input
                                    className='px-3 py-2 my-2 w-full text-primary'
                                    type="email"
                                    required
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    disabled={isLoggingIn}
                                />
                            </label>
                            <label className="input w-full mb-4">
                                <Key className="h-[1em] opacity-50" />
                                <input
                                    className='w-full text-primary'
                                    type={showPassword ? "text" : "password"}
                                    required
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    disabled={isLoggingIn}
                                />
                                <button
                                    type="button"
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={isLoggingIn}
                                >
                                    {showPassword ? <EyeOff className="h-[1em] opacity-50" /> : <Eye className="h-[1em] opacity-50" />}
                                </button>
                            </label>
                            <div className='w-full flex justify-between items-center'>
                                <Link href="/register" className="link link-primary text-center my-3">I do not have an account.</Link>
                                <Link href="/todo1" className="link link-primary text-center my-3">Forgot password?</Link>
                            </div>
                            <div className="w-full flex justify-end">
                                <button
                                    className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg bg-base-content text-primary-content my-8 py-5"
                                    type="submit"
                                    disabled={isLoggingIn}
                                >
                                    {isLoggingIn ? (
                                        <>
                                            <Loader className="w-4 h-4 animate-spin mr-2" />
                                            Logging in...
                                        </>
                                    ) : (
                                        "Login"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="w-1/2 p-4" style={{ backgroundImage: "url('gallery1.png')", backgroundSize: "cover", backgroundPosition: "center" }} />
            </section>
        </>
    )
}