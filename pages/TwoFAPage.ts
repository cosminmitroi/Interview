import { Page, Locator } from '@playwright/test';
export class TwoFAPage {
  readonly code: Locator;
  readonly verify: Locator;
  constructor(private page: Page) {
    this.code = page.getByLabel('2FA Code');
    this.verify = page.getByRole('button', { name: /verify/i });
  }
  async verifyCode(code: string) {
    await this.code.fill(code);
    await this.verify.click();
  }
}
