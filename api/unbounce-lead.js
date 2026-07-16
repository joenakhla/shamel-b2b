// ─── CONFIG (from Vercel Environment Variables) ───
const ZOHO_CLIENT_ID     = process.env.ZOHO_CLIENT_ID;
const ZOHO_CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET;
const ZOHO_REFRESH_TOKEN = process.env.ZOHO_REFRESH_TOKEN;
const ZOHO_DOMAIN = "com";

// ─── UNBOUNCE FIELD MAPPING (confirmed from page source) ───
const FIELD_MAP = {
  email:    "email",
  name:     "full_name",
  company:  "company",
  employees:"no_of_employees",
  phone:    "phone_number_1",
  phone2:   "phone_number_2_optional",
  title:    "title",
  insured:  "insured",
  source:   "how_did_you_hear_about_shamel_",
  request:  "what_is_your_request_about",
};

// ─── BLOCKED COMPANIES ───
const BLOCKED_COMPANIES = ["we", "we gold", "المصرية للاتصالات"];

// ─── HELPER: Get fresh Zoho access token ───
async function getAccessToken() {
  const res = await fetch(
    `https://accounts.zoho.${ZOHO_DOMAIN}/oauth/v2/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type:    "refresh_token",
        client_id:     ZOHO_CLIENT_ID,
        client_secret: ZOHO_CLIENT_SECRET,
        refresh_token: ZOHO_REFRESH_TOKEN,
      }),
    }
  );
  const data = await res.json();
  if (!data.access_token) {
    throw new Error(`Zoho token refresh failed: ${JSON.stringify(data)}`);
  }
  return data.access_token;
}

// ─── HELPER: Extract field value from Unbounce payload ───
function getField(dataJson, fieldName) {
  const val = dataJson[fieldName];
  if (!val) return "";
  // Unbounce wraps values in arrays
  const raw = Array.isArray(val) ? val[0] : val;
  return (raw || "").trim();
}

// ─── HELPER: Validate employee count ───
function isValidEmployeeCount(raw) {
  if (!raw) return false;                  // empty
  const cleaned = raw.replace(/,/g, "");   // handle "1,000" format
  const num = Number(cleaned);
  if (isNaN(num)) return false;            // non-numeric (words, Arabic text, etc.)
  if (num <= 1) return false;              // "1" or "0" or negative
  return true;
}

// ─── HELPER: Check if company is blocked ───
function isBlockedCompany(name) {
  const n = name.toLowerCase().trim();
  return BLOCKED_COMPANIES.some(b => n === b.toLowerCase());
}

// ─── HELPER: Bigin API call ───
async function biginAPI(method, path, token, body) {
  const opts = {
    method,
    headers: {
      Authorization: `Zoho-oauthtoken ${token}`,
      "Content-Type": "application/json",
    },
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`https://www.zohoapis.com/bigin/v1/${path}`, opts);
  const text = await res.text();
  if (!text) return { data: null };
  try { return JSON.parse(text); } catch { return { data: null, raw: text }; }
}

// ─── HELPER: Search or create Account ───
async function getOrCreateAccount(companyName, employeeCount, token) {
  // Search for existing account by name
  const search = await biginAPI(
    "GET",
    `Accounts/search?criteria=(Account_Name:equals:${encodeURIComponent(companyName)})`,
    token
  );

  if (search.data && search.data.length > 0) {
    // Account exists — return its ID
    return search.data[0].id;
  }

  // Create new account with employee count
  const empNum = parseInt(employeeCount) || 0;
  const result = await biginAPI("POST", "Accounts", token, {
    data: [{
      Account_Name: companyName,
      Employees: empNum,
    }],
  });

  if (result.data && result.data[0] && result.data[0].details) {
    return result.data[0].details.id;
  }

  throw new Error(`Account creation failed: ${JSON.stringify(result)}`);
}

// ─── MAIN HANDLER ───
export default async function handler(req, res) {
  // Only accept POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // ── Parse Unbounce payload ──
    const body = req.body;
    const dataJson =
      typeof body["data.json"] === "string"
        ? JSON.parse(body["data.json"])
        : body["data.json"] || body;

    const email     = getField(dataJson, FIELD_MAP.email);
    const name      = getField(dataJson, FIELD_MAP.name);
    const company   = getField(dataJson, FIELD_MAP.company);
    const employees = getField(dataJson, FIELD_MAP.employees);
    const phone     = getField(dataJson, FIELD_MAP.phone);
    const phone2    = getField(dataJson, FIELD_MAP.phone2);
    const title     = getField(dataJson, FIELD_MAP.title);
    const insured   = getField(dataJson, FIELD_MAP.insured);
    const source    = getField(dataJson, FIELD_MAP.source);
    const request   = getField(dataJson, FIELD_MAP.request);

    console.log("Incoming lead:", { email, name, company, employees, phone });

    // ── FILTER 1: Employee count ──
    if (!isValidEmployeeCount(employees)) {
      console.log(`REJECTED — invalid employee count: "${employees}"`);
      return res.status(200).json({
        status: "rejected",
        reason: "invalid_employee_count",
        value: employees,
      });
    }

    // ── FILTER 2: Blocked company ──
    if (isBlockedCompany(company)) {
      console.log(`REJECTED — blocked company: "${company}"`);
      return res.status(200).json({
        status: "rejected",
        reason: "blocked_company",
        value: company,
      });
    }

    // ── Passed filters — push to Bigin ──
    const token = await getAccessToken();

    // Step 1: Search or create Account
    const accountId = await getOrCreateAccount(company, employees, token);
    console.log("Account ID:", accountId);

    // Step 2: Split name into first/last
    const parts = name.split(" ");
    const firstName = parts.length > 1 ? parts.slice(0, -1).join(" ") : "";
    const lastName  = parts.length > 1 ? parts[parts.length - 1] : name;

    // Step 3: Build Description from unmapped fields
    const desc = [
      `Insured: ${insured}`,
      `Source: ${source}`,
      `Request: ${request}`,
    ].join("\n");

    // Step 4: Create Contact (dedup on Email)
    const contactResult = await biginAPI("POST", "Contacts", token, {
      data: [{
        First_Name:   firstName,
        Last_Name:    lastName,
        Email:        email,
        Phone:        phone,
        Mobile:       phone2,
        Title:        title,
        Account_Name: { id: accountId },
        Description:  desc,
      }],
      duplicate_check_fields: ["Email"],
    });
    console.log("Contact result:", JSON.stringify(contactResult));

    const contactId = contactResult?.data?.[0]?.details?.id;

    // Step 5: Create Deal linked to Contact
    let dealResult = null;
    if (contactId) {
      dealResult = await biginAPI("POST", "Deals", token, {
        data: [{
          Deal_Name:    `${company} — Unbounce Lead`,
          Pipeline:     "Sales Pipeline",
          Stage:        "Lead",
          Contact_Name: { id: contactId },
        }],
      });
      console.log("Deal result:", JSON.stringify(dealResult));
    }

    return res.status(200).json({
      status: "created",
      contact: contactResult?.data?.[0]?.details || null,
      deal: dealResult?.data?.[0]?.details || null,
    });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ error: err.message });
  }
}
