"use client" // Declare this as a Client Component for interactivity

// Import necessary React hooks and NextAuth utilities
import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
// Import Framer Motion for premium animations
import { motion, AnimatePresence } from "framer-motion"
// Import UI icons from Lucide React
import { X, User, Briefcase, Building, TrendingUp, Loader2, Check } from "lucide-react"

// Define the shape of the user profile data for type safety
interface UserProfile {
  name?: string | null
  role?: string | null
  industry?: string | null
  experienceLevel?: string | null
  gender?: string | null
}

// Define the properties required by the EditProfileModal component
interface EditProfileModalProps {
  isOpen: boolean      // Whether the modal is currently visible
  onClose: () => void  // Function to close the modal
  initialData: UserProfile // Data to pre-populate the form
}

export function EditProfileModal({ isOpen, onClose, initialData }: EditProfileModalProps) {
  // Access the current authentication session and the update function
  const { update } = useSession()
  const router = useRouter()
  // State to track form submission loading status
  const [isSaving, setIsSaving] = useState(false)
  // State to track successful update state for UI feedback
  const [isSuccess, setIsSuccess] = useState(false)
  // State object to manage form input values, initialized with user's current data
  const [formData, setFormData] = useState<UserProfile>(initialData)

  // Function to handle the profile update submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault() // Prevent default browser form submission
    setIsSaving(true)  // Start loading animation
    
    try {
      // Send a PATCH request to our profile update API
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const updatedUser = await response.json()
        
        // If the API update is successful, also update the client-side session
        // This ensures the sidebar and other UI elements reflect the change immediately
        await update({
          name: updatedUser.name,
          role: updatedUser.role,
          industry: updatedUser.industry,
          experienceLevel: updatedUser.experienceLevel,
          gender: updatedUser.gender,
        })
        
        // Show success state briefly before closing
        setIsSuccess(true)
        router.refresh() // Refresh the page to ensure all server components update
        
        setTimeout(() => {
          setIsSuccess(false)
          onClose() // Close the modal
        }, 1500)
      }
    } catch (error) {
      // Log any unexpected errors to the console
      console.error("Error updating profile:", error)
    } finally {
      setIsSaving(false) // Stop loading animation
    }
  }

  // If the modal isn't open, don't render anything
  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop Blur with Fade Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose} // Close modal when clicking on the backdrop
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        
        {/* Main Modal Card with Scale/Fade Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-neutral-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-10"
        >
          {/* Header Section */}
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Edit Profile</h2>
              <p className="text-sm text-gray-400">Update your account settings</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-xl transition-colors text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="space-y-4">
              {/* Full Name Input Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all text-white placeholder-gray-500"
                    placeholder="Enter your name"
                  />
                </div>
              </div>

              {/* Grid for Professional Details */}
              <div className="grid grid-cols-2 gap-4">
                {/* Current Role Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 ml-1">Current Role</label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      value={formData.role || ""}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-purple-500/50 outline-none transition-all text-white placeholder-gray-500"
                      placeholder="e.g. Developer"
                    />
                  </div>
                </div>
                {/* Industry Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 ml-1">Industry</label>
                  <div className="relative">
                    <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      value={formData.industry || ""}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-purple-500/50 outline-none transition-all text-white placeholder-gray-500"
                      placeholder="e.g. Tech"
                    />
                  </div>
                </div>
              </div>

              {/* Experience Level Dropdown */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 ml-1">Experience Level</label>
                <div className="relative">
                  <TrendingUp className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <select
                    value={formData.experienceLevel || ""}
                    onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all appearance-none cursor-pointer text-white"
                  >
                    <option value="" disabled className="bg-neutral-900">Select level</option>
                    <option value="Entry" className="bg-neutral-900">Entry Level</option>
                    <option value="Mid" className="bg-neutral-900">Mid Level</option>
                    <option value="Senior" className="bg-neutral-900">Senior Level</option>
                    <option value="Lead" className="bg-neutral-900">Lead / Executive</option>
                  </select>
                </div>
              </div>

              {/* Gender Selection Section with Interactive Buttons */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 ml-1">Gender</label>
                <div className="flex gap-3">
                  {/* Male Selection Button */}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, gender: "male" })}
                    className={`flex-1 py-3 rounded-xl border transition-all flex items-center justify-center gap-2 ${
                      formData.gender === "male" 
                        ? "bg-blue-600/20 border-blue-500 text-blue-400" 
                        : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                    }`}
                  >
                    <span className="text-lg">👦</span> Male
                  </button>
                  {/* Female Selection Button */}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, gender: "female" })}
                    className={`flex-1 py-3 rounded-xl border transition-all flex items-center justify-center gap-2 ${
                      formData.gender === "female" 
                        ? "bg-pink-600/20 border-pink-500 text-pink-400" 
                        : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                    }`}
                  >
                    <span className="text-lg">👩</span> Female
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons Footer */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors border border-white/10"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving || isSuccess}
                className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg ${
                  isSuccess 
                    ? "bg-green-500 text-white" 
                    : "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90 shadow-purple-500/25"
                } disabled:opacity-50`}
              >
                {/* Dynamic labels based on saving/success states */}
                {isSaving ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : isSuccess ? (
                  <>
                    <Check className="w-5 h-5" />
                    Saved
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
