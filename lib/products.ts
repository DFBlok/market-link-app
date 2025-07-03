import { sql } from "./db"

export interface Product {
  id: number
  name: string
  description: string
  category: string
  price: string
  leadTime: string
  minOrderQuantity: string
  supplierId: number
  createdAt: string
}

export async function getProductsBySupplier(supplierId: number): Promise<Product[]> {
  const result = await sql`
    SELECT id, name, description, category, price, lead_time as "leadTime", 
           min_order_quantity as "minOrderQuantity", supplier_id as "supplierId",
           created_at as "createdAt"
    FROM products
    WHERE supplier_id = ${supplierId}
    ORDER BY created_at DESC
  `

  return result as Product[]
}

export async function createProduct(
  supplierId: number,
  name: string,
  description: string,
  category: string,
  price: string,
  leadTime: string,
  minOrderQuantity: string,
): Promise<Product> {
  const result = await sql`
    INSERT INTO products (supplier_id, name, description, category, price, lead_time, min_order_quantity)
    VALUES (${supplierId}, ${name}, ${description}, ${category}, ${price}, ${leadTime}, ${minOrderQuantity})
    RETURNING id, name, description, category, price, lead_time as "leadTime", 
              min_order_quantity as "minOrderQuantity", supplier_id as "supplierId",
              created_at as "createdAt"
  `

  return result[0] as Product
}

export async function updateProduct(
  id: number,
  supplierId: number,
  name: string,
  description: string,
  category: string,
  price: string,
  leadTime: string,
  minOrderQuantity: string,
): Promise<Product> {
  const result = await sql`
    UPDATE products 
    SET name = ${name}, description = ${description}, category = ${category}, 
        price = ${price}, lead_time = ${leadTime}, min_order_quantity = ${minOrderQuantity}
    WHERE id = ${id} AND supplier_id = ${supplierId}
    RETURNING id, name, description, category, price, lead_time as "leadTime", 
              min_order_quantity as "minOrderQuantity", supplier_id as "supplierId",
              created_at as "createdAt"
  `

  return result[0] as Product
}

export async function deleteProduct(id: number, supplierId: number): Promise<boolean> {
  const result = await sql`
    DELETE FROM products 
    WHERE id = ${id} AND supplier_id = ${supplierId}
  `

  return result.length > 0
}
