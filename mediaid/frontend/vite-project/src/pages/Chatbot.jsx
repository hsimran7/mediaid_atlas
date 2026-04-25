import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Sparkles, AlertTriangle, ShieldCheck, 
  BookOpen, Video, FileText, Link2, PlusCircle,
  MessageCircle, Bot, HeartPulse, User, Sprout
} from 'lucide-react';
import TypingIndicator from '../components/TypingIndicator';
import '../styles/chat.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function ts() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function VerifiedSolutionCard({ sol }) {
  const { t } = useTranslation();
  const Icon = sol.mediaType === 'video' ? Video : sol.mediaType === 'pdf' ? FileText : BookOpen;
  const color = sol.mediaType === 'video' ? 'var(--sky)' : sol.mediaType === 'pdf' ? 'var(--red)' : 'var(--primary)';
  const url = sol.externalUrl || sol.fileUrl;

  return (
    <motion.a
      href={url || '#'} target="_blank" rel="noopener noreferrer"
      whileHover={{ y: -4, scale: 1.02 }}
      style={{ 
        textDecoration: 'none', background: 'var(--panel)', borderRadius: 20, 
        border: '1px solid var(--line2)', display: 'block', padding: 20,
        boxShadow: 'var(--shadow)', marginBottom: 12
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ 
          background: color + '10', color: color, padding: '6px 12px', 
          borderRadius: 10, fontSize: 10, fontWeight: 800, fontFamily: 'var(--mono)',
          display: 'flex', alignItems: 'center', gap: 6
        }}>
          <Icon size={14} strokeWidth={2.5} /> {sol.mediaType?.toUpperCase()}
        </div>
        <div style={{ 
          display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, 
          fontWeight: 800, color: 'var(--primary)', letterSpacing: 0.5 
        }}>
          <ShieldCheck size={14} strokeWidth={2.5} /> {t('common.verified').toUpperCase()}
        </div>
      </div>
      <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--pine)', marginBottom: 6 }}>{sol.title}</div>
      <div style={{ fontSize: 12, color: 'var(--text3)', opacity: 0.8 }}>{sol.source && `Source: ${sol.source}`}</div>
    </motion.a>
  );
}

function AIResponseBubble({ html, solutions }) {
  const { t } = useTranslation();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <motion.div 
        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
        style={{ 
          background: 'var(--panel)', color: 'var(--text)', border: '1.5px solid var(--line)', 
          borderRadius: '4px 28px 28px 28px', padding: 24, boxShadow: 'var(--shadow)',
          fontSize: 16, lineHeight: 1.7, letterSpacing: '-0.01em'
        }} 
        dangerouslySetInnerHTML={{ __html: formatMarkdown(html) }} 
      />
      
      {solutions && solutions.length > 0 && (
        <div style={{ paddingLeft: 20, borderLeft: '3px solid var(--mist)', marginTop: 8 }}>
          <div style={{ 
            fontSize: 11, fontWeight: 800, color: 'var(--text4)', 
            marginBottom: 16, letterSpacing: 2, display: 'flex', alignItems: 'center', gap: 8
          }}>
            <Sparkles size={14} strokeWidth={2.5} /> {t('nav.resources').toUpperCase()}
          </div>
          <div style={{ display: 'grid', gap: 4 }}>
            {solutions.map((sol, i) => <VerifiedSolutionCard key={sol._id || i} sol={sol} />)}
          </div>
        </div>
      )}
    </div>
  );
}

function formatMarkdown(text) {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--pine);font-weight:700">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^### (.+)$/gm, '<h4 style="margin:24px 0 12px;font-size:18px;color:var(--pine);font-family:var(--display);font-weight:800">$1</h4>')
    .replace(/^## (.+)$/gm, '<h3 style="margin:28px 0 14px;font-size:22px;color:var(--pine);font-family:var(--display);font-weight:800">$1</h3>')
    .replace(/^(\d+)\. (.+)$/gm, '<div style="display:flex;gap:16px;margin:12px 0"><span style="color:var(--forest);font-family:var(--mono);font-size:12px;font-weight:800;background:var(--mist);border-radius:10px;width:32px;height:32px;display:flex;align-items:center;justify-content:center;flex-shrink:0">$1</span><span style="font-size:15px;line-height:1.6">$2</span></div>')
    .replace(/^- (.+)$/gm, '<div style="display:flex;gap:12px;margin:10px 0"><span style="color:var(--sage);margin-top:6px">•</span><span style="font-size:15px;line-height:1.6">$1</span></div>')
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>');
}

export default function Chatbot({ externalInput, onClearExternalInput, showToast }) {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [welcomeGone, setWelcomeGone] = useState(false);
  const feedRef = useRef(null);

  useEffect(() => {
    if (externalInput) { setInput(externalInput); onClearExternalInput(); }
  }, [externalInput]);

  useEffect(() => {
    if (feedRef.current) feedRef.current.scrollTop = feedRef.current.scrollHeight;
  }, [messages, typing]);

  async function callChatAPI(userMessage) {
    const token = localStorage.getItem('mediaid_token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        message: userMessage,
        history: messages.slice(-6).map(m => ({ role: m.role === 'bot' ? 'assistant' : 'user', content: m.html })),
        language: i18n.language,
      }),
    });
    if (!res.ok) throw new Error('Chat error');
    return res.json();
  }

  async function sendMessage(msg) {
    const text = (msg || input).trim();
    if (!text) return;
    setInput('');
    setWelcomeGone(true);
    
    const userMsg = { role: 'user', html: text, time: ts() };
    setMessages(prev => [...prev, userMsg]);
    setTyping(true);

    try {
      const data = await callChatAPI(text);
      setTyping(false);
      setMessages(prev => [...prev, {
        role: 'bot',
        html: data.response,
        verifiedSolutions: data.verifiedSolutions || [],
        time: ts(),
      }]);
    } catch (err) {
      setTyping(false);
      setMessages(prev => [...prev, { role: 'bot', html: t('common.error_ai'), time: ts() }]);
    }
  }

  const quickTags = [
    { label: t('chat.tags.burns'), query: 'How to treat burns', Icon: Sparkles },
    { label: t('chat.tags.cpr'), query: 'Steps for CPR', Icon: HeartPulse },
    { label: t('chat.tags.choking'), query: 'First aid for choking', Icon: AlertTriangle },
    { label: t('chat.tags.bleeding'), query: 'How to stop bleeding', Icon: ShieldCheck }
  ];

  return (
    <div className="page active" style={{ background: 'transparent', height: '100%', display: 'flex', flexDirection: 'column' }}>
      
      {/* Messages Feed */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '40px 48px' }} ref={feedRef}>
        
        {!welcomeGone && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: 'center', padding: '100px 20px', maxWidth: 740, margin: '0 auto' }}
          >
            <div style={{ 
              width: 100, height: 100, background: 'var(--primary)', borderRadius: 32, 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              margin: '0 auto 40px', boxShadow: 'var(--shadow-deep)', border: '1.5px solid var(--line)'
            }}>
              <Sprout size={56} strokeWidth={1.5} color="#fff" />
            </div>
            <h1 style={{ fontFamily: 'var(--serif)', fontSize: 64, fontWeight: 800, color: 'var(--pine)', marginBottom: 20, letterSpacing: -2 }}>{t('nav.chatbot')}</h1>
            <p style={{ fontSize: 20, color: 'var(--text3)', lineHeight: 1.6, marginBottom: 64, fontWeight: 500, maxWidth: 600, margin: '0 auto 64px' }}>
              {t('chat.welcome_desc')}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
              {quickTags.map((tag, i) => (
                <motion.button 
                  key={i} whileHover={{ y: -5, borderColor: 'var(--primary)' }}
                  onClick={() => sendMessage(tag.query)} 
                  style={{ 
                    padding: '28px 24px', background: 'var(--panel)', border: '1.5px solid var(--line2)', 
                    borderRadius: 28, cursor: 'pointer', transition: 'all 0.3s var(--ease)',
                    boxShadow: 'var(--shadow)', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 16
                  }}
                >
                  <div style={{ color: 'var(--primary)' }}><tag.Icon size={28} strokeWidth={2} /></div>
                  <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--pine)', letterSpacing: -0.2 }}>{tag.label}</div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        <div style={{ maxWidth: 880, margin: '0 auto', width: '100%' }}>
          <AnimatePresence>
            {messages.map((msg, i) => (
              <div key={i} style={{ 
                display: 'flex', gap: 20, marginBottom: 40, 
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                alignItems: 'flex-start'
              }}>
                <div style={{ 
                  width: 48, height: 48, borderRadius: 16, 
                  background: msg.role === 'bot' ? 'var(--mist)' : 'var(--primary)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: 'var(--shadow)', flexShrink: 0, border: '1px solid var(--line)'
                }}>
                  {msg.role === 'bot' ? <Bot size={24} strokeWidth={2} color="var(--primary)" /> : (user?.avatar || <User size={24} />)}
                </div>
                <div style={{ maxWidth: '80%' }}>
                  {msg.role === 'bot' ? (
                    <AIResponseBubble html={msg.html} solutions={msg.verifiedSolutions} />
                  ) : (
                    <div style={{ 
                      background: 'var(--primary)', color: '#fff', padding: '20px 28px', 
                      borderRadius: '28px 4px 28px 28px', fontWeight: 600, fontSize: 16,
                      boxShadow: '0 12px 24px var(--primary-glow)', letterSpacing: -0.1
                    }}>
                      {msg.html}
                    </div>
                  )}
                  <div style={{ 
                    fontSize: 10, color: 'var(--text4)', marginTop: 10, 
                    textAlign: msg.role === 'user' ? 'right' : 'left',
                    fontFamily: 'var(--mono)', fontWeight: 800, letterSpacing: 1
                  }}>{msg.time}</div>
                </div>
              </div>
            ))}
          </AnimatePresence>
          {typing && <TypingIndicator />}
        </div>
      </div>

      {/* Modern Input Zone */}
      <div style={{ 
        padding: '32px 48px', background: 'var(--surface2)', 
        backdropFilter: 'var(--glass)', borderTop: '1.5px solid var(--line2)' 
      }}>
        <div style={{ 
          maxWidth: 880, margin: '0 auto', display: 'flex', gap: 16,
          background: 'var(--panel)', borderRadius: 28, padding: 10,
          border: '1.5px solid var(--line2)', boxShadow: 'var(--shadow-deep)',
          transition: 'border-color 0.3s', position: 'relative'
        }} id="chat-input-container">
          <textarea
            style={{ 
              flex: 1, background: 'transparent', border: 'none', outline: 'none', 
              padding: '16px 20px', fontSize: 16, resize: 'none', color: 'var(--text)',
              fontFamily: 'var(--sans)', maxHeight: 160, fontWeight: 500,
              lineHeight: 1.5
            }}
            placeholder={t('common.search', 'Ask nature about healing...')}
            rows={1}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            onFocus={() => document.getElementById('chat-input-container').style.borderColor = 'var(--primary)'}
            onBlur={() => document.getElementById('chat-input-container').style.borderColor = 'var(--line2)'}
          />
          <button 
            onClick={() => sendMessage()}
            style={{ 
              width: 60, height: 60, borderRadius: 20, background: 'var(--primary)', 
              color: '#fff', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.3s var(--ease)', flexShrink: 0
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--pine)'}
          >
            <Send size={24} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
