// frontend/src/AdminDashboard.jsx
import React, { useState } from 'react';

export default function AdminDashboard({ storeId }) {
  const [form, setForm] = useState({
    title: '',
    price: '',
    description: '',
    imageUrl: '',
    stock: 10
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, storeId })
    });

    if (res.ok) {
      alert('Product added successfully!');
      setForm({ title: '', price: '', description: '', imageUrl: '', stock: 10 });
    } else {
      alert('Failed to add product');
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '30px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Merchant Dashboard - Add Product</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="text" 
          placeholder="Product Title" 
          value={form.title} 
          onChange={(e) => setForm({ ...form, title: e.target.value })} 
          required 
        />
        <input 
          type="number" 
          placeholder="Price (₦)" 
          value={form.price} 
          onChange={(e) => setForm({ ...form, price: e.target.value })} 
          required 
        />
        <input 
          type="text" 
          placeholder="Image URL" 
          value={form.imageUrl} 
          onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} 
        />
        <textarea 
          placeholder="Description" 
          value={form.description} 
          onChange={(e) => setForm({ ...form, description: e.target.value })} 
        />
        <button type="submit" style={{ padding: '10px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px' }}>
          Publish Product
        </button>
      </form>
    </div>
  );
}