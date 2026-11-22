#!/usr/bin/env node
// Vereinheitlicht die Präsentationsvideos (kurz + lang teilen dieselben Szenen):
// - Schriftgrößen-Skala: nichts unter 22 px, Mittelgrößen gleichmäßig angehoben (1080p-lesbar)
// - Inhaltsszenen: Überschrift immer auf gleicher Höhe (oben), Inhalt volle Breite
// - Behauptungen als Beispielrechnung gekennzeichnet, Modellname korrigiert
// Idempotent: Marker /* vereinheitlicht */ verhindert doppelte Anwendung.
//   node vereinheitlichen.mjs

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HIER = path.dirname(fileURLToPath(import.meta.url));
const SKALA = { 14: 22, 16: 22, 18: 24, 20: 26, 22: 28, 24: 30, 28: 34, 32: 38, 36: 42 };
// Szenen mit Überschrift + Inhalt untereinander: oben ausrichten statt vertikal zentrieren.
const OBEN = ["problem", "solution", "costs", "investment", "architecture", "usp", "cta"];
const TEXTE = [
  [">94% cheaper<", ">Lower running costs*<"],
  ["Compare to 13,000/month in salaries. 90x cheaper.", "Example calculation – real numbers come from the pilot."],
  ["Amortized incl. hardware, power, prompting time. Break-even: under 1 month.", "*Example calculation with assumed salaries and hardware – your numbers come from the pilot."],
  ["Break-even: under 1 month. Start today.", "Next step: pick one role for a pilot."],
  ["— Augments 1 FTE", "— supports the team"],
  ["— Replaces 1 FTE", "— supports the team"],
  ["Llama 3.3 8B", "Llama 3.1 8B"],
  ["of automatable work across 5 roles in a typical SME", "estimated automatable work across 5 roles in a typical SME"],
];

function bearbeite(datei) {
  const name = path.basename(datei, ".html");
  let s = fs.readFileSync(datei, "utf8");
  if (s.includes("/* vereinheitlicht */")) return `${name}: schon vereinheitlicht`;
  s = s.replace(/font-size:\s*(\d+)px/g, (m, n) => `font-size: ${SKALA[n] || n}px`);
  s = s.replace(/max-width:\s*(1[0-5]\d\d|9\d\d)px/g, "max-width: 1640px");
  for (const [alt, neu] of TEXTE) s = s.split(alt).join(neu);
  let extra = "\n    /* vereinheitlicht */";
  if (OBEN.includes(name)) {
    extra += "\n    #root { justify-content: flex-start !important; padding: 120px 140px 90px !important; }\n    h2 { margin-bottom: 48px !important; }";
  }
  s = s.replace("<style>", `<style>${extra}`);
  fs.writeFileSync(datei, s);
  return `${name}: ok`;
}

for (const v of ["kurz", "lang"]) {
  const dir = path.join(HIER, v, "compositions");
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".html"))) console.log(v, bearbeite(path.join(dir, f)));
}

// lang/index.html: doppelte data-hf-id (s7b und s8 teilten „hf-1imz“).
const idx = path.join(HIER, "lang", "index.html");
let h = fs.readFileSync(idx, "utf8");
h = h.replace('data-hf-id="hf-1imz" id="s8"', 'data-hf-id="hf-1imy" id="s8"');
fs.writeFileSync(idx, h);
