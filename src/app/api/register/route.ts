// Import NextResponse for structured API responses
import { NextResponse } from "next/server";
// Import the shared Prisma client for database interactions
import { prisma } from "@/lib/prisma";
// Import bcrypt for secure password hashing before storage
import bcrypt from "bcryptjs";

// Handle POST requests to create a new user account
export async function POST(request: Request) {
  try {
    // Parse the incoming JSON request body
    const body = await request.json();
    // Destructure the user data from the request body
    const { email, password, name, role, industry, experienceLevel, gender } = body;

    // Validate that essential fields (email and password) are present
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 } // Bad Request
      );
    }

    // Check if a user with this email already exists in the database
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    // If the user already exists, return an error to prevent duplicates
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists with this email" },
        { status: 400 } // Bad Request
      );
    }

    // Hash the password using bcrypt with 10 salt rounds for security
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user record using standard Prisma client
    const user = await prisma.user.create({
      data: {
        email,
        name: name || null,
        password: hashedPassword,
        role: role || null,
        industry: industry || null,
        experienceLevel: experienceLevel || null,
        gender: gender || null,
      },
    });

    // Return a success response with the new user's basic info
    return NextResponse.json(
      { 
        message: "User created successfully", 
        user: { id: user.id, email: user.email, name: user.name } 
      },
      { status: 201 } // Created
    );
  } catch (error) {
    console.error("Registration error:", error);
    
    // Check if the error is due to an invalid database connection string
    let message = "Error during registration: " + (error as any).message;
    if (message.includes("cluster.mongodb.net") || message.includes("DNS resolution")) {
      message = "Database configuration error. Please update your DATABASE_URL in the .env file with valid MongoDB credentials.";
    }

    // Return a generic error message to the client along with the internal error details
    return NextResponse.json(
      { message: message },
      { status: 500 } // Internal Server Error
    );
  }
}
