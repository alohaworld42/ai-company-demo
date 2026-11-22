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
## Videos (2026-11-22)
- `videos/kurz` + `videos/lang` vereinheitlicht (`node videos/vereinheitlichen.mjs`): Schrift ≥22 px, Überschriften gleiche Höhe, volle Breite; Kostenzahlen als Beispielrechnung gekennzeichnet, „ersetzt 1 FTE“/„Break-even < 1 Monat“ entfernt, Llama 3.1 8B korrigiert.
- Aktuelle Renders: `videos/kurz/renders/praesentation-kurz.mp4`, `videos/lang/renders/praesentation-lang.mp4` (ältere Renders mit den alten Behauptungen liegen in `renders/_veraltet/` – nicht verschicken).
- Szenenwechsel ohne Leerlauf: Einblendungen halbiert (`node videos/tempo.mjs`), Überschriften bzw. Panels ab Bild 0. Abnahme 2026-11-22: jede Szene beider Renders bei +0,2 s und in der Mitte geprüft.
- Abnahme 2026-11-22 (final): jedes Frame aller 23 Videos maschinell geprüft (jd-lancing: 22.050 Frames, 0 leer), Präsentationen im Sekundenraster und jeder Szenenwechsel in 0,1-s-Schritten angesehen.
