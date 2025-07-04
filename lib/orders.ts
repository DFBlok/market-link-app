
import { sql } from '@vercel/postgres'; // or your Neon/Postgres lib

export type Order = {
  id: number;
  supplierId: number;
  buyerId: number;
  status: string;
  totalAmount: number;
  paymentStatus: string;
  shippingAddress: string;
  orderDate: string;
  updatedAt: string;
};

export async function getOrdersBySupplier(supplierId: number): Promise<Order[]> {
  const orders = await sql`
    SELECT id, supplier_id as "supplierId", buyer_id as "buyerId", status, total_amount as "totalAmount",
      payment_status as "paymentStatus", shipping_address as "shippingAddress", order_date as "orderDate", updated_at as "updatedAt"
    FROM orders
    WHERE supplier_id = ${supplierId}
    ORDER BY order_date DESC
  `;
  return orders.rows as Order[];
}
