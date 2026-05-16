import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { WishlistContext } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';

const Wishlist = () => {
  const { wishlist, loading } = useContext(WishlistContext);

  if (loading) {
    return <div className="loader"></div>;
  }

  if (wishlist.length === 0) {
    return (
      <div className="container flex-center fade-in" style={{ minHeight: '60vh', flexDirection: 'column', gap: '24px' }}>
        <Heart size={64} color="var(--text-muted)" />
        <h2 style={{ color: 'var(--text-muted)', fontFamily: "'Playfair Display', serif" }}>Your Wishlist is empty</h2>
        <Link to="/" className="btn btn-primary" style={{ padding: '16px 32px' }}>Explore Collection</Link>
      </div>
    );
  }

  return (
    <div className="container fade-in" style={{ padding: '40px 24px' }}>
      <h1 className="page-title" style={{ marginBottom: '40px' }}>My Wishlist</h1>
      
      <div className="products-grid">
        {wishlist.map(item => (
          <ProductCard key={item.product_id} product={item.products} />
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
