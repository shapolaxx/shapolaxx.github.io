import { NextRequest, NextResponse } from 'next/server'

const escapeHtml = (s: string) =>
  String(s ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')

export async function POST(req: NextRequest) {
  const { name, contact, message, budget } = await req.json()

  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
  const CHAT_ID   = process.env.TELEGRAM_CHAT_ID

  if (!BOT_TOKEN || !CHAT_ID) {
    return NextResponse.json({ error: 'Not configured' }, { status: 500 })
  }

  const text = [
    '🔔 <b>Новая заявка с сайта</b>',
    '',
    `👤 <b>Имя:</b> ${escapeHtml(name)}`,
    `📬 <b>Контакт:</b> ${escapeHtml(contact)}`,
    `💰 <b>Бюджет:</b> ${escapeHtml(budget) || 'не указан'}`,
    '',
    `💬 <b>Задача:</b>`,
    escapeHtml(message),
  ].join('\n')

  const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }),
  })

  if (!res.ok) {
    const err = await res.text().catch(() => '')
    console.error('[contact] Telegram error:', err)
    return NextResponse.json({ error: 'TG error' }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
