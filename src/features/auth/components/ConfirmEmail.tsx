"use client"

import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Loader } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "react-hot-toast"

export function ConfirmEmail() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { confirmEmail } = useAuth()
  const [isConfirming, setIsConfirming] = useState(true)
  const [isSuccess, setIsSuccess] = useState(false)
  const token = searchParams.get("token")

  useEffect(() => {
    const confirm = async () => {
      if (!token) {
        setIsConfirming(false)
        return
      }

      try {
        await confirmEmail(token)
        setIsSuccess(true)
        toast.success("Your path is now illuminated. Welcome, warrior!")
      } catch (error) {
        toast.error("The sacred scroll could not be verified. Please try again.")
      } finally {
        setIsConfirming(false)
      }
    }

    confirm()
  }, [token, confirmEmail])

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <Card className="w-[450px] bg-gray-900/90 border-2 border-amber-600 rounded-lg shadow-xl backdrop-blur-sm">
        <CardHeader className="space-y-2">
          <div className="flex justify-center mb-4">
            {isConfirming ? (
              <Loader className="h-12 w-12 text-amber-500 animate-spin" />
            ) : isSuccess ? (
              <CheckCircle className="h-12 w-12 text-green-500" />
            ) : (
              <XCircle className="h-12 w-12 text-red-500" />
            )}
          </div>
          <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-amber-500 to-red-500 bg-clip-text text-transparent">
            {isConfirming
              ? "Verifying Your Sacred Scroll"
              : isSuccess
                ? "Your Path is Illuminated"
                : "Verification Failed"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-gray-300">
            {isConfirming
              ? "Please wait while we confirm your sacred scroll..."
              : isSuccess
                ? "Your email has been confirmed. You may now begin your journey."
                : "We could not verify your sacred scroll. The ancient spirits may have expired the link."}
          </p>

          <div className="pt-4">
            <Button
              onClick={() => navigate("/login")}
              className="w-full bg-gradient-to-r from-amber-500 via-red-500 to-amber-500 hover:from-amber-600 hover:via-red-600 hover:to-amber-600 text-white font-semibold py-2 transition-all duration-300 shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50"
            >
              {isSuccess ? "Enter the Temple" : "Return to the Temple Gates"}
            </Button>
          </div>

          {!isSuccess && !isConfirming && (
            <p className="text-sm text-gray-400 mt-4">
              Need a new sacred scroll?{" "}
              <button
                onClick={() => navigate("/auth/forgot-password")}
                className="text-amber-400 hover:text-red-400 transition-colors duration-200"
              >
                Request one here
              </button>
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

