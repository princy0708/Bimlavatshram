import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogIn, Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const { login, loginWithGoogle, resetPassword } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await resetPassword(resetEmail);
    if (result.success) {
      setResetSent(true);
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await login(email, password);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      fontFamily: "'Inter', 'Segoe UI', sans-serif"
    }}>

      {/* Left Panel - Branding */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '60px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative circles */}
        <div style={{
          position: 'absolute', top: '-100px', left: '-100px',
          width: '300px', height: '300px', borderRadius: '50%',
          background: 'rgba(232, 83, 46, 0.08)', filter: 'blur(60px)'
        }}></div>
        <div style={{
          position: 'absolute', bottom: '-150px', right: '-150px',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'rgba(232, 83, 46, 0.06)', filter: 'blur(80px)'
        }}></div>

        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '400px' }}>
          <div style={{
            fontSize: '3.2rem', fontFamily: "'Playfair Display', serif",
            fontWeight: 800, color: '#fff', marginBottom: '8px', letterSpacing: '-1px'
          }}>
            Kurta<span style={{ color: '#e8532e' }}>Store</span>
          </div>
          <p style={{
            color: 'rgba(255,255,255,0.5)', fontSize: '1rem',
            letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '48px'
          }}>
            Premium Indian Fashion
          </p>

          <div style={{
            width: '60px', height: '3px', background: 'linear-gradient(90deg, #e8532e, #ff7b54)',
            margin: '0 auto 48px', borderRadius: '2px'
          }}></div>

          <p style={{
            color: 'rgba(255,255,255,0.7)', fontSize: '1.15rem',
            lineHeight: 1.8, fontWeight: 300
          }}>
            Discover the finest collection of handcrafted kurtas, designed for the modern Indian aesthetic. From traditional elegance to contemporary styles.
          </p>

          <div style={{
            display: 'flex', gap: '40px', justifyContent: 'center', marginTop: '60px'
          }}>
            {[
              { num: '500+', label: 'Products' },
              { num: '10K+', label: 'Customers' },
              { num: '4.9★', label: 'Rating' }
            ].map(stat => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <div style={{ color: '#e8532e', fontSize: '1.6rem', fontWeight: 700 }}>{stat.num}</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '2px' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div style={{
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        alignItems: 'center', padding: '40px 24px',
        background: '#fafafa'
      }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>

          {/* FORGOT PASSWORD MODE */}
          {forgotMode ? (
            resetSent ? (
              <div style={{ textAlign: 'center' }}>
                <CheckCircle size={56} color="#16a34a" style={{ marginBottom: '20px' }} />
                <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '12px', fontFamily: "'Playfair Display', serif" }}>Check your email</h1>
                <p style={{ color: '#94a3b8', marginBottom: '32px' }}>We sent a password reset link to <b style={{color:'#334155'}}>{resetEmail}</b></p>
                <button onClick={() => { setForgotMode(false); setResetSent(false); }} style={{ background: 'none', border: 'none', color: '#e8532e', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', margin: '0 auto' }}>
                  <ArrowLeft size={16} /> Back to login
                </button>
              </div>
            ) : (
              <>
                <button onClick={() => setForgotMode(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '24px', padding: 0 }}>
                  <ArrowLeft size={16} /> Back to login
                </button>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '8px', fontFamily: "'Playfair Display', serif" }}>Reset password</h1>
                <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '32px' }}>Enter your email and we'll send you a reset link</p>
                {error && <div style={{ padding: '14px 18px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', marginBottom: '24px', color: '#dc2626', fontSize: '0.9rem' }}>⚠️ {error}</div>}
                <form onSubmit={handleForgotPassword} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ position: 'relative' }}>
                    <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input type="email" value={resetEmail} onChange={e => setResetEmail(e.target.value)} required placeholder="you@example.com" style={{ width: '100%', padding: '14px 14px 14px 44px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '0.95rem', outline: 'none', background: '#fff', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor='#e8532e'} onBlur={e => e.target.style.borderColor='#e2e8f0'} />
                  </div>
                  <button type="submit" disabled={loading} style={{ width: '100%', padding: '16px', borderRadius: '12px', background: 'linear-gradient(135deg, #e8532e, #ff7b54)', color: '#fff', border: 'none', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 15px rgba(232,83,46,0.25)' }}>
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </form>
              </>
            )
          ) : (
            /* NORMAL LOGIN MODE */
            <>
              <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1a1a2e', marginBottom: '8px', fontFamily: "'Playfair Display', serif" }}>Welcome back</h1>
                <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>Sign in to continue shopping</p>
              </div>

              {error && <div style={{ padding: '14px 18px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', marginBottom: '24px', color: '#dc2626', fontSize: '0.9rem' }}>⚠️ {error}</div>}

              <button onClick={loginWithGoogle} style={{ width: '100%', padding: '14px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', fontSize: '0.95rem', fontWeight: 500, color: '#334155', transition: 'all 0.2s ease', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }} onMouseOver={e => e.currentTarget.style.background='#f8fafc'} onMouseOut={e => e.currentTarget.style.background='#fff'}>
                <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
                Continue with Google
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '24px 0' }}>
                <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
                <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', color: '#94a3b8' }}>or</span>
                <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Email Address</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" style={{ width: '100%', padding: '14px 14px 14px 44px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '0.95rem', outline: 'none', background: '#fff', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor='#e8532e'} onBlur={e => e.target.style.borderColor='#e2e8f0'} />
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Password</label>
                    <button type="button" onClick={() => { setForgotMode(true); setError(null); }} style={{ background: 'none', border: 'none', color: '#e8532e', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, padding: 0 }}>Forgot password?</button>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required placeholder="Enter your password" style={{ width: '100%', padding: '14px 48px 14px 44px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '0.95rem', outline: 'none', background: '#fff', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor='#e8532e'} onBlur={e => e.target.style.borderColor='#e2e8f0'} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 0 }}>
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={loading} style={{ width: '100%', padding: '16px', borderRadius: '12px', background: 'linear-gradient(135deg, #e8532e, #ff7b54)', color: '#fff', border: 'none', fontSize: '1rem', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', opacity: loading ? 0.7 : 1, boxShadow: '0 4px 15px rgba(232,83,46,0.25)' }}>
                  {loading ? 'Signing in...' : <>Sign In <ArrowRight size={18} /></>}
                </button>
              </form>

              <p style={{ textAlign: 'center', marginTop: '28px', color: '#94a3b8', fontSize: '0.9rem' }}>
                Don't have an account?{' '}
                <Link to="/register" style={{ color: '#e8532e', textDecoration: 'none', fontWeight: 600 }}>Create account</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;

