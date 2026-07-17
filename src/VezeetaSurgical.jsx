import { useState, useEffect, useRef } from "react";

// ─── Brand Colors ───────────────────────────────────────────────────────────
const C = {
  primary:       "#599AD7",
  primaryDark:   "#4178B4",
  primaryLight:  "#E8F0FA",
  primarySubtle: "#F3F7FC",
  accent:        "#FF6F61",
  accentLight:   "#FFF0EE",
  charcoal:      "#1B2559",
  slate:         "#4A5568",
  gray:          "#94A3B8",
  border:        "#E2E8F0",
  surface:       "#F8FAFC",
  white:         "#FFFFFF",
};

// ─── Data ───────────────────────────────────────────────────────────────────
const SERVICES = [
  { icon: "🔬", name: "مناظير المعدة والجهاز الهضمي", sub: "منظار تشخيصي • منظار علاجي • قولون", hot: true },
  { icon: "🦴", name: "جراحات العظام", sub: "مفاصل • عمود فقري • إصابات رياضية", hot: true },
  { icon: "⚕️", name: "الجراحة العامة", sub: "زائدة • فتق • مرارة • أورام", hot: false },
  { icon: "❤️", name: "القلب والأوعية الدموية", sub: "قسطرة • دعامات • قلب مفتوح", hot: false },
  { icon: "✨", name: "التجميل والجلدية", sub: "شد وجه • تنسيق قوام • ليزر • حقن", hot: false },
  { icon: "👶", name: "نساء وتوليد", sub: "ولادة • مناظير • أورام ليفية", hot: false },
  { icon: "🩺", name: "المسالك البولية", sub: "حصوات • منظار • تفتيت", hot: false },
  { icon: "👁️", name: "جراحات العيون", sub: "ليزك • مياه بيضاء • تصحيح نظر", hot: false },
];

const FAQS = [
  { q: "الاستشارة فعلاً مجانية؟", a: "أيوا، الاستشارة الأولى مجانية تماماً مع أخصائي رعاية صحية. هدفنا نفهم حالتك ونساعدك تاخد القرار الصح — من غير أي ضغط أو التزام." },
  { q: "إيه الخدمات والتخصصات المتاحة؟", a: "عندنا تغطية واسعة تشمل: مناظير المعدة والجهاز الهضمي، جراحات العظام، الجراحة العامة، القلب والأوعية الدموية، التجميل والجلدية، نساء وتوليد، المسالك البولية، وجراحات العيون." },
  { q: "مين اللي بيختار الدكتور أو المستشفى؟", a: "إحنا بنعرض عليك كل الخيارات المناسبة لحالتك بناءً على خبرة الأطباء وتقييمات المرضى السابقين — وانت اللي بتقرر وبتختار اللي يريّحك." },
  { q: "بتتابعوا مع المريض بعد الإجراء؟", a: "طبعاً. فريق فيزيتا بيفضل معاك من أول الاستشارة لحد ما تتعافى تماماً — متابعة مستمرة في كل خطوة." },
  { q: "الأسعار واضحة من البداية؟", a: "١٠٠٪. بنوضحلك التكلفة الكاملة قبل ما تاخد أي قرار — بدون رسوم مخفية أو مفاجآت." },
];

const STEPS = [
  { num: "١", title: "احجز استشارة مجانية", desc: "سجّل بياناتك في ثواني واحجز جلسة مع أخصائي رعاية صحية — من غير أي تكلفة أو التزام" },
  { num: "٢", title: "احكيلنا عن حالتك", desc: "فريقنا يسمعك ويفهم حالتك بالتفصيل عشان يقدر يساعدك بأفضل شكل ممكن" },
  { num: "٣", title: "نعرض عليك كل الخيارات المناسبة", desc: "نرشّحلك أفضل المتخصصين والمستشفيات اللي تناسب حالتك — وانت تختار اللي يريّحك" },
  { num: "٤", title: "تعمل إجراءك وترجع بالسلامة", desc: "نفضل معاك خطوة بخطوة — من التحضير للإجراء لحد ما تتعافى تماماً" },
];

const QUICK_PILLS = [
  { label: "مناظير", idx: 0 },
  { label: "عظام", idx: 1 },
  { label: "قلب", idx: 3 },
  { label: "جراحة عامة", idx: 2 },
  { label: "تجميل", idx: 4 },
];

// ─── Time Slots ─────────────────────────────────────────────────────────────
const TIME_SLOTS = [
  "13:00","13:30","14:00","14:30","15:00",
  "15:30","16:00","16:30","17:00","17:30",
];

const formatTimeAr = (t) => {
  const [h, m] = t.split(":");
  const hour = parseInt(h);
  return `${hour > 12 ? hour - 12 : hour}:${m} م`;
};

const isWorkingDay = (dateStr) => {
  if (!dateStr) return false;
  const day = new Date(dateStr + "T12:00:00").getDay(); // 0=Sun … 6=Sat
  return day >= 0 && day <= 4;
};

const getMinDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
};

const getMaxDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString().split("T")[0];
};

const formatDisplayDate = (dateStr) => {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  const days = ["الأحد","الاثنين","الثلاثاء","الأربعاء","الخميس"];
  const day = new Date(dateStr + "T12:00:00").getDay();
  return `${days[day]}، ${d}/${m}/${y}`;
};

// ─── Admin Credentials ───────────────────────────────────────────────────────
const ADMIN_EMAIL = "youssef.medhat@vezeeta.com";
const ADMIN_PASSWORD = "y0ussef(Joe)";

// ─── Main Component ──────────────────────────────────────────────────────────
export default function VezeetaSurgical() {
  // Landing page state
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [searchQuery, setSearchQuery]             = useState("");
  const [searchResults, setSearchResults]         = useState([]);
  const [showDropdown, setShowDropdown]           = useState(false);
  const [faqOpen, setFaqOpen]                     = useState(null);

  // Form state
  const [formData, setFormData]       = useState({ name:"", phone:"", specialty:"", date:"", time:"", notes:"" });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");

  // Slot booking state
  const [bookedSlots, setBookedSlots]   = useState({});
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [dateError, setDateError]       = useState("");

  // Chat state
  const [chatOpen, setChatOpen]         = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role:"assistant", content:"أهلاً! أنا كريم، مساعد الدعم الذكي في فيزيتا 👋\nعايز تعرف أكتر عن خدماتنا أو تحجز استشارة مجانية؟\nقولّي اسمك ونبدأ!" }
  ]);
  const [chatInput, setChatInput]   = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  // Admin state
  const [showAdmin, setShowAdmin]         = useState(false);
  const [adminAuth, setAdminAuth]         = useState(false);
  const [adminEmail, setAdminEmail]       = useState("");
  const [adminPass, setAdminPass]         = useState("");
  const [adminLoginErr, setAdminLoginErr] = useState("");
  const [adminDate, setAdminDate]         = useState(new Date().toISOString().split("T")[0]);
  const [adminBookings, setAdminBookings] = useState({});
  const [adminLoading, setAdminLoading]   = useState(false);

  const formRef    = useRef(null);
  const chatEndRef = useRef(null);
  const searchRef  = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior:"smooth" });
  }, [chatMessages]);

  useEffect(() => {
    const handle = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowDropdown(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  // ─── Admin ─────────────────────────────────────────────────────────────────
  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminEmail.trim().toLowerCase() === ADMIN_EMAIL && adminPass === ADMIN_PASSWORD) {
      setAdminAuth(true);
      setAdminLoginErr("");
      fetchAdminBookings(adminDate);
    } else {
      setAdminLoginErr("البريد الإلكتروني أو كلمة السر غلط");
    }
  };

  const fetchAdminBookings = async (date) => {
    setAdminLoading(true);
    try {
      const res = await fetch(`/api/bookings?date=${date}`, {
        headers: { "x-admin-token": ADMIN_PASSWORD },
      });
      const data = await res.json();
      setAdminBookings(data.slots || {});
    } catch (_) {
      setAdminBookings({});
    }
    setAdminLoading(false);
  };

  // ─── Search ────────────────────────────────────────────────────────────────
  const handleSearch = (q) => {
    setSearchQuery(q);
    if (!q.trim()) { setSearchResults([]); setShowDropdown(false); return; }
    const r = SERVICES.filter((s) => s.name.includes(q) || s.sub.includes(q));
    setSearchResults(r);
    setShowDropdown(true);
  };

  const selectService = (svc) => {
    setSelectedSpecialty(svc.name);
    setSearchQuery(svc.name);
    setShowDropdown(false);
    setFormData((f) => ({ ...f, specialty: svc.name }));
    setTimeout(() => formRef.current?.scrollIntoView({ behavior:"smooth", block:"center" }), 100);
  };

  const selectPill = (idx) => {
    const svc = SERVICES[idx];
    setSelectedSpecialty(svc.name);
    setFormData((f) => ({ ...f, specialty: svc.name }));
    setTimeout(() => formRef.current?.scrollIntoView({ behavior:"smooth", block:"center" }), 100);
  };

  // ─── Date & Slot Selection ─────────────────────────────────────────────────
  const handleDateChange = async (date) => {
    setFormData((f) => ({ ...f, date, time:"" }));
    setBookedSlots({});
    setDateError("");
    setBookingError("");

    if (!date) return;

    if (!isWorkingDay(date)) {
      setDateError("المواعيد متاحة من الأحد للخميس فقط (أيام العمل)");
      return;
    }

    setLoadingSlots(true);
    try {
      const res = await fetch(`/api/bookings?date=${date}`);
      const data = await res.json();
      setBookedSlots(data.slots || {});
    } catch (_) {
      setBookedSlots({});
    }
    setLoadingSlots(false);
  };

  // ─── Form Submit ───────────────────────────────────────────────────────────
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setBookingError("");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        setBookingError(data.message || "حصل خطأ. حاول تاني.");
        setFormLoading(false);
        return;
      }

      setFormSubmitted(true);
    } catch (_) {
      setBookingError("حصل خطأ في الاتصال. تأكد من الإنترنت وحاول تاني.");
    }

    setFormLoading(false);
  };

  // ─── Kareem Chat ───────────────────────────────────────────────────────────
  const sendChat = async () => {
    const text = chatInput.trim();
    if (!text || chatLoading) return;
    const newMessages = [...chatMessages, { role:"user", content:text }];
    setChatMessages(newMessages);
    setChatInput("");
    setChatLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      if (res.ok) {
        const d = await res.json();
        setChatMessages((m) => [...m, { role:"assistant", content: d.content }]);
      } else {
        setChatMessages((m) => [...m, { role:"assistant", content:"حصل خطأ صغير. حاول تاني بعد شوية." }]);
      }
    } catch (_) {
      setChatMessages((m) => [...m, { role:"assistant", content:"مش قادر أتواصل دلوقتي. حاول تاني." }]);
    }
    setChatLoading(false);
  };

  const font = "'Tajawal', 'Arial', sans-serif";
  const btnPrimary = {
    background: `linear-gradient(135deg, ${C.primary}, ${C.primaryDark})`,
    color:"#fff", border:"none", borderRadius:100,
    padding:"14px 32px", fontSize:16, fontWeight:700,
    cursor:"pointer", fontFamily:font,
    boxShadow:`0 4px 16px rgba(89,154,215,0.35)`, transition:"all 0.2s",
  };

  const inputStyle = {
    width:"100%", padding:"12px 16px", borderRadius:10,
    border:`1.5px solid ${C.border}`, fontSize:15, fontFamily:font,
    direction:"rtl", background:C.white, color:C.charcoal,
    transition:"border 0.2s",
  };

  // ══════════════════════════════════════════════════════════════════════════
  // ── ADMIN PANEL ──────────────────────────────────────────────────────────
  // ══════════════════════════════════════════════════════════════════════════
  if (showAdmin) {
    if (!adminAuth) {
      return (
        <div dir="rtl" style={{ fontFamily:font, minHeight:"100vh", background:"linear-gradient(135deg,#1B2559,#2d3a7c)", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800;900&display=swap" rel="stylesheet" />
          <div style={{ background:C.white, borderRadius:20, padding:40, width:"100%", maxWidth:420, boxShadow:"0 16px 64px rgba(0,0,0,0.25)" }}>
            <div style={{ textAlign:"center", marginBottom:28 }}>
              <div style={{ fontSize:48, marginBottom:8 }}>🔐</div>
              <h2 style={{ fontSize:22, fontWeight:800, color:C.charcoal }}>دخول الفريق</h2>
              <p style={{ fontSize:13, color:C.gray, marginTop:4 }}>لوحة تحكم الحجوزات</p>
            </div>
            <form onSubmit={handleAdminLogin}>
              <div style={{ marginBottom:16 }}>
                <label style={{ fontSize:13, fontWeight:700, color:C.charcoal, display:"block", marginBottom:6 }}>البريد الإلكتروني</label>
                <input
                  type="email" required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="your@vezeeta.com"
                  style={{ ...inputStyle, direction:"ltr" }}
                />
              </div>
              <div style={{ marginBottom:20 }}>
                <label style={{ fontSize:13, fontWeight:700, color:C.charcoal, display:"block", marginBottom:6 }}>كلمة السر</label>
                <input
                  type="password" required
                  value={adminPass}
                  onChange={(e) => setAdminPass(e.target.value)}
                  placeholder="••••••••••"
                  style={{ ...inputStyle, direction:"ltr" }}
                />
              </div>
              {adminLoginErr && (
                <div style={{ background:"#FEE2E2", color:"#991B1B", borderRadius:8, padding:"10px 14px", marginBottom:16, fontSize:14 }}>
                  {adminLoginErr}
                </div>
              )}
              <button type="submit" style={{ ...btnPrimary, width:"100%", borderRadius:12, padding:"14px" }}>دخول</button>
            </form>
            <p style={{ textAlign:"center", marginTop:16, fontSize:13, color:C.gray, cursor:"pointer" }} onClick={() => setShowAdmin(false)}>
              ← رجوع للصفحة الرئيسية
            </p>
          </div>
        </div>
      );
    }

    // ── Authenticated Admin ─────────────────────────────────────────────────
    const totalBooked = Object.keys(adminBookings).length;
    const allSlotsFull = TIME_SLOTS.every((t) => adminBookings[t]);

    return (
      <div dir="rtl" style={{ fontFamily:font, minHeight:"100vh", background:C.surface }}>
        <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800;900&display=swap" rel="stylesheet" />

        {/* Admin Nav */}
        <nav style={{ background:C.charcoal, padding:"0 24px", height:60, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:32, height:32, borderRadius:8, background:"#0066CC", display:"flex", alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden" }}>
              <span style={{ color:"#fff", fontWeight:900, fontSize:18 }}>V</span>
              <div style={{ position:"absolute", bottom:0, left:0, right:0, height:5, background:"#E31B23" }} />
            </div>
            <span style={{ color:"#fff", fontWeight:800, fontSize:16 }}>فيزيتا — لوحة الحجوزات</span>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={() => setShowAdmin(false)} style={{ background:"rgba(255,255,255,0.1)", color:"#fff", border:"none", borderRadius:8, padding:"8px 16px", fontSize:13, cursor:"pointer", fontFamily:font }}>
              ← الصفحة الرئيسية
            </button>
            <button onClick={() => { setAdminAuth(false); setAdminEmail(""); setAdminPass(""); }} style={{ background:"rgba(239,68,68,0.15)", color:"#EF4444", border:"none", borderRadius:8, padding:"8px 16px", fontSize:13, cursor:"pointer", fontFamily:font }}>
              خروج
            </button>
          </div>
        </nav>

        <div style={{ maxWidth:900, margin:"32px auto", padding:"0 24px" }}>
          {/* Date Picker */}
          <div style={{ background:C.white, borderRadius:16, padding:24, marginBottom:24, border:`1px solid ${C.border}`, boxShadow:"0 2px 12px rgba(0,0,0,0.04)" }}>
            <h2 style={{ fontSize:18, fontWeight:800, color:C.charcoal, marginBottom:16 }}>📅 اختر يوم لعرض الحجوزات</h2>
            <div style={{ display:"flex", gap:12, alignItems:"center", flexWrap:"wrap" }}>
              <input
                type="date"
                value={adminDate}
                min="2026-01-01"
                max={getMaxDate()}
                onChange={(e) => {
                  setAdminDate(e.target.value);
                  fetchAdminBookings(e.target.value);
                }}
                style={{ ...inputStyle, width:"auto", direction:"ltr" }}
              />
              <span style={{ fontSize:14, color:C.slate, fontWeight:600 }}>
                {formatDisplayDate(adminDate)}
              </span>
              <span style={{
                padding:"4px 12px", borderRadius:100, fontSize:12, fontWeight:700,
                background: totalBooked === 0 ? "#F0FDF4" : totalBooked >= TIME_SLOTS.length ? "#FEE2E2" : C.primaryLight,
                color: totalBooked === 0 ? "#166534" : totalBooked >= TIME_SLOTS.length ? "#991B1B" : C.primaryDark,
              }}>
                {totalBooked} / {TIME_SLOTS.length} محجوز
              </span>
            </div>
          </div>

          {/* Bookings Grid */}
          {adminLoading ? (
            <div style={{ textAlign:"center", padding:60, color:C.gray }}>جاري التحميل...</div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {TIME_SLOTS.map((slot) => {
                const booking = adminBookings[slot];
                return (
                  <div key={slot} style={{
                    background: booking ? "#F0FDF4" : C.white,
                    borderRadius:12, padding:"16px 20px",
                    border: `1.5px solid ${booking ? "#86EFAC" : C.border}`,
                    display:"flex", alignItems:"center", gap:16, flexWrap:"wrap",
                  }}>
                    {/* Time */}
                    <div style={{
                      minWidth:80, padding:"6px 14px", borderRadius:100,
                      background: booking ? "#166534" : C.surface,
                      color: booking ? "#fff" : C.slate,
                      fontSize:14, fontWeight:800, textAlign:"center", flexShrink:0,
                    }}>
                      {formatTimeAr(slot)}
                    </div>

                    {booking ? (
                      <>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontSize:15, fontWeight:700, color:C.charcoal }}>{booking.name}</div>
                          <div style={{ fontSize:13, color:C.slate, marginTop:2 }}>{booking.specialty}</div>
                        </div>
                        <div style={{ fontSize:14, color:C.slate, direction:"ltr", fontWeight:600 }}>
                          📱 {booking.phone}
                        </div>
                        {booking.notes && (
                          <div style={{ width:"100%", fontSize:12, color:C.gray, background:C.surface, borderRadius:8, padding:"6px 10px", marginTop:4 }}>
                            📝 {booking.notes}
                          </div>
                        )}
                      </>
                    ) : (
                      <div style={{ fontSize:14, color:C.gray }}>متاح</div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Summary */}
          {!adminLoading && totalBooked === 0 && (
            <div style={{ textAlign:"center", padding:40, color:C.gray, fontSize:15 }}>
              لا توجد حجوزات في هذا اليوم
            </div>
          )}
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // ── LANDING PAGE ─────────────────────────────────────────────────────────
  // ══════════════════════════════════════════════════════════════════════════
  const formValid = formData.name && formData.phone && formData.specialty &&
                    formData.date && formData.time && isWorkingDay(formData.date);

  return (
    <div dir="rtl" style={{ fontFamily:font, background:C.white, color:C.charcoal, overflowX:"hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800;900&display=swap" rel="stylesheet" />
      <style>{`
        * { margin:0; padding:0; box-sizing:border-box; }
        body { direction:rtl; }
        ::selection { background:${C.primaryLight}; }
        input:focus, textarea:focus, select:focus {
          outline:none; border-color:${C.primary} !important;
          box-shadow:0 0 0 3px rgba(89,154,215,0.15) !important;
        }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px);} to{opacity:1;transform:translateY(0);} }
        @keyframes pulse { 0%,100%{transform:scale(1);} 50%{transform:scale(1.08);} }
        @keyframes typing { 0%,80%,100%{transform:scale(0.6);opacity:0.5;} 40%{transform:scale(1);opacity:1;} }
        .fade-up { animation:fadeUp 0.7s ease forwards; }
        .pulse-btn { animation:pulse 2.5s ease-in-out infinite; }
        @media(max-width:768px){
          .hero-title { font-size:32px !important; }
          .form-cols { flex-direction:column !important; }
          .services-grid { grid-template-columns:1fr 1fr !important; }
          .steps-grid { grid-template-columns:1fr 1fr !important; }
          .stats-grid { grid-template-columns:1fr 1fr !important; }
          .slots-grid { grid-template-columns:repeat(2,1fr) !important; }
        }
        @media(max-width:480px){
          .services-grid { grid-template-columns:1fr !important; }
          .steps-grid { grid-template-columns:1fr !important; }
          .slots-grid { grid-template-columns:repeat(2,1fr) !important; }
        }
      `}</style>

      {/* ── NAV ───────────────────────────────────────────────────────────── */}
      <nav style={{
        position:"sticky", top:0, zIndex:100,
        background:"rgba(255,255,255,0.97)", backdropFilter:"blur(16px)",
        borderBottom:`1px solid ${C.border}`, padding:"0 24px", height:64,
        display:"flex", alignItems:"center", justifyContent:"space-between",
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:38, height:38, borderRadius:10, background:"#0066CC", display:"flex", alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden" }}>
            <span style={{ color:"#fff", fontWeight:900, fontSize:20 }}>V</span>
            <div style={{ position:"absolute", bottom:0, left:0, right:0, height:6, background:"#E31B23" }} />
          </div>
          <span style={{ fontSize:20, fontWeight:800, color:C.charcoal }}>فيزيتا</span>
          <span style={{ fontSize:12, fontWeight:500, color:C.gray, marginTop:2 }}>الإجراءات الطبية</span>
        </div>
        <button
          onClick={() => formRef.current?.scrollIntoView({ behavior:"smooth", block:"center" })}
          style={{ ...btnPrimary, padding:"10px 24px", fontSize:14 }}
        >
          احجز استشارة مجانية
        </button>
      </nav>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section style={{
        background:`linear-gradient(160deg,${C.white} 0%,${C.primarySubtle} 50%,${C.primaryLight} 100%)`,
        padding:"64px 24px 80px", position:"relative", overflow:"hidden",
      }}>
        <div style={{ position:"absolute", top:-120, left:-80, width:400, height:400, borderRadius:"50%", background:`radial-gradient(circle,rgba(89,154,215,0.08),transparent)`, pointerEvents:"none" }} />
        <div style={{ maxWidth:860, margin:"0 auto", textAlign:"center" }} className="fade-up">
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, marginBottom:24, background:C.accentLight, borderRadius:100, padding:"6px 16px" }}>
            <span style={{ width:8, height:8, borderRadius:"50%", background:C.accent, display:"inline-block" }} />
            <span style={{ fontSize:14, fontWeight:600, color:C.accent }}>استشارة أولى مجانية — من غير أي التزام</span>
          </div>
          <h1 className="hero-title" style={{ fontSize:48, fontWeight:900, lineHeight:1.3, marginBottom:20 }}>
            <span style={{ color:C.charcoal }}>من الاستشارة للتعافي</span><br />
            <span style={{ color:C.primary }}>إحنا معاك في كل خطوة</span>
          </h1>
          <p style={{ fontSize:18, color:C.slate, lineHeight:1.9, maxWidth:600, margin:"0 auto 40px" }}>
            نوصّلك بأفضل المتخصصين والمستشفيات اللي تناسب حالتك،<br />نتابع معاك كل التفاصيل — وانت اللي بتقرر
          </p>

          {/* Search bar */}
          <div ref={searchRef} style={{ position:"relative", maxWidth:600, margin:"0 auto 24px" }}>
            <div style={{ display:"flex", borderRadius:16, overflow:"hidden", boxShadow:`0 4px 24px rgba(89,154,215,0.15)`, border:`1.5px solid ${C.border}`, background:C.white }}>
              <input
                type="text" placeholder="ابحث عن التخصص أو الإجراء اللي تحتاجه..."
                value={searchQuery} onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => searchQuery && setShowDropdown(true)}
                style={{ flex:1, padding:"16px 20px", border:"none", outline:"none", fontSize:16, fontFamily:font, direction:"rtl", background:"transparent", color:C.charcoal }}
              />
              <button onClick={() => searchResults.length && selectService(searchResults[0])}
                style={{ background:`linear-gradient(135deg,${C.primary},${C.primaryDark})`, color:"#fff", border:"none", padding:"0 28px", fontSize:16, fontWeight:700, cursor:"pointer", fontFamily:font, flexShrink:0 }}>
                ابحث
              </button>
            </div>
            {showDropdown && searchResults.length > 0 && (
              <div style={{ position:"absolute", top:"calc(100% + 8px)", right:0, left:0, zIndex:50, background:C.white, borderRadius:12, boxShadow:"0 8px 32px rgba(0,0,0,0.12)", border:`1px solid ${C.border}`, overflow:"hidden" }}>
                {searchResults.map((svc, i) => (
                  <div key={i} onClick={() => selectService(svc)}
                    style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 20px", cursor:"pointer", borderBottom: i < searchResults.length-1 ? `1px solid ${C.border}` : "none" }}
                    onMouseEnter={(e) => e.currentTarget.style.background = C.primarySubtle}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                    <span style={{ fontSize:22 }}>{svc.icon}</span>
                    <div>
                      <div style={{ fontWeight:700, fontSize:14, color:C.charcoal }}>{svc.name}</div>
                      <div style={{ fontSize:12, color:C.gray, marginTop:2 }}>{svc.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick pills */}
          <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap" }}>
            {QUICK_PILLS.map((p) => (
              <button key={p.idx} onClick={() => selectPill(p.idx)}
                style={{ padding:"8px 20px", borderRadius:100, background:C.white, border:`1.5px solid ${C.border}`, fontSize:14, fontWeight:600, color:C.slate, cursor:"pointer", fontFamily:font, transition:"all 0.2s", boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor=C.primary; e.currentTarget.style.color=C.primary; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor=C.border; e.currentTarget.style.color=C.slate; }}>
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST STATS ───────────────────────────────────────────────────── */}
      <section style={{ background:C.white, borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}`, padding:"32px 24px" }}>
        <div className="stats-grid" style={{ maxWidth:960, margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(4,1fr)" }}>
          {[
            { num:"أكتر من ٥٠٠", label:"أخصائي ومتخصص" },
            { num:"أكتر من ١٢٠", label:"مستشفى ومركز معتمد" },
            { num:"أكتر من ٥٠ ألف", label:"إجراء طبي ناجح" },
            { num:"٤٫٨ من ٥", label:"تقييم المرضى" },
          ].map((s, i) => (
            <div key={i} style={{ textAlign:"center", padding:"20px 16px", borderRight: i<3 ? `1px solid ${C.border}` : "none" }}>
              <div style={{ fontSize:26, fontWeight:900, color:C.primary, marginBottom:4 }}>{s.num}</div>
              <div style={{ fontSize:13, color:C.gray }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SERVICES GRID ─────────────────────────────────────────────────── */}
      <section style={{ background:C.surface, padding:"80px 24px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:48 }}>
            <div style={{ display:"inline-block", padding:"4px 14px", borderRadius:100, background:C.primaryLight, color:C.primary, fontSize:12, fontWeight:700, letterSpacing:1, textTransform:"uppercase", marginBottom:12 }}>التخصصات</div>
            <h2 style={{ fontSize:34, fontWeight:900, color:C.charcoal }}>خدماتنا الطبية والجراحية</h2>
          </div>
          <div className="services-grid" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16 }}>
            {SERVICES.map((svc, i) => (
              <div key={i} onClick={() => selectService(svc)}
                style={{ background:C.white, borderRadius:16, padding:"24px 20px", border:`1px solid ${C.border}`, cursor:"pointer", boxShadow:"0 2px 16px rgba(89,154,215,0.06)", transition:"all 0.2s", position:"relative" }}
                onMouseEnter={(e) => { e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow=`0 8px 32px rgba(89,154,215,0.18)`; e.currentTarget.style.borderColor=C.primary; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 2px 16px rgba(89,154,215,0.06)"; e.currentTarget.style.borderColor=C.border; }}>
                {svc.hot && (
                  <div style={{ position:"absolute", top:12, left:12, background:C.accent, color:"#fff", fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:100 }}>الأكثر طلباً</div>
                )}
                <div style={{ width:48, height:48, borderRadius:12, background:C.primarySubtle, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, marginBottom:14 }}>{svc.icon}</div>
                <div style={{ fontSize:15, fontWeight:700, color:C.charcoal, marginBottom:6, lineHeight:1.4 }}>{svc.name}</div>
                <div style={{ fontSize:12, color:C.gray, lineHeight:1.6 }}>{svc.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────────── */}
      <section style={{ background:C.surface, padding:"80px 24px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:48 }}>
            <h2 style={{ fontSize:34, fontWeight:900, color:C.charcoal, marginBottom:12 }}>كيف بيشتغل معاك فيزيتا؟</h2>
            <p style={{ fontSize:16, color:C.slate }}>رحلتك معانا في أربع خطوات بسيطة</p>
          </div>
          <div className="steps-grid" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16 }}>
            {STEPS.map((step, i) => (
              <div key={i} style={{ background:C.white, borderRadius:16, padding:28, border:`1px solid ${C.border}`, boxShadow:"0 2px 16px rgba(89,154,215,0.06)" }}>
                <div style={{ width:44, height:44, borderRadius:12, marginBottom:16, background: i===0 ? `linear-gradient(135deg,${C.primary},${C.primaryDark})` : C.primaryLight, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, fontWeight:800, color: i===0 ? "#fff" : C.primary }}>{step.num}</div>
                <h3 style={{ fontSize:16, fontWeight:700, color:C.charcoal, marginBottom:10, lineHeight:1.4 }}>{step.title}</h3>
                <p style={{ fontSize:13, color:C.slate, lineHeight:1.8 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LEAD FORM ─────────────────────────────────────────────────────── */}
      <section style={{ background:C.white, padding:"80px 24px" }} ref={formRef}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div className="form-cols" style={{ display:"flex", gap:64, alignItems:"flex-start" }}>

            {/* Left: value prop */}
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:"inline-block", padding:"4px 14px", borderRadius:100, background:C.primaryLight, color:C.primary, fontSize:12, fontWeight:700, marginBottom:16 }}>احجز الآن</div>
              <h2 style={{ fontSize:32, fontWeight:900, color:C.charcoal, marginBottom:24, lineHeight:1.4 }}>خطوتك الأولى تبدأ هنا</h2>
              <div style={{ display:"flex", flexDirection:"column", gap:16, marginBottom:32 }}>
                {[
                  { emoji:"💰", text:"أسعار شفافة من البداية — بدون رسوم مخفية" },
                  { emoji:"🩺", text:"متابعة مستمرة قبل وبعد الإجراء" },
                  { emoji:"🤝", text:"نعرض عليك الخيارات — وانت اللي بتقرر" },
                ].map((b, i) => (
                  <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:12 }}>
                    <div style={{ width:36, height:36, borderRadius:10, flexShrink:0, background:C.primarySubtle, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>{b.emoji}</div>
                    <p style={{ fontSize:15, color:C.slate, lineHeight:1.7, marginTop:6 }}>{b.text}</p>
                  </div>
                ))}
              </div>
              {/* Kareem nudge */}
              <div onClick={() => setChatOpen(true)}
                style={{ background:C.primarySubtle, borderRadius:14, padding:"16px 20px", border:`1px solid ${C.primaryLight}`, display:"flex", alignItems:"center", gap:12, cursor:"pointer" }}>
                <span style={{ fontSize:28 }}>🤖</span>
                <div>
                  <div style={{ fontSize:14, fontWeight:700, color:C.charcoal }}>مش حابب تملا الفورم؟</div>
                  <div style={{ fontSize:13, color:C.primary, fontWeight:600 }}>كلّم كريم — مساعد الدعم الذكي</div>
                </div>
              </div>
            </div>

            {/* Right: form */}
            <div style={{ flex:1, minWidth:0 }}>
              {formSubmitted ? (
                <div style={{ background:"#F0FDF4", borderRadius:20, padding:48, border:"1px solid #BBF7D0", textAlign:"center", boxShadow:"0 4px 24px rgba(0,0,0,0.06)" }}>
                  <div style={{ fontSize:56, marginBottom:16 }}>✅</div>
                  <h3 style={{ fontSize:22, fontWeight:800, color:"#166534", marginBottom:12 }}>تم تأكيد حجزك ✓</h3>
                  <p style={{ fontSize:15, color:"#15803D", lineHeight:1.8, marginBottom:24 }}>
                    فريق الرعاية في فيزيتا هيتصل بيك على <strong>{formData.phone}</strong><br />
                    <strong>{formatDisplayDate(formData.date)}</strong> الساعة <strong>{formatTimeAr(formData.time)}</strong>
                  </p>
                  <div style={{ background:C.white, borderRadius:14, padding:20, textAlign:"right", border:`1px solid ${C.border}` }}>
                    {[
                      "فريقنا هيتصل بيك في الموعد المحدد بالظبط",
                      "هنفهم حالتك ونرشّحلك أفضل الخيارات المناسبة",
                      "إحنا معاك في كل خطوة لحد ما تتعافى",
                    ].map((s, i) => (
                      <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 0", borderBottom: i<2 ? `1px solid ${C.border}` : "none" }}>
                        <span style={{ fontSize:16 }}>{"١٢٣".charAt(i)}</span>
                        <span style={{ fontSize:14, color:C.slate }}>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit}
                  style={{ background:C.white, borderRadius:20, padding:36, boxShadow:"0 8px 48px rgba(89,154,215,0.12)", border:`1px solid ${C.border}` }}>
                  <h3 style={{ fontSize:20, fontWeight:800, color:C.charcoal, marginBottom:24 }}>احجز موعد مكالمة مجانية</h3>

                  {/* Name + Phone */}
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
                    <div>
                      <label style={{ fontSize:13, fontWeight:700, color:C.charcoal, display:"block", marginBottom:6 }}>الاسم بالكامل <span style={{ color:C.accent }}>*</span></label>
                      <input required type="text" placeholder="محمد أحمد" value={formData.name}
                        onChange={(e) => setFormData((f) => ({ ...f, name:e.target.value }))}
                        style={inputStyle} />
                    </div>
                    <div>
                      <label style={{ fontSize:13, fontWeight:700, color:C.charcoal, display:"block", marginBottom:6 }}>رقم الموبايل <span style={{ color:C.accent }}>*</span></label>
                      <input required type="tel" placeholder="01XXXXXXXXX" value={formData.phone}
                        onChange={(e) => setFormData((f) => ({ ...f, phone:e.target.value }))}
                        style={{ ...inputStyle, direction:"ltr" }} />
                    </div>
                  </div>

                  {/* Specialty */}
                  <div style={{ marginBottom:16 }}>
                    <label style={{ fontSize:13, fontWeight:700, color:C.charcoal, display:"block", marginBottom:6 }}>التخصص المطلوب <span style={{ color:C.accent }}>*</span></label>
                    <select required value={formData.specialty}
                      onChange={(e) => setFormData((f) => ({ ...f, specialty:e.target.value }))}
                      style={{ ...inputStyle, cursor:"pointer", color: formData.specialty ? C.charcoal : C.gray }}>
                      <option value="">اختر التخصص...</option>
                      {SERVICES.map((s) => <option key={s.name} value={s.name}>{s.icon} {s.name}</option>)}
                    </select>
                  </div>

                  {/* Date */}
                  <div style={{ marginBottom:16 }}>
                    <label style={{ fontSize:13, fontWeight:700, color:C.charcoal, display:"block", marginBottom:6 }}>
                      تاريخ المكالمة <span style={{ color:C.accent }}>*</span>
                      <span style={{ fontSize:11, color:C.gray, fontWeight:400, marginRight:6 }}>(أيام العمل: الأحد – الخميس)</span>
                    </label>
                    <input type="date" required
                      value={formData.date}
                      min={getMinDate()} max={getMaxDate()}
                      onChange={(e) => handleDateChange(e.target.value)}
                      style={{ ...inputStyle, direction:"ltr", color: formData.date ? C.charcoal : C.gray }}
                    />
                    {dateError && (
                      <div style={{ fontSize:12, color:"#DC2626", marginTop:6, display:"flex", alignItems:"center", gap:4 }}>
                        ⚠️ {dateError}
                      </div>
                    )}
                  </div>

                  {/* Time Slots */}
                  {formData.date && isWorkingDay(formData.date) && (
                    <div style={{ marginBottom:16 }}>
                      <label style={{ fontSize:13, fontWeight:700, color:C.charcoal, display:"block", marginBottom:10 }}>
                        أفضل وقت للاتصال <span style={{ color:C.accent }}>*</span>
                        <span style={{ fontSize:11, color:C.gray, fontWeight:400, marginRight:6 }}>(من ١ م لـ ٦ م)</span>
                      </label>

                      {loadingSlots ? (
                        <div style={{ textAlign:"center", padding:"20px 0", color:C.gray, fontSize:13 }}>جاري تحميل المواعيد المتاحة...</div>
                      ) : (
                        <div className="slots-grid" style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:8 }}>
                          {TIME_SLOTS.map((slot) => {
                            const isBooked   = !!bookedSlots[slot];
                            const isSelected = formData.time === slot;
                            return (
                              <button key={slot} type="button"
                                disabled={isBooked}
                                onClick={() => !isBooked && setFormData((f) => ({ ...f, time:slot }))}
                                style={{
                                  padding:"10px 4px", borderRadius:10, fontSize:13, fontWeight:700, fontFamily:font,
                                  cursor: isBooked ? "not-allowed" : "pointer",
                                  border: `2px solid ${isSelected ? C.primary : isBooked ? C.border : C.border}`,
                                  background: isBooked ? "#F1F5F9" : isSelected ? C.primary : C.white,
                                  color: isBooked ? C.gray : isSelected ? "#fff" : C.slate,
                                  opacity: isBooked ? 0.55 : 1,
                                  transition:"all 0.15s",
                                  textAlign:"center",
                                }}>
                                {formatTimeAr(slot)}
                                {isBooked && <div style={{ fontSize:9, marginTop:2, color:C.gray }}>محجوز</div>}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Notes */}
                  <div style={{ marginBottom:20 }}>
                    <label style={{ fontSize:13, fontWeight:700, color:C.charcoal, display:"block", marginBottom:6 }}>
                      وصف مختصر لحالتك <span style={{ color:C.gray, fontWeight:400 }}>(اختياري)</span>
                    </label>
                    <textarea placeholder="اكتب أي تفاصيل تساعدنا نفهم حالتك أحسن..." value={formData.notes}
                      onChange={(e) => setFormData((f) => ({ ...f, notes:e.target.value }))}
                      rows={3}
                      style={{ ...inputStyle, resize:"vertical", lineHeight:1.7 }} />
                  </div>

                  {/* Error */}
                  {bookingError && (
                    <div style={{ background:"#FEE2E2", color:"#991B1B", borderRadius:10, padding:"12px 16px", marginBottom:16, fontSize:14, lineHeight:1.6 }}>
                      ⚠️ {bookingError}
                    </div>
                  )}

                  {/* Submit */}
                  <button type="submit" disabled={formLoading || !formValid}
                    style={{ ...btnPrimary, width:"100%", borderRadius:12, padding:"16px", fontSize:16, opacity: !formValid ? 0.45 : 1, cursor: !formValid ? "not-allowed" : "pointer" }}>
                    {formLoading ? "جاري الحجز..." : "احجز موعد المكالمة المجانية"}
                  </button>
                  <p style={{ textAlign:"center", fontSize:12, color:C.gray, marginTop:12 }}>
                    🔒 بياناتك في أمان تام — لن يتم مشاركتها مع أي طرف آخر
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section style={{ background:C.surface, padding:"80px 24px" }}>
        <div style={{ maxWidth:760, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:48 }}>
            <h2 style={{ fontSize:32, fontWeight:900, color:C.charcoal, marginBottom:12 }}>أسئلة شائعة</h2>
            <p style={{ fontSize:15, color:C.slate }}>كل اللي محتاج تعرفه قبل ما تبدأ</p>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {FAQS.map((faq, i) => (
              <div key={i} style={{ background:C.white, borderRadius:14, border:`1.5px solid ${faqOpen===i ? C.primary : C.border}`, overflow:"hidden", transition:"border-color 0.2s", boxShadow: faqOpen===i ? `0 4px 20px rgba(89,154,215,0.12)` : "none" }}>
                <button onClick={() => setFaqOpen(faqOpen===i ? null : i)}
                  style={{ width:"100%", display:"flex", justifyContent:"space-between", alignItems:"center", padding:"20px 24px", background:"none", border:"none", cursor:"pointer", fontFamily:font, textAlign:"right" }}>
                  <span style={{ fontSize:16, fontWeight:700, color:C.charcoal }}>{faq.q}</span>
                  <span style={{ fontSize:20, color:C.primary, transition:"transform 0.2s", transform: faqOpen===i ? "rotate(45deg)" : "rotate(0)", flexShrink:0, marginRight:12 }}>+</span>
                </button>
                {faqOpen===i && <div style={{ padding:"0 24px 20px", fontSize:15, color:C.slate, lineHeight:1.9 }}>{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer style={{ background:C.charcoal, padding:"48px 24px 32px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto", textAlign:"center" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10, marginBottom:12 }}>
            <div style={{ width:36, height:36, borderRadius:8, background:"#0066CC", display:"flex", alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden" }}>
              <span style={{ color:"#fff", fontWeight:900, fontSize:18 }}>V</span>
              <div style={{ position:"absolute", bottom:0, left:0, right:0, height:5, background:"#E31B23" }} />
            </div>
            <span style={{ fontSize:18, fontWeight:800, color:"#fff" }}>فيزيتا — خدمات الإجراءات الطبية</span>
          </div>
          <p style={{ color:C.gray, fontSize:13, marginBottom:20 }}>© ٢٠٢٦ فيزيتا. جميع الحقوق محفوظة.</p>
          <p style={{ color:"#64748b", fontSize:12, marginBottom:16 }}>فيزيتا لا تقدم نصائح طبية. الاستشارة النهائية مع الطبيب المعالج.</p>
          <span onClick={() => setShowAdmin(true)} style={{ fontSize:12, color:"#374151", cursor:"pointer", userSelect:"none" }}>دخول الفريق</span>
        </div>
      </footer>

      {/* ── KAREEM FLOATING BUTTON ────────────────────────────────────────── */}
      {!chatOpen && (
        <button className="pulse-btn" onClick={() => setChatOpen(true)} title="كلّم كريم"
          style={{ position:"fixed", bottom:28, left:28, zIndex:1000, width:62, height:62, borderRadius:"50%", background:`linear-gradient(135deg,${C.primary},${C.primaryDark})`, border:"3px solid #fff", boxShadow:`0 6px 24px rgba(89,154,215,0.45)`, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:28 }}>
          💬
        </button>
      )}

      {/* ── KAREEM CHAT PANEL ─────────────────────────────────────────────── */}
      {chatOpen && (
        <div dir="rtl" style={{ position:"fixed", bottom:28, left:28, zIndex:1001, width:380, maxWidth:"calc(100vw - 32px)", maxHeight:"80vh", borderRadius:20, background:C.white, boxShadow:"0 16px 64px rgba(0,0,0,0.18)", display:"flex", flexDirection:"column", overflow:"hidden", border:`1px solid ${C.border}`, fontFamily:font }}>
          {/* Header */}
          <div style={{ background:`linear-gradient(135deg,${C.primary},${C.primaryDark})`, padding:"16px 20px", display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0 }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:42, height:42, borderRadius:12, background:"rgba(255,255,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>🤖</div>
              <div>
                <div style={{ color:"#fff", fontWeight:800, fontSize:16 }}>كريم</div>
                <div style={{ color:"rgba(255,255,255,0.75)", fontSize:12 }}>مساعد دعم ذكي • مش دكتور</div>
              </div>
            </div>
            <button onClick={() => setChatOpen(false)}
              style={{ background:"rgba(255,255,255,0.15)", border:"none", borderRadius:8, width:32, height:32, color:"#fff", fontSize:16, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
          </div>
          {/* Disclaimer */}
          <div style={{ background:C.primaryLight, padding:"10px 16px", fontSize:12, color:C.primaryDark, textAlign:"center", borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
            كريم مساعد ذكاء اصطناعي للدعم الأولي — لا يقدم نصائح أو استشارات طبية
          </div>
          {/* Messages */}
          <div style={{ flex:1, overflowY:"auto", padding:"16px", display:"flex", flexDirection:"column", gap:12, minHeight:0 }}>
            {chatMessages.map((m, i) => (
              <div key={i} style={{ display:"flex", justifyContent: m.role==="user" ? "flex-start" : "flex-end" }}>
                <div style={{ maxWidth:"80%", padding:"12px 16px", borderRadius: m.role==="user" ? "16px 16px 16px 4px" : "16px 16px 4px 16px", background: m.role==="user" ? C.surface : C.primary, color: m.role==="user" ? C.charcoal : "#fff", fontSize:14, lineHeight:1.7, whiteSpace:"pre-wrap", border: m.role==="user" ? `1px solid ${C.border}` : "none" }}>
                  {m.content}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div style={{ display:"flex", justifyContent:"flex-end" }}>
                <div style={{ padding:"14px 18px", borderRadius:"16px 16px 4px 16px", background:C.primary, display:"flex", gap:4, alignItems:"center" }}>
                  {[0,1,2].map((d) => (
                    <span key={d} style={{ width:7, height:7, borderRadius:"50%", background:"rgba(255,255,255,0.8)", display:"inline-block", animation:`typing 1.2s ${d*0.2}s ease-in-out infinite` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          {/* Input */}
          <div style={{ padding:"12px 16px", borderTop:`1px solid ${C.border}`, display:"flex", gap:8, flexShrink:0 }}>
            <input value={chatInput} onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key==="Enter" && !e.shiftKey && sendChat()}
              placeholder="اكتب رسالتك..."
              style={{ flex:1, padding:"10px 16px", borderRadius:100, border:`1.5px solid ${C.border}`, fontSize:14, fontFamily:font, direction:"rtl", background:C.surface }} />
            <button onClick={sendChat} disabled={chatLoading}
              style={{ width:42, height:42, borderRadius:12, flexShrink:0, background:`linear-gradient(135deg,${C.primary},${C.primaryDark})`, border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/></svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
