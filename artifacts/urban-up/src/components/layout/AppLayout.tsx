import { useState } from "react"
import { Sidebar } from "./Sidebar"
import { Bell, PanelLeftOpen, PanelRightOpen, Search, Moon, Sun } from "lucide-react"
import { useI18n } from "@/lib/i18n-context"
import { useTheme } from "@/lib/theme-context"
import { cn } from "@/lib/utils"

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { t, lang, setLang, isRtl } = useI18n()
  const { theme, toggleTheme } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    return localStorage.getItem("paltur-sidebar-open") !== "false"
  })

  const toggleSidebar = () => {
    setSidebarOpen((open) => {
      const next = !open
      localStorage.setItem("paltur-sidebar-open", String(next))
      return next
    })
  }

  const sidebarLabel = sidebarOpen
    ? (isRtl ? "إخفاء الشريط الجانبي" : "Hide sidebar")
    : (isRtl ? "إظهار الشريط الجانبي" : "Show sidebar")

  const FloatingToggleIcon = isRtl ? PanelRightOpen : PanelLeftOpen

  return (
    <div
      className={cn(
        "relative flex min-h-screen w-full bg-background overflow-hidden",
        isRtl && "font-arabic"
      )}
      dir={isRtl ? "rtl" : "ltr"}
    >
      {sidebarOpen ? (
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={toggleSidebar}
          toggleLabel={sidebarLabel}
        />
      ) : (
        <button
          onClick={toggleSidebar}
          className={cn(
            "absolute top-4 z-30 flex size-9 items-center justify-center rounded-lg border bg-sidebar text-sidebar-foreground shadow-md transition-colors hover:bg-sidebar-accent hover:text-white",
            isRtl ? "right-3" : "left-3"
          )}
          title={sidebarLabel}
          aria-label={sidebarLabel}
        >
          <FloatingToggleIcon className="size-5" />
        </button>
      )}

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header
          className={cn(
            "flex h-16 shrink-0 items-center justify-between border-b bg-card px-4 md:px-6 shadow-sm z-10 relative gap-4",
            isRtl && "flex-row-reverse"
          )}
        >
          <div className="relative hidden w-full max-w-sm flex-1 md:flex">
            <Search className={cn("absolute top-2.5 size-4 text-muted-foreground", isRtl ? "right-2.5" : "left-2.5")} />
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              dir={isRtl ? "rtl" : "ltr"}
              className={cn(
                "flex h-9 w-full rounded-md border border-input bg-transparent py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                isRtl ? "pl-3 pr-9 text-right" : "pl-9 pr-3 text-left"
              )}
            />
          </div>

          <div className={cn("flex shrink-0 items-center gap-2", isRtl && "flex-row-reverse")}>
            <button
              onClick={() => setLang(lang === "en" ? "ar" : "en")}
              className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm font-semibold transition-colors hover:bg-muted"
              title={lang === "en" ? "Switch to Arabic" : "التبديل إلى الإنجليزية"}
            >
              <span className="text-base leading-none">{lang === "en" ? "🇵🇸" : "🇬🇧"}</span>
              <span>{lang === "en" ? "عربي" : "EN"}</span>
            </button>

            <button
              onClick={toggleTheme}
              className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
              aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
            >
              {theme === "light" ? <Moon className="size-5" /> : <Sun className="size-5" />}
            </button>

            <button
              className="relative rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label={isRtl ? "الإشعارات" : "Notifications"}
            >
              <Bell className="size-5" />
              <span className={cn("absolute top-1.5 size-2 rounded-full border border-background bg-destructive", isRtl ? "left-1.5" : "right-1.5")} />
            </button>
          </div>
        </header>

        <main
          className={cn(
            "flex-1 overflow-auto scroll-smooth px-6 md:px-10 lg:px-12 py-6 md:py-8",
            isRtl ? "text-right" : "text-left"
          )}
          dir={isRtl ? "rtl" : "ltr"}
        >
          {children}
        </main>
      </div>
    </div>
  )
}
