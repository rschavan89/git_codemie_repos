import { test, expect } from '@playwright/test'

test.describe('Employee Management', () => {
  test('create employee shows in list; edit updates; delete removes', async ({ page }) => {
    await page.goto('/employees')

    await page.getByTestId('add-employee').click()

    await page.getByTestId('name').fill('E2E User')
    await page.getByTestId('email').fill('e2e.user@example.com')
    await page.getByTestId('department').fill('QA')
    await page.getByTestId('salary').fill('1234')
    await page.getByTestId('save').click()

    await expect(page).toHaveURL(/\/employees$/)
    await expect(page.getByTestId('employees-table')).toBeVisible()

    // Find row by email text (stable enough for this simple app)
    const row = page.locator('tr', { hasText: 'e2e.user@example.com' })
    await expect(row).toBeVisible()

    // Edit
    const editLink = row.locator('a', { hasText: 'Edit' })
    await editLink.click()

    await expect(page.getByTestId('employee-form')).toBeVisible()
    await page.getByTestId('name').fill('E2E User Updated')
    await page.getByTestId('save').click()

    const updatedRow = page.locator('tr', { hasText: 'E2E User Updated' })
    await expect(updatedRow).toBeVisible()

    // Delete
    page.once('dialog', (d) => d.accept())
    await updatedRow.locator('button', { hasText: 'Delete' }).click()

    await expect(page.locator('tr', { hasText: 'e2e.user@example.com' })).toHaveCount(0)
  })

  test('client-side validation blocks blank name and invalid email', async ({ page }) => {
    await page.goto('/employees/new')

    await page.getByTestId('name').fill('')
    await page.getByTestId('email').fill('not-an-email')
    await page.getByTestId('save').click()

    await expect(page.getByTestId('error-name')).toContainText('Name is required')
    await expect(page.getByTestId('error-email')).toContainText('Email must be valid')
  })

  test('edit non-existing employee shows not found', async ({ page }) => {
    await page.goto('/employees/999999/edit')
    await expect(page.getByTestId('not-found')).toBeVisible()
  })
})
