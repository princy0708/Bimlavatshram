import React, { useState, useEffect, useContext } from 'react';
import { User, MapPin, Package, Bell, Shield, PackageCheck, PackageOpen, Truck } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { supabase } from '../api/supabaseClient';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const ADMIN_LOCATION = [28.8955, 76.5833]; // Rohtak, Haryana

const Settings = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('orders');
  
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: orderData } = await supabase
        .from('orders')
        .select(`*, address:addresses(*)`)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      setOrders(orderData || []);

      const { data: addressData } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user.id);
      
      setAddresses(addressData || []);
    } catch (error) {
      console.error('Error fetching settings data:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'orders', label: 'Order Tracking', icon: <Package size={20} /> },
    { id: 'profile', label: 'My Profile', icon: <User size={20} /> },
    { id: 'addresses', label: 'Address Book', icon: <MapPin size={20} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={20} /> },
    { id: 'security', label: 'Security', icon: <Shield size={20} /> },
  ];

  return (
    <div className="container fade-in" style={{ padding: '40px 24px' }}>
      <h1 className="page-title" style={{ marginBottom: '40px' }}>Account Settings</h1>

      <div className="desktop-grid" style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '48px', alignItems: 'start' }}>
        
        {/* Sidebar Nav */}
        <div className="glass-strong hide-scrollbar" style={{ padding: '16px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '8px', overflowX: 'auto' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
                padding: '16px', border: 'none', background: activeTab === tab.id ? 'var(--primary)' : 'transparent',
                color: activeTab === tab.id ? 'white' : 'var(--text-dark)',
                borderRadius: '8px', cursor: 'pointer', textAlign: 'left',
                fontWeight: activeTab === tab.id ? 600 : 400,
                transition: 'all 0.2s ease'
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="glass-strong" style={{ padding: '24px', borderRadius: 'var(--radius-lg)', minHeight: '500px' }}>
          
          {loading ? <div className="loader"></div> : (
            <>
              {/* ORDERS & TRACKING TAB */}
              {activeTab === 'orders' && (
                <div className="fade-in">
                  <h2 style={{ marginBottom: '32px' }}>Order History & Live Map Tracking</h2>
                  
                  {orders.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
                      <Package size={48} style={{ opacity: 0.5, marginBottom: '16px' }} />
                      <p>You haven't placed any orders yet.</p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
                      {orders.map(order => (
                        <div key={order.id} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--bg-white)', overflow: 'hidden' }}>
                          
                          {/* Live Tracking Map */}
                          {order.address?.lat && order.address?.lng && (
                            <div style={{ height: '300px', width: '100%', borderBottom: '1px solid var(--border)' }}>
                              <MapContainer 
                                bounds={[ADMIN_LOCATION, [order.address.lat, order.address.lng]]}
                                scrollWheelZoom={false} 
                                style={{ height: '100%', width: '100%', zIndex: 1 }}
                              >
                                <TileLayer
                                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                  attribution='&copy; OpenStreetMap contributors'
                                />
                                <Marker position={ADMIN_LOCATION}>
                                  <Popup><b>Warehouse</b><br/>Rohtak, Haryana</Popup>
                                </Marker>
                                <Marker position={[order.address.lat, order.address.lng]}>
                                  <Popup><b>Delivery Address</b><br/>{order.address.city}</Popup>
                                </Marker>
                                <Polyline 
                                  positions={[ADMIN_LOCATION, [order.address.lat, order.address.lng]]} 
                                  color="var(--primary)" 
                                  dashArray="10, 10" 
                                  weight={3} 
                                />
                              </MapContainer>
                            </div>
                          )}

                          <div style={{ padding: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--border-light)' }}>
                              <div>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Order ID: {order.id}</p>
                                <p style={{ fontWeight: 600 }}>Placed on: {new Date(order.created_at).toLocaleDateString()}</p>
                              </div>
                              <div style={{ textAlign: 'right' }}>
                                <p style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '4px' }}>₹{order.total_amount}</p>
                                <span style={{ fontSize: '0.8rem', padding: '4px 10px', background: order.payment_status === 'Paid' ? '#dcfce7' : '#fee2e2', color: order.payment_status === 'Paid' ? '#166534' : '#991b1b', borderRadius: '100px', fontWeight: 600 }}>
                                  {order.payment_method.toUpperCase()} • {order.payment_status}
                                </span>
                              </div>
                            </div>

                            {/* Order Tracking Timeline */}
                            <div style={{ marginBottom: '32px', background: 'var(--bg-cream)', padding: '24px', borderRadius: 'var(--radius-sm)' }}>
                              <p style={{ fontWeight: 600, marginBottom: '24px', textAlign: 'center' }}>Current Status: <span style={{ color: 'var(--primary)', fontSize: '1.1rem' }}>{order.status}</span></p>
                              
                              <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', maxWidth: '600px', margin: '0 auto' }}>
                                <div style={{ position: 'absolute', top: '20px', left: '40px', right: '40px', height: '4px', background: 'var(--border)', zIndex: 1 }}></div>
                                
                                {[
                                  { status: 'Processing', icon: <PackageOpen size={20} /> },
                                  { status: 'Shipped', icon: <Truck size={20} /> },
                                  { status: 'Out for Delivery', icon: <MapPin size={20} /> },
                                  { status: 'Delivered', icon: <PackageCheck size={20} /> }
                                ].map((step, index) => {
                                  const statuses = ['Processing', 'Shipped', 'Out for Delivery', 'Delivered'];
                                  const currentStatusIndex = statuses.indexOf(order.status);
                                  const isCompleted = index <= currentStatusIndex;
                                  const isActive = index === currentStatusIndex;

                                  return (
                                    <div key={step.status} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, gap: '8px', width: '80px' }}>
                                      <div style={{ 
                                        width: '44px', height: '44px', borderRadius: '50%', 
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        background: isCompleted ? 'var(--primary)' : 'var(--bg-white)',
                                        color: isCompleted ? 'white' : 'var(--text-muted)',
                                        border: `3px solid ${isCompleted ? 'var(--primary)' : 'var(--border)'}`,
                                        boxShadow: isActive ? '0 0 0 6px rgba(232, 83, 46, 0.15)' : 'none',
                                        transition: 'all 0.3s ease'
                                      }}>
                                        {step.icon}
                                      </div>
                                      <span style={{ fontSize: '0.8rem', textAlign: 'center', fontWeight: isActive ? 700 : 500, color: isCompleted ? 'var(--text-dark)' : 'var(--text-muted)' }}>
                                        {step.status}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Items */}
                            <div>
                              <p style={{ fontWeight: 600, marginBottom: '12px' }}>Items & Delivery</p>
                              <div style={{ display: 'flex', gap: '32px' }}>
                                <div style={{ flex: 1 }}>
                                  {order.items.map((item, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '8px' }}>
                                      <span>{item.quantity}x {item.name} {item.selectedSize ? `(${item.selectedSize})` : ''} {item.selectedColor ? `[${item.selectedColor}]` : ''}</span>
                                      <span>₹{item.price * item.quantity}</span>
                                    </div>
                                  ))}
                                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: '8px', marginTop: '8px' }}>
                                    <span>Delivery Fee (Distance Based)</span>
                                    <span>₹{order.delivery_fee}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* PROFILE TAB */}
              {activeTab === 'profile' && (
                <div className="fade-in">
                  <h2 style={{ marginBottom: '32px' }}>My Profile</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '500px' }}>
                    <div className="input-group">
                      <label>Email Address</label>
                      <input type="email" className="input-field" value={user.email} disabled style={{ background: '#f5f5f5' }} />
                    </div>
                    <div className="input-group">
                      <label>Role</label>
                      <input type="text" className="input-field" value={user.is_admin ? 'Administrator' : 'Customer'} disabled style={{ background: '#f5f5f5' }} />
                    </div>
                  </div>
                </div>
              )}

              {/* ADDRESSES TAB */}
              {activeTab === 'addresses' && (
                <div className="fade-in">
                  <h2 style={{ marginBottom: '32px' }}>Address Book</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                    {addresses.map(addr => (
                      <div key={addr.id} style={{ padding: '24px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--bg-white)' }}>
                        <p style={{ fontWeight: 600, marginBottom: '8px', fontSize: '1.1rem' }}>{addr.full_name}</p>
                        <p style={{ color: 'var(--text-body)', fontSize: '0.9rem', marginBottom: '4px' }}>{addr.phone}</p>
                        <p style={{ color: 'var(--text-body)', fontSize: '0.9rem', marginBottom: '4px' }}>{addr.street_address}</p>
                        <p style={{ color: 'var(--text-body)', fontSize: '0.9rem', marginBottom: '16px' }}>{addr.city}, {addr.state} {addr.postal_code}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* OTHER TABS */}
              {(activeTab === 'notifications' || activeTab === 'security') && (
                <div className="fade-in" style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
                  <p>This section is under construction.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
