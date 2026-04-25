import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowLeft, LogIn, UserPlus, ShieldAlert, Trees, Cloud, Share2 } from 'lucide-react';

const contentMap = {
  'ai-medi-guide': {
    title: 'AI Medi Guide',
    icon: Trees,
    color: 'var(--moss)',
    desc: 'An intelligent first aid assistant that provides immediate, step-by-step guidance for emergencies in your preferred language.',
    features: [
      'Instant AI responses for critical situations like burns, CPR, and choking.',
      'Cross-references the database to provide verified clinical remedies first.',
      'Supports multiple languages including English, Hindi, Urdu, and Arabic.',
      'Accessible via voice commands for hands-free assistance.'
    ]
  },
  'knowledge-hub': {
    title: 'Knowledge Hub',
    icon: Cloud,
    color: 'var(--sky)',
    desc: 'A comprehensive, verified directory of natural remedies and clinical first-aid guides submitted by experts.',
    features: [
      'Search through hundreds of verified remedies by condition or keyword.',
      'Filter content by Video, PDF, or interactive Digital Guide.',
      'View community engagement including saves, likes, and expert comments.',
      'All content is rigorously peer-reviewed by clinical moderators.'
    ]
  },
  'remedy-guide': {
    title: 'Remedy Contribution',
    icon: Share2,
    color: 'var(--clay)',
    desc: 'Join our community of practitioners and contributors by sharing your medical expertise and proven remedies.',
    features: [
      'Upload detailed protocols including required steps, symptoms, and precautions.',
      'Attach rich media (Videos, Images, PDFs) directly to your submissions.',
      'Track your submission approval status via your personalized dashboard.',
      'Help thousands of seekers worldwide with your verified knowledge.'
    ]
  }
};

export default function PublicPreviewPage({ page, onBack, onOpenAuth }) {
  const { t } = useTranslation();
  
  // Fallback to chatbot if unknown
  const content = contentMap[page] || contentMap['ai-medi-guide'];
  const Icon = content.icon;

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="grid-bg" />
      
      {/* Simple Header */}
      <header style={{ padding: '24px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--line)', background: 'var(--surface2)', backdropFilter: 'var(--glass)', position: 'sticky', top: 0, zIndex: 100 }}>
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', color: 'var(--text3)', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'var(--sans)' }}>
          <ArrowLeft size={18} /> BACK TO HOME
        </button>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => onOpenAuth('login')} style={{ padding: '10px 20px', background: 'transparent', border: '1px solid var(--line2)', borderRadius: 12, color: 'var(--pine)', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
            <LogIn size={16} /> LOGIN
          </button>
          <button onClick={() => onOpenAuth('register')} style={{ padding: '10px 20px', background: 'var(--primary)', border: 'none', borderRadius: 12, color: '#fff', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 12px var(--primary-glow)' }}>
            <UserPlus size={16} /> REGISTER
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '80px 40px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ maxWidth: 800, width: '100%' }}>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 48, textAlign: 'center' }}>
            <div style={{ width: 80, height: 80, background: 'var(--panel)', borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', border: '1.5px solid var(--line2)', boxShadow: 'var(--shadow)' }}>
              <Icon size={40} color={content.color} strokeWidth={1.5} />
            </div>
            <div style={{ display: 'inline-block', background: 'var(--mist)', color: 'var(--primary)', padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 800, letterSpacing: 2, marginBottom: 16 }}>
              FEATURE PREVIEW
            </div>
            <h1 style={{ fontFamily: 'var(--serif)', fontSize: 56, fontWeight: 900, color: 'var(--pine)', marginBottom: 20, letterSpacing: -2 }}>
              {content.title}
            </h1>
            <p style={{ fontSize: 18, color: 'var(--text2)', lineHeight: 1.6, maxWidth: 600, margin: '0 auto' }}>
              {content.desc}
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel" style={{ padding: 40, marginBottom: 40 }}>
            <h3 style={{ fontFamily: 'var(--display)', fontSize: 20, color: 'var(--pine)', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
              <ShieldAlert size={20} color="var(--primary)" /> WHAT TO EXPECT
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {content.features.map((feat, i) => (
                <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--mist)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, flexShrink: 0, marginTop: 2 }}>
                    {i + 1}
                  </div>
                  <div style={{ fontSize: 16, color: 'var(--text3)', lineHeight: 1.5 }}>
                    {feat}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ background: 'var(--pine)', padding: 48, borderRadius: 32, textAlign: 'center', color: '#fff', boxShadow: 'var(--shadow-deep)' }}>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: 32, marginBottom: 16 }}>Ready to access {content.title}?</h2>
            <p style={{ fontSize: 16, opacity: 0.8, marginBottom: 32, maxWidth: 500, margin: '0 auto 32px' }}>
              Create an account or log in to unlock full platform functionality, save remedies, and access your personalized dashboard.
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
              <button onClick={() => onOpenAuth('register')} style={{ padding: '16px 40px', background: 'var(--primary)', border: 'none', borderRadius: 100, color: '#fff', fontWeight: 800, fontSize: 16, cursor: 'pointer', boxShadow: '0 8px 24px rgba(255,107,107,0.4)' }}>
                CREATE FREE ACCOUNT
              </button>
            </div>
          </motion.div>

        </div>
      </main>
    </div>
  );
}
