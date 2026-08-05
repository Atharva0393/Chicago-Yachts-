import { Booking, Customer, Yacht } from "@prisma/client";
import { format, toZonedTime } from "date-fns-tz";

export type EmailProviderResponse = {
  status: "SUCCESS" | "CONFIGURATION_REQUIRED" | "FAILED";
  providerId?: string;
  error?: string;
};

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

export interface EmailProvider {
  sendEmail(payload: EmailPayload): Promise<EmailProviderResponse>;
}

// Dummy provider implementation for now since we don't have real credentials.
export class DummyEmailProvider implements EmailProvider {
  async sendEmail(payload: EmailPayload): Promise<EmailProviderResponse> {
    if (!process.env.EMAIL_API_KEY) {
      console.warn("⚠️ No EMAIL_API_KEY found. Simulating CONFIGURATION_REQUIRED.");
      return { status: "CONFIGURATION_REQUIRED", error: "Missing email provider credentials" };
    }
    
    // Simulate sending email
    console.log(`[Email Sent] To: ${payload.to} | Subject: ${payload.subject}`);
    return { status: "SUCCESS", providerId: `dummy-id-${Date.now()}` };
  }
}

export type ExtendedBooking = Booking & {
  customer: Customer;
  yacht: Yacht;
};

export class EmailService {
  private provider: EmailProvider;

  constructor(provider: EmailProvider) {
    this.provider = provider;
  }

  private formatChicagoTime(date: Date) {
    const zonedDate = toZonedTime(date, 'America/Chicago');
    return format(zonedDate, "MMM do, yyyy 'at' h:mm a", { timeZone: 'America/Chicago' });
  }

  async sendBookingConfirmation(booking: ExtendedBooking): Promise<EmailProviderResponse> {
    const payload: EmailPayload = {
      to: booking.customer.email,
      subject: `Booking Confirmation: ${booking.yacht.name} on ${this.formatChicagoTime(booking.startDateTime)}`,
      html: `
        <h1>Booking Confirmed!</h1>
        <p>Hi ${booking.customer.firstName},</p>
        <p>Your booking for ${booking.yacht.name} is confirmed.</p>
        <p><strong>Date & Time:</strong> ${this.formatChicagoTime(booking.startDateTime)}</p>
        <p><strong>Total Price:</strong> $${booking.totalAmount.toString()}</p>
        <p><strong>Deposit Paid:</strong> $${booking.depositAmount.toString()}</p>
        <p><strong>Remaining Balance:</strong> $${booking.remainingAmount.toString()} (Due on charter date)</p>
      `
    };
    return this.provider.sendEmail(payload);
  }

  async sendAdminNewBookingNotification(booking: ExtendedBooking, adminEmail: string): Promise<EmailProviderResponse> {
    const payload: EmailPayload = {
      to: adminEmail,
      subject: `New Booking: ${booking.yacht.name} - ${booking.customer.firstName} ${booking.customer.lastName}`,
      html: `
        <h1>New Confirmed Booking</h1>
        <p><strong>Customer:</strong> ${booking.customer.firstName} ${booking.customer.lastName} (${booking.customer.email}, ${booking.customer.phone || 'N/A'})</p>
        <p><strong>Yacht:</strong> ${booking.yacht.name}</p>
        <p><strong>Date & Time:</strong> ${this.formatChicagoTime(booking.startDateTime)}</p>
        <p><strong>Financial Summary:</strong></p>
        <ul>
          <li>Total: $${booking.totalAmount.toString()}</li>
          <li>Deposit Paid: $${booking.depositAmount.toString()}</li>
          <li>Remaining: $${booking.remainingAmount.toString()}</li>
        </ul>
      `
    };
    return this.provider.sendEmail(payload);
  }

  async sendBookingCancellation(booking: ExtendedBooking): Promise<EmailProviderResponse> {
    const payload: EmailPayload = {
      to: booking.customer.email,
      subject: `Booking Cancelled: ${booking.yacht.name}`,
      html: `
        <h1>Booking Cancelled</h1>
        <p>Hi ${booking.customer.firstName},</p>
        <p>Your booking for ${booking.yacht.name} on ${this.formatChicagoTime(booking.startDateTime)} has been cancelled.</p>
      `
    };
    return this.provider.sendEmail(payload);
  }

  async sendBalanceReminder(booking: ExtendedBooking): Promise<EmailProviderResponse> {
    const payload: EmailPayload = {
      to: booking.customer.email,
      subject: `Reminder: Remaining Balance Due for ${booking.yacht.name}`,
      html: `
        <h1>Balance Reminder</h1>
        <p>Hi ${booking.customer.firstName},</p>
        <p>This is a reminder that your remaining balance of $${booking.remainingAmount.toString()} for your upcoming charter on ${this.formatChicagoTime(booking.startDateTime)} is due.</p>
      `
    };
    return this.provider.sendEmail(payload);
  }

  async sendBalancePaid(booking: ExtendedBooking): Promise<EmailProviderResponse> {
    const payload: EmailPayload = {
      to: booking.customer.email,
      subject: `Payment Received: Remaining Balance for ${booking.yacht.name}`,
      html: `
        <h1>Payment Received</h1>
        <p>Hi ${booking.customer.firstName},</p>
        <p>We have successfully received your payment for the remaining balance of $${booking.remainingAmount.toString()}. Your booking is fully paid.</p>
      `
    };
    return this.provider.sendEmail(payload);
  }

  async sendCharterReminder(booking: ExtendedBooking): Promise<EmailProviderResponse> {
    const payload: EmailPayload = {
      to: booking.customer.email,
      subject: `Upcoming Charter Reminder: ${booking.yacht.name}`,
      html: `
        <h1>Upcoming Charter</h1>
        <p>Hi ${booking.customer.firstName},</p>
        <p>We look forward to seeing you soon! Your charter for ${booking.yacht.name} is scheduled for ${this.formatChicagoTime(booking.startDateTime)}.</p>
      `
    };
    return this.provider.sendEmail(payload);
  }
}

// Export a singleton instance using the Dummy Provider by default
export const emailService = new EmailService(new DummyEmailProvider());
