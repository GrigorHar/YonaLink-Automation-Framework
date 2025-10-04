/**
 * Forms Management Tests
 */
import { test, expect } from '@playwright/test';
import { FormsPage } from '../../pages/FormsPage';

test.describe('Forms Management', () => {
  test('should create new form', async ({ page }) => {
    const formsPage = new FormsPage(page);
    
    await formsPage.navigateToForms();
    await formsPage.createForm('Test Form');
    
    expect(await formsPage.isFormCreated('Test Form')).toBeTruthy();
  });

  test('should edit existing form', async ({ page }) => {
    const formsPage = new FormsPage(page);
    
    await formsPage.navigateToForms();
    await formsPage.createForm('Original Form');
    await formsPage.editForm('Original Form', 'Updated Form');
    
    expect(await formsPage.isFormCreated('Updated Form')).toBeTruthy();
  });

  test('should delete form', async ({ page }) => {
    const formsPage = new FormsPage(page);
    
    await formsPage.navigateToForms();
    await formsPage.createForm('Form to Delete');
    await formsPage.deleteForm('Form to Delete');
    
    expect(await formsPage.isFormCreated('Form to Delete')).toBeFalsy();
  });
});
