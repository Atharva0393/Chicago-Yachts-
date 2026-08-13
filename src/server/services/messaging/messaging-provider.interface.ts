export interface SendVerificationMessageParams {
  verificationId: string;
  ownerName: string;
  ownerPhone: string;
  yachtName: string;
  requestedDate: Date;
  requestedTimeSlot: string;
  guestCount: number;
  bookingRef: string;
}

export interface OwnerMessagingProvider {
  sendVerificationRequest(params: SendVerificationMessageParams): Promise<{ messageId: string; body: string }>;
  sendClarification(verificationId: string, ownerPhone: string, body: string): Promise<{ messageId: string; body: string }>;
}
