import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, CreditCard, Banknote, ShieldCheck, CheckCircle } from 'lucide-react';
import { getDistance } from 'geolib';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { supabase } from '../api/supabaseClient';

const ADMIN_LOCATION = { latitude: 28.8955, longitude: 76.5833 }; // Rohtak, Haryana

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  
  // New address form
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    full_name: '', phone: '', street_address: '', city: '', state: '', postal_code: '', lat: null, lng: null
  });

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  // Pricing
  const [deliveryFee, setDeliveryFee] = useState(0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    if (cart.length === 0 && !success) {
      navigate('/cart');
    }
    fetchAddresses();
  }, [cart, navigate, success]);

  // Recalculate delivery fee when address changes
  useEffect(() => {
    if (selectedAddressId) {
      const addr = addresses.find(a => a.id === selectedAddressId);
      if (addr && addr.lat && addr.lng) {
        const distMeters = getDistance(ADMIN_LOCATION, { latitude: addr.lat, longitude: addr.lng });
        const distKm = distMeters / 1000;
        // Base fee ₹50 + ₹2 per km (Max ₹180)
        let computedFee = Math.round(50 + (distKm * 2));
        if (computedFee > 180) computedFee = 180;
        setDeliveryFee(computedFee);
      } else {
        // Flat fallback fee if no precise coordinates exist
        setDeliveryFee(150);
      }
    }
  }, [selectedAddressId, addresses]);

  const fetchAddresses = async () => {
    try {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      setAddresses(data || []);
      if (data && data.length > 0) {
        setSelectedAddressId(data[0].id);
      } else {
        setShowNewAddress(true);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await response.json();
          if (data && data.address) {
            setNewAddress({
              ...newAddress,
              street_address: data.display_name,
              city: data.address.city || data.address.town || data.address.county || '',
              state: data.address.state || '',
              postal_code: data.address.postcode || '',
              lat: latitude,
              lng: longitude
            });
            alert('Location detected successfully!');
          }
        } catch (error) {
          alert('Failed to detect address automatically.');
        }
      },
      (error) => {
        alert('Unable to retrieve your location');
      }
    );
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    try {
      // If manual entry without detect location, geocode the city/state as fallback
      let finalLat = newAddress.lat;
      let finalLng = newAddress.lng;

      if (!finalLat) {
        const search = `${newAddress.city}, ${newAddress.state}, India`;
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(search)}`);
        const data = await res.json();
        if (data && data.length > 0) {
          finalLat = parseFloat(data[0].lat);
          finalLng = parseFloat(data[0].lon);
        }
      }

      const addressToSave = { ...newAddress, user_id: user.id, lat: finalLat, lng: finalLng };

      const { data, error } = await supabase
        .from('addresses')
        .insert([addressToSave])
        .select()
        .single();
      
      if (error) throw error;
      setAddresses([...addresses, data]);
      setSelectedAddressId(data.id);
      setShowNewAddress(false);
    } catch (error) {
      alert('Error saving address: ' + error.message);
    }
  };

  const simulateOnlinePayment = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 2500); 
    });
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      alert('Please select or add a delivery address');
      return;
    }

    setProcessing(true);

    try {
      let paymentStatus = 'Pending';

      if (paymentMethod === 'online') {
        const paymentSuccess = await simulateOnlinePayment();
        if (paymentSuccess) {
          paymentStatus = 'Paid';
        }
      }

      const totalAmount = subtotal + deliveryFee;

      const orderData = {
        user_id: user.id,
        address_id: selectedAddressId,
        total_amount: totalAmount,
        delivery_fee: deliveryFee,
        status: 'Processing',
        payment_method: paymentMethod,
        payment_status: paymentStatus,
        items: cart
      };

      const { error } = await supabase.from('orders').insert([orderData]);
      if (error) throw error;

      setSuccess(true);
      clearCart();
    } catch (error) {
      alert('Error placing order: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  if (success) {
    return (
      <div className="container flex-center fade-in" style={{ minHeight: '70vh', flexDirection: 'column', gap: '20px' }}>
        <CheckCircle size={80} color="#16a34a" />
        <h1 style={{ fontFamily: "'Playfair Display', serif" }}>Order Placed Successfully!</h1>
        <p style={{ color: 'var(--text-muted)' }}>Your order is being processed and will be shipped from Rohtak, Haryana.</p>
        <button onClick={() => navigate('/settings')} className="btn btn-primary mt-4">
          View Order Tracking
        </button>
      </div>
    );
  }

  const totalAmount = subtotal + deliveryFee;

  return (
    <div className="container fade-in has-sticky-bottom" style={{ padding: '40px 24px' }}>
      <h1 className="page-title" style={{ marginBottom: '40px' }}>Checkout</h1>

      <div className="desktop-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '48px', alignItems: 'start' }}>
        
        {/* Left Column: Address and Payment */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Delivery Address */}
          <div className="glass-strong" style={{ padding: '24px', borderRadius: 'var(--radius-lg)' }}>
            <h2 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.4rem' }}>
              <MapPin size={24} /> Delivery Address
            </h2>

            {addresses.length > 0 && !showNewAddress && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                {addresses.map(addr => (
                  <label key={addr.id} style={{ display: 'flex', gap: '16px', padding: '16px', border: selectedAddressId === addr.id ? '2px solid var(--primary)' : '1px solid var(--border)', borderRadius: 'var(--radius-md)', cursor: 'pointer', background: selectedAddressId === addr.id ? 'var(--bg-cream)' : 'var(--bg-white)' }}>
                    <input type="radio" name="address" checked={selectedAddressId === addr.id} onChange={() => setSelectedAddressId(addr.id)} style={{ marginTop: '4px' }} />
                    <div>
                      <p style={{ fontWeight: 600, marginBottom: '4px' }}>{addr.full_name} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({addr.phone})</span></p>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-body)' }}>{addr.street_address}</p>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-body)' }}>{addr.city}, {addr.state} {addr.postal_code}</p>
                    </div>
                  </label>
                ))}
                <button onClick={() => setShowNewAddress(true)} className="btn btn-outline" style={{ alignSelf: 'flex-start' }}>+ Add New Address</button>
              </div>
            )}

            {showNewAddress && (
              <form onSubmit={handleSaveAddress} style={{ background: 'var(--bg-white)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', gap: '12px' }}>
                  <h3 style={{ fontSize: '1.1rem' }}>New Address</h3>
                  <button type="button" onClick={handleDetectLocation} className="btn" style={{ background: 'var(--bg-cream)', color: 'var(--primary)', padding: '6px 12px', fontSize: '0.8rem' }}>
                    📍 GPS Auto-Detect
                  </button>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div className="mobile-stack" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="input-group"><label>Full Name</label><input type="text" className="input-field" value={newAddress.full_name} onChange={e => setNewAddress({...newAddress, full_name: e.target.value})} required /></div>
                    <div className="input-group"><label>Phone</label><input type="text" className="input-field" value={newAddress.phone} onChange={e => setNewAddress({...newAddress, phone: e.target.value})} required /></div>
                  </div>
                  <div className="input-group"><label>Street Address</label><textarea className="input-field" rows={2} value={newAddress.street_address} onChange={e => setNewAddress({...newAddress, street_address: e.target.value})} required></textarea></div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                    <div className="input-group"><label>City</label><input type="text" className="input-field" value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} required /></div>
                    <div className="input-group"><label>State</label><input type="text" className="input-field" value={newAddress.state} onChange={e => setNewAddress({...newAddress, state: e.target.value})} required /></div>
                    <div className="input-group"><label>PIN</label><input type="text" className="input-field" value={newAddress.postal_code} onChange={e => setNewAddress({...newAddress, postal_code: e.target.value})} required /></div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                  <button type="submit" className="btn btn-primary">Save</button>
                  {addresses.length > 0 && <button type="button" className="btn btn-secondary" onClick={() => setShowNewAddress(false)}>Cancel</button>}
                </div>
              </form>
            )}
          </div>

          {/* Payment Method */}
          <div className="glass-strong" style={{ padding: '24px', borderRadius: 'var(--radius-lg)' }}>
            <h2 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.4rem' }}>
              <CreditCard size={24} /> Payment Method
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', border: paymentMethod === 'online' ? '2px solid var(--primary)' : '1px solid var(--border)', borderRadius: 'var(--radius-md)', cursor: 'pointer', background: paymentMethod === 'online' ? 'var(--bg-cream)' : 'var(--bg-white)' }}>
                <input type="radio" checked={paymentMethod === 'online'} onChange={() => setPaymentMethod('online')} />
                <CreditCard size={24} color="var(--primary)" />
                <div style={{ flexGrow: 1 }}>
                  <p style={{ fontWeight: 600, fontSize: '1rem' }}>Online Payment</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Secure checkout</p>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', border: paymentMethod === 'cod' ? '2px solid var(--primary)' : '1px solid var(--border)', borderRadius: 'var(--radius-md)', cursor: 'pointer', background: paymentMethod === 'cod' ? 'var(--bg-cream)' : 'var(--bg-white)' }}>
                <input type="radio" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                <Banknote size={24} color="#16a34a" />
                <div style={{ flexGrow: 1 }}>
                  <p style={{ fontWeight: 600, fontSize: '1rem' }}>Cash on Delivery</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pay at doorstep</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="glass-strong" style={{ padding: '32px', borderRadius: 'var(--radius-lg)', position: 'sticky', top: '100px' }}>
          <h2 style={{ marginBottom: '24px', fontFamily: "'Playfair Display', serif" }}>Order Summary</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px', maxHeight: '300px', overflowY: 'auto' }}>
            {cart.map(item => (
              <div key={item.uniqueCartId} style={{ display: 'flex', gap: '12px' }}>
                <img src={item.images?.[0] || item.image} alt={item.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }} />
                <div style={{ flexGrow: 1 }}>
                  <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.name}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Qty: {item.quantity} {item.selectedSize ? `| ${item.selectedSize}` : ''}</p>
                </div>
                <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>₹{item.price * item.quantity}</p>
              </div>
            ))}
          </div>
          
          <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.95rem' }}>
              <span style={{ color: 'var(--text-body)' }}>Subtotal</span>
              <span style={{ fontWeight: 600 }}>₹{subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid var(--border-light)', fontSize: '0.95rem' }}>
              <span style={{ color: 'var(--text-body)' }}>Delivery</span>
              <span style={{ color: deliveryFee === 0 ? '#16a34a' : 'var(--text-dark)', fontWeight: 600 }}>
                {deliveryFee === 0 ? 'Calculating...' : `₹${deliveryFee}`}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px', fontSize: '1.3rem', fontWeight: 800 }}>
              <span>Total</span>
              <span style={{ color: 'var(--primary)' }}>₹{totalAmount.toFixed(2)}</span>
            </div>

            <button 
              className="btn btn-primary desktop-only" 
              onClick={handlePlaceOrder} 
              disabled={processing || !selectedAddressId || deliveryFee === 0}
              style={{ width: '100%', padding: '16px', fontSize: '1.1rem' }}
            >
              {processing ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </div>

      </div>

      {/* Sticky Bottom for Mobile Checkout */}
      <div className="sticky-bottom-mobile">
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Final Total</span>
          <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary)' }}>₹{totalAmount.toFixed(2)}</span>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={handlePlaceOrder} 
          disabled={processing || !selectedAddressId || deliveryFee === 0}
          style={{ flexGrow: 1, padding: '14px' }}
        >
          {processing ? '...' : (paymentMethod === 'online' ? 'Pay & Order' : 'Confirm Order')}
        </button>
      </div>
    </div>
  );
};

export default Checkout;
