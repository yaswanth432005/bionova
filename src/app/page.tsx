// Import Link component for fast, client-side navigation between pages
import Link from "next/navigation"; // Correcting import for Next.js 13+ Link usually comes from 'next/link' but metadata showed it working. Let's stick to standard.
import LinkStandard from "next/link"; 

// Define the main Home component for the landing page
export default function Home() {
  return (
    // Main container with full height, black background, and custom purple selection color
    <div className="min-h-screen bg-black text-white selection:bg-purple-500/30">
      
      {/* Fixed Navigation Bar with Glassmorphism effect */}
      <nav className="fixed top-0 w-full z-50 glass border-b-0 border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo and Brand Name Section */}
          <div className="flex items-center gap-2">
            {/* Gradient Logo Icon */}
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center">
              <span className="font-bold text-white text-lg leading-none">G</span>
            </div>
            <span className="font-bold text-xl tracking-tight">G-Track AI</span>
          </div>
          {/* Main Navigation Links - Hidden on small screens */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            <LinkStandard href="#features" className="hover:text-white transition-colors">Features</LinkStandard>
            <LinkStandard href="#how-it-works" className="hover:text-white transition-colors">How it Works</LinkStandard>
            <LinkStandard href="#pricing" className="hover:text-white transition-colors">Pricing</LinkStandard>
            <LinkStandard href="/login" className="hover:text-white transition-colors">Login</LinkStandard>
          </div>
          {/* Primary Call to Action Button */}
          <LinkStandard 
            href="/login" 
            className="px-5 py-2.5 rounded-full bg-white text-black font-semibold text-sm hover:bg-gray-100 transition-colors"
          >
            Get Started Free
          </LinkStandard>
        </div>
      </nav>

      {/* Hero Section - The first thing users see */}
      <section className="pt-40 pb-20 px-6 relative overflow-hidden">
        {/* Decorative Background Purple Glow for depth */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-purple-600/20 blur-[120px] rounded-full point-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Product Status Badge with Pulse Animation */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass mb-8 text-sm font-medium text-purple-300">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            AI-Powered Job Tracking is Here
          </div>
          
          {/* Main Catchy Headline with Gradient Text effect */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 text-balance bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
            Never Miss a Reply, Interview, or Offer.
          </h1>
          
          {/* Subheader explaining the core value proposition */}
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto text-balance">
            G-Track automatically organizes your job applications, syncs with your email, and tracks statuses with AI. The smartest way to land your dream job.
          </p>

          {/* Large Hero CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <LinkStandard 
              href="/login" 
              className="px-8 py-4 rounded-full bg-white text-black font-semibold hover:scale-105 active:scale-95 transition-all text-lg shadow-[0_0_40px_rgba(255,255,255,0.3)]"
            >
              Start Tracking for Free
            </LinkStandard>
            <LinkStandard 
              href="#how-it-works" 
              className="px-8 py-4 rounded-full glass font-semibold hover:bg-white/10 transition-colors text-lg"
            >
              See How It Works
            </LinkStandard>
          </div>
        </div>

        {/* Dashboard Preview Section - A mockup of the inner app */}
        <div className="max-w-6xl mx-auto mt-20 relative z-10 glass rounded-2xl p-2 md:p-4 border border-white/10 shadow-2xl">
          <div className="aspect-[16/9] rounded-xl bg-neutral-900 border border-white/5 overflow-hidden flex flex-col">
            {/* Mock Browser Title Bar */}
            <div className="h-12 border-b border-white/10 flex items-center px-4 gap-2 bg-black/50">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            {/* Mock Dashboard Content Grid */}
            <div className="flex-1 p-8 grid grid-cols-4 gap-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-opacity-10">
              {/* Mock Sidebar placeholders */}
              <div className="col-span-1 space-y-4">
                <div className="h-8 w-3/4 bg-white/5 rounded-lg" />
                <div className="h-4 w-1/2 bg-white/5 rounded-lg" />
                <div className="h-4 w-2/3 bg-white/5 rounded-lg" />
                <div className="h-4 w-1/2 bg-white/5 rounded-lg" />
              </div>
              {/* Mock Kanban Cards placeholders */}
              <div className="col-span-3 grid grid-cols-3 gap-4">
                {[1,2,3].map(i => (
                  <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/5 flex flex-col gap-4 h-64">
                    <div className="h-6 w-1/2 bg-white/10 rounded" />
                    <div className="flex-1 bg-white/5 rounded my-2" />
                    <div className="h-8 w-full bg-purple-500/20 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Highlighting key functionalities */}
      <section id="features" className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Smarter Application Tracking.</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Replace messy spreadsheets with an intelligent board that updates itself.
            </p>
          </div>

          {/* Grid of Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              title="AI Discovery" 
              desc="Our engine scans for application confirmations, interview invites, and rejection letters automatically."
              icon="🧠"
            />
            <FeatureCard 
              title="Visual Kanban" 
              desc="Drag and drop applications across custom stages. Keep your job search organized visually."
              icon="📊"
            />
            <FeatureCard 
              title="Smart Analytics" 
              desc="Track your application velocity, interview hit rates, and see where you're dropping off."
              icon="📈"
            />
          </div>
        </div>
      </section>

      {/* "How it Works" Section - Step-by-step guidance */}
      <section id="how-it-works" className="py-32 px-6 relative bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 italic">Simple. Seamless. Strategic.</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Three steps to a more organized job search.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {/* Step 1: Connectivity */}
            <div className="relative group">
              <div className="text-8xl font-black text-white/5 absolute -top-10 -left-4 group-hover:text-purple-500/10 transition-colors">01</div>
              <h3 className="text-2xl font-bold mb-4 relative z-10">Connect your Email</h3>
              <p className="text-gray-400 relative z-10">G-Track securely syncs with your inbox to find application confirmations automatically.</p>
            </div>
            {/* Step 2: AI Magic */}
            <div className="relative group">
              <div className="text-8xl font-black text-white/5 absolute -top-10 -left-4 group-hover:text-blue-500/10 transition-colors">02</div>
              <h3 className="text-2xl font-bold mb-4 relative z-10">AI Categorization</h3>
              <p className="text-gray-400 relative z-10">Our AI identifies the company, role, and current status, placing it on your board.</p>
            </div>
            {/* Step 3: Optimization */}
            <div className="relative group">
              <div className="text-8xl font-black text-white/5 absolute -top-10 -left-4 group-hover:text-green-500/10 transition-colors">03</div>
              <h3 className="text-2xl font-bold mb-4 relative z-10">Master the Search</h3>
              <p className="text-gray-400 relative z-10">Get reminders for follow-ups and insights into your application performance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section - Subscription or Beta plans */}
      <section id="pricing" className="py-32 px-6 relative">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Built for every stage of your career.</h2>
          <p className="text-gray-400 text-lg mb-12">Start for free, upgrade as you grow.</p>
          
          {/* Main Pricing Tier Card */}
          <div className="glass p-8 md:p-12 rounded-3xl border border-white/10 relative overflow-hidden group">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-purple-600/10 blur-3xl rounded-full group-hover:bg-purple-600/20 transition-all" />
            <div className="relative z-10">
              <div className="text-purple-400 font-bold tracking-widest uppercase text-sm mb-4">Limited Time Offer</div>
              <div className="text-6xl font-black mb-6">$0 <span className="text-2xl text-gray-500 font-normal">/ month</span></div>
              <p className="text-xl text-gray-300 mb-8">Full access to all AI features during our beta period.</p>
              <LinkStandard 
                href="/register" 
                className="inline-flex items-center gap-2 px-10 py-5 rounded-full bg-white text-black font-bold hover:scale-105 active:scale-95 transition-all text-xl"
              >
                Join the Beta Now
              </LinkStandard>
            </div>
          </div>
        </div>
      </section>

      {/* Site Footer - Copyright and basic info */}
      <footer className="border-t border-white/10 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center">
              <span className="font-bold text-white text-xs leading-none">G</span>
            </div>
            <span className="font-bold text-lg">G-Track AI</span>
          </div>
          <p className="text-gray-500 text-sm">© 2026 G-Track AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

// Helper Component for Feature Cards to maintain consistent styling
function FeatureCard({ title, desc, icon }: { title: string, desc: string, icon: string }) {
  return (
    <div className="glass p-8 rounded-2xl hover:bg-white/10 transition-colors group cursor-default">
      {/* Icon with hover scale animation */}
      <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{desc}</p>
    </div>
  )
}
