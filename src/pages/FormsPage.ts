/**
 * Simple forms management page object
 */
import { Page, Locator } from '@playwright/test';

export class FormsPage {
  private readonly page: Page;
  private readonly createFormButton: Locator;
  private readonly formNameInput: Locator;
  private readonly saveFormButton: Locator;
  private readonly formList: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createFormButton = page.locator('[data-testid="create-form-button"]');
    this.formNameInput = page.locator('[data-testid="form-name-input"]');
    this.saveFormButton = page.locator('[data-testid="save-form-button"]');
    this.formList = page.locator('[data-testid="form-list"]');
  }

  async navigateToForms(): Promise<void> {
    await this.page.goto('/forms');
  }

  async createForm(formName: string): Promise<void> {
    await this.createFormButton.click();
    await this.formNameInput.fill(formName);
    await this.saveFormButton.click();
  }

  async isFormCreated(formName: string): Promise<boolean> {
    const formText = await this.formList.textContent();
    return formText?.includes(formName) || false;
  }

  async editForm(formName: string, newName: string): Promise<void> {
    const formItem = this.page.locator(`[data-testid="form-item-${formName}"]`);
    await formItem.locator('[data-testid="edit-button"]').click();
    await this.formNameInput.fill(newName);
    await this.saveFormButton.click();
  }

  async deleteForm(formName: string): Promise<void> {
    const formItem = this.page.locator(`[data-testid="form-item-${formName}"]`);
    await formItem.locator('[data-testid="delete-button"]').click();
    await this.page.locator('[data-testid="confirm-delete"]').click();
  }

  async isDataPopulated(): Promise<boolean> {
    const formData = await this.page.locator('[data-testid="form-data"]').textContent();
    return formData?.includes('John Doe') || false;
  }
}
