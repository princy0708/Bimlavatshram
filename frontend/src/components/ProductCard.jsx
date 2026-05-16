import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { CartContext } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="product-image-container">
          <img src={product.image} alt={product.name} className="product-image" />
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
            addToCart(product);
          }}
        >
          <ShoppingCart size={16} /> Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
