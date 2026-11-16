import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

// Logs in once and saves the session so other tests skip the login UI.
setup('authenticate', async ({ page }) => {
  const login = new LoginPage(page);
  await login.open();
  await login.login('nurse1', 'Pass@123');
  await expect(page).toHaveURL(/appointments/);
  await page.context().storageState({ path: '.auth/user.json' });
});
