import { test, expect } from "@playwright/test";

test.describe("Mobile layout", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("desktop nav is hidden on mobile", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Aðal valmynd" });
    await expect(nav).toBeHidden();
  });

  test("hamburger menu button is visible on mobile", async ({ page }) => {
    await page.goto("/");
    const menuButton = page.getByRole("button", { name: /Opna valmynd/ });
    await expect(menuButton).toBeVisible();
  });

  test("mobile menu opens and shows links", async ({ page }) => {
    await page.goto("/");

    const menuButton = page.getByRole("button", { name: /Opna valmynd/ });
    await menuButton.click();

    await expect(page.getByRole("navigation", { name: "Farsíma valmynd" }).getByRole("link", { name: "Forsíða" })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Farsíma valmynd" }).getByRole("link", { name: "Kökur" })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Farsíma valmynd" }).getByRole("link", { name: "Panta", exact: true })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Farsíma valmynd" }).getByRole("link", { name: "Um okkur" })).toBeVisible();
  });

  test("hero section is readable on mobile", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("h1")).toContainText("BeibíCakes");
  });

  test("order form is usable on mobile", async ({ page }) => {
    await page.goto("/order");

    const nameInput = page.getByLabel(/Nafn/);
    await expect(nameInput).toBeVisible();

    const inputBox = await nameInput.boundingBox();
    expect(inputBox).toBeTruthy();
    if (inputBox) {
      expect(inputBox.width).toBeGreaterThan(30);
    }
  });
});
