export default async function handler(req, res) {
  if (req.query.cleanup !== "y0ussef(Joe)") return res.status(403).json({ error: "forbidden" });
  let url = process.env.UPSTASH_REDIS_REST_URL || "";
  let token = process.env.UPSTASH_REDIS_REST_TOKEN || "";
  const cliMatch = url.match(/rediss?:\/\/[^\s"']+/);
  if (cliMatch) {
    const raw = cliMatch[0];
    const hostM = raw.match(/@([^:/]+)/);
    const tokenM = raw.match(/\/\/[^:]+:([^@]+)@/);
    if (hostM) url = `https://${hostM[1]}`;
    if (tokenM && !token) token = tokenM[1];
  }
  const r = await fetch(`${url}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify([
      ["HDEL", "bookings:2026-07-21", "14:00"],
      ["DEL", "phone_count:01114381462"],
      ["HDEL", "bookings:2026-07-22", "15:00"],
      ["DEL", "phone_count:01224388985"],
    ]),
  });
  return res.status(200).json({ cleanup: await r.json() });
}
