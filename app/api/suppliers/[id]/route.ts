import { type NextRequest, NextResponse } from "next/server"

// Mock supplier data - same as in the main suppliers route
const suppliers = [
  {
    id: 1,
    name: "SteelCorp Manufacturing",
    category: "Raw Materials",
    location: "Johannesburg, GP",
    rating: 4.8,
    reviewCount: 127,
    description:
      "Leading supplier of high-grade steel and metal components for manufacturing industries. We specialize in providing high-quality steel products and custom fabrication services to meet the diverse needs of our clients across various industries.",
    specialties: ["Steel Sheets", "Metal Fabrication", "Custom Parts", "Welding Services", "Quality Testing"],
    certifications: ["ISO 9001:2015", "SABS Certified", "OHSAS 18001"],
    image: "/placeholder-logo.png",
    verified: true,
    responseTime: "< 2 hours",
    established: "2010",
    employees: "100-500",
    phone: "+27 11 123 4567",
    email: "info@steelcorp.co.za",
    website: "www.steelcorp.co.za",
    products: [
      {
        id: 1,
        name: "High-Grade Steel Sheets",
        description: "Premium quality steel sheets in various grades and thicknesses",
        price: "From R 150 per kg",
        moq: "500 kg",
        leadTime: "7-10 days",
      },
      {
        id: 2,
        name: "Custom Metal Fabrication",
        description: "Bespoke metal fabrication services for industrial applications",
        price: "Quote on request",
        moq: "Project based",
        leadTime: "2-4 weeks",
      },
    ],
  },
  {
    id: 2,
    name: "TechComponents SA",
    category: "Electronics",
    location: "Cape Town, WC",
    rating: 4.9,
    reviewCount: 89,
    description:
      "Specialized electronic components and circuit boards for industrial applications. We provide comprehensive PCB assembly services and electronic component supply to manufacturers across South Africa.",
    specialties: ["PCB Assembly", "Electronic Components", "Testing Services", "Design Support", "Quality Assurance"],
    certifications: ["IPC-A-610", "RoHS Compliant", "ISO 9001:2015"],
    image: "/placeholder-logo.png",
    verified: true,
    responseTime: "< 1 hour",
    established: "2015",
    employees: "50-100",
    phone: "+27 21 123 4567",
    email: "info@techcomponents.co.za",
    website: "www.techcomponents.co.za",
    products: [
      {
        id: 1,
        name: "PCB Assembly Services",
        description: "Professional PCB assembly with SMT and through-hole components",
        price: "From R 50 per unit",
        moq: "100 units",
        leadTime: "5-7 days",
      },
      {
        id: 2,
        name: "Electronic Components Supply",
        description: "Wide range of electronic components including resistors, capacitors, ICs",
        price: "Variable pricing",
        moq: "As per requirement",
        leadTime: "2-3 days",
      },
    ],
  },
]

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supplierId = Number.parseInt(params.id)
    const supplier = suppliers.find((s) => s.id === supplierId)

    if (!supplier) {
      return NextResponse.json({ error: "Supplier not found" }, { status: 404 })
    }

    return NextResponse.json({ supplier })
  } catch (error) {
    console.error("Error fetching supplier:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supplierId = Number.parseInt(params.id)
    const supplierIndex = suppliers.findIndex((s) => s.id === supplierId)

    if (supplierIndex === -1) {
      return NextResponse.json({ error: "Supplier not found" }, { status: 404 })
    }

    const body = await request.json()
    const updatedSupplier = {
      ...suppliers[supplierIndex],
      ...body,
      id: supplierId, // Ensure ID doesn't change
      updatedAt: new Date().toISOString(),
    }

    suppliers[supplierIndex] = updatedSupplier

    return NextResponse.json({
      message: "Supplier updated successfully",
      supplier: updatedSupplier,
    })
  } catch (error) {
    console.error("Error updating supplier:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
