import { test } from '@playwright/test';
import { AppointmentPage } from '../pages/AppointmentPage';

test.describe('Appointments', () => {
  test('book an appointment', { tag: '@smoke' }, async ({ page }) => {
    const appt = new AppointmentPage(page);
    await appt.open();
    await appt.book('Asha Verma', '2026-12-01');
    await appt.expectBooked('Asha Verma');
  });

  test('patient name is required', { tag: '@regression' }, async ({ page }) => {
    const appt = new AppointmentPage(page);
    await appt.open();
    await appt.book('', '2026-12-01');
    await appt.expectError('Patient name is required');
  });

  test('date is required', { tag: '@regression' }, async ({ page }) => {
    const appt = new AppointmentPage(page);
    await appt.open();
    await appt.book('Ravi Kumar', '');
    await appt.expectError('Date is required');
  });
  
  test('book with a different doctor', { tag: '@regression' }, async ({ page }) => {
    const appt = new AppointmentPage(page);
    await appt.open();
    await appt.book('Meena Rao', '2026-12-05', 'Dr. Smith');
    await appt.expectBooked('Meena Rao');
  });




});
