import { Page, expect } from '@playwright/test';

export class AppointmentPage {
  constructor(private page: Page) {}

  async open() {
    await this.page.goto('/appointments');
  }

  async book(patientName: string, date: string, doctor = 'Dr. Rao') {
    await this.page.getByTestId('patient-name').fill(patientName);
    if (date) await this.page.getByTestId('appointment-date').fill(date);
    await this.page.getByTestId('doctor').selectOption(doctor);
    await this.page.getByTestId('book-appointment').click();
  }

  async expectBooked(patientName: string) {
    await expect(this.page.getByTestId('appointment-list')).toContainText(patientName);
  }

  async expectError(text: string) {
    await expect(this.page.getByTestId('form-error')).toHaveText(text);
  }
}
