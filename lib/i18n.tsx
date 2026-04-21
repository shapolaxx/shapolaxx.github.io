'use client'
import { createContext, useContext, useEffect, useState, ReactNode, useMemo } from 'react'

export type Lang = 'ru' | 'en'

export const STRINGS = {
  ru: {
    'nav.services':   'Услуги',
    'nav.projects':   'Портфолио',
    'nav.team':       'Команда',
    'nav.contact':    'Контакты',
    'nav.cta':        'Обсудить проект',

    'hero.badge':     'IT-команда · Полный цикл разработки',
    'hero.t1':        'Строим',
    'hero.t2':        'цифровые',
    'hero.t3':        'продукты',
    'hero.subtitle':  'Сайты, Telegram-боты, CRM и автоматизация.\nТри специалиста — от идеи до деплоя.',
    'hero.cta':       'Обсудить проект',
    'hero.cta2':      'Смотреть работы →',
    'hero.stat1.n':   '30+',
    'hero.stat1.l':   'Проектов сдано',
    'hero.stat2.n':   '3',
    'hero.stat2.l':   'Специалиста',
    'hero.stat3.n':   '24ч',
    'hero.stat3.l':   'Время ответа',
    'hero.stat4.n':   'Global',
    'hero.stat4.l':   'Работаем удалённо',

    'svc.label':      'Услуги',
    'svc.title':      'Что мы делаем',
    'svc.subtitle':   'Полный цикл разработки — от дизайна и прототипа до деплоя и поддержки',

    'proj.label':     'Портфолио',
    'proj.title':     'Наши работы',
    'proj.more':      'Подробнее →',
    'proj.about':     'О проекте',
    'proj.results':   'Результат',
    'proj.stack':     'Стек технологий',
    'proj.want':      'Хочу такое же →',
    'proj.demo':      'Смотреть демо ↗',
    'proj.close':     'Закрыть',
    'proj.prev':      'Предыдущий',
    'proj.next':      'Следующий',

    'team.label':     'Команда',
    'team.title':     'Кто мы',
    'team.subtitle':  'Три специалиста с опытом от 4 лет. Работаем удалённо по всей России и СНГ.',
    'team.1.role':    'Тимлид · Backend',
    'team.2.role':    'Frontend · UI/UX',
    'team.3.role':    'Mobile · DevOps',

    'cta.label':      'Контакты',
    'cta.title':      'Обсудим\nпроект?',
    'cta.subtitle':   'Расскажите задачу — ответим в тот же день с оценкой сроков и стоимости.',
    'cta.ch1.sub':    '@phantommngr · быстрее всего',
    'cta.ch2.sub':    'phantombuisness@ya.ru',
    'cta.ch3.sub':    'phantombuisnes@gmail.com',
    'cta.form.name':     'Имя',
    'cta.form.contact':  'Telegram или email',
    'cta.form.budget':   'Бюджет проекта',
    'cta.form.message':  'Опишите задачу...',
    'cta.form.submit':    'Отправить заявку →',
    'cta.form.sending':   'Отправляем...',
    'cta.form.ok':        'Заявка отправлена. Ответим в течение дня.',
    'cta.form.err':       'Не удалось отправить. Напишите в Telegram.',

    'footer.right':   'Разработка под ключ',
  },
  en: {
    'nav.services':   'Services',
    'nav.projects':   'Portfolio',
    'nav.team':       'Team',
    'nav.contact':    'Contact',
    'nav.cta':        'Start a project',

    'hero.badge':     'IT team · Full development cycle',
    'hero.t1':        'We build',
    'hero.t2':        'digital',
    'hero.t3':        'products',
    'hero.subtitle':  'Websites, Telegram bots, CRM and automation.\nThree specialists — from idea to deploy.',
    'hero.cta':       'Start a project',
    'hero.cta2':      'See our work →',
    'hero.stat1.n':   '30+',
    'hero.stat1.l':   'Projects shipped',
    'hero.stat2.n':   '3',
    'hero.stat2.l':   'Specialists',
    'hero.stat3.n':   '24h',
    'hero.stat3.l':   'Response time',
    'hero.stat4.n':   'Global',
    'hero.stat4.l':   'Remote-first team',

    'svc.label':      'Services',
    'svc.title':      'What we do',
    'svc.subtitle':   'Full development cycle — from design and prototype to deployment and support',

    'proj.label':     'Portfolio',
    'proj.title':     'Our work',
    'proj.more':      'Learn more →',
    'proj.about':     'About the project',
    'proj.results':   'Results',
    'proj.stack':     'Tech stack',
    'proj.want':      'I want one →',
    'proj.demo':      'View demo ↗',
    'proj.close':     'Close',
    'proj.prev':      'Previous',
    'proj.next':      'Next',

    'team.label':     'Team',
    'team.title':     'Who we are',
    'team.subtitle':  'Three specialists with 4+ years of experience. We work remotely worldwide.',
    'team.1.role':    'Team lead · Backend',
    'team.2.role':    'Frontend · UI/UX',
    'team.3.role':    'Mobile · DevOps',

    'cta.label':      'Contact',
    'cta.title':      "Let's build\nsomething?",
    'cta.subtitle':   "Tell us about your project — we'll reply the same day with timeline and quote.",
    'cta.ch1.sub':    '@phantommngr · fastest reply',
    'cta.ch2.sub':    'phantombuisness@ya.ru',
    'cta.ch3.sub':    'phantombuisnes@gmail.com',
    'cta.form.name':     'Name',
    'cta.form.contact':  'Telegram or email',
    'cta.form.budget':   'Project budget',
    'cta.form.message':  'Describe the task...',
    'cta.form.submit':    'Send request →',
    'cta.form.sending':   'Sending...',
    'cta.form.ok':        "Request sent. We'll reply within the day.",
    'cta.form.err':       'Failed to send. Please write us on Telegram.',

    'footer.right':   'Full-cycle development',
  },
} as const

export type StringKey = keyof typeof STRINGS['ru']

interface LangCtx {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: StringKey) => string
}

const Ctx = createContext<LangCtx | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('ru')

  useEffect(() => {
    const saved = (typeof window !== 'undefined' && localStorage.getItem('lang')) as Lang | null
    if (saved === 'ru' || saved === 'en') setLangState(saved)
  }, [])

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang
    }
  }, [lang])

  const setLang = (l: Lang) => {
    setLangState(l)
    if (typeof window !== 'undefined') localStorage.setItem('lang', l)
  }

  const value = useMemo<LangCtx>(() => ({
    lang,
    setLang,
    t: (key: StringKey) => STRINGS[lang][key] ?? STRINGS.ru[key] ?? key,
  }), [lang])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useT() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useT must be used within LanguageProvider')
  return c
}

export function pick<T>(val: { ru: T; en: T }, lang: Lang): T {
  return val[lang]
}
