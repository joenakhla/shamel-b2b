import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ADMIN_EMAIL    = "youssef.medhat@vezeeta.com";
const ADMIN_PASSWORD = "y0ussef(Joe)";
const ADMIN_TOKEN    = "y0ussef(Joe)";

const TIME_SLOTS = [
  "13:00","13:30","14:00","14:30","15:00",
  "15:30","16:00","16:30","17:00","17:30",
];

const formatTimeAr = (t) => {
  const [h, m] = t.split(":");
  const hour = parseInt(h);
  return `${hour > 12 ? hour - 12 : hour}:${m} م`;
};

const formatDisplayDate = (dateStr) => {
  if (!dateStr) return "";
  const days = ["الأحد","الاثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"];
  const day = new Date(dateStr + "T12:00:00").getDay();
  const [y, m, d] = dateStr.split("-");
  return `${days[day]}، ${d}/${m}/${y}`;
};

const formatTs = (ts) => {
  if (!ts) return "";
  try {
    return new Date(ts).toLocaleString("ar-EG", { dateStyle:"short", timeStyle:"short" });
  } catch { return ts; }
};

const TABS = [
  { id:"surgical",    label:"📅 حجوزات الجراحي" },
  { id:"leads",       label:"👥 عملاء شامل B2B" },
  { id:"chat-kareem", label:"💬 محادثات كريم" },
  { id:"chat-shamel", label:"🤖 محادثات شامل" },
];

export default function AdminPanel() {
  const navigate = useNavigate();

  // Auth
  const [authed, setAuthed]   = useState(false);
  const [email, setEmail]     = useState("");
  const [pass, setPass]       = useState("");
  const [loginErr, setLoginErr] = useState("");

  // Active tab
  const [tab, setTab] = useState("surgical");

  // Surgical bookings
  const [surgDate, setSurgDate]       = useState(new Date().toISOString().split("T")[0]);
  const [surgSlots, setSurgSlots]     = useState({});
  const [surgLoading, setSurgLoading] = useState(false);

  // Leads
  const [leads, setLeads]         = useState([]);
  const [leadsLoading, setLeadsLoading] = useState(false);

  // Kareem chat log
  const [kareemLogs, setKareemLogs]     = useState([]);
  const [kareemLoading, setKareemLoading] = useState(false);

  // Shamel chat log
  const [shamelLogs, setShamelLogs]     = useState([]);
  const [shamelLoading, setShamelLoading] = useState(false);

  // Load data when tab changes (after auth)
  useEffect(() => {
    if (!authed) return;
    if (tab === "surgical") fetchSurgical(surgDate);
    if (tab === "leads")    fetchLeads();
    if (tab === "chat-kareem") fetchKareem();
    if (tab === "chat-shamel") fetchShamel();
  }, [tab, authed]);

  // ── Fetch helpers ────────────────────────────────────────────────────────
  const apiFetch = (url) =>
    fetch(url, { headers: { "x-admin-token": ADMIN_TOKEN } }).then((r) => r.json());

  const fetchSurgical = async (date) => {
    setSurgLoading(true);
    try {
      const d = await apiFetch(`/api/bookings?date=${date}`);
      setSurgSlots(d.slots || {});
    } catch (_) { setSurgSlots({}); }
    setSurgLoading(false);
  };

  const [cancelingSlot, setCancelingSlot] = useState(null);
  const cancelBooking = async (slot, booking) => {
    if (!window.confirm(`تأكيد إلغاء حجز ${booking.name} الساعة ${formatTimeAr(slot)}؟`)) return;
    setCancelingSlot(slot);
    try {
      await fetch("/api/bookings", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", "x-admin-token": ADMIN_TOKEN },
        body: JSON.stringify({ date: surgDate, time: slot, phone: booking.phone }),
      });
      await fetchSurgical(surgDate);
    } catch (_) {}
    setCancelingSlot(null);
  };

  const fetchLeads = async () => {
    setLeadsLoading(true);
    try {
      const d = await apiFetch("/api/leads?section=leads");
      setLeads(d.items || []);
    } catch (_) { setLeads([]); }
    setLeadsLoading(false);
  };

  const fetchKareem = async () => {
    setKareemLoading(true);
    try {
      const d = await apiFetch("/api/leads?section=chats-surgical");
      setKareemLogs(d.items || []);
    } catch (_) { setKareemLogs([]); }
    setKareemLoading(false);
  };

  const fetchShamel = async () => {
    setShamelLoading(true);
    try {
      const d = await apiFetch("/api/leads?section=chats-main");
      setShamelLogs(d.items || []);
    } catch (_) { setShamelLogs([]); }
    setShamelLoading(false);
  };

  // ── Styles ───────────────────────────────────────────────────────────────
  const font = "'Tajawal','Arial',sans-serif";
  const C = { primary:"#0066CC", charcoal:"#1B2559", slate:"#4A5568", border:"#E2E8F0", surface:"#F8FAFC", white:"#FFFFFF" };

  // ── Login ────────────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div dir="rtl" style={{ fontFamily:font, minHeight:"100vh", background:"linear-gradient(135deg,#0a1628,#162544)", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap" rel="stylesheet" />
        <div style={{ background:C.white, borderRadius:20, padding:40, width:"100%", maxWidth:420, boxShadow:"0 16px 64px rgba(0,0,0,0.3)" }}>
          <div style={{ textAlign:"center", marginBottom:28 }}>
            <div style={{ fontSize:48, marginBottom:8 }}>🔐</div>
            <h2 style={{ fontSize:22, fontWeight:800, color:C.charcoal }}>لوحة التحكم الموحدة</h2>
            <p style={{ fontSize:13, color:"#94A3B8", marginTop:4 }}>Shamel B2B + Vezeeta Surgical</p>
          </div>
          <form onSubmit={(e) => {
            e.preventDefault();
            if (email.trim().toLowerCase() === ADMIN_EMAIL && pass === ADMIN_PASSWORD) {
              setAuthed(true); setLoginErr("");
            } else {
              setLoginErr("البريد الإلكتروني أو كلمة السر غلط");
            }
          }}>
            <div style={{ marginBottom:16 }}>
              <label style={{ fontSize:13, fontWeight:700, color:C.charcoal, display:"block", marginBottom:6 }}>البريد الإلكتروني</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@vezeeta.com"
                style={{ width:"100%", padding:"12px 16px", borderRadius:10, border:`1.5px solid ${C.border}`, fontSize:15, fontFamily:font, direction:"ltr", boxSizing:"border-box" }} />
            </div>
            <div style={{ marginBottom:20 }}>
              <label style={{ fontSize:13, fontWeight:700, color:C.charcoal, display:"block", marginBottom:6 }}>كلمة السر</label>
              <input type="password" required value={pass} onChange={(e) => setPass(e.target.value)} placeholder="••••••••"
                style={{ width:"100%", padding:"12px 16px", borderRadius:10, border:`1.5px solid ${C.border}`, fontSize:15, fontFamily:font, direction:"ltr", boxSizing:"border-box" }} />
            </div>
            {loginErr && <div style={{ background:"#FEE2E2", color:"#991B1B", borderRadius:8, padding:"10px 14px", marginBottom:16, fontSize:14 }}>{loginErr}</div>}
            <button type="submit" style={{ width:"100%", padding:"14px", borderRadius:12, background:"linear-gradient(135deg,#0066CC,#0052A3)", color:"#fff", border:"none", fontSize:16, fontWeight:700, cursor:"pointer", fontFamily:font }}>دخول</button>
          </form>
          <p style={{ textAlign:"center", marginTop:16, fontSize:13, color:"#94A3B8", cursor:"pointer" }} onClick={() => navigate("/")}>← رجوع للصفحة الرئيسية</p>
        </div>
      </div>
    );
  }

  // ── Authenticated ────────────────────────────────────────────────────────
  const bookedCount = Object.keys(surgSlots).length;

  return (
    <div dir="rtl" style={{ fontFamily:font, minHeight:"100vh", background:C.surface }}>
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap" rel="stylesheet" />
      <style>{`* { margin:0; padding:0; box-sizing:border-box; }`}</style>

      {/* ── Nav ── */}
      <nav style={{ background:"#0a1628", padding:"0 24px", height:60, display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:50 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <img src="/vezeeta-logo.svg" alt="Vezeeta" style={{ height:38, width:"auto" }} />
          <span style={{ color:"#fff", fontWeight:800, fontSize:16 }}>لوحة التحكم الموحدة</span>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={() => navigate("/")} style={{ background:"rgba(255,255,255,0.08)", color:"#fff", border:"none", borderRadius:8, padding:"7px 14px", fontSize:13, cursor:"pointer", fontFamily:font }}>
            الصفحة الرئيسية
          </button>
          <button onClick={() => navigate("/surgical")} style={{ background:"rgba(255,255,255,0.08)", color:"#fff", border:"none", borderRadius:8, padding:"7px 14px", fontSize:13, cursor:"pointer", fontFamily:font }}>
            صفحة الجراحي
          </button>
          <button onClick={() => setAuthed(false)} style={{ background:"rgba(239,68,68,0.15)", color:"#EF4444", border:"none", borderRadius:8, padding:"7px 14px", fontSize:13, cursor:"pointer", fontFamily:font }}>
            خروج
          </button>
        </div>
      </nav>

      {/* ── Tabs ── */}
      <div style={{ background:C.white, borderBottom:`1px solid ${C.border}`, padding:"0 24px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto", display:"flex", gap:4, overflowX:"auto" }}>
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ padding:"14px 20px", border:"none", borderBottom: tab===t.id ? "3px solid #0066CC" : "3px solid transparent", background:"transparent", fontSize:14, fontWeight: tab===t.id ? 700 : 500, color: tab===t.id ? "#0066CC" : "#64748b", cursor:"pointer", fontFamily:font, whiteSpace:"nowrap", transition:"all 0.15s" }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ maxWidth:1100, margin:"28px auto", padding:"0 24px" }}>

        {/* ─────────── Surgical Bookings ─────────── */}
        {tab === "surgical" && (
          <div>
            <div style={{ background:C.white, borderRadius:16, padding:24, marginBottom:20, border:`1px solid ${C.border}` }}>
              <h2 style={{ fontSize:18, fontWeight:800, color:C.charcoal, marginBottom:16 }}>📅 حجوزات مكالمات الجراحي</h2>
              <div style={{ display:"flex", gap:12, alignItems:"center", flexWrap:"wrap" }}>
                <input type="date" value={surgDate}
                  onChange={(e) => { setSurgDate(e.target.value); fetchSurgical(e.target.value); }}
                  style={{ padding:"10px 14px", borderRadius:10, border:`1.5px solid ${C.border}`, fontSize:15, fontFamily:font, direction:"ltr" }} />
                <span style={{ fontSize:14, color:C.slate, fontWeight:600 }}>{formatDisplayDate(surgDate)}</span>
                <span style={{ padding:"4px 12px", borderRadius:100, fontSize:12, fontWeight:700, background: bookedCount===0?"#F0FDF4":bookedCount>=TIME_SLOTS.length?"#FEE2E2":"#EFF6FF", color: bookedCount===0?"#166534":bookedCount>=TIME_SLOTS.length?"#991B1B":"#1D4ED8" }}>
                  {bookedCount} / {TIME_SLOTS.length} محجوز
                </span>
                <button onClick={() => fetchSurgical(surgDate)} style={{ padding:"8px 16px", borderRadius:8, background:"#EFF6FF", color:"#1D4ED8", border:"none", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:font }}>تحديث</button>
              </div>
            </div>

            {surgLoading ? (
              <div style={{ textAlign:"center", padding:60, color:"#94A3B8" }}>جاري التحميل...</div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {TIME_SLOTS.map((slot) => {
                  const b = surgSlots[slot];
                  return (
                    <div key={slot} style={{ background:b?"#F0FDF4":C.white, borderRadius:12, padding:"16px 20px", border:`1.5px solid ${b?"#86EFAC":C.border}`, display:"flex", alignItems:"center", gap:16, flexWrap:"wrap" }}>
                      <div style={{ minWidth:80, padding:"6px 14px", borderRadius:100, background:b?"#166534":C.surface, color:b?"#fff":C.slate, fontSize:14, fontWeight:800, textAlign:"center", flexShrink:0 }}>
                        {formatTimeAr(slot)}
                      </div>
                      {b ? (
                        <>
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ fontSize:15, fontWeight:700, color:C.charcoal }}>{b.name}</div>
                            <div style={{ fontSize:13, color:C.slate, marginTop:2 }}>{b.specialty}</div>
                            {b.companyName && <div style={{ fontSize:12, color:C.primary, fontWeight:700, marginTop:2 }}>🏢 {b.companyName}</div>}
                          </div>
                          <div style={{ fontSize:14, color:C.slate, direction:"ltr", fontWeight:600 }}>📱 {b.phone}</div>
                          <button
                            onClick={() => cancelBooking(slot, b)}
                            disabled={cancelingSlot === slot}
                            style={{ background:"#FEE2E2", color:"#991B1B", border:"none", borderRadius:8, padding:"6px 14px", fontSize:13, fontWeight:700, cursor:cancelingSlot===slot?"default":"pointer", flexShrink:0, opacity:cancelingSlot===slot?0.6:1 }}>
                            {cancelingSlot === slot ? "جاري الإلغاء..." : "✕ إلغاء الحجز"}
                          </button>
                          {b.notes && <div style={{ width:"100%", fontSize:12, color:"#94A3B8", background:C.surface, borderRadius:8, padding:"6px 10px" }}>📝 {b.notes}</div>}
                          {b.bookedAt && <div style={{ fontSize:11, color:"#94A3B8", width:"100%", marginTop:-4 }}>حُجز في: {formatTs(b.bookedAt)}</div>}
                        </>
                      ) : (
                        <div style={{ fontSize:14, color:"#94A3B8" }}>متاح</div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ─────────── B2B Leads ─────────── */}
        {tab === "leads" && (
          <div style={{ background:C.white, borderRadius:16, border:`1px solid ${C.border}`, overflow:"hidden" }}>
            <div style={{ padding:"20px 24px", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <h2 style={{ fontSize:18, fontWeight:800, color:C.charcoal }}>👥 عملاء شامل B2B ({leads.length})</h2>
              <button onClick={fetchLeads} style={{ padding:"8px 16px", borderRadius:8, background:"#EFF6FF", color:"#1D4ED8", border:"none", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:font }}>تحديث</button>
            </div>
            {leadsLoading ? (
              <div style={{ textAlign:"center", padding:60, color:"#94A3B8" }}>جاري التحميل...</div>
            ) : leads.length === 0 ? (
              <div style={{ textAlign:"center", padding:60, color:"#94A3B8", fontSize:15 }}>لا يوجد عملاء بعد</div>
            ) : (
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:14 }}>
                  <thead>
                    <tr style={{ background:C.surface, borderBottom:`2px solid ${C.border}` }}>
                      {["الاسم","الشركة","البريد الإلكتروني","الموبايل","عدد الموظفين","الرسالة","التاريخ"].map((h) => (
                        <th key={h} style={{ padding:"12px 16px", textAlign:"right", fontWeight:700, color:C.slate, fontSize:12, whiteSpace:"nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead, i) => (
                      <tr key={i} style={{ borderBottom:`1px solid ${C.border}` }}
                        onMouseEnter={(e) => e.currentTarget.style.background="#F8FAFC"}
                        onMouseLeave={(e) => e.currentTarget.style.background="transparent"}>
                        <td style={{ padding:"12px 16px", fontWeight:700, color:C.charcoal }}>{lead.name}</td>
                        <td style={{ padding:"12px 16px", color:C.slate }}>{lead.company || "—"}</td>
                        <td style={{ padding:"12px 16px", color:C.slate, direction:"ltr" }}>{lead.email}</td>
                        <td style={{ padding:"12px 16px", color:C.slate, direction:"ltr" }}>{lead.phone}</td>
                        <td style={{ padding:"12px 16px", textAlign:"center" }}>{lead.employees || "—"}</td>
                        <td style={{ padding:"12px 16px", color:C.slate, maxWidth:200, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{lead.message || "—"}</td>
                        <td style={{ padding:"12px 16px", color:"#94A3B8", fontSize:12, whiteSpace:"nowrap" }}>{formatTs(lead.submittedAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ─────────── Kareem Chat (Surgical) ─────────── */}
        {tab === "chat-kareem" && (
          <div>
            <div style={{ background:C.white, borderRadius:16, padding:"20px 24px", marginBottom:20, border:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <h2 style={{ fontSize:18, fontWeight:800, color:C.charcoal }}>💬 سجل محادثات كريم — الجراحي ({kareemLogs.length})</h2>
              <button onClick={fetchKareem} style={{ padding:"8px 16px", borderRadius:8, background:"#EFF6FF", color:"#1D4ED8", border:"none", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:font }}>تحديث</button>
            </div>
            {kareemLoading ? (
              <div style={{ textAlign:"center", padding:60, color:"#94A3B8" }}>جاري التحميل...</div>
            ) : kareemLogs.length === 0 ? (
              <div style={{ textAlign:"center", padding:60, color:"#94A3B8", fontSize:15 }}>لا توجد محادثات بعد</div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                {kareemLogs.map((log, i) => (
                  <div key={i} style={{ background:C.white, borderRadius:14, padding:20, border:`1px solid ${C.border}` }}>
                    <div style={{ fontSize:11, color:"#94A3B8", marginBottom:12 }}>{formatTs(log.timestamp)}</div>
                    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                      <div style={{ background:"#EFF6FF", borderRadius:10, padding:"10px 14px", fontSize:14, color:C.charcoal }}>
                        <span style={{ fontSize:11, fontWeight:700, color:"#1D4ED8", display:"block", marginBottom:4 }}>المستخدم</span>
                        {log.userMsg}
                      </div>
                      <div style={{ background:"#F0FDF4", borderRadius:10, padding:"10px 14px", fontSize:14, color:C.charcoal }}>
                        <span style={{ fontSize:11, fontWeight:700, color:"#166534", display:"block", marginBottom:4 }}>كريم</span>
                        {log.assistantMsg}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─────────── Shamel Chat (Main Page) ─────────── */}
        {tab === "chat-shamel" && (
          <div>
            <div style={{ background:C.white, borderRadius:16, padding:"20px 24px", marginBottom:20, border:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <h2 style={{ fontSize:18, fontWeight:800, color:C.charcoal }}>🤖 سجل محادثات مساعد شامل ({shamelLogs.length})</h2>
              <button onClick={fetchShamel} style={{ padding:"8px 16px", borderRadius:8, background:"#EFF6FF", color:"#1D4ED8", border:"none", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:font }}>تحديث</button>
            </div>
            {shamelLoading ? (
              <div style={{ textAlign:"center", padding:60, color:"#94A3B8" }}>جاري التحميل...</div>
            ) : shamelLogs.length === 0 ? (
              <div style={{ textAlign:"center", padding:60, color:"#94A3B8", fontSize:15 }}>لا توجد محادثات بعد</div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                {shamelLogs.map((session, i) => (
                  <div key={i} style={{ background:C.white, borderRadius:14, border:`1px solid ${C.border}`, overflow:"hidden" }}>
                    <div style={{ padding:"12px 20px", background:C.surface, borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <span style={{ fontSize:13, fontWeight:700, color:C.charcoal }}>جلسة #{shamelLogs.length - i}</span>
                      <span style={{ fontSize:11, color:"#94A3B8" }}>{formatTs(session.savedAt)}</span>
                    </div>
                    <div style={{ padding:16, display:"flex", flexDirection:"column", gap:8 }}>
                      {(session.messages || []).map((m, j) => (
                        <div key={j} style={{ display:"flex", justifyContent: m.from==="user" ? "flex-start" : "flex-end" }}>
                          <div style={{ maxWidth:"80%", padding:"10px 14px", borderRadius:10, background: m.from==="user" ? "#EFF6FF" : "#F3F4F6", fontSize:14, color:C.charcoal, lineHeight:1.6, whiteSpace:"pre-wrap" }}>
                            <div style={{ fontSize:10, fontWeight:700, color: m.from==="user" ? "#1D4ED8" : "#6B7280", marginBottom:4 }}>
                              {m.from === "user" ? "المستخدم" : "المساعد"}
                            </div>
                            {(m.text || "").split("**").map((p, k) => k%2===0 ? p : <strong key={k}>{p}</strong>)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
