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
import loginImage from "@/assets/login.jpg"
import { useNavigate, Link } from "react-router-dom"
import { Navbar, NavItem, NavCTA } from "@/components/ui/navbar"

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginForm() {
  const { login, isLoading, error } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data)
      navigate("/dashboard")
    } catch (error) {
      console.error("Login error:", error)
    }
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <Navbar transparent>
        <NavItem href="/">Home</NavItem>
        <NavItem href="/login" isActive>
          Login
        </NavItem>
        <NavItem href="/register">Register</NavItem>
        <NavCTA href="/register">Begin Journey</NavCTA>
      </Navbar>

      <div className="flex min-h-screen pt-16">
        {" "}
        {/* Added pt-16 to account for navbar height */}
        <div className="flex-1 flex items-center justify-center">
          <Card className="w-[400px] bg-gray-900/90 border-2 border-amber-600 rounded-lg shadow-xl backdrop-blur-sm">
            <CardHeader className="space-y-2">
              <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-amber-500 to-red-500 bg-clip-text text-transparent">
                Master's Portal
              </CardTitle>
              <p className="text-gray-400 text-center text-sm">Enter the temple with honor</p>
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
                    Email
                  </Label>
                  <Input
                    {...register("email")}
                    type="email"
                    placeholder="Enter your email"
                    className="bg-gray-800/50 text-white border-2 border-gray-700 focus:border-amber-500 transition-all duration-300 placeholder:text-gray-500"
                  />
                  {errors.email && <p className="text-sm text-red-400">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-300">
                    Password
                  </Label>
                  <Input
                    {...register("password")}
                    type="password"
                    placeholder="Enter your password"
                    className="bg-gray-800/50 text-white border-2 border-gray-700 focus:border-amber-500 transition-all duration-300 placeholder:text-gray-500"
                  />
                  {errors.password && <p className="text-sm text-red-400">{errors.password.message}</p>}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-500 via-red-500 to-amber-500 hover:from-amber-600 hover:via-red-600 hover:to-amber-600 text-white font-semibold py-2 transition-all duration-300 shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                      <span className="ml-2">Entering...</span>
                    </div>
                  ) : (
                    "Enter"
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Link
                  to="/auth/forgot-password"
                  className="text-sm text-amber-400 hover:text-red-400 transition-colors duration-200"
                >
                  Lost your way?
                </Link>
              </div>

              <div className="mt-4 text-center text-sm text-gray-400">
                New to the temple?{" "}
                <Link to="/register" className="text-amber-400 hover:text-red-400 transition-colors duration-200">
                  Begin your journey
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
        <motion.div
          className="hidden lg:block flex-1 relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* Animated energy circles */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: [0.8, 1.1, 0.9, 1],
              opacity: [0, 0.3, 0.1, 0.2],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500/20 via-red-500/20 to-amber-500/20 blur-3xl" />
          </motion.div>

          {/* Main image with golden border effect */}
          <motion.div
            className="absolute inset-0 "
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.5, 0.8] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
          >
            <motion.img
              src={loginImage}
              alt="Kung Fu Master"
              className="w-full h-full object-cover"
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{
                scale: [1.1, 1],
                opacity: 1,
              }}
              transition={{ duration: 1 }}
            />

            {/* Overlay gradients */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/80" />

            {/* Energy effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-red-500/10 to-amber-500/10"
              animate={{
                opacity: [0.1, 0.3, 0.1],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            />
          </motion.div>

          {/* Chi energy particles */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <div className="absolute inset-0 mix-blend-overlay bg-gradient-to-br from-amber-500/20 via-red-500/20 to-amber-500/20" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

