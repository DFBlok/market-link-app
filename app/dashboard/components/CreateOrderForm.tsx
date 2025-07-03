'use client';

import { useState } from 'react';

export default function CreateOrderForm({ supplierId }: { supplierId: number }) {
  const [buyerId, setBuyerId] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [items, setItems] = useState([{ productId: '', quantity: 1, price: 0 }]);

  const handleItemChange = (index: number, field: string, value: any) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const addItem = () => {
    setItems([...items, { productId: '', quantity: 1, price: 0 }]);
  };

  const removeItem = (index: number) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        supplierId: parseInt(supplierId.toString()),
        buyerId: parseInt(buyerId),
        shippingAddress,
        items: items.map(item => ({
          productId: parseInt(item.productId),
          quantity: parseInt(item.quantity.toString()),
          price: parseFloat(item.price.toString())
        }))
      })
    });

    if (res.ok) {
      alert('Order created!');
      setBuyerId('');
      setShippingAddress('');
      setItems([{ productId: '', quantity: 1, price: 0 }]);
    } else {
      alert('Failed to create order.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded shadow bg-white">
      <h2 className="text-lg font-bold">Create New Order</h2>

      <div>
        <label className="block font-medium">Buyer ID</label>
        <input
          type="number"
          value={buyerId}
          onChange={(e) => setBuyerId(e.target.value)}
          className="border p-2 w-full"
          required
        />
      </div>

      <div>
        <label className="block font-medium">Shipping Address</label>
        <textarea
          value={shippingAddress}
          onChange={(e) => setShippingAddress(e.target.value)}
          className="border p-2 w-full"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block font-medium">Order Items</label>
        {items.map((item, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="number"
              placeholder="Product ID"
              value={item.productId}
              onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
              className="border p-2 w-1/4"
              required
            />
            <input
              type="number"
              placeholder="Quantity"
              value={item.quantity}
              onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
              className="border p-2 w-1/4"
              required
            />
            <input
              type="number"
              step="0.01"
              placeholder="Price"
              value={item.price}
              onChange={(e) => handleItemChange(index, 'price', e.target.value)}
              className="border p-2 w-1/4"
              required
            />
            <button type="button" onClick={() => removeItem(index)} className="text-red-600">
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={addItem} className="text-blue-600">
          + Add Item
        </button>
      </div>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Submit Order
      </button>
    </form>
  );
}
