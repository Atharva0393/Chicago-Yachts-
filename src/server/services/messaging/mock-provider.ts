import { db } from "@/lib/db";
import { OwnerMessagingProvider, SendVerificationMessageParams } from "./messaging-provider.interface";

export class MockWhatsAppProvider implements OwnerMessagingProvider {
  async sendVerificationRequest(params: SendVerificationMessageParams): Promise<{ messageId: string; body: string }> {
    const formattedDate = new Date(params.requestedDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const body = `Hi ${params.ownerName},

We have a charter booking request for your yacht:

Yacht: ${params.yachtName}
Date: ${formattedDate}
Time: ${params.requestedTimeSlot}
Guests: ${params.guestCount}
Ref: ${params.bookingRef}

Is the yacht available for this booking?

Please reply:
YES — Available
NO — Not available`;

    const providerMessageId = `mock-msg-out-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;

    // Store outbound message record
    await db.verificationMessage.create({
      data: {
        verificationId: params.verificationId,
        providerMessageId,
        direction: "OUTBOUND",
        provider: "MOCK_WHATSAPP",
        body,
        recipientPhone: params.ownerPhone,
        processingStatus: "PROCESSED"
      }
    });

    return { messageId: providerMessageId, body };
  }

  async sendClarification(verificationId: string, ownerPhone: string, text: string): Promise<{ messageId: string; body: string }> {
    const providerMessageId = `mock-msg-clarify-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;

    const body = `Chicago Yachts Automated Assistant:

${text}

Please reply YES if available or NO if unavailable.`;

    await db.verificationMessage.create({
      data: {
        verificationId,
        providerMessageId,
        direction: "OUTBOUND",
        provider: "MOCK_WHATSAPP",
        body,
        recipientPhone: ownerPhone,
        processingStatus: "PROCESSED"
      }
    });

    return { messageId: providerMessageId, body };
  }
}

export const mockWhatsAppProvider = new MockWhatsAppProvider();
