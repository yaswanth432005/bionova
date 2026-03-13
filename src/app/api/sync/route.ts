import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// In a real application, this would iterate through Gmail via OAuth + Google APIs, 
// pass email threads to an LLM (like Google Gemini or GPT-4) and parse out application data.

const MOCK_APPLICATIONS = [
  {
    company: "Google",
    role: "Software Engineer",
    status: "Interviewing",
    salary: "$150k - $200k",
    location: "Mountain View, CA",
    link: "https://careers.google.com",
    notes: "Follow up with recruiter on Tuesday."
  },
  {
    company: "Meta",
    role: "Frontend Developer",
    status: "Applied",
    salary: "$140k - $180k",
    location: "Remote",
    link: "https://metacareers.com",
    notes: "Referred by John Doe."
  },
  {
    company: "JobTrack AI",
    role: "Full Stack Engineer",
    status: "Offer",
    salary: "$160k + Equity",
    location: "San Francisco, CA",
    link: "https://jobtrack-ai.com",
    notes: "Offer deadline is next Friday."
  }
];

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { message: "Unauthorized: You must be logged in to sync." },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const addedApps = [];

    // Simulate network delay for AI processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    for (const mockApp of MOCK_APPLICATIONS) {
      // Check if already exists to prevent duplicates
      const existing = await prisma.jobApplication.findFirst({
        where: {
          userId,
          company: mockApp.company,
          role: mockApp.role,
        }
      });

      if (!existing) {
        const newApp = await prisma.jobApplication.create({
          data: {
            userId,
            ...mockApp
          }
        });
        addedApps.push(newApp);
      }
    }

    return NextResponse.json(
      { 
        message: "AI Sync Complete", 
        addedCount: addedApps.length,
        addedApps 
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error("Error syncing applications:", error);
    return NextResponse.json(
      { message: "An error occurred during AI synchronization." },
      { status: 500 }
    );
  }
}
