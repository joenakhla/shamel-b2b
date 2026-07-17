export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-admin-token");
  if (req.method === "OPTIONS") return res.status(200).end();

  const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
  const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
  const hasRedis = !!(REDIS_URL && REDIS_TOKEN);
  const ADMIN_TOKEN = "y0ussef(Joe)";

  const redisCmd = async (commands) => {
    if (!hasRedis) return commands.map(() => ({ result: null }));
    const r = await fetch(`${REDIS_URL}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${REDIS_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify(commands),
    });
    return r.json();
  };

  // ── GET: admin data fetch ───────────────────────────────────────────────
  if (req.method === "GET") {
    if (req.headers["x-admin-token"] !== ADMIN_TOKEN) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const KEY_MAP = {
      leads:          "leads:main",
      "chats-main":   "chats:main",
      "chats-surgical":"chats:surgical",
    };
    const key = KEY_MAP[req.query.section];
    if (!key) return res.status(400).json({ error: "invalid section" });

    const results = await redisCmd([["LRANGE", key, "0", "199"]]);
    const items = (results[0]?.result || [])
      .map((s) => { try { return JSON.parse(s); } catch (_) { return null; } })
      .filter(Boolean);
    return res.json({ items, hasRedis });
  }

  // ── POST ────────────────────────────────────────────────────────────────
  if (req.method === "POST") {
    const { type } = req.body || {};

    // B2B form lead
    if (type === "lead") {
      const { name, company, email, phone, employees, message } = req.body;
      if (!name || !email || !phone) {
        return res.status(400).json({ error: "missing fields" });
      }
      const entry = JSON.stringify({
        name, company: company || "", email, phone,
        employees: employees || "", message: message || "",
        submittedAt: new Date().toISOString(),
      });
      await redisCmd([
        ["LPUSH", "leads:main", entry],
        ["LTRIM", "leads:main", "0", "499"],
      ]);
      // Email notification
      try {
        await fetch("https://formsubmit.co/ajax/youssef.medhat@vezeeta.com", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            _subject: `New Shamel B2B Lead — ${company || name}`,
            _cc: "medhat.maher@vezeeta.com,esraa.elsayed@vezeeta.com",
            _template: "table",
            Name: name, Company: company || "—", Email: email,
            Phone: phone, Employees: employees || "—", Message: message || "—",
          }),
        });
      } catch (_) {}
      return res.json({ success: true });
    }

    // Shamel assistant chat session (main page)
    if (type === "chat-main") {
      const { messages } = req.body;
      if (!messages?.length) return res.status(400).json({ error: "no messages" });
      const entry = JSON.stringify({ messages, savedAt: new Date().toISOString() });
      await redisCmd([
        ["LPUSH", "chats:main", entry],
        ["LTRIM", "chats:main", "0", "499"],
      ]);
      return res.json({ success: true });
    }

    return res.status(400).json({ error: "invalid type" });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
