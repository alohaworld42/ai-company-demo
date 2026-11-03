# AI-Powered Company — Demo & Presentation

**Replace and augment every role in your company with local AI models.**

A self-contained demo and presentation showing how the latest open-source LLMs
(Qwen 3, Llama 3.3, Mistral, Gemma 3, DeepSeek, etc.) can run **locally on your
own hardware** to handle tasks that today require human employees — from HR to
reception to quote generation.

Everything runs offline. No cloud API keys. No data leaves your company.

## What's inside

| File | Purpose |
|------|---------|
| `index.html` | Interactive presentation (slides) — open in any browser |
| `app/server.mjs` | Demo server — simulates AI-augmented roles with real LLM calls (Ollama) |
| `app/ui/` | Interactive demo UI |
| `docs/` | Role-by-role breakdown, cost comparison, implementation roadmap |
| `STATUS.md` | Project status |

## Quick start

```bash
# 1. Install Ollama (https://ollama.com)
ollama pull qwen3:8b
ollama pull llama3.3

# 2. Start the demo
node app/server.mjs
# → http://127.0.0.1:4800

# 3. Open the presentation
# Open index.html in your browser
```

## Roles covered

| Role | AI Capability | Model | Replaces/Augments |
|------|--------------|-------|-------------------|
| HR & Recruiting | Resume screening, candidate ranking, onboarding docs | Qwen 3 8B | Augments |
| Receptionist | €2,500 | €143 (amortized) | 94% |
| Quote Generator | Auto-generate quotes from customer requests | Qwen 3 8B | Augments |
| Bookkeeper | €2,800 | €143 (amortized) | 95% |
| Customer Support | Ticket triage, FAQ responses, escalation | Gemma 3 9B | Augments |
| Legal Assistant | Contract review, NDA generation, compliance check | DeepSeek R1 8B | Augments |
| Marketing | Content generation, social posts, SEO | Qwen 3 8B | Augments |
| IT Helpdesk | Troubleshooting, password resets, ticket routing | Llama 3.3 8B | Augments |

## Cost comparison

| Role | Human (AT, monthly) | AI (local, monthly) | Savings |
|------|---------------------|---------------------|---------|
| Receptionist | €2,500 | €143 (amortized) | 94% |
| HR Assistant | €3,000 | €143 (amortized) | 95% |
| Bookkeeper | €2,800 | €143 (amortized) | 95% |
| Customer Support (1 FTE) | €2,500 | €143 (amortized) | 94% |
| Quote/Estimate Generator | €2,200 | €143 (amortized) | 93% |
| **Total (5 roles)** | **€13,000** | **€715 (amortized)** | **94%** |

*Hardware: Mac Studio M4 Max (one-time). Runs 70B+ models at 20+ tokens/sec. Electricity ~€30/month.*

## License

MIT
"