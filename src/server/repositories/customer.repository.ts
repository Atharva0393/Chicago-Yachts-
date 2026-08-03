import { db } from "@/lib/db";
import { Customer, LeadStatus } from "@prisma/client";

export type CustomerWithRelations = Customer & {
  bookings: {
    id: string;
    startDateTime: Date;
    totalAmount: import("@prisma/client").Prisma.Decimal;
    bookingStatus: import("@prisma/client").BookingStatus;
    yacht: {
      name: string;
    };
  }[];
  notes: {
    id: string;
    content: string;
    authorId: string | null;
    createdAt: Date;
  }[];
  activities: {
    id: string;
    type: import("@prisma/client").ActivityType;
    description: string;
    createdAt: Date;
  }[];
};

export class CustomerRepository {
  /**
   * Retrieves all customers with their booking summary.
   */
  async getAllCustomers(): Promise<CustomerWithRelations[]> {
    return db.customer.findMany({
      include: {
        bookings: {
          select: {
            id: true,
            startDateTime: true,
            totalAmount: true,
            bookingStatus: true,
            yacht: {
              select: { name: true }
            }
          },
          orderBy: { startDateTime: 'desc' }
        },
        notes: {
          orderBy: { createdAt: 'desc' }
        },
        activities: {
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  /**
   * Retrieves a single customer by ID.
   */
  async getCustomerById(id: string): Promise<CustomerWithRelations | null> {
    return db.customer.findUnique({
      where: { id },
      include: {
        bookings: {
          select: {
            id: true,
            startDateTime: true,
            totalAmount: true,
            bookingStatus: true,
            yacht: {
              select: { name: true }
            }
          },
          orderBy: { startDateTime: 'desc' }
        },
        notes: {
          orderBy: { createdAt: 'desc' }
        },
        activities: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });
  }

  /**
   * Updates a customer's lead status.
   */
  async updateLeadStatus(id: string, leadStatus: LeadStatus): Promise<Customer> {
    return db.customer.update({
      where: { id },
      data: { leadStatus }
    });
  }

  /**
   * Adds a note to a customer.
   */
  async addNote(customerId: string, content: string, authorId: string = "Admin") {
    return db.customerNote.create({
      data: {
        customerId,
        content,
        authorId
      }
    });
  }

  /**
   * Adds an activity log to a customer.
   */
  async addActivity(customerId: string, type: import("@prisma/client").ActivityType, description: string) {
    return db.customerActivity.create({
      data: {
        customerId,
        type,
        description
      }
    });
  }
}

export const customerRepository = new CustomerRepository();
