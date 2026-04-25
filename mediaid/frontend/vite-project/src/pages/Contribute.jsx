import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { solutionsAPI } from '../services/api';
import { motion } from 'framer-motion';
import { 
  Leaf, Info, ShieldCheck, ChevronRight, 
  PlusCircle, BookOpen, Video, FileText, 
  ExternalLink, UserPlus, FileUp
} from 'lucide-react';

export default function Contribute({ showToast, onShowAuth }) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    condition: '',
    severity: 'mild',
    mediaType: 'guide',
    externalUrl: '',
    source: ''
  });
  const [selectedFiles, setSelectedFiles] = useState([]);

  const onFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!user) return onShowAuth('login');
    setLoading(true);
    
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    selectedFiles.forEach(file => data.append('files', file));

    try {
      await solutionsAPI.create(data);
      showToast('Remedy submitted for review!', 'success');
      setFormData({ title: '', description: '', condition: '', severity: 'mild', mediaType: 'guide', externalUrl: '', source: '' });
      setSelectedFiles([]);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }

  if (!user) {
    return (
      <div className="page active" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          style={{ 
            maxWidth: 520, textAlign: 'center', background: 'var(--panel)', padding: '64px 48px', 
            borderRadius: 48, boxShadow: 'var(--shadow-deep)', border: '1.5px solid var(--line2)' 
          }}
        >
          <div style={{ 
            width: 80, height: 80, background: 'var(--mist)', borderRadius: 24, 
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px'
          }}>
            <UserPlus size={40} strokeWidth={1.5} color="var(--primary)" />
          </div>
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: 44, fontWeight: 800, color: 'var(--pine)', marginBottom: 16, letterSpacing: -1 }}>
            Join the Circle
          </h2>
          <p style={{ color: 'var(--text3)', lineHeight: 1.6, marginBottom: 40, fontSize: 16, fontWeight: 500, opacity: 0.8 }}>
            {t('contribute.login_prompt')}
          </p>
          <button onClick={() => onShowAuth('login')} style={{
            width: '100%', padding: '20px', background: 'var(--primary)', border: 'none',
            borderRadius: 20, color: '#fff', fontFamily: 'var(--display)', fontSize: 18,
            fontWeight: 800, cursor: 'pointer', transition: 'all 0.3s var(--ease)',
            boxShadow: '0 12px 24px var(--primary-glow)'
          }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
             onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
            SIGN IN TO CONTRIBUTE
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="page active" style={{ padding: '40px 48px', background: 'transparent', overflowY: 'auto' }}>
      
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={{ marginBottom: 48 }}>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 64, fontWeight: 900, color: 'var(--pine)', marginBottom: 12, letterSpacing: -2 }}>
            {t('nav.contribute')}
          </h1>
          <p style={{ fontSize: 18, color: 'var(--text3)', fontWeight: 500, opacity: 0.8 }}>{t('contribute.subtitle')}</p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.6fr', gap: 48 }}>
          
          {/* Professional Form Layout */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="glass-panel"
            style={{ padding: 56 }}
          >
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div className="form-field-premium">
                  <label>CONDITION</label>
                  <div className="input-wrap">
                    <input 
                      required value={formData.condition}
                      onChange={e => setFormData({...formData, condition: e.target.value})}
                      placeholder="e.g. Minor Burns"
                    />
                  </div>
                </div>
                <div className="form-field-premium">
                  <label>SEVERITY</label>
                  <div className="input-wrap">
                    <select 
                      value={formData.severity}
                      onChange={e => setFormData({...formData, severity: e.target.value})}
                    >
                      <option value="mild">🟢 MILD CASE</option>
                      <option value="moderate">🟡 MODERATE CASE</option>
                      <option value="critical">🔴 CRITICAL CASE</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-field-premium">
                <label>SUBMISSION TITLE</label>
                <div className="input-wrap">
                  <input 
                    required value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    placeholder={t('contribute.placeholders.title')}
                  />
                </div>
              </div>

              <div className="form-field-premium">
                <label>DETAILED INSTRUCTIONS</label>
                <div className="input-wrap">
                  <textarea 
                    required value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    placeholder={t('contribute.placeholders.desc')}
                    rows={6}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div className="form-field-premium">
                  <label>MEDIA FORMAT</label>
                  <div className="input-wrap">
                    <select value={formData.mediaType} onChange={e => setFormData({...formData, mediaType: e.target.value})}>
                      <option value="guide">📖 Digital Guide</option>
                      <option value="video">🎬 Educational Video</option>
                      <option value="pdf">📄 PDF Document</option>
                    </select>
                  </div>
                </div>
                <div className="form-field-premium">
                  <label>ATTACH MEDIA (IMAGES, VIDEOS, DOCUMENTS)</label>
                  <div className="input-wrap">
                    <div style={{ 
                      border: '2px dashed var(--line)', borderRadius: 20, padding: '32px', 
                      textAlign: 'center', background: 'var(--panel2)', cursor: 'pointer',
                      transition: 'all 0.3s'
                    }} onClick={() => document.getElementById('file-input').click()}
                       onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                       onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--line)'}>
                      <FileUp size={32} strokeWidth={1.5} color="var(--text4)" style={{ marginBottom: 12 }} />
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--pine)' }}>Click to upload multiple files</div>
                      <div style={{ fontSize: 11, color: 'var(--text4)', marginTop: 4 }}>Support for Images, Videos, and PDFs</div>
                    </div>
                    <input 
                      id="file-input" type="file" multiple hidden 
                      onChange={onFileChange}
                      accept="image/*,video/*,application/pdf"
                    />
                  </div>
                  
                  {selectedFiles.length > 0 && (
                    <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {selectedFiles.map((f, i) => (
                        <div key={i} style={{ 
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                          padding: '12px 16px', background: 'var(--panel)', borderRadius: 12, border: '1px solid var(--line2)'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ color: 'var(--primary)' }}>
                              {f.type.startsWith('image/') ? <PlusCircle size={16} /> : f.type.startsWith('video/') ? <Video size={16} /> : <FileText size={16} />}
                            </div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--pine)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</div>
                          </div>
                          <button type="button" onClick={() => removeFile(i)} style={{ background: 'none', border: 'none', color: 'var(--red)', cursor: 'pointer', fontSize: 16 }}>✕</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="form-field-premium">
                  <label>EXTERNAL REFERENCE (IF ANY)</label>
                  <div className="input-wrap">
                    <input 
                      value={formData.externalUrl}
                      onChange={e => setFormData({...formData, externalUrl: e.target.value})}
                      placeholder="External link (optional)"
                    />
                  </div>
                </div>
              </div>

              <button type="submit" disabled={loading} style={{
                marginTop: 16, padding: '22px', background: 'var(--primary)', border: 'none',
                borderRadius: 24, color: '#fff', fontFamily: 'var(--display)', fontSize: 20,
                fontWeight: 800, cursor: 'pointer', transition: 'all 0.4s var(--ease)',
                boxShadow: '0 12px 32px var(--primary-glow)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12
              }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                 onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                {loading ? 'PROCESSING...' : (
                  <>
                    <PlusCircle size={22} strokeWidth={2.5} />
                    {t('common.submit').toUpperCase()}
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Guidelines Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              style={{ background: 'var(--pine)', borderRadius: 40, padding: 48, color: '#fff', boxShadow: 'var(--shadow-deep)' }}
            >
              <div style={{ width: 56, height: 56, background: 'rgba(255,255,255,0.08)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 28 }}>
                <Info size={28} strokeWidth={2} color="var(--primary-dim)" />
              </div>
              <h3 style={{ fontFamily: 'var(--display)', fontSize: 24, fontWeight: 700, marginBottom: 24, letterSpacing: -0.5 }}>Submission Ethics</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {[1,2,3,4].map(n => (
                  <div key={n} style={{ display: 'flex', gap: 16, fontSize: 14, lineHeight: 1.5, opacity: 0.9 }}>
                    <ChevronRight size={16} strokeWidth={3} color="var(--primary-dim)" style={{ marginTop: 2, flexShrink: 0 }} />
                    {t(`contribute.guidance.tip${n}`)}
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              style={{ background: 'var(--panel)', borderRadius: 36, padding: 32, border: '1.5px solid var(--line2)', boxShadow: 'var(--shadow)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                <ShieldCheck size={24} strokeWidth={2.5} color="var(--primary)" />
                <div style={{ fontWeight: 800, color: 'var(--pine)', fontSize: 15, letterSpacing: -0.2 }}>Quality Control</div>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text3)', lineHeight: 1.6, fontWeight: 500, opacity: 0.8 }}>
                Every contribution undergoes a peer-review cycle by our clinical moderators to ensure safe and accurate guidance.
              </p>
            </motion.div>
          </div>

        </div>
      </div>

      <style>{`
        .form-field-premium { display: flex; flex-direction: column; gap: 10px; }
        .form-field-premium label { font-size: 11px; font-weight: 800; color: var(--text4); font-family: var(--mono); letter-spacing: 2px; }
        .input-wrap { position: relative; }
        .form-field-premium input, .form-field-premium select, .form-field-premium textarea {
          width: 100%; background: var(--panel2); border: 1.5px solid var(--line); 
          padding: 18px 24px; border-radius: 20px; color: var(--pine); 
          font-size: 16px; font-family: var(--sans); outline: none; 
          transition: all 0.3s var(--ease); font-weight: 500;
        }
        .form-field-premium input:focus, .form-field-premium select:focus, .form-field-premium textarea:focus {
          border-color: var(--primary); background: #fff; box-shadow: 0 0 0 6px var(--mist);
        }
        .form-field-premium select { cursor: pointer; appearance: none; }
      `}</style>
    </div>
  );
}
