import fs from 'fs';
import path from 'path';

const appPath = path.join(process.cwd(), 'src/App.tsx');
const serverPath = path.join(process.cwd(), 'server.ts');

let appContent = fs.readFileSync(appPath, 'utf8');
let serverContent = fs.readFileSync(serverPath, 'utf8');

const appReplacements: Record<string, string> = {
  'شركة': 'Company',
  'شركات': 'Companies',
  'الدعوات المرسلة والمجدولة': 'Sent and Scheduled Invitations',
  'دعوة': 'Invitation',
  'فتح الرسائل والاهتمام': 'Opened Messages & Interest',
  'مهتم': 'Interested',
  'الحسابات المفعلة على المنصة': 'Activated Accounts on Platform',
  'حساب': 'Account',
  'نشر الإعلانات التسويقية': 'Published Marketing Ads',
  'إعلان': 'Ad',
  'العملاء المشتركون بالباقات المدفوعة (الهدف النهائي)': 'Subscribed Customers to Paid Plans (Final Goal)',
  'عميل': 'Client',
  'سجل الشركات وخط المبيعات الكامل': 'Companies Log & Full Sales Pipeline',
  'ابحث وقم بتصفية الشركات وتحديث الحالات أو تفعيل المحاكاة السريعة.': 'Search, filter companies, update statuses, or activate quick simulation.',
  'إزالة الشركات المكررة تلقائيًا بناءً على الاسم أو Email': 'Remove duplicate companies automatically by name or Email',
  'تنظيف وحذف المكرر': 'Clean and Remove Duplicates',
  'ابحث باسم الشركة، النشاط، البريد...': 'Search by company name, activity, email...',
  'جميع الحالات': 'All Statuses',
  'رفض': 'Declined',
  'جميع المدن': 'All Cities',
  'عرض': 'Showing',
  'من أصل': 'out of',
  'المدينة والاتصال': 'City & Contact',
  'تفاصيل المسؤول': 'Manager Details',
  'مرات التواصل': 'Contact Count',
  'الحالية': 'Current',
  'أدوات المحاكاة والتحكم': 'Simulation & Control Tools',
  'لا توجد شركات مضافة حاليًا تطابق معايير البحث.': 'No companies currently added that match search criteria.',
  'ابدأ بجمع البيانات باستخدام جامع البيانات الذكي أو أضف شركة يدويًا.': 'Start collecting data using the smart data collector or add a company manually.',
  'غير محدد': 'Unspecified',
  'عرض المصدر العام': 'View Public Source',
  'أول اتصال:': 'First Contact:',
  'تغيير Status تلقائيًا لمحاكاة تفاعل هذا العميل خطوة بخطوة': 'Automatically change status to simulate client interaction step by step',
  'محاكاة تفاعل': 'Simulate Interaction',
  'حذف': 'Delete',
  'معايير تجميع الشركات': 'Company Collection Criteria',
  'حدد فئة Business Activity والمدينة في المملكة المتحدة للبدء في البحث والجمع التلقائي.': 'Select the Business Activity category and city to start automatic search and collection.',
  'أو اكتب نشاطًا تجاريًا آخر مخصص...': 'Or type another custom business activity...',
  'Target City (المملكة المتحدة UK)': 'Target City',
  'مستخرج البيانات المدعوم بالذكاء الاصطناعي': 'AI-Powered Data Extractor',
  'يعمل النظام في المملكة المتحدة لإنتاج قوائم كاملة تحتوي على المواقع الإلكترونية والمسؤولين والبريد العام.': 'The system produces complete lists containing websites, managers, and public emails.',
  'إذا كان مفتاح الـ API متاحًا، سيتولى Gemini البحث والترشيح الفعلي. وإلا، ستقوم المنظومة بمحاكاة البحث في Yell UK بدقة.': 'If the API key is available, Gemini will handle actual search and filtering. Otherwise, the system accurately simulates a directory search.',
  'البدء في استخراج البيانات': 'Start Extracting Data',
  'إيقاف مؤقت للعملية': 'Pause Process',
  'وحدة المراقبة المباشرة للجمع والمحاكاة': 'Live Monitoring Unit for Collection and Simulation',
  'معدل الامتثال لقواعد الاستخدام 100% لتجنب الحظر.': 'Compliance rate with terms of use is 100% to avoid bans.',
  'نسبة التقدم Allي للجمع': 'Overall Collection Progress',
  'تم اكتشاف وإضافة': 'Discovered and added',
  'فريدة جديدة إلى CRM حتى الآن في هذه الجلسة.': 'new unique companies to CRM so far in this session.',
  'شاشة المراقبة فارغة حاليًا. اضغط على "استخراج البيانات" للبدء في تشغيل العمليات.': 'Monitoring screen currently empty. Click "Start Extracting Data" to begin operations.',
  'تنبيه الأمان والخصوصية: يحترم هذا البرنامج شروط استخدام الأدلة العامة ولا يقوم بإرسال طلبات مكثفة أو سريعة. تم تزويد محرك البحث بمؤقتات ذكية (Delays) تتراوح بين 2-3 ثوانٍ لحماية عنوان الـ IP من الحظر وضمان سلامة البيانات.': 'Security & Privacy Alert: This program respects terms of use of public directories and does not send intensive or fast requests. The search engine is equipped with smart delays (2-3 seconds) to protect the IP address and ensure data integrity.',
  'تم استيراد': 'Imported',
  'جديدة بSuccess!': 'new companies successfully!',
  'تنسيق الملف غير صالح': 'Invalid file format',
  'منفذ SMTP Port': 'SMTP Port',
  'اسم المستخدم': 'Username',
  'الحد اليومي لإرسال الرسائل (تفادي البلوك)': 'Daily Message Limit (Avoid Bans)'
};

const serverReplacements: Record<string, string> = {
  'استخرج أو ولد قائمة بـ 8 شركات صغيرة حقيقية أو واقعية للغاية': 'Extract or generate a list of 8 real or highly realistic small businesses',
  '(مثال: مخبز Manchester كراست (MCR Crust))': '(e.g., MCR Crust Bakery)'
};

for (const [ar, en] of Object.entries(appReplacements)) {
  appContent = appContent.split(ar).join(en);
}

for (const [ar, en] of Object.entries(serverReplacements)) {
  serverContent = serverContent.split(ar).join(en);
}

// Ensure regex in server.ts handles english words for cars
serverContent = serverContent.replace(
  /const isCarCategory = \/سيار\|car\|auto\|deal\|vehic\/i\.test\(category\);/g,
  'const isCarCategory = /car|auto|deal|vehic/i.test(category);'
);

fs.writeFileSync(appPath, appContent);
fs.writeFileSync(serverPath, serverContent);

console.log("Translation pass 3 complete!");
