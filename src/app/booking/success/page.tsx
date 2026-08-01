import Link from "next/link";
import { CheckCircle2, Clock } from "lucide-react";

/**
 * Booking Success Page
 *
 * IMPORTANT: This page is a redirect target from Stripe Checkout.
 * Landing here does NOT mean payment is confirmed.
 *
 * Stripe Checkout redirects here on APPARENT success, but the actual
 * payment confirmation comes via the Stripe webhook (Ticket 11B).
 *
 * DO NOT create Booking, PaymentTransaction, or convert BookingHold here.
 * The webhook is the authoritative source of payment truth.
 */
export default function BookingSuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const sessionId = searchParams.session_id;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-12 text-center border border-slate-100">
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>

        <h1 className="text-3xl font-medium text-slate-900 tracking-tight mb-4">
          Payment Submitted
        </h1>

        <p className="text-slate-500 font-light leading-relaxed mb-8">
          Thank you! Your 30% deposit payment has been received by Stripe and is being
          processed. The remaining 70% balance will be due on your charter date.
          You will receive a confirmation email once your booking
          has been officially confirmed.
        </p>

        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-8 text-left">
          <Clock className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <div className="text-sm font-medium text-amber-800">
              Confirmation Pending
            </div>
            <div className="text-xs text-amber-700 font-light mt-0.5">
              Booking confirmation is sent only after payment is fully verified.
              This can take up to a few minutes.
            </div>
          </div>
        </div>

        {sessionId && (
          <p className="text-xs text-slate-400 font-mono mb-8 break-all">
            Ref: {sessionId}
          </p>
        )}

        <Link
          href="/"
          className="inline-flex items-center justify-center bg-slate-900 text-white rounded-full px-10 py-4 font-medium hover:bg-slate-800 transition-colors"
        >
          Return to Homepage
        </Link>
      </div>
    </div>
  );
}
