import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@workspace/replit-auth-web';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useI18n } from '@/lib/i18n-context';
import { LogIn } from 'lucide-react';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { lang, isRtl } = useI18n();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(); // Using Replit Auth login for now as per project template
      setLocation('/dashboard');
    } catch (err) {
      alert(lang === 'ar' ? 'بيانات الدخول غير صحيحة' : 'Invalid credentials');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4" dir={isRtl ? 'rtl' : 'ltr'}>
      <Card className="w-full max-w-md shadow-xl border-none">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">{lang === 'ar' ? 'تسجيل الدخول' : 'Sign In'}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {lang === 'ar' ? 'مرحباً بك مجدداً في منصة بالتور' : 'Welcome back to PalTur Platform'}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}</label>
              <Input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{lang === 'ar' ? 'كلمة المرور' : 'Password'}</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full gap-2">
              <LogIn className="size-4" />
              {isLoading ? (lang === 'ar' ? 'جاري الدخول...' : 'Signing in...') : (lang === 'ar' ? 'دخول' : 'Sign In')}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-muted-foreground">
            {lang === 'ar' ? 'ليس لديك حساب؟ تواصل مع الإدارة' : "Don't have an account? Contact Admin"}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
