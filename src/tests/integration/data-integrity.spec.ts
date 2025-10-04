/**
 * Integration Tests - Data Integrity
 */
import { test, expect } from '@playwright/test';
import { ApiClient } from '../../api/ApiClient';

test.describe('Data Integrity Tests', () => {
  const apiClient = new ApiClient('https://api.stg.yonalink.com');

  test('should maintain data consistency across operations', async () => {
    // 1. Create patient data
    const patientData = {
      id: 'patient-789',
      name: 'Alice Smith',
      age: 25,
      email: 'alice@example.com'
    };

    const createResponse = await apiClient.post('/patients', patientData);
    expect(createResponse.ok).toBeTruthy();

    // 2. Retrieve and verify data
    const getResponse = await apiClient.get(`/patients/${patientData.id}`);
    expect(getResponse.ok).toBeTruthy();
    expect(getResponse.data.name).toBe(patientData.name);
    expect(getResponse.data.age).toBe(patientData.age);

    // 3. Update data
    const updatedData = { ...patientData, age: 26 };
    const updateResponse = await apiClient.post(`/patients/${patientData.id}`, updatedData);
    expect(updateResponse.ok).toBeTruthy();

    // 4. Verify update
    const verifyResponse = await apiClient.get(`/patients/${patientData.id}`);
    expect(verifyResponse.data.age).toBe(26);
  });

  test('should handle concurrent data operations', async () => {
    const baseData = {
      id: 'concurrent-test',
      name: 'Concurrent User',
      age: 30
    };

    // Simulate concurrent operations
    const promises = [
      apiClient.post('/patients', { ...baseData, id: 'concurrent-1' }),
      apiClient.post('/patients', { ...baseData, id: 'concurrent-2' }),
      apiClient.post('/patients', { ...baseData, id: 'concurrent-3' })
    ];

    const responses = await Promise.all(promises);
    
    responses.forEach((response) => {
      expect(response.ok).toBeTruthy();
    });
  });
});
