import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { supabase } from '../api/supabaseClient';
import { CartContext } from '../context/CartContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useContext(CartContext);

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

  return (
    <div className="container fade-in" style={{ padding: '40px 24px' }}>
      <button onClick={() => navigate(-1)} className="btn btn-secondary mb-4" style={{ padding: '8px 16px' }}>
        <ArrowLeft size={18} /> Back
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', background: 'var(--surface-color)', padding: '40px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
        <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
          <img src={product.image} alt={product.name} style={{ width: '100%', height: 'auto', objectFit: 'cover' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '16px', color: 'var(--text-main)' }}>{product.name}</h1>
          <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary-color)', marginBottom: '24px' }}>
            ${product.price.toFixed(2)}
          </p>
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ marginBottom: '8px', color: 'var(--text-muted)' }}>Description</h3>
            <p style={{ lineHeight: 1.6 }}>{product.description}</p>
          </div>
          <button className="btn btn-primary" onClick={() => addToCart(product)} style={{ padding: '16px 32px', fontSize: '1.1rem' }}>
            <ShoppingCart size={24} /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
