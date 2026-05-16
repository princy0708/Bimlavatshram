import React, { useState, useEffect } from 'react';
import { supabase } from '../api/supabaseClient';
import ProductCard from '../components/ProductCard';
import HeroCarousel from '../components/HeroCarousel';
import Footer from '../components/Footer';

const categories = ['All', 'Cotton', 'Silk', 'Wedding', 'Casual', 'Festive'];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProducts(data);
      } catch (err) {
        setError('Failed to fetch products. Please check your Supabase setup.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = activeCategory === 'All'
    ? products
    : products.filter(p => p.category?.toLowerCase() === activeCategory.toLowerCase());

  return (
    <div className="fade-in">
      {/* Hero Carousel */}
      <div className="container" style={{ paddingTop: '32px' }}>
        <HeroCarousel />
      </div>

      {/* Categories */}
      <div className="container">
        <div className="categories-section">
          <div className="categories-grid">
            {categories.map(cat => (
              <button
                key={cat}
                className={`category-chip ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="container">
        <div className="section-header">
          <div>
            <h2 className="section-title">
              {activeCategory === 'All' ? 'Our Collection' : `${activeCategory} Kurtas`}
            </h2>
            <p className="section-subtitle">Handcrafted with love, designed for you</p>
          </div>
        </div>

        {loading ? (
          <div className="loader"></div>
        ) : error ? (
          <div className="text-center" style={{ color: '#ef4444', padding: '40px' }}>{error}</div>
        ) : filteredProducts.length > 0 ? (
          <div className="products-grid">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center" style={{ padding: '80px 0' }}>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              {products.length === 0 ? 'No products yet. Add some from the Admin Dashboard!' : 'No products in this category.'}
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Home;
