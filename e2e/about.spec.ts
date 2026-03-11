import { test, expect } from "@playwright/test";

test.describe("About page", () => {
  test("renders page heading", async ({ page }) => {
    await page.goto("/about");
    await expect(page.getByRole("heading", { name: "Um okkur" })).toBeVisible();
  });

  test("renders default content sections when no sheet connected", async ({
    page,
  }) => {
    await page.goto("/about");

    await expect(page.getByRole("heading", { name: "Saga okkar" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Markmið okkar" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Gildi okkar" })).toBeVisible();
  });

  test("renders CTA at bottom", async ({ page }) => {
    await page.goto("/about");

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);
    
    await expect(page.getByText("Tilbúin(n) til að panta?")).toBeAttached();
    
    const main = page.getByRole("main");
    await expect(
      main.getByRole("link", { name: "Panta köku" }),
    ).toBeVisible();
    await expect(
      main.getByRole("link", { name: "Skoða kökur" }),
    ).toBeVisible();
  });
});
