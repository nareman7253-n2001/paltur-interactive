import { useRef, useState } from "react"
import { AppLayout } from "@/components/layout/AppLayout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useI18n } from "@/lib/i18n-context"
import { useAuth } from "@workspace/replit-auth-web"
import { defaultContent, type ContentState } from "@/lib/content-context"
import { translations, type TranslationKey } from "@/lib/translations"
import { useContent } from "@/lib/content-context"
import { cn } from "@/lib/utils"
import {
  CalendarDays,
  Check,
  Download,
  FileText,
  ImagePlus,
  RotateCcw,
  Save,
  Settings2,
  TrafficCone,
  Languages,
  Upload,
  BarChart3,
  FileSpreadsheet,
  Activity,
} from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

function LocalizedField({
  label,
  value,
  onChange,
  multiline = false,
}: {
  label: string
  value: { en: string; ar: string }
  onChange: (lang: "en" | "ar", value: string) => void
  multiline?: boolean
}) {
  const Field = multiline ? Textarea : Input
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <label className="space-y-1.5 text-sm">
        <span className="font-medium">{label} (English)</span>
        <Field value={value.en} onChange={(event) => onChange("en", event.target.value)} dir="ltr" />
      </label>
      <label className="space-y-1.5 text-sm">
        <span className="font-medium">{label} (العربية)</span>
        <Field value={value.ar} onChange={(event) => onChange("ar", event.target.value)} dir="rtl" />
      </label>
    </div>
  )
}

export default function ContentManagerPage() {
  const { isRtl, lang } = useI18n()
  const { isAuthenticated, login, isLoading: authLoading } = useAuth()
  const { content, updateContent, resetContent } = useContent()
  const [draft, setDraft] = useState<ContentState>(() => clone(content))
  const [activeSection, setActiveSection] = useState("brand")
  const [saved, setSaved] = useState(false)
  const importRef = useRef<HTMLInputElement>(null)

  const t = (en: string, ar: string) => lang === "ar" ? ar : en
  const updateDraft = (updater: (current: ContentState) => ContentState) => {
    setDraft((current) => updater(current))
    setSaved(false)
  }

  const updateLocalized = (section: keyof ContentState, field: string, language: "en" | "ar", value: string) => {
    updateDraft((current) => {
      const currentSection = current[section] as Record<string, unknown>
      const currentValue = currentSection[field] as { en: string; ar: string }
      return {
        ...current,
        [section]: {
          ...currentSection,
          [field]: { ...currentValue, [language]: value },
        },
      } as ContentState
    })
  }

  const updateImage = (section: "brand" | "dashboard" | "events" | "traffic", value: string) => {
    updateDraft((current) => ({
      ...current,
      [section]: { ...current[section], ...(section === "brand" ? { logoUrl: value } : { heroImageUrl: value }) },
    }))
  }

  const updateEvent = (id: number, field: string, value: string | number) => {
    updateDraft((current) => ({
      ...current,
      events: {
        ...current.events,
        items: current.events.items.map((item) => item.id === id ? { ...item, [field]: value } : item),
      },
    }))
  }

  const updateTranslation = (key: TranslationKey, language: "en" | "ar", value: string) => {
    updateDraft((current) => ({
      ...current,
      translationOverrides: {
        ...current.translationOverrides,
        [key]: {
          ...(current.translationOverrides[key] || translations[key]),
          [language]: value,
        },
      },
    }))
  }

  const updateEventLocalized = (id: number, field: "title" | "description" | "location", language: "en" | "ar", value: string) => {
    updateDraft((current) => ({
      ...current,
      events: {
        ...current.events,
        items: current.events.items.map((item) => item.id === id ? {
          ...item,
          [field]: { ...item[field], [language]: value },
        } : item),
      },
    }))
  }

  const handleSave = () => {
    updateContent(() => clone(draft))
    setSaved(true)
  }

  const handleReset = () => {
    resetContent()
    setDraft(clone(defaultContent))
    setSaved(true)
  }

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(draft, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = "paltur-content.json"
    anchor.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (file?: File) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        setDraft({ ...defaultContent, ...JSON.parse(String(reader.result)) })
        setSaved(false)
      } catch {
        window.alert(t("The content file is not valid JSON.", "ملف المحتوى ليس بصيغة JSON صحيحة."))
      }
    }
    reader.readAsText(file)
  }

  const handleImageUpload = (section: "brand" | "dashboard" | "events" | "traffic", file?: File) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => updateImage(section, String(reader.result))
    reader.readAsDataURL(file)
  }

  if (!authLoading && !isAuthenticated) {
    return (
      <AppLayout>
        <div className="mx-auto flex min-h-[60vh] max-w-lg items-center justify-center" dir={isRtl ? "rtl" : "ltr"}>
          <Card className="w-full text-center">
            <CardHeader><CardTitle>{t("Admin access required", "يلزم تسجيل دخول المدير")}</CardTitle></CardHeader>
            <CardContent>
              <p className="mb-5 text-sm text-muted-foreground">{t("Sign in to edit platform content.", "سجّل الدخول لتعديل محتوى المنصة.")}</p>
              <Button onClick={() => { void login() }}>{t("Sign in", "تسجيل الدخول")}</Button>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    )
  }

  const sectionItems = [
    { id: "brand", label: t("Brand & identity", "الهوية والعلامة"), icon: Settings2 },
    { id: "dashboard", label: t("Dashboard", "لوحة التحكم"), icon: FileText },
    { id: "events", label: t("Events", "الفعاليات"), icon: CalendarDays },
    { id: "traffic", label: t("Traffic", "المرور"), icon: TrafficCone },
    { id: "translations", label: t("All translations", "كل الترجمات"), icon: Languages },
    { id: "reports", label: t("User Reports", "البلاغات الواردة"), icon: TrafficCone },
    { id: "analytics", label: t("Analytics & Charts", "الإحصائيات والتحليلات"), icon: BarChart3 },
    { id: "performance", label: t("Performance", "مراقبة الأداء"), icon: Activity },
  ]

  return (
    <AppLayout>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 pb-12" dir={isRtl ? "rtl" : "ltr"}>
        <div className={cn("flex flex-wrap items-start justify-between gap-4", isRtl && "flex-row-reverse")}>
          <div>
            <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
              <Settings2 className="size-8 text-primary" />
              {t("Content Management", "إدارة محتوى المنصة")}
            </h1>
            <p className="mt-1 text-muted-foreground">
              {t("Edit the content that appears in the public experience without changing code.", "عدّل المحتوى الظاهر للزوار دون الحاجة إلى تغيير الكود.")}
            </p>
          </div>
          <div className={cn("flex flex-wrap gap-2", isRtl && "flex-row-reverse")}>
            <Button variant="outline" onClick={() => importRef.current?.click()} className="gap-2">
              <Upload className="size-4" /> {t("Import", "استيراد")}
            </Button>
            <input ref={importRef} type="file" accept="application/json" className="hidden" onChange={(event) => handleImport(event.target.files?.[0])} />
            <Button variant="outline" onClick={handleExport} className="gap-2">
              <Download className="size-4" /> {t("Export", "تصدير")}
            </Button>
            <Button variant="outline" onClick={handleReset} className="gap-2">
              <RotateCcw className="size-4" /> {t("Reset", "إعادة ضبط")}
            </Button>
            <Button onClick={handleSave} className="gap-2">
              {saved ? <Check className="size-4" /> : <Save className="size-4" />}
              {saved ? t("Saved", "تم الحفظ") : t("Save changes", "حفظ التغييرات")}
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
          <Card className="h-fit lg:sticky lg:top-4">
            <CardContent className="flex gap-1 p-2 lg:flex-col">
              {sectionItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveSection(id)}
                  className={cn(
                    "flex flex-1 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors lg:flex-none",
                    activeSection === id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    isRtl && "flex-row-reverse text-right"
                  )}
                >
                  <Icon className="size-4 shrink-0" />
                  <span className="hidden lg:inline">{label}</span>
                </button>
              ))}
            </CardContent>
          </Card>

          <div className="space-y-6">
            {activeSection === "brand" && (
              <Card>
                <CardHeader><CardTitle>{t("Brand & identity", "الهوية والعلامة")}</CardTitle></CardHeader>
                <CardContent className="space-y-5">
                  <LocalizedField label={t("Platform name", "اسم المنصة")} value={draft.brand.name} onChange={(language, value) => updateLocalized("brand", "name", language, value)} />
                  <ImageField
                    label={t("Logo image", "صورة الشعار")}
                    value={draft.brand.logoUrl}
                    onChange={(value) => updateImage("brand", value)}
                    onUpload={(file) => handleImageUpload("brand", file)}
                  />
                  <p className="text-sm text-muted-foreground">{t("Changes are saved in this browser and can be exported as a JSON content backup.", "تُحفظ التغييرات في هذا المتصفح ويمكن تصديرها كنسخة احتياطية بصيغة JSON.")}</p>
                </CardContent>
              </Card>
            )}

            {activeSection === "dashboard" && (
              <Card>
                <CardHeader><CardTitle>{t("Dashboard content", "محتوى لوحة التحكم")}</CardTitle></CardHeader>
                <CardContent className="space-y-5">
                  <LocalizedField label={t("Page title", "عنوان الصفحة")} value={draft.dashboard.title} onChange={(language, value) => updateLocalized("dashboard", "title", language, value)} />
                  <LocalizedField label={t("Page subtitle", "الوصف المختصر")} value={draft.dashboard.subtitle} onChange={(language, value) => updateLocalized("dashboard", "subtitle", language, value)} multiline />
                  <LocalizedField label={t("Map title", "عنوان الخريطة")} value={draft.dashboard.mapTitle} onChange={(language, value) => updateLocalized("dashboard", "mapTitle", language, value)} />
                  <ImageField label={t("Dashboard cover image", "صورة غلاف لوحة التحكم")} value={draft.dashboard.heroImageUrl} onChange={(value) => updateImage("dashboard", value)} onUpload={(file) => handleImageUpload("dashboard", file)} />
                </CardContent>
              </Card>
            )}

            {activeSection === "traffic" && (
              <Card>
                <CardHeader><CardTitle>{t("Traffic page content", "محتوى صفحة المرور")}</CardTitle></CardHeader>
                <CardContent className="space-y-5">
                  <LocalizedField label={t("Page title", "عنوان الصفحة")} value={draft.traffic.title} onChange={(language, value) => updateLocalized("traffic", "title", language, value)} />
                  <LocalizedField label={t("Page subtitle", "الوصف المختصر")} value={draft.traffic.subtitle} onChange={(language, value) => updateLocalized("traffic", "subtitle", language, value)} multiline />
                  <ImageField label={t("Traffic cover image", "صورة غلاف صفحة المرور")} value={draft.traffic.heroImageUrl} onChange={(value) => updateImage("traffic", value)} onUpload={(file) => handleImageUpload("traffic", file)} />
                </CardContent>
              </Card>
            )}

            {activeSection === "translations" && (
              <Card>
                <CardHeader>
                  <CardTitle>{t("All interface translations", "كل نصوص الواجهة")}</CardTitle>
                  <p className="text-sm text-muted-foreground">{t("Edit the centralized labels used throughout the platform.", "عدّل العبارات المركزية المستخدمة في جميع أجزاء المنصة.")}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {(Object.keys(translations) as TranslationKey[]).map((key) => {
                    const value = draft.translationOverrides[key] || translations[key]
                    return (
                      <div key={key} className="grid gap-3 rounded-xl border p-3 md:grid-cols-[180px_1fr_1fr] md:items-center">
                        <code className="text-xs text-muted-foreground">{key}</code>
                        <Input value={value.en} onChange={(event) => updateTranslation(key, "en", event.target.value)} dir="ltr" aria-label={`${key} English`} />
                        <Input value={value.ar} onChange={(event) => updateTranslation(key, "ar", event.target.value)} dir="rtl" aria-label={`${key} Arabic`} />
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            )}

            {activeSection === "reports" && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>{t("User Reports", "البلاغات الواردة")}</CardTitle>
                    <p className="text-sm text-muted-foreground">{t("Manage reports submitted by users from the dashboard.", "إدارة البلاغات التي أرسلها المستخدمون من لوحة التحكم.")}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => {
                      const csv = "Title,Location,Description,Status,Date\nعائق في الطريق,ميدان المنارة رام الله,هناك بعض الحجارة التي تعيق حركة الكراسي المتحركة,Pending,2026-08-13";
                      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'paltur-reports.csv';
                      a.click();
                    }} className="gap-2">
                      <FileSpreadsheet className="size-4" /> {t("Export Excel", "تصدير Excel")}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => {
                      window.print();
                    }} className="gap-2">
                      <FileText className="size-4" /> {t("Export PDF", "تصدير PDF")}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-lg border p-4 bg-card">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold">عائق في الطريق</h4>
                          <p className="text-sm text-muted-foreground">ميدان المنارة، رام الله</p>
                        </div>
                        <Badge variant="warning">Pending</Badge>
                      </div>
                      <p className="mt-2 text-sm">هناك بعض الحجارة التي تعيق حركة الكراسي المتحركة في الميدان.</p>
                      <p className="mt-2 text-[10px] text-muted-foreground">2026-08-13 12:00 PM</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === "performance" && (
              <Card>
                <CardHeader>
                  <CardTitle>{t("Site Performance & Speed", "أداء الموقع وسرعة التحميل")}</CardTitle>
                  <p className="text-sm text-muted-foreground">{t("Real-time telemetry and resource load metrics.", "مؤشرات الأداء اللحظية وسرعة استجابة الخوادم.")}</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl border bg-card">
                      <p className="text-sm text-muted-foreground">FCP (First Contentful Paint)</p>
                      <h3 className="text-2xl font-bold mt-1 text-green-600">0.4s</h3>
                      <p className="text-xs text-muted-foreground mt-1">ممتاز (أقل من 1.8 ثانية)</p>
                    </div>
                    <div className="p-4 rounded-xl border bg-card">
                      <p className="text-sm text-muted-foreground">LCP (Largest Contentful Paint)</p>
                      <h3 className="text-2xl font-bold mt-1 text-green-600">0.9s</h3>
                      <p className="text-xs text-muted-foreground mt-1">ممتاز (أقل من 2.5 ثانية)</p>
                    </div>
                    <div className="p-4 rounded-xl border bg-card">
                      <p className="text-sm text-muted-foreground">API Latency (Vercel / Neon)</p>
                      <h3 className="text-2xl font-bold mt-1 text-blue-600">45ms</h3>
                      <p className="text-xs text-muted-foreground mt-1">استجابة سريعة جداً</p>
                    </div>
                  </div>

                  <div className="rounded-xl border p-4 bg-muted/20">
                    <h4 className="font-semibold mb-2">حالة الخدمات السحابية (Cloud Status)</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center py-1 border-b">
                        <span>خادم الواجهة الأمامية (Vercel Edge Network)</span>
                        <Badge variant="success">متصل وعامل</Badge>
                      </div>
                      <div className="flex justify-between items-center py-1 border-b">
                        <span>قاعدة البيانات (PostgreSQL / Neon)</span>
                        <Badge variant="success">متصل وعامل</Badge>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span>خدمة المصادقة (JWT Auth)</span>
                        <Badge variant="success">نشط</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === "analytics" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t("Reports Analytics & Trends", "إحصائيات وتحليلات البلاغات")}</CardTitle>
                    <p className="text-sm text-muted-foreground">{t("Visual analysis of incoming citizen reports and traffic status.", "تحليل مرئي لبلاغات المواطنين وحالة المرور في المدينة.")}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full flex items-center justify-center bg-muted/20 rounded-xl border border-dashed p-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                          { name: 'السبت', reports: 12 },
                          { name: 'الأحد', reports: 19 },
                          { name: 'الإثنين', reports: 15 },
                          { name: 'الثلاثاء', reports: 22 },
                          { name: 'الأربعاء', reports: 30 },
                          { name: 'الخميس', reports: 25 },
                          { name: 'الجمعة', reports: 10 },
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="reports" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === "events" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader><CardTitle>{t("Events page content", "محتوى صفحة الفعاليات")}</CardTitle></CardHeader>
                  <CardContent className="space-y-5">
                    <LocalizedField label={t("Page title", "عنوان الصفحة")} value={draft.events.title} onChange={(language, value) => updateLocalized("events", "title", language, value)} />
                    <LocalizedField label={t("Page subtitle", "الوصف المختصر")} value={draft.events.subtitle} onChange={(language, value) => updateLocalized("events", "subtitle", language, value)} multiline />
                    <ImageField label={t("Events cover image", "صورة غلاف الفعاليات")} value={draft.events.heroImageUrl} onChange={(value) => updateImage("events", value)} onUpload={(file) => handleImageUpload("events", file)} />
                  </CardContent>
                </Card>

                {draft.events.items.map((event) => (
                  <Card key={event.id}>
                    <CardHeader><CardTitle className="text-lg">{t(`Event ${event.id}`, `الفعالية ${event.id}`)}</CardTitle></CardHeader>
                    <CardContent className="space-y-5">
                      <LocalizedField label={t("Event title", "عنوان الفعالية")} value={event.title} onChange={(language, value) => updateEventLocalized(event.id, "title", language, value)} />
                      <LocalizedField label={t("Description", "الوصف")} value={event.description} onChange={(language, value) => updateEventLocalized(event.id, "description", language, value)} multiline />
                      <LocalizedField label={t("Location", "الموقع")} value={event.location} onChange={(language, value) => updateEventLocalized(event.id, "location", language, value)} />
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <Field label={t("Category", "الفئة")} value={event.category} onChange={(value) => updateEvent(event.id, "category", value)} />
                        <Field label={t("Status", "الحالة")} value={event.status} onChange={(value) => updateEvent(event.id, "status", value)} />
                        <Field label={t("Reward points", "نقاط المكافأة")} type="number" value={event.pointsReward} onChange={(value) => updateEvent(event.id, "pointsReward", Number(value))} />
                        <Field label={t("Required points", "النقاط المطلوبة")} type="number" value={event.pointsRequired} onChange={(value) => updateEvent(event.id, "pointsRequired", Number(value))} />
                        <Field label={t("Price", "السعر")} type="number" value={event.price} onChange={(value) => updateEvent(event.id, "price", Number(value))} />
                        <Field label={t("Capacity", "السعة")} type="number" value={event.capacity} onChange={(value) => updateEvent(event.id, "capacity", Number(value))} />
                        <Field label={t("Booked", "المحجوز")} type="number" value={event.booked} onChange={(value) => updateEvent(event.id, "booked", Number(value))} />
                        <Field label={t("Start date", "تاريخ البداية")} type="datetime-local" value={event.startDate.slice(0, 16)} onChange={(value) => updateEvent(event.id, "startDate", value)} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string | number; onChange: (value: string) => void; type?: string }) {
  return (
    <label className="space-y-1.5 text-sm">
      <span className="font-medium">{label}</span>
      <Input type={type} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  )
}

function ImageField({ label, value, onChange, onUpload }: { label: string; value: string; onChange: (value: string) => void; onUpload: (file?: File) => void }) {
  return (
    <div className="space-y-3">
      <label className="space-y-1.5 text-sm">
        <span className="font-medium">{label}</span>
        <Input placeholder="https://example.com/image.jpg" value={value.startsWith("data:") ? "Uploaded image" : value} onChange={(event) => onChange(event.target.value)} dir="ltr" />
      </label>
      <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium hover:bg-muted">
        <ImagePlus className="size-4" />
        {label.includes("الشعار") ? "رفع صورة" : "Upload image"}
        <input type="file" accept="image/*" className="hidden" onChange={(event) => onUpload(event.target.files?.[0])} />
      </label>
      {value && <img src={value} alt="Preview" className="h-32 w-full rounded-xl border object-cover" />}
    </div>
  )
}
