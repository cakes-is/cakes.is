import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("header has all navigation links", async ({ page }) => {
    await page.goto("/");

    const nav = page.getByRole("navigation", { name: "Aðal valmynd" });
    await expect(nav.getByRole("link", { name: "Forsíða" })).toHaveAttribute(
      "href",
      "/",
    );
    await expect(nav.getByRole("link", { name: "Kökur" })).toHaveAttribute(
      "href",
      "/cakes",
    );
    await expect(nav.getByRole("link", { name: "Panta" })).toHaveAttribute(
      "href",
      "/order",
    );
    await expect(nav.getByRole("link", { name: "Um okkur" })).toHaveAttribute(
      "href",
      "/about",
    );
  });

  test("header brand links to homepage", async ({ page }) => {
    await page.goto("/cakes");

    const brand = page.getByRole("link", { name: "BeibíCakes" }).first();
    await brand.click();
    await expect(page).toHaveURL("/");
  });

  test("navigating between pages works", async ({ page }) => {
    await page.goto("/");

    const nav = page.getByRole("navigation", { name: "Aðal valmynd" });

    await nav.getByRole("link", { name: "Kökur" }).click();
    await expect(page).toHaveURL("/cakes");
    await expect(page.getByText("Kökurnar okkar")).toBeVisible();

    await nav.getByRole("link", { name: "Panta" }).click();
    await expect(page).toHaveURL("/order");
    await expect(page.getByRole("heading", { name: "Panta köku" })).toBeVisible();

    await nav.getByRole("link", { name: "Um okkur" }).click();
    await expect(page).toHaveURL("/about");
    await expect(page.getByRole("heading", { name: "Um okkur" })).toBeVisible();
  });

  test("footer has Instagram and email links", async ({ page }) => {
    await page.goto("/");

    const footer = page.locator("footer");
    await expect(footer.getByText("orders@cakes.is")).toBeVisible();
  });
});
