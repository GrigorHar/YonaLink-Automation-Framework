/**
 * Simple login tests with invalid credentials
 */
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { settings } from '../config/settings';

test.describe('Login with Invalid Credentials', () => {
  test('should reject invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.navigateToLogin();
    await loginPage.login(settings.invalidUsername, settings.invalidPassword);
    
    // Wait for response
    await page.waitForTimeout(2000);
    
    const errorDisplayed = await loginPage.isErrorMessageDisplayed();
    const errorMessage = await loginPage.getErrorMessage();
    
    expect(errorDisplayed).toBeTruthy();
  });

  test('should reject empty credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.navigateToLogin();
    await loginPage.login('', '');
    
    // Wait for response
    await page.waitForTimeout(2000);
    
    const errorDisplayed = await loginPage.isErrorMessageDisplayed();
    const errorMessage = await loginPage.getErrorMessage();
    
    expect(errorDisplayed).toBeTruthy();
  });
});

