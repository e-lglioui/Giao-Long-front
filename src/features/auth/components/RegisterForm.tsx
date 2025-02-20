import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion";
import loginImage from '@/assets/login.jpg';

const registerSchema = z.object({
  username: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const { register: registerUser } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    await registerUser(data);
  };

  return (
    <div className="flex min-h-screen bg-black"> 
      <div className="flex-1 flex items-center justify-center">
        <Card className="w-[450px] bg-gray-900/90 border-2 border-amber-600 rounded-lg shadow-xl backdrop-blur-sm">
          <CardHeader className="space-y-2">
            <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-amber-500 to-red-500 bg-clip-text text-transparent">
              Begin Your Journey
            </CardTitle>
            <p className="text-gray-400 text-center text-sm">
              Join the temple and master your path
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-300">Warrior Name</Label>
                <Input
                  {...register("username")}
                  type="text"
                  placeholder="Enter your name"
                  className="bg-gray-800/50 text-white border-2 border-gray-700 focus:border-amber-500 transition-all duration-300 placeholder:text-gray-500"
                />
                {errors.username && (
                  <p className="text-sm text-red-400">{errors.username.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Sacred Scroll (Email)</Label>
                <Input
                  {...register("email")}
                  type="email"
                  placeholder="Enter your email"
                  className="bg-gray-800/50 text-white border-2 border-gray-700 focus:border-amber-500 transition-all duration-300 placeholder:text-gray-500"
                />
                {errors.email && (
                  <p className="text-sm text-red-400">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">Secret Mantra (Password)</Label>
                <Input
                  {...register("password")}
                  type="password"
                  placeholder="Create your password"
                  className="bg-gray-800/50 text-white border-2 border-gray-700 focus:border-amber-500 transition-all duration-300 placeholder:text-gray-500"
                />
                {errors.password && (
                  <p className="text-sm text-red-400">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-300">Confirm Secret Mantra</Label>
                <Input
                  {...register("confirmPassword")}
                  type="password"
                  placeholder="Confirm your password"
                  className="bg-gray-800/50 text-white border-2 border-gray-700 focus:border-amber-500 transition-all duration-300 placeholder:text-gray-500"
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-400">{errors.confirmPassword.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-500 via-red-500 to-amber-500 hover:from-amber-600 hover:via-red-600 hover:to-amber-600 text-white font-semibold py-2 transition-all duration-300 shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    <span className="ml-2">Joining...</span>
                  </div>
                ) : (
                  "Begin Training"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-400">
              Already a member of the temple?{" "}
              <a 
                href="/login" 
                className="text-amber-400 hover:text-red-400 transition-colors duration-200"
              >
                Return to training
              </a>
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
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500/20 via-red-500/20 to-amber-500/20 blur-3xl" />
        </motion.div>

        {/* Main image with golden border effect */}
        <motion.div
          className="absolute inset-0 "
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.5, 0.8] }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
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
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse"
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
  );
}