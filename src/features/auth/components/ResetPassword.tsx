"use client"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAuth } from "@/hooks/useAuth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { motion } from "framer-motion"
import { toast } from "react-hot-toast"
import { Key } from "lucide-react"
import { useNavigate, useSearchParams, Navigate } from "react-router-dom"
import { useState } from "react"

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

export function ResetPassword() {
  const { resetPassword, isLoading, error } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token")
  const [passwordStrength, setPasswordStrength] = useState(0)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      toast.error("Invalid reset token")
      return
    }

    try {
      await resetPassword(token, data.password)
      toast.success("Password has been reset successfully")
      navigate("/login")
    } catch (error) {
      toast.error("Failed to reset password")
    }
  }

  const password = watch("password")

  const calculatePasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (password.match(/[A-Z]/)) strength++
    if (password.match(/[a-z]/)) strength++
    if (password.match(/[0-9]/)) strength++
    if (password.match(/[^A-Za-z0-9]/)) strength++
    setPasswordStrength(strength)
  }

  if (!token) {
    return <Navigate to="/forgot-password" replace />
  }

  return (
    <div className="flex min-h-screen bg-black">
      <div className="flex-1 flex items-center justify-center">
        <Card className="w-[400px] bg-gray-900/90 border-2 border-amber-600 rounded-lg shadow-xl backdrop-blur-sm">
          <CardHeader className="space-y-2">
            <div className="flex justify-center mb-4">
              <Key className="h-12 w-12 text-amber-500" />
            </div>
            <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-amber-500 to-red-500 bg-clip-text text-transparent">
              Reset Your Mantra
            </CardTitle>
            <p className="text-gray-400 text-center text-sm">Choose a new secret mantra to protect your path</p>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6 bg-red-900/50 border border-red-500">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">
                  New Secret Mantra
                </Label>
                <Input
                  {...register("password")}
                  type="password"
                  placeholder="Enter new password"
                  className="bg-gray-800/50 text-white border-2 border-gray-700 focus:border-amber-500 transition-all duration-300 placeholder:text-gray-500"
                  onChange={(e) => calculatePasswordStrength(e.target.value)}
                />
                {errors.password && <p className="text-sm text-red-400">{errors.password.message}</p>}
                <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                  <div
                    className={`h-full rounded-full ${
                      passwordStrength === 0
                        ? "bg-red-500"
                        : passwordStrength === 1
                          ? "bg-orange-500"
                          : passwordStrength === 2
                            ? "bg-yellow-500"
                            : passwordStrength === 3
                              ? "bg-lime-500"
                              : passwordStrength >= 4
                                ? "bg-green-500"
                                : ""
                    }`}
                    style={{ width: `${(passwordStrength / 5) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-300">
                  Confirm New Secret Mantra
                </Label>
                <Input
                  {...register("confirmPassword")}
                  type="password"
                  placeholder="Confirm new password"
                  className="bg-gray-800/50 text-white border-2 border-gray-700 focus:border-amber-500 transition-all duration-300 placeholder:text-gray-500"
                />
                {errors.confirmPassword && <p className="text-sm text-red-400">{errors.confirmPassword.message}</p>}
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-500 via-red-500 to-amber-500 hover:from-amber-600 hover:via-red-600 hover:to-amber-600 text-white font-semibold py-2 transition-all duration-300 shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    <span className="ml-2">Resetting...</span>
                  </div>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Right side animation section - same as other pages */}
      <motion.div className="hidden lg:block flex-1 relative overflow-hidden">
        {/* ... Same animation components as LoginForm */}
      </motion.div>
    </div>
  )
}

