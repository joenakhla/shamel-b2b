export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  let REDIS_URL = process.env.UPSTASH_REDIS_REST_URL || "";
  const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || "";
  if (REDIS_URL.startsWith("redis://") || REDIS_URL.startsWith("rediss://")) {
    const m = REDIS_URL.match(/@([^:/]+)/);
    if (m) REDIS_URL = `https://${m[1]}`;
  }
  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_API_KEY) return res.status(500).json({ error: "ANTHROPIC_API_KEY not configured" });

  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) return res.status(400).json({ error: "messages array required" });

  // ── Redis helper ─────────────────────────────────────────────────────────
  const redisCmd = async (commands) => {
    if (!REDIS_URL || !REDIS_TOKEN) return commands.map(() => ({ result: null }));
    const r = await fetch(`${REDIS_URL}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${REDIS_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify(commands),
    });
    return r.json();
  };

  const TIME_SLOTS = ["13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30"];

  // Converts Arabic/English time expressions to 24h "HH:MM" format
  const normalizeTime = (raw) => {
    if (!raw) return raw;
    const s = String(raw).trim();
    if (/^\d{2}:\d{2}$/.test(s)) return s; // already HH:MM
    const match = s.match(/^(\d{1,2})(?::(\d{2}))?\s*(pm|am|م|ص|مساء|صباح|العصر|عصراً|الظهر|ظهراً)?$/i);
    if (!match) return s;
    let h = parseInt(match[1]);
    const m = parseInt(match[2] || "0");
    const period = (match[3] || "").toLowerCase();
    const isPm = ["pm", "م", "مساء", "العصر", "عصراً"].includes(period);
    const isAm = ["am", "ص", "صباح", "الظهر", "ظهراً"].includes(period);
    if (isPm && h < 12) h += 12;
    else if (isAm && h === 12) h = 0;
    else if (!isPm && !isAm && h >= 1 && h <= 6) h += 12; // 1-6 range is all PM slots
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };

  const isWorkingDay = (dateStr) => {
    const day = new Date(dateStr + "T12:00:00").getDay();
    return day >= 0 && day <= 4;
  };

  const fmtTime = (t) => {
    const [h, m] = t.split(":");
    const hour = parseInt(h);
    return `${hour > 12 ? hour - 12 : hour}:${m} م`;
  };

  // ── Tool: check_availability ─────────────────────────────────────────────
  const checkAvailability = async ({ date }) => {
    if (!date) return { error: "لازم تحدد التاريخ" };
    if (!isWorkingDay(date)) {
      return { error: "هذا اليوم ليس يوم عمل. أيام العمل من الأحد للخميس فقط." };
    }
    const results = await redisCmd([["HGETALL", `bookings:${date}`]]);
    const raw = results[0]?.result || [];
    const bookedSet = new Set();
    for (let i = 0; i < raw.length; i += 2) bookedSet.add(raw[i]);
    const available = TIME_SLOTS.filter((s) => !bookedSet.has(s));
    return {
      date,
      available_slots: available,
      available_slots_display: available.map((s) => `${fmtTime(s)} — (${s})`),
      total_available: available.length,
    };
  };

  // ── Tool: make_booking ────────────────────────────────────────────────────
  const makeBooking = async ({ name, phone, specialty, date, time, notes }) => {
    const normalizedTime = normalizeTime(time);
    if (!isWorkingDay(date)) return { success: false, error: "يوم غير صحيح" };
    if (!TIME_SLOTS.includes(normalizedTime)) return { success: false, error: `وقت غير صحيح "${time}" → "${normalizedTime}" — الأوقات المتاحة: ${TIME_SLOTS.join(", ")}` };
    time = normalizedTime;

    if (REDIS_URL && REDIS_TOKEN) {
      const [countRes, slotRes] = await redisCmd([
        ["GET", `phone_count:${phone}`],
        ["HEXISTS", `bookings:${date}`, time],
      ]);
      const count = parseInt(countRes?.result || "0");
      if (count >= 2) return { success: false, error: "رقم الموبايل ده وصل للحد الأقصى — ٢ حجوزات بحد أقصى لكل رقم" };
      if (slotRes?.result === 1) return { success: false, error: "الميعاد ده اتحجز. اختار وقت تاني." };

      const bookingData = JSON.stringify({
        name, phone, specialty, notes: notes || "",
        bookedAt: new Date().toISOString(),
      });
      await redisCmd([
        ["HSET", `bookings:${date}`, time, bookingData],
        ["INCR", `phone_count:${phone}`],
        ["EXPIRE", `bookings:${date}`, 7776000],
      ]);
    }

    // Email — fire and forget
    const [y, m, d] = date.split("-");
    const displayDate = `${d}/${m}/${y}`;
    const displayTime = fmtTime(time);
    fetch("https://formsubmit.co/ajax/youssef.medhat@vezeeta.com", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        _subject: `حجز موعد (كريم) — ${specialty} — ${name}`,
        _cc: "medhat.maher@vezeeta.com,esraa.elsayed@vezeeta.com",
        _template: "table",
        الاسم: name,
        "رقم الموبايل": phone,
        التخصص: specialty,
        "تاريخ المكالمة": displayDate,
        "وقت المكالمة": displayTime,
        ملاحظات: notes || "لا يوجد",
        المصدر: "كريم — مساعد الدعم الذكي",
      }),
    }).catch(() => {});

    return { success: true, name, phone, specialty, date, time, displayDate, displayTime };
  };

  // ── Kareem system prompt ──────────────────────────────────────────────────
  const todayStr = new Date().toLocaleDateString("ar-EG", { weekday:"long", year:"numeric", month:"long", day:"numeric", timeZone:"Africa/Cairo" });
  const todayISO = new Date().toLocaleDateString("en-CA", { timeZone:"Africa/Cairo" }); // YYYY-MM-DD
  const KAREEM_SYSTEM = `أنت "كريم" — مساعد الدعم الذكي في فيزيتا لخدمات الإجراءات الطبية والجراحية.

📅 تاريخ اليوم: ${todayStr} (${todayISO})
لما المريض يقول "يوم الاربع" أو "الخميس الجاي" أو أي اسم يوم، احسب التاريخ الفعلي بناءً على تاريخ اليوم ده واستخدمه بصيغة YYYY-MM-DD في الأدوات.

تنبيه مهم: أنت مساعد ذكاء اصطناعي للدعم الأولي فقط — مش دكتور ومش أخصائي طبي. ممنوع تماماً تديّ نصيحة طبية أو تشخيص أو تقترح علاج.

🎯 مهمتك الأساسية: مساعدة المريض في حجز موعد مكالمة مجانية مع فريق فيزيتا.

📋 خطوات الحجز بالترتيب:
١. رحّب واسأل عن التخصص أو الإجراء المطلوب (مناظير، عظام، جراحة عامة، قلب، تجميل، نساء وتوليد، مسالك، عيون)
٢. اسأل عن التاريخ المفضل — وضّح إن أيام العمل من الأحد للخميس فقط، وإن المواعيد من ١ م لـ ٥:٣٠ م، والحجز متاح خلال الأسبوعين القادمين فقط
٣. استخدم check_availability عشان تشوف المواعيد المتاحة في اليوم ده
٤. اعرض المواعيد المتاحة واطلب منه يختار
٥. اسأل عن اسمه الكامل ورقم موبايله
٦. لو فيه ملاحظات على الحالة، اسأل عنها (اختياري)
٧. استخدم make_booking لتأكيد الحجز
٨. أكّدله الحجز بالتفاصيل الكاملة

📌 قواعد مهمة:
- لو المريض اختار يوم جمعة أو سبت، قوله إنه يوم عطلة وساعده يختار يوم تاني
- لو الميعاد محجوز أو مش متاح، اعرض عليه بدائل
- رسائلك تكون مختصرة وواضحة — مش أكتر من ٣ أسطر في الرسالة الواحدة
- ردّ بالعربي المصري دايماً
- بعد الحجز، أكّدله التفاصيل: الاسم، الموبايل، التخصص، التاريخ والوقت

⚠️ تعليمات مهمة لاستخدام الأدوات:
- لما تبعت الوقت لـ make_booking، لازم يكون بصيغة 24 ساعة HH:MM مثل: 13:00 أو 14:30 أو 16:00
- "4 م" أو "4 PM" أو "4 العصر" = 16:00
- "1 م" أو "1 PM" = 13:00
- "5 و نص م" أو "5:30 م" = 17:30
- لو المريض قال "4 العصر"، ابعت time: "16:00" في make_booking`;

  // ── Tool definitions ──────────────────────────────────────────────────────
  const TOOLS = [
    {
      name: "check_availability",
      description: "تحقق من المواعيد المتاحة في يوم معين. استخدمه قبل ما تعرض المواعيد على المريض.",
      input_schema: {
        type: "object",
        properties: {
          date: { type: "string", description: "التاريخ بصيغة YYYY-MM-DD" },
        },
        required: ["date"],
      },
    },
    {
      name: "make_booking",
      description: "احجز موعد مكالمة للمريض. استخدمه بس بعد ما تجمع كل البيانات: الاسم والموبايل والتخصص والتاريخ والوقت.",
      input_schema: {
        type: "object",
        properties: {
          name:      { type: "string", description: "اسم المريض كامل" },
          phone:     { type: "string", description: "رقم الموبايل" },
          specialty: { type: "string", description: "التخصص أو الإجراء المطلوب" },
          date:      { type: "string", description: "التاريخ YYYY-MM-DD" },
          time:      { type: "string", description: "الوقت بصيغة 24h مثل 13:00 أو 14:30" },
          notes:     { type: "string", description: "ملاحظات إضافية عن الحالة (اختياري)" },
        },
        required: ["name", "phone", "specialty", "date", "time"],
      },
    },
  ];

  // ── Agentic loop ──────────────────────────────────────────────────────────
  try {
    let currentMessages = messages.map((m) => ({ role: m.role, content: m.content }));

    for (let iteration = 0; iteration < 5; iteration++) {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 600,
          system: KAREEM_SYSTEM,
          tools: TOOLS,
          messages: currentMessages,
        }),
      });

      if (!response.ok) {
        const err = await response.text();
        return res.status(502).json({ error: "Anthropic error", detail: err });
      }

      const data = await response.json();

      if (data.stop_reason === "tool_use") {
        // Append assistant message (with tool_use blocks)
        currentMessages.push({ role: "assistant", content: data.content });

        // Execute each tool and collect results
        const toolResults = [];
        for (const block of data.content) {
          if (block.type !== "tool_use") continue;
          let result;
          if (block.name === "check_availability") result = await checkAvailability(block.input);
          else if (block.name === "make_booking")   result = await makeBooking(block.input);
          else result = { error: "unknown tool" };

          toolResults.push({
            type: "tool_result",
            tool_use_id: block.id,
            content: JSON.stringify(result),
          });
        }

        currentMessages.push({ role: "user", content: toolResults });
        // Loop back to get Kareem's next response
      } else {
        // end_turn — extract final text
        const content = data.content?.find((b) => b.type === "text")?.text || "";

        // Log exchange to Redis (fire and forget)
        if (REDIS_URL && REDIS_TOKEN) {
          const lastUser = messages[messages.length - 1]?.content || "";
          const entry = JSON.stringify({ userMsg: lastUser, assistantMsg: content, timestamp: new Date().toISOString() });
          fetch(`${REDIS_URL}/pipeline`, {
            method: "POST",
            headers: { Authorization: `Bearer ${REDIS_TOKEN}`, "Content-Type": "application/json" },
            body: JSON.stringify([["LPUSH","chats:surgical",entry],["LTRIM","chats:surgical","0","999"]]),
          }).catch(() => {});
        }

        return res.status(200).json({ content });
      }
    }

    return res.status(200).json({ content: "عذراً، حصل خطأ. حاول تاني من فضلك." });

  } catch (err) {
    console.error("Chat error:", err);
    return res.status(500).json({ error: err.message });
  }
}
