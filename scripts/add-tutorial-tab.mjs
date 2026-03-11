#!/usr/bin/env node

/**
 * Adds a "Leiðbeiningar" (Instructions) tab to the BeibíCakes CMS sheet
 * with a simple tutorial on how to manage cakes, images, and content.
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

  // Check if tab already exists
  const metaRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets.properties`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  const meta = await metaRes.json();
  const exists = meta.sheets.some((s) => s.properties.title === "Leiðbeiningar");

  if (exists) {
    console.log('⚠️  "Leiðbeiningar" tab already exists — deleting and recreating...');
    const sheetId = meta.sheets.find((s) => s.properties.title === "Leiðbeiningar").properties.sheetId;
    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          requests: [{ deleteSheet: { sheetId } }],
        }),
      },
    );
  }

  // Create the tab
  const addRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        requests: [
          {
            addSheet: {
              properties: {
                title: "Leiðbeiningar",
                tabColorStyle: { rgbColor: { red: 0.78, green: 0.48, blue: 0.48 } },
              },
            },
          },
        ],
      }),
    },
  );
  const addData = await addRes.json();
  const newSheetId = addData.replies[0].addSheet.properties.sheetId;

  // Write the tutorial content
  const rows = [
    ["📖 Leiðbeiningar — BeibíCakes CMS"],
    [""],
    ["━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"],
    ["🎂 BÆTA VIÐ KÖKU"],
    ["━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"],
    ["1. Smelltu á 'Cakes' flipann hér neðst"],
    ["2. Farðu í fyrstu auðu línuna"],
    ["3. Fylltu út dálkana:"],
    [""],
    ["   Dálkur", "Hvað á að skrifa", "Dæmi"],
    ["   name", "Nafn kökunnar", "Súkkulaðiterta"],
    ["   description", "Stutt lýsing á kökunni", "Klassísk súkkulaðiterta með rjómakremi..."],
    ["   price", "Bara talan — sheet-ið bætir 'kr.' við sjálft", "8900"],
    ["   image_url", "Nafn myndarinnar úr Cloudinary (sjá myndaleiðbeiningar)", "sukkuladi-1"],
    ["   category", "Veldu úr fellilistanum", "Afmæli"],
    ["   featured", "true = sýna á forsíðu, false = ekki", "true"],
    ["   published", "true = sýnilegt á vefsíðu, false = falið", "true"],
    [""],
    ["⏱️  Vefsíðan uppfærist sjálfkrafa á 5 mínútna fresti."],
    [""],
    ["━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"],
    ["📸 MYNDIR"],
    ["━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"],
    ["1. Farðu á cloudinary.com og skráðu þig inn"],
    ["2. Smelltu á 'Media Library' og síðan 'Upload'"],
    ["3. Dragðu myndina inn. Góð stærð: 1200px breið, JPG eða WebP"],
    ["4. Mundu nafnið á myndinni (t.d. 'sukkuladi-1')"],
    ["5. Skrifaðu nafnið í image_url dálkinn í Cakes flipanum"],
    [""],
    ["   Til að hafa margar myndir af sömu köku:"],
    ["   Aðskildu nöfnin með kommu: sukkuladi-1, sukkuladi-2, sukkuladi-3"],
    ["   Vefsíðan sýnir þær sem myndasafn sem hægt er að fletta í gegnum."],
    [""],
    ["   💡 Ef þú vilt nota fulla slóð (URL) virkar það líka —"],
    ["      bara byrja á https://"],
    [""],
    ["━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"],
    ["⭐ SETJA KÖKU Á FORSÍÐU"],
    ["━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"],
    ["1. Finndu kökuna í Cakes flipanum"],
    ["2. Breyttu 'featured' dálkinum í 'true'"],
    ["3. Til að taka af forsíðu: breyttu aftur í 'false'"],
    [""],
    ["   3-6 kökur á forsíðu lítur best út."],
    [""],
    ["━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"],
    ["👁️ FELA / SÝNA KÖKU"],
    ["━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"],
    ["1. Finndu kökuna í Cakes flipanum"],
    ["2. Breyttu 'published' dálkinum í 'false' til að fela"],
    ["3. Breyttu aftur í 'true' til að sýna"],
    [""],
    ["   Þú þarft ekki að eyða línunni — bara fela hana!"],
    [""],
    ["━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"],
    ["💰 VERÐ"],
    ["━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"],
    ["Bara skrifa töluna:  8900  →  sheet-ið sýnir  8.900 kr."],
    ["Fyrir verðbil, skrifa sem texta:  25.000 - 45.000 kr."],
    [""],
    ["━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"],
    ["📝 UM OKKUR SÍÐAN"],
    ["━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"],
    ["Smelltu á 'About' flipann og breyttu textanum í 'value' dálkinum."],
    ["Það eru 3 línur: story (sagan), mission (markmið), values (gildi)."],
    [""],
    ["   Forsíðumynd: hero_image línan stýrir myndinni á forsíðunni."],
    ["   Skrifaðu nafn myndar úr Cloudinary (t.d. 'min-kaka') í value dálkinn."],
    [""],
    ["━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"],
    ["📬 PANTANIR"],
    ["━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"],
    ["'Orders' flipinn fyllist sjálfkrafa þegar einhver pantar á vefsíðunni."],
    ["Þú færð líka tölvupóst á orders@cakes.is."],
    ["Þú þarft ekki að gera neitt í þessum flipa — bara skoða pantanir!"],
    [""],
    ["━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"],
    ["⚠️  MIKILVÆGT"],
    ["━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"],
    ["• Ekki breyta nöfnum flipanna (Cakes, Orders, About)"],
    ["• Ekki breyta fyrirsagnalínunum (fyrsta línan í hverjum flipa)"],
    ["• Allt annað má breyta eins og þú vilt!"],
  ];

  // Write all rows to column A (and B, C where needed)
  const values = rows.map((row) => {
    if (Array.isArray(row)) return row;
    return [row];
  });

  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Leiðbeiningar!A1:C${values.length}?valueInputOption=RAW`,
    {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ values }),
    },
  );

  // Format: make it readable
  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        requests: [
          // Column A width
          {
            updateDimensionProperties: {
              range: { sheetId: newSheetId, dimension: "COLUMNS", startIndex: 0, endIndex: 1 },
              properties: { pixelSize: 550 },
              fields: "pixelSize",
            },
          },
          // Column B width
          {
            updateDimensionProperties: {
              range: { sheetId: newSheetId, dimension: "COLUMNS", startIndex: 1, endIndex: 2 },
              properties: { pixelSize: 350 },
              fields: "pixelSize",
            },
          },
          // Column C width
          {
            updateDimensionProperties: {
              range: { sheetId: newSheetId, dimension: "COLUMNS", startIndex: 2, endIndex: 3 },
              properties: { pixelSize: 200 },
              fields: "pixelSize",
            },
          },
          // Word wrap all
          {
            repeatCell: {
              range: { sheetId: newSheetId, startRowIndex: 0, endRowIndex: values.length, startColumnIndex: 0, endColumnIndex: 3 },
              cell: { userEnteredFormat: { wrapStrategy: "WRAP" } },
              fields: "userEnteredFormat.wrapStrategy",
            },
          },
          // Title row: bold + larger font
          {
            repeatCell: {
              range: { sheetId: newSheetId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 1 },
              cell: {
                userEnteredFormat: {
                  textFormat: { bold: true, fontSize: 16 },
                },
              },
              fields: "userEnteredFormat.textFormat(bold,fontSize)",
            },
          },
          // Section headers: bold
          ...rows.reduce((acc, row, i) => {
            const text = Array.isArray(row) ? row[0] : row;
            if (typeof text === "string" && (text.startsWith("🎂") || text.startsWith("📸") || text.startsWith("⭐") || text.startsWith("👁") || text.startsWith("💰") || text.startsWith("📝") || text.startsWith("📬") || text.startsWith("⚠"))) {
              acc.push({
                repeatCell: {
                  range: { sheetId: newSheetId, startRowIndex: i, endRowIndex: i + 1, startColumnIndex: 0, endColumnIndex: 1 },
                  cell: {
                    userEnteredFormat: {
                      textFormat: { bold: true, fontSize: 12 },
                      backgroundColor: { red: 0.98, green: 0.94, blue: 0.89 },
                    },
                  },
                  fields: "userEnteredFormat.textFormat(bold,fontSize),userEnteredFormat.backgroundColor",
                },
              });
            }
            return acc;
          }, []),
          // Table header row (Dálkur / Hvað / Dæmi): bold with background
          {
            repeatCell: {
              range: { sheetId: newSheetId, startRowIndex: 9, endRowIndex: 10, startColumnIndex: 0, endColumnIndex: 3 },
              cell: {
                userEnteredFormat: {
                  textFormat: { bold: true },
                  backgroundColor: { red: 0.95, green: 0.90, blue: 0.84 },
                },
              },
              fields: "userEnteredFormat.textFormat(bold),userEnteredFormat.backgroundColor",
            },
          },
          // Protect the sheet from accidental edits
          {
            addProtectedRange: {
              protectedRange: {
                range: { sheetId: newSheetId },
                description: "Leiðbeiningar — ekki breyta",
                warningOnly: true,
              },
            },
          },
        ],
      }),
    },
  );

  console.log("✅  'Leiðbeiningar' tab added with tutorial content");
  console.log("   Tab color: rose (matches the bakery theme)");
  console.log("   Protected with warning to prevent accidental edits");
}

main().catch((err) => { console.error("❌", err.message); process.exit(1); });
