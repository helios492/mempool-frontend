"use client"
import { useEffect, useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext"
import { useRouter } from "next/navigation";
import Link from "next/link";
import AlertToast from "@/app/components/ui/alertToast";
import AuthHeader from "@/app/components/global/AuthHeader";

export default function LoginPage() {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter()
    const [showToast, setShowToast] = useState({ type: "", message: "" })

    useEffect(() => {
        if (showToast) {
            const timeout = setTimeout(() => setShowToast({ type: "", message: "" }), 2000)
            return () => clearTimeout(timeout)
        }
    }, [showToast])

    // Handle login submission
    const handleLogin = async () => {
        try {
            // Validate input
            if (!isValidEmail(email)) {
                setError("Email is invalid");
                return;
            }
            if (!password.trim()) {
                setError("Please enter a password");
                return;
            }
            setIsSubmitting(true)
            await login(email, password);
            router.push("/folders")
            setShowToast({ type: "success", message: "Successfuly Logged In" })
            setError("");
        } catch (err: any) {
            setShowToast({ type: "error", message: err.message })
        } finally {
            setIsSubmitting(false)
        }

    };

    const isValidEmail = (email: string) => {
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        return emailRegex.test(email);
    };

    // Handle Enter key press
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
        if (error) setError("");
    };

    // Show login form
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
                            className="w-full"
                            placeholder="JohnDoe@gmail.com"
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
                            className="w-full"
                            placeholder="********"
                            disabled={isSubmitting}
                        />
                    </div>
                </div>
                {error && (
                    <div className="text-red-500 text-sm font-medium text-center">{error}</div>
                )}
                <Button
                    variant="default"
                    size="lg"
                    className="w-full"
                    onClick={handleLogin}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Logging in...
                        </>
                    ) : "Login"}
                </Button>
                <div className="flex flex-row justify-center text-xs gap-1.5 flex-wrap">
                    <p>Not Registered?</p>
                    <Link href={"/register"} className="hover:text-blue-500">Create your Account</Link>
                </div>
            </div>
            {showToast.message && (
                <AlertToast message={showToast.message} type={showToast.type as 'success' | 'error' | 'info'} />
            )}
        </div>
    );
}