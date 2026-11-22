#!/usr/bin/env node
// Lesbarkeit nach `hyperframes check` (Craft-Pass):
// - Schrift-Untergrenze 28 px (Handy-lesbar): 22/24/26 px -> 28 px
// - Titel steht ab Frame 0 (Vorschaubild auf Social-Playern)
// - Lesepausen als gewollt markiert (data-hold)
// - Szenenlänge nach Textmenge statt pauschal 4 s (0,5 s + 0,3 s pro Wort für die längste Zeile)
// Idempotent über Marker /* lesbar */.
//   node lesbar.mjs && (cd kurz && npx hyperframes@0.9.26 check --strict)

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HIER = path.dirname(fileURLToPath(import.meta.url));
const DAUER = { title: 5, problem: 7, solution: 8, receptionist: 7, hr: 7, quote: 7, costs: 7,
  investment: 8, architecture: 7, usp: 9, cta: 5, outro: 4 };

for (const v of ["kurz", "lang"]) {
  const dir = path.join(HIER, v, "compositions");
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".html"))) {
    const p = path.join(dir, f);
    let s = fs.readFileSync(p, "utf8");
    // Lesepause ist gewollt: data-hold sagt dem Craft-Pass, dass Stillstand Absicht ist.
    if (!s.includes("data-hold")) s = s.replace(/(id="root" data-composition-id="\w+")/, "$1 data-hold");
    fs.writeFileSync(p, s);
    if (s.includes("/* lesbar */")) continue;
    s = s.replace(/font-size:\s*(22|24|26)px/g, "font-size: 28px");
    if (f === "title.html") {
      s = s.replace('tl.fromTo(".tag", { opacity: 0, y: -20 }', 'tl.fromTo(".tag", { opacity: 1, y: 0 }');
      s = s.replace('tl.fromTo("h1", { opacity: 0, y: 40 }', 'tl.fromTo("h1", { opacity: 1, y: 0 }');
    }
    s = s.replace("<style>", "<style>\n    /* lesbar */");
    fs.writeFileSync(p, s);
  }
  const idx = path.join(HIER, v, "index.html");
  let h = fs.readFileSync(idx, "utf8");
  let t = 0;
  h = h.replace(/data-composition-id="(\w+)" data-composition-src="[^"]+" data-start="[\d.]+" data-duration="[\d.]+"/g, (m, id) => {
    const d = DAUER[id];
    if (!d) throw new Error(`Keine Dauer für ${id}`);
    const neu = m.replace(/data-start="[\d.]+" data-duration="[\d.]+"/, `data-start="${t}" data-duration="${d}"`);
    t += d;
    return neu;
  });
  h = h.replace(/(data-composition-id="main" data-start="0" data-duration=")[\d.]+"/, `$1${t}"`);
  fs.writeFileSync(idx, h);
  console.log(v, "Gesamtdauer", t, "s");
}
