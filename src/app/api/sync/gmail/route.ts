import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { syncGmailForUser } from "@/lib/gmail"

/**
 * POST /api/sync/gmail
 * Triggers a real Gmail sync for the authenticated user.
 * It fetches the user's Google tokens from the database and uses the Gmail API.
 */
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    // Ensure the user is logged in
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Call the real sync utility
    // Note: If credentials are not set in .env, this will throw an error handled below
    try {
      const syncCount = await syncGmailForUser(session.user.id)
      
      return NextResponse.json({ 
        success: true, 
        message: syncCount > 0 
          ? `Success! ${syncCount} new opportunities synced from your Gmail.`
          : "Your board is up to date! No new job emails found.",
        count: syncCount
      })
    } catch (apiError: any) {
      console.error("GMAIL_API_ERROR", apiError)
      
      // Fallback for demo when real credentials aren't provided yet
      if (apiError.message.includes("missing access token") || apiError.message.includes("invalid_client")) {
        return NextResponse.json({ 
          success: false, 
          message: "Gmail sync requires Google Login. Please sign in with Google in Settings.",
          isSetupError: true
        })
      }
      throw apiError
    }

  } catch (error) {
    console.error("SYNC_ROUTE_ERROR", error)
    return NextResponse.json({ 
      error: "Internal Server Error", 
      message: "Sync failed. Please try again later." 
    }, { status: 500 })
  }
}
