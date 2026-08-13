import { NextRequest, NextResponse } from "next/server";
import { inboundMessageRouter } from "@/server/services/messaging/inbound-router";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { verificationId, providerMessageId, senderPhone, message } = body;

    if (!verificationId || !message) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: verificationId and message" },
        { status: 400 }
      );
    }

    const result = await inboundMessageRouter.processInboundMessage({
      verificationId,
      providerMessageId,
      senderPhone,
      messageBody: message
    });

    return NextResponse.json({ success: true, result });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to process inbound mock WhatsApp message" },
      { status: 400 }
    );
  }
}
