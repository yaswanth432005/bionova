"use client" // Declare this as a Client Component for interactivity

// Import necessary React hooks and Next.js routing
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
// Import Framer Motion for premium animations
import { motion } from "framer-motion"
// Import UI icons from Lucide React
import { Mail, Lock, User, Briefcase, Building, TrendingUp, ArrowRight, Loader2 } from "lucide-react"

export default function RegisterPage() {
  // Hook to handle programmatic navigation
  const router = useRouter()
  // State to track form submission loading status
  const [loading, setLoading] = useState(false)
  // State to store and display validation or server errors
  const [error, setError] = useState("")
  // Unified state object to store all form input values
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    industry: "",
    experienceLevel: "",
    gender: ""
  })

  // Function to handle the final form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault() // Prevent default browser form submission
    setLoading(true)   // Start loading animation
    setError("")       // Clear previous errors

    try {
      // Send a POST request to our registration API
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      // If successful, redirect the user to the login page with a success flag
      if (res.ok) {
        router.push("/login?registered=true")
      } else {
        // If the server returns an error, parse and display the message
        const data = await res.json()
        setError(data.message || "Something went wrong")
      }
    } catch (err) {
      // Handle network or unexpected client-side errors
      setError("Failed to connect to server")
    } finally {
      setLoading(false) // Stop loading animation
    }
  }

  // Generic handler for all text and select input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value // Update the specific field dynamically
    }))
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Background Glows for a premium glassmorphic look */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full" />

      {/* Main Container with Entrance Animation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl z-10"
      >
        {/* Branding Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="font-bold text-white text-xl">G</span>
            </div>
            <span className="font-bold text-2xl tracking-tight">G-Track AI</span>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Create your account</h1>
          <p className="text-gray-400">Join thousands of smart job seekers.</p>
        </div>

        {/* Central Glassmorphic Form Card */}
        <div className="glass p-8 rounded-3xl border border-white/10 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message Display */}
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Personal Details Section */}
              <div className="space-y-4 md:col-span-2">
                <label className="block text-sm font-medium text-gray-300">Basic Details</label>
                {/* Full Name Input */}
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Full Name"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                {/* Email Input */}
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="Work or Personal Email"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                {/* Password Input */}
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="password"
                    name="password"
                    required
                    placeholder="Create Password"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>

                {/* Gender Selection Section */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Gender</label>
                  <div className="flex gap-4">
                    {/* Male Selection Button */}
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, gender: "male" }))}
                      className={`flex-1 py-3 rounded-xl border transition-all flex items-center justify-center gap-2 ${formData.gender === "male"
                          ? "bg-blue-600/20 border-blue-500 text-blue-400"
                          : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                        }`}
                    >
                      <span className="text-lg">👦</span> Male
                    </button>
                    {/* Female Selection Button */}
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, gender: "female" }))}
                      className={`flex-1 py-3 rounded-xl border transition-all flex items-center justify-center gap-2 ${formData.gender === "female"
                          ? "bg-pink-600/20 border-pink-500 text-pink-400"
                          : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                        }`}
                    >
                      <span className="text-lg">👩</span> Female
                    </button>
                  </div>
                </div>
              </div>

              {/* Career Profile Details Section */}
              <div className="space-y-4 md:col-span-2 pt-4 border-t border-white/5">
                <label className="block text-sm font-medium text-gray-300">Career Profile</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Job Role Input */}
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="text"
                      name="role"
                      placeholder="Current/Target Role"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                      value={formData.role}
                      onChange={handleChange}
                    />
                  </div>
                  {/* Industry Input */}
                  <div className="relative">
                    <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="text"
                      name="industry"
                      placeholder="Target Industry"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                      value={formData.industry}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                {/* Experience Level Dropdown */}
                <div className="relative">
                  <TrendingUp className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <select
                    name="experienceLevel"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all appearance-none cursor-pointer"
                    value={formData.experienceLevel}
                    onChange={handleChange}
                  >
                    <option value="" disabled className="bg-neutral-900">Experience Level</option>
                    <option value="Entry" className="bg-neutral-900">Entry Level (0-2 years)</option>
                    <option value="Mid" className="bg-neutral-900">Mid Level (3-5 years)</option>
                    <option value="Senior" className="bg-neutral-900">Senior Level (5+ years)</option>
                    <option value="Lead" className="bg-neutral-900">Lead / Executive</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Submission Button with Loading State Component */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-100 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Footer Link to Login */}
          <p className="mt-8 text-center text-gray-500 text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-white font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
