import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { message: "Unauthorized: You must be logged in to view your analytics." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = session.user.id;

    const applications = await prisma.jobApplication.findMany({
      where: { userId },
    });

    // Compute statistics in a single pass
    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    let interviews = 0;
    let offers = 0;
    let rejections = 0;
    let weeklyApplications = 0;
    let upcomingDeadlines = 0;

    applications.forEach((app: any) => {
      const s = app.status;
      if (s === "Interviewing" || s === "Interview") interviews++;
      if (s === "Offer") offers++;
      if (s === "Rejected") rejections++;

      const applied = new Date(app.appliedDate);
      if (applied >= sevenDaysAgo) {
        weeklyApplications++;
      }

      if (app.deadline) {
        const d = new Date(app.deadline);
        if (d >= now && d <= nextWeek) {
          upcomingDeadlines++;
        }
      }
    });

    const totalApplications = applications.length;
    const interviewRate = totalApplications > 0 
      ? Math.round((interviews / totalApplications) * 100) 
      : 0;

    return NextResponse.json(
      {
        total: totalApplications,
        interviews,
        offers,
        rejections,
        weeklyApplications,
        interviewRate,
        weeklyGoal: 5,
        upcomingDeadlines,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching analytics:", error);

    let message = "An error occurred while fetching analytics.";
    if ((error as any).message.includes("cluster.mongodb.net") || (error as any).message.includes("DNS resolution")) {
      message = "Database configuration error. Please update your DATABASE_URL in .env.";
    }

    return NextResponse.json(
      { message: message },
      { status: 500 }
    );
  }
}
