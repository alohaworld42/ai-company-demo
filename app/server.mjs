#!/usr/bin/env node
// AI Company Demo Server — simulates AI-augmented roles
// Connects to Ollama if available, falls back to mock responses
// Usage: node app/server.mjs  →  http://127.0.0.1:4800

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PORT = 4800;
const OLLAMA = "http://127.0.0.1:11434";

async function ollamaGenerate(prompt, model = "qwen3:8b") {
  try {
    const res = await fetch(`${OLLAMA}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model, prompt, stream: false }),
      signal: AbortSignal.timeout(30000),
    });
    if (!res.ok) throw new Error("Ollama not available");
    const data = await res.json();
    return data.response || "No response";
  } catch {
    return null; // fallback to mock
  }
}

const MOCKS = {
  hr: (input) => `**HR Resume Screener — Result**

Based on the job description and resume provided, here is the analysis:

**Candidate Score: 8/10**

**Strengths:**
- 5+ years experience in relevant field
- Strong technical skills matching requirements
- Previous experience in similar industry

**Gaps:**
- Missing certification (can be obtained in 3 months)
- Limited leadership experience

**Recommendation:** Invite to interview. Strong match for the role.

*Note: This is a demo response. Connect Ollama for real AI analysis.*`,

  receptionist: (input) => `**AI Receptionist — Response**

Hello! I'd be happy to help you. Based on your request:

"I can schedule an appointment for you. Here are the available slots:
- Tuesday 10:00 AM
- Wednesday 2:00 PM
- Thursday 11:00 AM

Would you like me to book one of these? I can also answer questions about our services, location, and parking.

For urgent matters, I'll transfer you to a human colleague."

*Note: This is a demo response. Connect Ollama for real AI conversation.*`,

  quote: (input) => `**Quote Generator — Estimate**

**Customer Request:** ${input.slice(0, 100)}...

**Generated Quote:**

| Item | Qty | Unit Price | Total |
|------|-----|-----------|-------|
| Consulting (hours) | 40 | €120 | €4,800 |
| Implementation | 1 | €2,500 | €2,500 |
| Support (3 months) | 1 | €500 | €500 |
| **Total** | | | **€7,800** |

**Terms:** Net 30 days. Valid for 14 days.
**Note:** Reverse charge applies (EU B2B).

*Note: This is a demo response. Connect Ollama for real AI quote generation.*`,

  bookkeeper: (input) => `**Invoice Processor — Result**

**Processed Invoice:**
- Vendor: Example Corp
- Amount: €1,234.56
- Date: 2026-11-03
- Category: Office Supplies
- Tax: 20% USt (€205.76)
- Net: €1,028.80

**Expense Categorization:** Office & Admin
**Tax Deductible:** Yes (100%)
**Reverse Charge:** No

*Note: This is a demo response. Connect Ollama for real AI invoice processing.*`,

  support: (input) => `**Customer Support — Ticket Triage**

**Ticket:** ${input.slice(0, 80)}...

**Priority:** Medium
**Category:** Technical
**Sentiment:** Neutral
**Suggested Response:** "Thank you for reaching out. I understand you're experiencing an issue with [topic]. Let me help you resolve this..."

**Escalation:** Not required
**Auto-resolve:** Possible with FAQ #42

*Note: This is a demo response. Connect Ollama for real AI support.*`,

  legal: (input) => `**Legal Assistant — Contract Review**

**Document:** ${input.slice(0, 60)}...

**Key Findings:**
1. ✅ Standard terms present (payment, delivery, warranty)
2. ⚠️ Missing: Force majeure clause
3. ⚠️ Missing: Data processing agreement (Art. 28 GDPR)
4. ✅ Termination clause: 30 days notice — standard
5. ⚠️ Liability cap: unlimited — recommend capping at 12 months fees

**Recommendation:** Add DPA and liability cap before signing.

*Note: This is a demo response. Connect Ollama for real AI legal review.*`,

  marketing: (input) => `**Marketing Content Generator**

**Topic:** ${input.slice(0, 60)}...

**Generated Content:**

📝 **LinkedIn Post:**
"Excited to share our latest innovation in AI-powered business automation. We're helping companies reduce operational costs by 80% while improving service quality. #AI #Automation #BusinessEfficiency"

📧 **Email Subject:** "Your AI-powered office is ready"
📧 **Email Body:** "Hi [Name], we've prepared a personalized demo showing how AI can handle your reception, HR, and bookkeeping..."

🔍 **SEO Meta:** "AI business automation | Replace receptionist, HR, bookkeeper with local AI | Save €13k/month"

*Note: This is a demo response. Connect Ollama for real AI content generation.*`,

  helpdesk: (input) => `**IT Helpdesk — Troubleshooting**

**Issue:** ${input.slice(0, 60)}...

**Diagnosis:** Network connectivity issue
**Steps:**
1. Check if WiFi is connected
2. Restart router (unplug 30s, plug back)
3. Flush DNS: ipconfig /flushdns
4. Check firewall settings

**Auto-resolve:** 70% of similar tickets resolved with step 2.
**Escalate to human:** No (standard troubleshooting)

*Note: This is a demo response. Connect Ollama for real AI troubleshooting.*`,
};

const ROLES = {
  hr: { name: "HR & Recruiting", model: "qwen3:8b", prompt: (input) => `You are an HR assistant. Analyze this resume against the job description. Score 1-10, list strengths, gaps, and recommendation.\n\n${input}` },
  receptionist: { name: "Receptionist", model: "llama3.3", prompt: (input) => `You are a professional receptionist. Respond helpfully to this visitor request.\n\n${input}` },
  quote: { name: "Quote Generator", model: "qwen3:8b", prompt: (input) => `You are a sales assistant. Generate a detailed quote with line items and pricing for this customer request.\n\n${input}` },
  bookkeeper: { name: "Bookkeeper", model: "mistral", prompt: (input) => `You are a bookkeeper. Process this invoice: categorize, extract amounts, check tax.\n\n${input}` },
  support: { name: "Customer Support", model: "gemma3", prompt: (input) => `You are customer support. Triage this ticket: priority, category, sentiment, suggested response.\n\n${input}` },
  legal: { name: "Legal Assistant", model: "deepseek-r1", prompt: (input) => `You are a legal assistant. Review this contract for issues and missing clauses.\n\n${input}` },
  marketing: { name: "Marketing", model: "qwen3:8b", prompt: (input) => `You are a marketing specialist. Generate content for this topic: LinkedIn post, email, SEO meta.\n\n${input}` },
  helpdesk: { name: "IT Helpdesk", model: "llama3.3", prompt: (input) => `You are IT helpdesk. Diagnose and provide troubleshooting steps.\n\n${input}` },
};

function readStatic(filePath) {
  try { return fs.readFileSync(path.join(ROOT, filePath)); } catch { return null; }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://127.0.0.1:${PORT}`);

  if (url.pathname === "/api/roles") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(Object.entries(ROLES).map(([id, r]) => ({ id, name: r.name, model: r.model }))));
    return;
  }

  if (url.pathname === "/api/process" && req.method === "POST") {
    let body = "";
    req.on("data", (c) => (body += c));
    req.on("end", async () => {
      try {
        const { role, input } = JSON.parse(body);
        const r = ROLES[role];
        if (!r) { res.writeHead(400, { "Content-Type": "application/json" }); res.end(JSON.stringify({ error: "Unknown role" })); return; }
        const aiResponse = await ollamaGenerate(r.prompt(input), r.model);
        const response = aiResponse || MOCKS[role]?.(input) || "No response available";
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ role: r.name, model: r.model, response, source: aiResponse ? "ollama" : "mock" }));
      } catch (e) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  if (url.pathname === "/api/status") {
    let ollamaAvailable = false;
    try {
      const r = await fetch(`${OLLAMA}/api/tags`, { signal: AbortSignal.timeout(3000) });
      ollamaAvailable = r.ok;
    } catch {}
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ollama: ollamaAvailable, roles: Object.keys(ROLES).length }));
    return;
  }

  // Static files
  let filePath = url.pathname === "/" ? "index.html" : url.pathname.slice(1);
  const data = readStatic(filePath);
  if (data) {
    const ext = path.extname(filePath);
    const types = { ".html": "text/html", ".css": "text/css", ".js": "application/javascript", ".json": "application/json", ".png": "image/png", ".svg": "image/svg+xml" };
    res.writeHead(200, { "Content-Type": types[ext] || "application/octet-stream" });
    res.end(data);
  } else {
    res.writeHead(404);
    res.end("Not found");
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`\n  AI Company Demo — http://127.0.0.1:${PORT}\n`);
  console.log("  Presentation: index.html");
  console.log("  Demo API: /api/roles, /api/process, /api/status\n");
});
"