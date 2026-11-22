#!/usr/bin/env node
// Halbiert die Einblend-Zeitpunkte in allen Szenen (kurz + lang), damit nach einem Szenenwechsel
// kein leerer dunkler Bildschirm steht (vorher 0,4–1,2 s). Idempotent über Marker „/* tempo */“.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const HIER = path.dirname(fileURLToPath(import.meta.url));
const r2 = (x) => Math.round(x * 100) / 100;
for (const v of ["kurz", "lang"]) {
  const dir = path.join(HIER, v, "compositions");
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".html"))) {
    const p = path.join(dir, f);
    let s = fs.readFileSync(p, "utf8");
    if (s.includes("/* tempo */")) continue;
    const a = s.indexOf("<script>"), b = s.indexOf("</script>", a);
    if (a < 0) continue;
    let js = s.slice(a, b);
    // Zeitpunkt am Ende eines tl-Aufrufs: „}, 0.6 + i * 0.15);“ oder „}, 1.5);“
    js = js.replace(/\},\s*([0-9.]+)\s*\+\s*i\s*\*\s*([0-9.]+)\s*\)/g, (m, x, y) => `}, ${r2(x * 0.5)} + i * ${r2(y * 0.6)})`);
    js = js.replace(/\},\s*([0-9.]+)\s*\)/g, (m, x) => `}, ${r2(x * 0.5)})`);
    s = s.slice(0, a) + "<script>\n    /* tempo */" + js.slice("<script>".length) + s.slice(b);
    fs.writeFileSync(p, s);
    console.log(v, f);
  }
}
