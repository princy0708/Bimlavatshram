import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, LayoutDashboard, Heart, Settings } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const { wishlist } = useContext(WishlistContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Simplified Admin Navbar
  if (user?.is_admin) {
    return (
      <nav className="navbar glass-strong" style={{ borderBottom: '2px solid var(--primary)' }}>
        <div className="container nav-container">
          <Link to="/" className="nav-brand">
            Kurta<span>Store</span> <span style={{ fontSize: '0.8rem', background: 'var(--primary)', color: 'white', padding: '2px 8px', borderRadius: '100px', marginLeft: '8px' }}>ADMIN</span>
          </Link>
          <div className="nav-links">
            <Link to="/" className="nav-link">Home Page</Link>
            <Link to="/admin" className="nav-link" style={{ fontWeight: 600, color: 'var(--primary)' }}>
              <LayoutDashboard size={18} />
              Admin Dashboard
            </Link>
            <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </nav>
    );
  }

  // Standard User Navbar
  return (
    <nav className="navbar glass-strong">
      <div className="container nav-container">
        <Link to="/" className="nav-brand">
          Kurta<span>Store</span>
        </Link>

        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          
          <Link to="/wishlist" className="nav-link" style={{ position: 'relative' }}>
            <Heart size={18} />
            Wishlist
            {wishlist.length > 0 && (
              <span className="badge" style={{ position: 'absolute', top: '-4px', right: '-8px' }}>
                {wishlist.length}
              </span>
            )}
          </Link>

          <Link to="/cart" className="nav-link" style={{ position: 'relative' }}>
            <ShoppingCart size={18} />
            Cart
            {totalItems > 0 && (
              <span className="badge" style={{ position: 'absolute', top: '-4px', right: '-8px' }}>
                {totalItems}
              </span>
            )}
          </Link>

          {user ? (
            <>
              <Link to="/settings" className="nav-link" style={{ position: 'relative' }}>
                <Settings size={18} />
                Settings
              </Link>
              <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary" style={{ padding: '10px 24px', fontSize: '0.85rem' }}>
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
