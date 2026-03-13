"use client" // Declare as a Client Component for hooks like useSession and useRouter

// Import necessary React and NextAuth hooks
import { useSession, signOut } from "next-auth/react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { useEffect } from "react"
// Import icons from Lucide React for the sidebar and actions
import { 
  LayoutDashboard, 
  KanbanSquare, 
  Settings,
  LogOut,
  Sparkles
} from "lucide-react"
// Import custom toast notification system
import { useToast } from "@/components/ToastProvider"
// Import Framer Motion for smooth page transitions
import { motion, AnimatePresence } from "framer-motion"

// Define the DashboardLayout component which wraps all internal app pages
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Extract session data and authentication status
  const { data: session, status } = useSession()
  const router = useRouter()
  // Get current path to highlight active navigation items
  const pathname = usePathname()
  const { showToast, hideToast } = useToast()

  // Redirect to login if the user is not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  // Function to trigger the AI-powered Gmail synchronization
  const handleSync = async () => {
    // Show a loading toast that persists until manual hide
    const toastId = showToast("Syncing with your inbox...", "loading")
    try {
      // Internal API call to search emails for job applications
      const res = await fetch("/api/sync/gmail", { method: "POST" })
      const data = await res.json()
      
      if (res.ok) {
        hideToast(toastId)
        showToast(data.message || "AI Sync Complete! Found new applications.", "success")
        // Refresh the page data to show newly found applications on the board
        router.refresh()
      } else {
        hideToast(toastId)
        showToast(data.error || "Sync failed. Please try again.", "error")
      }
    } catch (error) {
      hideToast(toastId)
      showToast("Network error. Could not sync.", "error")
    }
  }

  // Display a full-screen loading spinner while the session is being checked
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
      </div>
    )
  }

  // Prevent flashing content if not logged in
  if (!session) return null

  // Define sidebar navigation items with their respective icons
  const navigation = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Board", href: "/dashboard/board", icon: KanbanSquare },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ]

  return (
    // Main layout wrapper with black background and premium selection color
    <div className="min-h-screen bg-black text-white flex selection:bg-purple-500/30">
      
      {/* Fixed Sidebar Navigation with Glassmorphism */}
      <aside className="w-64 glass border-r border-white/10 flex flex-col fixed inset-y-0 left-0 z-40">
        <div className="h-20 flex items-center px-6 border-b border-white/10">
          {/* Logo linkage back to homepage */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="font-bold text-white text-lg leading-none">G</span>
            </div>
            <span className="font-bold text-xl tracking-tight">G-Track AI</span>
          </Link>
        </div>

        {/* Dynamic Navigation Links */}
        <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                  isActive 
                    ? "bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)]" 
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? "text-purple-400" : ""}`} />
                {item.name}
              </Link>
            )
          })}
        </div>

        {/* User Profile and Logout Section at the bottom of the sidebar */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-4 py-3">
            {/* Dynamic Gender-based Emoji Avatar implemented in Phase 10 */}
            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-white/5 text-2xl">
              {(session.user as any)?.gender === "female" ? "👩" : "👦"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{session.user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
            </div>
          </div>
          {/* Sign Out Button */}
          <button 
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex items-center gap-2 px-4 py-2 mt-2 text-sm text-gray-400 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Page Content Area */}
      <main className="flex-1 pl-64">
        {/* Top Sticky Header for Global Actions */}
        <header className="h-20 glass border-b border-white/10 flex items-center justify-end px-8 sticky top-0 z-30">
           {/* Primary Dashboard Action: AI Sync */}
           <button 
             className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-600/20 text-purple-300 hover:bg-purple-600/30 border border-purple-500/30 transition-all font-medium text-sm"
             onClick={handleSync}
           >
             <Sparkles className="w-4 h-4" />
             AI Auto-Sync
           </button>
        </header>

        {/* Dynamic Content Container with Motion Transitions */}
        <div className="p-8 max-w-7xl mx-auto h-[calc(100vh-80px)] overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {/* Render the actual page children components */}
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
