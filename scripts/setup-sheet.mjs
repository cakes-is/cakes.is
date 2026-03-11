#!/usr/bin/env node

/**
 * One-shot script to populate the BeibíCakes CMS Google Sheet.
 *
 * Sets up 3 tabs (Cakes, Orders, About) with headers and sample data
 * in an existing Google Sheet.
 *
 * Usage:
 *   node scripts/setup-sheet.mjs
 *
 * Requires GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, and
 * GOOGLE_SHEET_ID in .env.local. The sheet must already exist and
 * be shared with the service account as Editor.
 */

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

// ---------------------------------------------------------------------------
// Load .env.local manually (no extra deps needed)
// ---------------------------------------------------------------------------
function loadEnv() {
  const envPath = resolve(ROOT, ".env.local");
  let raw;
  try {
    raw = readFileSync(envPath, "utf-8");
  } catch {
    console.error("❌  Could not read .env.local — make sure it exists.");
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

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const env = loadEnv();

  const email = env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = env.GOOGLE_PRIVATE_KEY;
  const sheetId = env.GOOGLE_SHEET_ID;

  if (!email || !key) {
    console.error(
      "❌  GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_PRIVATE_KEY must be set in .env.local",
    );
    process.exit(1);
  }
  if (!sheetId) {
    console.error("❌  GOOGLE_SHEET_ID must be set in .env.local");
    process.exit(1);
  }

  const auth = new JWT({
    email,
    key: key.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  console.log("🔑  Authenticating...");
  console.log(`   Service account: ${email}`);
  console.log(`   Sheet ID: ${sheetId}\n`);

  const doc = new GoogleSpreadsheet(sheetId, auth);
  await doc.loadInfo();
  console.log(`✅  Connected to "${doc.title}"\n`);

  // -------------------------------------------------------------------------
  // Cakes tab — rename the default first sheet
  // -------------------------------------------------------------------------
  const cakesSheet = doc.sheetsByIndex[0];
  await cakesSheet.updateProperties({ title: "Cakes" });
  await cakesSheet.setHeaderRow([
    "name",
    "description",
    "price",
    "image_url",
    "category",
    "featured",
    "published",
  ]);

  // Add sample cakes
  await cakesSheet.addRows([
    {
      name: "Súkkulaðiterta",
      description:
        "Klassísk súkkulaðiterta með rjómakremi og súkkulaðiflögum. Fullkomin fyrir afmæli og sérstök tilefni.",
      price: "8.900 kr.",
      image_url: "https://placehold.co/800x600/8B4513/FFF?text=Sukkuladi",
      category: "Afmæli",
      featured: "true",
      published: "true",
    },
    {
      name: "Jarðaberjakaka",
      description:
        "Létt og ferskur bragð af jarðaberjum á vanillubotni. Skreytt ferskum berjum.",
      price: "7.500 kr.",
      image_url: "https://placehold.co/800x600/DC143C/FFF?text=Jardaberja",
      category: "Skírn",
      featured: "true",
      published: "true",
    },
    {
      name: "Brúðkaupsveisla",
      description:
        "Þriggja hæða brúðkaupsterta með hvítu smjörkremi og blómum úr sykri. Sérsmíðuð að óskum.",
      price: "25.000 - 45.000 kr.",
      image_url: "https://placehold.co/800x600/FFD700/333?text=Brudkaup",
      category: "Brúðkaup",
      featured: "true",
      published: "true",
    },
    {
      name: "Fermingarterta",
      description:
        "Stílhrein terta fyrir fermingu. Hægt að velja lit og skreytingu eftir smekk.",
      price: "9.500 - 14.000 kr.",
      image_url: "https://placehold.co/800x600/9370DB/FFF?text=Ferming",
      category: "Ferming",
      featured: "false",
      published: "true",
    },
    {
      name: "Regnbogaterta",
      description:
        "Skemmtileg og litríkt — sex lög í mismunandi litum með vanillukremi á milli.",
      price: "10.900 kr.",
      image_url: "https://placehold.co/800x600/FF69B4/FFF?text=Regnboga",
      category: "Afmæli",
      featured: "false",
      published: "true",
    },
  ]);
  console.log("🎂  Cakes tab ready (5 sample cakes)");

  // Orders tab
  const ordersSheet = await doc.addSheet({ title: "Orders" });
  await ordersSheet.setHeaderRow([
    "date",
    "name",
    "email",
    "phone",
    "event_date",
    "cake_type",
    "message",
    "status",
  ]);
  console.log("📋  Orders tab ready");

  // About tab
  const aboutSheet = await doc.addSheet({ title: "About" });
  await aboutSheet.setHeaderRow(["key", "value"]);
  await aboutSheet.addRows([
    {
      key: "story",
      value:
        "BeibíCakes byrjaði sem ástríða í litlu eldhúsi á Íslandi. Við elskum að búa til einstaka kökur sem gera sérhvert tilefni ógleymanlegt.",
    },
    {
      key: "mission",
      value:
        "Markmiðið okkar er að bjóða handgerðar kökur úr bestu hráefnum, skreyttar af alúð og elju.",
    },
    {
      key: "values",
      value:
        "Gæði, sköpunarkraftur og persónuleg þjónusta eru hjartað í öllu sem við gerum.",
    },
  ]);
  console.log("ℹ️   About tab ready");

  // -------------------------------------------------------------------------
  // Done
  // -------------------------------------------------------------------------
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/edit`;

  console.log("\n" + "=".repeat(60));
  console.log("🎉  All done! Your sheet is fully set up.\n");
  console.log(`   URL:  ${url}`);
  console.log(`\n   3 tabs: Cakes (5 samples), Orders (empty), About (3 rows)`);
  console.log("=".repeat(60) + "\n");
}

main().catch((err) => {
  console.error("❌  Script failed:", err.message || err);
  process.exit(1);
});
