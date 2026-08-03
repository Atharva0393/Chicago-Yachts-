import { db } from "@/lib/db";
import { Booking, BookingStatus, PaymentStatus } from "@prisma/client";

export type BookingWithRelations = Booking & {
  customer: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
  };
  yacht: {
    id: string;
    name: string;
  };
};

export class BookingRepository {
  /**
   * Retrieves all bookings with customer and yacht relations, sorted by date descending.
   */
  async getAllBookings(): Promise<BookingWithRelations[]> {
    return db.booking.findMany({
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          }
        },
        yacht: {
          select: {
            id: true,
            name: true,
          }
        }
      },
      orderBy: {
        startDateTime: 'desc'
      }
    }) as unknown as Promise<BookingWithRelations[]>;
  }

  /**
   * Retrieves a single booking by ID.
   */
  async getBookingById(id: string): Promise<BookingWithRelations | null> {
    return db.booking.findUnique({
      where: { id },
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          }
        },
        yacht: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    });
  }

  /**
   * Updates a booking's status.
   */
  async updateBookingStatus(id: string, status: BookingStatus): Promise<Booking> {
    return db.booking.update({
      where: { id },
      data: { bookingStatus: status }
    });
  }

  /**
   * Updates a booking's payment status.
   */
  async updatePaymentStatus(id: string, paymentStatus: PaymentStatus): Promise<Booking> {
    return db.booking.update({
      where: { id },
      data: { paymentStatus }
    });
  }
}

export const bookingRepository = new BookingRepository();
