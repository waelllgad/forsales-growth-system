import fs from 'fs';
import path from 'path';

const appPath = path.join(process.cwd(), 'src/App.tsx');
const serverPath = path.join(process.cwd(), 'server.ts');

let appContent = fs.readFileSync(appPath, 'utf8');
let serverContent = fs.readFileSync(serverPath, 'utf8');

const arToEn: Record<string, string> = {
  'الCompanies': 'Companies',
  'الCompany': 'Company',
  'Companyات': 'Companies',
  'Information Technology وبرمجيات': 'Information Technology & Software',
  'اسم الCompany مطلوب': 'Company Name is required',
  'تم إضافة الCompany بSuccess إلى قاعدة البيانات': 'Company added successfully to the database',
  'Failed في إضافة الCompany': 'Failed to add Company',
  'خطأ في الاتصال بالخادم': 'Server connection error',
  'هل أنت متأكد من Delete هذه الCompany نهائيًا؟': 'Are you sure you want to permanently delete this company?',
  'تم Delete الCompany بSuccess': 'Company deleted successfully',
  'Failed الDelete': 'Delete failed',
  'تم تنظيف التكرارات! تم إزالة': 'Duplicates cleaned! Removed',
  'Company مكررة.': 'duplicate companies.',
  'Failed في تنظيف التكرارات': 'Failed to clean duplicates',
  'محاكاة: تم تغيير حالة': 'Simulation: Status changed for',
  'إلى:': 'to:',
  'تم إطلاق جامع البيانات الذكي بSuccess': 'Smart data collector launched successfully',
  'Failed بدء جامع البيانات': 'Failed to start data collector',
  'تم إيقاف عملية جمع البيانات': 'Data collection stopped',
  'تم إطلاق حملة إرسال الدعوات المخصصة': 'Custom invitation campaign launched',
  'Failed بدء الحملة': 'Failed to start campaign',
  'تم إيقاف حملة الإرسال مؤقتًا': 'Sending campaign paused',
  'تم حفظ إعدادات الـ SMTP والقالب المخصص بSuccess': 'SMTP and custom template settings saved successfully',
  'Failed في حفظ الإعدادات': 'Failed to save settings',
  'تم تحديث Status بSuccess': 'Status updated successfully',
  'الملف غير صالح أو التنسيق خاطئ': 'Invalid file or incorrect format',
  'لا توجد بيانات لتصديرها': 'No data to export',
  'اسم الCompany': 'Company Name',
  'النشاط': 'Activity',
  'المدينة': 'City',
  'الهاتف': 'Phone',
  'رابط الدليل': 'Directory Link',
  'المسؤول': 'Manager',
  'تاريخ الإضافة': 'Date Added',
  'تم تصدير ملف الCompanies المتوافق مع Excel بSuccess': 'Excel-compatible Companies file exported successfully',
  'باقة مدفوعة': 'Paid Plan',
  'إشعار النظام': 'System Notification',
  'المملكة المتحدة UK': 'UK',
  'المستهدفة': 'Targeted',
  'إجمالي من تم جمعهم': 'Total Collected',
  'الدعوات المرسلة': 'Sent Invitations',
  'نسبة': 'Percentage',
  'من الCompanies': 'of Companies',
  'الرسائل المفتوحة': 'Opened Messages',
  'فتح': 'Open',
  'Accountات مفعلة': 'Activated Accounts',
  'تفعيل': 'Activation',
  'Adات منشورة': 'Published Ads',
  'نشاط تسويقي للعملاء': 'Marketing activity for clients',
  'باقات مدفوعة': 'Paid Plans',
  'معدل تحويل': 'Conversion Rate',
  'قمع التحويل لنمو المبيعات (Sales Conversion Funnel)': 'Sales Conversion Funnel',
  'التي جمعناها': 'Collected',
  'ابحث وقم بتصفية الCompanies وتحديث الحالات أو تفعيل المحاكاة السريعة.': 'Search, filter Companies, update statuses, or activate quick simulation.',
  'إزالة الCompanies المكررة تلقائيًا بناءً على الاسم أو Email': 'Remove duplicate Companies automatically by Name or Email',
  'ابحث باسم الCompany، النشاط، البريد...': 'Search by Company name, activity, email...',
  'لا توجد Companies مضافة حاليًا تطابق معايير البحث.': 'No Companies added currently matching the search criteria.',
  'ابدأ بجمع البيانات باستخدام جامع البيانات الذكي أو أضف Company يدويًا.': 'Start collecting data using the smart data collector or add a Company manually.',
  'Showing المصدر العام': 'Show Public Source',
  'تغيير Status تلقائيًا لSimulate Interaction هذا الClient خطوة بخطوة': 'Change Status automatically to Simulate Interaction for this Client step by step',
  'معايير تجميع الCompanies': 'Company Collection Criteria',
  'بSuccess': 'Successfully',
  'Successات': 'Successes',
  'Failed في': 'Failed to',
  'Failed': 'Failed',
  'Status': 'Status',
  'Simulate Interaction': 'Simulate Interaction',
  'Client': 'Client',
  'Email': 'Email',
  'Website': 'Website',
  'Company': 'Company',
  'Showing': 'Showing',
  'Delete': 'Delete',
  'Account': 'Account',
  'Ad': 'Ad'
};

const serverReplacements2: Record<string, string> = {
  'بدأت عملية الجمع بSuccessfully': 'Collection process started successfully',
  'تم إرسال الدعوة': 'Invitation Sent',
  'لم يتم التواصل': 'Not Contacted',
  'نشاط مستورد': 'Imported Activity',
  'المسؤول العام': 'General Manager',
  'أصبح عميلاً مدفوعاً': 'Became Paid Client',
  'تم تصفية التكرارات وإدخال': 'Duplicates filtered and inserted',
  'شركة جديدة إلى قاعدة البيانات.': 'new companies to the database.',
  'تم تفعيل الذكاء الاصطناعي Gemini لاستخراج وتوليد بيانات دقيقة ومحاكاة البحث...': 'Gemini AI activated to extract and generate accurate data and simulate search...',
  'جاري إرسال الطلب الذكي للبحث والفرز وحذف البيانات غير الصالحة...': 'Sending smart request to search, filter, and remove invalid data...',
  'تم استلام': 'Received',
  'شركة فريدة بSuccessfully من الذكاء الاصطناعي.': 'unique companies successfully from AI.',
  'فشلت العملية:': 'Operation failed:',
  'تم إيقاف حملة إرسال الدعوات يدويًا.': 'Outreach campaign paused manually.',
  'لا توجد شركات بحالة': 'No companies with status',
  'ولديها بريد إلكتروني صالح.': 'and valid email.',
  'بدء حملة البريد الإلكتروني الجديدة. المستهدف اليومي المتاح:': 'Started new email campaign. Available daily target:',
  'رسالة.': 'message.',
  'جاري الاتصال بخادم الـ SMTP:': 'Connecting to SMTP server:',
  'بدأت حملة التواصل بSuccessfully': 'Outreach campaign started successfully',
  'اكتمل إرسال جميع الرسائل المقررة لليوم بنجاح!': 'Successfully sent all scheduled messages for today!',
  'دعوة لتفعيل حسابك في منصة ForSales Growth': 'Invitation to activate your account on ForSales Growth',
  'مرحبًا جون دو، يسعدنا دعوتكم لتفعيل حساب شركتكم Manchester للحلول التقنية...': 'Hello John Doe, we are pleased to invite you to activate your company account...',
  'تفعيل حساب ForSales الخاص بـ مخبز الشمال التقليدي': 'Activate ForSales account for Northern Crust Bakery',
  'مرحبًا أليس سميث، شكرًا لانضمامكم لمنظومتنا النمو المالي لقطاع الأغذية...': 'Hello Alice Smith, thank you for joining our financial growth system...',
  'دعوة حصرية لتفعيل حسابك على منصة ForSales - {Company_Name}': 'Exclusive invitation to activate your ForSales account - {Company_Name}',
  'مرحبًا {Contact_Person}،\\n\\nلقد رصدنا Successes شركتكم المميزة {Company_Name} في مدينة {City}، ويسعدنا دعوتكم لتفعيل حسابكم المجاني والبدء في تلقي طلبات العملاء الإضافية فورًا.\\n\\nرابط تفعيل الحساب الخاص بكم:\\n{Activation_Link}\\n\\nنتمنى لكم نموًا متسارعًا!\\nفريق ForSales Growth': 'Hello {Contact_Person},\n\nWe have noticed the distinct success of {Company_Name} in {City}, and we are pleased to invite you to activate your free account and start receiving additional customer requests immediately.\n\nYour account activation link:\n{Activation_Link}\n\nWe wish you accelerated growth!\nForSales Growth Team',
  '[تم الإرسال] إلى:': '[Sent] to:',
  '[خطأ في الإرسال] بريد مرتجع أو خادم غير مستجيب:': '[Sending Error] Bounced email or unresponsive server:',
  'يجب إرسال مصفوفة صالحة تحتوي على الشركات': 'A valid array containing the companies must be sent',
  'شركة': 'Company',
  'شركات': 'Companies',
  'دعوة': 'Invitation',
  'رسائل': 'Messages',
  'رسالة': 'Message',
  'مدير': 'Manager',
  'حساب': 'Account',
  'مبيعات': 'Sales',
  'نجاح': 'Success',
  'فشل': 'Failed',
  'بSuccessfully': 'Successfully',
  'Successes': 'Successes',
  'Failed في': 'Failed to',
  'Failed': 'Failed',
  'Status': 'Status',
  'Simulate Interaction': 'Simulate Interaction',
  'Client': 'Client',
  'Email': 'Email',
  'Website': 'Website',
  'Company': 'Company',
  'Showing': 'Showing',
  'Delete': 'Delete',
  'Account': 'Account',
  'Ad': 'Ad'
};

for (const [ar, en] of Object.entries(arToEn)) {
  appContent = appContent.split(ar).join(en);
}

for (const [ar, en] of Object.entries(serverReplacements2)) {
  serverContent = serverContent.split(ar).join(en);
}

// Ensure regex in server.ts handles english words for cars
serverContent = serverContent.replace(
  /const isCarCategory = \/سيار\|car\|auto\|deal\|vehic\/i\.test\(category\);/g,
  'const isCarCategory = /car|auto|deal|vehic/i.test(category);'
);

fs.writeFileSync(appPath, appContent);
fs.writeFileSync(serverPath, serverContent);

console.log("Translation pass 4 complete!");
