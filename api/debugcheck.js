export default async function handler(req, res) {
  if (req.query.cleanup !== "y0ussef(Joe)") return res.status(403).json({ error: "forbidden" });
  const url = process.env.UPSTASH_REDIS_REST_URL || "";
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || "";
  let testUrl = url, testToken = token;
  const cliMatch = testUrl.match(/rediss?:\/\/[^\s"']+/);
  if (cliMatch) {
    const raw = cliMatch[0];
    const hostM = raw.match(/@([^:/]+)/);
    const tokenM = raw.match(/\/\/[^:]+:([^@]+)@/);
    if (hostM) testUrl = `https://${hostM[1]}`;
    if (tokenM && !testToken) testToken = tokenM[1];
  }
  const r = await fetch(`${testUrl}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${testToken}`, "Content-Type": "application/json" },
    body: JSON.stringify([
      ["HDEL", "bookings:2026-07-21", "14:00"],
      ["DEL", "phone_count:01114381462"],
    ]),
  });
  return res.status(200).json({ cleanup: await r.json() });
}
