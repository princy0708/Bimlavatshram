import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);

  const isLiked = isInWishlist(product.id);

  return (
    <div className="product-card" style={{ position: 'relative' }}>
      {/* Wishlist Button */}
      <button 
        onClick={(e) => {
          e.preventDefault();
          toggleWishlist(product);
        }}
        style={{
          position: 'absolute', top: '16px', right: '16px', zIndex: 10,
          background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(4px)',
          border: 'none', borderRadius: '50%', width: '36px', height: '36px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: 'all 0.3s ease',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
      >
        <Heart size={20} fill={isLiked ? '#ef4444' : 'transparent'} color={isLiked ? '#ef4444' : 'var(--text-dark)'} />
      </button>

      <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="product-image-container">
          <img src={product.images?.[0] || product.image} alt={product.name} className="product-image" />
          <span className="product-badge new">New</span>
        </div>
        <div className="product-info">
          <p className="product-category">{product.category || 'Kurta'}</p>
          <h3 className="product-title">{product.name}</h3>
          <p className="product-price">
            ₹{product.price}
          </p>
        </div>
      </Link>
      <div style={{ padding: '0 20px 20px 20px' }}>
        <button 
          className="btn btn-primary" 
          style={{ width: '100%', padding: '10px 20px', fontSize: '0.9rem' }}
          onClick={(e) => {
            e.preventDefault();
            if (product.is_stitched || (product.colors && product.colors.length > 0)) {
              // Redirect to product details to select size/color
              window.location.href = `/product/${product.id}`;
            } else {
              addToCart(product);
            }
          }}
        >
          {(product.is_stitched || (product.colors && product.colors.length > 0)) ? 'Select Options' : <><ShoppingCart size={16} /> Add to Cart</>}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
