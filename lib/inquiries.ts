import { sql } from "./db"

export interface Inquiry {
  id: number
  manufacturerId: number
  supplierId: number
  subject: string
  message: string
  priority: "low" | "medium" | "high"
  status: "pending" | "responded" | "closed"
  manufacturerName: string
  manufacturerEmail: string
  response?: string
  quotedPrice?: string
  deliveryTime?: string
  notes?: string
  createdAt: string
  respondedAt?: string
}

export async function getInquiriesBySupplier(supplierId: number): Promise<Inquiry[]> {
  const result = await sql`
    SELECT i.id, i.manufacturer_id as "manufacturerId", i.supplier_id as "supplierId",
           i.subject, i.message, i.priority, i.status, i.response, i.quoted_price as "quotedPrice",
           i.delivery_time as "deliveryTime", i.notes, i.created_at as "createdAt",
           i.responded_at as "respondedAt", u.name as "manufacturerName", u.email as "manufacturerEmail"
    FROM inquiries i
    JOIN users u ON i.manufacturer_id = u.id
    WHERE i.supplier_id = ${supplierId}
    ORDER BY i.created_at DESC
  `

  return result as Inquiry[]
}

export async function respondToInquiry(
  id: number,
  supplierId: number,
  response: string,
  quotedPrice?: string,
  deliveryTime?: string,
  notes?: string,
): Promise<Inquiry> {
  const result = await sql`
    UPDATE inquiries 
    SET response = ${response}, quoted_price = ${quotedPrice || null}, 
        delivery_time = ${deliveryTime || null}, notes = ${notes || null},
        status = 'responded', responded_at = NOW()
    WHERE id = ${id} AND supplier_id = ${supplierId}
    RETURNING id, manufacturer_id as "manufacturerId", supplier_id as "supplierId",
              subject, message, priority, status, response, quoted_price as "quotedPrice",
              delivery_time as "deliveryTime", notes, created_at as "createdAt",
              responded_at as "respondedAt"
  `

  return result[0] as Inquiry
}
