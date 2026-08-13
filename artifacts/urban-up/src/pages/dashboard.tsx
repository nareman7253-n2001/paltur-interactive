import { useEffect } from "react";
import { Link } from "wouter";
import { AppLayout } from "@/components/layout/AppLayout";
import {
  useGetDashboardSummary,
  useGetActivityFeed
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertTriangle,
  Calendar,
  Leaf,
  MapPin,
  Navigation,
  ShieldAlert,
  Trash2,
  Trophy,
  LogIn,
  Send,
  ArrowRight,
  LayoutDashboard
} from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { useI18n } from "@/lib/i18n-context";
import { cn } from "@/lib/utils";
import { useContent, getLocalizedText } from "@/lib/content-context";
import { useAuth } from "@workspace/replit-auth-web";
import {
  isMockMode,
  mockActivityFeed,
  mockDashboardSummary,
} from "@/lib/mock-data";

export default function Dashboard() {
  const { t, isRtl, lang } = useI18n();
  const { content } = useContent();
  const { isAuthenticated, login } = useAuth();
  const dashboardContent = content.dashboard;

  const { data: summaryData } = useGetDashboardSummary({
    query: { queryKey: ['/api/dashboard/summary'], enabled: !isMockMode },
  });
  const { data: feedData } = useGetActivityFeed({
    query: { queryKey: ['/api/dashboard/activity-feed'], enabled: !isMockMode },
  });

  const summary = isMockMode ? mockDashboardSummary : summaryData;
  const feed = isMockMode ? mockActivityFeed : Array.isArray(feedData) ? feedData : [];

  const getModuleIcon = (module: string) => {
    switch (module) {
      case 'traffic':       return <Navigation className="size-4 text-blue-500" />;
      case 'waste':         return <Trash2 className="size-4 text-green-500" />;
      case 'accessibility': return <ShieldAlert className="size-4 text-orange-500" />;
      case 'tourism':       return <MapPin className="size-4 text-foreground/60" />;
      case 'points':        return <Trophy className="size-4 text-yellow-500" />;
      default:              return <MapPin className="size-4 text-muted-foreground" />;
    }
  };

  const stats = [
    {
      label: t('activeTraffic'),
      sub: t('reportsThisHour'),
      value: summary?.activeTrafficReports ?? 0,
      icon: <Navigation className="size-4 text-orange-600 dark:text-orange-400" />,
      bg: "bg-orange-100 dark:bg-orange-900/20",
      delay: 0.1,
    },
    {
      label: t('pendingWaste'),
      sub: t('awaitingPickup'),
      value: summary?.pendingWasteReports ?? 0,
      icon: <Trash2 className="size-4 text-green-600 dark:text-green-400" />,
      bg: "bg-green-100 dark:bg-green-900/20",
      delay: 0.2,
    },
    {
      label: t('pathObstacles'),
      sub: t('affectingAccess'),
      value: summary?.activeObstacles ?? 0,
      icon: <ShieldAlert className="size-4 text-red-600 dark:text-red-400" />,
      bg: "bg-red-100 dark:bg-red-900/20",
      delay: 0.3,
    },
    {
      label: t('eventsThisWeek'),
      sub: t('culturalCommunity'),
      value: summary?.eventsThisWeek ?? 0,
      icon: <Calendar className="size-4 text-foreground dark:text-foreground/80" />,
      bg: "bg-muted",
      delay: 0.4,
    },
  ];

  const quickActions = [
    { href: "/safe-paths", label: lang === "ar" ? "المسارات الآمنة" : "Safe Paths", icon: MapPin },
    { href: "/report-obstacle", label: lang === "ar" ? "أبلغ عن عقبة" : "Report Obstacle", icon: AlertTriangle },
    { href: "/complaints", label: lang === "ar" ? "الشكاوى" : "Complaints", icon: Send },
    { href: "/suggestions", label: lang === "ar" ? "المقترحات" : "Suggestions", icon: Trophy },
    { href: "/traffic", label: lang === "ar" ? "المرور والطرق" : "Traffic", icon: Navigation },
    { href: "/municipality", label: lang === "ar" ? "البلدية" : "Municipality", icon: LayoutDashboard },
  ];

  return (
    <AppLayout>
      <div className="flex flex-col gap-8 pb-10">
        {/* Hero Section */}
        <div className={cn("flex flex-col md:flex-row justify-between items-start md:items-center gap-4", isRtl && "md:flex-row-reverse")}>
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-primary">
              {getLocalizedText(dashboardContent.title, lang) || t('cityOverview')}
            </h1>
            <p className="text-xl text-muted-foreground mt-2 max-w-2xl">
              {getLocalizedText(dashboardContent.subtitle, lang) || t('cityOverviewSub')}
            </p>
          </div>
          {!isAuthenticated && (
            <Button size="lg" onClick={login} className="gap-2 shadow-lg hover:shadow-xl transition-all">
              <LogIn className="size-5" />
              {lang === "ar" ? "تسجيل الدخول للمنصة" : "Sign In to Platform"}
            </Button>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: s.delay }}
            >
              <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{s.label}</CardTitle>
                  <div className={cn("p-2.5 rounded-xl", s.bg)}>{s.icon}</div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{s.value}</div>
                  <p className="text-xs text-muted-foreground mt-1 font-medium">{s.sub}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions & Interactive Form */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <Card className="border-none shadow-md overflow-hidden bg-gradient-to-br from-primary/5 to-transparent">
              <CardHeader>
                <CardTitle className="text-xl font-bold">{lang === "ar" ? "الوصول السريع للخدمات" : "Quick Service Access"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {quickActions.map((action) => (
                    <Link key={action.href} href={action.href}>
                      <Button variant="outline" className="w-full h-24 flex flex-col gap-2 items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all border-dashed">
                        <action.icon className="size-6" />
                        <span className="text-sm font-semibold">{action.label}</span>
                      </Button>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Interactive Form Placeholder */}
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold">{lang === "ar" ? "أرسل تقريراً سريراً" : "Quick Report Submission"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{lang === "ar" ? "نوع البلاغ" : "Report Type"}</label>
                    <Input placeholder={lang === "ar" ? "مثلاً: عائق في الطريق" : "e.g. Road Obstacle"} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{lang === "ar" ? "الموقع" : "Location"}</label>
                    <Input placeholder={lang === "ar" ? "حدد الموقع التقريبي" : "Specify location"} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{lang === "ar" ? "التفاصيل" : "Details"}</label>
                  <textarea 
                    className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    placeholder={lang === "ar" ? "اشرح ما تلاحظه هنا..." : "Describe what you see..."}
                  />
                </div>
                <Button className="w-full md:w-auto px-8 gap-2">
                  <Send className="size-4" />
                  {lang === "ar" ? "إرسال البلاغ الآن" : "Submit Report Now"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Activity Feed */}
          <Card className="flex flex-col border-none shadow-md overflow-hidden h-fit">
            <CardHeader className="bg-muted/30 border-b">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Trophy className="size-5 text-yellow-500" />
                {t('liveCityFeed')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 max-h-[600px] overflow-auto">
              <div className="divide-y">
                {feed.map((item) => (
                  <div key={item.id} className={cn("p-5 flex gap-4 hover:bg-muted/20 transition-colors", isRtl && "flex-row-reverse")}>
                    <div className="mt-1 shrink-0 bg-primary/10 rounded-full p-2">
                      {getModuleIcon(item.module)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={cn("flex justify-between items-start gap-2", isRtl && "flex-row-reverse")}>
                        <p className="text-sm font-semibold truncate">
                          {item.username || t('anonymous')}
                        </p>
                        {item.points && (
                          <Badge variant="success" className="text-[10px] font-bold shrink-0">+{item.points}</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">{item.action}</p>
                      <p className="text-xs text-muted-foreground/60 mt-2 flex items-center gap-1">
                        <Calendar className="size-3" />
                        {format(new Date(item.createdAt), 'MMM d, h:mm a')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <div className="p-4 bg-muted/10 border-t">
              <Button variant="ghost" className="w-full text-xs font-bold gap-2 text-muted-foreground">
                {lang === "ar" ? "عرض المزيد من النشاطات" : "View More Activity"}
                <ArrowRight className={cn("size-3", isRtl && "rotate-180")} />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
