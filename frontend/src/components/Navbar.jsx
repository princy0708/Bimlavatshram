import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, LayoutDashboard, Search } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="navbar glass-strong">
      <div className="container nav-container">
        <Link to="/" className="nav-brand">
          Kurta<span>Store</span>
        </Link>

        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          {user?.is_admin && (
            <Link to="/admin" className="nav-link">
              <LayoutDashboard size={18} />
              Dashboard
            </Link>
          )}
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
              <span className="nav-link" style={{ cursor: 'default', color: 'var(--text-body)' }}>
                <User size={18} />
                {user.name || user.email}
              </span>
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
