import { Page, expect } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async open() {
    await this.page.goto('/login');
  }

  async login(username: string, password: string) {
    await this.page.getByTestId('username').fill(username);
    await this.page.getByTestId('password').fill(password);
    await this.page.getByTestId('login-button').click();
  }

  async expectError(text: string) {
    await expect(this.page.getByTestId('login-error')).toHaveText(text);
  }
}
