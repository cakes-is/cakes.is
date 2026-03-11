import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import type { Cake, AboutContent } from "./types";

function getAuth() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY;

  if (!email || !key) {
    throw new Error(
      "Missing GOOGLE_SERVICE_ACCOUNT_EMAIL or GOOGLE_PRIVATE_KEY",
    );
  }

  return new JWT({
    email,
    key: key.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

function getSheetId(): string {
  const id = process.env.GOOGLE_SHEET_ID;
  if (!id) {
    throw new Error("Missing GOOGLE_SHEET_ID");
  }
  return id;
}

async function getDoc() {
  const doc = new GoogleSpreadsheet(getSheetId(), getAuth());
  await doc.loadInfo();
  return doc;
}

export async function getCakes(): Promise<Cake[]> {
  try {
    const doc = await getDoc();
    const sheet = doc.sheetsByTitle["Cakes"];

    if (!sheet) {
      console.error('Sheet "Cakes" not found');
      return [];
    }

    const rows = await sheet.getRows();

    return rows
      .map((row) => ({
        name: row.get("name") || "",
        description: row.get("description") || "",
        price: row.get("price") || "",
        imageUrl: row.get("image_url") || "",
        category: row.get("category") || "Annað",
        featured: row.get("featured")?.toLowerCase() === "true",
        published: row.get("published")?.toLowerCase() !== "false",
      }))
      .filter((cake) => cake.published && cake.name);
  } catch (error) {
    console.error("Failed to fetch cakes from Google Sheets:", error);
    return [];
  }
}

export async function getFeaturedCakes(): Promise<Cake[]> {
  const cakes = await getCakes();
  return cakes.filter((cake) => cake.featured);
}

export async function getAboutContent(): Promise<
  Record<string, string>
> {
  try {
    const doc = await getDoc();
    const sheet = doc.sheetsByTitle["About"];

    if (!sheet) {
      console.error('Sheet "About" not found');
      return {};
    }

    const rows = await sheet.getRows();
    const content: Record<string, string> = {};

    for (const row of rows) {
      const key = row.get("key");
      const value = row.get("value");
      if (key && value) {
        content[key] = value;
      }
    }

    return content;
  } catch (error) {
    console.error("Failed to fetch about content:", error);
    return {};
  }
}

export async function appendOrder(data: {
  date: string;
  name: string;
  email: string;
  phone: string;
  event_date: string;
  cake_type: string;
  message: string;
  status: string;
}): Promise<void> {
  const doc = await getDoc();
  const sheet = doc.sheetsByTitle["Orders"];

  if (!sheet) {
    throw new Error('Sheet "Orders" not found');
  }

  await sheet.addRow(data);
}
