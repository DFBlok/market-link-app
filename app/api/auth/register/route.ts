import { type NextRequest, NextResponse } from "next/server"
import { createUser, getUserByEmail } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, userType } = await request.json()

    if (!name || !email || !password || !userType) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    if (!["manufacturer", "supplier"].includes(userType)) {
      return NextResponse.json({ error: "Invalid user type" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }

    const user = await createUser(name, email, password, userType, "user")

    return NextResponse.json(
      {
        message: "Registration successful",
        user,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
