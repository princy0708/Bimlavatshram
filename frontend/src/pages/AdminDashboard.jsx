import React, { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { supabase } from '../api/supabaseClient';
import { Trash2, PlusCircle, LayoutDashboard, Package, ShoppingBag, TrendingUp, AlertTriangle, X, Upload, Clock, Truck, CheckCircle } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [tab, setTab] = useState('overview');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState('');
  const [name, setName] = useState(''); const [desc, setDesc] = useState(''); const [price, setPrice] = useState('');
  const [category, setCategory] = useState(''); const [stock, setStock] = useState('');
  const [isStitched, setIsStitched] = useState(true); const [sizes, setSizes] = useState([]);
  const [colorInput, setColorInput] = useState(''); const [colorImages, setColorImages] = useState({});
  const colors = colorInput.split(',').map(c => c.trim()).filter(Boolean);

  useEffect(() => { if (user?.is_admin) { fetchProducts(); fetchOrders(); } }, [user]);
  const fetchProducts = async () => { setLoading(true); const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false }); setProducts(data || []); setLoading(false); };
  const fetchOrders = async () => { const { data } = await supabase.from('orders').select('*,address:addresses(*)').order('created_at', { ascending: false }); setOrders(data || []); };
  if (!user || !user.is_admin) return <Navigate to="/" replace />;

  const toggleSize = (s) => setSizes(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);
  const setColorImg = (c, f) => setColorImages(p => ({ ...p, [c]: f }));
  const doUpload = async () => {
    const up = {}; const urls = [];
    for (const c of Object.keys(colorImages)) {
      const f = colorImages[c]; if (!f) continue;
      const path = `products/${Math.random()}.${f.name.split('.').pop()}`;
      await supabase.storage.from('product-images').upload(path, f);
      const { data } = supabase.storage.from('product-images').getPublicUrl(path);
      up[c] = data.publicUrl; urls.push(data.publicUrl);
    }
    return { up, urls };
  };
  const addProduct = async (e) => {
    e.preventDefault(); setMsg(''); setUploading(true);
    try {
      const { up, urls } = await doUpload();
      await supabase.from('products').insert([{ name, description: desc, price: Number(price), category, stock: Number(stock), is_stitched: isStitched, sizes: isStitched ? sizes : [], colors, images: urls, color_images: up }]);
      setMsg('Added!'); setName(''); setDesc(''); setPrice(''); setCategory(''); setStock(''); setSizes([]); setColorInput(''); setColorImages({});
      setModal(false); fetchProducts();
    } catch (err) { setMsg('Error: ' + err.message); } finally { setUploading(false); }
  };
  const delProduct = async (id) => { if (window.confirm('Delete?')) { await supabase.from('products').delete().eq('id', id); fetchProducts(); } };
  const updStatus = async (id, s) => { await supabase.from('orders').update({ status: s }).eq('id', id); fetchOrders(); };

  const rev = orders.reduce((s, o) => s + (o.total_amount || 0), 0);
  const active = orders.filter(o => o.status !== 'Delivered').length;
  const low = products.filter(p => p.stock < 5).length;

  // Beige palette
  const P = {
    bg: '#faf7f2', sidebar: '#f5efe6', sidebarBorder: '#e8dfd4',
    card: '#fff', cardBorder: '#e8dfd4', cardShadow: '0 2px 12px rgba(139,109,71,0.06)',
    text: '#3d2f1e', textMuted: '#9a8672', accent: '#c4713b', accentLight: '#f0d9c6',
    tableHover: '#faf5ee', tableBorder: '#f0e8dc',
  };

  const stBadge = (s) => {
    const m = { Delivered: ['#dcfce7', '#166534'], Shipped: ['#dbeafe', '#1e40af'], 'Out for Delivery': ['#ede9fe', '#6d28d9'], Processing: ['#fef3c7', '#92400e'] };
    const [bg, color] = m[s] || ['#f3f4f6', '#6b7280'];
    return { background: bg, color, padding: '5px 14px', borderRadius: '100px', fontSize: '0.78rem', fontWeight: 700 };
  };

  const inp = { padding: '12px 16px', borderRadius: '10px', border: `1px solid ${P.sidebarBorder}`, fontSize: '0.9rem', outline: 'none', background: '#fff', color: P.text, width: '100%', boxSizing: 'border-box' };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: P.bg, color: P.text, fontFamily: "'Inter',sans-serif" }}>
      {/* Sidebar */}
      <div style={{ width: '250px', background: P.sidebar, borderRight: `1px solid ${P.sidebarBorder}`, padding: '28px 0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '0 24px 28px', fontSize: '1.4rem', fontFamily: "'Playfair Display',serif", fontWeight: 800 }}>
          Kurta<span style={{ color: P.accent }}>Store</span>
          <span style={{ display: 'block', fontSize: '0.65rem', color: P.textMuted, letterSpacing: '3px', textTransform: 'uppercase', marginTop: '4px' }}>Admin Console</span>
        </div>
        {[
          { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={18} /> },
          { id: 'inventory', label: 'Products', icon: <ShoppingBag size={18} /> },
          { id: 'orders', label: 'Orders', icon: <Package size={18} /> },
        ].map(i => (
          <button key={i.id} onClick={() => setTab(i.id)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '13px 24px', border: 'none', background: tab === i.id ? P.accentLight : 'transparent', color: tab === i.id ? P.accent : P.textMuted, cursor: 'pointer', fontSize: '0.9rem', fontWeight: tab === i.id ? 700 : 400, borderLeft: tab === i.id ? `3px solid ${P.accent}` : '3px solid transparent', transition: 'all 0.2s' }}>
            {i.icon}{i.label}
            {i.id === 'orders' && active > 0 && <span style={{ marginLeft: 'auto', background: P.accent, color: '#fff', padding: '2px 8px', borderRadius: '100px', fontSize: '0.7rem' }}>{active}</span>}
          </button>
        ))}
        <div style={{ marginTop: 'auto', padding: '20px 24px', borderTop: `1px solid ${P.sidebarBorder}`, color: P.textMuted, fontSize: '0.75rem' }}>v2.0 • Enterprise</div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: '32px 40px', overflowY: 'auto' }}>

        {tab === 'overview' && (
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '28px' }}>Dashboard</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px', marginBottom: '36px' }}>
              {[
                { label: 'Total Revenue', val: `₹${rev.toLocaleString()}`, icon: <TrendingUp size={26} />, bg: '#dcfce7', iconColor: '#16a34a' },
                { label: 'Active Orders', val: active, icon: <Truck size={26} />, bg: P.accentLight, iconColor: P.accent },
                { label: 'Low Stock', val: low, icon: <AlertTriangle size={26} />, bg: '#fef3c7', iconColor: '#d97706' },
              ].map(c => (
                <div key={c.label} style={{ background: P.card, borderRadius: '16px', border: `1px solid ${P.cardBorder}`, padding: '28px', boxShadow: P.cardShadow }}>
                  <p style={{ color: P.textMuted, fontSize: '0.8rem', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1.5px' }}>{c.label}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ fontSize: '2.2rem', fontWeight: 800, color: P.text }}>{c.val}</p>
                    <div style={{ background: c.bg, padding: '14px', borderRadius: '14px' }}>{React.cloneElement(c.icon, { color: c.iconColor })}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background: P.card, borderRadius: '16px', border: `1px solid ${P.cardBorder}`, padding: '28px', boxShadow: P.cardShadow }}>
              <h3 style={{ marginBottom: '20px', fontWeight: 600 }}>Recent Orders</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ borderBottom: `2px solid ${P.tableBorder}` }}>
                  {['Order', 'Customer', 'Amount', 'Status', 'Date'].map(h => <th key={h} style={{ textAlign: 'left', padding: '10px 14px', fontSize: '0.75rem', color: P.textMuted, textTransform: 'uppercase', letterSpacing: '1px' }}>{h}</th>)}
                </tr></thead>
                <tbody>{orders.slice(0, 5).map(o => (
                  <tr key={o.id} style={{ borderBottom: `1px solid ${P.tableBorder}` }} onMouseOver={e => e.currentTarget.style.background = P.tableHover} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '14px', fontWeight: 600, fontSize: '0.9rem' }}>#{o.id.slice(0, 8)}</td>
                    <td style={{ padding: '14px', fontSize: '0.9rem' }}>{o.address?.full_name || 'N/A'}</td>
                    <td style={{ padding: '14px', fontWeight: 600 }}>₹{o.total_amount}</td>
                    <td style={{ padding: '14px' }}><span style={stBadge(o.status)}>{o.status}</span></td>
                    <td style={{ padding: '14px', color: P.textMuted, fontSize: '0.85rem' }}>{new Date(o.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}</tbody>
              </table>
              {orders.length === 0 && <p style={{ textAlign: 'center', padding: '40px', color: P.textMuted }}>No orders yet.</p>}
            </div>
          </div>
        )}

        {tab === 'inventory' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 700 }}>Products</h1>
              <button onClick={() => setModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: `linear-gradient(135deg,${P.accent},#e8854a)`, color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', boxShadow: '0 4px 16px rgba(196,113,59,0.25)' }}>
                <PlusCircle size={16} /> Add Product
              </button>
            </div>
            <div style={{ background: P.card, borderRadius: '16px', border: `1px solid ${P.cardBorder}`, boxShadow: P.cardShadow, overflow: 'hidden' }}>
              {loading ? <div className="loader" style={{ margin: '40px auto' }}></div> : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr style={{ borderBottom: `2px solid ${P.tableBorder}`, background: P.tableHover }}>
                    {['Product', 'Category', 'Price', 'Stock', 'Colors', ''].map(h => <th key={h} style={{ textAlign: 'left', padding: '14px 16px', fontSize: '0.75rem', color: P.textMuted, textTransform: 'uppercase', letterSpacing: '1px' }}>{h}</th>)}
                  </tr></thead>
                  <tbody>{products.map(p => (
                    <tr key={p.id} style={{ borderBottom: `1px solid ${P.tableBorder}`, transition: 'background 0.15s' }} onMouseOver={e => e.currentTarget.style.background = P.tableHover} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img src={p.images?.[0]} alt="" style={{ width: '44px', height: '44px', borderRadius: '10px', objectFit: 'cover', border: `1px solid ${P.sidebarBorder}` }} />
                          <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{p.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', color: P.textMuted, fontSize: '0.85rem' }}>{p.category}</td>
                      <td style={{ padding: '14px 16px', fontWeight: 600 }}>₹{p.price}</td>
                      <td style={{ padding: '14px 16px' }}><span style={{ padding: '4px 12px', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 600, background: p.stock < 5 ? '#fef3c7' : '#dcfce7', color: p.stock < 5 ? '#92400e' : '#166534' }}>{p.stock}</span></td>
                      <td style={{ padding: '14px 16px', color: P.textMuted, fontSize: '0.8rem' }}>{p.colors?.join(', ') || '-'}</td>
                      <td style={{ padding: '14px 16px' }}><button onClick={() => delProduct(p.id)} style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '8px', cursor: 'pointer', color: '#dc2626' }}><Trash2 size={15} /></button></td>
                    </tr>
                  ))}</tbody>
                </table>
              )}
              {!loading && products.length === 0 && <p style={{ textAlign: 'center', padding: '40px', color: P.textMuted }}>No products. Click "Add Product".</p>}
            </div>
          </div>
        )}

        {tab === 'orders' && (
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '28px' }}>Order Management</h1>
            {orders.length === 0 ? (
              <div style={{ background: P.card, borderRadius: '16px', border: `1px solid ${P.cardBorder}`, textAlign: 'center', padding: '60px', boxShadow: P.cardShadow }}>
                <CheckCircle size={48} style={{ color: P.sidebarBorder, marginBottom: '16px' }} /><p style={{ color: P.textMuted }}>No orders received yet.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {orders.map(o => (
                  <div key={o.id} style={{ background: P.card, borderRadius: '16px', border: `1px solid ${P.cardBorder}`, padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '24px', boxShadow: P.cardShadow }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 700 }}>#{o.id.slice(0, 8)}</span>
                        <span style={stBadge(o.status)}>{o.status}</span>
                        <span style={{ fontSize: '0.75rem', color: P.textMuted, display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} />{new Date(o.created_at).toLocaleDateString()}</span>
                      </div>
                      <p style={{ fontWeight: 600, marginBottom: '4px' }}>{o.address?.full_name}</p>
                      <p style={{ fontSize: '0.8rem', color: P.textMuted }}>{o.address?.phone}</p>
                      <p style={{ fontSize: '0.8rem', color: P.textMuted, marginTop: '4px' }}>{o.address?.street_address}<br />{o.address?.city}, {o.address?.state} {o.address?.postal_code}</p>
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, marginBottom: '10px', fontSize: '0.85rem' }}>Items ({o.items?.length})</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '140px', overflowY: 'auto' }}>
                        {o.items?.map((it, i) => (
                          <div key={i} style={{ fontSize: '0.8rem', padding: '8px 12px', background: P.tableHover, borderRadius: '8px', border: `1px solid ${P.tableBorder}` }}>
                            <b>{it.quantity}x</b> {it.name} {it.selectedSize && <span style={{ color: P.textMuted }}>| {it.selectedSize}</span>}
                          </div>
                        ))}
                      </div>
                      <p style={{ marginTop: '8px', fontSize: '0.8rem', color: P.textMuted }}>Delivery: ₹{o.delivery_fee}</p>
                    </div>
                    <div style={{ textAlign: 'right', minWidth: '150px' }}>
                      <p style={{ fontSize: '1.5rem', fontWeight: 800, color: P.accent, marginBottom: '16px' }}>₹{o.total_amount}</p>
                      <select value={o.status} onChange={e => updStatus(o.id, e.target.value)} style={{ padding: '10px 14px', borderRadius: '10px', border: `1px solid ${P.sidebarBorder}`, fontWeight: 600, cursor: 'pointer', background: P.tableHover, color: P.text, fontSize: '0.8rem', width: '100%' }}>
                        <option>Processing</option><option>Shipped</option><option>Out for Delivery</option><option>Delivered</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* MODAL */}
        {modal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(61,47,30,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(6px)' }} onClick={() => setModal(false)}>
            <div style={{ background: '#fff', borderRadius: '20px', padding: '36px', width: '520px', maxHeight: '85vh', overflowY: 'auto', border: `1px solid ${P.sidebarBorder}`, boxShadow: '0 20px 60px rgba(139,109,71,0.15)', position: 'relative' }} onClick={e => e.stopPropagation()}>
              <button onClick={() => setModal(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: P.textMuted }}><X size={22} /></button>
              <h2 style={{ marginBottom: '24px', fontWeight: 700, fontSize: '1.3rem' }}>New Product</h2>
              {msg && <div style={{ padding: '10px 14px', marginBottom: '16px', borderRadius: '10px', background: msg.includes('Error') ? '#fef2f2' : '#dcfce7', color: msg.includes('Error') ? '#dc2626' : '#166534', fontSize: '0.85rem' }}>{msg}</div>}
              <form onSubmit={addProduct} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <input placeholder="Product Name" value={name} onChange={e => setName(e.target.value)} required style={inp} onFocus={e => e.target.style.borderColor = P.accent} onBlur={e => e.target.style.borderColor = P.sidebarBorder} />
                <input placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} required style={inp} />
                <input placeholder="Colors (comma separated)" value={colorInput} onChange={e => setColorInput(e.target.value)} style={inp} />
                {colors.length > 0 && (
                  <div style={{ background: P.tableHover, padding: '14px', borderRadius: '12px', border: `1px dashed ${P.sidebarBorder}` }}>
                    <p style={{ fontWeight: 600, marginBottom: '10px', fontSize: '0.8rem', color: P.textMuted }}>Image per color</p>
                    {colors.map(c => <div key={c} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', background: '#fff', borderRadius: '8px', marginBottom: '6px', border: `1px solid ${P.tableBorder}` }}><span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{c}</span><input type="file" accept="image/*" onChange={e => setColorImg(c, e.target.files[0])} style={{ fontSize: '0.75rem' }} /></div>)}
                  </div>
                )}
                {colors.length === 0 && <input type="file" accept="image/*" onChange={e => setColorImg('default', e.target.files[0])} required />}
                <textarea placeholder="Description" value={desc} onChange={e => setDesc(e.target.value)} required rows={3} style={{ ...inp, resize: 'vertical' }} />
                <div style={{ display: 'flex', gap: '12px' }}>
                  <input type="number" placeholder="Price ₹" value={price} onChange={e => setPrice(e.target.value)} required style={inp} />
                  <input type="number" placeholder="Stock" value={stock} onChange={e => setStock(e.target.value)} required style={inp} />
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: P.textMuted, cursor: 'pointer' }}>
                  <input type="checkbox" checked={isStitched} onChange={e => setIsStitched(e.target.checked)} style={{ width: '16px', height: '16px' }} /> Stitched product
                </label>
                {isStitched && <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>{['S', 'M', 'L', 'XL', 'XXL'].map(s => <button type="button" key={s} onClick={() => toggleSize(s)} style={{ padding: '6px 16px', borderRadius: '100px', border: `1px solid ${sizes.includes(s) ? P.accent : P.sidebarBorder}`, cursor: 'pointer', background: sizes.includes(s) ? P.accent : '#fff', color: sizes.includes(s) ? '#fff' : P.text, fontSize: '0.8rem', fontWeight: 600 }}>{s}</button>)}</div>}
                <button type="submit" disabled={uploading} style={{ padding: '14px', borderRadius: '12px', background: `linear-gradient(135deg,${P.accent},#e8854a)`, color: '#fff', border: 'none', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 16px rgba(196,113,59,0.25)', marginTop: '4px' }}>
                  {uploading ? 'Uploading...' : <><Upload size={16} /> Add Product</>}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
