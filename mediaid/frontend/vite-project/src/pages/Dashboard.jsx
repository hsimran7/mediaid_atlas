import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, CheckCircle2, Clock, Search, 
  ArrowRight, Sparkles, ShieldCheck, Bookmark,
  TrendingUp, Leaf, ArrowUpRight, Eye, Video, FileText, Image as ImageIcon, X
} from 'lucide-react';

function MediaItem({ file }) {
  const isVideo = file.fileMimeType?.startsWith('video/') || file.fileUrl?.match(/\.(mp4|webm|ogg|mov)$/i);
  const isPdf = file.fileMimeType === 'application/pdf' || file.fileUrl?.endsWith('.pdf');
  const isImage = file.fileMimeType?.startsWith('image/') || file.fileUrl?.match(/\.(jpg|jpeg|png|gif|webp)$/i);

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ 
        fontSize: 11, color: 'var(--text4)', fontFamily: 'var(--mono)', 
        marginBottom: 10, display: 'flex', justifyContent: 'space-between',
        fontWeight: 700, letterSpacing: 1
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {isVideo ? <Video size={14} /> : isPdf ? <FileText size={14} /> : <ImageIcon size={14} />}
          <span>{file.fileName?.toUpperCase() || 'FILE'}</span>
        </div>
        {file.fileSize && <span>{(file.fileSize / 1024 / 1024).toFixed(2)} MB</span>}
      </div>
      <div style={{ 
        background: '#000', borderRadius: 24, overflow: 'hidden', 
        border: '1.5px solid var(--line2)', boxShadow: 'var(--shadow-sm)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative'
      }}>
        {isVideo ? (
          <video controls style={{ width: '100%', maxHeight: 450, borderRadius: 22 }}>
            <source src={file.fileUrl} type={file.fileMimeType || 'video/mp4'} />
          </video>
        ) : isPdf ? (
          <iframe src={file.fileUrl} style={{ width: '100%', height: 600, border: 'none' }} title="PDF Preview" />
        ) : isImage ? (
          <img src={file.fileUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: 600, display: 'block' }} />
        ) : (
          <div style={{ padding: 40, color: '#fff', fontSize: 13, fontWeight: 600 }}>Unsupported Preview</div>
        )}
      </div>
    </div>
  );
}

const cardUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  })
};

export default function Dashboard({ onNavigate }) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previewItem, setPreviewItem] = useState(null);

  useEffect(() => {
    authAPI.getDashboard()
      .then(data => { 
        if (data?.dashboard) {
          setStats(data.dashboard);
        }
        setLoading(false); 
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="page active" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <Activity className="spin" color="var(--primary)" size={48} strokeWidth={1} />
      <div style={{ fontFamily: 'var(--mono)', color: 'var(--text4)', fontSize: 11, letterSpacing: 4 }}>{t('common.loading').toUpperCase()}</div>
      <style>{`.spin { animation: rotate 2s linear infinite; } @keyframes rotate { 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div className="page active" style={{ padding: '40px 48px', background: 'transparent', overflowY: 'auto' }}>
      
      {/* Dynamic Header - Sky/Forest Blend */}
      <motion.div 
        initial="hidden" animate="visible" custom={0} variants={cardUp}
        style={{ 
          background: 'var(--primary)',
          borderRadius: 40, padding: '64px 56px', marginBottom: 48, position: 'relative',
          overflow: 'hidden', color: '#fff', boxShadow: 'var(--shadow-deep)'
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.1, backgroundImage: 'url("https://www.transparenttextures.com/patterns/natural-paper.png")' }} />
        <div style={{ position: 'absolute', right: -40, bottom: -40, opacity: 0.1, color: '#fff' }}>
          <Leaf size={320} strokeWidth={1} />
        </div>
        
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: 4, opacity: 0.8, fontWeight: 800, color: 'rgba(255,255,255,0.6)' }}>
              {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }).toUpperCase()}
            </div>
            <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }} />
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: 2, opacity: 0.6, fontWeight: 800 }}>CONTRIBUTOR HUB</div>
          </div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(48px, 6vw, 72px)', fontWeight: 800, lineHeight: 1.1, marginBottom: 16, letterSpacing: -2 }}>
            {t('dashboard.welcome', { name: user?.name?.split(' ')?.[0] || 'User' })} 🌿
          </h1>
          <p style={{ fontSize: 19, opacity: 0.85, maxWidth: 540, lineHeight: 1.6, fontWeight: 500, letterSpacing: '-0.01em' }}>
            {t('dashboard.subtitle')}
          </p>
        </div>
      </motion.div>

      {/* Analytics Grid - Asymmetrical Spacing */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32, marginBottom: 64 }}>
        {[
          { label: 'TOTAL SUBMITTED', val: stats?.contributorStats?.total || 0, Icon: Activity, color: 'var(--moss)' },
          { label: 'APPROVED BY ADMIN', val: stats?.contributorStats?.approved || 0, Icon: CheckCircle2, color: 'var(--primary)' },
          { label: 'REJECTED BY ADMIN', val: stats?.contributorStats?.rejected || 0, Icon: ShieldCheck, color: 'var(--red)' },
          { label: 'WAITING FOR APPROVAL', val: stats?.contributorStats?.pending || 0, Icon: Clock, color: 'var(--clay)' }
        ].map((s, i) => (
          <motion.div 
            key={i} initial="hidden" animate="visible" custom={i + 1} variants={cardUp}
            className="glass-panel"
            style={{ 
              padding: 40, overflow: 'hidden',
              transition: 'all 0.4s var(--ease)', cursor: 'default'
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-12px)'; e.currentTarget.style.borderColor = 'var(--primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--line2)'; }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
              <div style={{ 
                width: 60, height: 60, background: s.color + '12', borderRadius: 20, 
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <s.Icon size={26} strokeWidth={2.5} color={s.color} />
              </div>
              <div style={{ textAlign: 'right' }}>
                <TrendingUp size={20} strokeWidth={2.5} color={s.color} opacity={0.1} />
              </div>
            </div>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text4)', fontFamily: 'var(--mono)', letterSpacing: 2, marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontSize: 52, fontWeight: 800, fontFamily: 'var(--display)', color: 'var(--pine)', lineHeight: 1, letterSpacing: -2 }}>{s.val}</div>
          </motion.div>
        ))}
      </div>

      {/* Human-Designed Main Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 40 }}>
        
        {/* Remedy Tracking List */}
        <motion.div 
          initial="hidden" animate="visible" custom={4} variants={cardUp}
          style={{ 
            background: 'var(--surface)', backdropFilter: 'var(--glass)', borderRadius: 40, 
            padding: 48, border: '1.5px solid var(--line2)', boxShadow: 'var(--shadow)' 
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 40 }}>
            <div style={{ width: 48, height: 48, background: 'var(--mist)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Leaf size={24} strokeWidth={2.5} color="var(--primary)" />
            </div>
            <h2 style={{ fontFamily: 'var(--display)', fontSize: 32, fontWeight: 800, color: 'var(--pine)', letterSpacing: -1 }}>My Submissions</h2>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {(!stats?.mySolutions || stats.mySolutions.length === 0) ? (
              <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text4)', fontFamily: 'var(--mono)', fontSize: 13 }}>
                NO REMEDIES SUBMITTED YET
              </div>
            ) : (
              stats.mySolutions.map((sol, i) => (
                <div key={sol._id} style={{ 
                  padding: '24px 32px', background: 'var(--panel2)', borderRadius: 24, 
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  border: '1px solid rgba(0,0,0,0.02)', transition: 'all 0.3s'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
                      <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--pine)', fontFamily: 'var(--display)' }}>{sol.title}</span>
                      <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--line)' }} />
                      <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text4)', fontFamily: 'var(--mono)' }}>{sol.condition?.toUpperCase()}</span>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 600 }}>Submitted on {new Date(sol.createdAt).toLocaleDateString()}</div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ 
                      padding: '8px 16px', borderRadius: 12, fontSize: 10, fontWeight: 800, fontFamily: 'var(--mono)', letterSpacing: 1,
                      background: sol.status === 'approved' ? 'var(--primary)' : sol.status === 'rejected' ? 'var(--red)' : 'var(--clay)',
                      color: '#fff'
                    }}>
                      {sol.status?.toUpperCase()}
                    </div>
                    <button 
                      onClick={() => setPreviewItem(sol)}
                      style={{ 
                        width: 36, height: 36, borderRadius: 12, border: '1.5px solid var(--line2)',
                        background: 'var(--surface)', color: 'var(--primary)', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s'
                      }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--line2)'}
                    >
                      <Eye size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Dynamic Sidebar Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <motion.div 
            initial="hidden" animate="visible" custom={5} variants={cardUp}
            style={{ 
              background: 'var(--primary)', borderRadius: 40, padding: 40, color: '#fff',
              position: 'relative', overflow: 'hidden', boxShadow: 'var(--shadow-deep)'
            }}
          >
            <div style={{ position: 'absolute', bottom: -10, right: -10, fontSize: 120, opacity: 0.1 }}><Leaf /></div>
            <h3 style={{ fontFamily: 'var(--display)', fontSize: 24, fontWeight: 700, marginBottom: 28, letterSpacing: -0.5 }}>Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: 'Submit New Remedy', id: 'contribute' },
                { label: 'View Health Atlas', id: 'resources' },
                { label: 'Consult AI Assistant', id: 'chat' }
              ].map(link => (
                <button key={link.id} 
                  onClick={() => onNavigate(link.id)}
                  style={{ 
                  padding: '18px 24px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 20, color: '#fff', textAlign: 'left', display: 'flex',
                  alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', 
                  transition: 'all 0.3s var(--ease)', fontWeight: 700, fontSize: 15
                }} onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.transform = 'translateX(4px)'; }}>
                  {link.label}
                  <ArrowRight size={16} strokeWidth={3} />
                </button>
              ))}
            </div>
          </motion.div>
          
          {user?.role === 'admin' && (
            <motion.div 
              initial="hidden" animate="visible" custom={6} variants={cardUp}
              style={{ 
                background: 'var(--surface)', backdropFilter: 'var(--glass)', borderRadius: 36, 
                padding: 32, border: '1.5px solid var(--line2)', boxShadow: 'var(--shadow)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <ShieldCheck size={20} color="var(--primary)" strokeWidth={2.5} />
                <div style={{ fontWeight: 800, color: 'var(--pine)', fontSize: 16, letterSpacing: -0.5 }}>Activity Log</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {(!stats?.activityLog || stats.activityLog.length === 0) ? (
                  <div style={{ fontSize: 11, color: 'var(--text4)', fontFamily: 'var(--mono)', padding: '20px 0' }}>NO RECENT ACTIVITY</div>
                ) : (
                  stats.activityLog.map((log, i) => (
                    <div key={i} style={{ padding: '12px 16px', background: 'var(--panel2)', borderRadius: 12, border: '1px solid rgba(0,0,0,0.02)' }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--pine)', lineHeight: 1.4, textAlign: 'left' }}>{log.detail}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                        <span style={{ fontSize: 9, fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--mono)' }}>{log.action?.toUpperCase()}</span>
                        <span style={{ fontSize: 9, color: 'var(--text4)', fontWeight: 600 }}>{new Date(log.timestamp).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          <motion.div 
            initial="hidden" animate="visible" custom={user?.role === 'admin' ? 7 : 6} variants={cardUp}
            style={{ 
              background: 'var(--surface)', backdropFilter: 'var(--glass)', borderRadius: 36, 
              padding: 32, border: '1.5px solid var(--line2)', textAlign: 'center'
            }}
          >
             <div style={{ 
               width: 56, height: 56, background: 'var(--red-dim)', borderRadius: 18, 
               display: 'flex', alignItems: 'center', justifyContent: 'center', 
               margin: '0 auto 20px', color: 'var(--red)' 
             }}>
               <ShieldCheck size={28} strokeWidth={2} />
             </div>
             <div style={{ fontWeight: 800, color: 'var(--pine)', fontSize: 16, letterSpacing: -0.5 }}>Clinical Support</div>
             <div style={{ fontSize: 13, color: 'var(--text3)', marginTop: 8, lineHeight: 1.5 }}>Our moderators review submissions within 24-48 hours. Thank you for contributing.</div>
          </motion.div>
        </div>

      </div>

      {/* PREVIEW MODAL */}
      <AnimatePresence>
        {previewItem && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flyout-overlay open" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, zIndex: 2000 }} 
            onClick={e => e.target.className.includes('flyout-overlay') && setPreviewItem(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              style={{ 
                maxWidth: 900, width: '100%', maxHeight: '90vh', background: 'var(--surface)', 
                borderRadius: 40, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column',
                boxShadow: 'var(--shadow-deep)', border: '2px solid var(--line2)'
              }}
            >
              {/* Header */}
              <div style={{ padding: '32px 40px', background: 'var(--primary)', color: '#fff', position: 'relative' }}>
                <button onClick={() => setPreviewItem(null)} style={{ position: 'absolute', top: 24, right: 32, background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', cursor: 'pointer', width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.2)', borderRadius: 10, fontSize: 10, fontWeight: 800, fontFamily: 'var(--mono)', letterSpacing: 1 }}>{previewItem.mediaType?.toUpperCase() || 'RESOURCE'}</div>
                  <div style={{ fontSize: 11, fontWeight: 500, opacity: 0.8 }}>MY SUBMISSION PREVIEW</div>
                </div>
                <h2 style={{ fontFamily: 'var(--display)', fontSize: 28, fontWeight: 900, letterSpacing: -1, lineHeight: 1.2 }}>{previewItem.title}</h2>
              </div>

              {/* Content Area */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '40px' }}>
                <div style={{ marginBottom: 32 }}>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text4)', letterSpacing: 2, marginBottom: 16, fontWeight: 800 }}>DESCRIPTION</div>
                  <p style={{ fontSize: 16, lineHeight: 1.6, color: 'var(--pine)', fontWeight: 500 }}>{previewItem.description}</p>
                </div>

                <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text4)', letterSpacing: 2, marginBottom: 16, fontWeight: 800 }}>ATTACHED MEDIA</div>
                {previewItem.files && previewItem.files.length > 0 ? (
                  previewItem.files.map((file, idx) => (
                    <MediaItem key={idx} file={file} />
                  ))
                ) : (
                  <div style={{ background: '#000', borderRadius: 24, overflow: 'hidden', border: '1.5px solid var(--line2)', marginBottom: 32 }}>
                     {previewItem.mediaType === 'video' ? (
                        <video controls style={{ width: '100%', maxHeight: 500 }}>
                          <source src={previewItem.fileUrl} type={previewItem.fileMimeType || 'video/mp4'} />
                        </video>
                      ) : previewItem.mediaType === 'pdf' ? (
                        <iframe src={previewItem.fileUrl} style={{ width: '100%', height: 600, border: 'none' }} title="PDF View" />
                      ) : previewItem.mediaType === 'image' ? (
                        <img src={previewItem.fileUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: 600, display: 'block', margin: '0 auto' }} />
                      ) : (
                        <div style={{ padding: 60, textAlign: 'center' }}>
                          <div style={{ fontSize: 56, marginBottom: 16 }}>🔗</div>
                          <div style={{ color: '#fff', fontWeight: 800, fontSize: 20 }}>External Source</div>
                          <a href={previewItem.externalUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--sky)', fontSize: 14, marginTop: 12, display: 'block', textDecoration: 'underline' }}>{previewItem.externalUrl}</a>
                        </div>
                      )}
                  </div>
                )}
              </div>

              <div style={{ padding: '24px 40px', background: 'var(--surface2)', borderTop: '1px solid var(--line2)', textAlign: 'right' }}>
                <button 
                  onClick={() => setPreviewItem(null)}
                  style={{ 
                    padding: '12px 32px', background: 'var(--primary)', border: 'none', 
                    borderRadius: 14, color: '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer',
                    boxShadow: '0 4px 12px var(--primary-glow)'
                  }}
                >
                  CLOSE PREVIEW
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
