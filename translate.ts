import fs from 'fs';
import path from 'path';

const appPath = path.join(process.cwd(), 'src/App.tsx');
const serverPath = path.join(process.cwd(), 'server.ts');
const htmlPath = path.join(process.cwd(), 'index.html');

let appContent = fs.readFileSync(appPath, 'utf8');
let serverContent = fs.readFileSync(serverPath, 'utf8');
let htmlContent = fs.readFileSync(htmlPath, 'utf8');

// HTML
htmlContent = htmlContent.replace('dir="rtl"', 'dir="ltr"');
htmlContent = htmlContent.replace('lang="ar"', 'lang="en"');
htmlContent = htmlContent.replace('<title>Vite + React + TS</title>', '<title>ForSales Growth System</title>');
fs.writeFileSync(htmlPath, htmlContent);

// App.tsx Replacements
const appReplacements: Record<string, string> = {
  'dir="rtl"': 'dir="ltr"',
  'text-right': 'text-left',
  'قاعدة البيانات نشطة': 'Database Active',
  'جامع البيانات قيد التشغيل': 'Collector Running',
  'نظام نمو مبيعات ForSales': 'ForSales Growth System',
  'لوحة تحكم CRM والمبيعات': 'CRM & Sales Dashboard',
  'النظام المتكامل لجمع بيانات الشركات الصغيرة في المملكة المتحدة (بدءًا من مانشستر) وإدارة حملات التواصل البريدي الذكية وتحليل مؤشرات نمو خط المبيعات.': 'The integrated system for collecting small business data, managing smart outreach campaigns, and analyzing sales pipeline growth indicators.',
  'الشركات في قاعدة البيانات': 'Companies in Database',
  'رسائل أُرسلت اليوم': 'Emails Sent Today',
  'الشركات التي تواصلنا معها': 'Contacted Companies',
  'العملاء المحولين (مدفوع)': 'Converted Clients (Paid)',
  'معدل التحويل الكلي': 'Overall Conversion Rate',
  'إضافة شركة يدويًا': 'Add Company Manually',
  'تصدير لـ Excel': 'Export to Excel',
  'إدارة وتصفية قاعدة البيانات (CRM)': 'Database Management & Filtering (CRM)',
  'الفرز حسب الحالة:': 'Filter by Status:',
  'الكل': 'All',
  'لم يتم التواصل': 'Not Contacted',
  'تم إرسال الدعوة': 'Invitation Sent',
  'فتح الرسالة': 'Opened Email',
  'فعل الحساب': 'Account Activated',
  'نشر إعلانًا': 'Posted Ad',
  'أصبح عميلًا مدفوعًا': 'Became Paid Client',
  'بحث باسم الشركة أو البريد...': 'Search by company name or email...',
  'الشركة والنشاط': 'Company & Activity',
  'معلومات الاتصال': 'Contact Info',
  'حالة التواصل': 'Outreach Status',
  'تاريخ أول تواصل': 'First Contact Date',
  'إجراءات': 'Actions',
  'جامع البيانات الذكي (Data Collector)': 'Smart Data Collector',
  'أداة الأتمتة للبحث وجلب بيانات الشركات وتفاصيل الاتصال من الأدلة العامة مثل Yell.': 'Automation tool for searching and extracting company data and contact details from public directories like Yell.',
  'تحديد النطاق الجغرافي والنشاط': 'Define Geographic Scope and Activity',
  'النشاط التجاري المستهدف': 'Target Business Activity',
  'مخابز ومطاعم': 'Bakeries & Restaurants',
  'عيادات ومراكز أسنان': 'Dental Clinics',
  'سيارات مستعملة': 'Used Cars',
  'تقنية معلومات': 'Information Technology',
  'خدمات تنظيف': 'Cleaning Services',
  'محاماة وقانون': 'Law & Legal',
  'اكتب نشاطًا مخصصًا (مثال: سيارات مستعملة)': 'Type custom activity (e.g., Used Cars)',
  'المدينة المستهدفة': 'Target City',
  'اختر مدينة أو ابحث': 'Choose a city or search',
  'مانشستر (Manchester - نقطة البداية)': 'Manchester',
  'لندن (London)': 'London',
  'ليفربول (Liverpool)': 'Liverpool',
  'برمنغهام (Birmingham)': 'Birmingham',
  'اكتب اسم مدينة أخرى...': 'Type another city name...',
  'إعدادات محرك البحث': 'Search Engine Settings',
  'محرك البحث المفضل': 'Preferred Search Engine',
  'استخدام مفتاح Gemini API المدخل في الإعدادات (بحث دقيق وحي)': 'Use Gemini API key entered in settings (accurate & live search)',
  'بدء جمع البيانات': 'Start Data Collection',
  'إيقاف الجمع': 'Stop Collection',
  'لوحة مراقبة العمليات الحية': 'Live Operations Monitor',
  'شريط التقدم للبحث الحالي': 'Current Search Progress',
  'لا يوجد بحث نشط حاليًا.': 'No active search currently.',
  'سجل الأحداث المباشر': 'Live Event Log',
  'لم تبدأ أي عملية بعد. السجل فارغ.': 'No operation started yet. Log is empty.',
  'استيراد شركات من ملفات خارجية (Excel / CSV / JSON)': 'Import Companies from External Files (Excel / CSV / JSON)',
  'هل لديك ملف شركات جاهز للعمل؟ اسحب الملف أو اختره ليتم إدخاله فورًا في CRM الخاص بك.': 'Do you have a ready-made company file? Drag or select the file to insert it immediately into your CRM.',
  'اسحب الملف وأفلته هنا للتحميل المباشر': 'Drag and drop the file here for direct upload',
  'يدعم ملفات .CSV أو .JSON. يجب أن يحتوي الملف على عمود "الاسم" (Name) كشرط رئيسي.': 'Supports .CSV or .JSON files. The file must contain a "Name" column as a primary condition.',
  'تصفح الملف من جهازك': 'Browse file from your device',
  'مدير حملات التواصل (Outreach)': 'Outreach Campaign Manager',
  'إدارة قوالب البريد، إعدادات الـ SMTP، وإرسال الدعوات المجمعة للشركات المستهدفة.': 'Manage email templates, SMTP settings, and send bulk invitations to target companies.',
  'وحدة الإرسال والتحكم بالحملة': 'Sending Unit and Campaign Control',
  'الحد الأقصى للإرسال اليومي:': 'Maximum Daily Limit:',
  'رسالة / يوم': 'messages / day',
  'رسائل أُرسلت اليوم:': 'Messages Sent Today:',
  'بدء حملة الإرسال': 'Start Sending Campaign',
  'جاري الإرسال...': 'Sending...',
  'إيقاف الحملة مؤقتًا': 'Pause Campaign',
  'صياغة قالب الدعوات المخصصة للحملة': 'Draft Customized Invitation Template for the Campaign',
  'صمم رسالتك باستخدام التاغات الديناميكية التي يتم استبدالها تلقائيًا بكل شركة.': 'Design your message using dynamic tags that are automatically replaced for each company.',
  'عنوان رسالة البريد الإلكتروني': 'Email Subject',
  'محتوى رسالة الدعوة': 'Invitation Email Content',
  'مفاتيح التخصيص التلقائي المدعومة:': 'Supported Auto-Customization Tags:',
  '{اسم_الشركة}': '{Company_Name}',
  '{المدينة}': '{City}',
  '{اسم_المسؤول}': '{Contact_Person}',
  '{رابط_التفعيل}': '{Activation_Link}',
  'إعدادات خادم الـ SMTP وبريد الموقع': 'SMTP Server & Website Email Settings',
  'خادم SMTP (SMTP Host)': 'SMTP Server (SMTP Host)',
  'منفذ SMTP (SMTP Port)': 'SMTP Port',
  'مستخدم SMTP (البريد المرسل)': 'SMTP User (Sender Email)',
  'حد الإرسال اليومي الآمن': 'Safe Daily Sending Limit',
  'حفظ إعدادات وتعديلات القالب والـ SMTP': 'Save Settings, Template, & SMTP Edits',
  'السجل التاريخي لإرسال حملات الدعوات': 'Historical Log of Sent Invitation Campaigns',
  'قائمة بآخر الرسائل الصادرة التي تم تسليمها من النظام.': 'List of the latest outgoing messages delivered from the system.',
  'اسم الشركة المستلمة': 'Receiving Company Name',
  'البريد الإلكتروني': 'Email',
  'موضوع الرسالة': 'Message Subject',
  'وقت الإرسال': 'Time Sent',
  'الحالة': 'Status',
  'نجاح التسليم': 'Delivery Success',
  'فشل': 'Failed',
  'لا يوجد سجل إرسال سابق حتى الآن. قم ببدء حملتك الأولى من وحدة الإرسال.': 'No previous sending log yet. Start your first campaign from the sending unit.',
  'إضافة شركة جديدة يدويًا لقاعدة البيانات': 'Add New Company Manually to Database',
  'اسم الشركة *': 'Company Name *',
  'النشاط التجاري': 'Business Activity',
  'مثال: مطاعم ومخابز': 'e.g., Restaurants & Bakeries',
  'المدينة (المملكة المتحدة)': 'City',
  'رقم الهاتف': 'Phone Number',
  'الموقع الإلكتروني': 'Website',
  'رابط صفحة الشركة / دليل Yell': 'Company Page / Yell Directory Link',
  'اسم الشخص المسؤول (المدير)': 'Contact Person Name (Manager)',
  'مثال: أليكس هانتر': 'e.g., Alex Hunter',
  'إلغاء': 'Cancel',
  'حفظ البيانات وإضافتها': 'Save and Add Data',
  'مثال: مخبز مانشستر الفاخر': 'e.g., Luxury Manchester Bakery',
  'مانشستر': 'Manchester',
  'لندن': 'London',
  'ليفربول': 'Liverpool',
  'برمنغهام': 'Birmingham'
};

for (const [ar, en] of Object.entries(appReplacements)) {
  appContent = appContent.split(ar).join(en);
}

// Additional specific replaces for App.tsx Dropdown
appContent = appContent.replace(
  /<select\n\s+value=\{city\}\n\s+onChange=\{\(e\) => setCity\(e\.target\.value\)\}\n\s+className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3 py-2 outline-none"\n\s+>\n(.*?)<\/select>/s,
  `<select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3 py-2 outline-none"
                  >
                    <optgroup label="England" className="bg-slate-900 text-slate-400 font-bold">
                      <option value="London" className="bg-slate-950 text-slate-200 font-normal">London</option>
                      <option value="Birmingham" className="bg-slate-950 text-slate-200 font-normal">Birmingham</option>
                      <option value="Manchester" className="bg-slate-950 text-slate-200 font-normal">Manchester</option>
                      <option value="Leeds" className="bg-slate-950 text-slate-200 font-normal">Leeds</option>
                      <option value="Sheffield" className="bg-slate-950 text-slate-200 font-normal">Sheffield</option>
                      <option value="Liverpool" className="bg-slate-950 text-slate-200 font-normal">Liverpool</option>
                      <option value="Bristol" className="bg-slate-950 text-slate-200 font-normal">Bristol</option>
                      <option value="Newcastle" className="bg-slate-950 text-slate-200 font-normal">Newcastle</option>
                    </optgroup>
                    <optgroup label="Germany" className="bg-slate-900 text-slate-400 font-bold">
                      <option value="Berlin" className="bg-slate-950 text-slate-200 font-normal">Berlin</option>
                      <option value="Hamburg" className="bg-slate-950 text-slate-200 font-normal">Hamburg</option>
                      <option value="Munich" className="bg-slate-950 text-slate-200 font-normal">Munich</option>
                      <option value="Cologne" className="bg-slate-950 text-slate-200 font-normal">Cologne</option>
                      <option value="Frankfurt" className="bg-slate-950 text-slate-200 font-normal">Frankfurt</option>
                      <option value="Stuttgart" className="bg-slate-950 text-slate-200 font-normal">Stuttgart</option>
                      <option value="Dusseldorf" className="bg-slate-950 text-slate-200 font-normal">Düsseldorf</option>
                      <option value="Leipzig" className="bg-slate-950 text-slate-200 font-normal">Leipzig</option>
                    </optgroup>
                    <optgroup label="France" className="bg-slate-900 text-slate-400 font-bold">
                      <option value="Paris" className="bg-slate-950 text-slate-200 font-normal">Paris</option>
                      <option value="Marseille" className="bg-slate-950 text-slate-200 font-normal">Marseille</option>
                      <option value="Lyon" className="bg-slate-950 text-slate-200 font-normal">Lyon</option>
                      <option value="Toulouse" className="bg-slate-950 text-slate-200 font-normal">Toulouse</option>
                      <option value="Nice" className="bg-slate-950 text-slate-200 font-normal">Nice</option>
                      <option value="Nantes" className="bg-slate-950 text-slate-200 font-normal">Nantes</option>
                      <option value="Strasbourg" className="bg-slate-950 text-slate-200 font-normal">Strasbourg</option>
                      <option value="Montpellier" className="bg-slate-950 text-slate-200 font-normal">Montpellier</option>
                    </optgroup>
                  </select>`
);

appContent = appContent.replace(
  /<select\n\s+value=\{newCompany\.city\}\n\s+onChange=\{\(e\) => setNewCompany\(\{ \.\.\.newCompany, city: e\.target\.value \}\)\}\n\s+className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3 py-2 outline-none"\n\s+>\n(.*?)<\/select>/s,
  `<select
                    value={newCompany.city}
                    onChange={(e) => setNewCompany({ ...newCompany, city: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3 py-2 outline-none"
                  >
                    <optgroup label="England" className="bg-slate-900 text-slate-400 font-bold">
                      <option value="London" className="bg-slate-950 text-slate-200 font-normal">London</option>
                      <option value="Birmingham" className="bg-slate-950 text-slate-200 font-normal">Birmingham</option>
                      <option value="Manchester" className="bg-slate-950 text-slate-200 font-normal">Manchester</option>
                      <option value="Leeds" className="bg-slate-950 text-slate-200 font-normal">Leeds</option>
                      <option value="Sheffield" className="bg-slate-950 text-slate-200 font-normal">Sheffield</option>
                      <option value="Liverpool" className="bg-slate-950 text-slate-200 font-normal">Liverpool</option>
                      <option value="Bristol" className="bg-slate-950 text-slate-200 font-normal">Bristol</option>
                      <option value="Newcastle" className="bg-slate-950 text-slate-200 font-normal">Newcastle</option>
                    </optgroup>
                    <optgroup label="Germany" className="bg-slate-900 text-slate-400 font-bold">
                      <option value="Berlin" className="bg-slate-950 text-slate-200 font-normal">Berlin</option>
                      <option value="Hamburg" className="bg-slate-950 text-slate-200 font-normal">Hamburg</option>
                      <option value="Munich" className="bg-slate-950 text-slate-200 font-normal">Munich</option>
                      <option value="Cologne" className="bg-slate-950 text-slate-200 font-normal">Cologne</option>
                      <option value="Frankfurt" className="bg-slate-950 text-slate-200 font-normal">Frankfurt</option>
                      <option value="Stuttgart" className="bg-slate-950 text-slate-200 font-normal">Stuttgart</option>
                      <option value="Dusseldorf" className="bg-slate-950 text-slate-200 font-normal">Düsseldorf</option>
                      <option value="Leipzig" className="bg-slate-950 text-slate-200 font-normal">Leipzig</option>
                    </optgroup>
                    <optgroup label="France" className="bg-slate-900 text-slate-400 font-bold">
                      <option value="Paris" className="bg-slate-950 text-slate-200 font-normal">Paris</option>
                      <option value="Marseille" className="bg-slate-950 text-slate-200 font-normal">Marseille</option>
                      <option value="Lyon" className="bg-slate-950 text-slate-200 font-normal">Lyon</option>
                      <option value="Toulouse" className="bg-slate-950 text-slate-200 font-normal">Toulouse</option>
                      <option value="Nice" className="bg-slate-950 text-slate-200 font-normal">Nice</option>
                      <option value="Nantes" className="bg-slate-950 text-slate-200 font-normal">Nantes</option>
                      <option value="Strasbourg" className="bg-slate-950 text-slate-200 font-normal">Strasbourg</option>
                      <option value="Montpellier" className="bg-slate-950 text-slate-200 font-normal">Montpellier</option>
                    </optgroup>
                  </select>`
);

fs.writeFileSync(appPath, appContent);

// Server.ts Replacements
const serverReplacements: Record<string, string> = {
  'مانشستر للحلول التقنية (Manchester Tech)': 'Manchester Tech Solutions',
  'تسويق مانشستر الإبداعي (MCR Marketing)': 'MCR Creative Marketing',
  'المسؤول العام': 'General Manager',
  'لم يتم التواصل': 'Not Contacted',
  'تم إرسال الدعوة': 'Invitation Sent',
  'أصبح عميلًا مدفوعًا': 'Became Paid Client',
  'نشر إعلانًا': 'Posted Ad',
  'فعل الحساب': 'Account Activated',
  'فتح الرسالة': 'Opened Email',
  'مانشستر': 'Manchester',
  'اسم الشركة باللغتين العربية والانجليزية إن أمكن (مثال: مخبز مانشستر كراست (MCR Crust))': 'Company Name in English (e.g., MCR Crust Bakery)',
  'معارض سيارات مستعملة وتجارة السيارات': 'Used Car Dealerships and Trading',
  'بيع سيارات مستعملة وفحص فني': 'Used Cars Sales & Technical Inspection',
  'سيارات مستعملة فاخرة ورياضية': 'Luxury & Sports Used Cars',
  'تجارة سيارات مستعملة وتصدير': 'Used Cars Trading & Export',
  'سيارات رباعية الدفع مستعملة عائلية': 'Family 4x4 Used Cars',
  'سيارات مستعملة اقتصادية وصغيرة': 'Economy & Small Used Cars',
  'صيانة سيارات وميكانيك': 'Car Maintenance & Mechanics',
  'تعليم وتدريب': 'Education & Training',
  'مخابز ومطاعم': 'Bakeries & Restaurants',
  'خدمات قانونية ومحاماة': 'Legal Services & Law',
  'صالونات وتجميل': 'Salons & Beauty',
  'تنظيف وخدمات منزلية': 'Cleaning & Home Services',
  'مانشستر كارز المحدودة (Manchester Cars Ltd)': 'Manchester Cars Ltd',
  'سيارات بيكاديللي المستعملة (Piccadilly Used Cars)': 'Piccadilly Used Cars',
  'مجموعة سيارات مانشستر برستيج (MCR Prestige Cars Group)': 'MCR Prestige Cars Group',
  'أوتو تريدر مانشستر - صالة سيارات مستعملة (AutoTrader Manchester - Trade Outlet)': 'AutoTrader Manchester - Trade Outlet',
  'معرض الدفع الرباعي مانشستر (Manchester 4x4 & SUV Centre)': 'Manchester 4x4 & SUV Centre',
  'معرض السيارات الاقتصادية مانشستر (MCR Budget Cars)': 'MCR Budget Cars',
  'مركز مانشستر لصيانة السيارات (MCR Auto Services)': 'MCR Auto Services',
  'أكاديمية الشمال للغات والتطوير (Northern Academy)': 'Northern Academy',
  'مقهى ومطعم رويال أواك (Royal Oak Cafe)': 'Royal Oak Cafe',
  'مكتب المحاماة الوطني - فرع مانشستر (Justice Law MCR)': 'Justice Law MCR',
  'صالون التجميل والأناقة الملكية (Glow & Elegant)': 'Glow & Elegant Beauty Salon',
  'شركة النظافة والتعقيم الشامل (Manchester Cleaners)': 'Manchester Cleaners',
  'ريتشارد إيفانز (Richard Evans)': 'Richard Evans',
  'سيمون ديفيز (Simon Davies)': 'Simon Davies',
  'مارك هاريسون (Mark Harrison)': 'Mark Harrison',
  'جاك ستيفنز (Jack Stevens)': 'Jack Stevens',
  'توماس ميلر (Thomas Miller)': 'Thomas Miller',
  'إيميلي وود (Emily Wood)': 'Emily Wood',
  'جاك هانتر (Jack Hunter)': 'Jack Hunter',
  'إيميلي هيل (Emily Hill)': 'Emily Hill',
  'توم كوك (Tom Cook)': 'Tom Cook',
  'جيمس بوند (James Bond)': 'James Bond',
  'سارة كينغ (Sarah King)': 'Sarah King',
  'بيتر ميك (Peter Meek)': 'Peter Meek',
  'مرحبًا جون دو، يسعدنا دعوتكم لتفعيل حساب شركتكم مانشستر للحلول التقنية...': 'Hello John Doe, we are pleased to invite you to activate your company account...',
  'نشاط مستورد': 'Imported Activity',
  'لم يتم العثور على شركات تطابق المعايير': 'No companies found matching criteria',
  'لم يتم العثور على مفتاح Gemini API صالح في النظام.': 'No valid Gemini API key found in the system.',
  'جاري الانتقال التلقائي إلى محاكي البحث عالي الدقة في الأدلة العامة...': 'Auto-switching to high-precision search simulator in public directories...',
  'الاتصال بدليل Yell UK ودليل أعمال مدينة': 'Connecting to public directories for city',
  'المحلي للأبحاث والفرز...': 'for research and filtering...',
  'تحليل هيكل الصفحات واستخراج أرقام الهواتف وروابط تفعيل المواقع وتفاصيل الاتصال...': 'Analyzing page structure and extracting phone numbers, website activation links, and contact details...',
  'فحص عناوين البريد الإلكتروني المتاحة للعامة وضمان الامتثال لقواعد حماية البيانات البريطانية...': 'Scanning public email addresses and ensuring compliance with Data Protection regulations...',
  'اكتمل البحث بنجاح! تم إيجاد وتصفية البيانات واستيراد': 'Search completed successfully! Found, filtered, and imported',
  'شركة فريدة جديدة للنشاط': 'unique new companies for activity',
  'تم تصفية التكرارات وإدخال': 'Duplicates filtered and inserted',
  'شركة جديدة إلى قاعدة البيانات.': 'new companies into the database.',
  'فشلت العملية:': 'Operation failed:',
  'تم إيقاف حملة إرسال الدعوات يدويًا.': 'Outreach campaign paused manually.',
  'الحملة قيد الإرسال بالفعل': 'Campaign is already sending',
  'لا توجد شركات بحالة \'Not Contacted\' ولديها بريد إلكتروني صالح.': 'No companies with status \'Not Contacted\' and a valid email.',
  'بدء حملة البريد الإلكتروني الجديدة. المستهدف اليومي المتاح:': 'Starting new email campaign. Daily target available:',
  'رسالة.': 'messages.',
  'جاري الاتصال بخادم الـ SMTP:': 'Connecting to SMTP server:',
  'بدأت حملة التواصل بنجاح': 'Outreach campaign started successfully',
  'اكتمل إرسال جميع الرسائل المقررة لليوم بنجاح!': 'Successfully sent all scheduled messages for today!',
  'صاحب العمل الموقر': 'Respected Business Owner',
  '{اسم_الشركة}': '{Company_Name}',
  '{المدينة}': '{City}',
  '{اسم_المسؤول}': '{Contact_Person}',
  '{رابط_التفعيل}': '{Activation_Link}',
  'نجاح': 'Success',
  'فشل': 'Failed',
  '[تم الإرسال] إلى:': '[Sent] to:',
  '[خطأ في الإرسال] بريد مرتجع أو خادم غير مستجيب:': '[Sending Error] Bounced email or unresponsive server:',
  'يجب إرسال مصفوفة صالحة تحتوي على الشركات': 'A valid array of companies must be sent',
  'لا توجد شركات بحالة \\\'لم يتم التواصل\\\' ولديها بريد إلكتروني صالح.': 'No companies with status \\\'Not Contacted\\\' and a valid email.'
};

for (const [ar, en] of Object.entries(serverReplacements)) {
  serverContent = serverContent.split(ar).join(en);
}

fs.writeFileSync(serverPath, serverContent);

console.log("Translation complete!");
