import { test, expect } from '@playwright/test';

test.describe('Claims API', () => {
  test('submit a valid claim', { tag: '@smoke' }, async ({ request }) => {
    const res = await request.post('/api/claims', { data: { patientName: 'Asha Verma', amount: 1500 } });
    expect(res.status()).toBe(201);
    expect((await res.json()).status).toBe('SUBMITTED');
  });

  for (const amount of [0, -10]) {
    test(`rejects non-positive amount ${amount}`, { tag: '@regression' }, async ({ request }) => {
      const res = await request.post('/api/claims', { data: { patientName: 'Asha Verma', amount } });
      expect(res.status()).toBe(400);
    });
  }
});
