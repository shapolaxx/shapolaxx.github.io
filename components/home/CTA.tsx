'use client'
import { useState } from 'react'
import { IconTelegram, IconMail, IconBriefcase } from '@/components/ui/icons'
import { useT } from '@/lib/i18n'
import Reveal from '@/components/ui/Reveal'
import ShaderBackground from '@/components/ui/ShaderBackground'
import CloudsBackground from '@/components/ui/CloudsBackground'

export default function CTA() {
  const { t } = useT()
  const [form, setForm] = useState({ name: '', contact: '', budget: '', message: '' })
  const [sending, setSending] = useState(false)
  const [status, setStatus] = useState<'idle' | 'ok' | 'err'>('idle')
  const [copied, setCopied] = useState<string | null>(null)

  const CHANNELS = [
    { icon: IconTelegram, name: 'Telegram',     sub: t('cta.ch1.sub'), href: 'https://t.me/phantommngr',      copy: null },
    { icon: IconMail,     name: 'Яндекс.Почта', sub: t('cta.ch2.sub'), href: 'mailto:phantombuisness@ya.ru',  copy: 'phantombuisness@ya.ru' },
    { icon: IconMail,     name: 'Gmail',        sub: t('cta.ch3.sub'), href: 'mailto:phantombuisnes@gmail.com', copy: 'phantombuisnes@gmail.com' },
  ]

  async function handleCopy(e: React.MouseEvent, text: string) {
    e.preventDefault()
    try {
      await navigator.clipboard.writeText(text)
      setCopied(text)
      setTimeout(() => setCopied(null), 1800)
    } catch {
      window.location.href = `mailto:${text}`
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    setStatus('idle')
    try {
      const r = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (r.ok) {
        setStatus('ok')
        setForm({ name: '', contact: '', budget: '', message: '' })
      } else {
        setStatus('err')
      }
    } catch {
      setStatus('err')
    } finally {
      setSending(false)
    }
  }

  return (
    <section id="contact" className="ph-shell" style={{ position: 'relative', overflow: 'hidden' }}>
      <div aria-hidden className="shader-dark" style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        WebkitMaskImage: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,.55) 18%, #000 42%, #000 80%, rgba(0,0,0,.55) 95%, transparent 100%)',
        maskImage: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,.55) 18%, #000 42%, #000 80%, rgba(0,0,0,.55) 95%, transparent 100%)',
        zIndex: 0,
      }}>
        <ShaderBackground />
      </div>
      <div aria-hidden className="shader-light" style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        WebkitMaskImage: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,.55) 15%, #000 40%, #000 80%, rgba(0,0,0,.55) 95%, transparent 100%)',
        maskImage: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,.55) 15%, #000 40%, #000 80%, rgba(0,0,0,.55) 95%, transparent 100%)',
        zIndex: 0,
      }}>
        <CloudsBackground />
      </div>
      <div aria-hidden className="hero-vignette-dark" style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(ellipse at 50% 50%, transparent 35%, rgba(6,10,20,.55) 100%)',
      }} />
      <div className="ph-wrap" style={{ position: 'relative', zIndex: 1 }}>
        <div className="contact-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 80,
          alignItems: 'start',
        }}>
          <Reveal>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{
                  height: 1, width: 0,
                  background: 'linear-gradient(90deg, var(--accent), transparent)',
                  animation: 'ph-grow-line 4s ease-in-out infinite',
                }} />
                <span style={{
                  fontSize: '.68rem', letterSpacing: '.18em',
                  textTransform: 'uppercase', fontWeight: 500, color: 'var(--accent)',
                }}>
                  {t('cta.label')}
                </span>
              </div>

              <h2 className="g-title" style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
                fontWeight: 400, letterSpacing: '-.03em', marginBottom: 12,
                whiteSpace: 'pre-line',
              }}>
                {t('cta.title')}
              </h2>
              <p style={{
                fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.75, marginBottom: 32,
              }}>
                {t('cta.subtitle')}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {CHANNELS.map(c => {
                  const Icon = c.icon
                  const isCopied = c.copy && copied === c.copy
                  return (
                    <a
                      key={c.name}
                      href={c.href}
                      className="chan"
                      target={c.copy ? undefined : '_blank'}
                      rel="noopener noreferrer"
                      onClick={c.copy ? (e) => handleCopy(e, c.copy!) : undefined}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '14px 18px',
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        borderRadius: 10,
                        textDecoration: 'none', color: 'inherit',
                        cursor: 'pointer',
                        transition: 'all .2s',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ display: 'inline-flex', color: 'var(--text-muted)' }}>
                          <Icon size={15} />
                        </span>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>{c.name}</div>
                          <div style={{
                            fontSize: 11, marginTop: 1,
                            color: isCopied ? '#3DD68C' : 'var(--text-muted)',
                            transition: 'color .2s',
                          }}>
                            {isCopied ? '✓ Скопировано в буфер' : c.sub}
                          </div>
                        </div>
                      </div>
                      <span className="chan-arr" style={{
                        fontSize: 13, color: 'var(--text-dim)',
                        transition: 'transform .2s, color .2s',
                      }}>{c.copy ? '⎘' : '↗'}</span>
                    </a>
                  )
                })}
              </div>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <input type="text" placeholder={t('cta.form.name')} value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} />
                <input type="text" placeholder={t('cta.form.contact')} value={form.contact}
                  onChange={e => setForm({ ...form, contact: e.target.value })} style={inputStyle} />
              </div>
              <input type="text" placeholder={t('cta.form.budget')} value={form.budget}
                onChange={e => setForm({ ...form, budget: e.target.value })} style={inputStyle} />
              <textarea placeholder={t('cta.form.message')} value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                style={{ ...inputStyle, minHeight: 104, resize: 'none' as const }} />
              <button type="submit" disabled={sending} style={{
                background: 'var(--accent)', color: 'var(--btn-fg)',
                border: 'none', padding: 13, borderRadius: 8,
                fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 600,
                cursor: sending ? 'default' : 'pointer',
                width: '100%', transition: 'all .2s',
                opacity: sending ? 0.7 : 1,
              }}>
                {sending ? t('cta.form.sending') : t('cta.form.submit')}
              </button>
              {status === 'ok'  && <div style={{ fontSize: 12, color: '#3DD68C' }}>{t('cta.form.ok')}</div>}
              {status === 'err' && <div style={{ fontSize: 12, color: '#ff6b6b' }}>{t('cta.form.err')}</div>}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

const inputStyle: React.CSSProperties = {
  background: 'var(--input-bg)',
  border: '1px solid var(--border)',
  borderRadius: 8,
  padding: '12px 16px',
  color: 'var(--text)',
  fontSize: 13,
  fontFamily: 'DM Sans, sans-serif',
  outline: 'none',
  width: '100%',
  transition: 'border-color .2s, box-shadow .2s, background-color .35s, color .35s',
}
