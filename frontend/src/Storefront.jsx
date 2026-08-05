import React, { useState, useEffect } from 'react';
import { useCart } from './CartContext';

const Storefront = () => {
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Added decreaseQuantity from useCart context
  const { cart, addToCart, decreaseQuantity, removeFromCart, getTotal } = useCart();

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/store/mays-bakery/products');
        const data = await res.json();
        setStore(data.store);
        setProducts(data.products || []);
      } catch (err) {
        console.error('Error loading store:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStoreData();
  }, []);

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', fontSize: '18px' }}>Loading Store...</div>;
  }

  // Filter out empty or undefined categories
  const validCategories = [...new Set(products.map(p => p.category).filter(Boolean))];
  const categories = ['All', ...validCategories];
  
  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <div style={{ fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif', backgroundColor: '#f8f9fa', minHeight: '100vh', paddingBottom: '60px' }}>
      
      {/* Top Banner */}
      <div style={{ backgroundColor: '#e83e8c', color: 'white', textAlign: 'center', padding: '8px', fontSize: '14px', fontWeight: '500' }}>
        🚚 Instant delivery available across town! Order fresh baked treats today.
      </div>

      {/* Navigation Header */}
      <header style={{ backgroundColor: 'white', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', color: '#333' }}>{store?.name || "May's Bakery"}</h1>
          <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: '13px' }}>{store?.description}</p>
        </div>

        <button 
          onClick={() => setIsCartOpen(!isCartOpen)} 
          style={{ backgroundColor: '#e83e8c', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          🛒 Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})
        </button>
      </header>

      <div style={{ maxWidth: '1100px', margin: '24px auto', padding: '0 16px' }}>
        
        {/* Category Filters */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '8px' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '8px 18px',
                borderRadius: '20px',
                border: selectedCategory === cat ? 'none' : '1px solid #ddd',
                backgroundColor: selectedCategory === cat ? '#333' : 'white',
                color: selectedCategory === cat ? 'white' : '#333',
                cursor: 'pointer',
                fontWeight: '500',
                whiteSpace: 'nowrap'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {filteredProducts.map((product) => (
            <div key={product._id} style={{ backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <img 
                  src={product.imageUrl || 'https://via.placeholder.com/300'} 
                  alt={product.title} 
                  style={{ width: '100%', height: '200px', objectFit: 'cover' }} 
                />
                <div style={{ padding: '16px' }}>
                  <span style={{ fontSize: '12px', color: '#e83e8c', fontWeight: 'bold', textTransform: 'uppercase' }}>{product.category}</span>
                  <h3 style={{ margin: '6px 0', fontSize: '18px', color: '#222' }}>{product.title}</h3>
                  <p style={{ color: '#666', fontSize: '13px', lineHeight: '1.4', margin: '0 0 12px 0' }}>{product.description}</p>
                </div>
              </div>

              <div style={{ padding: '16px', paddingTop: '0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#222' }}>₦{product.price.toLocaleString()}</span>
                <button 
                  onClick={() => addToCart(product)}
                  style={{ backgroundColor: '#e83e8c', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Drawer Overlay */}
      {isCartOpen && (
        <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ width: '100%', maxWidth: '400px', backgroundColor: 'white', height: '100%', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxSizing: 'border-box' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '12px' }}>
                <h2 style={{ margin: 0, fontSize: '20px' }}>Your Shopping Cart</h2>
                <button onClick={() => setIsCartOpen(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
              </div>

              <div style={{ marginTop: '20px', maxHeight: '60vh', overflowY: 'auto' }}>
                {cart.length === 0 ? (
                  <p style={{ color: '#888', textAlign: 'center', marginTop: '40px' }}>Your cart is empty.</p>
                ) : (
                  cart.map(item => (
                    <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
                      <div>
                        <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{item.title}</div>
                        <div style={{ color: '#666', fontSize: '13px' }}>₦{item.price.toLocaleString()}</div>
                      </div>

                      {/* Quantity Controls (- Qty +) */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button 
                          onClick={() => decreaseQuantity(item._id)}
                          style={{ width: '28px', height: '28px', backgroundColor: '#f0f0f0', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                          -
                        </button>
                        
                        <span style={{ fontWeight: 'bold', fontSize: '14px', minWidth: '16px', textAlign: 'center' }}>
                          {item.quantity}
                        </span>
                        
                        <button 
                          onClick={() => addToCart(item)}
                          style={{ width: '28px', height: '28px', backgroundColor: '#f0f0f0', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                          +
                        </button>
                        
                        <button 
                          onClick={() => removeFromCart(item._id)} 
                          style={{ background: '#ff4d4f', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 8px', marginLeft: '6px', cursor: 'pointer', fontSize: '12px' }}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div style={{ borderTop: '1px solid #eee', paddingTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>
                <span>Total:</span>
                <span>₦{getTotal().toLocaleString()}</span>
              </div>
              <button 
                onClick={() => alert(`Order Placed for ₦${getTotal().toLocaleString()}! Sent to store owner on WhatsApp.`)}
                disabled={cart.length === 0}
                style={{ width: '100%', backgroundColor: cart.length === 0 ? '#ccc' : '#25D366', color: 'white', border: 'none', padding: '14px', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: cart.length === 0 ? 'not-allowed' : 'pointer' }}
              >
                Checkout via WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Storefront;