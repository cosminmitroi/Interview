import { Page, Locator, expect } from '@playwright/test';
export class LoginPage {
  readonly email: Locator;
  readonly password: Locator;
  readonly submit: Locator;
  constructor(private page: Page) {
    this.email = page.getByLabel('Email');
    this.password = page.getByLabel('Password');
    this.submit = page.getByRole('button', { name: /sign in/i });
  }
  async goto() { await this.page.goto('/login'); }
  async login(email: string, password: string) {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.submit.click();
  }
  async expectError(msg: RegExp) {
    await expect(this.page.getByRole('alert')).toHaveText(msg);
  }
}
