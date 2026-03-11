#!/usr/bin/env node

/**
 * Adds quality-of-life formatting to the BeibíCakes CMS sheet:
 * - Category column (E): dropdown list validation
 * - Featured column (F): dropdown (true/false)
 * - Published column (G): dropdown (true/false)
 * - Description column (B): word wrap
 *
 * Safe to run multiple times — overwrites previous validation/formatting.
 *
 * Usage:
 *   node scripts/format-sheet.mjs
 */

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { JWT } from "google-auth-library";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

function loadEnv() {
  const envPath = resolve(ROOT, ".env.local");
  let raw;
  try {
    raw = readFileSync(envPath, "utf-8");
  } catch {
    console.error("❌  Could not read .env.local");
    process.exit(1);
  }

  const env = {};
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let value = trimmed.slice(eqIdx + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

async function main() {
  const env = loadEnv();
  const email = env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = env.GOOGLE_PRIVATE_KEY;
  const spreadsheetId = env.GOOGLE_SHEET_ID;

  if (!email || !key || !spreadsheetId) {
    console.error("❌  Need GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, and GOOGLE_SHEET_ID in .env.local");
    process.exit(1);
  }

  const auth = new JWT({
    email,
    key: key.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const { token } = await auth.getAccessToken();

  // First, get the sheet metadata to find the Cakes tab's sheetId (numeric)
  const metaRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets.properties`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  const meta = await metaRes.json();
  const cakesTab = meta.sheets.find((s) => s.properties.title === "Cakes");

  if (!cakesTab) {
    console.error('❌  No "Cakes" tab found');
    process.exit(1);
  }

  const cakesSheetId = cakesTab.properties.sheetId;
  console.log(`📄  Cakes tab sheetId: ${cakesSheetId}`);

  const categories = ["Afmæli", "Brúðkaup", "Ferming", "Skírn", "Annað"];

  // batchUpdate requests
  const requests = [
    // 1. Category dropdown (column E = index 4), rows 2-1000
    {
      setDataValidation: {
        range: {
          sheetId: cakesSheetId,
          startRowIndex: 1,
          endRowIndex: 1000,
          startColumnIndex: 4,
          endColumnIndex: 5,
        },
        rule: {
          condition: {
            type: "ONE_OF_LIST",
            values: categories.map((c) => ({ userEnteredValue: c })),
          },
          showCustomUi: true,
          strict: false, // allow custom values too (future categories)
        },
      },
    },
    // 2. Featured dropdown (column F = index 5), rows 2-1000
    {
      setDataValidation: {
        range: {
          sheetId: cakesSheetId,
          startRowIndex: 1,
          endRowIndex: 1000,
          startColumnIndex: 5,
          endColumnIndex: 6,
        },
        rule: {
          condition: {
            type: "ONE_OF_LIST",
            values: [{ userEnteredValue: "true" }, { userEnteredValue: "false" }],
          },
          showCustomUi: true,
          strict: true,
        },
      },
    },
    // 3. Published dropdown (column G = index 6), rows 2-1000
    {
      setDataValidation: {
        range: {
          sheetId: cakesSheetId,
          startRowIndex: 1,
          endRowIndex: 1000,
          startColumnIndex: 6,
          endColumnIndex: 7,
        },
        rule: {
          condition: {
            type: "ONE_OF_LIST",
            values: [{ userEnteredValue: "true" }, { userEnteredValue: "false" }],
          },
          showCustomUi: true,
          strict: true,
        },
      },
    },
    // 4. Word wrap on description column (B = index 1), all rows
    {
      repeatCell: {
        range: {
          sheetId: cakesSheetId,
          startRowIndex: 0,
          endRowIndex: 1000,
          startColumnIndex: 1,
          endColumnIndex: 2,
        },
        cell: {
          userEnteredFormat: {
            wrapStrategy: "WRAP",
          },
        },
        fields: "userEnteredFormat.wrapStrategy",
      },
    },
    // 5. Set description column width to something readable (350px)
    {
      updateDimensionProperties: {
        range: {
          sheetId: cakesSheetId,
          dimension: "COLUMNS",
          startIndex: 1,
          endIndex: 2,
        },
        properties: {
          pixelSize: 350,
        },
        fields: "pixelSize",
      },
    },
    // 6. Price column (C = index 2): number format with "kr." suffix
    //    Input 20000 → displays as "20.000 kr."
    {
      repeatCell: {
        range: {
          sheetId: cakesSheetId,
          startRowIndex: 1,
          endRowIndex: 1000,
          startColumnIndex: 2,
          endColumnIndex: 3,
        },
        cell: {
          userEnteredFormat: {
            numberFormat: {
              type: "NUMBER",
              pattern: '#,##0 "kr."',
            },
          },
        },
        fields: "userEnteredFormat.numberFormat",
      },
    },
    // 7. Word wrap + width on image_url column (D = index 3)
    {
      repeatCell: {
        range: {
          sheetId: cakesSheetId,
          startRowIndex: 0,
          endRowIndex: 1000,
          startColumnIndex: 3,
          endColumnIndex: 4,
        },
        cell: {
          userEnteredFormat: {
            wrapStrategy: "WRAP",
          },
        },
        fields: "userEnteredFormat.wrapStrategy",
      },
    },
    {
      updateDimensionProperties: {
        range: {
          sheetId: cakesSheetId,
          dimension: "COLUMNS",
          startIndex: 3,
          endIndex: 4,
        },
        properties: {
          pixelSize: 300,
        },
        fields: "pixelSize",
      },
    },
  ];

  console.log("🔧  Applying formatting...");

  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ requests }),
    },
  );

  if (!res.ok) {
    const body = await res.text();
    console.error(`❌  API ${res.status}: ${body}`);
    process.exit(1);
  }

  console.log("✅  Category column → dropdown (Afmæli, Brúðkaup, Ferming, Skírn, Annað)");
  console.log("✅  Featured/Published columns → dropdown (true/false)");
  console.log("✅  Description column → word wrap + 350px width");
  console.log("✅  Price column → auto-format numbers as 'X kr.'");
  console.log("✅  Image URL column → word wrap + 300px width");

  // -------------------------------------------------------------------------
  // Convert existing text prices to numbers
  // -------------------------------------------------------------------------
  console.log("\n🔢  Converting existing prices to numbers...");

  // Read current price values
  const rangeRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Cakes!C2:C1000`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  const rangeData = await rangeRes.json();
  const values = rangeData.values || [];

  if (values.length > 0) {
    // Convert text prices to numbers: "8.900 kr." → 8900, "25.000 - 45.000 kr." stays as-is
    const converted = values.map(([val]) => {
      if (!val) return [val];
      // Strip "kr.", spaces, and try to parse
      const cleaned = val.replace(/\s*kr\.?\s*/gi, "").trim();
      // If it contains a dash (range like "25.000 - 45.000"), leave as text
      if (cleaned.includes("-")) return [val];
      // Remove dots used as thousands separators and parse
      const num = Number(cleaned.replace(/\./g, "").replace(/,/g, "."));
      if (!isNaN(num) && num > 0) return [num];
      return [val];
    });

    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Cakes!C2:C${1 + values.length}?valueInputOption=RAW`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ values: converted }),
      },
    );
    console.log(`   Converted ${converted.filter(([v]) => typeof v === "number").length} prices to numbers`);
    console.log(`   (Range prices like "25.000 - 45.000 kr." left as text)`);
  }

  console.log("\n🎉  Done!");
}

main().catch((err) => {
  console.error("❌  Failed:", err.message || err);
  process.exit(1);
});
