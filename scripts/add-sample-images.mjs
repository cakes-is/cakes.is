#!/usr/bin/env node

/**
 * Adds multiple images to sample cakes so the carousel can be tested.
 * Updates the first two cakes to have 3 images each (comma-separated).
 */

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
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
  const { token } = await auth.getAccessToken();
  const spreadsheetId = env.GOOGLE_SHEET_ID;

  // Update image_url for rows 2 and 3 (first two cakes) with comma-separated URLs
  const values = [
    [
      "https://placehold.co/800x600/8B4513/FFF?text=Sukkuladi+1, https://placehold.co/800x600/6B3410/FFF?text=Sukkuladi+2, https://placehold.co/800x600/4B2408/FFF?text=Sukkuladi+3",
    ],
    [
      "https://placehold.co/800x600/DC143C/FFF?text=Jardaberja+1, https://placehold.co/800x600/B01030/FFF?text=Jardaberja+2, https://placehold.co/800x600/8C0C24/FFF?text=Jardaberja+3",
    ],
  ];

  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Cakes!D2:D3?valueInputOption=RAW`,
    {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ values }),
    },
  );

  if (!res.ok) {
    console.error(`❌  ${res.status}: ${await res.text()}`);
    process.exit(1);
  }

  console.log("✅  Updated first 2 cakes with 3 images each");
  console.log("   Open a cake modal to see the carousel!");
}

main().catch((err) => { console.error("❌", err.message); process.exit(1); });
