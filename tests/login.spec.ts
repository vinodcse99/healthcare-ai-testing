import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

// Login tests run without the saved session.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login', () => {
  test('valid user reaches appointments page', { tag: '@smoke' }, async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.login('nurse1', 'Pass@123');
    await expect(page).toHaveURL(/appointments/);
  });

  test('invalid password shows error', { tag: '@regression' }, async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.login('nurse1', 'wrong');
    await login.expectError('Invalid credentials');
  });

  test('appointments page redirects to login when signed out', { tag: '@regression' }, async ({ page }) => {
    await page.goto('/appointments');
    await expect(page).toHaveURL(/login/);
  });
});
