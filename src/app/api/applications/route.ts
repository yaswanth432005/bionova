import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized: You must be logged in to view your applications." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get("status");

    const whereClause: any = {
      userId: session.user.id,
    };

    if (statusFilter && statusFilter !== "All") {
      whereClause.status = statusFilter;
    }

    const applications = await prisma.jobApplication.findMany({
      where: whereClause,
      orderBy: {
        appliedDate: "desc",
      },
    });

    return NextResponse.json(applications, { status: 200 });
  } catch (error) {
    console.error("Error fetching job applications:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching your applications." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized: You must be logged in to create applications." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { company, role, status, salary, location, link, notes, deadline, reminderDate } = body;

    if (!company || !role) {
      return NextResponse.json(
        { message: "Company and Role are required fields." },
        { status: 400 }
      );
    }

    const newApplication = await prisma.jobApplication.create({
      data: {
        userId: session.user.id,
        company,
        role,
        status: status || "Applied",
        salary,
        location,
        link,
        notes,
        deadline: deadline ? new Date(deadline) : null,
        reminderDate: reminderDate ? new Date(reminderDate) : null,
      },
    });

    return NextResponse.json(newApplication, { status: 201 });
  } catch (error) {
    console.error("Error creating job application:", error);
    
    let message = "An error occurred while creating the application.";
    if ((error as any).message.includes("cluster.mongodb.net") || (error as any).message.includes("DNS resolution")) {
      message = "Database configuration error. Please update your DATABASE_URL in the .env file.";
    }

    return NextResponse.json(
      { message: message },
      { status: 500 }
    );
  }
}
