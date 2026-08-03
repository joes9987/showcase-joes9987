import { expect, test } from '@playwright/test'

test('public surface smoke', async ({ page, request }) => {
  const health = await request.get('/api/health')
  expect(health.ok()).toBeTruthy()
  const body = await health.json()
  expect(body.app).toBe('eudamarket')
  expect(body.ok).toBe(true)
  expect(body.forth).toBeTruthy()

  await page.goto('/')
  await expect(page.locator('#forth-status')).toBeVisible()
  await expect(page.getByRole('heading', { name: /EudaMarket/i })).toBeVisible()

  await page.goto('/people')
  await expect(page.getByRole('heading', { name: 'People' })).toBeVisible()
  await expect(page.getByText(/public builders have a verified live/i)).toBeVisible()

  await page.goto('/partners')
  await expect(page.getByRole('heading', { name: /Hire builders you can inspect/i })).toBeVisible()

  await page.goto('/for-partners')
  await expect(page.getByRole('heading', { name: /ten minutes/i })).toBeVisible()

  await page.goto('/suite')
  await expect(page.getByRole('heading', { name: /Euda suite/i })).toBeVisible()
})
