"use client" // Declare as Client Component for UI state and interactivity

// Import NextAuth session hook for user data
import { useSession } from "next-auth/react"
// Import icons for settings categories and integrations
import { Mail, Briefcase, Zap, Bell, CheckCircle2 } from "lucide-react"
// Import custom notification system
import { useToast } from "@/components/ToastProvider"
import { useState } from "react"
// Import the profile editor modal
import { EditProfileModal } from "./components/EditProfileModal"

export default function SettingsPage() {
  // Extract user session data
  const { data: session } = useSession()
  const { showToast } = useToast()
  
  // Local state for UI toggles (Reminders and AI settings)
  const [reminders, setReminders] = useState(true)
  const [aiScoring, setAiScoring] = useState(true)
  // Control state for the profile edit modal visibility
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  // Shared helper for showing success notifications after actions
  const handleAction = (msg: string) => {
    showToast(msg, "success")
  }

  return (
    // Main settings layout with fade-in animation
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl pb-16">
      {/* Profile Edit Modal - Renders conditionally based on isEditModalOpen */}
      <EditProfileModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={{
          name: session?.user?.name,
          role: (session?.user as any)?.role,
          industry: (session?.user as any)?.industry,
          experienceLevel: (session?.user as any)?.experienceLevel,
        }}
      />
      
      {/* Page Header */}
      <header>
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
          Settings & Integrations
        </h1>
        <p className="text-gray-400">Manage your connected accounts and application preferences.</p>
      </header>

      <div className="space-y-6">
        {/* Profile Card: Displays basic user info and avatar */}
        <div className="glass rounded-2xl p-6 border border-white/10">
          <h3 className="text-xl font-semibold mb-4 border-b border-white/10 pb-4">Profile</h3>
          <div className="flex items-center gap-6">
            {/* Dynamic Gender-based Emoji Avatar implemented in Phase 10 */}
            <div className="w-20 h-20 rounded-full border-2 border-purple-500/50 flex items-center justify-center bg-black text-4xl shadow-[0_0_20px_rgba(168,85,247,0.2)]">
              {session?.user?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={session.user.image} alt="Profile" className="w-full h-full rounded-full object-cover" />
              ) : (
                (session?.user as any)?.gender === "female" ? "👩" : "👦"
              )}
            </div>
            <div>
              <p className="font-medium text-lg">{session?.user?.name}</p>
              <p className="text-gray-400">{session?.user?.email}</p>
              {/* Trigger the Edit Profile Modal */}
              <button 
                onClick={() => setIsEditModalOpen(true)}
                className="mt-4 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm transition-colors active:scale-95"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Integrations Card: Connect external platforms */}
        <div className="glass rounded-2xl p-6 border border-white/10">
          <h3 className="text-xl font-semibold mb-4 border-b border-white/10 pb-4">Integrations</h3>
          
          <div className="space-y-4">
            {/* Real Integration: Google Gmail Sync (used by the Auto-Sync feature) */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-medium">Google Gmail Sync</h4>
                  <p className="text-sm text-gray-400">Automatically tracking incoming job emails.</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span className="text-sm text-green-500 font-medium">Connected</span>
              </div>
            </div>

            {/* Mock Integration: LinkedIn Browser Extension */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#0A66C2]/20 flex items-center justify-center text-[#0A66C2]">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-medium">LinkedIn Extension</h4>
                  <p className="text-sm text-gray-400">Save jobs directly from LinkedIn.</p>
                </div>
              </div>
              <button 
                onClick={() => handleAction("LinkedIn extension connected!")}
                className="px-4 py-2 bg-white text-black font-medium text-sm rounded-lg hover:bg-gray-200 transition-colors active:scale-95"
              >
                Connect
              </button>
            </div>
          </div>
        </div>

        {/* User Preferences Card: Internal app notification and AI settings */}
        <div className="glass rounded-2xl p-6 border border-white/10">
          <h3 className="text-xl font-semibold mb-4 border-b border-white/10 pb-4">Preferences</h3>
          
          <div className="space-y-4">
            {/* Toggle Switch for Reminders */}
            <div className="flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
                <span>Interview Reminders</span>
              </div>
              <div 
                onClick={() => {
                  setReminders(!reminders)
                  handleAction(`Reminders ${!reminders ? "enabled" : "disabled"}`)
                }}
                className={`w-12 h-6 rounded-full p-1 cursor-pointer flex transition-all duration-200 ${reminders ? "bg-purple-600 justify-end" : "bg-white/10 justify-start"}`}
              >
                <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
              </div>
            </div>
            
            {/* Toggle Switch for AI Auto-Scoring */}
            <div className="flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
                <span>AI Application Auto-Scoring</span>
              </div>
              <div 
                onClick={() => {
                  setAiScoring(!aiScoring)
                  handleAction(`AI Scoring ${!aiScoring ? "enabled" : "disabled"}`)
                }}
                className={`w-12 h-6 rounded-full p-1 cursor-pointer flex transition-all duration-200 ${aiScoring ? "bg-purple-600 justify-end" : "bg-white/10 justify-start"}`}
              >
                <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
