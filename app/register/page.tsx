"use client"

import { useEffect, useState } from "react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import Header from "@/app/components/global/Header"
import { Loader2 } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import { useRouter } from "next/navigation"
import Link from "next/link"
import AlertToast from "../components/ui/alertToast"
import AuthHeader from "../components/global/AuthHeader"

export default function RegisterPage() {
    const { register } = useAuth()
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showToast, setShowToast] = useState({ type: "", message: "" })

    useEffect(() => {
        if (showToast) {
            const timeout = setTimeout(() => setShowToast({ type: "", message: "" }), 2000)
            return () => clearTimeout(timeout)
        }
    }, [showToast])

    const handleRegister = async () => {
        try {
            if (!isValidEmail(email)) {
                setError("Email is invalid")
                return
            }
            if (!password.trim()) {
                setError("Please enter a password")
                return
            }
            if (password !== confirmPassword) {
                setError("Confirm password is not correct")
                return
            }

            setIsSubmitting(true)
            await register(email, password)
            setShowToast({ type: "info", message: "Please check your email to verify your account" })
            setError("")
            router.replace("/")
        } catch (err: any) {
            setShowToast({ type: "error", message: err.message || "Registration failed" })
        } finally {
            setIsSubmitting(false)
        }
    }

    const isValidEmail = (email: string) => {
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
        return emailRegex.test(email)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") handleRegister()
        if (error) setError("")
    }

    return (
        <div className="flex flex-col items-center justify-center h-full min-h-screen w-full max-w-md mx-auto space-y-6">
            <AuthHeader />
            <div className="p-12 rounded-lg w-full bg-gray-900 space-y-4 shadow-2xl">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={handleKeyDown}
                            value={email}
                            placeholder="xxxx@gmail.com"
                            disabled={isSubmitting}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={handleKeyDown}
                            value={password}
                            placeholder="******"
                            disabled={isSubmitting}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            onKeyDown={handleKeyDown}
                            value={confirmPassword}
                            placeholder="******"
                            disabled={isSubmitting}
                        />
                    </div>
                </div>
                {error && (
                    <div className="text-red-500 text-sm font-medium">{error}</div>
                )}
                <Button
                    variant="default"
                    size="lg"
                    className="w-full"
                    onClick={handleRegister}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating an account...
                        </>
                    ) : (
                        "Register"
                    )}
                </Button>
                <div className="flex flex-row justify-center text-xs gap-1.5 flex-wrap">
                    <p>Already have an account?</p>
                    <Link href={"/login"} className="hover:text-blue-500">
                        Log in
                    </Link>
                </div>

                {showToast.message && (
                    <AlertToast message={showToast.message} type={showToast.type as 'success' | 'error' | 'info'} />
                )}
            </div>
        </div>
    )
}
