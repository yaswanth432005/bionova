"use client" // Declare as a Client Component for interactivity

export const dynamic = "force-dynamic"

// Import NextAuth sign-in utility
import { signIn } from "next-auth/react"
import { useEffect, useState } from "react"
// Import hooks for navigation and parsing URL parameters
import { useRouter } from "next/navigation"
import Link from "next/link"

const LoginPage = () => {
  const router = useRouter()
  const [registered, setRegistered] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    const params = new URLSearchParams(window.location.search)
    setRegistered(params.get("registered") === "true")
  }, [])

  // Local state for form management and error handling
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Function to handle credentials-based login (Email + Password)
  const handleDemoLogin = async (e: React.FormEvent) => {
    e.preventDefault() // Prevent standard form submission
    setLoading(true)
    setError("") // Reset error state
    
    try {
      // Trigger NextAuth credentials sign-in
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false // Manual redirection after logic check
      })

      if (res?.error) {
        // Display generic error if authentication fails
        setError("Invalid credentials")
      } else {
        // Redirect to protected dashboard on success
        router.push("/dashboard")
      }
    } catch (err) {
      console.error(err)
      setError("An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  return (
    // Main container with full height and premium dark theme
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Background Purple Glow for depth */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-purple-600/20 blur-[120px] rounded-full point-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Header Section with Brand Logo */}
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center mb-4">
            <span className="font-bold text-white text-2xl leading-none">G</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
            Sign in to G-Track AI
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Use demo credentials or Google OAuth
          </p>
        </div>

        {/* Login Form Card with Glassmorphic effect */}
        <div className="glass p-8 rounded-3xl border border-white/10 shadow-2xl">
          {/* Post-Registration Feedback Message */}
          {registered && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm text-center">
              Registration successful! Please sign in with your new account.
            </div>
          )}
          {/* Main Error Alert Box */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
              {error}
            </div>
          )}
          {/* Credentials Login Form */}
          <form className="space-y-6" onSubmit={handleDemoLogin}>
            <div>
              <label className="block text-sm font-medium text-gray-300">Email address</label>
              <div className="mt-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-3 border border-white/10 rounded-lg shadow-sm placeholder-gray-500 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent sm:text-sm transition-all"
                  placeholder="demo@jobtrack-ai.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">Password</label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-3 border border-white/10 rounded-lg shadow-sm placeholder-gray-500 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent sm:text-sm transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Standard Login Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-black bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {/* Dynamically show loading state */}
                {loading ? "Signing in..." : "Sign in with Demo Account"}
              </button>
            </div>
          </form>

          {/* Social Authentication Section */}
          <div className="mt-6">
            <div className="relative">
              {/* Decorative Divider */}
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 text-gray-400 bg-black/50 backdrop-blur-md rounded-full">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              {/* Google OAuth Login Button */}
              <button
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                className="w-full inline-flex justify-center py-3 px-4 border border-white/10 rounded-lg shadow-sm bg-white/5 text-sm font-medium text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                </svg>
                Google
              </button>
            </div>
          </div>
          {/* Link to Registration Page */}
          <div className="mt-8 text-center text-gray-400 text-sm">
            Don't have an account?{" "}
            <Link href="/register" className="text-white font-semibold hover:underline transition-all">
              Create one
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage

