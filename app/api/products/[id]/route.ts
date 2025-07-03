import { type NextRequest, NextResponse } from "next/server"
import { updateProduct, deleteProduct } from "@/lib/products"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const productId = Number.parseInt(params.id)
    const { supplierId, name, description, category, price, leadTime, minOrderQuantity } = await request.json()

    if (!supplierId || !name || !description || !category || !price || !leadTime || !minOrderQuantity) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const product = await updateProduct(
      productId,
      supplierId,
      name,
      description,
      category,
      price,
      leadTime,
      minOrderQuantity,
    )

    return NextResponse.json({ message: "Product updated successfully", product })
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const productId = Number.parseInt(params.id)
    const { searchParams } = new URL(request.url)
    const supplierId = searchParams.get("supplierId")

    if (!supplierId) {
      return NextResponse.json({ error: "Supplier ID is required" }, { status: 400 })
    }

    const success = await deleteProduct(productId, Number.parseInt(supplierId))

    if (!success) {
      return NextResponse.json({ error: "Product not found or unauthorized" }, { status: 404 })
    }

    return NextResponse.json({ message: "Product deleted successfully" })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
