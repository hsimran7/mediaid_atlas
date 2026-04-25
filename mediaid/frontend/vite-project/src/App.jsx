import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { situationsDB, langCodes, voiceGreetings } from './data/firstAidData';
import { speak, startListening, stopListening, voiceSupported } from './services/voiceService';
import { useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import ChatPage from './pages/Chatbot';
import Resources from './pages/Resources';
import Contribute from './pages/Contribute';
import Dashboard from './pages/Dashboard';
import SeekerDashboard from './pages/SeekerDashboard';
import Moderation from './pages/Moderation';
import UserManagement from './pages/UserManagement';
import AuthModal from './components/AuthModal';
import LandingPage from './components/LandingPage';
import PublicPreviewPage from './pages/PublicPreviewPage';
import { motion, AnimatePresence } from 'framer-motion';
import './styles/app.css';
import './App.css';

// ── Landing page shown before login

export default function App() {
  const { user, loading: authLoading } = useAuth();
  const { t, i18n } = useTranslation();

  const [currentPage, setCurrentPage] = useState('chat');
  const [collapsed, setCollapsed] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: '', type: 'success' });
  const [flyout, setFlyout] = useState({ open: false, key: null });
  const [flyoutTab, setFlyoutTab] = useState('steps');
  const [emgOpen, setEmgOpen] = useState(false);
  const [chatExternalInput, setChatExternalInput] = useState('');
  const [authModal, setAuthModal] = useState({ open: false, tab: 'login' });
  const [publicPage, setPublicPage] = useState('landing');

  // When user logs in — redirect to appropriate page based on role
  useEffect(() => {
    if (user) {
      if (user.role === 'contributor' || user.role === 'admin') {
        setCurrentPage('dashboard');
      } else {
        setCurrentPage('my-dashboard');
      }
    } else {
      // Handle public routing before login
      const path = window.location.pathname;
      if (path.startsWith('/preview/ai-medi-guide')) setPublicPage('ai-medi-guide');
      else if (path.startsWith('/preview/knowledge-hub')) setPublicPage('knowledge-hub');
      else if (path.startsWith('/preview/remedy-guide')) setPublicPage('remedy-guide');
      else setPublicPage('landing');
    }
  }, [user?.role, user?._id]);

  function showToast(msg, type = 'success') {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3500);
  }

  function openAuthModal(tab = 'login') { setAuthModal({ open: true, tab }); }
  function closeAuthModal() { setAuthModal({ open: false, tab: 'login' }); }

  function navigate(page) { setCurrentPage(page); }
  function openFlyout(key) { setFlyout({ open: true, key }); setFlyoutTab('steps'); }
  function closeFlyout() { setFlyout({ open: false, key: null }); }

  function navigatePublic(page) {
    if (page === 'landing') window.history.pushState({}, '', '/');
    else window.history.pushState({}, '', `/preview/${page}`);
    setPublicPage(page);
  }

  function toggleVoice() {
    const currentLang = i18n.language;
    if (!voiceSupported) { showToast('Voice not supported in this browser', 'error'); return; }
    if (isListening) {
      stopListening(); setIsListening(false);
    } else {
      speak(voiceGreetings[currentLang] || voiceGreetings.en, langCodes[currentLang] || 'en-US');
      const started = startListening(
        langCodes[currentLang] || 'en-US',
        (transcript) => { setChatExternalInput(transcript); setCurrentPage('chat'); setIsListening(false); },
        (err) => { if (err !== 'no-speech') showToast('Voice error: ' + err, 'error'); setIsListening(false); },
        () => setIsListening(false)
      );
      if (started) setIsListening(true);
      else showToast('Failed to start voice recognition', 'error');
    }
  }

  const sit = flyout.key ? situationsDB[flyout.key] : null;
  const sevLabel = { critical: '⬤ CRITICAL', moderate: '⬤ MODERATE', mild: '⬤ MILD' };

  // ── Show loading spinner while checking auth session
  if (authLoading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', flexDirection: 'column', gap: 12 }}>
        <div style={{ fontSize: 40 }}>🩺</div>
        <div style={{ fontFamily: 'var(--mono)', color: 'var(--cyan)', fontSize: 12, letterSpacing: 3 }}>{t('common.loading').toUpperCase()}</div>
      </div>
    );
  }

  // ── Show landing page if not logged in
  if (!user) {
    return (
      <>
        {publicPage === 'landing' ? (
          <LandingPage onOpenAuth={openAuthModal} onNavigatePublic={navigatePublic} />
        ) : (
          <PublicPreviewPage page={publicPage} onBack={() => navigatePublic('landing')} onOpenAuth={openAuthModal} />
        )}
        {authModal.open && (
          <AuthModal onClose={closeAuthModal} defaultTab={authModal.tab} showToast={showToast} />
        )}
        <div className={`toast-bar ${toast.type}${toast.show ? ' show' : ''}`}>
          <span className="toast-ico">{toast.type === 'success' ? '✓' : '⚠'}</span>
          <span>{toast.msg}</span>
        </div>
      </>
    );
  }

  // ── Main app (logged in)
  return (
    <>
      <div className="grid-bg" />

      {/* AUTH MODAL */}
      {authModal.open && (
        <AuthModal onClose={closeAuthModal} defaultTab={authModal.tab} showToast={showToast} />
      )}

      {/* TOAST */}
      <div className={`toast-bar ${toast.type}${toast.show ? ' show' : ''}`}>
        <span className="toast-ico">{toast.type === 'success' ? '✓' : '⚠'}</span>
        <span>{toast.msg}</span>
      </div>

      {/* FLYOUT PANEL */}
      {flyout.open && sit && (
        <div className="flyout-overlay open" id="flyoutOverlay" onClick={e => { if (e.target.id === 'flyoutOverlay') closeFlyout(); }}>
          <div className="flyout" id="flyoutPanel">
            <div className="flyout-head">
              <div className="flyout-head-row1">
                <div className="flyout-emoji-box" style={{ background: sit.color + '20', border: '1px solid ' + sit.color + '40' }}>
                  {sit.emoji}
                </div>
                <div className="flyout-meta">
                  <div className="flyout-title">{sit.title}</div>
                  <div className="flyout-desc">{sit.desc}</div>
                  <div className="flyout-sev-row">
                    <span className={`sev-tag ${sit.severity}`}>{sevLabel[sit.severity]}</span>
                  </div>
                </div>
                <button className="flyout-close" onClick={closeFlyout}>✕</button>
              </div>
            </div>
            <div className="flyout-tabs">
              {['steps', 'resources', 'remedies', 'dodont'].map(tab => (
                <div key={tab} className={`flyout-tab${flyoutTab === tab ? ' active' : ''}`} onClick={() => setFlyoutTab(tab)}>
                  {tab === 'steps' ? 'PROTOCOL' : tab === 'dodont' ? "DO / DON'T" : tab.toUpperCase()}
                </div>
              ))}
            </div>
            <div className="flyout-body">
              {flyoutTab === 'steps' && (
                <>
                  {sit.severity === 'critical' && (
                    <div className="crit-alert">
                      <span className="crit-alert-ico">⚡</span>
                      <div><strong>CRITICAL EMERGENCY</strong> — Call emergency services immediately.</div>
                    </div>
                  )}
                  {sit.steps.map((s, i) => (
                    <div className="f-step" key={i}>
                      <div className="f-step-n">{i + 1}</div>
                      <div className="f-step-txt">{s}</div>
                    </div>
                  ))}
                </>
              )}
              {flyoutTab === 'resources' && (
                <>
                  {sit.resources.map((r, i) => (
                    <a className="f-resource" href={r.url} target="_blank" rel="noopener noreferrer" key={i}>
                      <div className="f-resource-inner">
                        <div className={`f-res-ico ${r.type}`}>{r.icon}</div>
                        <div className="f-res-info">
                          <div className="f-res-name">{r.name}</div>
                          <div className="f-res-desc">{r.desc}</div>
                          <div className="f-res-meta">{r.meta}</div>
                        </div>
                        <span className="f-res-arrow">→</span>
                      </div>
                    </a>
                  ))}
                  <div style={{ marginTop: 14, padding: 12, background: 'var(--surface2)', borderRadius: 'var(--r2)', border: '1px solid var(--line)' }}>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--text3)', letterSpacing: 1, marginBottom: 8 }}>💬 ASK AI FOR MORE</div>
                    <button style={{ width: '100%', padding: 8, background: 'var(--red)', border: 'none', color: 'white', borderRadius: 'var(--r2)', fontFamily: 'var(--display)', fontSize: 14, letterSpacing: 2, cursor: 'pointer' }}
                      onClick={() => { closeFlyout(); navigate('chat'); setChatExternalInput(sit.title + ' resources and videos'); }}>
                      OPEN IN AI CHAT →
                    </button>
                  </div>
                </>
              )}
              {flyoutTab === 'remedies' && (
                <>
                  <div style={{ background: 'var(--green-dim)', border: '1px solid rgba(0,229,160,0.15)', borderRadius: 'var(--r2)', padding: 12, marginBottom: 14, fontSize: 11, color: 'var(--green)', fontFamily: 'var(--mono)', letterSpacing: '0.5px' }}>
                    ⚠ SUPPLEMENT ONLY — These do not replace emergency medical care
                  </div>
                  <div>{(sit.remedies || []).map((r, i) => <span className="f-remedy-pill" key={i}>🌿 {r}</span>)}</div>
                </>
              )}
              {flyoutTab === 'dodont' && (
                <div className="dodont-grid">
                  <div className="do-panel">
                    <div className="dd-head">✓ DO</div>
                    <ul className="dd-list">{(sit.dos || []).map((d, i) => <li key={i}>{d}</li>)}</ul>
                  </div>
                  <div className="dont-panel">
                    <div className="dd-head">✗ DON'T</div>
                    <ul className="dd-list">{(sit.donts || []).map((d, i) => <li key={i}>{d}</li>)}</ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* EMERGENCY FAB — bottom LEFT so it never overlaps chat */}
      <div className={`emg-panel${emgOpen ? ' open' : ''}`}>
        <div className="emg-title">⚡ Emergency Numbers</div>
        {[['🇵🇰 Pakistan','1122'],['🇮🇳 India','108'],['🇺🇸 USA','911'],['🇬🇧 UK','999'],['🌍 International','112']].map(([country, num]) => (
          <div className="emg-row" key={country}>{country} <span className="emg-num">{num}</span></div>
        ))}
      </div>
      <button className="emg-fab" onClick={() => setEmgOpen(o => !o)} title="Emergency Numbers">🚨</button>

      {/* APP SHELL */}
      <div className={`app role-${user.role || 'seeker'}`}>
        <Sidebar
          collapsed={collapsed}
          currentPage={currentPage}
          onNavigate={navigate}
          onOpenFlyout={openFlyout}
          onOpenAuth={openAuthModal}
          user={user}
        />
        <div className="main">
          <Navbar
            currentPage={currentPage}
            onToggleSidebar={() => setCollapsed(c => !c)}
            isListening={isListening}
            onToggleVoice={toggleVoice}
            onNavigate={navigate}
            onOpenAuth={openAuthModal}
          />
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1 }}>
              {currentPage === 'chat' && (
                <ChatPage externalInput={chatExternalInput}
                  onClearExternalInput={() => setChatExternalInput('')} showToast={showToast} />
              )}
              {currentPage === 'resources' && <Resources showToast={showToast} />}
              {currentPage === 'contribute' && (
                <Contribute showToast={showToast} onShowAuth={openAuthModal} />
              )}
              {currentPage === 'dashboard' && <Dashboard onNavigate={navigate} />}
              {currentPage === 'moderation' && <Moderation showToast={showToast} />}
              {currentPage === 'users' && <UserManagement showToast={showToast} />}
              {currentPage === 'my-dashboard' && (
                <SeekerDashboard showToast={showToast} currentLang={i18n.language} onNavigate={navigate} />
              )}
            </div>
            
            {/* Global Footer */}
            <footer>
              BY HARSIMRAN | 3RD YEAR STUDENT
            </footer>
          </div>
        </div>
      </div>
    </>
  );
}
