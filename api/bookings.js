export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-admin-token");
  if (req.method === "OPTIONS") return res.status(200).end();

  const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
  const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
  const hasRedis = !!(REDIS_URL && REDIS_TOKEN);

  const redisCmd = async (commands) => {
    if (!hasRedis) return commands.map(() => ({ result: null }));
    const r = await fetch(`${REDIS_URL}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${REDIS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commands),
    });
    return r.json();
  };

  // ── GET: check slot availability for a date ──────────────────────────────
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
      const time = raw[i];
      let data = {};
      try { data = JSON.parse(raw[i + 1]); } catch (_) {}
      slots[time] = isAdmin ? data : { booked: true };
    }

    return res.json({ slots, hasRedis });
  }

  // ── POST: book a slot ────────────────────────────────────────────────────
  if (req.method === "POST") {
    try {
    const { date, time, name, phone, specialty, notes } = req.body || {};

    if (!date || !time || !name || !phone || !specialty) {
      return res
        .status(400)
        .json({ error: "missing_fields", message: "كل الحقول مطلوبة" });
    }

    // Validate working day (0=Sun … 4=Thu)
    const dayOfWeek = new Date(date + "T12:00:00").getDay();
    if (dayOfWeek > 4) {
      return res.status(400).json({
        error: "invalid_day",
        message: "المواعيد متاحة من الأحد للخميس فقط",
      });
    }

    if (hasRedis) {
      const [countRes, slotRes] = await redisCmd([
        ["GET", `phone_count:${phone}`],
        ["HEXISTS", `bookings:${date}`, time],
      ]);

      const count = parseInt(countRes?.result || "0");
      if (count >= 2) {
        return res.status(400).json({
          error: "max_bookings",
          message:
            "رقم الموبايل ده وصل للحد الأقصى من الحجوزات (٢ مواعيد فقط لكل رقم)",
        });
      }

      if (slotRes?.result === 1) {
        return res.status(400).json({
          error: "slot_taken",
          message: "الميعاد ده اتحجز قبل كده. اختار ميعاد تاني.",
        });
      }

      // Commit booking
      const bookingData = JSON.stringify({
        name,
        phone,
        specialty,
        notes: notes || "",
        bookedAt: new Date().toISOString(),
      });

      await redisCmd([
        ["HSET", `bookings:${date}`, time, bookingData],
        ["INCR", `phone_count:${phone}`],
        ["EXPIRE", `bookings:${date}`, 7776000], // 90-day TTL
      ]);
    }

    // Format date/time for email
    const [y, m, d] = date.split("-");
    const displayDate = `${d}/${m}/${y}`;
    const hour = parseInt(time.split(":")[0]);
    const min = time.split(":")[1];
    const displayTime = `${hour > 12 ? hour - 12 : hour}:${min} ${hour >= 12 ? "PM" : "AM"}`;

    // Send email to all three recipients
    try {
      await fetch(
        "https://formsubmit.co/ajax/youssef.medhat@vezeeta.com",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            _subject: `حجز موعد مكالمة — ${specialty} — ${name}`,
            _cc: "medhat.maher@vezeeta.com,esraa.elsayed@vezeeta.com",
            _template: "table",
            الاسم: name,
            "رقم الموبايل": phone,
            التخصص: specialty,
            "تاريخ المكالمة": displayDate,
            "وقت المكالمة": displayTime,
            ملاحظات: notes || "لا يوجد",
            المصدر: "صفحة فيزيتا الإجراءات الطبية",
          }),
        }
      );
    } catch (_) {}

    return res.json({ success: true });
    } catch (err) {
      console.error("Booking POST error:", err);
      return res.status(500).json({ error: "server_error", message: "حصل خطأ في الخادم. حاول تاني." });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
