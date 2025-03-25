import { useLocation, Navigate, Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, ExternalLink } from "lucide-react"

export function CheckEmail() {
  const location = useLocation()
  const { email, message } = location.state || {}

  if (!email) {
    return <Navigate to="/auth/register" replace />
  }

  const handleEmailClick = (emailProvider: string) => {
    let url = ""
    switch (emailProvider) {
      case "gmail":
        url = "https://gmail.com"
        break
      case "outlook":
        url = "https://outlook.live.com"
        break
      case "yahoo":
        url = "https://mail.yahoo.com"
        break
      default:
        url = `https://${emailProvider}.com`
    }
    window.open(url, "_blank")
  }

  const emailDomain = email.split("@")[1]

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <Card className="w-[450px] bg-gray-900/90 border-2 border-amber-600 rounded-lg shadow-xl backdrop-blur-sm">
        <CardHeader className="space-y-2">
          <div className="flex justify-center mb-4">
            <Mail className="h-12 w-12 text-amber-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-amber-500 to-red-500 bg-clip-text text-transparent">
            Check Your Sacred Scroll
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-gray-300">We've sent a message to your sacred scroll (email):</p>
          <p className="font-medium text-amber-500">{email}</p>
          <p className="text-gray-400 text-sm">
            {message || "Please check your email and follow the instructions to continue your journey."}
          </p>

          <div className="space-y-3 pt-4">
            <Button
              onClick={() => handleEmailClick(emailDomain)}
              className="w-full bg-gradient-to-r from-amber-500 via-red-500 to-amber-500 hover:from-amber-600 hover:via-red-600 hover:to-amber-600 text-white font-semibold py-2 transition-all duration-300 shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50"
            >
              Open {emailDomain} <ExternalLink className="ml-2 h-4 w-4" />
            </Button>

            <Link
              to="/auth/confirm-email"
              className="block w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded transition-colors duration-300"
            >
              I've confirmed my email
            </Link>
          </div>

          <p className="text-sm text-gray-400 mt-4">
            Didn't receive the sacred scroll? Check your spam folder or{" "}
            <button
              onClick={() => window.location.reload()}
              className="text-amber-400 hover:text-red-400 transition-colors duration-200"
            >
              request a new one
            </button>
          </p>

          <div className="mt-6 text-sm text-gray-400">
            Ready to begin your journey?{" "}
            <Link to="/login" className="text-amber-400 hover:text-red-400 transition-colors duration-200">
              Return to the temple gates
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

