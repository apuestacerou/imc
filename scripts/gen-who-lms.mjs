import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const csvPath = path.join(root, "who2007.csv");
const outPath = path.join(root, "app", "logic", "whoBmiLmsData.ts");

const lines = fs.readFileSync(csvPath, "utf8").split(/\r?\n/).filter((l) => l.trim());
const rows = [];
for (let i = 2; i < lines.length; i++) {
  const p = lines[i].split(",");
  const month = parseInt(p[0], 10);
  if (!month) continue;
  const bL = parseFloat(p[14]),
    bM = parseFloat(p[15]),
    bS = parseFloat(p[16]);
  const gL = parseFloat(p[17]),
    gM = parseFloat(p[18]),
    gS = parseFloat(p[19]);
  if (!Number.isFinite(bL) || !Number.isFinite(bM) || !Number.isFinite(bS)) continue;
  if (!Number.isFinite(gL) || !Number.isFinite(gM) || !Number.isFinite(gS)) continue;
  rows.push({
    month,
    boys: { L: bL, M: bM, S: bS },
    girls: { L: gL, M: gM, S: gS },
  });
}

const header = `/** Coeficientes LMS IMC por edad (OMS 2007, 5-19 años). Fuente: WHO 2007 vía RCPCH growth-references WHO2007.csv */
export type WhoSex = "masculino" | "femenino";
export type WhoLms = { L: number; M: number; S: number };
export type WhoBmiLmsRow = { month: number; boys: WhoLms; girls: WhoLms };

export const WHO_BMI_FOR_AGE_LMS: readonly WhoBmiLmsRow[] = `;

const body = JSON.stringify(rows, null, 2);
const footer = " as const;\n";
fs.writeFileSync(outPath, header + body + footer);
console.log("written", rows.length, "rows to", outPath);
