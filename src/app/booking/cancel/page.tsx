import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";

/**
 * Booking Cancel Page
 *
 * Redirect target when a customer exits Stripe Checkout without completing payment.
 *
 * IMPORTANT:
 * - No Booking is created here.
 * - The BookingHold is NOT released or altered here.
 * - If the original hold is still ACTIVE (expiresAt > now), the customer
 *   may return to the fleet page and begin checkout again.
 * - We do NOT extend the hold expiration because the user visited Stripe.
 */
export default function BookingCancelPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-12 text-center border border-slate-100">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <AlertCircle className="w-10 h-10 text-slate-500" />
        </div>

        <h1 className="text-3xl font-medium text-slate-900 tracking-tight mb-4">
          Payment Cancelled
        </h1>

        <p className="text-slate-500 font-light leading-relaxed mb-8">
          You exited the payment page. No charge was made.
        </p>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-8 text-left">
          <div className="text-sm font-medium text-slate-700 mb-1">
            What happens now?
          </div>
          <div className="text-sm text-slate-500 font-light">
            If your original reservation window hasn&apos;t expired yet, the
            time slot may still be held. You are welcome to browse our fleet
            and begin a new reservation.
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/fleet"
            className="inline-flex items-center justify-center gap-2 bg-slate-900 text-white rounded-full px-8 py-4 font-medium hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Browse Fleet
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 border border-slate-200 text-slate-700 rounded-full px-8 py-4 font-medium hover:border-slate-400 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
