import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { supabase } from '../api/supabaseClient';
import { CartContext } from '../context/CartContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useContext(CartContext);

  // Variation state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setProduct(data);
        
        // Auto-select first available options
        if (data.sizes && data.sizes.length > 0) setSelectedSize(data.sizes[0]);
        if (data.colors && data.colors.length > 0) setSelectedColor(data.colors[0]);
      } catch (err) {
        setError('Product not found.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="loader"></div>;
  if (error) return <div className="text-center" style={{ color: '#ef4444', marginTop: '40px' }}>{error}</div>;
  if (!product) return null;

  const images = product.images && product.images.length > 0 ? product.images : [product.image];

  const handleAddToCart = () => {
    if (product.is_stitched && product.sizes?.length > 0 && !selectedSize) {
      alert('Please select a size');
      return;
    }
    if (product.colors?.length > 0 && !selectedColor) {
      alert('Please select a color');
      return;
    }

    addToCart({
      ...product,
      cartItemId: `${product.id}-${selectedSize}-${selectedColor}`, // Unique ID for cart based on variations
      selectedSize,
      selectedColor
    });
    alert('Added to cart!');
  };

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  return (
    <div className="container fade-in" style={{ padding: '40px 24px' }}>
      <button onClick={() => navigate(-1)} className="btn btn-secondary mb-4" style={{ padding: '8px 16px' }}>
        <ArrowLeft size={18} /> Back
      </button>

      <div className="glass-strong" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '48px', padding: '48px', borderRadius: 'var(--radius-xl)' }}>
        
        {/* Image Gallery */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden', height: '500px', background: 'var(--bg-cream)' }}>
            <img src={images[currentImageIndex]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            
            {images.length > 1 && (
              <>
                <button onClick={prevImage} className="carousel-arrow prev" style={{ width: '40px', height: '40px' }}>
                  <ChevronLeft size={20} />
                </button>
                <button onClick={nextImage} className="carousel-arrow next" style={{ width: '40px', height: '40px' }}>
                  <ChevronRight size={20} />
                </button>
              </>
            )}
            
            {!product.is_stitched && (
              <span className="product-badge" style={{ background: 'var(--secondary)', color: 'white', position: 'absolute', top: '20px', right: '20px', left: 'auto' }}>
                Unstitched Fabric
              </span>
            )}
          </div>
          
          {/* Thumbnails */}
          {images.length > 1 && (
            <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
              {images.map((img, index) => (
                <div 
                  key={index} 
                  onClick={() => setCurrentImageIndex(index)}
                  style={{ 
                    width: '80px', height: '80px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', cursor: 'pointer',
                    border: currentImageIndex === index ? '3px solid var(--primary)' : '1px solid var(--border)',
                    opacity: currentImageIndex === index ? 1 : 0.6
                  }}
                >
                  <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <p className="product-category" style={{ fontSize: '1rem', marginBottom: '8px' }}>{product.category}</p>
          <h1 style={{ fontSize: '2.8rem', fontFamily: "'Playfair Display', serif", marginBottom: '16px', color: 'var(--text-dark)' }}>{product.name}</h1>
          <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '32px' }}>
            ₹{product.price}
          </p>

          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ marginBottom: '12px', fontSize: '1.1rem' }}>Description</h3>
            <p style={{ lineHeight: 1.7, color: 'var(--text-body)' }}>{product.description}</p>
          </div>

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ marginBottom: '12px', fontSize: '1.1rem' }}>Color: <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>{selectedColor}</span></h3>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {product.colors.map(color => (
                  <button
                    key={color}
                    onClick={() => {
                      setSelectedColor(color);
                      if (product.color_images && product.color_images[color]) {
                        const imgUrl = product.color_images[color];
                        const idx = images.indexOf(imgUrl);
                        if (idx !== -1) setCurrentImageIndex(idx);
                      }
                    }}
                    className="btn"
                    style={{
                      padding: '8px 20px',
                      borderRadius: '100px',
                      background: selectedColor === color ? 'var(--text-dark)' : 'var(--bg-white)',
                      color: selectedColor === color ? 'white' : 'var(--text-dark)',
                      border: `1px solid ${selectedColor === color ? 'var(--text-dark)' : 'var(--border)'}`
                    }}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selection */}
          {product.is_stitched && product.sizes && product.sizes.length > 0 && (
            <div style={{ marginBottom: '40px' }}>
              <h3 style={{ marginBottom: '12px', fontSize: '1.1rem' }}>Size: <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>{selectedSize}</span></h3>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    style={{
                      width: '50px', height: '50px', borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 600, fontSize: '1.1rem', cursor: 'pointer', transition: 'all 0.2s',
                      background: selectedSize === size ? 'var(--primary)' : 'var(--bg-white)',
                      color: selectedSize === size ? 'white' : 'var(--text-dark)',
                      border: `2px solid ${selectedSize === size ? 'var(--primary)' : 'var(--border)'}`,
                      boxShadow: selectedSize === size ? 'var(--shadow-glow)' : 'none'
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid var(--border-light)' }}>
            <p style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#16a34a', fontWeight: 600, marginBottom: '24px' }}>
              <Check size={20} /> In Stock ({product.stock} available)
            </p>
            <button className="btn btn-primary" onClick={handleAddToCart} style={{ width: '100%', padding: '18px 32px', fontSize: '1.2rem' }}>
              <ShoppingCart size={24} /> Add to Cart
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
