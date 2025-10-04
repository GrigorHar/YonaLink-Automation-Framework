/**
 * Forms Data Population Tests
 */
import { test, expect } from '@playwright/test';
import { FormsPage } from '../../pages/FormsPage';
import { ApiClient } from '../../api/ApiClient';

test.describe('Forms Data Population', () => {
  test('should populate form with API data', async ({ page }) => {
    const formsPage = new FormsPage(page);
    const apiClient = new ApiClient('https://api.stg.yonalink.com');
    
    // 1. Send data to API
    const testData = {
      id: 'form-data-123',
      type: 'patient',
      data: { name: 'John Doe', age: 30, email: 'john@example.com' }
    };
    
    const apiResponse = await apiClient.post('/data/ingest', testData);
    expect(apiResponse.ok).toBeTruthy();
    
    // 2. Navigate to forms and verify data population
    await formsPage.navigateToForms();
    await formsPage.createForm('Patient Form');
    
    expect(await formsPage.isDataPopulated()).toBeTruthy();
  });

  test('should handle data population errors', async ({ page }) => {
    const formsPage = new FormsPage(page);
    
    // Navigate to forms without API data
    await formsPage.navigateToForms();
    await formsPage.createForm('Empty Form');
    
    // Verify form shows appropriate message for missing data
    const emptyMessage = await page.locator('[data-testid="empty-form-message"]').textContent();
    expect(emptyMessage).toContain('No data available');
  });
});
