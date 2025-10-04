/**
 * Integration Tests - API to Forms Data Flow
 */
import { test, expect } from '@playwright/test';
import { ApiClient } from '../../api/ApiClient';
import { LoginPage } from '../../pages/LoginPage';

test.describe('API to Forms Data Flow', () => {
  const apiClient = new ApiClient('https://api.stg.yonalink.com');

  test('should ingest API data and populate forms', async ({ page }) => {
    // 1. Ingest data via API
    const testData = {
      id: 'test-123',
      type: 'patient',
      data: { name: 'John Doe', age: 30, email: 'john@example.com' }
    };

    const apiResponse = await apiClient.post('/data/ingest', testData);
    expect(apiResponse.ok).toBeTruthy();

    // 2. Navigate to forms and verify data is populated
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLogin();
    
    // Simulate successful login (this would be a real login in practice)
    await page.goto('https://ehr.stg.yonalink.com/forms');
    
    // 3. Verify form is populated with API data
    const formData = await page.locator('[data-testid="form-data"]').textContent();
    expect(formData).toContain('John Doe');
    expect(formData).toContain('30');
    expect(formData).toContain('john@example.com');
  });

  test('should handle data mapping errors gracefully', async ({ page }) => {
    // 1. Send invalid data to API
    const invalidData = {
      id: 'test-456',
      type: 'patient',
      data: { name: 'Jane Doe', age: 'invalid-age' }
    };

    const apiResponse = await apiClient.post('/data/ingest', invalidData);
    expect(apiResponse.ok).toBeFalsy();

    // 2. Verify form shows appropriate error
    await page.goto('https://ehr.stg.yonalink.com/forms');
    const errorMessage = await page.locator('[data-testid="error-message"]').textContent();
    expect(errorMessage).toContain('Data mapping error');
  });
});
