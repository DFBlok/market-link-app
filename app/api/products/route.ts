import { type NextRequest, NextResponse } from "next/server"
import { getProductsBySupplier, createProduct } from "@/lib/products"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const supplierId = searchParams.get("supplierId")

    if (!supplierId) {
      return NextResponse.json({ error: "Supplier ID is required" }, { status: 400 })
    }

    const products = await getProductsBySupplier(Number.parseInt(supplierId))

    return NextResponse.json({ products })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { supplierId, name, description, category, price, leadTime, minOrderQuantity } = await request.json()

    if (!supplierId || !name || !description || !category || !price || !leadTime || !minOrderQuantity) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const product = await createProduct(supplierId, name, description, category, price, leadTime, minOrderQuantity)

    return NextResponse.json({ message: "Product created successfully", product }, { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
