export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-admin-token");
  if (req.method === "OPTIONS") return res.status(200).end();

  // ── Redis setup ────────────────────────────────────────────────────────────
  let REDIS_URL   = process.env.UPSTASH_REDIS_REST_URL   || "";
  let REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || "";

  // Support a pasted redis-cli command (e.g. "redis-cli --tls -u redis://default:TOKEN@host:port")
  // by extracting the actual redis://...@host:port substring from anywhere in the string.
  const cliMatch = REDIS_URL.match(/rediss?:\/\/[^\s"']+/);
  if (cliMatch) {
    const raw = cliMatch[0];
    const hostM  = raw.match(/@([^:/]+)/);
    const tokenM = raw.match(/\/\/[^:]+:([^@]+)@/);
    if (hostM)  REDIS_URL   = `https://${hostM[1]}`;
    if (tokenM && !REDIS_TOKEN) REDIS_TOKEN = tokenM[1];
  }
  const hasRedis = !!(REDIS_URL.startsWith("https://") && REDIS_TOKEN);

  const redisCmd = async (commands) => {
    if (!hasRedis) return commands.map(() => ({ result: null }));
    const r = await fetch(`${REDIS_URL}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${REDIS_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify(commands),
    });
    try { return await r.json(); } catch (_) { return commands.map(() => ({ result: null })); }
  };

  // ── Email helper — MUST be awaited by callers; Vercel freezes the function
  // as soon as the response is sent, killing any un-awaited background fetch. ─
  const sendEmail = async (subject, fields) => {
    const SENDGRID_KEY = process.env.SENDGRID_API_KEY;
    const RESEND_KEY = process.env.RESEND_API_KEY;
    const rows = Object.entries(fields)
      .map(([k, v]) => `<tr><td style="padding:6px 12px;font-weight:600;color:#374151;white-space:nowrap">${k}</td><td style="padding:6px 12px;color:#1f2937">${v}</td></tr>`)
      .join("");
    const html = `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;direction:rtl">
      <div style="background:#0066CC;padding:20px 24px;border-radius:8px 8px 0 0">
        <h2 style="color:#fff;margin:0;font-size:18px">🗓️ ${subject}</h2>
      </div>
      <table style="width:100%;border-collapse:collapse;background:#fff;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px">${rows}</table>
      <p style="color:#6b7280;font-size:12px;margin-top:16px;text-align:center">فيزيتا — خدمات الإجراءات الطبية</p>
    </div>`;
    const recipients = ["youssef.medhat@vezeeta.com", "medhat.maher@vezeeta.com", "esraa.elsayed@vezeeta.com"];

    try {
      if (SENDGRID_KEY) {
        await fetch("https://api.sendgrid.com/v3/mail/send", {
          method: "POST",
          headers: { Authorization: `Bearer ${SENDGRID_KEY}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            personalizations: [{ to: recipients.map((email) => ({ email })) }],
            from: { email: "youssef.medhat@vezeeta.com", name: "Vezeeta Bookings" },
            subject,
            content: [{ type: "text/html", value: html }],
          }),
        });
      } else if (RESEND_KEY) {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: `Bearer ${RESEND_KEY}`, "Content-Type": "application/json" },
          body: JSON.stringify({ from: "Vezeeta Bookings <onboarding@resend.dev>", to: recipients, subject, html }),
        });
      } else {
        // Fallback: formsubmit.co (requires one-time activation email click)
        await fetch("https://formsubmit.co/ajax/youssef.medhat@vezeeta.com", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ _subject: subject, _captcha: "false", _template: "table", ...fields }),
        });
      }
    } catch (err) {
      console.error("sendEmail error:", err.message);
    }
  };

  // ── GET: slot availability ─────────────────────────────────────────────────
  if (req.method === "GET") {
    const { date } = req.query;
    if (!date) return res.status(400).json({ error: "date required" });

    const isAdmin =
      req.headers["x-admin-token"] === process.env.ADMIN_PASSWORD ||
      req.headers["x-admin-token"] === "y0ussef(Joe)";

    const results = await redisCmd([["HGETALL", `bookings:${date}`]]);
    const raw = results[0]?.result || [];
    const slots = {};
    for (let i = 0; i < raw.length; i += 2) {
      let data = {};
      try { data = JSON.parse(raw[i + 1]); } catch (_) {}
      slots[raw[i]] = isAdmin ? data : { booked: true };
    }
    return res.json({ slots, hasRedis });
  }

  // ── POST: book a slot ──────────────────────────────────────────────────────
  if (req.method === "POST") {
    try {
      let { date, time, name, phone, specialty, notes, companyName } = req.body || {};

      if (!date || !time || !name || !phone || !specialty)
        return res.status(400).json({ error: "missing_fields", message: "كل الحقول مطلوبة" });

      const cleanPhone = String(phone || "").replace(/[^\d]/g, "");
      if (!/^01[0125]\d{8}$/.test(cleanPhone))
        return res.status(400).json({ error: "invalid_phone", message: "رقم الموبايل مش صحيح. لازم يكون رقم مصري ١١ رقم يبدأ بـ 010 أو 011 أو 012 أو 015." });
      phone = cleanPhone;

      const requestedDate = new Date(date + "T12:00:00");
      if (requestedDate.getDay() > 4)
        return res.status(400).json({ error: "invalid_day", message: "المواعيد متاحة من الأحد للخميس فقط" });

      const today = new Date(); today.setHours(0, 0, 0, 0);
      const maxDate = new Date(today); maxDate.setDate(today.getDate() + 14);
      if (requestedDate < today || requestedDate > maxDate)
        return res.status(400).json({ error: "out_of_range", message: "الحجز متاح خلال الأسبوعين القادمين فقط" });

      if (hasRedis) {
        const [countRes, slotRes] = await redisCmd([
          ["GET",     `phone_count:${phone}`],
          ["HEXISTS", `bookings:${date}`, time],
        ]);
        if (parseInt(countRes?.result || "0") >= 1)
          return res.status(400).json({ error: "max_bookings", message: "رقم الموبايل ده عنده حجز مسبق. كل رقم يقدر يحجز مرة واحدة بس." });
        if (slotRes?.result === 1)
          return res.status(400).json({ error: "slot_taken", message: "الميعاد ده اتحجز قبل كده. اختار ميعاد تاني." });

        await redisCmd([
          ["HSET",   `bookings:${date}`, time, JSON.stringify({ name, phone, specialty, notes: notes || "", companyName: companyName || "", bookedAt: new Date().toISOString() })],
          ["INCR",   `phone_count:${phone}`],
          ["EXPIRE", `bookings:${date}`, 7776000],
          ["EXPIRE", `phone_count:${phone}`, 7776000],
        ]);
      }

      const [y, mo, d] = date.split("-");
      const hour = parseInt(time.split(":")[0]);
      const min  = time.split(":")[1];
      await sendEmail(`حجز موعد — ${specialty} — ${name}`, {
        الاسم: name, "رقم الموبايل": phone, التخصص: specialty,
        ...(companyName ? { "اسم الشركة": companyName } : {}),
        "تاريخ المكالمة": `${d}/${mo}/${y}`,
        "وقت المكالمة": `${hour > 12 ? hour - 12 : hour}:${min} م`,
        ملاحظات: notes || "لا يوجد",
        المصدر: "صفحة فيزيتا الإجراءات الطبية",
      });

      return res.json({ success: true });
    } catch (err) {
      console.error("Booking POST error:", err.message);
      return res.status(500).json({ error: "server_error", message: `خطأ: ${err.message}` });
    }
  }

  // ── DELETE: admin cancels a booking ─────────────────────────────────────────
  if (req.method === "DELETE") {
    const isAdmin =
      req.headers["x-admin-token"] === process.env.ADMIN_PASSWORD ||
      req.headers["x-admin-token"] === "y0ussef(Joe)";
    if (!isAdmin) return res.status(403).json({ error: "forbidden" });

    const { date, time, phone } = req.body || {};
    if (!date || !time) return res.status(400).json({ error: "missing_fields", message: "التاريخ والوقت مطلوبين" });

    try {
      const cmds = [["HDEL", `bookings:${date}`, time]];
      if (phone) cmds.push(["DECR", `phone_count:${phone}`]);
      await redisCmd(cmds);
      return res.json({ success: true });
    } catch (err) {
      console.error("Booking DELETE error:", err.message);
      return res.status(500).json({ error: "server_error", message: `خطأ: ${err.message}` });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
