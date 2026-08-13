import { createContext, useContext, useMemo, useState, type ReactNode } from "react"
import { type TranslationKey } from "./translations"

type LocalizedText = { en: string; ar: string }

export type EditableEvent = {
  id: number
  title: LocalizedText
  description: LocalizedText
  location: LocalizedText
  category: string
  pointsReward: number
  pointsRequired: number
  price: number
  capacity: number
  booked: number
  startDate: string
  endDate: string
  status: string
}

export type ContentState = {
  brand: {
    name: LocalizedText
    logoUrl: string
  }
  dashboard: {
    title: LocalizedText
    subtitle: LocalizedText
    mapTitle: LocalizedText
    heroImageUrl: string
  }
  events: {
    title: LocalizedText
    subtitle: LocalizedText
    heroImageUrl: string
    items: EditableEvent[]
  }
  traffic: {
    title: LocalizedText
    subtitle: LocalizedText
    heroImageUrl: string
  }
  translationOverrides: Partial<Record<TranslationKey, LocalizedText>>
}

export const defaultContent: ContentState = {
  brand: {
    name: { en: "PalTur", ar: "بالتور" },
    logoUrl: "",
  },
  dashboard: {
    title: { en: "City Overview", ar: "نظرة عامة على المدينة" },
    subtitle: { en: "Real-time pulse of Ramallah & surrounding areas.", ar: "النبض اللحظي لرام الله والمناطق المحيطة." },
    mapTitle: { en: "Live City Map", ar: "خريطة المدينة الحية" },
    heroImageUrl: "",
  },
  events: {
    title: { en: "Events & Activities", ar: "الفعاليات والأنشطة" },
    subtitle: { en: "Discover, book, and earn Jawwal Points for attending city events.", ar: "اكتشف الفعاليات واحجز مقعدك واكسب نقاط جوال." },
    heroImageUrl: "",
    items: [
      {
        id: 1,
        title: { en: "Ramallah Heritage Walk", ar: "جولة تراثية في رام الله" },
        description: { en: "An evening walk through heritage sites, stories, and local artisan shops.", ar: "جولة مسائية بين المواقع التراثية والحكايات والمتاجر الحرفية المحلية." },
        location: { en: "Al-Manara Square", ar: "دوار المنارة" },
        category: "cultural",
        pointsReward: 75,
        pointsRequired: 0,
        price: 0,
        capacity: 30,
        booked: 18,
        startDate: "2026-08-20T16:30:00.000Z",
        endDate: "2026-08-20T18:30:00.000Z",
        status: "upcoming",
      },
      {
        id: 2,
        title: { en: "Community Clean-up Day", ar: "يوم تنظيف مجتمعي" },
        description: { en: "Volunteer with neighbours to refresh public spaces and earn eco points.", ar: "تطوع مع الجيران لتنظيف المساحات العامة واكسب نقاطاً بيئية." },
        location: { en: "Al-Irsal Street", ar: "شارع الإرسال" },
        category: "educational",
        pointsReward: 120,
        pointsRequired: 0,
        price: 0,
        capacity: 60,
        booked: 42,
        startDate: "2026-08-22T07:30:00.000Z",
        endDate: "2026-08-22T10:30:00.000Z",
        status: "upcoming",
      },
      {
        id: 3,
        title: { en: "Palestinian Crafts Market", ar: "سوق الحرف الفلسطينية" },
        description: { en: "Meet independent makers and discover handmade Palestinian products.", ar: "تعرّف إلى الحرفيين المستقلين واكتشف منتجات فلسطينية مصنوعة يدوياً." },
        location: { en: "Ramallah Cultural Palace", ar: "قصر رام الله الثقافي" },
        category: "entertainment",
        pointsReward: 50,
        pointsRequired: 50,
        price: 10,
        capacity: 120,
        booked: 86,
        startDate: "2026-08-24T12:00:00.000Z",
        endDate: "2026-08-24T19:00:00.000Z",
        status: "upcoming",
      },
      {
        id: 4,
        title: { en: "Sunset Football Meetup", ar: "لقاء كرة قدم عند الغروب" },
        description: { en: "A friendly community football session for all experience levels.", ar: "لقاء ودي لكرة القدم مناسب لجميع مستويات الخبرة." },
        location: { en: "Al-Bireh Sports Field", ar: "ملعب البيرة الرياضي" },
        category: "sports",
        pointsReward: 40,
        pointsRequired: 0,
        price: 0,
        capacity: 24,
        booked: 20,
        startDate: "2026-08-26T17:00:00.000Z",
        endDate: "2026-08-26T19:00:00.000Z",
        status: "upcoming",
      },
    ],
  },
  traffic: {
    title: { en: "Traffic & Routes", ar: "المرور والطرق" },
    subtitle: { en: "AI-powered routing and community incident reporting.", ar: "توجيه ذكي بالذكاء الاصطناعي وإبلاغ المجتمع عن الحوادث." },
    heroImageUrl: "",
  },
  translationOverrides: {},
}

const STORAGE_KEY = "paltur-content-v1"

type ContentContextValue = {
  content: ContentState
  updateContent: (updater: (current: ContentState) => ContentState) => void
  resetContent: () => void
}

const ContentContext = createContext<ContentContextValue | null>(null)

function loadContent(): ContentState {
  if (typeof window === "undefined") return defaultContent
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) return defaultContent
    return { ...defaultContent, ...JSON.parse(stored) }
  } catch {
    return defaultContent
  }
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<ContentState>(loadContent)

  const value = useMemo<ContentContextValue>(() => ({
    content,
    updateContent: (updater) => {
      setContent((current) => {
        const next = updater(current)
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
        return next
      })
    },
    resetContent: () => {
      window.localStorage.removeItem(STORAGE_KEY)
      setContent(defaultContent)
    },
  }), [content])

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
}

export function useContent() {
  const context = useContext(ContentContext)
  if (!context) throw new Error("useContent must be used within ContentProvider")
  return context
}

export function getLocalizedText(value: LocalizedText, lang: "en" | "ar") {
  return value[lang] || value.en
}

export type { LocalizedText }
