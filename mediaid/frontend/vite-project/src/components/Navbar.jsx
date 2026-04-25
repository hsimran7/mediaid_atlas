import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, Mic, MicOff, LogOut, LayoutDashboard, 
  Leaf, ChevronDown, Globe, User, ShieldCheck
} from 'lucide-react';

export default function Navbar({ currentPage, onToggleSidebar, isListening, onToggleVoice, onNavigate, onOpenAuth }) {
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    setUserMenuOpen(false);
    onNavigate('chat');
  }

  const PAGE_LABELS = {
    chat: t('nav.chatbot'),
    resources: t('nav.resources'),
    contribute: t('nav.contribute'),
    dashboard: t('nav.dashboard'),
    'my-dashboard': t('nav.dashboard'),
    'moderation': t('nav.moderation'),
    'users': t('nav.users')
  };

  const roleColor = user?.role === 'admin' ? 'var(--amber)' : user?.role === 'contributor' ? 'var(--moss)' : 'var(--sky)';
  const roleBg = user?.role === 'admin' ? 'rgba(183,121,31,0.1)' : user?.role === 'contributor' ? 'rgba(35,74,62,0.08)' : 'rgba(49,130,206,0.08)';

  return (
    <div className="topbar" style={{ 
      background: 'rgba(250,249,246,0.7)', 
      backdropFilter: 'var(--glass)',
      borderBottom: '1px solid var(--line2)',
      padding: '0 32px',
      height: 72,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 900
    }}>
      <div className="topbar-left" style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <button 
          onClick={onToggleSidebar} 
          style={{
            background: 'var(--panel)', border: '1px solid var(--line2)', width: 40, height: 40, 
            borderRadius: 12, cursor: 'pointer', color: 'var(--pine)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.3s var(--ease)', boxShadow: 'var(--shadow)'
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--primary-dim)'; e.currentTarget.style.transform = 'scale(1.05)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--panel)'; e.currentTarget.style.transform = 'scale(1)'; }}
        >
          <Menu size={18} strokeWidth={2.5} />
        </button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ 
            fontFamily: 'var(--serif)', fontSize: 24, fontWeight: 900, 
            color: 'var(--pine)', letterSpacing: -1 
          }}>MediAid</span>
          <div style={{ width: 1, height: 20, background: 'var(--line2)' }} />
          <span style={{ 
            fontFamily: 'var(--display)', fontSize: 20, fontWeight: 600, 
            color: 'var(--text3)', opacity: 0.8
          }}>
            {PAGE_LABELS[currentPage]?.toUpperCase() || currentPage.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="topbar-right" style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        
        {/* Language Pills - Professional Duotone Style */}
        <div style={{ 
          display: 'flex', gap: 4, background: 'var(--panel)', padding: 4, 
          borderRadius: 14, border: '1px solid var(--line2)', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
        }}>
          {[
            { code: 'en', label: 'EN' },
            { code: 'hi', label: 'हि' },
            { code: 'pa', label: 'ਪੰ' }
          ].map(lang => (
            <button 
              key={lang.code}
              onClick={() => i18n.changeLanguage(lang.code)}
              style={{
                padding: '6px 12px',
                borderRadius: 10,
                border: 'none',
                background: i18n.language === lang.code ? 'var(--primary)' : 'transparent',
                color: i18n.language === lang.code ? '#fff' : 'var(--text3)',
                fontWeight: 800,
                fontSize: 10,
                cursor: 'pointer',
                transition: 'all 0.3s var(--ease)',
                fontFamily: 'var(--mono)'
              }}
            >
              {lang.label}
            </button>
          ))}
        </div>

        {/* Voice Assistant - Sky Pulsing Effect */}
        <button 
          onClick={onToggleVoice} 
          style={{
            width: 52, height: 52, borderRadius: 18, border: 'none',
            background: isListening ? 'var(--primary)' : 'var(--mist)',
            color: isListening ? '#fff' : 'var(--primary)',
            cursor: 'pointer', transition: 'all 0.4s var(--ease)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: isListening ? '0 0 24px var(--primary)' : 'none',
            position: 'relative'
          }}
        >
          {isListening ? <Mic size={22} strokeWidth={2.5} /> : <MicOff size={22} strokeWidth={2} opacity={0.6} />}
          {isListening && (
            <motion.div 
              animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
              style={{ position: 'absolute', inset: 0, borderRadius: 18, background: 'var(--primary)' }}
            />
          )}
        </button>

        {/* User Workspace */}
        {user ? (
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setUserMenuOpen(!userMenuOpen)} 
              style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '8px 10px 8px 16px',
                background: 'var(--panel)', border: '1px solid var(--line2)', borderRadius: 20,
                cursor: 'pointer', transition: 'all 0.3s var(--ease)'
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = 'var(--shadow)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--line2)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--pine)', letterSpacing: -0.2 }}>{user?.name?.split(' ')?.[0] || 'User'}</div>
                <div style={{ 
                  fontSize: 9, color: roleColor, fontWeight: 800, letterSpacing: 0.5,
                  padding: '1px 6px', background: roleBg, borderRadius: 4, marginTop: 2,
                  display: 'inline-block'
                }}>
                  {user?.role?.toUpperCase() || 'SEEKER'}
                </div>
              </div>
              <div style={{ 
                width: 40, height: 40, background: 'var(--mist)', borderRadius: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
                border: '1px solid var(--line)'
              }}>
                {user.avatar || '👤'}
              </div>
              <ChevronDown size={14} strokeWidth={3} color="var(--text4)" />
            </button>

            <AnimatePresence>
              {userMenuOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 12, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  style={{ 
                    position: 'absolute', top: '120%', right: 0, width: 260,
                    background: 'var(--panel)', borderRadius: 24, border: '1px solid var(--line2)',
                    boxShadow: 'var(--shadow-deep)', padding: 12, zIndex: 1000,
                    backdropFilter: 'var(--glass)'
                  }}
                >
                  <div style={{ padding: '12px 16px 16px', borderBottom: '1px solid var(--line)' }}>
                    <div style={{ fontWeight: 800, color: 'var(--pine)', fontSize: 15 }}>{user.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2, opacity: 0.8 }}>{user.email}</div>
                  </div>
                  
                  <div style={{ padding: 8 }}>
                    <button className="nav-drop-item" onClick={() => { onNavigate('my-dashboard'); setUserMenuOpen(false); }}>
                      <LayoutDashboard size={18} strokeWidth={2} />
                      {t('nav.dashboard')}
                    </button>
                    {(user.role === 'admin' || user.role === 'contributor') && (
                      <button className="nav-drop-item" onClick={() => { onNavigate('contribute'); setUserMenuOpen(false); }}>
                        <Leaf size={18} strokeWidth={2} />
                        {t('nav.contribute')}
                      </button>
                    )}
                    <div style={{ height: 1, background: 'var(--line)', margin: '8px 0' }} />
                    <button className="nav-drop-item danger" onClick={handleLogout}>
                      <LogOut size={18} strokeWidth={2} />
                      {t('common.logout')}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="nav-auth-minimal" onClick={() => onOpenAuth('login')}>{t('common.login').toUpperCase()}</button>
            <button className="nav-auth-premium" onClick={() => onOpenAuth('register')}>{t('common.register').toUpperCase()}</button>
          </div>
        )}
      </div>

      <style>{`
        .nav-drop-item {
          width: 100%; text-align: left; padding: 12px 16px; border: none;
          background: transparent; border-radius: 14px; cursor: pointer;
          color: var(--text2); font-size: 14px; font-weight: 600; display: flex;
          align-items: center; gap: 12px; transition: all 0.2s var(--ease);
        }
        .nav-drop-item:hover { background: var(--panel2); color: var(--primary); }
        .nav-drop-item.danger:hover { background: var(--red-dim); color: var(--red); }
        
        .nav-auth-minimal {
          background: transparent; border: 1.5px solid var(--line2); padding: 12px 28px;
          border-radius: 14px; color: var(--pine); font-family: var(--display);
          font-weight: 800; font-size: 14; cursor: pointer; transition: all 0.3s;
        }
        .nav-auth-minimal:hover { background: var(--mist); border-color: var(--primary); }
        
        .nav-auth-premium {
          background: var(--primary); border: none; padding: 12px 32px;
          border-radius: 14px; color: #fff; font-family: var(--display);
          font-weight: 800; font-size: 14; cursor: pointer; transition: all 0.3s;
          box-shadow: 0 6px 16px var(--primary-glow);
        }
        .nav-auth-premium:hover { transform: translateY(-2px); box-shadow: 0 10px 24px var(--primary-glow); }
      `}</style>
    </div>
  );
}
