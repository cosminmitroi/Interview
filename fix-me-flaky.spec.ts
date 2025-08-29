import { test, expect } from '@playwright/test';

test('Activity loads more results', async ({ page }) => {
  await page.route('**/api/transactions?**', async route => {
    const url = new URL(route.request().url());
    const cursor = url.searchParams.get('cursor');
    const body = cursor
      ? { items: [{ id: 6 }, { id: 7 }], nextCursor: null }
      : { items: [{ id: 1 }, { id: 2 }, { id: 3 }], nextCursor: 'abc' };
    // Simulate network slowness:
    await new Promise(r => setTimeout(r, 700 + Math.random() * 600));
    await route.fulfill({ json: body });
  });

  await page.goto('/activity');
  await page.getByRole('button', { name: /load more/i }).click();
  // FLAKY: waits for fixed time
  await page.waitForTimeout(800);
  await expect(page.getByTestId('tx-row')).toHaveCount(5); // 3 + 2
});
