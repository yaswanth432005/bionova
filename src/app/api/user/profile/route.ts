// Import NextResponse for standard API responses
import { NextResponse } from "next/server"
// Import getServerSession to authenticate the user's session in the backend
import { getServerSession } from "next-auth/next"
// Import the shared Prisma client for database updates
import { prisma } from "@/lib/prisma"
// Import our custom authOptions to ensure session consistency
import { authOptions } from "@/lib/auth"

// Handle PATCH requests to update an existing user's profile
export async function PATCH(req: Request) {
  try {
    // Retrieve the current user's session from the request
    const session = await getServerSession(authOptions)

    // Verify if the user is authenticated and has an email in their session
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 }) // Unauthorized
    }

    // Parse the JSON data sent from the client
    const body = await req.json()
    // Destructure the updated profile fields
    const { name, role, industry, experienceLevel, gender } = body

    // Update the user record using Raw SQL to bypass the outdated Prisma client metadata
    // We use Raw SQL because the 'gender' field is not yet recognized in the generated Prisma client
    // Update the user record using Safe Raw SQL (Prisma Template Tag)
    // Ensures 'gender' is saved even if the Prisma client isn't regenerated yet
    // Update the user record using standard Prisma client
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name: name || null,
        role: role || null,
        industry: industry || null,
        experienceLevel: experienceLevel || null,
        gender: gender || null,
      },
    });

    // Return the updated user object as JSON to the client
    return NextResponse.json(updatedUser)
  } catch (error) {
    // Log any runtime errors for server-side debugging
    console.error("PROFILE_UPDATE_ERROR", error)
    // Return an error response to the client
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 }) // Server Error
  }
}
