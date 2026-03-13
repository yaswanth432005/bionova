import { google } from "googleapis"
import { prisma } from "@/lib/prisma"

/**
 * GmailSync Utility
 * This utility handles fetching emails from Gmail, identifying job-related content,
 * and parsing details to automatically add them to the user's application board.
 */

export async function syncGmailForUser(userId: string) {
  // 1. Get the OAuth account for this user
  const account = await prisma.account.findFirst({
    where: { userId, provider: "google" }
  })

  if (!account || !account.access_token) {
    throw new Error("Google account not linked or missing access token.")
  }

  // 2. Initialize OAuth2 client with credentials from DB
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  )

  oauth2Client.setCredentials({
    access_token: account.access_token,
    refresh_token: account.refresh_token,
    expiry_date: account.expires_at ? account.expires_at * 1000 : undefined
  })

  const gmail = google.gmail({ version: "v1", auth: oauth2Client })

  // 3. Search for job-related emails (Applied, Confirmation, Interview)
  // We search for common keywords in the subject or body
  const res = await gmail.users.messages.list({
    userId: "me",
    q: "subject:(Application OR Confirmation OR Interview OR Invitation) after:2024/01/01",
    maxResults: 10
  })

  const messages = res.data.messages || []
  let syncCount = 0

  for (const message of messages) {
    const msg = await gmail.users.messages.get({
      userId: "me",
      id: message.id!
    })

    const payload = msg.data.payload
    const headers = payload?.headers
    const subject = headers?.find(h => h.name === "Subject")?.value || ""
    const sender = headers?.find(h => h.name === "From")?.value || ""

    // Simple parsing logic: 
    // Usually subjects look like: "Thank you for applying to [Company]" or "[Company] Job Application"
    let company = "Unknown Company"
    let role = "Software Engineer" // Fallback role

    // Extracting company from sender or subject
    // Example: "Google <jobs-noreply@google.com>"
    const senderMatch = sender.match(/([^<]+)/)
    if (senderMatch) company = senderMatch[1].trim()

    // check if we already tracked this email
    const existing = await prisma.jobApplication.findFirst({
      where: {
        userId,
        company,
        notes: { contains: message.id! } // Store Message ID in notes to prevent duplicates
      }
    })

    if (!existing) {
      await prisma.jobApplication.create({
        data: {
          userId,
          company,
          role,
          status: subject.toLowerCase().includes("interview") ? "Interviewing" : "Applied",
          notes: `Auto-synced from Gmail. Message ID: ${message.id}`,
          appliedDate: new Date()
        }
      })
      syncCount++
    }
  }

  return syncCount
}
