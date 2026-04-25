import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { authAPI, solutionsAPI } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bookmark, CheckCircle2, MapPin, Eye, 
  Heart, Sparkles, Library, History, 
  Search, Video, FileText, BookOpen,
  ArrowRight, Activity, ShieldCheck, Leaf
} from 'lucide-react';

const fUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  })
};

function SolutionCard({ sol, onSave, savedIds, onView }) {
  const { t } = useTranslation();
  const Icon = sol.mediaType === 'video' ? Video : sol.mediaType === 'pdf' ? FileText : BookOpen;
  const color = sol.mediaType === 'video' ? 'var(--sky)' : sol.mediaType === 'pdf' ? 'var(--red)' : 'var(--primary)';
  const isSaved = savedIds?.includes(sol._id);

  // Fallback images for a natural look if no image is provided
  const bgImg = sol.imageUrl || `https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80`;

  return (
    <motion.div 
      layout layoutId={sol._id}
      whileHover={{ y: -12, boxShadow: 'var(--shadow-deep)', borderColor: 'var(--primary)' }}
      onClick={() => onView(sol)}
      className="glass-panel"
      style={{ 
        overflow: 'hidden', transition: 'all 0.5s var(--ease)', cursor: 'pointer',
        position: 'relative', display: 'flex', flexDirection: 'column'
      }}
    >
      <div style={{ height: 180, overflow: 'hidden', position: 'relative' }}>
        <img src={bgImg} alt={sol.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.5))' }} />
        <div style={{ 
          position: 'absolute', top: 16, left: 16, 
          background: 'var(--surface)', backdropFilter: 'var(--glass)', color: color, padding: '6px 12px', 
          borderRadius: 10, fontSize: 9, fontWeight: 800, fontFamily: 'var(--mono)',
          display: 'flex', alignItems: 'center', gap: 6, border: '1px solid var(--line2)'
        }}>
          <Icon size={12} strokeWidth={2.5} /> {sol.mediaType?.toUpperCase()}
        </div>
      </div>

      <div style={{ padding: 24, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ 
          color: 'var(--primary)', fontSize: 9, fontWeight: 800, 
          marginBottom: 8, fontFamily: 'var(--mono)', letterSpacing: 1.5 
        }}>
          {sol.condition?.toUpperCase()}
        </div>
        <h3 style={{ 
          fontSize: 20, fontWeight: 800, color: 'var(--pine)', 
          marginBottom: 16, lineHeight: 1.2, fontFamily: 'var(--display)', letterSpacing: -0.5
        }}>{sol.title}</h3>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
          <div className={`sev-tag ${sol.severity || 'mild'}`}>
            {t(`common.${sol.severity || 'mild'}`).toUpperCase()}
          </div>
          <button 
            onClick={e => { e.stopPropagation(); onSave(sol._id); }}
            style={{ 
              background: isSaved ? 'var(--primary-dim)' : 'transparent', border: 'none', 
              borderRadius: 10, width: 36, height: 36, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              transition: 'all 0.3s var(--ease)', color: isSaved ? 'var(--primary)' : 'var(--text4)'
            }}
          >
            {isSaved ? <CheckCircle2 size={18} strokeWidth={2.5} /> : <Bookmark size={18} strokeWidth={2.2} />}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function SeekerDashboard({ showToast, onNavigate }) {
  const { user, refreshUser } = useAuth();
  const { t } = useTranslation();
  const [dashboard, setDashboard] = useState(null);
  const [allSolutions, setAllSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('discover');
  const [search, setSearch] = useState('');
  const [savedIds, setSavedIds] = useState([]);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [dashData, solsData] = await Promise.all([
        authAPI.getDashboard(),
        solutionsAPI.getAll({ limit: 50 }),
      ]);
      if (dashData?.dashboard) {
        setDashboard(dashData.dashboard);
        const userSaved = dashData.dashboard.user?.savedSolutions || [];
        setSavedIds(userSaved.map(s => s._id || s));
      }
      setAllSolutions(solsData.solutions || []);
    } catch (err) {
      showToast('Dashboard load failed', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(id) {
    if (!user) return showToast('Login to save.', 'error');
    try {
      const data = await solutionsAPI.save(id);
      const isSaving = data.saved;
      
      if (isSaving) {
        setSavedIds(p => [...p, id]);
        // Update dashboard state for real-time list sync
        const solObj = allSolutions.find(s => s._id === id);
        if (solObj) {
          setDashboard(prev => ({
            ...prev,
            savedSolutions: [solObj, ...(prev.savedSolutions || [])]
          }));
        }
      } else {
        setSavedIds(p => p.filter(i => i !== id));
        // Remove from dashboard state locally
        setDashboard(prev => ({
          ...prev,
          savedSolutions: (prev.savedSolutions || []).filter(s => (s._id || s) !== id)
        }));
      }
      
      showToast(isSaving ? 'Solution saved!' : 'Removed from saves.', 'success');
      refreshUser();
    } catch (err) { showToast(err.message, 'error'); }
  }

  const filtered = allSolutions.filter(s => {
    const q = !search || s.title?.toLowerCase().includes(search.toLowerCase()) || s.condition?.toLowerCase().includes(search.toLowerCase());
    return q;
  });

  if (loading) return (
    <div className="page active" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <Activity className="spin" color="var(--primary)" size={48} strokeWidth={1} />
      <div style={{ fontFamily: 'var(--mono)', color: 'var(--text4)', fontSize: 11, letterSpacing: 4 }}>{t('common.loading').toUpperCase()}</div>
      <style>{`.spin { animation: rotate 2s linear infinite; } @keyframes rotate { 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div className="page active" style={{ padding: '40px 48px', background: 'transparent', overflowY: 'auto' }}>
      
      {/* Personalized Header - Sky Glow */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        style={{ 
          background: 'var(--primary)',
          borderRadius: 40, padding: '56px', marginBottom: 48, 
          display: 'flex', alignItems: 'center', gap: 48, position: 'relative', overflow: 'hidden',
          boxShadow: 'var(--shadow-deep)', color: '#fff'
        }}
      >
        <div style={{ position: 'absolute', bottom: -50, right: -50, opacity: 0.15 }}>
          <Leaf size={440} strokeWidth={0.5} />
        </div>

        <div style={{ 
          width: 100, height: 100, borderRadius: 24, background: 'rgba(255,255,255,0.15)', 
          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', 
          fontSize: 48, boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.1)', flexShrink: 0,
          backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)'
        }}>{user?.avatar || '👤'}</div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <span style={{ fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--mono)', letterSpacing: 3 }}>PERSONAL ATLAS</span>
            <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--mono)' }}>{new Date().getFullYear()} EDITION</span>
          </div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 52, fontWeight: 800, color: '#fff', lineHeight: 1, letterSpacing: -1.5 }}>
             Welcome, {user?.name?.split(' ')?.[0] || 'User'} 🌿
          </h1>
          <div style={{ display: 'flex', gap: 32, marginTop: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#fff', lineHeight: 1 }}>{user?.queriesCount || 0}</div>
              <div style={{ fontSize: 9, fontWeight: 800, color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--mono)', letterSpacing: 1 }}>QUERIES</div>
            </div>
            <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.2)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#fff', lineHeight: 1 }}>{savedIds.length}</div>
              <div style={{ fontSize: 9, fontWeight: 800, color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--mono)', letterSpacing: 1 }}>SAVED</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Navigation Tabs - Professional Nature Pills */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 40, overflowX: 'auto', paddingBottom: 4 }}>
        {[
          { id: 'discover', label: t('tab.discover'), Icon: Sparkles, color: 'var(--sky)' },
          { id: 'saved', label: t('tab.saved'), Icon: Library, color: 'var(--moss)' },
          { id: 'activity', label: t('tab.activity'), Icon: History, color: 'var(--pine)' },
        ].map(t_item => (
          <button
            key={t_item.id}
            style={{
              padding: '16px 32px', borderRadius: 100, border: 'none',
              background: tab === t_item.id ? t_item.color : 'var(--panel)',
              color: tab === t_item.id ? '#fff' : 'var(--text2)',
              fontWeight: 800, fontSize: 14, cursor: 'pointer', transition: 'all 0.4s var(--ease)',
              display: 'flex', alignItems: 'center', gap: 12, whiteSpace: 'nowrap',
              boxShadow: tab === t_item.id ? `0 12px 24px ${t_item.color}33` : 'var(--shadow)',
              fontFamily: 'var(--display)'
            }}
            onClick={() => setTab(t_item.id)}
          >
            <t_item.Icon size={18} strokeWidth={tab === t_item.id ? 2.5 : 2} />
            {t_item.label.toUpperCase()}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === 'discover' && (
          <motion.div 
            key="discover" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
          >
            <div style={{ 
              background: 'var(--panel)', border: '1.5px solid var(--line2)', borderRadius: 28, 
              padding: '10px 32px', marginBottom: 48, display: 'flex', alignItems: 'center', gap: 20,
              boxShadow: 'var(--shadow)', maxWidth: 800
            }}>
              <Search size={24} strokeWidth={2} color="var(--text4)" />
              <input
                type="text"
                style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 18, padding: '20px 0', color: 'var(--pine)', fontWeight: 500 }}
                placeholder={t('common.search', 'Search symptoms or treatments...')}
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    solutionsAPI.getAll({ search, status: 'approved' }).then(data => setAllSolutions(data.solutions));
                  }
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 40 }}>
              {filtered.map((sol, idx) => (
                <SolutionCard key={sol._id} sol={sol} onSave={handleSave} savedIds={savedIds} onView={setDashboard} />
              ))}
            </div>
          </motion.div>
        )}

        {tab === 'saved' && (
          <motion.div key="saved" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            {(!dashboard?.savedSolutions || dashboard.savedSolutions.length === 0) ? (
              <div style={{ background: 'var(--panel)', borderRadius: 48, padding: '100px 40px', border: '1.5px solid var(--line)', textAlign: 'center', boxShadow: 'var(--shadow)' }}>
                <div style={{ width: 44, height: 44, background: 'rgba(255,255,255,0.1)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                  <Bookmark size={22} strokeWidth={2.5} color="var(--primary)" />
                </div>
                <h3 style={{ fontFamily: 'var(--display)', fontSize: 32, fontWeight: 800, color: 'var(--pine)', letterSpacing: -1 }}>Your Library is Empty</h3>
                <p style={{ color: 'var(--text3)', marginTop: 12, fontSize: 16, fontWeight: 500, opacity: 0.7 }}>Save your first remedy to see it here instantly.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 40 }}>
                {dashboard.savedSolutions.map((sol) => (
                  <SolutionCard key={sol._id} sol={sol} onSave={handleSave} savedIds={savedIds} onView={setDashboard} />
                ))}
              </div>
            )}
          </motion.div>
        )}

        {tab === 'activity' && (
          <motion.div 
            key="activity" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
            style={{ 
              background: 'var(--panel)', borderRadius: 48, padding: '100px 40px', 
              border: '1.5px solid var(--line)', textAlign: 'center', boxShadow: 'var(--shadow)'
            }}
          >
            <div style={{ width: 44, height: 44, background: 'rgba(255,255,255,0.1)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <History size={22} strokeWidth={2.5} color="var(--sky)" />
            </div>
            <h3 style={{ fontFamily: 'var(--display)', fontSize: 32, fontWeight: 800, color: 'var(--pine)', letterSpacing: -1 }}>Recent Activity</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 600, margin: '32px auto 0' }}>
              {(!dashboard?.activityLog || dashboard.activityLog.length === 0) ? (
                <p style={{ color: 'var(--text4)', fontFamily: 'var(--mono)', fontSize: 12 }}>NO RECENT ACTIONS RECORDED</p>
              ) : (
                dashboard.activityLog.map((log, i) => (
                  <div key={i} style={{ padding: '16px 24px', background: 'var(--panel2)', borderRadius: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--pine)' }}>{log.detail}</div>
                      <div style={{ fontSize: 10, color: 'var(--text4)', fontFamily: 'var(--mono)', marginTop: 4 }}>{log.action.toUpperCase()}</div>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 600 }}>{new Date(log.timestamp).toLocaleDateString()}</div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* REMEDY DETAIL MODAL */}
      {dashboard && typeof dashboard === 'object' && dashboard.title && (
        <div className="flyout-overlay open" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={e => e.target.className.includes('flyout-overlay') && setDashboard(prev => ({ ...prev, title: null }))}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            style={{ maxWidth: 800, width: '95%', maxHeight: '90vh', background: 'var(--bg)', borderRadius: 40, border: '1.5px solid var(--line2)', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-deep)', position: 'relative' }}
          >
            <button onClick={() => setDashboard(null)} style={{ position: 'absolute', top: 24, right: 24, background: 'var(--surface)', border: 'none', color: 'var(--text3)', cursor: 'pointer', width: 44, height: 44, borderRadius: '50%', zIndex: 10, boxShadow: 'var(--shadow)' }}>✕</button>
            
            <div style={{ padding: 48, overflowY: 'auto' }}>
              <div style={{ marginBottom: 40 }}>
                <div style={{ color: 'var(--primary)', fontSize: 11, fontWeight: 800, marginBottom: 12, fontFamily: 'var(--mono)', letterSpacing: 2 }}>{dashboard.condition?.toUpperCase()}</div>
                <h2 style={{ fontFamily: 'var(--serif)', fontSize: 44, fontWeight: 900, color: 'var(--pine)', lineHeight: 1.1, letterSpacing: -1 }}>{dashboard.title}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, background: 'var(--mist)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{dashboard.author?.avatar || '👤'}</div>
                    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--pine)' }}>{dashboard.authorName || dashboard.author?.name}</span>
                  </div>
                  <div style={{ width: 1, height: 16, background: 'var(--line)' }} />
                  <div style={{ fontSize: 12, color: 'var(--text3)', fontWeight: 500 }}>{new Date(dashboard.createdAt).toLocaleDateString()}</div>
                </div>
              </div>

              <div style={{ background: 'var(--panel)', borderRadius: 28, padding: 32, border: '1px solid var(--line2)', marginBottom: 40 }}>
                <div style={{ fontFamily: 'var(--display)', fontSize: 18, fontWeight: 800, color: 'var(--pine)', marginBottom: 16 }}>The Remedy</div>
                <p style={{ fontSize: 16, color: 'var(--text2)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{dashboard.description}</p>
              </div>

              {/* MEDIA GALLERY */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text4)', letterSpacing: 2, fontWeight: 800 }}>ATTACHED MEDIA ({(dashboard.files?.length || (dashboard.fileUrl ? 1 : 0))})</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  {(dashboard.files && dashboard.files.length > 0 ? dashboard.files : (dashboard.fileUrl ? [dashboard] : [])).map((file, i) => (
                    <div key={i} style={{ background: '#000', borderRadius: 24, overflow: 'hidden', boxShadow: 'var(--shadow)', border: '1px solid var(--line2)' }}>
                      {(file.fileMimeType?.startsWith('video/') || dashboard.mediaType === 'video') ? (
                        <video controls style={{ width: '100%', maxHeight: 500, display: 'block' }}>
                          <source src={file.fileUrl} />
                        </video>
                      ) : (file.fileMimeType === 'application/pdf' || dashboard.mediaType === 'pdf') ? (
                        <div style={{ background: '#fff', borderRadius: 24, overflow: 'hidden', border: '1px solid var(--line2)' }}>
                          <iframe src={file.fileUrl} style={{ width: '100%', height: 600, border: 'none' }} title="PDF Preview" />
                        </div>
                      ) : (
                        <img src={file.fileUrl} alt="Remedy Media" style={{ width: '100%', display: 'block' }} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
