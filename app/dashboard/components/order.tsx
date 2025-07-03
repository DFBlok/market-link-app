'use client';

import { useEffect, useState } from 'react';

type Order = {
  id: number;
  buyerId: number;
  status: string;
  totalAmount: number;
  paymentStatus: string;
  shippingAddress: string;
  orderDate: string;
};

export default function SupplierOrders({ supplierId }: { supplierId: number }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      const res = await fetch(`/api/orders?supplierId=${supplierId}`);
      const data = await res.json();
      setOrders(data);
      setLoading(false);
    }
    fetchOrders();
  }, [supplierId]);

  if (loading) return <div>Loading...</div>;
  if (!orders.length) return <div>No orders found.</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Orders</h2>
      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Order ID</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Total</th>
            <th className="p-2 border">Payment</th>
            <th className="p-2 border">Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-t">
              <td className="p-2 border">{order.id}</td>
              <td className="p-2 border">{order.status}</td>
              <td className="p-2 border">R{order.totalAmount}</td>
              <td className="p-2 border">{order.paymentStatus}</td>
              <td className="p-2 border">{new Date(order.orderDate).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
