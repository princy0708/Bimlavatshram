import React, { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { supabase } from '../api/supabaseClient';
import { Trash2, PlusCircle, LayoutDashboard } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('');
  
  const [message, setMessage] = useState('');

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.is_admin) {
      fetchProducts();
    }
  }, [user]);

  if (!user || !user.is_admin) {
    return <Navigate to="/" replace />;
  }

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const { error } = await supabase
        .from('products')
        .insert([{
          name,
          description,
          price: Number(price),
          image,
          category,
          stock: Number(stock)
        }]);

      if (error) throw error;

      setMessage('Product added successfully!');
      // Reset form
      setName(''); setDescription(''); setPrice(''); setImage(''); setCategory(''); setStock('');
      fetchProducts();
    } catch (error) {
      setMessage('Error adding product: ' + error.message);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', id);

        if (error) throw error;
        fetchProducts();
      } catch (error) {
        alert('Error deleting product: ' + error.message);
      }
    }
  };

  return (
    <div className="container fade-in" style={{ padding: '40px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
        <LayoutDashboard size={40} color="var(--primary-color)" />
        <h1 className="page-title" style={{ margin: 0 }}>Admin Dashboard</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px', alignItems: 'start' }}>
        
        {/* Add Product Form */}
        <div className="glass" style={{ padding: '32px', borderRadius: 'var(--radius-md)' }}>
          <h2 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PlusCircle size={20} /> Add New Product
          </h2>
          {message && <div style={{ padding: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: 'var(--radius-sm)', marginBottom: '16px', color: message.includes('Error') ? '#ef4444' : '#4ade80' }}>{message}</div>}
          <form onSubmit={handleAddProduct} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="input-group">
              <label>Product Name</label>
              <input type="text" className="input-field" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="input-group">
              <label>Description</label>
              <textarea className="input-field" value={description} onChange={e => setDescription(e.target.value)} required rows={3}></textarea>
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div className="input-group" style={{ flex: 1 }}>
                <label>Price ($)</label>
                <input type="number" step="0.01" className="input-field" value={price} onChange={e => setPrice(e.target.value)} required />
              </div>
              <div className="input-group" style={{ flex: 1 }}>
                <label>Stock</label>
                <input type="number" className="input-field" value={stock} onChange={e => setStock(e.target.value)} required />
              </div>
            </div>
            <div className="input-group">
              <label>Category</label>
              <input type="text" className="input-field" value={category} onChange={e => setCategory(e.target.value)} required />
            </div>
            <div className="input-group">
              <label>Image URL</label>
              <input type="url" className="input-field" value={image} onChange={e => setImage(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary mt-4">Add Product</button>
          </form>
        </div>

        {/* Product List */}
        <div className="glass" style={{ padding: '32px', borderRadius: 'var(--radius-md)' }}>
          <h2 style={{ marginBottom: '24px' }}>Manage Inventory</h2>
          {loading ? <div className="loader"></div> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {products.map(product => (
                <div key={product.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'var(--surface-color)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <img src={product.image} alt={product.name} style={{ width: '50px', height: '50px', borderRadius: '4px', objectFit: 'cover' }} />
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{product.name}</h4>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>${product.price} | Stock: {product.stock}</span>
                    </div>
                  </div>
                  <button onClick={() => handleDeleteProduct(product.id)} className="btn btn-danger" style={{ padding: '8px' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {products.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No products in inventory.</p>}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
