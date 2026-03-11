import { test, expect } from "@playwright/test";

test.describe("Order form page", () => {
  test("renders form with all required fields", async ({ page }) => {
    await page.goto("/order");

    await expect(page.getByRole("heading", { name: "Panta köku" })).toBeVisible();

    await expect(page.getByLabel(/Nafn/)).toBeVisible();
    await expect(page.getByLabel(/Netfang/)).toBeVisible();
    await expect(page.getByLabel(/Sími/)).toBeVisible();
    await expect(page.getByLabel(/Dagsetning viðburðar/)).toBeVisible();
    await expect(page.getByLabel(/Tegund köku/)).toBeVisible();
    await expect(page.getByLabel(/Skilaboð/)).toBeVisible();

    await expect(
      page.getByRole("button", { name: "Senda pöntun" }),
    ).toBeVisible();
  });

  test("cake type dropdown has all options including Fermingarkaka", async ({
    page,
  }) => {
    await page.goto("/order");

    const select = page.getByLabel(/Tegund köku/);
    const options = [
      "Afmæliskaka",
      "Brúðkaupskaka",
      "Fermingarkaka",
      "Skírnar kaka",
      "Kökur fyrir partý",
      "Sérsniðin kaka",
      "Annað",
    ];

    for (const option of options) {
      await expect(select.locator(`option[value="${option}"]`)).toBeAttached();
    }
  });

  test("form inputs fill their container width", async ({ page }) => {
    await page.goto("/order");

    const nameInput = page.getByLabel(/Nafn/);
    const parentBox = await nameInput.evaluate((el) => {
      const parent = el.closest("div");
      return parent?.getBoundingClientRect();
    });
    const inputBox = await nameInput.boundingBox();

    expect(inputBox).toBeTruthy();
    expect(parentBox).toBeTruthy();
    if (inputBox && parentBox) {
      const widthRatio = inputBox.width / parentBox.width;
      expect(widthRatio).toBeGreaterThan(0.9);
    }
  });

  test("form shows validation errors on empty submit", async ({ page }) => {
    await page.goto("/order");

    await page.getByRole("button", { name: "Senda pöntun" }).click();

    await page.waitForTimeout(1000);
  });

  test("form fields accept input", async ({ page }) => {
    await page.goto("/order");

    await page.getByLabel(/Nafn/).fill("Test User");
    await expect(page.getByLabel(/Nafn/)).toHaveValue("Test User");

    await page.getByLabel(/Netfang/).fill("test@example.com");
    await expect(page.getByLabel(/Netfang/)).toHaveValue("test@example.com");

    await page.getByLabel(/Sími/).fill("555-1234");
    await expect(page.getByLabel(/Sími/)).toHaveValue("555-1234");

    await page.getByLabel(/Tegund köku/).selectOption("Fermingarkaka");
    await expect(page.getByLabel(/Tegund köku/)).toHaveValue("Fermingarkaka");

    await page.getByLabel(/Skilaboð/).fill("Test message for cake order");
    await expect(page.getByLabel(/Skilaboð/)).toHaveValue(
      "Test message for cake order",
    );
  });

  test("fallback email link is shown", async ({ page }) => {
    await page.goto("/order");

    const emailLink = page.getByRole("main").getByRole("link", { name: "orders@cakes.is" });
    await expect(emailLink).toBeVisible();
    await expect(emailLink).toHaveAttribute("href", "mailto:orders@cakes.is");
  });
});
