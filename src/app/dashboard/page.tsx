"use client" // Marked as Client Component for data fetching and React hooks

// Import React hooks and NextAuth session hook
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
// Import icons for the analytics dashboard widgets
import { 
  Briefcase, 
  Send, 
  Users, 
  FileCheck2, 
  XCircle,
  TrendingUp,
  Clock
} from "lucide-react"

// TypeScript definition for the analytics data structure
type AnalyticsData = {
  total: number
  interviews: number
  offers: number
  rejections: number
  weeklyApplications: number
  interviewRate: number
  weeklyGoal: number
  upcomingDeadlines: number
}

export default function DashboardPage() {
  // Access the current user session
  const { data: session } = useSession()
  // Local state to store fetched analytics data
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch dashboard stats from the API on component mount
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/analytics")
        if (res.ok) {
          setData(await res.json())
        }
      } catch (err) {
        // Log errors but keep UI stable
        console.error(err)
      } finally {
        // Mark loading as complete even if fetch fails to show empty state/fallback
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Show a standard loading spinner until data is ready
  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
      </div>
    )
  }

  // Calculate the success rate of applications turning into interviews
  const getInterviewRate = () => {
    if (data.total === 0) return "0%"
    return Math.round((data.interviews / data.total) * 100) + "%"
  }

  // Configuration for the top summary cards
  const statCards = [
    { 
      title: "Total Tracked", 
      value: data.total, 
      icon: Briefcase, 
      color: "text-blue-400",
      info: "Total job applications you've added to the system."
    },
    { 
      title: "Weekly Progress", 
      value: `${data.weeklyApplications}/${data.weeklyGoal}`, 
      icon: TrendingUp, 
      color: "text-orange-400",
      info: "Applications submitted in the last 7 days vs your goal."
    },
    { 
      title: "Interview Rate", 
      value: `${data.interviewRate}%`, 
      icon: Users, 
      color: "text-purple-400",
      info: "Percentage of total applications that reached the interview stage."
    },
    { 
      title: "Offers", 
      value: data.offers, 
      icon: FileCheck2, 
      color: "text-green-400",
      info: "Total number of job offers received."
    },
    { 
      title: "Upcoming Deadlines", 
      value: data.upcomingDeadlines, 
      icon: Clock, 
      color: "text-red-400",
      info: "Applications with deadlines in the next 7 days."
    },
  ]

  return (
    // Main dashboard container with entry animation
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500 pb-12">
      <header>
        {/* Dynamic welcome message using first name from session */}
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
          Welcome back, {session?.user?.name?.split(" ")[0]}! <span className="text-xl">👋</span>
        </h1>
        <p className="text-gray-400">Here is what is happening with your job search today.</p>
      </header>

      {/* Grid of Key Performance Indicators (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          // Stat card with glassmorphic styling and hover interactions
          <div 
            key={i} 
            className="glass rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="space-y-1">
                <h3 className="font-medium text-gray-400">{stat.title}</h3>
                <p className="text-[10px] text-gray-500 leading-tight pr-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  {stat.info}
                </p>
              </div>
              <div className={`p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            {/* Display the calculated or fetched numeric value */}
            <div className="text-4xl font-bold tracking-tight">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Complex Visualization Area: Conversion and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Conversion Rate Highlight Card */}
        <div className="glass rounded-2xl p-6 border border-white/10 col-span-1 lg:col-span-1 bg-gradient-to-br from-purple-900/40 to-black relative overflow-hidden">
          {/* Subtle background glow for aesthetic depth */}
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-purple-600/30 blur-3xl rounded-full" />
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-400" /> Convert Rate
          </h3>
          <p className="text-sm text-gray-400 mb-6">Percentage of applications turning into interviews.</p>
          <div className="flex items-end gap-3">
            {/* Large Gradient Text for the percentage */}
            <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50">{getInterviewRate()}</span>
            <span className="text-green-400 text-sm font-medium mb-2">+12% vs last month</span>
          </div>
        </div>

        {/* Activity Flow Visualization Card (Simulated Bar Chart) */}
        <div className="glass rounded-2xl p-6 border border-white/10 col-span-1 lg:col-span-2 flex flex-col">
          <h3 className="text-lg font-semibold mb-1">Recent Activity Flow</h3>
          <p className="text-sm text-gray-400 mb-6">Your job search momentum over the past 30 days.</p>
          
          <div className="flex-1 min-h-[200px] flex items-end justify-between gap-2 px-2 pb-2">
            {/* Dynamic rendering of simulated activity bars */}
            {[40, 70, 45, 90, 65, 30, 85, 55, 100, 75, 50, 80].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col justify-end gap-2 group">
                <div 
                  className="w-full bg-purple-500/20 group-hover:bg-purple-500/50 rounded-t-sm transition-all relative overflow-hidden" 
                  style={{ height: `${h}%` }}
                >
                  {/* Subtle internal gradient on bars */}
                  <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-purple-500/40 to-transparent" />
                </div>
              </div>
            ))}
          </div>
          {/* Chart timeline labels */}
          <div className="flex justify-between px-2 pt-2 border-t border-white/5 text-xs text-gray-500">
            <span>Oct 1</span>
            <span>Oct 15</span>
            <span>Today</span>
          </div>
        </div>

      </div>
    </div>
  )
}
