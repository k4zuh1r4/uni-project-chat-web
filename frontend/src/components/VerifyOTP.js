'use client'
import { useState, useEffect } from "react"
import { useAuthStore } from "@/lib/authStore.js"
import { Loader2, Mail, ArrowLeft } from "lucide-react"
import { HomeNavbar } from "@/components/navbar"
import toast from "react-hot-toast"

const OTPVerification = ({ onBack }) => {
    const [otp, setOtp] = useState(["", "", "", "", "", ""])
    const [countdown, setCountdown] = useState(60)
    const [canResend, setCanResend] = useState(false)

    const {
        verifyOTP,
        resendOTP,
        isVerifyingOTP,
        isResendingOTP,
        pendingVerification
    } = useAuthStore()

    // Countdown timer for resend
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
            return () => clearTimeout(timer)
        } else {
            setCanResend(true)
        }
    }, [countdown])

    const handleOtpChange = (index, value) => {
        if (value.length > 1) return

        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)

        // Auto-focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`)
            nextInput?.focus()
        }
    }

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`)
            prevInput?.focus()
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const otpString = otp.join("")

        if (otpString.length !== 6) {
            toast.error("Please enter all 6 digits")
            return
        }

        const result = await verifyOTP(otpString)
        if (!result.success) {
            setOtp(["", "", "", "", "", ""])
            document.getElementById("otp-0")?.focus()
        }
    }

    const handleResend = async () => {
        const result = await resendOTP()
        if (result.success) {
            setCountdown(60)
            setCanResend(false)
            setOtp(["", "", "", "", "", ""])
            document.getElementById("otp-0")?.focus()
        }
    }

    return (
        <>
            <HomeNavbar />
            <div className="min-h-screen flex items-center justify-center bg-base-100 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div>
                        <div className="mx-auto h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center">
                            <Mail className="h-6 w-6 text-primary" />
                        </div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-base-content">
                            Verify your email
                        </h2>
                        <p className="mt-2 text-center text-sm text-base-content/70">
                            We sent a 6-digit code to{" "}
                            <span className="font-medium text-base-content">{pendingVerification?.email}</span>
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="flex justify-center space-x-3">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    id={`otp-${index}`}
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className="input input-bordered w-12 h-12 text-center text-xl font-semibold focus:input-primary"
                                    disabled={isVerifyingOTP}
                                />
                            ))}
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isVerifyingOTP || otp.join("").length !== 6}
                                className="btn btn-primary w-full"
                            >
                                {isVerifyingOTP ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    "Verify Email"
                                )}
                            </button>
                        </div>

                        <div className="text-center">
                            {canResend ? (
                                <button
                                    type="button"
                                    onClick={handleResend}
                                    disabled={isResendingOTP}
                                    className="btn btn-link text-primary no-underline hover:underline"
                                >
                                    {isResendingOTP ? "Sending..." : "Resend code"}
                                </button>
                            ) : (
                                <p className="text-base-content/60">
                                    Resend code in {countdown}s
                                </p>
                            )}
                        </div>

                        {onBack && (
                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={onBack}
                                    className="btn btn-ghost btn-sm text-base-content/70 hover:text-base-content"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-1" />
                                    Back to login
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </>
    )
}

export default OTPVerification