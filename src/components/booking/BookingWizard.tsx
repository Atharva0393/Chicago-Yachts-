"use client";

import React, { useState, useEffect } from "react";
import { useBooking } from "@/lib/contexts/BookingContext";
import { AvailabilityCalendar } from "@/components/yacht/AvailabilityCalendar";
import { LuxuryAddons } from "@/components/yacht/LuxuryAddons";
import { PricingBreakdown } from "@/components/yacht/BookingPanel";
import { ChevronRight, Calendar as CalendarIcon, Clock, Users, Star, FileText, CreditCard, User, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createBookingHoldAction } from "@/actions/booking-hold";
import { saveCheckoutGuestAction, getCheckoutHoldAction } from "@/actions/checkout";
import { createStripeCheckoutAction } from "@/actions/payment";

/**
 * Legacy type stub for backwards compatibility with unused Step* components.
 * These step components (StepDate, StepGuests, StepTime, StepConfirmation, BookingSummary)
 * are from the original wizard and are no longer rendered. They are preserved only as
 * historical reference. Do not use BookingData in new code.
 * @deprecated Use BookingContext instead.
 */
export type BookingData = {
  date: Date | null;
  timeSlot: string;
  guests: { adults: number; children: number };
  specialRequests?: string;
};

const STEPS = [
  { id: 1, title: "Date", icon: CalendarIcon },
  { id: 2, title: "Time", icon: Clock },
  { id: 3, title: "Guests", icon: Users },
  { id: 4, title: "Add-ons", icon: Star },
  { id: 5, title: "Quote", icon: FileText },
  { id: 6, title: "Details", icon: User },
  { id: 7, title: "Checkout", icon: CreditCard },
];

export function BookingWizard({ yacht }: { yacht: any }) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const { 
    selectedDate, 
    duration, setDuration, 
    timeSlot, setTimeSlot, 
    guests, setGuests, maxGuests,
    availableSlots,
    quote,
    quoteStatus,
    holdToken, setHoldToken,
    holdExpiresAt, setHoldExpiresAt,
    idempotencyKey
  } = useBooking();

  const [isAcquiringHold, setIsAcquiringHold] = useState(false);
  const [isSavingGuest, setIsSavingGuest] = useState(false);
  const [isRedirectingToStripe, setIsRedirectingToStripe] = useState(false);
  const [stripeError, setStripeError] = useState<string | null>(null);
  const [guestFormData, setGuestFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    notes: ""
  });
  const [formErrors, setFormErrors] = useState<any>({});
  const [serverHoldData, setServerHoldData] = useState<any>(null);

  const [timeLeft, setTimeLeft] = useState<number>(-1);

  // Resume checkout check on mount if we had a holdToken (in future could be from URL/sessionStorage)
  // For now, React state keeps it if they don't refresh.

  useEffect(() => {
    if (holdToken && holdExpiresAt) {
      const interval = setInterval(() => {
        const remaining = Math.max(0, Math.floor((holdExpiresAt.getTime() - Date.now()) / 1000));
        setTimeLeft(remaining);
        if (remaining === 0) {
          clearInterval(interval);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [holdToken, holdExpiresAt]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const formatDate = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const handleNext = async () => {
    if (currentStep === 5) {
      // Step 5 -> 6: Acquire Hold (or reuse existing active hold)
      if (holdToken && holdExpiresAt && holdExpiresAt > new Date()) {
        setCurrentStep(6);
        return;
      }

      setIsAcquiringHold(true);
      try {
        const res = await createBookingHoldAction({
          yachtId: yacht.id,
          dateStr: formatDate(selectedDate!),
          timeSlot: timeSlot,
          duration: duration,
          guests: guests,
          idempotencyKey: idempotencyKey
        });
        
        if (res.status === "SUCCESS" && res.holdToken && res.expiresAt) {
          setHoldToken(res.holdToken);
          setHoldExpiresAt(new Date(res.expiresAt));
          setCurrentStep(6);
        } else {
          alert(res.status === "SLOT_UNAVAILABLE" 
            ? "We're sorry, but this time slot is no longer available. Please select another date or time slot."
            : "We could not reserve this time slot right now. Please try again or select another time slot.");
        }
      } catch (e: any) {
        console.error("[WIZARD ERROR] Step 5 hold acquisition failed:", e);
        alert(`An error occurred trying to reserve your time slot: ${e?.message || "Please try again."}`);
      } finally {
        setIsAcquiringHold(false);
      }
    } else if (currentStep === 6) {
      // Step 6 -> 7: Save Draft and Fetch Authoritative Server Review
      if (!holdToken) return;
      setIsSavingGuest(true);
      setFormErrors({});
      try {
        const res = await saveCheckoutGuestAction(holdToken, {
          firstName: guestFormData.firstName,
          lastName: guestFormData.lastName,
          email: guestFormData.email,
          phone: guestFormData.phone,
          notes: guestFormData.notes,
          guestCount: guests // Use the state value
        });

        if (res.status === "VALIDATION_ERROR") {
          setFormErrors(res.errors || {});
          return;
        } else if (res.status === "EXPIRED") {
          alert("Your reservation hold has expired. Please select a time slot again.");
          return;
        } else if (res.status !== "SUCCESS") {
          console.warn("[WIZARD WARN] saveCheckoutGuestAction non-success:", res);
          alert(res.message || "Failed to save guest details");
          return;
        }

        // Fetch Server authoritative hold
        const holdRes = await getCheckoutHoldAction(holdToken);
        if (holdRes.status === "ACTIVE" && holdRes.hold) {
          setServerHoldData(holdRes.hold);
          setCurrentStep(7);
        } else {
          console.warn("[WIZARD WARN] getCheckoutHoldAction non-active:", holdRes);
          alert(holdRes.message || "Failed to load checkout data");
        }
      } catch (e: any) {
        console.error("[WIZARD ERROR] Step 6 guest save failed:", e);
        alert(`An error occurred saving your details: ${e?.message || "Please try again."}`);
      } finally {
        setIsSavingGuest(false);
      }
    } else if (currentStep < 7) {
      setCurrentStep(curr => curr + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      // If going back to inventory selection, we should technically release the hold if they change something,
      // but UI wise, we just let them back. A change in date/time should drop the hold.
      if (currentStep === 6 || currentStep === 7) {
        // Warning: Changing dates will lose your hold
      }
      setCurrentStep(curr => curr - 1);
    }
  };

  // If Date/Time/Yacht changes while they have a hold, we could release it. 
  // For now, since `createBookingHoldAction` uses idempotency, if they change inputs they'd get a validation mismatch or create a new hold if idempotency key changes.
  useEffect(() => {
    if (holdToken && currentStep < 5) {
      // They went back to change inventory. We'll clear the hold state so they acquire a new one.
      setHoldToken(null);
      setHoldExpiresAt(null);
      setTimeLeft(-1);
    }
  }, [selectedDate, timeSlot, duration]);

  const isNextDisabled = () => {
    if (currentStep === 1 && !selectedDate) return true;
    if (currentStep === 2 && !timeSlot) return true;
    if (currentStep === 3 && (guests < 1 || guests > maxGuests)) return true;
    if (currentStep === 5 && (quoteStatus === "LOADING" || isAcquiringHold)) return true;
    if (currentStep === 6 && isSavingGuest) return true;
    return false;
  };

  const getSlotStatus = (slot: string) => {
    if (!selectedDate) return 'available';
    const dateStr = formatDate(selectedDate);
    const dayData = availableSlots[dateStr];
    if (!dayData) return 'available';
    return dayData.slots[slot as keyof typeof dayData.slots] || 'available';
  };

  const renderSlotOption = (slotValue: string, label: string) => {
    const status = getSlotStatus(slotValue);
    const isDisabled = status === 'booked' || status === 'blocked';
    const displayLabel = status === 'pending' ? `${label} (Pending)` : (isDisabled ? `${label} (Unavailable)` : label);
    return (
      <button 
        key={slotValue}
        onClick={() => setTimeSlot(slotValue as any)}
        disabled={isDisabled}
        className={`p-4 rounded-xl border text-left transition-all ${
          timeSlot === slotValue 
            ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900' 
            : isDisabled 
              ? 'border-slate-100 bg-slate-50 opacity-50 cursor-not-allowed'
              : 'border-slate-200 hover:border-slate-400 hover:shadow-sm'
        }`}
      >
        <div className="font-medium text-slate-900 mb-1">{displayLabel}</div>
      </button>
    );
  };

  const handlePayment = async () => {
    if (!holdToken || isRedirectingToStripe) return;
    setIsRedirectingToStripe(true);
    setStripeError(null);
    try {
      const res = await createStripeCheckoutAction(holdToken);
      if (res.status === "SUCCESS" && res.url) {
        // Server validated and created Stripe session — redirect to Stripe-hosted checkout.
        // Landing on success_url does NOT confirm the booking. Webhook in Ticket 11B handles finalization.
        window.location.href = res.url;
      } else if (res.status === "EXPIRED") {
        setStripeError("Your reservation hold has expired. Please start over.");
        setIsRedirectingToStripe(false);
      } else if (res.status === "CONFIGURATION_REQUIRED") {
        setStripeError(res.message || "Secure online payment is temporarily unavailable.");
        setIsRedirectingToStripe(false);
      } else {
        setStripeError(res.message || "Failed to initialize payment. Please try again.");
        setIsRedirectingToStripe(false);
      }
    } catch (e) {
      setStripeError("An unexpected error occurred. Please try again.");
      setIsRedirectingToStripe(false);
    }
  };

  const renderStepContent = () => {
    // Global expiration check for Steps 6 and 7
    if ((currentStep === 6 || currentStep === 7) && timeLeft === 0) {
      return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500 text-center py-16">
          <div className="w-24 h-24 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
            <Clock className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-medium text-slate-900 tracking-tight mb-4">Your reservation hold has expired.</h2>
          <p className="text-slate-500 mb-10 max-w-md mx-auto font-light leading-relaxed">
            The hold on this time slot has expired and it has been released to other customers.
          </p>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-slate-900 text-white rounded-full px-10 py-7 text-lg hover-lift shadow-premium"
          >
            Start Over
          </Button>
        </div>
      );
    }

    switch(currentStep) {
      case 1:
        return (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-3xl font-medium text-slate-900 tracking-tight mb-2">When would you like to set sail?</h2>
            <p className="text-slate-500 mb-8 font-light">Select your preferred date from the calendar below.</p>
            <AvailabilityCalendar />
          </div>
        );
      case 2:
        return (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-3xl font-medium text-slate-900 tracking-tight mb-2">How long & what time?</h2>
            <p className="text-slate-500 mb-8 font-light">Choose your charter duration and departure time.</p>
            
            <div className="mb-8">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-4">Duration</h3>
              <div className="grid grid-cols-3 gap-4">
                {[4, 6, 8].map(d => (
                  <button 
                    key={d}
                    onClick={() => setDuration(d)}
                    className={`p-4 rounded-xl border text-center transition-all ${
                      duration === d 
                        ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900' 
                        : 'border-slate-200 hover:border-slate-400 hover:shadow-sm'
                    }`}
                  >
                    <div className="font-medium text-slate-900">{d} Hours</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-4">Time Slot</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderSlotOption('Morning', 'Morning')}
                {renderSlotOption('Afternoon', 'Afternoon')}
                {renderSlotOption('Evening', 'Evening')}
                {renderSlotOption('Full Day', 'Full Day')}
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-3xl font-medium text-slate-900 tracking-tight mb-2">Who's coming?</h2>
            <p className="text-slate-500 mb-8 font-light">Maximum capacity is {maxGuests} guests.</p>
            
            <div className="flex items-center justify-between p-6 border border-slate-200 rounded-2xl bg-white shadow-sm hover:border-slate-300 transition-colors">
              <div>
                <div className="font-medium text-slate-900 text-lg">Guests</div>
                <div className="text-slate-500 font-light">Ages 2 or above</div>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setGuests(Math.max(1, guests - 1))}
                  className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:border-slate-900 hover:bg-slate-50 transition-colors"
                >
                  -
                </button>
                <span className="w-6 text-center font-medium text-lg">{guests}</span>
                <button 
                  onClick={() => setGuests(Math.min(maxGuests, guests + 1))}
                  className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:border-slate-900 hover:bg-slate-50 transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-3xl font-medium text-slate-900 tracking-tight mb-2">Enhance your experience</h2>
            <p className="text-slate-500 mb-8 font-light">Select any luxury add-ons for your charter.</p>
            <div className="-mx-6 px-6">
              <LuxuryAddons />
            </div>
          </div>
        );
      case 5:
        // Use runtime server quote if available, fallback to yacht price per hour calculation so price is GUARANTEED visible
        const fallbackTotal = (yacht?.pricePerHour || 280) * (duration || 4);
        const quoteTotal = quote?.totalAmount ? parseFloat(quote.totalAmount) : fallbackTotal;
        const quoteDeposit = quoteTotal * 0.30;
        const quoteRemaining = quoteTotal * 0.70;

        return (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-3xl font-medium text-slate-900 tracking-tight mb-2">Review your quote</h2>
            <p className="text-slate-500 mb-8 font-light">Check the details before locking in this time slot.</p>
            
            <div className="space-y-6">
              <div className="flex gap-6 items-center">
                <div className="relative w-32 h-24 rounded-xl overflow-hidden shrink-0 shadow-sm border border-slate-100">
                  <Image src={yacht.images[0]} alt={yacht.name} fill className="object-cover" />
                </div>
                <div>
                  <h3 className="font-medium text-slate-900 text-xl mb-1">{yacht.name}</h3>
                  <p className="text-slate-500 font-light">{maxGuests} Max Guests • Chicago</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 border border-slate-200 bg-slate-50 rounded-2xl">
                  <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-2">Date</div>
                  <div className="font-medium text-slate-900">{selectedDate ? selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : 'Selected Date'}</div>
                </div>
                <div className="p-5 border border-slate-200 bg-slate-50 rounded-2xl">
                  <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-2">Time</div>
                  <div className="font-medium text-slate-900">{timeSlot} ({duration} hrs)</div>
                </div>
              </div>

              {/* Price Breakdown Container — Guaranteed visible */}
              <div className="p-6 border border-slate-200 bg-slate-50 rounded-2xl space-y-4 shadow-sm">
                <div className="flex justify-between items-center text-lg font-semibold text-slate-900">
                  <span>Booking Total</span>
                  <span className="text-xl font-bold text-slate-900">${quoteTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>

                <div className="border-t border-slate-200 pt-4 flex justify-between items-center text-base font-medium text-slate-900">
                  <div>
                    <div className="font-semibold text-emerald-700">30% Deposit Due Today</div>
                    <div className="text-xs font-light text-slate-500">Locks in your reservation hold</div>
                  </div>
                  <span className="font-bold text-emerald-700 text-lg">${quoteDeposit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>

                <div className="border-t border-slate-200 pt-4 flex justify-between items-center text-sm text-slate-600">
                  <div>
                    <div className="font-medium text-slate-800">Remaining Balance (70%)</div>
                    <div className="text-xs font-light text-slate-500">Due on your charter date</div>
                  </div>
                  <span className="font-semibold text-slate-900">${quoteRemaining.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-medium text-slate-900 tracking-tight mb-2">Guest Information</h2>
                <p className="text-slate-500 font-light">Please enter your details to complete the reservation.</p>
              </div>
              {timeLeft > 0 && (
                <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-full font-medium text-sm border border-amber-200 shrink-0">
                  <Clock className="w-4 h-4" />
                  {formatTime(timeLeft)}
                </div>
              )}
            </div>
            
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                  <input 
                    type="text" 
                    value={guestFormData.firstName}
                    onChange={e => setGuestFormData({...guestFormData, firstName: e.target.value})}
                    className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none ${formErrors.firstName ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
                  />
                  {formErrors.firstName && <p className="text-red-500 text-xs mt-1">{formErrors.firstName[0]}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                  <input 
                    type="text" 
                    value={guestFormData.lastName}
                    onChange={e => setGuestFormData({...guestFormData, lastName: e.target.value})}
                    className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none ${formErrors.lastName ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
                  />
                  {formErrors.lastName && <p className="text-red-500 text-xs mt-1">{formErrors.lastName[0]}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input 
                  type="email" 
                  value={guestFormData.email}
                  onChange={e => setGuestFormData({...guestFormData, email: e.target.value})}
                  className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none ${formErrors.email ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
                />
                {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email[0]}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                <input 
                  type="tel" 
                  value={guestFormData.phone}
                  onChange={e => setGuestFormData({...guestFormData, phone: e.target.value})}
                  className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none ${formErrors.phone ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
                />
                {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone[0]}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Special Requests (Optional)</label>
                <textarea 
                  value={guestFormData.notes}
                  onChange={e => setGuestFormData({...guestFormData, notes: e.target.value})}
                  className={`w-full p-3 border rounded-xl h-24 focus:ring-2 focus:ring-slate-900 focus:outline-none ${formErrors.notes ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
                />
                {formErrors.notes && <p className="text-red-500 text-xs mt-1">{formErrors.notes[0]}</p>}
              </div>
            </div>
          </div>
        );
      case 7:
        if (!serverHoldData) return null;
        return (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-medium text-slate-900 tracking-tight">Review Reservation</h2>
              {timeLeft > 0 && (
                <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-full font-medium text-sm border border-amber-200 shrink-0">
                  <Clock className="w-4 h-4" />
                  {formatTime(timeLeft)}
                </div>
              )}
            </div>
            
            <div className="p-6 border border-slate-200 bg-slate-50 rounded-2xl mb-8 space-y-6 shadow-sm">
              <div className="flex items-center gap-4 border-b border-slate-200 pb-6">
                {serverHoldData.yachtImage && (
                  <div className="w-16 h-16 relative rounded-lg overflow-hidden border border-slate-200">
                    <Image src={serverHoldData.yachtImage} alt={serverHoldData.yachtName} fill className="object-cover" />
                  </div>
                )}
                <div>
                  <h3 className="font-medium text-slate-900 text-lg">{serverHoldData.yachtName}</h3>
                  <p className="text-slate-500 text-sm">{serverHoldData.yachtLocation}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-4 text-sm">
                <div>
                  <div className="text-slate-500 font-light mb-1">Date</div>
                  <div className="font-medium text-slate-900">{new Date(serverHoldData.startDateTime).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
                </div>
                <div>
                  <div className="text-slate-500 font-light mb-1">Time</div>
                  <div className="font-medium text-slate-900">
                    {new Date(serverHoldData.startDateTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} - {new Date(serverHoldData.endDateTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                  </div>
                </div>
                <div>
                  <div className="text-slate-500 font-light mb-1">Guests</div>
                  <div className="font-medium text-slate-900">{serverHoldData.guestCount} / {serverHoldData.yachtCapacity} Max</div>
                </div>
                <div>
                  <div className="text-slate-500 font-light mb-1">Primary Guest</div>
                  <div className="font-medium text-slate-900">{serverHoldData.customerFirstName} {serverHoldData.customerLastName}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-slate-500 font-light mb-1">Contact</div>
                  <div className="font-medium text-slate-900">{serverHoldData.customerEmail} • {serverHoldData.customerPhone}</div>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-6">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-slate-600">Charter Subtotal</div>
                  <div className="font-medium">${parseFloat(serverHoldData.subtotal).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                </div>
                
                <div className="flex justify-between items-center text-lg font-medium mt-4 pt-4 border-t border-slate-200">
                  <div className="text-slate-900">Total Charter Price</div>
                  <div className="text-slate-900">${parseFloat(serverHoldData.totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })} USD</div>
                </div>

                <div className="flex justify-between items-start text-lg font-medium mt-4 pt-4 border-t border-slate-200 text-slate-900">
                  <div>
                    Deposit Due Today (30%)
                  </div>
                  <div>${parseFloat(serverHoldData.depositAmount || "0").toLocaleString(undefined, { minimumFractionDigits: 2 })} USD</div>
                </div>

                <div className="flex justify-between items-start text-sm mt-4 pt-4 border-t border-slate-200 text-slate-500">
                  <div>
                    <div className="font-medium">Remaining Balance (70%)</div>
                    <div className="text-xs font-light">Due on your charter date</div>
                  </div>
                  <div className="font-medium">${parseFloat(serverHoldData.remainingBalance || "0").toLocaleString(undefined, { minimumFractionDigits: 2 })} USD</div>
                </div>
              </div>
            </div>

            <div className="pb-8">
              {stripeError && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm">
                  {stripeError}
                </div>
              )}
              <Button 
                onClick={handlePayment}
                disabled={isRedirectingToStripe}
                className="bg-slate-900 text-white rounded-full px-10 py-7 text-lg hover-lift shadow-premium w-full disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {isRedirectingToStripe ? (
                  <><span className="animate-spin mr-2">⟳</span> Connecting to Secure Payment...</>
                ) : (
                  <><Lock className="w-4 h-4 mr-2" /> Pay 30% Deposit Securely</>
                )}
              </Button>
              <p className="text-center text-xs text-slate-400 font-light mt-3">
                You will be redirected to a secure Stripe-hosted payment page.
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => router.push(`/fleet/${yacht.slug}`)}
            className="font-serif text-xl tracking-wide text-slate-900 hover:text-slate-600 transition-colors"
          >
            CHICAGO YACHTS
          </button>
          <button 
            onClick={() => router.push(`/fleet/${yacht.slug}`)}
            className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
          >
            Save & Exit
          </button>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-slate-50 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between overflow-x-auto custom-scrollbar">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;
            
            return (
              <div key={step.id} className="flex items-center shrink-0">
                <div className={`flex items-center gap-3 ${isActive ? 'text-slate-900' : isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border shadow-sm transition-colors ${isActive ? 'border-slate-900 bg-slate-900 text-white' : isCompleted ? 'border-slate-900 bg-white' : 'border-slate-200 bg-white'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">{step.title}</span>
                </div>
                {index < STEPS.length - 1 && (
                  <div className={`w-8 md:w-16 h-px mx-4 ${isCompleted ? 'bg-slate-900' : 'bg-slate-200'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* Main Content Area */}
          <div className="flex-1 max-w-2xl">
            <div className="min-h-[500px]">
              {renderStepContent()}
            </div>
            
            {/* Bottom Navigation */}
            {currentStep < 7 && (
              <div className="flex items-center justify-between mt-12 pt-8 border-t border-slate-200">
                <Button 
                  variant="outline" 
                  onClick={handlePrev} 
                  disabled={currentStep === 1 || isSavingGuest || isAcquiringHold}
                  className="rounded-full px-8 h-12 text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-slate-200"
                >
                  Back
                </Button>
                <Button 
                  onClick={handleNext} 
                  disabled={isNextDisabled()}
                  className="bg-slate-900 text-white rounded-full px-8 h-12 hover:bg-slate-800 hover-lift shadow-md disabled:opacity-50 disabled:hover:translate-y-0"
                >
                  {isAcquiringHold ? "Reserving..." : isSavingGuest ? "Saving..." : "Next"} <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </div>

          {/* Sticky Sidebar */}
          {currentStep < 7 && (
            <div className="w-full lg:w-[400px] shrink-0">
              <div className="bg-white border border-slate-200 rounded-3xl p-7 shadow-[0_8px_30px_rgb(0,0,0,0.08)] sticky top-32">
                <h3 className="text-xl font-medium text-slate-900 mb-6 tracking-tight">Booking Summary</h3>
                {selectedDate ? (
                  <>
                    <div className="flex gap-5 mb-6 pb-6 border-b border-slate-100">
                      <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 shadow-sm border border-slate-100">
                        <Image src={yacht.images[0]} alt={yacht.name} fill className="object-cover" />
                      </div>
                      <div className="flex flex-col justify-center">
                        <div className="font-medium text-slate-900 mb-1">{yacht.name}</div>
                        <div className="text-sm text-slate-500 font-light mb-1">{selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                        <div className="text-sm text-slate-500 font-light">{timeSlot} • {duration} hrs</div>
                      </div>
                    </div>
                    <PricingBreakdown />
                  </>
                ) : (
                  <div className="text-slate-500 text-sm text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 font-light">
                    Select a date to see your summary
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
