import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("renders hero section with brand name and CTAs", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("h1")).toContainText("BeibíCakes");
    await expect(
      page.getByText("Sérbakaðar kökur fyrir sérstök tilefni", { exact: true }),
    ).toBeVisible();

    const cakesLink = page.getByRole("link", { name: "Skoða kökur" });
    await expect(cakesLink).toBeVisible();
    await expect(cakesLink).toHaveAttribute("href", "/cakes");

    const orderLink = page.getByRole("link", { name: "Panta köku" }).first();
    await expect(orderLink).toBeVisible();
    await expect(orderLink).toHaveAttribute("href", "/order");
  });

  test("renders about teaser section", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Saga okkar")).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Lesa meira um okkur" }),
    ).toBeVisible();
  });

  test("renders bottom CTA section", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByText("Ertu tilbúin(n) að panta þína drauma köku?"),
    ).toBeVisible();
  });
});
