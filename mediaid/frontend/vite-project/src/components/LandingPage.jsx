import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Trees, Cloud, Share2, ArrowRight, LogIn, UserPlus, HeartPulse, Sparkles, Sprout } from 'lucide-react';

const fUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 1, ease: [0.23, 1, 0.32, 1] }
  })
};

export default function LandingPage({ onOpenAuth, onNavigatePublic }) {
  const { t } = useTranslation();

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', overflowX: 'hidden' }}>
      <div className="grid-bg" />

      {/* HERO SECTION */}
      <section style={{ 
        position: 'relative', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '0 40px', overflow: 'hidden'
      }}>
        {/* Background Image with Overlay */}
        <div style={{ 
          position: 'absolute', inset: 0, 
          backgroundImage: 'url("https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")', // Natural succulent/plant
          backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 1
        }} />
        <div style={{ 
          position: 'absolute', inset: 0, 
          background: 'linear-gradient(to bottom, rgba(250,249,246,0.2) 0%, rgba(250,249,246,0.9) 80%, var(--bg) 100%)',
          zIndex: 2 
        }} />

        <div style={{ position: 'relative', zIndex: 10, maxWidth: 1000, width: '100%', textAlign: 'center' }}>
          <motion.div 
            initial="hidden" animate="visible" custom={0} variants={fUp}
            style={{ 
              display: 'inline-flex', alignItems: 'center', gap: 12, padding: '12px 24px', 
              background: 'var(--surface)', backdropFilter: 'var(--glass)', borderRadius: 100, 
              border: '1px solid var(--line2)', marginBottom: 40, boxShadow: 'var(--shadow)'
            }}
          >
            <Sprout size={18} strokeWidth={2.5} color="var(--forest)" />
            <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--pine)', fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase' }}>
              {t('landing.tagline', 'Natural Wisdom for Modern Care')}
            </span>
          </motion.div>

          <motion.h1 
            initial="hidden" animate="visible" custom={1} variants={fUp}
            style={{ 
              fontFamily: 'var(--serif)', fontSize: 'clamp(64px, 12vw, 120px)', fontWeight: 900,
              color: 'var(--pine)', lineHeight: 0.85, letterSpacing: -5, marginBottom: 40,
            }}
          >
            {t('app_name')}
          </motion.h1>

          <motion.p 
            initial="hidden" animate="visible" custom={2} variants={fUp}
            style={{ 
              fontSize: 22, color: 'var(--text2)', lineHeight: 1.5, marginBottom: 64, 
              maxWidth: 640, margin: '0 auto 64px', fontWeight: 500, letterSpacing: '-0.02em',
              opacity: 0.9
            }}
          >
            {t('chat.welcome_desc')}
          </motion.p>

          <motion.div 
            initial="hidden" animate="visible" custom={3} variants={fUp}
            style={{ display: 'flex', gap: 24, justifyContent: 'center' }}
          >
            <button className="btn-primary" onClick={() => onOpenAuth('register')} style={{ padding: '24px 72px', fontSize: 20 }}>
              <UserPlus size={22} strokeWidth={2.5} />
              {t('common.register').toUpperCase()}
            </button>
            
            <button className="btn-secondary" onClick={() => onOpenAuth('login')} style={{ padding: '24px 72px', fontSize: 20, background: 'rgba(255,255,255,0.4)', backdropFilter: 'var(--glass)' }}>
              <LogIn size={22} strokeWidth={2.5} />
              {t('common.login').toUpperCase()}
            </button>
          </motion.div>
        </div>
      </section>

      {/* FEATURE SECTIONS */}
      <section style={{ padding: '160px 40px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 48 }}>
           {[
             { id: 'ai-medi-guide', Icon: Trees, title: t('nav.chatbot'), desc: t('landing.f1'), color: 'var(--moss)', img: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
             { id: 'knowledge-hub', Icon: Cloud, title: t('nav.resources'), desc: t('landing.f2'), color: 'var(--sky)', img: 'https://images.unsplash.com/photo-1501183638710-841dd1904471?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
             { id: 'remedy-guide', Icon: Share2, title: t('nav.contribute'), desc: t('landing.f3'), color: 'var(--clay)', img: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
           ].map((f, i) => (
             <motion.div 
               key={f.title} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fUp}
               className="glass-panel"
               style={{ 
                 padding: 0, overflow: 'hidden', textAlign: 'left', transition: 'all 0.6s var(--ease)',
                 display: 'flex', flexDirection: 'column', cursor: 'pointer'
               }}
               onClick={() => onNavigatePublic?.(f.id)}
               onMouseEnter={e => {
                 e.currentTarget.style.transform = 'translateY(-16px)';
                 e.currentTarget.style.borderColor = 'var(--primary)';
               }}
               onMouseLeave={e => {
                 e.currentTarget.style.transform = 'translateY(0)';
                 e.currentTarget.style.borderColor = 'var(--line2)';
               }}
             >
               <div style={{ height: 240, overflow: 'hidden', position: 'relative' }}>
                 <img src={f.img} alt={f.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 1s var(--ease)' }} />
                 <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.4))' }} />
                 <div style={{ position: 'absolute', bottom: 20, left: 24, background: 'rgba(255,255,255,0.9)', padding: '8px 16px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
                   <f.Icon size={18} strokeWidth={2.5} color={f.color} />
                   <span style={{ fontWeight: 800, fontSize: 13, color: 'var(--pine)', fontFamily: 'var(--display)' }}>{f.title.toUpperCase()}</span>
                 </div>
               </div>
               <div style={{ padding: 40 }}>
                 <p style={{ fontSize: 16, color: 'var(--text2)', lineHeight: 1.6, fontWeight: 500, marginBottom: 24 }}>{f.desc}</p>
                 <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--primary)', fontWeight: 800, fontSize: 12, letterSpacing: 1 }}>
                   EXPLORE <ArrowRight size={14} strokeWidth={3} />
                 </div>
               </div>
             </motion.div>
           ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid var(--line)', marginTop: 80 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, background: 'var(--primary)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <HeartPulse color="#fff" size={20} />
              </div>
              <span style={{ fontFamily: 'var(--display)', fontSize: 24, fontWeight: 800, color: 'var(--pine)', letterSpacing: 1 }}>MEDIAID</span>
            </div>
            <p style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text4)', letterSpacing: 2 }}>
              BY HARSIMRAN | 3RD YEAR STUDENT
            </p>
          </div>
        </div>
      </footer>

      <style>{`
        img:hover { transform: scale(1.05); }
      `}</style>
    </div>
  );
}
