import fs from 'fs';
import path from 'path';

const appPath = path.join(process.cwd(), 'src/App.tsx');
const serverPath = path.join(process.cwd(), 'server.ts');

let appContent = fs.readFileSync(appPath, 'utf8');
let serverContent = fs.readFileSync(serverPath, 'utf8');

// Advanced English replacements
const appReplacements: Record<string, string> = {
  'محرك الإرسال وحالة تسليم الدعوات': 'Outreach Engine & Delivery Status',
  'تواصل أوتوماتيكي متقاطع مع تتبع حالة التسليم المباشر.': 'Automated cross-communication with live delivery status tracking.',
  'إجمالي الانتظار': 'Total Queued',
  'نجح الإرسال': 'Sent Successfully',
  'بلاك لست/Failed': 'Blacklist / Failed',
  'التقدم العام للحملة الحالية': 'Overall Progress of Current Campaign',
  'بدء حملة التواصل والتسليم المبرمج': 'Start Outreach Campaign & Scheduled Delivery',
  'إيقاف مؤقت للحملة': 'Pause Campaign',
  'لا يوجد نشاط إرسال نشط في اللحظة الحالية.': 'No active sending activity at the moment.',
  'تاريخ وساعة الإرسال': 'Date and Time Sent',
  'نجاح': 'Success'
};

const serverReplacements: Record<string, string> = {
  'تقنية معلومات وبرمجيات': 'IT & Software',
  'جون دو (John Doe)': 'John Doe',
  'مخبز الشمال التقليدي (Northern Crust)': 'Northern Crust Bakery',
  'مخبوزات ومطاعم': 'Bakeries & Restaurants',
  'أليس سميث (Alice Smith)': 'Alice Smith',
  'عيادة بيكاديللي لطب الأسنان (Piccadilly Dental)': 'Piccadilly Dental Clinic',
  'عيادة طبية ورعاية صحية': 'Medical Clinic & Healthcare',
  'د. ديفيد براون (Dr. David Brown)': 'Dr. David Brown',
  'تسويق رقمي وإعلانات': 'Digital Marketing & Ads',
  'سارة ويليامز (Sarah Williams)': 'Sarah Williams',
  'دعوة لتفعيل حسابك في منصة ForSales Growth': 'Invitation to activate your account on ForSales Growth',
  'مرحبًا جون دو، يسعدنا دعوتكم لتفعيل حساب شركتكم Manchester للحلول التقنية...': 'Hello John Doe, we are pleased to invite you to activate your company account...',
  'تفعيل حساب ForSales الخاص بـ مخبز الشمال التقليدي': 'Activate ForSales account for Northern Crust Bakery',
  'مرحبًا أليس سميث، شكرًا لانضمامكم لمنظومتنا النمو المالي لقطاع الأغذية...': 'Hello Alice Smith, thank you for joining our financial growth system...',
  'دعوة حصرية لتفعيل حسابك على منصة ForSales - {Company_Name}': 'Exclusive invitation to activate your ForSales account - {Company_Name}',
  'مرحبًا {Contact_Person}،\\n\\nلقد رصدنا Successات شركتكم المميزة {Company_Name} في مدينة {City}، ويسعدنا دعوتكم لتفعيل حسابكم المجاني والبدء في تلقي طلبات العملاء الإضافية فورًا.\\n\\nرابط تفعيل الحساب الخاص بكم:\\n{Activation_Link}\\n\\nنتمنى لكم نموًا متسارعًا!\\nفريق ForSales Growth': 'Hello {Contact_Person},\n\nWe have noticed the distinct success of {Company_Name} in {City}, and we are pleased to invite you to activate your free account and start receiving additional customer requests immediately.\n\nYour account activation link:\n{Activation_Link}\n\nWe wish you accelerated growth!\nForSales Growth Team',
  'شركة جديدة': 'New Company',
  'غير محدد': 'Unspecified',
  'رفض': 'Declined',
  'تم إيقاف عملية جمع البيانات يدويًا من قبل المستخدم.': 'Data collection manually stopped by user.',
  'النشاط والمدينة مطلوبان': 'Activity and City are required',
  'عملية الجمع قيد التشغيل بالفعل': 'Collection process already running',
  'بدء نظام جمع بيانات الشركات للنشاط:': 'Starting company data collection system for activity:',
  'في مدينة': 'in city',
  'جاري فحص الأدلة العامة ومواقع تصنيف الأعمال في المملكة المتحدة...': 'Scanning public directories and business rating sites...',
  'بدأت عملية الجمع بSuccess': 'Collection process started successfully',
  'تم تفعيل الذكاء الاصطناعي Gemini لاستخراج وتوليد بيانات دقيقة ومحاكاة البحث...': 'Gemini AI activated for extraction and accurate data generation...',
  'أنت خبير في أبحاث السوق وجمع البيانات للمبيعات (Sales Prospecting).': 'You are an expert in market research and sales data collection.',
  'استخرج أو ولد قائمة بـ 8 شركات صغيرة حقيقية أو واقعية للغاية في مدينة': 'Extract or generate a list of 8 real or highly realistic small companies in city',
  'بالمملكة المتحدة تعمل في نشاط': 'in the UK operating in activity',
  'يجب أن تحتوي كل شركة على تفاصيل كاملة ودقيقة ومتناسقة مع طبيعة الأعمال في المملكة المتحدة.': 'Each company must have complete, accurate details consistent with UK business nature.',
  'أرجع النتيجة على شكل مصفوفة JSON فقط من دون أي مقدمات أو علامات تشكيلية.': 'Return the result as a JSON array only without any prefixes or markdown formatting.',
  'يجب أن تتطابق الحقول تمامًا مع التنسيق التالي:': 'Fields must match exactly this format:',
  'اسم الشركة باللغتين العربية والانجليزية إن أمكن': 'Company Name in English',
  'النشاط التجاري التفصيلي بالعربية': 'Detailed business activity in English',
  'موقع إلكتروني صالح مثل': 'Valid website like',
  'بريد إلكتروني عام منشور صالح ومناسب للشركة مثل': 'Valid public email suitable for the company like',
  'رقم هاتف بريطاني مناسب للبلدة مثل': 'UK phone number suitable for the town like',
  'رابط صفحة الشركة على دليل أعمال مثل': 'Link to company page on business directory like',
  'اسم الشخص المسؤول بالعربية مثل جون دو': 'Name of the contact person in English like John Doe',
  'جاري إرسال الطلب الذكي للبحث والفرز وحذف البيانات غير الصالحة...': 'Sending smart request for search, filtering, and removing invalid data...',
  'Failed في معالجة استجابة الذكاء الاصطناعي': 'Failed to process AI response',
  'تم استلام': 'Received',
  'شركة فريدة بSuccess من الذكاء الاصطناعي.': 'unique companies successfully from AI.',
  'Manchester كارز المحدودة (Manchester Cars Ltd)': 'Manchester Cars Ltd',
  'مجموعة سيارات Manchester برستيج (MCR Prestige Cars Group)': 'MCR Prestige Cars Group',
  'أوتو تريدر Manchester - صالة سيارات مستعملة (AutoTrader Manchester - Trade Outlet)': 'AutoTrader Manchester - Trade Outlet',
  'معرض الدفع الرباعي Manchester (Manchester 4x4 & SUV Centre)': 'Manchester 4x4 & SUV Centre',
  'معرض السيارات الاقتصادية Manchester (MCR Budget Cars)': 'MCR Budget Cars',
  'مركز Manchester لصيانة السيارات (MCR Auto Services)': 'MCR Auto Services',
  'مكتب المحاماة الوطني - فرع Manchester (Justice Law MCR)': 'Justice Law MCR',
  'بSuccess': 'successfully',
  'Successات': 'successes'
};

for (const [ar, en] of Object.entries(appReplacements)) {
  appContent = appContent.split(ar).join(en);
}

for (const [ar, en] of Object.entries(serverReplacements)) {
  serverContent = serverContent.split(ar).join(en);
}

fs.writeFileSync(appPath, appContent);
fs.writeFileSync(serverPath, serverContent);

console.log("Translation pass 2 complete!");
