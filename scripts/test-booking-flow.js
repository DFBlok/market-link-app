// Test script to verify the complete booking flow
// Run this with: node scripts/test-booking-flow.js

const testBookingFlow = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

  console.log("🧪 Testing Mentoring Booking Flow")
  console.log("================================")

  // Test data
  const testBooking = {
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "+27 82 123 4567",
    businessName: "John's Bakery",
    businessType: "food",
    preferredDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 7 days from now
    preferredTime: "10:00",
    topics: "I need help with business planning, funding options, and marketing strategies for my bakery.",
    experience: "new",
    challenges: "Struggling with cash flow management and finding the right suppliers.",
  }

  try {
    console.log("📤 Submitting test booking...")
    console.log("Data:", {
      ...testBooking,
      email: "***@***.***",
      phone: "***-***-****",
    })

    const response = await fetch(`${baseUrl}/api/mentoring/book`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testBooking),
    })

    const result = await response.json()

    if (response.ok) {
      console.log("✅ Booking submitted successfully!")
      console.log("Response:", result)

      // Test retrieving the booking
      console.log("\n📥 Testing booking retrieval...")
      const getResponse = await fetch(`${baseUrl}/api/mentoring/book?email=${testBooking.email}`)
      const getResult = await getResponse.json()

      if (getResponse.ok) {
        console.log("✅ Booking retrieved successfully!")
        console.log("Found bookings:", getResult.bookings?.length || 0)
      } else {
        console.log("❌ Failed to retrieve booking:", getResult.error)
      }
    } else {
      console.log("❌ Booking submission failed!")
      console.log("Error:", result.error)
      console.log("Status:", response.status)
    }
  } catch (error) {
    console.log("💥 Test failed with error:", error.message)
  }

  console.log("\n🏁 Test completed")
}

// Test validation errors
const testValidationErrors = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

  console.log("\n🧪 Testing Validation Errors")
  console.log("============================")

  // Test missing required fields
  const invalidBooking = {
    fullName: "John Doe",
    // Missing email, phone, etc.
  }

  try {
    const response = await fetch(`${baseUrl}/api/mentoring/book`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(invalidBooking),
    })

    const result = await response.json()

    if (response.status === 400) {
      console.log("✅ Validation working correctly!")
      console.log("Error message:", result.error)
    } else {
      console.log("❌ Validation not working as expected")
      console.log("Response:", result)
    }
  } catch (error) {
    console.log("💥 Validation test failed:", error.message)
  }
}

// Run tests
if (typeof window === "undefined") {
  // Only run in Node.js environment
  testBookingFlow().then(() => {
    return testValidationErrors()
  })
}

export { testBookingFlow, testValidationErrors }
