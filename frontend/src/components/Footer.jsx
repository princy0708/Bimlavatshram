import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, Shield, Headphones, RotateCcw } from 'lucide-react';

const Footer = () => {
  return (
    <>
      {/* Trust Badges */}
      <div className="container" style={{ marginTop: '60px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
          {[
            { icon: <Truck size={28} />, title: 'Free Shipping', desc: 'On orders over ₹999' },
            { icon: <Shield size={28} />, title: 'Secure Payment', desc: '100% secure checkout' },
            { icon: <Headphones size={28} />, title: '24/7 Support', desc: 'Dedicated support' },
            { icon: <RotateCcw size={28} />, title: 'Easy Returns', desc: '7-day return policy' },
          ].map((item, i) => (
            <div key={i} className="glass" style={{ padding: '28px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <div style={{ color: 'var(--primary)', marginBottom: '12px' }}>{item.icon}</div>
              <h4 style={{ fontSize: '1rem', marginBottom: '4px', color: 'var(--text-dark)' }}>{item.title}</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '40px', marginBottom: '40px' }}>
            <div>
              <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', marginBottom: '16px' }}>
                Kurta<span style={{ color: 'var(--primary-light)' }}>Store</span>
              </h4>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.7 }}>
                Your destination for premium handcrafted Kurtas. Celebrating Indian heritage with modern elegance.
              </p>
            </div>
            <div>
              <h4>Quick Links</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Link to="/">Home</Link>
                <Link to="/cart">Cart</Link>
                <Link to="/login">My Account</Link>
              </div>
            </div>
            <div>
              <h4>Categories</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <a href="#">Cotton Kurtas</a>
                <a href="#">Silk Kurtas</a>
                <a href="#">Wedding Collection</a>
                <a href="#">Casual Wear</a>
              </div>
            </div>
            <div>
              <h4>Contact Us</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
                <span>📍 Mumbai, India</span>
                <span>📧 hello@kurtastore.com</span>
                <span>📞 +91 98765 43210</span>
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '24px', textAlign: 'center', fontSize: '0.85rem' }}>
            © 2026 KurtaStore. All rights reserved. Made with ❤️ in India.
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
