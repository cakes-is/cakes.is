import { test, expect } from "@playwright/test";

test.describe("SEO", () => {
  test("homepage has correct title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/BeibíCakes/);
  });

  test("cakes page has correct title", async ({ page }) => {
    await page.goto("/cakes");
    await expect(page).toHaveTitle(/Kökur — BeibíCakes/);
  });

  test("order page has correct title", async ({ page }) => {
    await page.goto("/order");
    await expect(page).toHaveTitle(/Panta köku — BeibíCakes/);
  });

  test("about page has correct title", async ({ page }) => {
    await page.goto("/about");
    await expect(page).toHaveTitle(/Um okkur — BeibíCakes/);
  });

  test("html lang attribute is Icelandic", async ({ page }) => {
    await page.goto("/");
    const lang = await page.locator("html").getAttribute("lang");
    expect(lang).toBe("is");
  });

  test("structured data is present", async ({ page }) => {
    await page.goto("/");
    const jsonLd = page.locator('script[type="application/ld+json"]');
    await expect(jsonLd).toBeAttached();

    const content = await jsonLd.textContent();
    expect(content).toBeTruthy();
    const data = JSON.parse(content!);
    expect(data["@type"]).toBe("Bakery");
    expect(data.name).toBe("BeibíCakes");
  });

  test("sitemap is accessible", async ({ page }) => {
    const response = await page.goto("/sitemap.xml");
    expect(response?.status()).toBe(200);
  });

  test("robots.txt is accessible", async ({ page }) => {
    const response = await page.goto("/robots.txt");
    expect(response?.status()).toBe(200);
  });
});
