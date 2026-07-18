export default async function handler(req, res) {
  const url = process.env.UPSTASH_REDIS_REST_URL || "";
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || "";
  const resendKey = process.env.RESEND_API_KEY || "";

  const mask = (s, keep = 6) => (s ? `${s.slice(0, keep)}...${s.slice(-4)} (len:${s.length})` : "MISSING");

  let redisTestResult = "not tested";
  if (url && token) {
    let testUrl = url;
    let testToken = token;
    const cliMatch = testUrl.match(/rediss?:\/\/[^\s"']+/);
    if (cliMatch) {
      const raw = cliMatch[0];
      const hostM = raw.match(/@([^:/]+)/);
      const tokenM = raw.match(/\/\/[^:]+:([^@]+)@/);
      if (hostM) testUrl = `https://${hostM[1]}`;
      if (tokenM && !testToken) testToken = tokenM[1];
    }
    try {
      const r = await fetch(`${testUrl}/ping`, { headers: { Authorization: `Bearer ${testToken}` } });
      const body = await r.text();
      redisTestResult = `status=${r.status} body=${body.slice(0, 200)}`;
    } catch (e) {
      redisTestResult = `error: ${e.message}`;
    }
  }

  return res.status(200).json({
    UPSTASH_REDIS_REST_URL_raw: mask(url, 15),
    UPSTASH_REDIS_REST_URL_startsWithHttps: url.startsWith("https://"),
    UPSTASH_REDIS_REST_URL_startsWithRedis: url.startsWith("redis://") || url.startsWith("rediss://"),
    UPSTASH_REDIS_REST_TOKEN_raw: mask(token, 6),
    RESEND_API_KEY_present: !!resendKey,
    redisPingTest: redisTestResult,
  });
}
