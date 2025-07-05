import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { supplierId, buyerId, shippingAddress, items } = body;

    if (!supplierId || !buyerId || !shippingAddress || !items || items.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // ✅ Check if buyer exists
    const buyerResult = await sql`SELECT id FROM users WHERE id = ${buyerId}`;
    if (buyerResult.rowCount === 0) {
      return NextResponse.json({ error: `Buyer with ID ${buyerId} does not exist` }, { status: 400 });
    }

    // ✅ Check if supplier exists (optional but good practice)
    const supplierResult = await sql`SELECT id FROM users WHERE id = ${supplierId}`;
    if (supplierResult.rowCount === 0) {
      return NextResponse.json({ error: `Supplier with ID ${supplierId} does not exist` }, { status: 400 });
    }

    // 1. Create the order
    const orderResult = await sql`
      INSERT INTO orders (supplier_id, buyer_id, order_date, shipping_address)
      VALUES (${supplierId}, ${buyerId}, NOW(), ${shippingAddress})
      RETURNING id;
    `;
    const orderId = orderResult.rows[0].id;

    // 2. Insert each order item
    for (const item of items) {
      const { productId, quantity, price } = item;

      if (!productId || !quantity || !price) continue;

      await sql`
        INSERT INTO order_items (order_id, product_id, quantity, price)
        VALUES (${orderId}, ${productId}, ${quantity}, ${price});
      `;
    }

    return NextResponse.json({ message: 'Order created', orderId }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
