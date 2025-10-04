/**
 * API Unit Tests - Data Ingestion
 */
import { test, expect } from '@playwright/test';
import { ApiClient } from '../../api/ApiClient';

test.describe('API Data Ingestion', () => {
  const apiClient = new ApiClient('https://api.stg.yonalink.com');

  test('should accept JSON data format', async () => {
    const jsonData = {
      id: 'test-123',
      type: 'patient',
      data: { name: 'John Doe', age: 30 }
    };

    const response = await apiClient.post('/data/ingest', {
      format: 'json',
      data: jsonData
    });

    expect(response.ok).toBeTruthy();
    expect(response.status).toBe(200);
  });

  test('should accept CSV data format', async () => {
    const csvData = 'name,age,email\nJohn Doe,30,john@example.com';

    const response = await apiClient.post('/data/ingest', {
      format: 'csv',
      data: csvData
    });

    expect(response.ok).toBeTruthy();
    expect(response.status).toBe(200);
  });

  test('should reject invalid data format', async () => {
    const invalidData = { invalid: 'data' };

    const response = await apiClient.post('/data/ingest', {
      format: 'invalid',
      data: invalidData
    });

    expect(response.ok).toBeFalsy();
    expect(response.status).toBe(400);
  });
});
