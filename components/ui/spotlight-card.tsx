'use client'
import React, { CSSProperties, ReactNode, useEffect, useRef } from 'react'

export type GlowColor = 'blue' | 'purple' | 'green' | 'red' | 'orange'

interface GlowCardProps {
  children?: ReactNode
  className?: string
  glowColor?: GlowColor
  style?: CSSProperties
  onClick?: () => void
  role?: string
  tabIndex?: number
}

const glowColorMap: Record<GlowColor, { base: number; spread: number }> = {
  blue:   { base: 220, spread: 200 },
  purple: { base: 280, spread: 300 },
  green:  { base: 120, spread: 200 },
  red:    { base: 0,   spread: 200 },
  orange: { base: 30,  spread: 200 },
}

export function GlowCard({
  children,
  className = '',
  glowColor = 'blue',
  style,
  ...rest
}: GlowCardProps) {
  const ref = useRef<HTMLDivElement>(null)

  // Per-card pointer tracking. Writing to the card's own style means the
  // coords are relative to the card (after any ancestor transforms), and a
  // transformed ancestor does NOT break positioning the way
  // `background-attachment: fixed` would with page-wide coords.
  useEffect(() => {
    const el = ref.current
    if (!el) return

    el.style.setProperty('--gx', '-9999')
    el.style.setProperty('--gy', '-9999')
    el.style.setProperty('--gxp', '0.5')

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const x = e.clientX - r.left
      const y = e.clientY - r.top
      el.style.setProperty('--gx', x.toFixed(2))
      el.style.setProperty('--gy', y.toFixed(2))
      el.style.setProperty('--gxp', r.width ? (x / r.width).toFixed(3) : '0')
    }
    const onLeave = () => {
      el.style.setProperty('--gx', '-9999')
      el.style.setProperty('--gy', '-9999')
    }

    el.addEventListener('pointermove', onMove, { passive: true })
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  const { base, spread } = glowColorMap[glowColor]

  const inlineStyle: CSSProperties = {
    ['--base' as string]: base,
    ['--spread' as string]: spread,
    ...style,
  }

  return (
    <div
      ref={ref}
      data-glow
      style={inlineStyle}
      className={`glow-card ${className}`}
      {...rest}
    >
      <div data-glow />
      {children}
    </div>
  )
}
