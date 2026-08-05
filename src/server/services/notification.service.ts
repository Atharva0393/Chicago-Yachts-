import { PrismaClient, NotificationStatus, NotificationChannel } from "@prisma/client";
import { emailService, ExtendedBooking } from "./email.service";

const prisma = new PrismaClient();

export class NotificationService {
  
  private async persistNotification(
    recipient: string,
    type: string,
    channel: NotificationChannel,
    bookingId?: string,
    customerId?: string
  ) {
    return prisma.notification.create({
      data: {
        type,
        channel,
        recipient,
        bookingId,
        customerId,
        status: NotificationStatus.PENDING
      }
    });
  }

  private async updateNotificationStatus(
    id: string,
    response: { status: string; providerId?: string; error?: string }
  ) {
    let status: NotificationStatus = NotificationStatus.PENDING;
    if (response.status === "SUCCESS") status = NotificationStatus.SENT;
    else if (response.status === "FAILED" || response.status === "CONFIGURATION_REQUIRED") status = NotificationStatus.FAILED;

    await prisma.notification.update({
      where: { id },
      data: {
        status,
        providerId: response.providerId,
        error: response.error,
        sentAt: status === NotificationStatus.SENT ? new Date() : null
      }
    });
  }

  async sendBookingConfirmation(booking: ExtendedBooking, adminEmail: string = "admin@chicagoyachts.com") {
    // 1. Send to Customer
    try {
      const customerNotif = await this.persistNotification(booking.customer.email, "BOOKING_CONFIRMATION", NotificationChannel.EMAIL, booking.id, booking.customerId);
      const res = await emailService.sendBookingConfirmation(booking);
      await this.updateNotificationStatus(customerNotif.id, res);
    } catch (e: any) {
      console.error("[NotificationService] Failed to send booking confirmation to customer", e);
    }

    // 2. Send to Admin
    try {
      const adminNotif = await this.persistNotification(adminEmail, "ADMIN_NEW_BOOKING", NotificationChannel.EMAIL, booking.id, booking.customerId);
      const res = await emailService.sendAdminNewBookingNotification(booking, adminEmail);
      await this.updateNotificationStatus(adminNotif.id, res);
    } catch (e: any) {
      console.error("[NotificationService] Failed to send booking confirmation to admin", e);
    }
  }

  async sendBookingCancellation(booking: ExtendedBooking) {
    try {
      const notif = await this.persistNotification(booking.customer.email, "BOOKING_CANCELLED", NotificationChannel.EMAIL, booking.id, booking.customerId);
      const res = await emailService.sendBookingCancellation(booking);
      await this.updateNotificationStatus(notif.id, res);
    } catch (e: any) {
      console.error("[NotificationService] Failed to send booking cancellation", e);
    }
  }

  async sendBalanceReminder(booking: ExtendedBooking) {
    try {
      const notif = await this.persistNotification(booking.customer.email, "BALANCE_REMINDER", NotificationChannel.EMAIL, booking.id, booking.customerId);
      const res = await emailService.sendBalanceReminder(booking);
      await this.updateNotificationStatus(notif.id, res);
    } catch (e: any) {
      console.error("[NotificationService] Failed to send balance reminder", e);
    }
  }

  async sendBalancePaid(booking: ExtendedBooking) {
    try {
      const notif = await this.persistNotification(booking.customer.email, "BALANCE_PAID", NotificationChannel.EMAIL, booking.id, booking.customerId);
      const res = await emailService.sendBalancePaid(booking);
      await this.updateNotificationStatus(notif.id, res);
    } catch (e: any) {
      console.error("[NotificationService] Failed to send balance paid notification", e);
    }
  }

  async sendCharterReminder(booking: ExtendedBooking) {
    try {
      const notif = await this.persistNotification(booking.customer.email, "CHARTER_REMINDER", NotificationChannel.EMAIL, booking.id, booking.customerId);
      const res = await emailService.sendCharterReminder(booking);
      await this.updateNotificationStatus(notif.id, res);
    } catch (e: any) {
      console.error("[NotificationService] Failed to send charter reminder", e);
    }
  }
}

export const notificationService = new NotificationService();
