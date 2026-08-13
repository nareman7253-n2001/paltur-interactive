# دليل تشغيل ونشر `PalTur.Api` على Render وNeon PostgreSQL

**النطاق:** يشرح هذا الدليل نشر الخادم الخلفي لـ PalTur المبني بـ **ASP.NET Core 8** من المجلد `PalTur.Api`، ربطه بقاعدة **PostgreSQL** عبر Neon، ثم توصيله بواجهة React المنشورة على Vercel.

> لا تنشئ قاعدة Neon أو خدمة Render أو بيانات الدخول داخل GitHub. يجب إدخال جميع بيانات الاعتماد حصراً من خلال متغيرات البيئة السرية في Render وVercel.

## 1. حالة جاهزية الكود

تم تنفيذ عناصر الإنتاج التالية والتحقق من بناء الخادم محلياً دون أخطاء:

| المتطلب | الحالة الحالية | الملف أو المسار المعني |
|---|---|---|
| قاعدة بيانات EF Core وPostgreSQL | جاهزة | `Data/ApplicationDbContext.cs` |
| أول migration | موجودة وجاهزة للتطبيق | `PalTur.Api/Migrations/20260813142316_InitialCreate.cs` |
| CORS | مقيّد على Vercel وبيئة التطوير المحلية | `Program.cs` و`appsettings.json` |
| Health check | متاح بدون مصادقة | `GET /health` |
| JWT | مفعل مع مفتاح مطلوب بطول 32 حرفاً على الأقل | `Program.cs` و`AuthController.cs` |
| كلمات المرور | تتحقق عبر `PasswordHasher` فقط | `AuthController.cs` |
| البلاغات | تتطلب JWT وتستخدم هوية المستخدم من الـ token | `ComplaintsController.cs` |
| تهيئة الإنتاج | تطبيق migrations وإنشاء مدير أولي اختيارياً | `Data/ProductionDatabaseInitializer.cs` |
| Docker | حاوية .NET 8 تستمع على المنفذ `10000` | `PalTur.Api/Dockerfile` |

## 2. إنشاء قاعدة Neon PostgreSQL

أنشئ مشروعاً جديداً من [Neon Console](https://console.neon.tech/app/projects)، ثم افتح **Connect** واختر إعدادات **.NET / Npgsql** وانسخ **pooled connection string**. استخدم السلسلة التي تتضمن SSL والتحقق الكامل من الشهادة كما تعرضها Neon.[1]

ضع السلسلة في Render فقط. تكون بصيغة شبيهة بالتالي، مع استبدال جميع القيم بالقيم المنسوخة من Neon:

```text
Host=ep-xxxxxx.region.aws.neon.tech;Database=neondb;Username=neondb_owner;Password=***;SSL Mode=VerifyFull;Channel Binding=Require
```

## 3. إعداد تطبيق migrations

الـ migration الأساسية موجودة بالفعل في المستودع؛ **لا تشغّل `migrations add InitialCreate` مرة ثانية**. اختر إحدى الطريقتين التاليتين:

| الطريقة | متى تستخدمها | الإجراء |
|---|---|---|
| التطبيق التلقائي | لنشر PalTur الأول على Neon | اجعل `Database__ApplyMigrationsOnStartup=true` في Render، وسيطبق الخادم migrations عند الإقلاع. |
| التطبيق اليدوي | عند الحاجة إلى مراجعة التغيير قبل كل إصدار | صدّر سلسلة Neon إلى متغير البيئة وشغّل أمر EF Core أدناه مرة واحدة. |

للتطبيق اليدوي من جذر المستودع:

```bash
export ConnectionStrings__DefaultConnection='ضع_هنا_سلسلة_Neon_الكاملة'
/home/ubuntu/.dotnet/tools/dotnet-ef database update \
  --project PalTur.Api/PalTur.Api.csproj \
  --startup-project PalTur.Api/PalTur.Api.csproj
```

> عند استخدام التطبيق التلقائي في Render، يجب ضبط `Database__ApplyMigrationsOnStartup=true`. بعد نجاح النشر الأول، يمكن تغييرها إلى `false` واستخدام التطبيق اليدوي لأي migrations مستقبلية تتطلب مراجعة تشغيلية.

## 4. إعداد Dockerfile

الملف `PalTur.Api/Dockerfile` موجود وجاهز. اترك **Docker Build Context** في Render عند جذر المستودع، لأن أوامر `COPY` تشير إلى `PalTur.Api/`. يستمع التطبيق داخلياً على المنفذ `10000` عبر `ASPNETCORE_URLS=http://+:10000`.

يوجد أيضاً `.dockerignore` في الجذر لاستبعاد `bin` و`obj` و`node_modules` وملفات البيئة المحلية من سياق بناء الحاوية.

## 5. إنشاء Web Service في Render

من [Render Dashboard](https://dashboard.render.com/) اختر **New → Web Service**، ثم اربط مستودع GitHub `nareman7253-n2001/paltur-interactive`. استخدم هذه القيم:

| الحقل في Render | القيمة |
|---|---|
| Branch | `main` |
| Language | `Docker` |
| Root Directory | اتركه فارغاً أو `.` |
| Dockerfile Path | `PalTur.Api/Dockerfile` |
| Docker Build Context | جذر المستودع |
| Health Check Path | `/health` |
| Auto-Deploy | مفعّل للفرع `main` |

أضف متغيرات البيئة التالية من صفحة **Environment**. تستخدم ASP.NET Core الشرطتين السفليتين (`__`) للمفاتيح المتداخلة.[2]

| المفتاح | القيمة |
|---|---|
| `ASPNETCORE_ENVIRONMENT` | `Production` |
| `ConnectionStrings__DefaultConnection` | سلسلة Neon pooled connection string كاملة |
| `JwtSettings__Key` | مفتاح عشوائي سري بطول 32 حرفاً أو أكثر |
| `JwtSettings__Issuer` | `PalTur` |
| `JwtSettings__Audience` | `PalTurClients` |
| `JwtSettings__ExpiryMinutes` | `60` |
| `Database__ApplyMigrationsOnStartup` | `true` للنشر الأول |
| `BootstrapAdmin__Email` | بريد حساب المدير الأول |
| `BootstrapAdmin__Password` | كلمة مرور قوية خاصة بالمدير الأول |
| `BootstrapAdmin__FullName` | اختياري، الاسم المعروض للمدير |

بعد إدخالها، اضغط **Save, rebuild, and deploy**. احتفظ بعنوان الخدمة الناتج، على سبيل المثال:

```text
https://paltur-api.onrender.com
```

## 6. ربط Vercel بالخادم الحي

افتح مشروع Vercel **paltur-interactive** ثم انتقل إلى **Settings → Environment Variables**. أضف القيم التالية إلى بيئة **Production**، وإلى Preview إن كانت المعاينات تحتاج API حية:

| المفتاح | القيمة |
|---|---|
| `VITE_API_BASE_URL` | `https://paltur-api.onrender.com` |
| `VITE_DATA_MODE` | `api` |

بعد حفظ المتغيرات، نفّذ **Redeploy** أو ادفع commit جديداً إلى `main`. متغيرات Vite تُدمج وقت البناء، ولذلك لا تظهر القيمة في الواجهة المنشورة قبل إعادة البناء.

إذا استُخدم نطاق مخصص للواجهة لاحقاً، أضفه بالضبط إلى `Cors:AllowedOrigins` في إعداد Render بصيغة JSON، أو وسّع قائمة النطاقات في `appsettings.json` ثم انشر الخادم من جديد. لا تستخدم `AllowAnyOrigin()` في الإنتاج.

## 7. اختبار ما بعد النشر

بعد أن تعلن Render أن الخدمة **Live**، اختبر الصحة أولاً:

```bash
curl -i https://paltur-api.onrender.com/health
```

ثم اختبر تسجيل الدخول بحساب المدير الذي عُيّن في متغيرات Render:

```bash
curl -sS -X POST https://paltur-api.onrender.com/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@paltur.com","password":"كلمة_مرور_المدير"}'
```

انسخ قيمة `token` من الاستجابة. لإرسال بلاغ، مررها في ترويسة المصادقة. لا ترسل `userId`؛ الخادم يستخرجه بأمان من الـ JWT:

```bash
curl -i -X POST https://paltur-api.onrender.com/api/complaints \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer ضع_الرمز_هنا' \
  -d '{"title":"تجربة","location":"رام الله","description":"بلاغ اختبار","category":"test"}'
```

وأخيراً افتح [واجهة الإنتاج](https://paltur-interactive.vercel.app/dashboard)، ثم اختبر تسجيل الدخول وإرسال بلاغ. يجب أن تتجه طلبات الشبكة إلى نطاق Render، لا إلى `/api` في نطاق Vercel.

## 8. استكشاف الأخطاء الشائعة

| العرض | السبب المحتمل | الحل |
|---|---|---|
| `502` أو فشل Health Check | الخادم لم يبدأ أو Dockerfile غير صحيح | راجع سجل Render وتأكد من `PalTur.Api/Dockerfile` و`/health`. |
| فشل بدء API برسالة إعداد الاتصال | سلسلة Neon غير موجودة أو غير صالحة | أدخلها كاملة في `ConnectionStrings__DefaultConnection`. |
| فشل التحقق من JWT عند بدء التطبيق | مفتاح JWT أقل من 32 حرفاً أو مفقود | أدخل `JwtSettings__Key` قوياً وسرياً، مع issuer/audience الصحيحين. |
| الجداول غير موجودة | migration لم تطبق | فعّل `Database__ApplyMigrationsOnStartup=true` أو نفّذ `dotnet-ef database update`. |
| فشل تسجيل الدخول | حساب المدير لم ينشأ أو كلمة المرور غير صحيحة | راجع متغيرات `BootstrapAdmin__Email` و`BootstrapAdmin__Password` وسجل بدء Render. |
| يظهر خطأ CORS | نطاق الواجهة غير مدرج | أضف نطاق Vercel الدائم أو المخصص إلى `Cors:AllowedOrigins`، ثم انشر API. |
| رد `401` من البلاغات | لا توجد ترويسة Bearer صالحة | سجّل الدخول أولاً وأرسل `Authorization: Bearer <token>`. |

## 9. قائمة أمان قبل الإنتاج

تأكد أن `appsettings.json` لا يحتوي كلمة مرور Neon أو مفتاح JWT. لا تعرّض Swagger في الإنتاج، ودوّر أي مفتاح تم إدخاله في سجل أو مشاركته خطأً. احصر CORS في نطاقات موثوقة فقط، واحفظ كلمة مرور حساب المدير خارج المستودع.

## المراجع

[1] [Neon — Connect a .NET application with Npgsql](https://neon.com/docs/guides/dotnet-npgsql)

[2] [Render — Environment variables and secrets](https://render.com/docs/configure-environment-variables)
