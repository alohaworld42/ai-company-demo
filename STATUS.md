# AI Company Demo

**Ein Satz:** Interaktive Präsentation + Demo, die zeigt, wie lokale LLMs Unternehmensrollen (HR, Rezeption, Buchhaltung, Support, Legal, Marketing, IT-Helpdesk, Angebotserstellung) ersetzen oder augmentieren können.
**Prio:** 1 (Akquise-Tool — zeigt potenziellen Kunden, was möglich ist)
**Stack:** HTML/CSS/JS (Präsentation), Node.js 22 (Demo-Server, keine Dependencies), Ollama (optional, für echte LLM-Antworten)
**Zustand:** fertig — Präsentation (9 Slides) + interaktive Demo (8 Rollen) + Demo-Server

## Starten
```bash
node app/server.mjs   # → http://127.0.0.1:4800
# Presentation: index.html (im Browser öffnen)
# Demo: demo.html (im Browser öffnen)
```

## Testen
Keine Tests. Manuell: Server starten, http://127.0.0.1:4800 öffnen, Rollen durchklicken.

## Struktur
- `index.html` — Präsentation (9 Slides, EN)
- `demo.html` — Interaktive Demo (8 Rollen)
- `app/server.mjs` — Demo-Server (Ollama + Mock-Fallback)
- `README.md` — Dokumentation

## Nächster Schritt
Akquise: Präsentation an potenzielle Kunden zeigen, Demo vorführen.

## Fallstricke
- Ollama optional — ohne Ollama laufen Mock-Antworten
- Kein Auth, kein Rate-Limiting — nur für Demos
"