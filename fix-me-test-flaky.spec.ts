import { test, expect } from '@playwright/test';

/**
 * Intent: Verify that the Activity page loads an initial page of transactions,
 * then fetches the next page after clicking "Load more".
 *
 * Current issues:
 *  - relies on waitForTimeout (flaky)
 *  - brittle selectors (text-only)
 *  - assertion happens before network/UI have really finished updating
 * Goal: Make this test reliable. Remove flakiness (no waitForTimeout) and avoid brittle selectors.
 */
test('Activity loads more results (FLAKY — fix me)', async ({ page }) => {
  // Mock paginated API with variable latency
  await page.route('**/api/transactions?**', async route => {
    const url = new URL(route.request().url());
    const cursor = url.searchParams.get('cursor');

    // Simulate server-side pagination
    const body = cursor
      ? { items: [{ id: 4 }, { id: 5 }], nextCursor: null }
      : { items: [{ id: 1 }, { id: 2 }, { id: 3 }], nextCursor: 'abc' };

    // Variable delay => exposes flakiness in fixed sleeps
    await new Promise(r => setTimeout(r, 400 + Math.random() * 600));

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(body),
    });
  });

  await page.goto('/activity');

  await page.click('text=Load more');

  await page.waitForTimeout(800);

  await expect(page.locator('[data-testid="tx-row"]')).toHaveCount(5);
});
