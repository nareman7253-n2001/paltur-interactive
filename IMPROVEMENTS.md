# سجل تطوير Interactive-Web

تمت مراجعة المشروع متعدد الحزم وإصلاح المشكلات التي كانت تمنع فحص TypeScript والبناء الكامل. شملت التعديلات تطبيق الويب، تطبيق الهاتف، الحزم المشتركة، وإعدادات Vite وpnpm.

## الإصلاحات المنفذة

| المجال | التعديل |
|---|---|
| TypeScript project references | إضافة إعدادات `composite` وخرائط التصريحات إلى حزمة `replit-auth-web` حتى تعمل مراجع المشاريع في `tsc --build`. |
| تطبيق الهاتف | استبدال رمز `calendar.fill` غير المدعوم بالرمز المتوافق `calendar.badge.clock`، وتصحيح نوع palette في `useColors` دون خلطه مع قيمة `radius`. |
| تطبيق الويب | نقل `RouteRequest` إلى الاستيراد العام من `@workspace/api-client-react` بدلاً من مسار داخلي غير قابل للحل. |
| إزالة التكرار | حذف تصديرات `api` و`api.schemas` المكررة من نقطة دخول `api-client-react`. |
| إعدادات Vite | إضافة قيم افتراضية آمنة لـ `PORT` و`BASE_PATH` في تطبيقي الويب وmockup حتى يعمل البناء محلياً وضمن CI دون متغيرات Replit. |
| pnpm | تسجيل السماح ببناء `esbuild` داخل إعداد مساحة العمل حتى لا يفشل تثبيت الاعتمادات أو الفحص. |

## التحقق

تم تنفيذ الأوامر التالية بنجاح بعد التعديلات:

```bash
pnpm install --frozen-lockfile
pnpm run typecheck
EXPO_PUBLIC_DOMAIN=localhost:8081 pnpm run build
```

يتطلب بناء Expo للنشر الفعلي قيمة `REPLIT_INTERNAL_APP_DOMAIN` أو `REPLIT_DEV_DOMAIN` أو `EXPO_PUBLIC_DOMAIN`. استُخدم نطاق محلي مؤقت أثناء التحقق داخل البيئة المعزولة.

## ملاحظة البناء

ينتج تطبيق `urban-up` تحذيراً غير مانع يتعلق بكِبر حجم حزمة JavaScript النهائية؛ البناء يكتمل بنجاح، ويمكن تحسين ذلك لاحقاً عبر تقسيم الصفحات باستخدام `dynamic import` إذا كان تقليل حجم التحميل الأولي أولوية.
