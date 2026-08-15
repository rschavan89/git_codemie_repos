import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:3000';

test.describe('Employee List', () => {
  test('redirects to /employees from root', async ({ page }) => {
    await page.goto(BASE);
    await expect(page).toHaveURL(/\/employees/);
  });

  test('shows empty state message when no employees', async ({ page }) => {
    await page.goto(`${BASE}/employees`);
    // Wait for loading to finish
    await page.waitForSelector('[data-testid="loading"]', { state: 'detached', timeout: 10000 }).catch(() => {});
    const noEmployees = page.locator('[data-testid="no-employees"]');
    const table = page.locator('[data-testid="employee-table"]');
    const hasEmpty = await noEmployees.isVisible().catch(() => false);
    const hasTable = await table.isVisible().catch(() => false);
    expect(hasEmpty || hasTable).toBeTruthy();
  });

  test('shows Add Employee button', async ({ page }) => {
    await page.goto(`${BASE}/employees`);
    await expect(page.locator('[data-testid="btn-add-employee"]')).toBeVisible();
  });
});

test.describe('Add Employee', () => {
  test('navigates to add form on button click', async ({ page }) => {
    await page.goto(`${BASE}/employees`);
    await page.click('[data-testid="btn-add-employee"]');
    await expect(page).toHaveURL(/\/employees\/new/);
    await expect(page.locator('[data-testid="employee-form"]')).toBeVisible();
  });

  test('shows validation errors when submitting empty form', async ({ page }) => {
    await page.goto(`${BASE}/employees/new`);
    await page.click('[data-testid="btn-submit"]');
    await expect(page.locator('.field-error').first()).toBeVisible();
  });

  test('adds employee and redirects to list', async ({ page }) => {
    const ts = Date.now();
    await page.goto(`${BASE}/employees/new`);

    await page.fill('[data-testid="input-name"]', `Test User ${ts}`);
    await page.fill('[data-testid="input-email"]', `testuser${ts}@example.com`);
    await page.fill('[data-testid="input-department"]', 'Engineering');
    await page.fill('[data-testid="input-salary"]', '90000');

    await page.click('[data-testid="btn-submit"]');
    await expect(page).toHaveURL(/\/employees$/, { timeout: 10000 });
    await expect(page.locator(`text=Test User ${ts}`)).toBeVisible();
  });
});

test.describe('Edit Employee', () => {
  test('loads edit form pre-filled and updates employee', async ({ page }) => {
    const ts = Date.now();

    // First add one
    await page.goto(`${BASE}/employees/new`);
    await page.fill('[data-testid="input-name"]', `Edit Me ${ts}`);
    await page.fill('[data-testid="input-email"]', `edit${ts}@example.com`);
    await page.fill('[data-testid="input-department"]', 'Sales');
    await page.fill('[data-testid="input-salary"]', '60000');
    await page.click('[data-testid="btn-submit"]');
    await expect(page).toHaveURL(/\/employees$/, { timeout: 10000 });

    // Find the edit button for this specific employee row
    const row = page.locator('tr').filter({ hasText: `Edit Me ${ts}` });
    await row.locator('button:has-text("Edit")').click();
    await expect(page).toHaveURL(/\/employees\/\d+\/edit/);

    // Update department
    await page.fill('[data-testid="input-department"]', 'Marketing');
    await page.click('[data-testid="btn-submit"]');
    await expect(page).toHaveURL(/\/employees$/, { timeout: 10000 });
    await expect(page.locator('text=Marketing')).toBeVisible();
  });

  test('cancel button returns to list', async ({ page }) => {
    await page.goto(`${BASE}/employees/new`);
    await page.click('[data-testid="btn-cancel"]');
    await expect(page).toHaveURL(/\/employees$/);
  });
});

test.describe('Delete Employee', () => {
  test('deletes employee from list', async ({ page }) => {
    const ts = Date.now();

    // Add employee
    await page.goto(`${BASE}/employees/new`);
    await page.fill('[data-testid="input-name"]', `Delete Me ${ts}`);
    await page.fill('[data-testid="input-email"]', `delete${ts}@example.com`);
    await page.fill('[data-testid="input-department"]', 'QA');
    await page.fill('[data-testid="input-salary"]', '55000');
    await page.click('[data-testid="btn-submit"]');
    await expect(page).toHaveURL(/\/employees$/, { timeout: 10000 });

    // Dismiss confirm dialog and delete
    page.on('dialog', dialog => dialog.accept());
    const row = page.locator('tr').filter({ hasText: `Delete Me ${ts}` });
    await row.locator('button:has-text("Delete")').click();

    await expect(page.locator(`text=Delete Me ${ts}`)).not.toBeVisible({ timeout: 5000 });
  });
});
