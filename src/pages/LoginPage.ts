/**
 * Simple login page object model
 */
import { Page, Locator } from '@playwright/test';
import { settings } from '../config/settings';

export class LoginPage {
  private readonly page: Page;
  private readonly usernameField: Locator;
  private readonly passwordField: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameField = page.locator('#user_email');
    this.passwordField = page.locator('#user_password');
    this.loginButton = page.locator('input[type="submit"][value="Sign in"]');
    this.errorMessage = page.locator('.toast-body.bg-danger');
  }

  async navigateToLogin(): Promise<void> {
    await this.page.goto(settings.baseUrl);
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameField.fill(username);
    await this.passwordField.fill(password);
    
    // Wait a moment for any form validation to complete
    await this.page.waitForTimeout(500);
    
    // Ensure the button is visible and enabled before clicking
    await this.loginButton.waitFor({ state: 'visible' });
    await this.loginButton.waitFor({ state: 'attached' });
    
    // Try to click the button, with fallback to force click if needed
    try {
      await this.loginButton.click({ timeout: 10000 });
    } catch (error) {
      // If normal click fails, try force click
      await this.loginButton.click({ force: true });
    }
  }

  async getErrorMessage(): Promise<string | null> {
    try {
      await this.errorMessage.waitFor({ state: 'visible', timeout: 5000 });
      return await this.errorMessage.textContent();
    } catch {
      return '';
    }
  }

  async isErrorMessageDisplayed(): Promise<boolean> {
    try {
      await this.errorMessage.waitFor({ state: 'visible', timeout: 5000 });
      return await this.errorMessage.isVisible();
    } catch {
      return false;
    }
  }
}

