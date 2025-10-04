/**
 * API Integration Tests - Data Mapping
 */
import { test, expect } from '@playwright/test';
import { ApiClient } from '../../api/ApiClient';

test.describe('Data Mapping Integration', () => {
  const apiClient = new ApiClient('https://api.stg.yonalink.com');

  test('should map incoming data to standard options', async () => {
    const rawData = {
      patient_name: 'John Doe',
      patient_age: 30,
      patient_email: 'john@example.com'
    };

    const response = await apiClient.post('/data/map', {
      data: rawData,
      mappingType: 'patient'
    });

    expect(response.ok).toBeTruthy();
    expect(response.data).toHaveProperty('name');
    expect(response.data).toHaveProperty('age');
    expect(response.data).toHaveProperty('email');
  });

  test('should handle missing required fields', async () => {
    const incompleteData = {
      patient_name: 'John Doe'
      // Missing age and email
    };

    const response = await apiClient.post('/data/map', {
      data: incompleteData,
      mappingType: 'patient'
    });

    expect(response.ok).toBeFalsy();
    expect(response.status).toBe(422);
  });

  test('should validate data types', async () => {
    const invalidData = {
      patient_name: 'John Doe',
      patient_age: 'not-a-number', // Should be number
      patient_email: 'john@example.com'
    };

    const response = await apiClient.post('/data/map', {
      data: invalidData,
      mappingType: 'patient'
    });

    expect(response.ok).toBeFalsy();
    expect(response.status).toBe(422);
  });
});
