import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { solutionsAPI } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Filter, Video, FileText, BookOpen, 
  Home, ExternalLink, User, Search,
  ArrowRight, Sparkles, Activity, X, Play, Image as ImageIcon
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
        borderRadius: 24, overflow: 'hidden', 
        border: '1.5px solid var(--line2)', boxShadow: 'var(--shadow-sm)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', background: '#000'
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

const fUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  })
};

export default function Resources() {
  const { t } = useTranslation();
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [previewItem, setPreviewItem] = useState(null);

  useEffect(() => {
    solutionsAPI.getAll({ limit: 50 })
      .then(data => { setSolutions(data.solutions); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = solutions.filter(s => filter === 'all' || s.mediaType === filter);

  if (loading) return (
    <div className="page active" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <Activity className="spin" color="var(--forest)" size={48} strokeWidth={1} />
      <div style={{ fontFamily: 'var(--mono)', color: 'var(--text4)', fontSize: 11, letterSpacing: 4 }}>{t('common.loading').toUpperCase()}</div>
      <style>{`.spin { animation: rotate 2s linear infinite; } @keyframes rotate { 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div className="page active" style={{ padding: '40px 48px', background: 'transparent', overflowY: 'auto' }}>
      
      {/* Dynamic Header */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={{ marginBottom: 56 }}>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: 64, fontWeight: 900, color: 'var(--pine)', marginBottom: 12, letterSpacing: -2 }}>
          {t('nav.resources')}
        </h1>
        <p style={{ fontSize: 18, color: 'var(--text3)', maxWidth: 640, fontWeight: 500, lineHeight: 1.6, opacity: 0.8 }}>
          {t('resources.subtitle')}
        </p>
      </motion.div>

      {/* Modern Nature Filters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 48 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text4)', fontWeight: 800, fontSize: 11, fontFamily: 'var(--mono)', letterSpacing: 1 }}>
          <Filter size={14} strokeWidth={2.5} /> FILTER
        </div>
        <div style={{ 
          display: 'flex', gap: 8, background: 'var(--panel2)', padding: 6, 
          borderRadius: 20, border: '1.5px solid var(--line2)', overflowX: 'auto',
          scrollbarWidth: 'none'
        }}>
          {[
            { id: 'all', label: t('resources.filters.all'), Icon: Sparkles },
            { id: 'video', label: t('resources.filters.video'), Icon: Video },
            { id: 'pdf', label: t('resources.filters.pdf'), Icon: FileText },
            { id: 'guide', label: t('resources.filters.guide'), Icon: BookOpen },
            { id: 'home', label: t('resources.filters.home'), Icon: Home }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              style={{
                padding: '10px 24px', borderRadius: 16, border: 'none',
                background: filter === f.id ? 'var(--primary)' : 'transparent',
                color: filter === f.id ? '#fff' : 'var(--text3)',
                fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all 0.4s var(--ease)',
                display: 'flex', alignItems: 'center', gap: 10, whiteSpace: 'nowrap'
              }}
            >
              <f.Icon size={16} strokeWidth={filter === f.id ? 2.5 : 2} />
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Botanical Grid */}
      <div style={{ 
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 40 
      }}>
        <AnimatePresence mode="popLayout">
          {filtered.map((sol, i) => (
            <motion.div 
              layout key={sol._id} initial="hidden" animate="visible" custom={i} variants={fUp}
              className="glass-panel"
              style={{ 
                overflow: 'hidden', transition: 'all 0.5s var(--ease)', cursor: 'default',
                display: 'flex', flexDirection: 'column'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-12px)';
                e.currentTarget.style.borderColor = 'var(--primary)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'var(--line2)';
              }}
            >
              <div style={{ 
                height: 200, background: 'var(--panel2)', position: 'relative', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden'
              }}>
                <div style={{ position: 'absolute', inset: 0, opacity: 0.4, background: `radial-gradient(circle at 50% 50%, var(--mist), transparent)` }} />
                {sol.mediaType === 'video' ? <Video size={64} strokeWidth={1} color="var(--sky)" /> : 
                 sol.mediaType === 'pdf' ? <FileText size={64} strokeWidth={1} color="var(--red)" /> : 
                 <BookOpen size={64} strokeWidth={1} color="var(--primary)" />}
                
                <div style={{ 
                  position: 'absolute', top: 20, left: 20, background: 'var(--panel)', 
                  padding: '6px 14px', borderRadius: 10, fontSize: 10, fontWeight: 800, 
                  color: 'var(--pine)', border: '1px solid var(--line2)', letterSpacing: 0.5
                }}>
                  {sol.mediaType.toUpperCase()}
                </div>
              </div>

              <div style={{ padding: 32 }}>
                <div style={{ 
                  fontSize: 10, fontWeight: 800, color: 'var(--primary)', 
                  marginBottom: 12, fontFamily: 'var(--mono)', letterSpacing: 1.5 
                }}>
                  {sol.condition.toUpperCase()}
                </div>
                <h3 style={{ 
                  fontFamily: 'var(--display)', fontSize: 22, fontWeight: 800, 
                  color: 'var(--pine)', marginBottom: 14, lineHeight: 1.2, letterSpacing: -0.5
                }}>{sol.title}</h3>
                <p style={{ 
                  fontSize: 14, color: 'var(--text3)', lineHeight: 1.6, 
                  marginBottom: 28, height: 44, overflow: 'hidden', fontWeight: 500, opacity: 0.8
                }}>{sol.description}</p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                     <div style={{ 
                       width: 32, height: 32, background: 'var(--mist)', borderRadius: 10, 
                       display: 'flex', alignItems: 'center', justifyContent: 'center' 
                     }}>
                       <User size={16} strokeWidth={2} color="var(--primary)" />
                     </div>
                     <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text2)' }}>{sol.authorName}</span>
                  </div>
                  <button 
                    className="res-view-btn" 
                    onClick={() => setPreviewItem(sol)}
                    style={{ 
                      background: 'var(--panel2)', border: 'none', padding: '10px 20px', 
                      borderRadius: 12, color: 'var(--primary)', fontWeight: 800, fontSize: 12,
                      cursor: 'pointer', transition: 'all 0.3s', display: 'flex', alignItems: 'center', gap: 8
                    }}
                  >
                    VIEW <ArrowRight size={14} strokeWidth={3} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* PREVIEW MODAL */}
      <AnimatePresence>
        {previewItem && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flyout-overlay open" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} 
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
                  <div style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.2)', borderRadius: 10, fontSize: 10, fontWeight: 800, fontFamily: 'var(--mono)', letterSpacing: 1 }}>{previewItem.mediaType.toUpperCase()}</div>
                  <div style={{ fontSize: 11, fontWeight: 500, opacity: 0.8 }}>PREVIEWING ATLAS RESOURCE</div>
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

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24, marginTop: 32, padding: 24, background: 'var(--panel2)', borderRadius: 24 }}>
                  <div>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--text4)', letterSpacing: 1, marginBottom: 8 }}>CONDITION</div>
                    <div style={{ fontWeight: 800, color: 'var(--pine)', fontSize: 14 }}>{previewItem.condition.toUpperCase()}</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--text4)', letterSpacing: 1, marginBottom: 8 }}>CONTRIBUTOR</div>
                    <div style={{ fontWeight: 800, color: 'var(--pine)', fontSize: 14 }}>{previewItem.authorName}</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--text4)', letterSpacing: 1, marginBottom: 8 }}>SEVERITY</div>
                    <div style={{ fontWeight: 800, color: previewItem.severity === 'critical' ? 'var(--red)' : 'var(--primary)', fontSize: 14 }}>{previewItem.severity?.toUpperCase()}</div>
                  </div>
                </div>
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

      <style>{`
        .res-view-btn:hover { background: var(--primary); color: #fff; transform: translateX(4px); }
        .spin { animation: rotate 2s linear infinite; }
        @keyframes rotate { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
