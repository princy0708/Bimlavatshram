import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { CartContext } from '../context/CartContext';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="container flex-center fade-in" style={{ minHeight: '60vh', flexDirection: 'column', gap: '24px' }}>
        <ShoppingBag size={64} color="var(--text-muted)" />
        <h2 style={{ color: 'var(--text-muted)' }}>Your cart is empty</h2>
        <Link to="/" className="btn btn-primary">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container fade-in" style={{ padding: '40px 24px' }}>
      <h1 className="page-title">Your Cart</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '40px', alignItems: 'start' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {cart.map(item => (
            <div key={item.id} className="glass" style={{ display: 'flex', padding: '16px', borderRadius: 'var(--radius-md)', gap: '24px', alignItems: 'center' }}>
              <img src={item.image} alt={item.name} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
              <div style={{ flexGrow: 1 }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{item.name}</h3>
                <p style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>${item.price}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', background: 'var(--surface-color)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ background: 'none', border: 'none', color: 'var(--text-main)', padding: '8px', cursor: 'pointer' }}>
                    <Minus size={16} />
                  </button>
                  <span style={{ padding: '0 12px', fontWeight: 'bold' }}>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ background: 'none', border: 'none', color: 'var(--text-main)', padding: '8px', cursor: 'pointer' }}>
                    <Plus size={16} />
                  </button>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="btn btn-danger" style={{ padding: '8px' }}>
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
          <button onClick={clearCart} className="btn btn-secondary mt-4" style={{ alignSelf: 'flex-start' }}>Clear Cart</button>
        </div>

        <div className="glass" style={{ padding: '24px', borderRadius: 'var(--radius-md)', position: 'sticky', top: '100px' }}>
          <h2 style={{ marginBottom: '24px' }}>Order Summary</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid var(--border-color)' }}>
            <span style={{ color: 'var(--text-muted)' }}>Shipping</span>
            <span>Free</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px', fontSize: '1.25rem', fontWeight: 'bold' }}>
            <span>Total</span>
            <span style={{ color: 'var(--primary-color)' }}>${total.toFixed(2)}</span>
          </div>
          <button className="btn btn-primary" style={{ width: '100%' }}>Proceed to Checkout</button>
        </div>

      </div>
    </div>
  );
};

export default Cart;
