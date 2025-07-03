import { type NextRequest, NextResponse } from "next/server"

// Mock supplier data - in production, this would come from a database
const suppliers = [
  {
    id: 1,
    name: "SteelCorp Manufacturing",
    category: "Raw Materials",
    location: "Johannesburg, GP",
    rating: 4.8,
    reviewCount: 127,
    description: "Leading supplier of high-grade steel and metal components for manufacturing industries.",
    specialties: ["Steel Sheets", "Metal Fabrication", "Custom Parts"],
    certifications: ["ISO 9001", "SABS Certified"],
    image: "/placeholder-logo.png",
    verified: true,
    responseTime: "< 2 hours",
    established: "2010",
    employees: "100-500",
    phone: "+27 11 123 4567",
    email: "info@steelcorp.co.za",
    website: "www.steelcorp.co.za",
  },
  {
    id: 2,
    name: "TechComponents SA",
    category: "Electronics",
    location: "Cape Town, WC",
    rating: 4.9,
    reviewCount: 89,
    description: "Specialized electronic components and circuit boards for industrial applications.",
    specialties: ["PCB Assembly", "Electronic Components", "Testing Services"],
    certifications: ["IPC Certified", "RoHS Compliant"],
    image: "/placeholder-logo.png",
    verified: true,
    responseTime: "< 1 hour",
    established: "2015",
    employees: "50-100",
    phone: "+27 21 123 4567",
    email: "info@techcomponents.co.za",
    website: "www.techcomponents.co.za",
  },
  {
    id: 3,
    name: "Precision Tools Ltd",
    category: "Tools & Equipment",
    location: "Durban, KZN",
    rating: 4.7,
    reviewCount: 156,
    description: "Precision manufacturing tools and equipment for various industrial sectors.",
    specialties: ["CNC Tools", "Precision Instruments", "Calibration Services"],
    certifications: ["ISO 17025", "NIST Traceable"],
    image: "/placeholder-logo.png",
    verified: true,
    responseTime: "< 3 hours",
    established: "2008",
    employees: "50-100",
    phone: "+27 31 123 4567",
    email: "info@precisiontools.co.za",
    website: "www.precisiontools.co.za",
  },
  {
    id: 4,
    name: "ChemSupply Solutions",
    category: "Chemicals",
    location: "Port Elizabeth, EC",
    rating: 4.6,
    reviewCount: 94,
    description: "Industrial chemicals and specialty compounds for manufacturing processes.",
    specialties: ["Industrial Chemicals", "Custom Formulations", "Safety Consulting"],
    certifications: ["SANS 10234", "Responsible Care"],
    image: "/placeholder-logo.png",
    verified: true,
    responseTime: "< 4 hours",
    established: "2012",
    employees: "11-50",
    phone: "+27 41 123 4567",
    email: "info@chemsupply.co.za",
    website: "www.chemsupply.co.za",
  },
  {
    id: 5,
    name: "PackagePro Industries",
    category: "Packaging",
    location: "Bloemfontein, FS",
    rating: 4.5,
    reviewCount: 73,
    description: "Comprehensive packaging solutions for various industries.",
    specialties: ["Custom Packaging", "Eco-Friendly Materials", "Design Services"],
    certifications: ["FSC Certified", "ISO 14001"],
    image: "/placeholder-logo.png",
    verified: true,
    responseTime: "< 2 hours",
    established: "2018",
    employees: "11-50",
    phone: "+27 51 123 4567",
    email: "info@packagepro.co.za",
    website: "www.packagepro.co.za",
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")?.toLowerCase()
    const category = searchParams.get("category")
    const location = searchParams.get("location")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    let filteredSuppliers = suppliers

    // Apply search filter
    if (search) {
      filteredSuppliers = filteredSuppliers.filter(
        (supplier) =>
          supplier.name.toLowerCase().includes(search) ||
          supplier.description.toLowerCase().includes(search) ||
          supplier.specialties.some((specialty) => specialty.toLowerCase().includes(search)),
      )
    }

    // Apply category filter
    if (category && category !== "All Categories") {
      filteredSuppliers = filteredSuppliers.filter((supplier) => supplier.category === category)
    }

    // Apply location filter
    if (location && location !== "All Locations") {
      filteredSuppliers = filteredSuppliers.filter((supplier) =>
        supplier.location.includes(location.replace(" Province", "")),
      )
    }

    // Apply pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedSuppliers = filteredSuppliers.slice(startIndex, endIndex)

    return NextResponse.json({
      suppliers: paginatedSuppliers,
      total: filteredSuppliers.length,
      page,
      limit,
      totalPages: Math.ceil(filteredSuppliers.length / limit),
    })
  } catch (error) {
    console.error("Error fetching suppliers:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Create a new supplier (for supplier registration)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      category,
      location,
      description,
      specialties,
      certifications,
      phone,
      email,
      website,
      established,
      employees,
    } = body

    // Validate required fields
    if (!name || !category || !location || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create new supplier
    const newSupplier = {
      id: suppliers.length + 1,
      name,
      category,
      location,
      description,
      specialties: specialties || [],
      certifications: certifications || [],
      phone: phone || "",
      email: email || "",
      website: website || "",
      established: established || new Date().getFullYear().toString(),
      employees: employees || "1-10",
      rating: 0,
      reviewCount: 0,
      responseTime: "< 24 hours",
      verified: false,
      image: "/placeholder-logo.png",
      createdAt: new Date().toISOString(),
    }

    // Add to suppliers array (in production, save to database)
    suppliers.push(newSupplier)

    return NextResponse.json(
      {
        message: "Supplier created successfully",
        supplier: newSupplier,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating supplier:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
