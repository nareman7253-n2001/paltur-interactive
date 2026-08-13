import { Link, useLocation } from "wouter"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Navigation,
  Map as MapIcon,
  Building2,
  TrendingUp,
  AlertCircle,
  Heart,
  BookOpen,
  TriangleAlert,
  PanelLeftClose,
  PanelRightClose,
  Settings2,
  BarChart3,
  LogIn,
  LogOut,
} from "lucide-react"
import { useGetProfile } from "@workspace/api-client-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useI18n } from "@/lib/i18n-context"
import { useAuth } from "@workspace/replit-auth-web"
import { useContent } from "@/lib/content-context"

export function Sidebar({
  isOpen,
  onToggle,
  toggleLabel,
}: {
  isOpen: boolean
  onToggle: () => void
  toggleLabel: string
}) {
  const [location] = useLocation()
  const { data: profile } = useGetProfile()
  const { t, isRtl, lang } = useI18n()
  const { content } = useContent()
  const { isAuthenticated, user, login, logout, isLoading: authLoading } = useAuth()

  // تم الاحتفاظ فقط بالمسارات الفعالة والرئيسية
  const cityControlLinks = [
    { href: "/dashboard",    label: lang === "ar" ? "لوحة التحكم"        : "Dashboard",       icon: LayoutDashboard },
    { href: "/traffic",      label: lang === "ar" ? "المرور والطرق"       : "Traffic & Routes", icon: Navigation },
    { href: "/safe-paths",   label: lang === "ar" ? "المسارات الآمنة"     : "Safe Paths",       icon: MapIcon },
    { href: "/municipality", label: lang === "ar" ? "البلدية"             : "Municipality",     icon: Building2 },
  ]

  const communityLinks = [
    { href: "/suggestions", label: lang === "ar" ? "المقترحات"      : "Suggestions",  icon: TrendingUp },
    { href: "/complaints",  label: lang === "ar" ? "الشكاوى"        : "Complaints",   icon: AlertCircle },
  ]

  const inclusivityLinks = [
    { href: "/services-directory", label: lang === "ar" ? "دليل الخدمات"    : "Services Directory", icon: Heart         },
    { href: "/report-obstacle",    label: lang === "ar" ? "أبلغ عن عقبة"    : "Report Obstacle",    icon: TriangleAlert },
    { href: "/awareness",          label: lang === "ar" ? "التوعية والتدريب" : "Awareness Courses",  icon: BookOpen      },
  ]

  const adminLinks = [
    { href: "/admin/status",  label: lang === "ar" ? "لوحة الإدارة" : "Admin Status",       icon: BarChart3 },
    { href: "/admin/content", label: lang === "ar" ? "إدارة المحتوى" : "Content Management", icon: Settings2 },
  ]

  const isActive = (href: string) =>
    location === href || (location === "/" && href === "/dashboard") || location.startsWith(href + "/")

  const NavLink = ({ href, label, icon: Icon }: { href: string; label: string; icon: typeof LayoutDashboard }) => (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
        isRtl && "flex-row-reverse text-right",
        isActive(href)
          ? "bg-sidebar-accent text-white"
          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-white"
      )}
    >
      <Icon className={cn("size-4 shrink-0", isActive(href) ? "text-primary" : "text-sidebar-foreground/50")} />
      {label}
    </Link>
  )

  const SectionLabel = ({ label }: { label: string }) => (
    <div className={cn("text-xs font-semibold text-sidebar-foreground/50 mb-1.5 px-2 uppercase tracking-wider", isRtl && "text-right")}>
      {label}
    </div>
  )

  return (
    <div
      className={cn(
        "flex h-screen w-64 flex-col bg-sidebar text-sidebar-foreground border-sidebar-border relative shrink-0",
        isRtl ? "border-l" : "border-r"
      )}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Sidebar toggle */}
      <button
        onClick={onToggle}
        className={cn(
          "absolute top-4 z-20 flex size-9 items-center justify-center rounded-lg border border-sidebar-border bg-sidebar text-sidebar-foreground shadow-md transition-colors hover:bg-sidebar-accent hover:text-white",
          isRtl ? "-left-4" : "-right-4"
        )}
        title={toggleLabel}
        aria-label={toggleLabel}
      >
        {isRtl ? <PanelRightClose className="size-5" /> : <PanelLeftClose className="size-5" />}
      </button>

      {/* Logo */}
      <div className={cn("flex items-center gap-3 px-6 py-4 font-bold text-2xl tracking-tight text-white shrink-0", isRtl && "flex-row-reverse")}>
        <div className="flex size-9 items-center justify-center overflow-hidden rounded-xl bg-primary shrink-0">
          {content.brand.logoUrl ? (
            <img src={content.brand.logoUrl} alt="" className="size-full object-cover" />
          ) : (
            <MapIcon className="size-5 text-primary-foreground" />
          )}
        </div>
        {content.brand.name[lang] || t('appName')}
      </div>

      {/* Scrollable nav area */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4">
        <div>
          <SectionLabel label={lang === "ar" ? "التحكم في المدينة" : "City Control"} />
          <nav className="flex flex-col gap-0.5">
            {cityControlLinks.map((link) => <NavLink key={link.href} {...link} />)}
          </nav>
        </div>

        <div>
          <SectionLabel label={lang === "ar" ? "المجتمع" : "Community"} />
          <nav className="flex flex-col gap-0.5">
            {communityLinks.map((link) => <NavLink key={link.href} {...link} />)}
          </nav>
        </div>

        <div>
          <SectionLabel label={lang === "ar" ? "الشمولية والإتاحة" : "Inclusivity"} />
          <nav className="flex flex-col gap-0.5">
            {inclusivityLinks.map((link) => <NavLink key={link.href} {...link} />)}
          </nav>
        </div>

        <div>
          <SectionLabel label={lang === "ar" ? "الإدارة" : "Administration"} />
          <nav className="flex flex-col gap-0.5">
            {adminLinks.map((link) => <NavLink key={link.href} {...link} />)}
          </nav>
        </div>
      </div>

      {/* User profile */}
      <div className="p-3 border-t border-sidebar-border shrink-0">
        {profile ? (
          <div className={cn("flex items-center gap-3 rounded-xl bg-sidebar-accent/50 p-3", isRtl && "flex-row-reverse")}>
            <Avatar className="size-9 border border-sidebar-border shrink-0">
              <AvatarFallback className="bg-primary text-primary-foreground font-bold text-sm">
                {profile.avatarInitials || "PT"}
              </AvatarFallback>
            </Avatar>
            <div className={cn("flex flex-col overflow-hidden", isRtl && "text-right")}>
              <span className="truncate text-sm font-semibold text-white">{profile.username}</span>
              <span className="text-xs text-primary font-medium">{profile.driverLevel} {t('driverLabel')}</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-xl bg-sidebar-accent/50 p-3">
            <div className="size-9 rounded-full bg-sidebar-accent animate-pulse shrink-0" />
            <div className="flex flex-col gap-1 w-full">
              <div className="h-3 w-20 bg-sidebar-accent rounded animate-pulse" />
              <div className="h-2 w-12 bg-sidebar-accent rounded animate-pulse" />
            </div>
          </div>
        )}
        {!authLoading && (
          <button
            onClick={() => { void (isAuthenticated ? logout() : login()) }}
            className={cn(
              "w-full mt-2 flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors text-white bg-sidebar-accent/80 hover:bg-sidebar-accent",
              isRtl && "flex-row-reverse"
            )}
          >
            {isAuthenticated ? <LogOut className="size-3.5 shrink-0 text-white" /> : <LogIn className="size-3.5 shrink-0 text-white" />}
            {isAuthenticated
              ? (isRtl ? "تسجيل الخروج" : "Sign Out")
              : (isRtl ? "تسجيل الدخول" : "Sign In")}
          </button>
        )}
      </div>
    </div>
  )
}
