import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { situationGroups } from '../data/firstAidData';
import { useAuth } from '../context/AuthContext';
import { 
  MessageCircle, BookOpen, Activity, 
  Leaf, AlertTriangle, Users, ChevronRight, Stethoscope,
  LogOut, Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Sidebar({ collapsed, currentPage, onNavigate, onOpenFlyout, onOpenAuth }) {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const [openGroups, setOpenGroups] = useState({ bleed: true });

  const toggleGroup = (id) => setOpenGroups(p => ({ ...p, [id]: !p[id] }));

  const navItems = [
    { id: 'chat',         Icon: MessageCircle, label: t('nav.chatbot'),   always: true },
    { id: 'resources',   Icon: BookOpen,        label: t('nav.resources'), always: true },
    { id: 'my-dashboard',Icon: Activity,   label: t('nav.dashboard'), auth: true },
    { id: 'contribute',  Icon: Leaf,              label: t('nav.contribute'), roles: ['contributor', 'admin'] },
    { id: 'moderation',  Icon: AlertTriangle,       label: t('nav.moderation'), roles: ['admin'] },
    { id: 'users',       Icon: Users,             label: t('nav.users'),      roles: ['admin'] },
  ].filter(nav => {
    if (nav.always) return true;
    if (nav.auth && user) return true;
    if (nav.roles && user && nav.roles.includes(user.role)) return true;
    return false;
  });

  return (
    <motion.div 
      initial={false}
      animate={{ width: collapsed ? 88 : 280 }}
      style={{ 
        background: 'var(--pine)', 
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        zIndex: 1000,
        position: 'relative',
        boxShadow: '12px 0 48px rgba(0,0,0,0.15)'
      }}
    >
      {/* Organic Background Texture */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.03, pointerEvents: 'none', backgroundImage: 'url("https://www.transparenttextures.com/patterns/natural-paper.png")' }} />
      
      {/* Decorative Tree silhouette */}
      <div style={{ position: 'absolute', bottom: -20, left: -20, width: '120%', opacity: 0.1, pointerEvents: 'none' }}>
        <Leaf size={400} strokeWidth={0.5} />
      </div>

      {/* Logo Section */}
      <div style={{ padding: '40px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ 
          width: 44, height: 44, background: 'var(--primary)', 
          borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)', flexShrink: 0
        }}>
          <Stethoscope size={22} strokeWidth={2.5} color="#fff" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
              style={{ flex: 1, overflow: 'hidden' }}
            >
              <div style={{ fontFamily: 'var(--serif)', fontSize: 26, fontWeight: 900, letterSpacing: -1 }}>MediAid</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--sage)', letterSpacing: 2, fontWeight: 800 }}>CLINICAL ATLAS</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px', scrollbarWidth: 'none' }}>
        {/* Navigation Section */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ padding: '0 16px 12px', fontSize: 10, color: 'rgba(255,255,255,0.3)', fontWeight: 800, letterSpacing: 3 }}>
            {!collapsed ? t('nav.title', 'NAVIGATION').toUpperCase() : '•••'}
          </div>
          {navItems.map(nav => (
            <div
              key={nav.id}
              onClick={() => onNavigate(nav.id)}
              className={`side-nav-link${currentPage === nav.id ? ' active' : ''}`}
              style={{
                display: 'flex', alignItems: 'center', gap: 20, padding: '16px 20px',
                borderRadius: '16px 40px 40px 16px', cursor: 'pointer', transition: 'all 0.4s var(--ease)',
                marginBottom: 8, position: 'relative', overflow: 'hidden',
                color: currentPage === nav.id ? '#fff' : 'rgba(255,255,255,0.6)',
                marginRight: currentPage === nav.id ? 0 : 12,
                background: currentPage === nav.id ? 'var(--primary)' : 'transparent',
                boxShadow: currentPage === nav.id ? '0 8px 24px rgba(0,0,0,0.2)' : 'none'
              }}
            >
              <nav.Icon size={20} strokeWidth={2.5} style={{ opacity: currentPage === nav.id ? 1 : 0.7 }} />
              {!collapsed && <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: -0.2 }}>{nav.label}</span>}
            </div>
          ))}
        </div>

        {/* Condition Groups */}
        {!collapsed && situationGroups.map(group => (
          <div key={group.id} style={{ marginBottom: 12 }}>
            <div 
              onClick={() => toggleGroup(group.id)}
              style={{ 
                display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px',
                cursor: 'pointer', opacity: openGroups[group.id] ? 1 : 0.5,
                transition: 'opacity 0.2s'
              }}
            >
              <div style={{ fontSize: 18 }}>{group.icon}</div>
              <span style={{ flex: 1, fontSize: 14, fontWeight: 700, color: '#fff' }}>{group.label}</span>
              <ChevronRight size={14} strokeWidth={3} style={{ transform: openGroups[group.id] ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.3s' }} />
            </div>
            
            <AnimatePresence>
              {openGroups[group.id] && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  style={{ overflow: 'hidden', paddingLeft: 42 }}
                >
                  {group.items.map(item => (
                    <div key={item.key} onClick={() => onOpenFlyout(item.key)} style={{
                      padding: '10px 0', fontSize: 13, color: 'rgba(255,255,255,0.4)', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 10, transition: 'all 0.2s'
                    }} onMouseEnter={e => e.target.style.color = 'var(--sage)'}>
                      <span>{item.text}</span>
                      <div style={{ 
                        width: 4, height: 4, borderRadius: '50%', 
                        background: item.sev === 'critical' ? 'var(--red)' : 'rgba(255,255,255,0.2)'
                      }} />
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Sidebar Footer */}
      <div style={{ padding: 24, background: 'rgba(0,0,0,0.18)', borderTop: '1px solid rgba(255,255,255,0.06)', zIndex: 10 }}>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ 
              width: 44, height: 44, background: 'rgba(255,255,255,0.1)', borderRadius: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
              border: '1px solid rgba(255,255,255,0.1)'
            }}>{user.avatar}</div>
            {!collapsed && (
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ fontSize: 14, fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name || 'User'}</div>
                <div style={{ fontSize: 10, color: 'var(--sage)', fontWeight: 800, letterSpacing: 0.5 }}>PROFESSIONAL MODE</div>
              </div>
            )}
            {!collapsed && <button onClick={logout} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', transition: 'color 0.2s', padding: 8 }} onMouseEnter={e => e.target.style.color = '#fff'}><LogOut size={18} /></button>}
          </div>
        ) : (
          <button onClick={() => onOpenAuth('login')} style={{
            width: '100%', padding: '14px', background: 'var(--primary)', border: 'none',
            borderRadius: 14, color: '#fff', fontFamily: 'var(--display)', fontSize: 13,
            fontWeight: 800, cursor: 'pointer', letterSpacing: 1, boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>SIGN IN</button>
        )}
      </div>

      <style>{`
        .side-nav-link:hover { background: rgba(255,255,255,0.04); color: #fff; }
        .side-nav-link.active { box-shadow: 0 8px 24px rgba(0,0,0,0.2); }
        .sidebar::-webkit-scrollbar { display: none; }
      `}</style>
    </motion.div>
  );
}
