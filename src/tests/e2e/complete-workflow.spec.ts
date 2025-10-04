/**
 * End-to-End Complete Workflow Tests
 */
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { FormsPage } from '../../pages/FormsPage';
import { ApiClient } from '../../api/ApiClient';

test.describe('Complete User Workflow', () => {
  test('should complete full data flow from API to forms', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const formsPage = new FormsPage(page);
    const apiClient = new ApiClient('https://api.stg.yonalink.com');
    
    // 1. Login to the system
    await loginPage.navigateToLogin();
    await loginPage.login('valid_user', 'valid_password');
    
    // 2. Ingest data via API
    const testData = {
      id: 'e2e-test-123',
      type: 'patient',
      data: { name: 'Jane Smith', age: 28, email: 'jane@example.com' }
    };
    
    const apiResponse = await apiClient.post('/data/ingest', testData);
    expect(apiResponse.ok).toBeTruthy();
    
    // 3. Navigate to forms
    await formsPage.navigateToForms();
    
    // 4. Create form
    await formsPage.createForm('E2E Test Form');
    expect(await formsPage.isFormCreated('E2E Test Form')).toBeTruthy();
    
    // 5. Verify data population
    expect(await formsPage.isDataPopulated()).toBeTruthy();
  });

  test('should handle workflow with invalid data', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const formsPage = new FormsPage(page);
    const apiClient = new ApiClient('https://api.stg.yonalink.com');
    
    // 1. Login to the system
    await loginPage.navigateToLogin();
    await loginPage.login('valid_user', 'valid_password');
    
    // 2. Send invalid data to API
    const invalidData = {
      id: 'invalid-test',
      type: 'patient',
      data: { name: 'Invalid User', age: 'not-a-number' }
    };
    
    const apiResponse = await apiClient.post('/data/ingest', invalidData);
    expect(apiResponse.ok).toBeFalsy();
    
    // 3. Navigate to forms and verify error handling
    await formsPage.navigateToForms();
    await formsPage.createForm('Error Test Form');
    
    const errorMessage = await page.locator('[data-testid="error-message"]').textContent();
    expect(errorMessage).toContain('Data validation error');
  });
});
