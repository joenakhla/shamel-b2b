export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
  const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: "ANTHROPIC_API_KEY not configured" });
  }

  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "messages array required" });
  }

  const KAREEM_SYSTEM = `أنت "كريم" — مساعد الدعم الذكي في فيزيتا لخدمات الإجراءات الطبية والجراحية.

تنبيه مهم: أنت مساعد ذكاء اصطناعي للدعم الأولي فقط — مش دكتور ومش أخصائي طبي. وضّح ده لو حد سألك سؤال طبي.

دورك:
- ترحب بالمستخدم وتسأله عن اسمه ورقم موبايله والخدمة اللي محتاجها — بشكل طبيعي ومريح
- تجاوب على أسئلة عامة عن خدمات فيزيتا (مناظير المعدة، عظام، جراحة عامة، قلب وأوعية، تجميل وجلدية، نساء وتوليد، مسالك، عيون)
- تشرح إن فيزيتا بتوصّل المريض بأفضل المتخصصين والمستشفيات — والمريض هو اللي بيختار
- تشرح الخطوات: استشارة مجانية ← فهم الحالة ← عرض الخيارات ← الإجراء والمتابعة
- تطمّن المريض إن فريق فيزيتا هيتابع معاه في كل خطوة

ممنوع تماماً:
- تدّي أي نصيحة طبية أو تشخيص
- تقترح علاج أو دواء
- تقول رأي طبي في أي حالة
- لو حد سأل سؤال طبي قول: "أنا مساعد دعم مش دكتور — بس ده بالظبط اللي هتقدر تسأله للأخصائي في الاستشارة المجانية"

أسلوبك: مصري عامي، مهني، مطمّن، ومختصر. رسائل قصيرة ٢-٣ سطور.
لو المستخدم قالك اسمه ورقمه والخدمة ← اشكره وقوله "فريقنا هيتواصل معاك خلال ٢٤ ساعة"

ردّ بالعربي المصري دايماً. متستخدمش كلمات إنجليزي.`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 300,
        system: KAREEM_SYSTEM,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(502).json({ error: "Anthropic error", detail: err });
    }

    const data = await response.json();
    const content = data.content?.[0]?.text || "";

    // Log exchange to Redis (fire and forget)
    if (REDIS_URL && REDIS_TOKEN) {
      const entry = JSON.stringify({
        userMsg: messages[messages.length - 1]?.content || "",
        assistantMsg: content,
        timestamp: new Date().toISOString(),
      });
      fetch(`${REDIS_URL}/pipeline`, {
        method: "POST",
        headers: { Authorization: `Bearer ${REDIS_TOKEN}`, "Content-Type": "application/json" },
        body: JSON.stringify([
          ["LPUSH", "chats:surgical", entry],
          ["LTRIM", "chats:surgical", "0", "999"],
        ]),
      }).catch(() => {});
    }

    return res.status(200).json({ content });
  } catch (err) {
    console.error("Chat error:", err);
    return res.status(500).json({ error: err.message });
  }
}
