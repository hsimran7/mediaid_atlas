import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function AuthModal({ onClose, defaultTab = 'login', showToast }) {
  const { login, register } = useAuth();
  const [tab, setTab] = useState(defaultTab);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState(null);

  function showError(msg) {
    setError(msg);
    setTimeout(() => setError(null), 5000);
  }

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [regData, setRegData] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    role: '', country: '', language: 'en',
  });

  async function handleLogin(e) {
    e.preventDefault();
    if (!loginData.email || !loginData.password)
      return showError('Email and password required.');
    setLoading(true);
    try {
      const data = await login(loginData.email, loginData.password);
      showToast(data.message || 'Welcome back!', 'success');
      onClose();
    } catch (err) {
      showError(err.message || 'Server error, try again');
    } finally { setLoading(false); }
  }

  async function handleRegister(e) {
    e.preventDefault();
    if (!regData.name || !regData.email || !regData.password)
      return showError('Name, email and password are required.');
    if (!regData.role)
      return showError('Please choose your role — Seeker or Contributor.');
    if (regData.password !== regData.confirmPassword)
      return showError('Passwords do not match.');
    if (regData.password.length < 6)
      return showError('Password must be at least 6 characters.');
    setLoading(true);
    try {
      const data = await register(regData);
      showToast(data.message || `Welcome to MediAid AI, ${regData.name}!`, 'success');
      onClose();
    } catch (err) {
      showError(err.message || 'Server error, try again');
    } finally { setLoading(false); }
  }

  const inp = {
    width: '100%', padding: '10px 12px', background: 'var(--panel)',
    border: '1px solid var(--line2)', borderRadius: 8, color: 'var(--text)',
    fontSize: 13, outline: 'none', boxSizing: 'border-box',
    fontFamily: 'inherit', transition: 'border 0.15s',
  };
  const lbl = {
    display: 'block', fontFamily: 'var(--mono)', fontSize: 10,
    color: 'var(--text3)', letterSpacing: 1.2, marginBottom: 5, fontWeight: 600,
  };
  const grp = { marginBottom: 14 };

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', backdropFilter:'blur(12px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:950, padding:16 }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>

      <div className="glass-panel" style={{ width:'100%', maxWidth:520, padding:'48px 48px 80px 48px', maxHeight:'90vh', overflowY:'auto', overflowX:'hidden', position:'relative', border: '1.5px solid rgba(255,255,255,0.3)' }}>

        {/* ERROR OVERLAY */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              animate={{ opacity: 1, backdropFilter: 'blur(8px)' }}
              exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              style={{
                position: 'absolute', inset: 0, zIndex: 100, borderRadius: 'inherit',
                background: 'rgba(250,249,246,0.3)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24
              }}
            >
              <motion.div 
                initial={{ scale: 0.9, y: 10 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 10 }}
                style={{
                  background: 'var(--surface)', padding: 32, borderRadius: 24, textAlign: 'center',
                  boxShadow: 'var(--shadow-deep)', border: '1px solid rgba(255,107,107,0.3)', width: '100%', maxWidth: 360
                }}
              >
                <div style={{ width: 48, height: 48, background: 'rgba(255,107,107,0.1)', color: 'var(--red)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 24 }}>
                  ⚠
                </div>
                <h4 style={{ fontFamily: 'var(--display)', fontSize: 18, color: 'var(--red)', marginBottom: 8 }}>Authentication Error</h4>
                <p style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 24, lineHeight: 1.5 }}>{error}</p>
                <button type="button" onClick={() => setError(null)} style={{ padding: '10px 24px', background: 'var(--red)', color: 'white', border: 'none', borderRadius: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: 1, boxShadow: '0 4px 12px rgba(255,107,107,0.3)' }}>
                  TRY AGAIN
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:40 }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
              <span style={{ fontSize:32 }}>🌿</span>
              <span style={{ fontFamily:'var(--serif)', fontSize:28, fontWeight: 800, color:'var(--pine)' }}>MEDIAID ATLAS</span>
            </div>
            <div style={{ fontSize:11, color:'var(--text4)', fontFamily:'var(--mono)', letterSpacing:2, fontWeight: 700 }}>
              {tab === 'login' ? 'SIGN INTO YOUR ATLAS' : 'JOIN THE COMMUNITY'}
            </div>
          </div>
          <button onClick={onClose} style={{ background:'var(--panel2)', border:'none', borderRadius:14, width:40, height:40, cursor:'pointer', color:'var(--text3)', fontSize:16, flexShrink:0 }}>✕</button>
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', background:'var(--panel2)', borderRadius:16, padding:6, marginBottom:32, border:'1px solid var(--line2)' }}>
          {['login','register'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex:1, padding:'12px 0', border:'none', borderRadius:12, cursor:'pointer',
              fontFamily:'var(--mono)', fontSize:11, letterSpacing:2, fontWeight:800,
              background: tab === t ? 'var(--primary)' : 'transparent',
              color: tab === t ? 'white' : 'var(--text4)',
              transition:'all 0.4s var(--ease)',
            }}>
              {t === 'login' ? 'SIGN IN' : 'REGISTER'}
            </button>
          ))}
        </div>

        {/* ── LOGIN ── */}
        {tab === 'login' && (
          <form onSubmit={handleLogin}>
            <div style={grp}>
              <label style={lbl}>EMAIL ADDRESS</label>
              <input style={inp} type="email" placeholder="your@email.com"
                value={loginData.email} onChange={e => setLoginData(p => ({...p, email: e.target.value}))} />
            </div>
            <div style={grp}>
              <label style={lbl}>PASSWORD</label>
              <div style={{ position:'relative' }}>
                <input style={{...inp, paddingRight:40}} type={showPass ? 'text' : 'password'} placeholder="••••••••"
                  value={loginData.password} onChange={e => setLoginData(p => ({...p, password: e.target.value}))} />
                <button type="button" onClick={() => setShowPass(s => !s)}
                  style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', fontSize:14, color:'var(--text3)' }}>
                  {showPass ? '🙈' : '👁'}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} style={{ 
              width:'100%', padding:'20px', background:'var(--primary)', border:'none', borderRadius:16, 
              color:'white', fontFamily:'var(--mono)', fontSize:14, fontWeight:800, letterSpacing:2, 
              cursor:'pointer', marginTop:16, opacity: loading ? 0.7 : 1,
              boxShadow: '0 12px 24px var(--primary-glow)'
            }}>
              {loading ? 'PROCESSING...' : 'ACCESS ATLAS →'}
            </button>
            <div style={{ textAlign:'center', marginTop:14, fontSize:12, color:'var(--text2)' }}>
              Don't have an account?{' '}
              <span style={{ color:'var(--cyan)', cursor:'pointer', fontWeight:600 }} onClick={() => setTab('register')}>Register here</span>
            </div>
            <div style={{ marginTop:14, padding:'10px 12px', background:'rgba(0,200,232,0.05)', borderRadius:8, border:'1px solid rgba(0,200,232,0.15)', fontSize:11, color:'var(--text3)', fontFamily:'var(--mono)', lineHeight:1.8 }}>
              💡 Demo accounts:<br/>
              seeker@mediaid.ai / Seeker@123<br/>
              amara@mediaid.ai / Contrib@123
            </div>
          </form>
        )}

        {/* ── REGISTER ── */}
        {tab === 'register' && (
          <form onSubmit={handleRegister}>

            {/* Role selection — FIRST and PROMINENT */}
            <div style={{ marginBottom:20 }}>
              <label style={{...lbl, marginBottom:10}}>CHOOSE YOUR ROLE <span style={{color:'var(--red)'}}>*</span></label>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>

                {/* SEEKER card */}
                <div onClick={() => setRegData(p => ({...p, role:'seeker'}))} style={{
                  padding:'16px 12px', borderRadius:12, cursor:'pointer', textAlign:'center',
                  border: `2px solid ${regData.role === 'seeker' ? 'var(--cyan)' : 'var(--line2)'}`,
                  background: regData.role === 'seeker' ? 'rgba(0,200,232,0.07)' : 'var(--panel)',
                  transition:'all 0.2s', position:'relative',
                }}>
                  {regData.role === 'seeker' && (
                    <div style={{ position:'absolute', top:8, right:8, width:16, height:16, borderRadius:'50%', background:'var(--cyan)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, color:'#000', fontWeight:700 }}>✓</div>
                  )}
                  <div style={{ fontSize:28, marginBottom:8 }}>🆘</div>
                  <div style={{ fontFamily:'var(--mono)', fontSize:11, fontWeight:700, letterSpacing:1, color: regData.role === 'seeker' ? 'var(--cyan)' : 'var(--text)', marginBottom:6 }}>SEEKER</div>
                  <div style={{ fontSize:11, color:'var(--text3)', lineHeight:1.5 }}>I need first aid guidance & emergency help</div>
                  <div style={{ marginTop:8, display:'flex', flexDirection:'column', gap:3 }}>
                    {['Browse solutions','AI chat','Save guides'].map(f => (
                      <div key={f} style={{ fontSize:10, color:'var(--text3)', display:'flex', alignItems:'center', gap:4 }}>
                        <span style={{ color:'var(--cyan)', fontSize:9 }}>✓</span>{f}
                      </div>
                    ))}
                  </div>
                </div>

                {/* CONTRIBUTOR card */}
                <div onClick={() => setRegData(p => ({...p, role:'contributor'}))} style={{
                  padding:'16px 12px', borderRadius:12, cursor:'pointer', textAlign:'center',
                  border: `2px solid ${regData.role === 'contributor' ? 'var(--green)' : 'var(--line2)'}`,
                  background: regData.role === 'contributor' ? 'rgba(0,229,160,0.07)' : 'var(--panel)',
                  transition:'all 0.2s', position:'relative',
                }}>
                  {regData.role === 'contributor' && (
                    <div style={{ position:'absolute', top:8, right:8, width:16, height:16, borderRadius:'50%', background:'var(--green)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, color:'#000', fontWeight:700 }}>✓</div>
                  )}
                  <div style={{ fontSize:28, marginBottom:8 }}>🌿</div>
                  <div style={{ fontFamily:'var(--mono)', fontSize:11, fontWeight:700, letterSpacing:1, color: regData.role === 'contributor' ? 'var(--green)' : 'var(--text)', marginBottom:6 }}>CONTRIBUTOR</div>
                  <div style={{ fontSize:11, color:'var(--text3)', lineHeight:1.5 }}>I want to share solutions & remedies</div>
                  <div style={{ marginTop:8, display:'flex', flexDirection:'column', gap:3 }}>
                    {['Upload videos','Share guides','Build profile'].map(f => (
                      <div key={f} style={{ fontSize:10, color:'var(--text3)', display:'flex', alignItems:'center', gap:4 }}>
                        <span style={{ color:'var(--green)', fontSize:9 }}>✓</span>{f}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {!regData.role && (
                <div style={{ marginTop:8, fontSize:11, color:'var(--amber)', fontFamily:'var(--mono)', letterSpacing:0.5 }}>
                  ⚠ Select a role to continue
                </div>
              )}
              <div style={{ marginTop:8, padding:'8px 10px', background:'rgba(255,184,48,0.06)', border:'1px solid rgba(255,184,48,0.15)', borderRadius:8, fontSize:10, color:'var(--text3)', fontFamily:'var(--mono)' }}>
                🔒 Role is permanent and cannot be changed after registration
              </div>
            </div>

            {/* Name */}
            <div style={grp}>
              <label style={lbl}>FULL NAME <span style={{color:'var(--red)'}}>*</span></label>
              <input style={inp} type="text" placeholder="Your full name"
                value={regData.name} onChange={e => setRegData(p => ({...p, name: e.target.value}))} />
            </div>

            {/* Email */}
            <div style={grp}>
              <label style={lbl}>EMAIL ADDRESS <span style={{color:'var(--red)'}}>*</span></label>
              <input style={inp} type="email" placeholder="your@email.com"
                value={regData.email} onChange={e => setRegData(p => ({...p, email: e.target.value}))} />
            </div>

            {/* Password row */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:14 }}>
              <div>
                <label style={lbl}>PASSWORD <span style={{color:'var(--red)'}}>*</span></label>
                <input style={inp} type="password" placeholder="Min 6 chars"
                  value={regData.password} onChange={e => setRegData(p => ({...p, password: e.target.value}))} />
              </div>
              <div>
                <label style={lbl}>CONFIRM PASSWORD <span style={{color:'var(--red)'}}>*</span></label>
                <input style={{...inp, borderColor: regData.confirmPassword && regData.password !== regData.confirmPassword ? 'var(--red)' : 'var(--line2)'}}
                  type="password" placeholder="Repeat password"
                  value={regData.confirmPassword} onChange={e => setRegData(p => ({...p, confirmPassword: e.target.value}))} />
              </div>
            </div>

            {/* Country + Language */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:14 }}>
              <div>
                <label style={lbl}>COUNTRY</label>
                <input style={inp} type="text" placeholder="e.g. Pakistan"
                  value={regData.country} onChange={e => setRegData(p => ({...p, country: e.target.value}))} />
              </div>
              <div>
                <label style={lbl}>LANGUAGE</label>
                <select style={{...inp, cursor:'pointer'}} value={regData.language}
                  onChange={e => setRegData(p => ({...p, language: e.target.value}))}>
                  <option value="en">🇬🇧 English</option>
                  <option value="ur">🇵🇰 Urdu</option>
                  <option value="hi">🇮🇳 Hindi</option>
                  <option value="ar">🇸🇦 Arabic</option>
                  <option value="fr">🇫🇷 Français</option>
                  <option value="es">🇪🇸 Español</option>
                  <option value="sw">🇰🇪 Kiswahili</option>
                  <option value="bn">🇧🇩 Bengali</option>
                </select>
              </div>
            </div>

            <button type="submit" disabled={loading || !regData.role} style={{
              width:'100%', padding:'12px', border:'none', borderRadius:10, color: regData.role ? 'white' : 'var(--text3)',
              fontFamily:'var(--mono)', fontSize:12, fontWeight:700, letterSpacing:2, cursor: regData.role ? 'pointer' : 'not-allowed',
              marginTop:4, opacity: loading ? 0.7 : 1,
              background: regData.role === 'contributor' ? 'var(--green)' : regData.role === 'seeker' ? 'var(--cyan)' : 'var(--panel)',
              transition:'background 0.3s',
            }}>
              {loading ? 'CREATING ACCOUNT...' : `JOIN AS ${regData.role ? regData.role.toUpperCase() : 'SELECT ROLE ABOVE'} →`}
            </button>

            <div style={{ textAlign:'center', marginTop:14, fontSize:12, color:'var(--text2)' }}>
              Already have an account?{' '}
              <span style={{ color:'var(--cyan)', cursor:'pointer', fontWeight:600 }} onClick={() => setTab('login')}>Sign in</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
