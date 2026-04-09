import { useState, useEffect, useRef } from "react";

// ============ FULL TRANSLATION DICTIONARY ============
const T = {
  en: {
    dir: "ltr",
    font: "'Outfit', sans-serif",
    langSwitch: "العربية",
    langFlag: "🇪🇬",
    // Nav
    navBenefits: "Benefits", navDiscounts: "Discounts", navNetwork: "Network",
    navRoi: "ROI Calculator", navCases: "Case Studies", navContact: "Contact",
    navCta: "Get Started", forBusiness: "for Business",
    // Hero
    heroTag: "🏢 Healthcare Benefits for Companies",
    heroTitle1: "Give your team", heroTitle2: "healthcare access", heroTitle3: "they deserve",
    heroDesc: "Shamel by Vezeeta gives your employees up to <b>80% discounts</b> on doctors, labs, pharmacies, and surgeries across <b>200,000+ providers</b> in Egypt.",
    heroCta1: "Get a Free Quote →", heroCta2: "Calculate ROI 📊",
    heroStat1v: "200K+", heroStat1l: "Providers",
    heroStat2v: "40%", heroStat2l: "Avg. Savings",
    heroStat3v: "EGP 550", heroStat3l: "Per Employee/Year",
    // Benefits
    benTag: "Why Shamel for Business?", benTitle1: "Benefits that matter to", benTitle2: "your company",
    benSub: "Shamel is not insurance. It's smarter, cheaper, and instant.",
    ben1t: "Boost Employee Retention", ben1d: "65% of employees rank health benefits as the #1 benefit. Offer Shamel and reduce turnover without the cost of traditional insurance.",
    ben2t: "Control Your Budget", ben2d: "Pay only for what your team uses. No surprise claims, no large insurance premiums. Fixed annual cost per employee starting at EGP 550.",
    ben3t: "Instant Activation", ben3d: "No waiting periods, no pre-existing condition exclusions, no complex paperwork. Send us a list, employees are active within 48 hours.",
    ben4t: "Boost Productivity", ben4d: "When employees can afford healthcare, they get treated faster and return to work sooner. Reduce absenteeism by up to 30%.",
    // Discounts
    discTag: "Medical Discounts", discTitle: "Save up to 80% on healthcare",
    discSub: "Your employees get instant discounts at point of service. No claims. No reimbursement. Just show the Shamel card.",
    discUpTo: "Up to",
    svc1: "Doctor Visits", svc2: "Lab Tests", svc3: "Radiology", svc4: "Pharmacy", svc5: "Surgeries", svc6: "Outpatient Services",
    // Network
    netTag: "Medical Network", netTitle: "Trusted by top healthcare providers",
    netSub: "Our network includes Egypt's most renowned hospitals, labs, radiology centers, and pharmacies.",
    netMore: "+ thousands more across all Egyptian governorates",
    // ROI
    roiTag: "📊 ROI Calculator", roiTitle: "Calculate your savings",
    roiSub: "See how much Shamel saves your company compared to traditional group insurance.",
    roiLabel: "Number of Employees", roiEmployees: "employees",
    roiShamel: "Shamel Annual Cost", roiInsurance: "Avg. Insurance Cost", roiSavings: "Your Savings",
    roiPerPerson: "/person", roiLess: "less",
    // Case Studies
    caseTag: "Success Stories", caseTitle: "Companies that trust Shamel",
    caseSub: "Real results from real companies using Shamel for their teams.",
    caseSaves: "Saves",
    cs1q: "Shamel helped us provide healthcare benefits to our entire team at a fraction of what traditional insurance would cost. Our retention improved within the first quarter.",
    cs1p: "Ahmed Hassan, HR Director", cs1s: "170 employees enrolled", cs1ind: "Real Estate",
    cs2q: "As a growing agency, we needed an affordable health benefit. Shamel gave us enterprise-level healthcare access at startup-friendly pricing.",
    cs2p: "Sarah Khaled, Founder", cs2s: "30 employees enrolled", cs2ind: "Digital Marketing",
    cs3q: "Our drivers and warehouse staff finally have access to quality healthcare. The network coverage across Egypt means they can use Shamel wherever they are.",
    cs3p: "Mohamed Fathy, Operations Manager", cs3s: "89 employees enrolled", cs3ind: "Logistics",
    // Form
    formTag: "Get Started", formTitle: "Request your free quote",
    formSub: "Fill in your details and our B2B team will contact you within 24 hours with a customized proposal.",
    formName: "Your Name", formCompany: "Company Name", formEmail: "Business Email",
    formPhone: "Phone Number", formEmployees: "Number of Employees", formMsg: "Message (Optional)",
    formSelect: "Select range", formRange1: "5-10 employees", formRange2: "11-49 employees",
    formRange3: "50-199 employees", formRange4: "200-499 employees", formRange5: "500+ employees",
    formBtn: "Submit Request — Get Quote in 24 Hours",
    formSecure: "🔒 Your information is secure and will only be used to contact you about Shamel.",
    formMsgPlaceholder: "Tell us about your needs...",
    formNamePlaceholder: "Ahmed Mohamed",
    formCompanyPlaceholder: "Your Company",
    formEmailPlaceholder: "ahmed@company.com",
    formSuccess: "Request Submitted!", formSuccessMsg: "Our team will contact you within 24 hours. Check your email for confirmation.",
    // Footer
    footerSub: "The future of healthcare benefits for Egyptian companies.",
    footerAdmin: "Admin Panel",
    // Chat
    chatTitle: "Shamel Assistant", chatSubtitle: "Ask me anything about Shamel B2B",
    chatPlaceholder: "Type your question...",
    chatWelcome: "👋 Welcome to Shamel for Business! I can help you with:\n\n• Pricing & plans\n• Discount details\n• Network coverage\n• How to get started\n\nWhat would you like to know?",
    chatQPricing: "Pricing", chatQDiscount: "Discounts", chatQStart: "How to start", chatQInsurance: "vs Insurance",
    chatPrice: "💰 **Shamel B2B Pricing:**\n\nOur corporate plans start at **EGP 550/employee/year** for companies with 10+ employees.\n\n• 10-49 employees: EGP 600/person\n• 50-199 employees: EGP 550/person\n• 200+ employees: Custom pricing\n\nWould you like a customized quote? Fill out the contact form!",
    chatDiscount: "🏷️ **Shamel Discounts:**\n\n• Doctor visits: Up to **40% off**\n• Lab tests: Up to **70% off**\n• Radiology: Up to **35% off**\n• Surgeries: Up to **35% off**\n• Outpatient services: Up to **80% off**\n• Pharmacy: Up to **16% off**\n\nAvailable across our entire network of 200,000+ providers!",
    chatNetwork: "🏥 **Our Medical Network includes:**\n\nTop hospitals: Dar Al Fouad, As-Salam International, Ibn Sina, Al-Amal\n\nLabs: Al Mokhtabar, Al Borg, CairoLab, Speed Labs, Ansary\n\nRadiology: Mega Scan, Cairo Scan, ProScan, Capital Scan\n\n+ thousands more providers across all of Egypt.",
    chatStart: "🚀 **Getting started is easy:**\n\n1. Fill out the contact form on this page\n2. Our B2B team will call you within 24 hours\n3. We customize a plan for your company size\n4. You share an employee list (name + phone)\n5. Employees get activated within 48 hours\n\nNo paperwork. No waiting periods. No exclusions.",
    chatInsurance: "🔄 **Shamel vs. Traditional Insurance:**\n\n✅ No waiting periods\n✅ No pre-existing condition exclusions\n✅ No claims processing\n✅ Instant activation\n✅ 10x cheaper than group insurance\n✅ No minimum company size\n✅ Pay only for what you use",
    chatRoi: (n) => `📊 **ROI Example for ${n} employees:**\n\nAnnual Shamel cost: ~EGP ${(n*550).toLocaleString()}\nAvg. healthcare savings: ~EGP ${(n*2400).toLocaleString()}/year\nNet benefit: ~EGP ${(n*1850).toLocaleString()}/year\n\n+ Reduced absenteeism\n+ Better employee retention\n+ Zero admin overhead\n\nTry our ROI calculator on the page! 📈`,
    chatFallback: "Thanks for your question! I can help with:\n\n• **Pricing** - Type 'price' or 'cost'\n• **Discounts** - Type 'discounts'\n• **Network** - Type 'network'\n• **How to start** - Type 'how to start'\n• **Shamel vs Insurance** - Type 'insurance'\n\nOr fill out the contact form and our team will reach out personally! 😊",
    // Admin
    adminTitle: "Admin Panel", adminLogin: "Login", adminBack: "← Back",
    adminPassword: "Password", adminViewSite: "View Site", adminLogout: "Logout",
    adminLeads: "📋 Leads", adminChat: "💬 Chat Log",
    adminTotalLeads: "Total Leads", adminNewLeads: "New", adminConverted: "Converted", adminChatMsgs: "Chat Messages",
    adminPipeline: "Lead Pipeline", adminNoLeads: "No leads found",
    adminNote: "Note:", adminNoMessages: "No messages yet",
    adminChatHistory: "Chat History",
  },
  ar: {
    dir: "rtl",
    font: "'Noto Sans Arabic', 'Outfit', sans-serif",
    langSwitch: "English",
    langFlag: "🇬🇧",
    navBenefits: "المزايا", navDiscounts: "الخصومات", navNetwork: "الشبكة الطبية",
    navRoi: "حاسبة التوفير", navCases: "قصص نجاح", navContact: "تواصل معنا",
    navCta: "ابدأ الآن", forBusiness: "للشركات",
    heroTag: "🏢 مزايا صحية للشركات",
    heroTitle1: "وفّر لفريقك", heroTitle2: "رعاية صحية", heroTitle3: "يستحقونها",
    heroDesc: "شامل من فيزيتا يمنح موظفيك خصومات تصل إلى <b>٨٠٪</b> على الأطباء والمعامل والصيدليات والعمليات عبر <b>أكثر من ٢٠٠ ألف</b> مقدم خدمة في مصر.",
    heroCta1: "← احصل على عرض مجاني", heroCta2: "📊 احسب التوفير",
    heroStat1v: "+٢٠٠ ألف", heroStat1l: "مقدم خدمة",
    heroStat2v: "٤٠٪", heroStat2l: "متوسط التوفير",
    heroStat3v: "٥٥٠ ج.م", heroStat3l: "لكل موظف/سنوياً",
    benTag: "لماذا شامل للشركات؟", benTitle1: "مزايا تهم", benTitle2: "شركتك",
    benSub: "شامل مش تأمين. شامل أذكى، أوفر، وفوري.",
    ben1t: "زيادة الاحتفاظ بالموظفين", ben1d: "٦٥٪ من الموظفين يعتبرون المزايا الصحية أهم ميزة. وفّر شامل لفريقك وقلل معدل الاستقالات بدون تكلفة التأمين التقليدي.",
    ben2t: "تحكم كامل في الميزانية", ben2d: "ادفع فقط على قدر الاستهلاك. بدون مفاجآت أو أقساط تأمين ضخمة. تكلفة سنوية ثابتة تبدأ من ٥٥٠ جنيه للموظف.",
    ben3t: "تفعيل فوري", ben3d: "بدون فترات انتظار، بدون استثناء أمراض سابقة، بدون ورق معقد. أرسل لنا قائمة الموظفين والتفعيل خلال ٤٨ ساعة.",
    ben4t: "رفع الإنتاجية", ben4d: "لما الموظفين يقدروا يتعالجوا بسرعة، يرجعوا للشغل أسرع. قلّل الغياب بنسبة تصل إلى ٣٠٪.",
    discTag: "الخصومات الطبية", discTitle: "وفّر حتى ٨٠٪ على الخدمات الصحية",
    discSub: "موظفينك يحصلوا على خصم فوري عند مقدم الخدمة. بدون مطالبات. بدون استرداد. بس أظهر كارت شامل.",
    discUpTo: "حتى",
    svc1: "كشف العيادات", svc2: "معامل التحاليل", svc3: "الأشعة", svc4: "مستلزمات الصيدلية", svc5: "العمليات", svc6: "خدمات العيادات الخارجية",
    netTag: "الشبكة الطبية", netTitle: "معتمد من أفضل مقدمي الخدمات الصحية",
    netSub: "شبكتنا تشمل أشهر المستشفيات والمعامل ومراكز الأشعة والصيدليات في مصر.",
    netMore: "+ آلاف مقدمي الخدمة في جميع محافظات مصر",
    roiTag: "📊 حاسبة التوفير", roiTitle: "احسب توفيرك",
    roiSub: "شوف شامل هيوفر لشركتك قد إيه مقارنة بالتأمين الجماعي التقليدي.",
    roiLabel: "عدد الموظفين", roiEmployees: "موظف",
    roiShamel: "تكلفة شامل السنوية", roiInsurance: "متوسط تكلفة التأمين", roiSavings: "التوفير",
    roiPerPerson: "/للموظف", roiLess: "أقل",
    caseTag: "قصص نجاح", caseTitle: "شركات تثق في شامل",
    caseSub: "نتائج حقيقية من شركات حقيقية تستخدم شامل لفرقها.",
    caseSaves: "يوفر",
    cs1q: "شامل ساعدنا نوفر مزايا صحية لكل الفريق بجزء بسيط من تكلفة التأمين التقليدي. معدل الاحتفاظ بالموظفين تحسن من أول ربع سنة.",
    cs1p: "أحمد حسن، مدير الموارد البشرية", cs1s: "١٧٠ موظف مشترك", cs1ind: "عقارات",
    cs2q: "كوكالة رقمية بتكبر، كنا محتاجين ميزة صحية بتكلفة معقولة. شامل وفر لنا وصول لخدمات صحية بمستوى الشركات الكبيرة بسعر مناسب للشركات الناشئة.",
    cs2p: "سارة خالد، المؤسسة", cs2s: "٣٠ موظف مشترك", cs2ind: "تسويق رقمي",
    cs3q: "السواقين وموظفين المخازن أخيراً عندهم وصول لرعاية صحية بجودة عالية. تغطية الشبكة في كل مصر يعني يقدروا يستخدموا شامل في أي مكان.",
    cs3p: "محمد فتحي، مدير العمليات", cs3s: "٨٩ موظف مشترك", cs3ind: "لوجستيات",
    formTag: "ابدأ الآن", formTitle: "اطلب عرض سعر مجاني",
    formSub: "املأ بياناتك وفريق المبيعات هيتواصل معاك خلال ٢٤ ساعة بعرض مخصص.",
    formName: "اسمك", formCompany: "اسم الشركة", formEmail: "البريد الإلكتروني",
    formPhone: "رقم الموبايل", formEmployees: "عدد الموظفين", formMsg: "رسالة (اختياري)",
    formSelect: "اختر النطاق", formRange1: "٥-١٠ موظفين", formRange2: "١١-٤٩ موظف",
    formRange3: "٥٠-١٩٩ موظف", formRange4: "٢٠٠-٤٩٩ موظف", formRange5: "+٥٠٠ موظف",
    formBtn: "أرسل الطلب — احصل على عرض خلال ٢٤ ساعة",
    formSecure: "🔒 بياناتك آمنة ولن تُستخدم إلا للتواصل معك بخصوص شامل.",
    formMsgPlaceholder: "قولنا عن احتياجاتك...",
    formNamePlaceholder: "أحمد محمد",
    formCompanyPlaceholder: "اسم شركتك",
    formEmailPlaceholder: "ahmed@company.com",
    formSuccess: "تم إرسال الطلب!", formSuccessMsg: "فريقنا هيتواصل معاك خلال ٢٤ ساعة. تابع بريدك الإلكتروني.",
    footerSub: "مستقبل المزايا الصحية للشركات المصرية.",
    footerAdmin: "لوحة التحكم",
    chatTitle: "مساعد شامل", chatSubtitle: "اسألني أي حاجة عن شامل للشركات",
    chatPlaceholder: "اكتب سؤالك...",
    chatWelcome: "👋 أهلاً بيك في شامل للشركات! أقدر أساعدك في:\n\n• الأسعار والباقات\n• تفاصيل الخصومات\n• الشبكة الطبية\n• طريقة الاشتراك\n\nعايز تعرف إيه؟",
    chatQPricing: "الأسعار", chatQDiscount: "الخصومات", chatQStart: "ازاي أبدأ", chatQInsurance: "مقارنة بالتأمين",
    chatPrice: "💰 **أسعار شامل للشركات:**\n\nباقات الشركات بتبدأ من **٥٥٠ جنيه/موظف/سنوياً** للشركات أكتر من ١٠ موظفين.\n\n• ١٠-٤٩ موظف: ٦٠٠ جنيه/موظف\n• ٥٠-١٩٩ موظف: ٥٥٠ جنيه/موظف\n• +٢٠٠ موظف: أسعار مخصصة\n\nعايز عرض سعر مخصص؟ املأ نموذج التواصل!",
    chatDiscount: "🏷️ **خصومات شامل:**\n\n• كشف العيادات: خصم يصل إلى **٤٠٪**\n• معامل التحاليل: خصم يصل إلى **٧٠٪**\n• الأشعة: خصم يصل إلى **٣٥٪**\n• العمليات: خصم يصل إلى **٣٥٪**\n• خدمات العيادات: خصم يصل إلى **٨٠٪**\n• الصيدلية: خصم يصل إلى **١٦٪**\n\nمتاحة في كل الشبكة الطبية اللي فيها أكتر من ٢٠٠ ألف مقدم خدمة!",
    chatNetwork: "🏥 **الشبكة الطبية تشمل:**\n\nمستشفيات: دار الفؤاد، السلام الدولي، ابن سينا، الأمل\n\nمعامل: المختبر، البرج، كايرو لاب، سبيد لابس، أنصاري\n\nأشعة: ميجا سكان، كايرو سكان، بروسكان، كابيتال سكان\n\n+ آلاف مقدمي الخدمة في كل مصر.",
    chatStart: "🚀 **الاشتراك سهل جداً:**\n\n١. املأ نموذج التواصل في الصفحة\n٢. فريقنا هيتصل بيك خلال ٢٤ ساعة\n٣. بنصمم باقة مخصصة لحجم شركتك\n٤. أرسل لنا قائمة الموظفين (اسم + موبايل)\n٥. التفعيل خلال ٤٨ ساعة\n\nبدون ورق. بدون انتظار. بدون استثناءات.",
    chatInsurance: "🔄 **شامل مقارنة بالتأمين التقليدي:**\n\n✅ بدون فترات انتظار\n✅ بدون استثناء أمراض سابقة\n✅ بدون مطالبات\n✅ تفعيل فوري\n✅ أرخص ١٠ مرات من التأمين الجماعي\n✅ بدون حد أدنى لعدد الموظفين\n✅ ادفع بس اللي بتستخدمه",
    chatRoi: (n) => `📊 **مثال التوفير لـ ${n} موظف:**\n\nتكلفة شامل السنوية: ~${(n*550).toLocaleString()} ج.م\nمتوسط توفير الرعاية الصحية: ~${(n*2400).toLocaleString()} ج.م/سنوياً\nصافي الفائدة: ~${(n*1850).toLocaleString()} ج.م/سنوياً\n\nجرّب حاسبة التوفير في الصفحة! 📈`,
    chatFallback: "شكراً على سؤالك! أقدر أساعدك في:\n\n• **الأسعار** - اكتب 'أسعار' أو 'سعر'\n• **الخصومات** - اكتب 'خصومات'\n• **الشبكة** - اكتب 'شبكة' أو 'مستشفيات'\n• **طريقة الاشتراك** - اكتب 'ازاي أبدأ'\n• **مقارنة بالتأمين** - اكتب 'تأمين'\n\nأو املأ نموذج التواصل وفريقنا هيتواصل معاك شخصياً! 😊",
    adminTitle: "لوحة التحكم", adminLogin: "دخول", adminBack: "→ رجوع",
    adminPassword: "كلمة السر", adminViewSite: "عرض الموقع", adminLogout: "خروج",
    adminLeads: "📋 العملاء المحتملين", adminChat: "💬 سجل المحادثات",
    adminTotalLeads: "إجمالي العملاء", adminNewLeads: "جدد", adminConverted: "تم التحويل", adminChatMsgs: "رسائل الشات",
    adminPipeline: "مسار العملاء المحتملين", adminNoLeads: "لا يوجد عملاء",
    adminNote: "ملاحظة:", adminNoMessages: "لا توجد رسائل بعد",
    adminChatHistory: "سجل المحادثات",
  }
};

// ============ STATIC DATA ============
const DISCOUNTS_DATA = [
  { discount: "40%", icon: "🩺" }, { discount: "70%", icon: "🔬" },
  { discount: "35%", icon: "📡" }, { discount: "16%", icon: "💊" },
  { discount: "35%", icon: "🏥" }, { discount: "80%", icon: "⚕️" },
];
const SVC_KEYS = ["svc1","svc2","svc3","svc4","svc5","svc6"];

const NETWORK = [
  "Dar Al Fouad", "As-Salam International", "Al Mokhtabar", "Al Borg Labs",
  "Mega Scan", "Cairo Scan", "ProScan", "Capital Scan", "Al-Amal Hospital",
  "Ibn Sina Hospital", "Seashell Hospital", "Al Safwa Hospital",
  "Ansary Laboratories", "Royal Heart", "CairoLab", "Speed Labs",
  "Al Nile Radiology", "Hassab Labs", "Hafez Sherif"
];

// ============ MAIN COMPONENT ============
export default function ShamelB2B() {
  const [lang, setLang] = useState("en");
  const [page, setPage] = useState("landing");
  const [adminAuth, setAdminAuth] = useState(false);
  const [adminPass, setAdminPass] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [leads, setLeads] = useState([
    { id: 1, name: "Test Company", contact: "ahmed@test.com", phone: "01012345678", employees: "50", status: "new", date: "2026-02-15", source: "landing", notes: "" }
  ]);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [formData, setFormData] = useState({ name: "", company: "", email: "", phone: "", employees: "", message: "" });
  const [roiEmployees, setRoiEmployees] = useState(50);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [adminTab, setAdminTab] = useState("leads");
  const [leadFilter, setLeadFilter] = useState("all");

  const t = T[lang];
  const isRtl = lang === "ar";
  const chatEndRef = useRef(null);

  // Re-init welcome message when language changes
  useEffect(() => {
    setChatMessages([{ from: "bot", text: t.chatWelcome }]);
  }, [lang]);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatMessages]);

  // Translated case studies (react to lang)
  const CASE_STUDIES = [
    { id: 1, company: "Elevate Gate", logo: "EG", employees: 170, savings: "62%", color: "#E74C3C",
      industry: t.cs1ind, quote: t.cs1q, person: t.cs1p, stat: t.cs1s },
    { id: 2, company: "199X Agency", logo: "19", employees: 30, savings: "45%", color: "#2E86C1",
      industry: t.cs2ind, quote: t.cs2q, person: t.cs2p, stat: t.cs2s },
    { id: 3, company: "Delivery Pro", logo: "DP", employees: 89, savings: "58%", color: "#27AE60",
      industry: t.cs3ind, quote: t.cs3q, person: t.cs3p, stat: t.cs3s },
  ];

  // ============ BILINGUAL CHAT BOT ============
  const getChatReply = (msg) => {
    const lower = msg.toLowerCase();
    if (lower.match(/price|cost|سعر|كام|أسعار|اسعار|تكلف|pricing/)) return t.chatPrice;
    if (lower.match(/discount|خصم|خصومات|saving|توفير/)) return t.chatDiscount;
    if (lower.match(/network|hospital|doctor|شبكة|مستشف|طبي|معمل/)) return t.chatNetwork;
    if (lower.match(/how|start|sign|register|ازاي|كيف|ابدأ|أبدأ|اشتراك/)) return t.chatStart;
    if (lower.match(/insurance|تأمين|مقارن|differ|فرق/)) return t.chatInsurance;
    if (lower.match(/roi|return|worth|عائد/)) return t.chatRoi(roiEmployees);
    return t.chatFallback;
  };

  const handleChat = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatMessages(prev => [...prev, { from: "user", text: userMsg }]);
    setChatInput("");
    setTimeout(() => {
      setChatMessages(prev => [...prev, { from: "bot", text: getChatReply(userMsg) }]);
    }, 800);
  };

  const quickChat = (text) => {
    setChatMessages(prev => [...prev, { from: "user", text }]);
    setTimeout(() => {
      setChatMessages(prev => [...prev, { from: "bot", text: getChatReply(text) }]);
    }, 800);
  };

  // ============ FORM ============
  const handleSubmit = (e) => {
    e.preventDefault();
    setLeads(prev => [{
      id: Date.now(), name: formData.company, contact: formData.email, phone: formData.phone,
      employees: formData.employees, status: "new", date: new Date().toISOString().split("T")[0],
      source: "landing", notes: `Contact: ${formData.name}. ${formData.message}`
    }, ...prev]);

    fetch("https://formsubmit.co/ajax/youssef.medhat@vezeeta.com", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        _subject: `New Shamel B2B Lead — ${formData.company}`,
        Name: formData.name,
        Company: formData.company,
        Email: formData.email,
        Phone: formData.phone,
        Employees: formData.employees,
        Message: formData.message || "N/A",
      }),
    }).catch(() => {});

    setFormSubmitted(true);
    setFormData({ name: "", company: "", email: "", phone: "", employees: "", message: "" });
    setTimeout(() => setFormSubmitted(false), 5000);
  };

  const updateLeadStatus = (id, status) => setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
  const filteredLeads = leadFilter === "all" ? leads : leads.filter(l => l.status === leadFilter);
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  // ============ SHARED STYLES ============
  const sty = {
    btn: { background: "linear-gradient(135deg, #0066CC, #0052A3)", color: "#fff", border: "none", borderRadius: 10, padding: "12px 28px", fontSize: 15, fontWeight: 600, cursor: "pointer", transition: "all 0.3s", boxShadow: "0 4px 14px rgba(0,102,204,0.3)", fontFamily: t.font },
    btnRed: { background: "linear-gradient(135deg, #E31B23, #C41920)", color: "#fff", border: "none", borderRadius: 10, padding: "12px 28px", fontSize: 15, fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 14px rgba(227,27,35,0.3)", fontFamily: t.font },
    btnOutline: { background: "transparent", color: "#0066CC", border: "2px solid #0066CC", borderRadius: 10, padding: "10px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: t.font },
    card: { background: "#fff", borderRadius: 16, padding: 32, boxShadow: "0 2px 20px rgba(0,0,0,0.04)", border: "1px solid #f0f2f5" },
    tag: (color) => ({ display: "inline-block", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: color + "15", color }),
    input: { width: "100%", padding: "14px 16px", borderRadius: 10, border: "1.5px solid #e0e4e8", fontSize: 15, fontFamily: t.font, outline: "none", transition: "border 0.2s", boxSizing: "border-box", direction: isRtl ? "rtl" : "ltr", textAlign: isRtl ? "right" : "left" },
    section: { padding: "80px 24px", maxWidth: 1200, margin: "0 auto" },
    sTitle: { fontSize: isRtl ? 34 : 38, fontWeight: 800, marginBottom: 8, lineHeight: 1.3 },
    sSub: { fontSize: 17, color: "#6b7280", maxWidth: 600, lineHeight: 1.7, marginBottom: 48 },
  };

  // ============ ADMIN LOGIN ============
  if (page === "admin" && !adminAuth) {
    return (
      <div style={{ fontFamily: "'Outfit', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "linear-gradient(135deg, #0a1628, #1a2d50)" }}>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Noto+Sans+Arabic:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <div style={{ ...sty.card, maxWidth: 400, width: "100%", textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔐</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>{t.adminTitle}</h2>
          <input type="password" placeholder={t.adminPassword} value={adminPass} onChange={e => setAdminPass(e.target.value)}
            onKeyDown={e => e.key === "Enter" && (adminPass === "Shamel@2026" ? setAdminAuth(true) : alert("Wrong password"))}
            style={{ ...sty.input, direction: "ltr", textAlign: "left", marginBottom: 16 }} />
          <button onClick={() => adminPass === "Shamel@2026" ? setAdminAuth(true) : alert("Wrong password")} style={{ ...sty.btn, width: "100%" }}>{t.adminLogin}</button>
          <p style={{ marginTop: 16, fontSize: 13, color: "#9ca3af", cursor: "pointer" }} onClick={() => setPage("landing")}>{t.adminBack}</p>
        </div>
      </div>
    );
  }

  // ============ ADMIN PANEL ============
  if (page === "admin" && adminAuth) {
    return (
      <div style={{ fontFamily: "'Outfit', sans-serif", background: "#f0f2f5", minHeight: "100vh" }}>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Noto+Sans+Arabic:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <div style={{ position: "sticky", top: 0, zIndex: 100, background: "#0a1628", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>Shamel</span>
            <span style={{ ...sty.tag("#3B82F6"), background: "rgba(59,130,246,0.2)", color: "#60A5FA" }}>Admin</span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setPage("landing")} style={{ ...sty.btnOutline, color: "#94a3b8", borderColor: "#334155", fontSize: 13, padding: "8px 16px" }}>{t.adminViewSite}</button>
            <button onClick={() => { setAdminAuth(false); setPage("landing"); }} style={{ fontSize: 13, padding: "8px 16px", background: "rgba(239,68,68,0.15)", color: "#EF4444", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>{t.adminLogout}</button>
          </div>
        </div>
        {/* Stats */}
        <div style={{ maxWidth: 1200, margin: "24px auto", padding: "0 24px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {[{ label: t.adminTotalLeads, value: leads.length, icon: "📋", color: "#3B82F6" },
            { label: t.adminNewLeads, value: leads.filter(l => l.status === "new").length, icon: "🔔", color: "#F59E0B" },
            { label: t.adminConverted, value: leads.filter(l => l.status === "converted").length, icon: "✅", color: "#10B981" },
            { label: t.adminChatMsgs, value: chatMessages.filter(m => m.from === "user").length, icon: "💬", color: "#8B5CF6" },
          ].map((st, i) => (
            <div key={i} style={{ ...sty.card, padding: 20, display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: st.color + "15", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{st.icon}</div>
              <div><div style={{ fontSize: 26, fontWeight: 800, color: st.color }}>{st.value}</div><div style={{ fontSize: 13, color: "#6b7280" }}>{st.label}</div></div>
            </div>
          ))}
        </div>
        {/* Tabs */}
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", gap: 4, marginBottom: 20, background: "#fff", borderRadius: 12, padding: 4, border: "1px solid #e5e7eb", width: "fit-content" }}>
            {["leads","chat-log"].map(tab => (
              <button key={tab} onClick={() => setAdminTab(tab)} style={{ padding: "10px 20px", borderRadius: 8, border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer",
                background: adminTab === tab ? "#0066CC" : "transparent", color: adminTab === tab ? "#fff" : "#6b7280" }}>
                {tab === "leads" ? t.adminLeads : t.adminChat}
              </button>
            ))}
          </div>
          {/* Leads Table */}
          {adminTab === "leads" && (
            <div style={sty.card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 8 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{t.adminPipeline}</h3>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {["all","new","contacted","qualified","converted","lost"].map(f => (
                    <button key={f} onClick={() => setLeadFilter(f)} style={{ padding: "6px 14px", borderRadius: 20, border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer",
                      background: leadFilter === f ? "#0066CC" : "#f3f4f6", color: leadFilter === f ? "#fff" : "#6b7280" }}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>
                  ))}
                </div>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                  <thead><tr style={{ borderBottom: "2px solid #e5e7eb" }}>
                    {["Company","Contact","Phone","Employees","Date","Status",""].map(h => (
                      <th key={h} style={{ padding: "12px 8px", textAlign: "left", fontWeight: 600, color: "#6b7280", fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {filteredLeads.map(lead => (
                      <tr key={lead.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                        <td style={{ padding: "12px 8px", fontWeight: 600 }}>{lead.name}</td>
                        <td style={{ padding: "12px 8px", color: "#6b7280" }}>{lead.contact}</td>
                        <td style={{ padding: "12px 8px", color: "#6b7280" }}>{lead.phone}</td>
                        <td style={{ padding: "12px 8px" }}>{lead.employees}</td>
                        <td style={{ padding: "12px 8px", color: "#9ca3af", fontSize: 13 }}>{lead.date}</td>
                        <td style={{ padding: "12px 8px" }}>
                          <select value={lead.status} onChange={e => updateLeadStatus(lead.id, e.target.value)}
                            style={{ padding: "6px 10px", borderRadius: 8, border: "1.5px solid #e0e4e8", fontSize: 13, cursor: "pointer",
                              background: lead.status === "converted" ? "#D1FAE5" : lead.status === "new" ? "#FEF3C7" : lead.status === "lost" ? "#FEE2E2" : "#EFF6FF",
                              color: lead.status === "converted" ? "#065F46" : lead.status === "new" ? "#92400E" : lead.status === "lost" ? "#991B1B" : "#1E40AF" }}>
                            {["new","contacted","qualified","converted","lost"].map(st => <option key={st} value={st}>{st}</option>)}
                          </select>
                        </td>
                        <td style={{ padding: "12px 8px" }}>
                          <button onClick={() => { const n = prompt(t.adminNote, lead.notes); if (n !== null) setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, notes: n } : l)); }}
                            style={{ padding: "6px 12px", borderRadius: 6, border: "none", fontSize: 12, cursor: "pointer", background: "#f3f4f6", color: "#374151" }}>📝</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredLeads.length === 0 && <p style={{ textAlign: "center", color: "#9ca3af", padding: 40 }}>{t.adminNoLeads}</p>}
              </div>
            </div>
          )}
          {/* Chat Log */}
          {adminTab === "chat-log" && (
            <div style={sty.card}>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>{t.adminChatHistory} ({chatMessages.filter(m => m.from === "user").length})</h3>
              <div style={{ maxHeight: 500, overflow: "auto", background: "#f9fafb", borderRadius: 12, padding: 16 }}>
                {chatMessages.map((m, i) => (
                  <div key={i} style={{ marginBottom: 8, padding: "8px 12px", borderRadius: 8, background: m.from === "user" ? "#EFF6FF" : "#fff", fontSize: 13, border: "1px solid #e5e7eb" }}>
                    <span style={{ fontWeight: 700, color: m.from === "user" ? "#1E40AF" : "#059669", fontSize: 11, textTransform: "uppercase" }}>{m.from}</span>
                    <div style={{ marginTop: 4, whiteSpace: "pre-wrap" }}>{m.text}</div>
                  </div>
                ))}
                {chatMessages.length === 0 && <p style={{ textAlign: "center", color: "#9ca3af" }}>{t.adminNoMessages}</p>}
              </div>
            </div>
          )}
        </div>
        <div style={{ height: 60 }} />
      </div>
    );
  }

  // ================================================================
  // ============ LANDING PAGE ============
  // ================================================================
  return (
    <div dir={t.dir} style={{ fontFamily: t.font, background: "#FAFBFC", color: "#1a1a2e", minHeight: "100vh", overflowX: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Noto+Sans+Arabic:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        ::selection { background: #0066CC20; }
        input:focus, textarea:focus, select:focus { border-color: #0066CC !important; box-shadow: 0 0 0 3px rgba(0,102,204,0.1) !important; }
        button:hover { opacity: 0.92; transform: translateY(-1px); }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        .fade-up { animation: fadeUp 0.8s ease forwards; }
        .float { animation: float 3s ease-in-out infinite; }
        @media(max-width:768px) {
          .hero-grid { flex-direction: column !important; text-align: center !important; }
          .hide-mobile { display: none !important; }
          .grid-3 { grid-template-columns: 1fr !important; }
          .grid-2 { grid-template-columns: 1fr !important; }
          .hero-title { font-size: 30px !important; }
          .stats-row { flex-direction: column !important; gap: 16px !important; align-items: ${isRtl ? "flex-end" : "flex-start"} !important; }
          .admin-stats { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      {/* ===== NAV ===== */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(255,255,255,0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid #e8ecf0", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} onClick={() => scrollTo("hero")}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #0066CC, #E31B23)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontWeight: 900, fontSize: 14 }}>S</span>
          </div>
          <span style={{ fontSize: 18, fontWeight: 800, color: "#0a1628" }}>Shamel</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", marginTop: 2 }}>{t.forBusiness}</span>
        </div>
        <div style={{ display: "flex", gap: isRtl ? 18 : 24, alignItems: "center" }} className="hide-mobile">
          {[[t.navBenefits,"benefits"],[t.navDiscounts,"discounts"],[t.navNetwork,"network"],[t.navRoi,"roi"],[t.navCases,"cases"],[t.navContact,"contact"]].map(([label, id]) => (
            <span key={id} onClick={() => scrollTo(id)} style={{ fontSize: 14, fontWeight: 500, color: "#5a6270", cursor: "pointer", transition: "color 0.2s" }}>{label}</span>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button onClick={() => setLang(lang === "en" ? "ar" : "en")}
            style={{ padding: "6px 14px", borderRadius: 8, border: "1.5px solid #e0e4e8", background: "#fff", fontSize: 13, cursor: "pointer", fontWeight: 600, color: "#374151", display: "flex", alignItems: "center", gap: 6, fontFamily: lang === "en" ? "'Noto Sans Arabic', sans-serif" : "'Outfit', sans-serif" }}>
            {t.langFlag} {t.langSwitch}
          </button>
          <button onClick={() => scrollTo("contact")} style={{ ...sty.btn, padding: "8px 20px", fontSize: 13 }}>{t.navCta}</button>
          <span onClick={() => setPage("admin")} style={{ fontSize: 11, color: "#d1d5db", cursor: "pointer", marginInlineStart: 4 }}>⚙️</span>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section id="hero" style={{ background: "linear-gradient(135deg, #0a1628 0%, #162544 50%, #1a3a5c 100%)", padding: "80px 24px 100px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -100, [isRtl ? "left" : "right"]: -100, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,102,204,0.15), transparent)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -50, [isRtl ? "right" : "left"]: -50, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(227,27,35,0.1), transparent)", pointerEvents: "none" }} />
        <div className="hero-grid fade-up" style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", gap: 60 }}>
          <div style={{ flex: 1 }}>
            <div style={{ ...sty.tag("#60A5FA"), background: "rgba(96,165,250,0.15)", marginBottom: 20, fontSize: 13 }}>{t.heroTag}</div>
            <h1 className="hero-title" style={{ fontSize: isRtl ? 42 : 48, fontWeight: 900, color: "#fff", lineHeight: 1.25, marginBottom: 20 }}>
              {t.heroTitle1}<br />
              <span style={{ background: "linear-gradient(135deg, #60A5FA, #3B82F6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{t.heroTitle2}</span><br />
              {t.heroTitle3}
            </h1>
            <p style={{ fontSize: isRtl ? 16 : 18, color: "#94a3b8", lineHeight: 1.8, marginBottom: 32, maxWidth: 500 }}
              dangerouslySetInnerHTML={{ __html: t.heroDesc.replace(/<b>/g, '<b style="color:#60A5FA">') }} />
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button onClick={() => scrollTo("contact")} style={{ ...sty.btn, padding: "16px 32px", fontSize: 16 }}>{t.heroCta1}</button>
              <button onClick={() => scrollTo("roi")} style={{ ...sty.btnOutline, color: "#94a3b8", borderColor: "#334155", padding: "14px 28px" }}>{t.heroCta2}</button>
            </div>
            <div className="stats-row" style={{ display: "flex", gap: 32, marginTop: 40 }}>
              {[[t.heroStat1v, t.heroStat1l],[t.heroStat2v, t.heroStat2l],[t.heroStat3v, t.heroStat3l]].map(([val, label]) => (
                <div key={label}><div style={{ fontSize: 24, fontWeight: 800, color: "#fff" }}>{val}</div><div style={{ fontSize: 13, color: "#64748b" }}>{label}</div></div>
              ))}
            </div>
          </div>
          {/* Floating discount card */}
          <div className="hide-mobile" style={{ flex: 0.8 }}>
            <div className="float" style={{ background: "linear-gradient(135deg, #1e3a5f, #2a4a6f)", borderRadius: 24, padding: 32, border: "1px solid rgba(255,255,255,0.1)" }}>
              {DISCOUNTS_DATA.map((d, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: i < DISCOUNTS_DATA.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 20 }}>{d.icon}</span>
                    <span style={{ color: "#cbd5e1", fontSize: 15 }}>{t[SVC_KEYS[i]]}</span>
                  </div>
                  <span style={{ fontSize: 18, fontWeight: 800, color: "#60A5FA" }}>{t.discUpTo} {d.discount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== BENEFITS ===== */}
      <section id="benefits" style={sty.section}>
        <div style={{ textAlign: "center" }}>
          <div style={sty.tag("#0066CC")}>{t.benTag}</div>
          <h2 style={{ ...sty.sTitle, marginTop: 12 }}>{t.benTitle1}<br />{t.benTitle2}</h2>
          <p style={{ ...sty.sSub, margin: "0 auto 48px" }}>{t.benSub}</p>
        </div>
        <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {[{ icon: "👥", title: t.ben1t, desc: t.ben1d, color: "#E31B23" },
            { icon: "💰", title: t.ben2t, desc: t.ben2d, color: "#0066CC" },
            { icon: "⚡", title: t.ben3t, desc: t.ben3d, color: "#10B981" },
            { icon: "📈", title: t.ben4t, desc: t.ben4d, color: "#F59E0B" },
          ].map((b, i) => (
            <div key={i} style={{ ...sty.card, display: "flex", gap: 20 }}>
              <div style={{ width: 56, height: 56, borderRadius: 14, background: b.color + "12", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0 }}>{b.icon}</div>
              <div><h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{b.title}</h3><p style={{ fontSize: 15, color: "#6b7280", lineHeight: 1.7 }}>{b.desc}</p></div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== DISCOUNTS ===== */}
      <section id="discounts" style={{ background: "#fff", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center" }}>
            <div style={sty.tag("#E31B23")}>{t.discTag}</div>
            <h2 style={{ ...sty.sTitle, marginTop: 12 }}>{t.discTitle}</h2>
            <p style={{ ...sty.sSub, margin: "0 auto 48px" }}>{t.discSub}</p>
          </div>
          <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {DISCOUNTS_DATA.map((d, i) => (
              <div key={i} style={{ ...sty.card, textAlign: "center", padding: 28 }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>{d.icon}</div>
                <div style={{ fontSize: 36, fontWeight: 900, color: "#0066CC", marginBottom: 4 }}>{d.discount}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>{t.discUpTo}</div>
                <div style={{ fontSize: 17, fontWeight: 700 }}>{t[SVC_KEYS[i]]}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== NETWORK ===== */}
      <section id="network" style={sty.section}>
        <div style={{ textAlign: "center" }}>
          <div style={sty.tag("#10B981")}>{t.netTag}</div>
          <h2 style={{ ...sty.sTitle, marginTop: 12 }}>{t.netTitle}</h2>
          <p style={{ ...sty.sSub, margin: "0 auto 48px" }}>{t.netSub}</p>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
          {NETWORK.map((n, i) => (
            <div key={i} style={{ padding: "10px 20px", borderRadius: 100, background: "#fff", border: "1px solid #e5e7eb", fontSize: 14, fontWeight: 500, color: "#374151" }}>{n}</div>
          ))}
        </div>
        <p style={{ textAlign: "center", color: "#9ca3af", marginTop: 24, fontSize: 14 }}>{t.netMore}</p>
      </section>

      {/* ===== ROI CALCULATOR ===== */}
      <section id="roi" style={{ background: "linear-gradient(135deg, #0a1628, #1a3a5c)", padding: "80px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <div style={{ ...sty.tag("#60A5FA"), background: "rgba(96,165,250,0.15)", marginBottom: 12 }}>{t.roiTag}</div>
          <h2 style={{ fontSize: isRtl ? 32 : 36, fontWeight: 800, color: "#fff", marginBottom: 8 }}>{t.roiTitle}</h2>
          <p style={{ color: "#94a3b8", marginBottom: 40, fontSize: 16 }}>{t.roiSub}</p>
          <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 20, padding: 40, border: "1px solid rgba(255,255,255,0.1)" }}>
            <label style={{ color: "#94a3b8", fontSize: 14, display: "block", marginBottom: 12 }}>{t.roiLabel}</label>
            <input type="range" min={5} max={500} value={roiEmployees} onChange={e => setRoiEmployees(parseInt(e.target.value))}
              style={{ width: "100%", marginBottom: 8, accentColor: "#3B82F6", direction: "ltr" }} />
            <div style={{ fontSize: 48, fontWeight: 900, color: "#fff", marginBottom: 32 }}>{roiEmployees} <span style={{ fontSize: 18, color: "#64748b" }}>{t.roiEmployees}</span></div>
            <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              {[{ label: t.roiShamel, value: `EGP ${(roiEmployees * 800).toLocaleString()}`, sub: `EGP 800${t.roiPerPerson}`, color: "#3B82F6" },
                { label: t.roiInsurance, value: `EGP ${(roiEmployees * 4500).toLocaleString()}`, sub: `EGP 4,500${t.roiPerPerson}`, color: "#EF4444" },
                { label: t.roiSavings, value: `EGP ${(roiEmployees * 3700).toLocaleString()}`, sub: `${Math.round((3700/4500)*100)}% ${t.roiLess}`, color: "#10B981" },
              ].map((r, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.05)", borderRadius: 14, padding: 24, border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div style={{ fontSize: 13, color: "#64748b", marginBottom: 8 }}>{r.label}</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: r.color }}>{r.value}</div>
                  <div style={{ fontSize: 12, color: "#4b5563", marginTop: 4 }}>{r.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== CASE STUDIES ===== */}
      <section id="cases" style={sty.section}>
        <div style={{ textAlign: "center" }}>
          <div style={sty.tag("#8B5CF6")}>{t.caseTag}</div>
          <h2 style={{ ...sty.sTitle, marginTop: 12 }}>{t.caseTitle}</h2>
          <p style={{ ...sty.sSub, margin: "0 auto 48px" }}>{t.caseSub}</p>
        </div>
        <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {CASE_STUDIES.map(cs => (
            <div key={cs.id} style={{ ...sty.card, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: cs.color + "15", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: cs.color, fontSize: 18 }}>{cs.logo}</div>
                  <div><div style={{ fontWeight: 700, fontSize: 16 }}>{cs.company}</div><div style={{ fontSize: 13, color: "#9ca3af" }}>{cs.industry}</div></div>
                </div>
                <p style={{ fontSize: 15, color: "#4b5563", lineHeight: 1.8, fontStyle: "italic", marginBottom: 20 }}>"{cs.quote}"</p>
              </div>
              <div>
                <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 12 }}>— {cs.person}</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <span style={sty.tag(cs.color)}>{t.caseSaves} {cs.savings}</span>
                  <span style={sty.tag("#6b7280")}>{cs.stat}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CONTACT FORM ===== */}
      <section id="contact" style={{ background: "#fff", padding: "80px 24px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ textAlign: "center" }}>
            <div style={sty.tag("#E31B23")}>{t.formTag}</div>
            <h2 style={{ ...sty.sTitle, marginTop: 12 }}>{t.formTitle}</h2>
            <p style={{ ...sty.sSub, margin: "0 auto 40px" }}>{t.formSub}</p>
          </div>
          {formSubmitted ? (
            <div style={{ ...sty.card, textAlign: "center", padding: 60, background: "#F0FDF4", border: "1px solid #BBF7D0" }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
              <h3 style={{ fontSize: 22, fontWeight: 700, color: "#166534", marginBottom: 8 }}>{t.formSuccess}</h3>
              <p style={{ color: "#15803D", fontSize: 16 }}>{t.formSuccessMsg}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={sty.card}>
              <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div><label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>{t.formName} *</label>
                  <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder={t.formNamePlaceholder} style={sty.input} /></div>
                <div><label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>{t.formCompany} *</label>
                  <input required value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} placeholder={t.formCompanyPlaceholder} style={sty.input} /></div>
              </div>
              <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div><label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>{t.formEmail} *</label>
                  <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder={t.formEmailPlaceholder} style={{ ...sty.input, direction: "ltr", textAlign: isRtl ? "right" : "left" }} /></div>
                <div><label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>{t.formPhone} *</label>
                  <input required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="01XXXXXXXXX" style={{ ...sty.input, direction: "ltr", textAlign: isRtl ? "right" : "left" }} /></div>
              </div>
              <div style={{ marginBottom: 16 }}><label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>{t.formEmployees} *</label>
                <select required value={formData.employees} onChange={e => setFormData({ ...formData, employees: e.target.value })} style={{ ...sty.input, cursor: "pointer" }}>
                  <option value="">{t.formSelect}</option>
                  <option value="5-10">{t.formRange1}</option><option value="11-49">{t.formRange2}</option>
                  <option value="50-199">{t.formRange3}</option><option value="200-499">{t.formRange4}</option>
                  <option value="500+">{t.formRange5}</option>
                </select></div>
              <div style={{ marginBottom: 20 }}><label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>{t.formMsg}</label>
                <textarea value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} placeholder={t.formMsgPlaceholder} style={{ ...sty.input, minHeight: 90, resize: "vertical" }} /></div>
              <button type="submit" style={{ ...sty.btnRed, width: "100%", padding: "16px", fontSize: 16 }}>{t.formBtn}</button>
              <p style={{ textAlign: "center", fontSize: 12, color: "#9ca3af", marginTop: 12 }}>{t.formSecure}</p>
            </form>
          )}
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer style={{ background: "#0a1628", padding: "40px 24px", textAlign: "center" }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 8 }}>Shamel <span style={{ color: "#64748b", fontWeight: 400, fontSize: 14 }}>by Vezeeta</span></div>
        <p style={{ color: "#4b5563", fontSize: 14, marginBottom: 16 }}>{t.footerSub}</p>
        <div style={{ display: "flex", gap: 24, justifyContent: "center", fontSize: 13, color: "#64748b" }}>
          <span>vezeeta.com</span><span>support@vezeeta.com</span>
          <span onClick={() => setPage("admin")} style={{ cursor: "pointer" }}>{t.footerAdmin}</span>
        </div>
      </footer>

      {/* ===== CHATBOT BUBBLE ===== */}
      {!chatOpen && (
        <button onClick={() => setChatOpen(true)}
          style={{ position: "fixed", bottom: 24, [isRtl ? "left" : "right"]: 24, width: 60, height: 60, borderRadius: "50%",
            background: "linear-gradient(135deg, #0066CC, #0052A3)", border: "none", cursor: "pointer",
            boxShadow: "0 6px 24px rgba(0,102,204,0.4)", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 26, color: "#fff", zIndex: 1000, animation: "pulse 2s ease-in-out infinite" }}>
          💬
        </button>
      )}

      {/* ===== CHATBOT PANEL ===== */}
      {chatOpen && (
        <div dir={t.dir} style={{ position: "fixed", bottom: 24, [isRtl ? "left" : "right"]: 24, width: 380, maxWidth: "calc(100vw - 48px)",
          maxHeight: "70vh", borderRadius: 20, background: "#fff", boxShadow: "0 12px 48px rgba(0,0,0,0.15)", zIndex: 1000,
          display: "flex", flexDirection: "column", overflow: "hidden", border: "1px solid #e5e7eb", fontFamily: t.font }}>
          {/* Header */}
          <div style={{ background: "linear-gradient(135deg, #0066CC, #0052A3)", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
            <div><div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>{t.chatTitle}</div>
              <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>{t.chatSubtitle}</div></div>
            <button onClick={() => setChatOpen(false)} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 8, width: 32, height: 32, color: "#fff", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
          </div>
          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 12, maxHeight: "45vh" }}>
            {chatMessages.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.from === "user" ? "flex-end" : "flex-start" }}>
                <div style={{ maxWidth: "82%", padding: "12px 16px",
                  borderRadius: m.from === "user"
                    ? (isRtl ? "16px 16px 16px 4px" : "16px 16px 4px 16px")
                    : (isRtl ? "16px 16px 4px 16px" : "16px 16px 16px 4px"),
                  background: m.from === "user" ? "#0066CC" : "#f3f4f6",
                  color: m.from === "user" ? "#fff" : "#1a1a2e",
                  fontSize: 14, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
                  {m.text.split("**").map((part, j) => j % 2 === 0 ? part : <strong key={j}>{part}</strong>)}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          {/* Quick Actions */}
          <div style={{ padding: "8px 16px", display: "flex", gap: 6, overflowX: "auto", borderTop: "1px solid #f3f4f6", flexShrink: 0 }}>
            {[t.chatQPricing, t.chatQDiscount, t.chatQStart, t.chatQInsurance].map(q => (
              <button key={q} onClick={() => quickChat(q)}
                style={{ padding: "6px 12px", borderRadius: 20, border: "1px solid #e5e7eb", background: "#fff", fontSize: 12, color: "#6b7280", cursor: "pointer", whiteSpace: "nowrap", fontFamily: t.font, flexShrink: 0 }}>
                {q}
              </button>
            ))}
          </div>
          {/* Input */}
          <div style={{ padding: "12px 16px", borderTop: "1px solid #e5e7eb", display: "flex", gap: 8, flexShrink: 0 }}>
            <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleChat()}
              placeholder={t.chatPlaceholder} style={{ ...sty.input, borderRadius: 24, padding: "10px 16px", fontSize: 14 }} />
            <button onClick={handleChat} style={{ ...sty.btn, borderRadius: 24, padding: "10px 18px", fontSize: 14, flexShrink: 0 }}>{isRtl ? "←" : "→"}</button>
          </div>
        </div>
      )}
    </div>
  );
}
