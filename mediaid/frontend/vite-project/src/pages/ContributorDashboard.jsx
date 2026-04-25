import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI, solutionsAPI } from '../services/api';

const CONDITIONS = [
  'Burns','Wounds / Bleeding','CPR / Cardiac Arrest','Choking','Fever',
  'Fracture','Snake Bite','Asthma Attack','Drowning','Heatstroke',
  'Chemical Burns','Seizure / Epilepsy','Stroke','Poisoning / Overdose',
  'Diabetic Emergency','Anaphylaxis','Insect Sting','Animal / Dog Bite',
  'Scorpion Sting','Sprain / Strain','Joint Dislocation','Spinal Injury',
  'Febrile Seizure','Infant CPR','Emergency Childbirth','Other',
];
const CONDITION_KEYS = {
  'Burns':'burn','Wounds / Bleeding':'wound','CPR / Cardiac Arrest':'cpr',
  'Choking':'choking','Fever':'fever','Fracture':'fracture','Snake Bite':'snake',
  'Asthma Attack':'asthma_attack','Drowning':'drowning','Heatstroke':'heatstroke',
  'Chemical Burns':'chemical_burn','Seizure / Epilepsy':'seizure','Stroke':'stroke',
  'Poisoning / Overdose':'poisoning','Diabetic Emergency':'diabetic',
  'Anaphylaxis':'allergic','Insect Sting':'insect_sting','Animal / Dog Bite':'dog_bite',
  'Scorpion Sting':'scorpion','Sprain / Strain':'sprain','Joint Dislocation':'dislocation',
  'Spinal Injury':'spinal_injury','Febrile Seizure':'febrile_seizure',
  'Infant CPR':'infant_cpr','Emergency Childbirth':'emergency_birth',
};

const STATUS_STYLE = {
  pending: { bg: 'var(--amber-dim)', color: 'var(--amber)', border: 'rgba(255,184,48,0.2)', label: '⏳ PENDING' },
  approved: { bg: 'var(--green-dim)', color: 'var(--green)', border: 'rgba(0,229,160,0.2)', label: '✓ APPROVED' },
  rejected: { bg: 'var(--red-dim)', color: 'var(--red)', border: 'rgba(255,59,92,0.2)', label: '✕ REJECTED' },
  flagged: { bg: 'var(--violet-dim)', color: 'var(--violet)', border: 'rgba(139,92,246,0.2)', label: '⚑ FLAGGED' },
};

export default function ContributorDashboard({ showToast }) {
  const { user, refreshUser } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('overview');
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [steps, setSteps] = useState(['']);
  const [ingredients, setIngredients] = useState(['']);
  const fileRef = useRef();

  const [form, setForm] = useState({
    title: '', description: '', condition: 'Burns', conditionKey: 'burn',
    mediaType: 'video', externalUrl: '', duration: '',
    severity: 'moderate', tags: '', language: 'en', region: '',
    source: 'Community', evidence: '',
  });
  const [file, setFile] = useState(null);

  useEffect(() => { loadDashboard(); }, []);

  async function loadDashboard() {
    setLoading(true);
    try {
      const data = await authAPI.getDashboard();
      setDashboard(data.dashboard);
    } catch (err) {
      showToast('Failed to load dashboard', 'error');
    } finally {
      setLoading(false);
    }
  }

  function handleFormChange(e) {
    const { name, value } = e.target;
    const updates = { [name]: value };
    if (name === 'condition') updates.conditionKey = CONDITION_KEYS[value] || '';
    setForm(p => ({ ...p, ...updates }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title || !form.description || !form.condition) {
      return showToast('Title, description and condition are required.', 'error');
    }
    if (form.mediaType === 'video' && !form.externalUrl && !file) {
      return showToast('Please provide a video URL or upload a file.', 'error');
    }

    setSubmitting(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    fd.append('steps', JSON.stringify(steps.filter(Boolean)));
    fd.append('ingredients', JSON.stringify(ingredients.filter(Boolean)));
    if (file) fd.append('file', file);

    try {
      const data = await solutionsAPI.create(fd);
      showToast(data.message, 'success');
      setForm({ title: '', description: '', condition: 'Burns', conditionKey: 'burn', mediaType: 'video', externalUrl: '', duration: '', severity: 'moderate', tags: '', language: 'en', region: '', source: 'Community', evidence: '' });
      setSteps(['']); setIngredients(['']); setFile(null);
      if (fileRef.current) fileRef.current.value = '';
      loadDashboard();
      refreshUser();
      setTab('my-solutions');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this solution? This cannot be undone.')) return;
    try {
      await solutionsAPI.delete(id);
      showToast('Solution deleted.', 'success');
      loadDashboard();
      refreshUser();
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  if (loading) return (
    <div className="page active" style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: 'var(--mono)', color: 'var(--cyan)', fontSize: 12, letterSpacing: 2 }}>LOADING...</div>
    </div>
  );

  const stats = dashboard?.contributorStats || {};
  const mySolutions = dashboard?.mySolutions || [];

  return (
    <div className="page active" id="page-contributor-dashboard">
      <div className="pg-body">

        {/* Profile Banner */}
        <div style={{ background: 'linear-gradient(135deg, var(--surface2) 0%, var(--panel) 100%)', border: '1px solid var(--line2)', borderRadius: 'var(--r)', padding: '20px 24px', marginBottom: 20, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, var(--green), var(--cyan))' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: 'var(--green-dim)', border: '1px solid rgba(0,229,160,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>
              {user?.avatar || '🌿'}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--display)', fontSize: 20, letterSpacing: 2 }}>{user?.name}</div>
              <div style={{ fontSize: 11, color: 'var(--green)', fontFamily: 'var(--mono)', letterSpacing: 1 }}>
                {user?.specialization || 'CONTRIBUTOR'} · {user?.country || 'Global'}
              </div>
            </div>
            {[
              { label: 'SUBMITTED', val: stats.total || 0, color: 'var(--cyan)' },
              { label: 'APPROVED', val: stats.approved || 0, color: 'var(--green)' },
              { label: 'PENDING', val: stats.pending || 0, color: 'var(--amber)' },
              { label: 'TOTAL VIEWS', val: stats.totalViews || 0, color: 'var(--violet)' },
              { label: 'TOTAL LIKES', val: stats.totalLikes || 0, color: 'var(--red)' },
            ].map(stat => (
              <div key={stat.label} style={{ textAlign: 'center', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 8, padding: '10px 16px', minWidth: 70 }}>
                <div style={{ fontFamily: 'var(--display)', fontSize: 22, color: stat.color }}>{stat.val}</div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 8, color: 'var(--text3)', letterSpacing: 1 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flyout-tabs" style={{ padding: 0, marginBottom: 20, border: '1px solid var(--line2)', borderRadius: 8, overflow: 'hidden' }}>
          {[
            { id: 'overview', label: '📊 OVERVIEW' },
            { id: 'upload', label: '📤 UPLOAD SOLUTION' },
            { id: 'my-solutions', label: `📋 MY SOLUTIONS (${mySolutions.length})` },
          ].map(t => (
            <div key={t.id} className={`flyout-tab${tab === t.id ? ' active' : ''}`} style={{ flex: 1, textAlign: 'center' }} onClick={() => setTab(t.id)}>{t.label}</div>
          ))}
        </div>

        {/* OVERVIEW */}
        {tab === 'overview' && (
          <div className="dash-grid">
            {/* Status Breakdown */}
            <div className="dash-panel">
              <div className="dash-panel-title">📊 SOLUTION STATUS BREAKDOWN</div>
              {[
                { label: 'Approved', val: stats.approved || 0, color: 'var(--green)', pct: stats.total ? Math.round((stats.approved / stats.total) * 100) : 0 },
                { label: 'Pending Review', val: stats.pending || 0, color: 'var(--amber)', pct: stats.total ? Math.round((stats.pending / stats.total) * 100) : 0 },
                { label: 'Rejected', val: stats.rejected || 0, color: 'var(--red)', pct: stats.total ? Math.round((stats.rejected / stats.total) * 100) : 0 },
              ].map(bar => (
                <div key={bar.label} className="hbar-item">
                  <div className="hbar-label"><span>{bar.label}</span><span className="hbar-pct">{bar.val} ({bar.pct}%)</span></div>
                  <div className="hbar-track"><div className="hbar-fill" style={{ width: `${bar.pct}%`, background: bar.color }}></div></div>
                </div>
              ))}
              <div style={{ marginTop: 16, padding: '10px 14px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 8 }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--text3)', letterSpacing: 1, marginBottom: 4 }}>ENGAGEMENT TOTALS</div>
                <div style={{ display: 'flex', gap: 16 }}>
                  <div><span style={{ fontFamily: 'var(--display)', fontSize: 20, color: 'var(--cyan)' }}>{stats.totalViews || 0}</span> <span style={{ fontSize: 10, color: 'var(--text3)' }}>views</span></div>
                  <div><span style={{ fontFamily: 'var(--display)', fontSize: 20, color: 'var(--red)' }}>{stats.totalLikes || 0}</span> <span style={{ fontSize: 10, color: 'var(--text3)' }}>likes</span></div>
                </div>
              </div>
            </div>

            {/* Recent submissions */}
            <div className="dash-panel">
              <div className="dash-panel-title">🕐 RECENT SUBMISSIONS</div>
              {mySolutions.slice(0, 5).map(s => {
                const st = STATUS_STYLE[s.status] || STATUS_STYLE.pending;
                return (
                  <div key={s._id} className="sub-item">
                    <div className="sub-ava" style={{ background: 'var(--panel)', fontSize: 14 }}>
                      {s.mediaType === 'video' ? '🎬' : s.mediaType === 'pdf' ? '📄' : '📖'}
                    </div>
                    <div className="sub-info">
                      <div className="sub-name" style={{ fontSize: 11 }}>{s.title.slice(0, 40)}{s.title.length > 40 ? '...' : ''}</div>
                      <div className="sub-meta">{s.condition} · {new Date(s.createdAt).toLocaleDateString()}</div>
                    </div>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 8, padding: '2px 6px', borderRadius: 3, background: st.bg, color: st.color, border: `1px solid ${st.border}` }}>{st.label}</span>
                  </div>
                );
              })}
              {mySolutions.length === 0 && (
                <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text3)', fontSize: 12 }}>No submissions yet. Upload your first solution!</div>
              )}
              {mySolutions.length > 0 && (
                <button onClick={() => setTab('upload')} style={{ width: '100%', marginTop: 12, padding: '9px 0', background: 'var(--green-dim)', border: '1px solid rgba(0,229,160,0.2)', borderRadius: 8, color: 'var(--green)', fontFamily: 'var(--mono)', fontSize: 11, cursor: 'pointer', letterSpacing: 1 }}>
                  + UPLOAD NEW SOLUTION
                </button>
              )}
            </div>

            {/* Activity */}
            <div className="dash-panel" style={{ gridColumn: '1 / -1' }}>
              <div className="dash-panel-title">📋 RECENT ACTIVITY</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 8 }}>
                {(user?.activityLog || []).slice(0, 6).map((act, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 12px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 8 }}>
                    <div style={{ fontSize: 16 }}>{act.action === 'login' ? '🔑' : act.action?.includes('solution') ? '📋' : '✏️'}</div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 500 }}>{act.detail}</div>
                      <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginTop: 2 }}>{new Date(act.timestamp).toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* UPLOAD SOLUTION */}
        {tab === 'upload' && (
          <form onSubmit={handleSubmit}>
            <div className="contrib-grid">
              <div className="form-panel">
                <div className="form-panel-title">UPLOAD A SOLUTION</div>
                <div className="form-panel-sub">Share your first aid knowledge — video, PDF, guide, or image.</div>

                {/* Media Type */}
                <div className="f-group">
                  <label className="f-label">Solution Type *</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6 }}>
                    {[
                      { val: 'video', icon: '🎬', label: 'VIDEO' },
                      { val: 'pdf', icon: '📄', label: 'PDF' },
                      { val: 'guide', icon: '📖', label: 'GUIDE' },
                      { val: 'image', icon: '🖼️', label: 'IMAGE' },
                      { val: 'link', icon: '🔗', label: 'LINK' },
                    ].map(opt => (
                      <div key={opt.val} onClick={() => setForm(p => ({ ...p, mediaType: opt.val }))}
                        style={{ padding: '10px 8px', borderRadius: 8, cursor: 'pointer', textAlign: 'center', border: `2px solid ${form.mediaType === opt.val ? 'var(--cyan)' : 'var(--line2)'}`, background: form.mediaType === opt.val ? 'var(--cyan-dim)' : 'var(--panel)', transition: 'all 0.15s' }}>
                        <div style={{ fontSize: 18, marginBottom: 3 }}>{opt.icon}</div>
                        <div style={{ fontFamily: 'var(--mono)', fontSize: 8, letterSpacing: 1, color: form.mediaType === opt.val ? 'var(--cyan)' : 'var(--text3)' }}>{opt.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div className="f-group">
                  <label className="f-label">Title *</label>
                  <input className="f-input" name="title" value={form.title} onChange={handleFormChange} placeholder="e.g. How to treat a severe burn — step by step" required />
                </div>

                {/* Description */}
                <div className="f-group">
                  <label className="f-label">Description *</label>
                  <textarea className="f-textarea" name="description" value={form.description} onChange={handleFormChange} placeholder="Describe what this solution covers and who it's for..." required style={{ minHeight: 80 }} />
                </div>

                {/* Condition + Severity row */}
                <div className="f-row">
                  <div className="f-group">
                    <label className="f-label">Medical Condition *</label>
                    <select className="f-select" name="condition" value={form.condition} onChange={handleFormChange}>
                      {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="f-group">
                    <label className="f-label">Severity Level</label>
                    <select className="f-select" name="severity" value={form.severity} onChange={handleFormChange}>
                      <option value="critical">🔴 Critical</option>
                      <option value="moderate">🟡 Moderate</option>
                      <option value="mild">🟢 Mild</option>
                      <option value="general">⚪ General</option>
                    </select>
                  </div>
                </div>

                {/* External URL (for video/link) */}
                {(form.mediaType === 'video' || form.mediaType === 'link') && (
                  <div className="f-group">
                    <label className="f-label">{form.mediaType === 'video' ? 'YouTube / Video URL' : 'External Link URL'}</label>
                    <input className="f-input" name="externalUrl" value={form.externalUrl} onChange={handleFormChange} placeholder="https://youtube.com/..." />
                  </div>
                )}

                {/* File Upload (for non-link types) */}
                {form.mediaType !== 'link' && (
                  <div className="f-group">
                    <label className="f-label">Upload File {form.mediaType === 'video' ? '(MP4, WebM — max 50MB)' : form.mediaType === 'pdf' ? '(PDF — max 50MB)' : '(Image — max 50MB)'}</label>
                    <div className="upload-drop" onClick={() => fileRef.current?.click()}>
                      <input ref={fileRef} type="file" style={{ display: 'none' }}
                        accept={form.mediaType === 'video' ? 'video/*' : form.mediaType === 'pdf' ? 'application/pdf' : 'image/*'}
                        onChange={e => setFile(e.target.files[0])} />
                      <div className="upload-drop-ico">{file ? '✅' : form.mediaType === 'video' ? '🎬' : form.mediaType === 'pdf' ? '📄' : '🖼️'}</div>
                      <p>{file ? file.name : 'Click to select file'}</p>
                      {file && <span>{(file.size / (1024 * 1024)).toFixed(1)} MB</span>}
                    </div>
                  </div>
                )}

                {/* Duration (video) */}
                {form.mediaType === 'video' && (
                  <div className="f-group">
                    <label className="f-label">Duration (e.g. 5:32)</label>
                    <input className="f-input" name="duration" value={form.duration} onChange={handleFormChange} placeholder="5:32" />
                  </div>
                )}

                {/* Steps */}
                <div className="f-group">
                  <label className="f-label">Protocol Steps</label>
                  {steps.map((step, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                      <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--cyan-dim)', border: '1px solid rgba(0,200,232,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--cyan)', flexShrink: 0, marginTop: 8 }}>{i + 1}</div>
                      <input className="f-input" value={step} style={{ flex: 1 }} placeholder={`Step ${i + 1}...`}
                        onChange={e => setSteps(prev => prev.map((s, j) => j === i ? e.target.value : s))} />
                      {steps.length > 1 && (
                        <button type="button" onClick={() => setSteps(prev => prev.filter((_, j) => j !== i))}
                          style={{ background: 'var(--red-dim)', border: '1px solid rgba(255,59,92,0.2)', color: 'var(--red)', borderRadius: 6, width: 32, height: 36, cursor: 'pointer', flexShrink: 0, marginTop: 2 }}>✕</button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={() => setSteps(p => [...p, ''])}
                    style={{ padding: '6px 12px', background: 'var(--panel)', border: '1px solid var(--line2)', borderRadius: 6, color: 'var(--text2)', fontFamily: 'var(--mono)', fontSize: 10, cursor: 'pointer', letterSpacing: 1 }}>
                    + ADD STEP
                  </button>
                </div>

                {/* Ingredients */}
                <div className="f-group">
                  <label className="f-label">Ingredients / Materials</label>
                  {ingredients.map((ing, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                      <input className="f-input" value={ing} style={{ flex: 1 }} placeholder={`e.g. Aloe vera gel`}
                        onChange={e => setIngredients(prev => prev.map((s, j) => j === i ? e.target.value : s))} />
                      {ingredients.length > 1 && (
                        <button type="button" onClick={() => setIngredients(prev => prev.filter((_, j) => j !== i))}
                          style={{ background: 'var(--red-dim)', border: '1px solid rgba(255,59,92,0.2)', color: 'var(--red)', borderRadius: 6, width: 32, height: 36, cursor: 'pointer', flexShrink: 0 }}>✕</button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={() => setIngredients(p => [...p, ''])}
                    style={{ padding: '6px 12px', background: 'var(--panel)', border: '1px solid var(--line2)', borderRadius: 6, color: 'var(--text2)', fontFamily: 'var(--mono)', fontSize: 10, cursor: 'pointer', letterSpacing: 1 }}>
                    + ADD INGREDIENT
                  </button>
                </div>

                {/* Tags + Language + Region */}
                <div className="f-group">
                  <label className="f-label">Tags (comma separated)</label>
                  <input className="f-input" name="tags" value={form.tags} onChange={handleFormChange} placeholder="burn, children, traditional, WHO..." />
                </div>
                <div className="f-row">
                  <div className="f-group">
                    <label className="f-label">Language</label>
                    <select className="f-select" name="language" value={form.language} onChange={handleFormChange}>
                      <option value="en">🇬🇧 English</option>
                      <option value="ur">🇵🇰 Urdu</option>
                      <option value="hi">🇮🇳 Hindi</option>
                      <option value="ar">🇸🇦 Arabic</option>
                      <option value="fr">🇫🇷 French</option>
                      <option value="es">🇪🇸 Spanish</option>
                      <option value="sw">🇰🇪 Swahili</option>
                      <option value="bn">🇧🇩 Bengali</option>
                    </select>
                  </div>
                  <div className="f-group">
                    <label className="f-label">Region / Country</label>
                    <input className="f-input" name="region" value={form.region} onChange={handleFormChange} placeholder="e.g. Pakistan, Kenya, Global..." />
                  </div>
                </div>
                <div className="f-row">
                  <div className="f-group">
                    <label className="f-label">Source / Organization</label>
                    <input className="f-input" name="source" value={form.source} onChange={handleFormChange} placeholder="e.g. WHO, Red Cross, Community..." />
                  </div>
                  <div className="f-group">
                    <label className="f-label">Evidence / Reference URL</label>
                    <input className="f-input" name="evidence" value={form.evidence} onChange={handleFormChange} placeholder="PubMed link, WHO doc, etc." />
                  </div>
                </div>

                <button className="submit-cta" type="submit" disabled={submitting} style={{ opacity: submitting ? 0.7 : 1 }}>
                  {submitting ? 'SUBMITTING...' : 'SUBMIT FOR REVIEW →'}
                </button>
              </div>

              {/* Info sidebar */}
              <div className="info-stack">
                <div className="info-widget">
                  <div className="info-widget-title">📋 SUBMISSION GUIDELINES</div>
                  <ul className="check-list">
                    <li>Based on real first aid / clinical knowledge</li>
                    <li>Include clear step-by-step instructions</li>
                    <li>Specify who it's safe for (age, conditions)</li>
                    <li>Link to credible sources when possible</li>
                    <li>Video: MP4/WebM, max 50MB</li>
                    <li>PDF: max 50MB</li>
                    <li>Your submission will be reviewed before going live</li>
                  </ul>
                </div>
                <div className="info-widget">
                  <div className="info-widget-title">⚡ REVIEW PROCESS</div>
                  <p>Submissions are reviewed by our team within 24–48 hours. Approved solutions appear in the Seeker Dashboard and Resource Library immediately.</p>
                  <div className="meter-wrap" style={{ marginTop: 12 }}>
                    <div className="meter-label"><span>Approval Rate</span><span>{stats.total ? Math.round(((stats.approved || 0) / stats.total) * 100) : 0}%</span></div>
                    <div className="meter"><div className="meter-fill" style={{ width: `${stats.total ? Math.round(((stats.approved || 0) / stats.total) * 100) : 0}%` }}></div></div>
                  </div>
                </div>
                <div className="info-widget">
                  <div className="info-widget-title">🏆 YOUR STATS</div>
                  {[
                    ['Total Submitted', stats.total || 0],
                    ['Approved', stats.approved || 0],
                    ['Total Views', stats.totalViews || 0],
                    ['Total Likes', stats.totalLikes || 0],
                  ].map(([label, val]) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--line)', fontSize: 12 }}>
                      <span style={{ color: 'var(--text2)' }}>{label}</span>
                      <span style={{ fontFamily: 'var(--mono)', color: 'var(--text)' }}>{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </form>
        )}

        {/* MY SOLUTIONS */}
        {tab === 'my-solutions' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text3)', letterSpacing: 1 }}>
                {mySolutions.length} SOLUTIONS
              </div>
              <button onClick={() => setTab('upload')} style={{ padding: '7px 16px', background: 'var(--green-dim)', border: '1px solid rgba(0,229,160,0.2)', borderRadius: 8, color: 'var(--green)', fontFamily: 'var(--mono)', fontSize: 10, cursor: 'pointer', letterSpacing: 1 }}>
                + NEW SOLUTION
              </button>
            </div>

            {mySolutions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text3)' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📤</div>
                <div style={{ fontFamily: 'var(--display)', fontSize: 20, letterSpacing: 2, marginBottom: 8 }}>NO SOLUTIONS YET</div>
                <div style={{ fontSize: 12, marginBottom: 20 }}>Upload your first first aid solution!</div>
                <button onClick={() => setTab('upload')} className="submit-cta" style={{ width: 'auto', padding: '11px 32px' }}>UPLOAD NOW →</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {mySolutions.map(sol => {
                  const st = STATUS_STYLE[sol.status] || STATUS_STYLE.pending;
                  return (
                    <div key={sol._id} style={{ background: 'var(--surface2)', border: '1px solid var(--line2)', borderRadius: 'var(--r)', padding: 16, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                      <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--panel)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                        {sol.mediaType === 'video' ? '🎬' : sol.mediaType === 'pdf' ? '📄' : '📖'}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>{sol.title}</div>
                          <span style={{ fontFamily: 'var(--mono)', fontSize: 8, padding: '2px 7px', borderRadius: 3, background: st.bg, color: st.color, border: `1px solid ${st.border}` }}>{st.label}</span>
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 6 }}>
                          {sol.condition} · {sol.language?.toUpperCase()} · {sol.region || 'Global'}
                        </div>
                        <div style={{ display: 'flex', gap: 14, fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>
                          <span>👁 {sol.views || 0} views</span>
                          <span>❤️ {sol.likesCount || 0} likes</span>
                          <span>📅 {new Date(sol.createdAt).toLocaleDateString()}</span>
                        </div>
                        {sol.reviewNote && (
                          <div style={{ marginTop: 8, padding: '6px 10px', background: sol.status === 'rejected' ? 'var(--red-dim)' : 'var(--green-dim)', border: `1px solid ${sol.status === 'rejected' ? 'rgba(255,59,92,0.2)' : 'rgba(0,229,160,0.2)'}`, borderRadius: 6, fontSize: 11, color: sol.status === 'rejected' ? 'var(--red)' : 'var(--green)' }}>
                            <strong>Review Note:</strong> {sol.reviewNote}
                          </div>
                        )}
                      </div>
                      <button onClick={() => handleDelete(sol._id)} title="Delete solution"
                        style={{ background: 'var(--red-dim)', border: '1px solid rgba(255,59,92,0.2)', color: 'var(--red)', borderRadius: 8, width: 34, height: 34, cursor: 'pointer', flexShrink: 0, fontSize: 14 }}>🗑</button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
