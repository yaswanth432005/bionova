// Import core Next.js types and font utility
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
// Import global CSS styles (Tailwind, animations, brand colors)
import './globals.css'
// Import the NextAuth session provider
import AuthProvider from '@/components/AuthProvider'
// Import the custom toast notification provider
import { ToastProvider } from '@/components/ToastProvider'

// Initialize the Inter font with Latin subset for optimal performance
const inter = Inter({ subsets: ['latin'] })

// Define global SEO metadata for the application
export const metadata: Metadata = {
  title: 'G-Track AI',
  description: 'The smartest job tracker for modern job seekers. Auto-sync and track statuses with AI.',
}

// Define the root layout component that wraps every page in the app
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // Set landing page language to English
    <html lang="en">
      {/* Apply the Inter font class globally to the body */}
      <body className={inter.className}>
        {/* Wrap the app in the AuthProvider to enable useSession hook functionality */}
        <AuthProvider>
          {/* Wrap the app in ToastProvider for system-wide notifications */}
          <ToastProvider>
            {/* Render the specific page content */}
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
