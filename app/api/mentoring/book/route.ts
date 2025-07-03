import { type NextRequest, NextResponse } from "next/server"

// For now, we'll use in-memory storage for testing
// In production, you would use a real database like Supabase
const bookings: any[] = []

export async function POST(request: NextRequest) {
  console.log("📝 Mentoring booking API called")

  try {
    const body = await request.json()
    console.log("📋 Received booking data:", {
      ...body,
      email: body.email ? "***@***.***" : "missing",
      phone: body.phone ? "***-***-****" : "missing",
    })

    const {
      fullName,
      email,
      phone,
      businessName,
      businessType,
      preferredDate,
      preferredTime,
      topics,
      experience,
      challenges,
    } = body

    // Validate required fields
    const requiredFields = {
      fullName,
      email,
      phone,
      businessType,
      preferredDate,
      preferredTime,
      topics,
      experience,
    }

    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key, _]) => key)

    if (missingFields.length > 0) {
      console.log("❌ Missing required fields:", missingFields)
      return NextResponse.json({ error: `Missing required fields: ${missingFields.join(", ")}` }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.log("❌ Invalid email format:", email)
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Validate date is not in the past
    const selectedDate = new Date(preferredDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (selectedDate < today) {
      console.log("❌ Date is in the past:", preferredDate)
      return NextResponse.json({ error: "Preferred date cannot be in the past" }, { status: 400 })
    }

    console.log("✅ Validation passed, saving booking...")

    // Create booking object
    const booking = {
      id: `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      full_name: fullName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      business_name: businessName?.trim() || null,
      business_type: businessType,
      preferred_date: preferredDate,
      preferred_time: preferredTime,
      topics: topics.trim(),
      experience_level: experience,
      challenges: challenges?.trim() || null,
      status: "pending",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // Save to in-memory storage (replace with database in production)
    bookings.push(booking)

    console.log("🎉 Booking saved successfully:", booking.id)
    console.log("📊 Total bookings:", bookings.length)

    // Here you could add email notifications, calendar invites, etc.
    console.log("📧 TODO: Send confirmation email to:", email)
    console.log("📅 TODO: Create calendar invite for:", preferredDate, preferredTime)

    return NextResponse.json(
      {
        message: "Booking submitted successfully! We will contact you within 24 hours to confirm your session.",
        booking: {
          id: booking.id,
          status: booking.status,
          created_at: booking.created_at,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("💥 API error:", error)
    return NextResponse.json({ error: "Internal server error. Please try again later." }, { status: 500 })
  }
}

// GET method to retrieve bookings (for testing and admin purposes)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")
    const status = searchParams.get("status")

    let filteredBookings = bookings

    if (email) {
      filteredBookings = filteredBookings.filter((booking) => booking.email.toLowerCase() === email.toLowerCase())
    }

    if (status) {
      filteredBookings = filteredBookings.filter((booking) => booking.status === status)
    }

    // Sort by creation date (newest first)
    filteredBookings.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    console.log(`📊 Retrieved ${filteredBookings.length} bookings`)

    return NextResponse.json(
      {
        bookings: filteredBookings,
        total: filteredBookings.length,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("💥 GET API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT method to update booking status (for admin use)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status } = body

    if (!id || !status) {
      return NextResponse.json({ error: "Missing booking ID or status" }, { status: 400 })
    }

    const validStatuses = ["pending", "confirmed", "completed", "cancelled"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const bookingIndex = bookings.findIndex((booking) => booking.id === id)

    if (bookingIndex === -1) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    // Update booking
    bookings[bookingIndex] = {
      ...bookings[bookingIndex],
      status,
      updated_at: new Date().toISOString(),
    }

    console.log(`✅ Updated booking ${id} status to ${status}`)

    return NextResponse.json(
      {
        message: "Booking updated successfully",
        booking: bookings[bookingIndex],
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("💥 PUT API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
