/**
 * API Contract Tests - Schema Validation
 */
import { test, expect } from '@playwright/test';
import { ApiClient } from '../../api/ApiClient';

test.describe('API Contract Validation', () => {
  const apiClient = new ApiClient('https://api.stg.yonalink.com');

  test('should validate JSON schema for patient data', async () => {
    const validPatientData = {
      id: 'patient-123',
      name: 'John Doe',
      age: 30,
      email: 'john@example.com',
      createdAt: '2024-01-01T00:00:00Z'
    };

    const response = await apiClient.post('/patients', validPatientData);

    expect(response.ok).toBeTruthy();
    expect(response.data).toHaveProperty('id');
    expect(response.data).toHaveProperty('name');
    expect(response.data).toHaveProperty('age');
    expect(response.data).toHaveProperty('email');
  });

  test('should reject data with invalid schema', async () => {
    const invalidPatientData = {
      id: 'patient-123',
      name: 'John Doe',
      age: 'not-a-number', // Invalid type
      email: 'invalid-email' // Invalid format
    };

    const response = await apiClient.post('/patients', invalidPatientData);

    expect(response.ok).toBeFalsy();
    expect(response.status).toBe(422);
  });

  test('should validate API response format', async () => {
    const response = await apiClient.get('/patients');

    expect(response.ok).toBeTruthy();
    expect(response.data).toHaveProperty('patients');
    expect(Array.isArray(response.data.patients)).toBeTruthy();
  });
});
