import { db } from "@/lib/db";
import { ownerVerificationService } from "../owner-verification.service";
import { mockOwnerMessageInterpreter } from "./mock-interpreter";
import { mockWhatsAppProvider } from "./mock-provider";

export interface ProcessInboundParams {
  verificationId: string;
  providerMessageId?: string;
  senderPhone?: string;
  messageBody: string;
}

export class InboundMessageRouter {
  /**
   * Processes an incoming mock WhatsApp message.
   * Enforces mock feature flag, idempotency, wrong owner protection, interpreter evaluation,
   * and delegates ONLY to ownerVerificationService (single source of truth).
   */
  async processInboundMessage(params: ProcessInboundParams) {
    const isMockEnabled = process.env.MOCK_WHATSAPP_ENABLED !== "false";
    if (!isMockEnabled) {
      throw new Error("Mock WhatsApp mode is currently disabled in environment (MOCK_WHATSAPP_ENABLED=false)");
    }

    const { verificationId, messageBody } = params;
    const providerMessageId = params.providerMessageId || `mock-in-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const senderPhone = params.senderPhone || "+13125550199";

    // 1. Idempotency check: Check if message ID already processed
    const existingMessage = await db.verificationMessage.findUnique({
      where: { providerMessageId }
    });

    if (existingMessage) {
      return {
        status: "ALREADY_PROCESSED",
        messageId: existingMessage.id,
        decision: existingMessage.decision
      };
    }

    // 2. Fetch verification request
    const verification = await db.ownerVerification.findUnique({
      where: { id: verificationId },
      include: {
        booking: { include: { customer: true, yacht: true } },
        yacht: { include: { ownerContacts: true } }
      }
    });

    if (!verification) {
      throw new Error("Owner verification request not found");
    }

    if (verification.booking.bookingStatus === "CANCELLED" || verification.booking.bookingStatus === "EXPIRED") {
      throw new Error("Cannot process owner response for a cancelled or expired booking");
    }

    // 3. Wrong owner protection: If yacht has registered contacts, check sender phone match
    if (verification.yacht.ownerContacts.length > 0) {
      const match = verification.yacht.ownerContacts.some(c => c.isActive && c.phone.replace(/\D/g, "") === senderPhone.replace(/\D/g, ""));
      if (!match) {
        throw new Error(`Unauthorized sender: Phone ${senderPhone} does not match any registered owner contact for ${verification.yacht.name}`);
      }
    }

    // 4. Interpret message using MockOwnerMessageInterpreter
    const interpretation = await mockOwnerMessageInterpreter.interpret(messageBody);

    // 5. Store inbound message record
    const inboundRecord = await db.verificationMessage.create({
      data: {
        verificationId,
        providerMessageId,
        direction: "INBOUND",
        provider: "MOCK_WHATSAPP",
        body: messageBody,
        senderPhone,
        decision: interpretation.decision,
        processingStatus: "PROCESSED"
      }
    });

    // 6. Delegate decision strictly to OwnerVerificationService
    let serviceResult = null;
    if (interpretation.decision === "AVAILABLE") {
      serviceResult = await ownerVerificationService.respondAvailable(verificationId, "mock-whatsapp-agent", interpretation.reason);
    } else if (interpretation.decision === "UNAVAILABLE") {
      serviceResult = await ownerVerificationService.respondUnavailable(verificationId, "mock-whatsapp-agent", interpretation.reason);
    } else if (interpretation.decision === "NEEDS_CLARIFICATION") {
      await mockWhatsAppProvider.sendClarification(
        verificationId,
        senderPhone,
        "Thank you for your response. Please confirm if the yacht is AVAILABLE (reply YES) or UNAVAILABLE (reply NO)."
      );
    } else {
      await mockWhatsAppProvider.sendClarification(
        verificationId,
        senderPhone,
        "We didn't quite catch that. Please reply YES if the yacht is available or NO if it is unavailable."
      );
    }

    return {
      status: "SUCCESS",
      decision: interpretation.decision,
      reason: interpretation.reason,
      inboundMessageId: inboundRecord.id,
      verificationResult: serviceResult
    };
  }

  /**
   * Helper to retrieve message timeline for a verification request.
   */
  async getMessageTimeline(verificationId: string) {
    return await db.verificationMessage.findMany({
      where: { verificationId },
      orderBy: { createdAt: "asc" }
    });
  }
}

export const inboundMessageRouter = new InboundMessageRouter();
