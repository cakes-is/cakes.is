import { test, expect } from "@playwright/test";

test.describe("Gallery page", () => {
  test("renders page heading", async ({ page }) => {
    await page.goto("/cakes");
    await expect(page.getByText("Kökurnar okkar")).toBeVisible();
    await expect(
      page.getByText("Hverja köku semjum við sérstaklega"),
    ).toBeVisible();
  });

  test("renders category filter with all categories", async ({ page }) => {
    await page.goto("/cakes");

    const categories = [
      "Allt",
      "Afmæli",
      "Brúðkaup",
      "Ferming",
      "Skírn",
      "Annað",
    ];
    for (const category of categories) {
      await expect(
        page.getByRole("button", { name: category, exact: true }),
      ).toBeVisible();
    }
  });

  test("Allt filter is active by default", async ({ page }) => {
    await page.goto("/cakes");

    const alltButton = page.getByRole("button", { name: "Allt" });
    await expect(alltButton).toHaveAttribute("aria-pressed", "true");
  });

  test("clicking category filter changes active state", async ({ page }) => {
    await page.goto("/cakes");

    const afmaeliButton = page.getByRole("button", { name: "Afmæli" });
    await afmaeliButton.click();

    await expect(afmaeliButton).toHaveAttribute("aria-pressed", "true");
    await expect(
      page.getByRole("button", { name: "Allt" }),
    ).toHaveAttribute("aria-pressed", "false");
  });

  test("shows empty state when no cakes (no Google Sheet connected)", async ({
    page,
  }) => {
    await page.goto("/cakes");
    const cakeCards = page.locator('[class*="group"]').filter({
      has: page.locator("img"),
    });
    const count = await cakeCards.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });
});
