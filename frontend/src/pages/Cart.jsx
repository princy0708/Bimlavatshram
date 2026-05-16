import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { CartContext } from '../context/CartContext';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="container flex-center fade-in" style={{ minHeight: '60vh', flexDirection: 'column', gap: '24px' }}>
        <ShoppingBag size={64} color="var(--text-muted)" />
        <h2 style={{ color: 'var(--text-muted)', fontFamily: "'Playfair Display', serif" }}>Your cart is empty</h2>
        <Link to="/" className="btn btn-primary" style={{ padding: '16px 32px' }}>Explore Collection</Link>
      </div>
    );
  }

  return (
    <div className="container fade-in" style={{ padding: '40px 24px' }}>
      <h1 className="page-title" style={{ marginBottom: '40px' }}>Shopping Cart</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '48px', alignItems: 'start' }}>
        
        {/* Cart Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {cart.map(item => (
            <div key={item.uniqueCartId} className="glass-strong" style={{ display: 'flex', padding: '24px', borderRadius: 'var(--radius-lg)', gap: '24px', alignItems: 'center' }}>
              <img src={item.images?.[0] || item.image} alt={item.name} style={{ width: '120px', height: '140px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
              
              <div style={{ flexGrow: 1 }}>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '8px', color: 'var(--text-dark)' }}>{item.name}</h3>
                <p style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '12px' }}>₹{item.price}</p>
                
                <div style={{ display: 'flex', gap: '16px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  {item.selectedSize && <span style={{ background: 'var(--bg-cream)', padding: '4px 12px', borderRadius: '100px' }}>Size: <strong>{item.selectedSize}</strong></span>}
                  {item.selectedColor && <span style={{ background: 'var(--bg-cream)', padding: '4px 12px', borderRadius: '100px' }}>Color: <strong>{item.selectedColor}</strong></span>}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '16px' }}>
                <button onClick={() => removeFromCart(item.uniqueCartId)} className="btn btn-danger" style={{ padding: '8px 12px', fontSize: '0.85rem' }}>
                  <Trash2 size={16} /> Remove
                </button>
                
                <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-white)', borderRadius: '100px', border: '1px solid var(--border)' }}>
                  <button onClick={() => updateQuantity(item.uniqueCartId, item.quantity - 1)} style={{ background: 'none', border: 'none', padding: '10px 16px', cursor: 'pointer' }}>
                    <Minus size={16} />
                  </button>
                  <span style={{ padding: '0 8px', fontWeight: 'bold', minWidth: '30px', textAlign: 'center' }}>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.uniqueCartId, item.quantity + 1)} style={{ background: 'none', border: 'none', padding: '10px 16px', cursor: 'pointer' }}>
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          <button onClick={clearCart} className="btn btn-outline mt-4" style={{ alignSelf: 'flex-start' }}>Clear Cart</button>
        </div>

        {/* Order Summary */}
        <div className="glass-strong" style={{ padding: '32px', borderRadius: 'var(--radius-lg)', position: 'sticky', top: '100px' }}>
          <h2 style={{ marginBottom: '32px', fontFamily: "'Playfair Display', serif" }}>Order Summary</h2>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '1.05rem' }}>
            <span style={{ color: 'var(--text-body)' }}>Subtotal</span>
            <span style={{ fontWeight: 600 }}>₹{total.toFixed(2)}</span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid var(--border-light)', fontSize: '1.05rem' }}>
            <span style={{ color: 'var(--text-body)' }}>Shipping</span>
            <span style={{ color: '#16a34a', fontWeight: 600 }}>Free</span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px', fontSize: '1.4rem', fontWeight: 800 }}>
            <span>Total</span>
            <span style={{ color: 'var(--primary)' }}>₹{total.toFixed(2)}</span>
          </div>
          
          <button onClick={() => navigate('/checkout')} className="btn btn-primary" style={{ width: '100%', padding: '18px', fontSize: '1.1rem' }}>
            Proceed to Checkout
          </button>
          
          <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '20px' }}>
            Secure checkout powered by Stripe.
          </p>
        </div>

      </div>
    </div>
  );
};

export default Cart;
