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
import { Scroll } from "lucide-react"
import { useNavigate, Link } from "react-router-dom"

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address").trim().toLowerCase(),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export function ForgotPassword() {
  const { forgotPassword, isLoading, error } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await forgotPassword(data.email)
      toast.success("Reset instructions have been sent to your email")
      navigate("/auth/check-email", {
        state: {
          email: data.email,
          message: "Please check your email for password reset instructions.",
        },
      })
    } catch (error) {
      toast.error("Failed to send reset instructions")
    }
  }

  return (
    <div className="flex min-h-screen bg-black">
      <div className="flex-1 flex items-center justify-center">
        <Card className="w-[400px] bg-gray-900/90 border-2 border-amber-600 rounded-lg shadow-xl backdrop-blur-sm">
          <CardHeader className="space-y-2">
            <div className="flex justify-center mb-4">
              <Scroll className="h-12 w-12 text-amber-500" />
            </div>
            <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-amber-500 to-red-500 bg-clip-text text-transparent">
              Recover Your Path
            </CardTitle>
            <p className="text-gray-400 text-center text-sm">Enter your email to receive recovery instructions</p>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6 bg-red-900/50 border border-red-500">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">
                  Sacred Scroll (Email)
                </Label>
                <Input
                  {...register("email")}
                  type="email"
                  placeholder="Enter your email"
                  className="bg-gray-800/50 text-white border-2 border-gray-700 focus:border-amber-500 transition-all duration-300 placeholder:text-gray-500"
                />
                {errors.email && <p className="text-sm text-red-400">{errors.email.message}</p>}
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-500 via-red-500 to-amber-500 hover:from-amber-600 hover:via-red-600 hover:to-amber-600 text-white font-semibold py-2 transition-all duration-300 shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    <span className="ml-2">Sending...</span>
                  </div>
                ) : (
                  "Send Recovery Instructions"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-400">
              Remember your path?{" "}
              <Link to="/login" className="text-amber-400 hover:text-red-400 transition-colors duration-200">
                Return to training
              </Link>
            </div>
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

