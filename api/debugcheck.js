export default async function handler(req, res) {
  if (req.query.debug !== "y0ussef(Joe)") return res.status(403).json({ error: "forbidden" });
  const SENDGRID_KEY = process.env.SENDGRID_API_KEY || "";

  const r = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: { Authorization: `Bearer ${SENDGRID_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      personalizations: [{ to: [
        { email: "youssef.medhat@vezeeta.com" },
        { email: "medhat.maher@vezeeta.com" },
        { email: "esraa.elsayed@vezeeta.com" },
      ] }],
      from: { email: "youssef.medhat@vezeeta.com", name: "Vezeeta Bookings" },
      subject: "SendGrid delivery test — Shamel booking system",
      content: [{ type: "text/html", value: "<p>This is a test email to confirm SendGrid delivery works.</p>" }],
    }),
  });

  const body = await r.text();
  return res.status(200).json({
    keyPresent: !!SENDGRID_KEY,
    keyLen: SENDGRID_KEY.length,
    sendgridStatus: r.status,
    sendgridBody: body || "(empty — 202 means accepted)",
    messageId: r.headers.get("x-message-id"),
  });
}
