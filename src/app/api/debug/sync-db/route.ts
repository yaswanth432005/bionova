import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    console.log('Adding gender column to User table...')
    await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN "gender" TEXT;`)
    return NextResponse.json({ success: true, message: "Gender column added successfully!" })
  } catch (e: any) {
    if (e.message.includes('duplicate column name')) {
      return NextResponse.json({ success: true, message: "Column already exists." })
    }
    console.error('Migration Error:', e)
    return NextResponse.json({ success: false, error: e.message }, { status: 500 })
  }
}
