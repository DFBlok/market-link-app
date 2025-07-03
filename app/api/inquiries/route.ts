import { type NextRequest, NextResponse } from "next/server"

// Mock inquiries data - in production, this would come from a database
const inquiries: any[] = []

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      manufacturerId,
      manufacturerName,
      supplierId,
      supplierName,
      productName,
      quantity,
      message,
      priority = "Medium",
      contactEmail,
      contactPhone,
    } = body

    // Validate required fields
    if (!manufacturerId || !supplierId || !productName || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create new inquiry
    const newInquiry = {
      id: `INQ-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      manufacturerId,
      manufacturerName: manufacturerName || "Unknown Manufacturer",
      supplierId,
      supplierName: supplierName || "Unknown Supplier",
      productName,
      quantity: quantity || "Not specified",
      message,
      priority,
      contactEmail: contactEmail || "",
      contactPhone: contactPhone || "",
      status: "New",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      responses: [],
    }

    // Add to inquiries array
    inquiries.push(newInquiry)

    console.log("New inquiry created:", newInquiry.id)

    return NextResponse.json(
      {
        message: "Inquiry sent successfully",
        inquiry: newInquiry,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating inquiry:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const manufacturerId = searchParams.get("manufacturerId")
    const supplierId = searchParams.get("supplierId")
    const status = searchParams.get("status")

    let filteredInquiries = inquiries

    // Filter by manufacturer
    if (manufacturerId) {
      filteredInquiries = filteredInquiries.filter((inquiry) => inquiry.manufacturerId === manufacturerId)
    }

    // Filter by supplier
    if (supplierId) {
      filteredInquiries = filteredInquiries.filter((inquiry) => inquiry.supplierId === Number.parseInt(supplierId))
    }

    // Filter by status
    if (status) {
      filteredInquiries = filteredInquiries.filter((inquiry) => inquiry.status === status)
    }

    // Sort by creation date (newest first)
    filteredInquiries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return NextResponse.json({
      inquiries: filteredInquiries,
      total: filteredInquiries.length,
    })
  } catch (error) {
    console.error("Error fetching inquiries:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
