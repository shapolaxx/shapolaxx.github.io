'use client'
import { useT } from '@/lib/i18n'
import Reveal from '@/components/ui/Reveal'
import ShaderBackground from '@/components/ui/ShaderBackground'
import CloudsBackground from '@/components/ui/CloudsBackground'

export default function Hero() {
  const { t } = useT()

  const STATS = [
    { n: t('hero.stat1.n'), l: t('hero.stat1.l'), color: '#6BA3FF' },
    { n: t('hero.stat2.n'), l: t('hero.stat2.l'), color: '#3DD68C' },
    { n: t('hero.stat3.n'), l: t('hero.stat3.l'), color: '#A78BFA' },
    { n: t('hero.stat4.n'), l: t('hero.stat4.l'), color: '#9DC4FF' },
  ]

  return (
    <>
      <section style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        paddingTop: 96,
        paddingBottom: 96,
      }}>
        <div aria-hidden className="shader-dark" style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          WebkitMaskImage: 'linear-gradient(180deg, #000 55%, rgba(0,0,0,.6) 80%, transparent 100%)',
          maskImage: 'linear-gradient(180deg, #000 55%, rgba(0,0,0,.6) 80%, transparent 100%)',
        }}>
          <ShaderBackground />
        </div>
        <div aria-hidden className="shader-light" style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          WebkitMaskImage: 'linear-gradient(180deg, #000 0%, #000 70%, rgba(0,0,0,.55) 88%, transparent 100%)',
          maskImage: 'linear-gradient(180deg, #000 0%, #000 70%, rgba(0,0,0,.55) 88%, transparent 100%)',
        }}>
          <CloudsBackground />
        </div>
        <div aria-hidden className="hero-vignette-dark" style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(6,10,20,.45) 100%)',
        }} />
        <div aria-hidden className="hero-bottom-fade" style={{
          position: 'absolute', left: 0, right: 0, bottom: 0, height: 260,
          background: 'linear-gradient(180deg, transparent 0%, rgba(var(--bg-rgb, 6, 10, 20), .4) 55%, var(--bg) 100%)',
          pointerEvents: 'none',
        }} />

        <div className="ph-wrap" style={{
          position: 'relative', zIndex: 1,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', textAlign: 'center',
          gap: 32, maxWidth: 1280,
        }}>
          <Reveal>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              background: 'rgba(var(--accent-rgb), 0.10)',
              border: '1px solid rgba(var(--accent-rgb), 0.28)',
              padding: '8px 18px', borderRadius: 100,
              fontSize: 12, fontWeight: 500,
              color: 'var(--accent)', letterSpacing: '.06em', textTransform: 'uppercase',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: '#3DD68C', boxShadow: '0 0 8px #3DD68C',
                animation: 'ph-blink 2s ease-in-out infinite',
              }} />
              {t('hero.badge')}
            </div>
          </Reveal>

          <Reveal delay={100}>
            <h1 style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: 'clamp(3.5rem, 11vw, 11rem)',
              fontWeight: 500, letterSpacing: '-.055em', lineHeight: 0.92,
              margin: 0,
            }}>
              <span className="g1">{t('hero.t1')}</span>{' '}
              <span className="g2">{t('hero.t2')}</span>
              <br />
              <span className="g3">{t('hero.t3')}</span>
            </h1>
          </Reveal>

          <Reveal delay={200}>
            <p style={{
              fontSize: 'clamp(1.05rem, 1.4vw, 1.35rem)',
              color: 'var(--text-soft)',
              lineHeight: 1.6,
              maxWidth: 720,
              whiteSpace: 'pre-line',
              margin: 0,
            }}>
              {t('hero.subtitle')}
            </p>
          </Reveal>

          <Reveal delay={280}>
            <div style={{
              display: 'flex', gap: 12, alignItems: 'center',
              flexWrap: 'wrap', justifyContent: 'center',
              marginTop: 12,
            }}>
              <a href="#contact" style={{
                background: 'var(--accent)', color: 'var(--btn-fg)',
                padding: '14px 32px', borderRadius: 100,
                fontSize: 14, fontWeight: 600, letterSpacing: '.01em',
                textDecoration: 'none',
                transition: 'transform .2s, box-shadow .2s',
                boxShadow: '0 10px 30px rgba(var(--accent-rgb), .35)',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 14px 40px rgba(var(--accent-rgb), .55)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(var(--accent-rgb), .35)' }}
              >
                {t('hero.cta')}
              </a>
              <a href="#projects" style={{
                background: 'rgba(255,255,255,.04)',
                color: 'var(--text)',
                border: '1px solid rgba(var(--accent-rgb), .25)',
                padding: '14px 28px', borderRadius: 100,
                fontSize: 14, fontWeight: 500,
                textDecoration: 'none',
                transition: 'background .2s, border-color .2s',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(var(--accent-rgb), .12)'; e.currentTarget.style.borderColor = 'rgba(var(--accent-rgb), .45)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,.04)'; e.currentTarget.style.borderColor = 'rgba(var(--accent-rgb), .25)' }}
              >
                {t('hero.cta2')}
              </a>
            </div>
          </Reveal>
        </div>

        <div aria-hidden style={{
          position: 'absolute', bottom: 28, left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          color: 'var(--text-dim)', fontSize: 11, letterSpacing: '.2em',
          textTransform: 'uppercase', opacity: 0.6,
          zIndex: 1, pointerEvents: 'none',
        }}>
          <div style={{
            width: 1, height: 40,
            background: 'linear-gradient(180deg, transparent, var(--accent))',
            animation: 'ph-scroll 2.4s ease-in-out infinite',
          }} />
        </div>
      </section>

      <section style={{ padding: '120px 0 24px', position: 'relative' }}>
        <div aria-hidden style={{
          position: 'absolute', left: '50%', top: -280, transform: 'translateX(-50%)',
          width: '95%', maxWidth: 1400, height: 520, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 55% 100% at 50% 30%, rgba(var(--accent-2-rgb), .22), transparent 75%)',
          filter: 'blur(60px)',
          zIndex: 0,
        }} />
        <div aria-hidden style={{
          position: 'absolute', left: '15%', top: -200, transform: 'translateX(-50%)',
          width: 700, height: 400, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 60% 100% at 50% 30%, rgba(var(--accent-rgb), .18), transparent 75%)',
          filter: 'blur(55px)',
          zIndex: 0,
        }} />
        <div aria-hidden style={{
          position: 'absolute', right: '12%', top: -220, transform: 'translateX(50%)',
          width: 560, height: 380, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 60% 100% at 50% 30%, rgba(var(--accent-3-rgb), .10), transparent 75%)',
          filter: 'blur(50px)',
          zIndex: 0,
        }} />
        <div className="ph-wrap" style={{ position: 'relative', zIndex: 1 }}>
          <Reveal stagger delay={80}>
            <div className="hero-stats" style={{
              display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 1, background: 'var(--border)',
              border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden',
            }}>
              {STATS.map(s => (
                <div key={s.l} style={{ background: 'var(--bg-card)', padding: '28px 24px' }}>
                  <div style={{
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: 40, fontWeight: 500, letterSpacing: -2, lineHeight: 1,
                    marginBottom: 6, color: s.color,
                  }}>
                    {s.n}
                  </div>
                  <div style={{
                    fontSize: 11, color: 'var(--text-dim)',
                    textTransform: 'uppercase', letterSpacing: '.14em',
                  }}>
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
