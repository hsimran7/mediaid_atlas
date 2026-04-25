import { useState, useEffect } from 'react';
import { solutionsAPI } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, Clock, CheckCircle2, XCircle, 
  Trash2, Eye, User, Calendar, Tag, AlertTriangle,
  ChevronRight, ArrowLeft, FileText, Image as ImageIcon, Video
} from 'lucide-react';

function MediaItem({ file }) {
  const isVideo = file.fileMimeType?.startsWith('video/');
  const isPdf = file.fileMimeType === 'application/pdf';
  const isImage = file.fileMimeType?.startsWith('image/');

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ 
        fontSize: 11, color: 'var(--text4)', fontFamily: 'var(--mono)', 
        marginBottom: 10, display: 'flex', justifyContent: 'space-between',
        fontWeight: 700, letterSpacing: 1
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {isVideo ? <Video size={14} /> : isPdf ? <FileText size={14} /> : <ImageIcon size={14} />}
          <span>{file.fileName.toUpperCase()}</span>
        </div>
        <span>{(file.fileSize / 1024 / 1024).toFixed(2)} MB</span>
      </div>
      <div style={{ 
        background: 'var(--panel2)', borderRadius: 24, overflow: 'hidden', 
        border: '1.5px solid var(--line2)', boxShadow: 'var(--shadow-sm)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative'
      }}>
        {isVideo ? (
          <video controls style={{ width: '100%', maxHeight: 450, borderRadius: 22 }}>
            <source src={file.fileUrl} type={file.fileMimeType} />
          </video>
        ) : isPdf ? (
          <iframe src={file.fileUrl} style={{ width: '100%', height: 500, border: 'none' }} title="PDF Preview" />
        ) : isImage ? (
          <img src={file.fileUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: 600, display: 'block' }} />
        ) : (
          <div style={{ padding: 40, color: 'var(--text4)', fontSize: 13, fontWeight: 600 }}>Unsupported Preview</div>
        )}
      </div>
    </div>
  );
}

export default function Moderation({ showToast }) {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState(null);
  const [reviewNote, setReviewNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadSubmissions();
  }, []);

  async function loadSubmissions() {
    setLoading(true);
    try {
      const data = await solutionsAPI.getPending();
      setSubmissions(data.solutions || []);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }

  async function handleReview(id, status) {
    if (!status) return;
    setSubmitting(true);
    try {
      await solutionsAPI.review(id, { status, reviewNote });
      showToast(`Submission ${status} successfully.`, 'success');
      setSubmissions(prev => prev.filter(s => s._id !== id));
      setPreview(null);
      setReviewNote('');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this submission?')) return;
    try {
      await solutionsAPI.delete(id);
      showToast('Submission deleted.', 'success');
      setSubmissions(prev => prev.filter(s => s._id !== id));
      setPreview(null);
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  return (
    <div className="page active" style={{ padding: '40px 48px', background: 'transparent', overflowY: 'auto' }}>
      
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={{ marginBottom: 48, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
              <div style={{ width: 48, height: 48, background: 'var(--mist)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={28} strokeWidth={2} color="var(--primary)" />
              </div>
              <h1 style={{ fontFamily: 'var(--serif)', fontSize: 56, fontWeight: 900, color: 'var(--pine)', letterSpacing: -2 }}>
                Moderation
              </h1>
            </div>
            <p style={{ fontSize: 18, color: 'var(--text3)', fontWeight: 500, opacity: 0.8 }}>Reviewing {submissions.length} pending contributions</p>
          </div>
          <button onClick={loadSubmissions} style={{ 
            padding: '12px 20px', background: 'var(--panel)', border: '1.5px solid var(--line2)', 
            borderRadius: 16, color: 'var(--pine)', fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.3s'
          }} onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
             onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--line2)'}>
            REFRESH QUEUE
          </button>
        </motion.div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '120px 0', gap: 20 }}>
            <Clock className="spin" size={48} color="var(--primary)" />
            <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--text4)', letterSpacing: 4 }}>SCANNING ARCHIVES...</div>
            <style>{`.spin { animation: rotate 2s linear infinite; } @keyframes rotate { 100% { transform: rotate(360deg); } }`}</style>
          </div>
        ) : submissions.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="glass-panel"
            style={{ textAlign: 'center', padding: '80px 40px', borderStyle: 'dashed' }}
          >
            <div style={{ width: 80, height: 80, background: 'var(--mist)', borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <CheckCircle2 size={40} color="var(--primary)" strokeWidth={1.5} />
            </div>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: 32, color: 'var(--pine)', marginBottom: 12 }}>All Clear!</h2>
            <p style={{ color: 'var(--text3)', maxWidth: 400, margin: '0 auto', lineHeight: 1.6 }}>No pending submissions require your attention at this time. Great job keeping the Atlas healthy!</p>
          </motion.div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 32 }}>
            {submissions.map((s, idx) => (
              <motion.div 
                key={s._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                className="glass-panel"
                style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 24, transition: 'all 0.4s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.borderColor = 'var(--primary)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--line2)'; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ 
                    padding: '6px 12px', background: s.mediaType === 'video' ? 'var(--red-dim)' : s.mediaType === 'pdf' ? 'var(--mist)' : 'var(--mist)',
                    borderRadius: 12, fontSize: 10, fontWeight: 800, color: s.mediaType === 'video' ? 'var(--red)' : 'var(--primary)',
                    fontFamily: 'var(--mono)', letterSpacing: 1
                  }}>
                    {s.mediaType.toUpperCase()}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text4)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Clock size={12} /> {new Date(s.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div>
                  <h3 style={{ fontFamily: 'var(--display)', fontSize: 22, fontWeight: 800, color: 'var(--pine)', marginBottom: 8, lineHeight: 1.2 }}>{s.title}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text3)', fontSize: 13, fontWeight: 500 }}>
                    <Tag size={14} /> {s.condition}
                  </div>
                </div>

                <div style={{ padding: '20px', background: 'var(--panel2)', borderRadius: 20, border: '1px solid var(--line2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ fontSize: 24 }}>{s.author?.avatar || '👤'}</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--pine)' }}>{s.author?.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text4)', fontFamily: 'var(--mono)' }}>{s.author?.email}</div>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setPreview(s)}
                  style={{ 
                    marginTop: 'auto', padding: '16px', background: 'var(--primary)', border: 'none', 
                    borderRadius: 18, color: '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    boxShadow: '0 8px 20px var(--primary-glow)', transition: 'all 0.3s'
                  }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                     onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                  REVIEW SUBMISSION <ChevronRight size={18} strokeWidth={2.5} />
                </button>
              </motion.div>
            ))}
          </div>
        )}

        {/* REVIEW MODAL */}
        <AnimatePresence>
          {preview && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flyout-overlay open" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} 
              onClick={e => e.target.className.includes('flyout-overlay') && setPreview(null)}
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                style={{ 
                  maxWidth: 950, width: '100%', maxHeight: '90vh', background: 'var(--surface)', 
                  borderRadius: 48, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column',
                  boxShadow: 'var(--shadow-deep)', border: '2px solid var(--line2)'
                }}
              >
                {/* Header */}
                <div style={{ padding: '32px 48px', background: 'var(--primary)', color: '#fff', position: 'relative' }}>
                  <button onClick={() => setPreview(null)} style={{ position: 'absolute', top: 24, right: 32, background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', cursor: 'pointer', width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    <div style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.2)', borderRadius: 12, fontSize: 10, fontWeight: 800, fontFamily: 'var(--mono)', letterSpacing: 1 }}>{preview.mediaType.toUpperCase()}</div>
                    <div style={{ fontSize: 12, fontWeight: 500, opacity: 0.8 }}>ID: {preview._id}</div>
                  </div>
                  <h2 style={{ fontFamily: 'var(--display)', fontSize: 32, fontWeight: 900, letterSpacing: -1, lineHeight: 1.1 }}>{preview.title}</h2>
                </div>

                {/* Content Area */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '48px' }}>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 0.9fr', gap: 48 }}>
                    
                    <div>
                      <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text4)', letterSpacing: 2, marginBottom: 24, fontWeight: 800 }}>SUBMISSION CONTENT</div>
                      <p style={{ fontSize: 17, lineHeight: 1.6, color: 'var(--pine)', marginBottom: 40, fontWeight: 500 }}>{preview.description}</p>
                      
                      {preview.files && preview.files.length > 0 ? (
                        preview.files.map((file, idx) => (
                          <MediaItem key={idx} file={file} />
                        ))
                      ) : (
                        <div style={{ background: 'var(--panel2)', borderRadius: 24, overflow: 'hidden', border: '1.5px solid var(--line2)', marginBottom: 32 }}>
                           {preview.mediaType === 'video' ? (
                              <video controls style={{ width: '100%', maxHeight: 500 }}>
                                <source src={preview.fileUrl} type={preview.fileMimeType} />
                              </video>
                            ) : preview.mediaType === 'pdf' ? (
                              <iframe src={preview.fileUrl} style={{ width: '100%', height: 600, border: 'none' }} />
                            ) : preview.mediaType === 'image' ? (
                              <img src={preview.fileUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: 600, display: 'block' }} />
                            ) : (
                              <div style={{ padding: 60, textAlign: 'center' }}>
                                <div style={{ fontSize: 56, marginBottom: 16 }}>🔗</div>
                                <div style={{ color: 'var(--pine)', fontWeight: 800, fontSize: 20 }}>External Source</div>
                                <a href={preview.externalUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', fontSize: 14, marginTop: 12, display: 'block', textDecoration: 'underline' }}>{preview.externalUrl}</a>
                              </div>
                            )}
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
                      
                      <div className="glass-panel" style={{ padding: 32, background: 'var(--panel2)' }}>
                        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text4)', letterSpacing: 1.5, marginBottom: 20, fontWeight: 800 }}>CONTRIBUTOR</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                          <div style={{ fontSize: 44, width: 64, height: 64, background: 'var(--surface)', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid var(--line2)' }}>{preview.author?.avatar}</div>
                          <div>
                            <div style={{ fontWeight: 800, fontSize: 18, color: 'var(--pine)' }}>{preview.author?.name}</div>
                            <div style={{ fontSize: 12, color: 'var(--text4)', fontWeight: 600 }}>{preview.author?.email}</div>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text4)', letterSpacing: 1.5, marginBottom: 4, fontWeight: 800 }}>DETAILS</div>
                        {[
                          { label: 'Condition', val: preview.condition, Icon: Tag },
                          { label: 'Severity', val: preview.severity.toUpperCase(), Icon: AlertTriangle, color: preview.severity === 'critical' ? 'var(--red)' : 'var(--primary)' },
                          { label: 'Language', val: preview.language, Icon: User },
                          { label: 'Submitted', val: new Date(preview.createdAt).toLocaleDateString(), Icon: Calendar }
                        ].map((d, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 14, color: 'var(--pine)', fontWeight: 600 }}>
                            <div style={{ color: 'var(--text4)' }}><d.Icon size={18} /></div>
                            <div style={{ flex: 1 }}>{d.label}</div>
                            <div style={{ color: d.color || 'var(--pine)', fontWeight: 800 }}>{d.val}</div>
                          </div>
                        ))}
                      </div>

                      <div style={{ marginTop: 'auto' }}>
                        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text4)', letterSpacing: 1.5, marginBottom: 12, fontWeight: 800 }}>MODERATOR NOTES</div>
                        <textarea 
                          placeholder="Add a reason for your decision..."
                          value={reviewNote}
                          onChange={e => setReviewNote(e.target.value)}
                          style={{ 
                            width: '100%', minHeight: 120, background: 'var(--surface2)', 
                            border: '1.5px solid var(--line2)', borderRadius: 20, padding: 20, 
                            color: 'var(--pine)', fontSize: 14, outline: 'none', transition: 'all 0.3s',
                            fontFamily: 'var(--sans)', fontWeight: 500
                          }}
                          onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                          onBlur={e => e.target.style.borderColor = 'var(--line2)'}
                        />
                      </div>

                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div style={{ padding: '32px 48px', background: 'var(--surface2)', borderTop: '2px solid var(--line2)', display: 'flex', gap: 20 }}>
                  <button 
                    disabled={submitting}
                    onClick={() => handleReview(preview._id, 'approved')}
                    style={{ 
                      flex: 1.5, padding: '20px', background: 'var(--primary)', border: 'none', 
                      borderRadius: 24, color: '#fff', fontWeight: 800, fontSize: 16, cursor: 'pointer', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                      boxShadow: '0 8px 24px var(--primary-glow)', opacity: submitting ? 0.6 : 1
                    }}
                  >
                    <CheckCircle2 size={20} strokeWidth={2.5} /> {submitting ? 'PROCESSING...' : 'APPROVE & PUBLISH'}
                  </button>
                  <button 
                    disabled={submitting}
                    onClick={() => handleReview(preview._id, 'rejected')}
                    style={{ 
                      flex: 1, padding: '20px', background: 'var(--red-dim)', border: '2px solid var(--red)', 
                      borderRadius: 24, color: 'var(--red)', fontWeight: 800, fontSize: 16, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                      opacity: submitting ? 0.6 : 1
                    }}
                  >
                    <XCircle size={20} strokeWidth={2.5} /> {submitting ? 'REJECT' : 'REJECT'}
                  </button>
                  <button 
                    onClick={() => handleDelete(preview._id)}
                    style={{ 
                      padding: '20px', background: 'var(--panel)', border: '1.5px solid var(--line2)', 
                      borderRadius: 24, color: 'var(--text4)', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
