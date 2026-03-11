#!/usr/bin/env node

/**
 * Adds a hero_image row to the About tab.
 * Uses the first cake image as a placeholder so the hero has something to show.
 */

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

function loadEnv() {
  const raw = readFileSync(resolve(ROOT, ".env.local"), "utf-8");
  const env = {};
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let value = trimmed.slice(eqIdx + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

async function main() {
  const env = loadEnv();
  const auth = new JWT({
    email: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const doc = new GoogleSpreadsheet(env.GOOGLE_SHEET_ID, auth);
  await doc.loadInfo();

  const aboutSheet = doc.sheetsByTitle["About"];
  if (!aboutSheet) {
    console.error('❌  "About" tab not found');
    process.exit(1);
  }

  const rows = await aboutSheet.getRows();
  const hasHeroImage = rows.some((r) => r.get("key") === "hero_image");

  if (hasHeroImage) {
    console.log("⚠️  hero_image row already exists — skipping");
  } else {
    await aboutSheet.addRow({
      key: "hero_image",
      value: "cell_shaded_bday1",
    });
    console.log("✅  Added hero_image row to About tab (using cell_shaded_bday1 as placeholder)");
  }

  console.log("\n   Change the value in the About tab to any Cloudinary image name.");
  console.log("   The homepage hero will update automatically within 5 minutes.");
}

main().catch((err) => { console.error("❌", err.message); process.exit(1); });
