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
    <div className="container fade-in has-sticky-bottom" style={{ padding: '40px 24px' }}>
      <h1 className="page-title" style={{ marginBottom: '40px' }}>Shopping Cart</h1>
      
      <div className="desktop-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '48px', alignItems: 'start' }}>
        
        {/* Cart Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {cart.map(item => (
            <div key={item.uniqueCartId} className="glass-strong" style={{ display: 'flex', padding: '16px', borderRadius: 'var(--radius-lg)', gap: '16px', alignItems: 'center' }}>
              <img src={item.images?.[0] || item.image} alt={item.name} style={{ width: '80px', height: '100px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
              
              <div style={{ flexGrow: 1 }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '4px', color: 'var(--text-dark)' }}>{item.name}</h3>
                <p style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1rem', marginBottom: '8px' }}>₹{item.price}</p>
                
                <div style={{ display: 'flex', gap: '8px', fontSize: '0.75rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                  {item.selectedSize && <span style={{ background: 'var(--bg-cream)', padding: '2px 8px', borderRadius: '100px' }}>S: <strong>{item.selectedSize}</strong></span>}
                  {item.selectedColor && <span style={{ background: 'var(--bg-cream)', padding: '2px 8px', borderRadius: '100px' }}>C: <strong>{item.selectedColor}</strong></span>}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
                <button onClick={() => removeFromCart(item.uniqueCartId)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626' }}>
                  <Trash2 size={18} />
                </button>
                
                <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-white)', borderRadius: '100px', border: '1px solid var(--border)' }}>
                  <button onClick={() => updateQuantity(item.uniqueCartId, item.quantity - 1)} style={{ background: 'none', border: 'none', padding: '6px 10px', cursor: 'pointer' }}>
                    <Minus size={14} />
                  </button>
                  <span style={{ padding: '0 4px', fontWeight: 'bold', minWidth: '24px', textAlign: 'center', fontSize: '0.9rem' }}>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.uniqueCartId, item.quantity + 1)} style={{ background: 'none', border: 'none', padding: '6px 10px', cursor: 'pointer' }}>
                    <Plus size={14} />
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
          
          <button onClick={() => navigate('/checkout')} className="btn btn-primary desktop-only" style={{ width: '100%', padding: '18px', fontSize: '1.1rem' }}>
            Proceed to Checkout
          </button>
          
          <p className="desktop-only" style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '20px' }}>
            Secure checkout powered by Stripe.
          </p>
        </div>

      </div>

      {/* Mobile Checkout Bar */}
      <div className="sticky-bottom-mobile">
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Amount</span>
          <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary)' }}>₹{total.toFixed(2)}</span>
        </div>
        <button onClick={() => navigate('/checkout')} className="btn btn-primary" style={{ flexGrow: 1, padding: '14px' }}>
          Checkout Now
        </button>
      </div>
    </div>
    </div>
  );
};

export default Cart;
