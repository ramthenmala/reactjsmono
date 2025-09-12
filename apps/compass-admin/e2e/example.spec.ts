import { test, expect } from '@playwright/test';

test('compass-admin homepage', async ({ page }) => {
  await page.goto('/');

  // Expect a title containing the app name or a specific title
  await expect(page).toHaveTitle(/Compass Admin|compass-admin/);

  // Check if the main content is visible
  await expect(page.locator('body')).toBeVisible();
});

test('compass-admin navigation', async ({ page }) => {
  await page.goto('/');

  // Add more specific tests based on your app's features
  // For example, check for specific elements, buttons, or navigation items
  const mainContent = page.locator('#root');
  await expect(mainContent).toBeVisible();
});
