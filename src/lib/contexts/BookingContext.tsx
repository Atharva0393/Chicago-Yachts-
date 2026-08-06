"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { availabilityService, DayAvailability, TimeSlot } from "@/services/availability.service";
import { getBookingQuoteAction } from "@/actions/pricing";
import { QuoteResponse } from "@/server/services/pricing.service";
// getPublicAvailability Server Action is no longer imported here to avoid Vercel component errors.

export interface Addon {
  title: string;
  price: number;
}

export type QuoteBreakdown = QuoteResponse['quote'];

interface BookingState {
  selectedDate: Date | null;
  duration: number;
  timeSlot: TimeSlot;
  guests: number;
  maxGuests: number;
  yachtId: string;
  
  availableSlots: Record<string, DayAvailability>;
  isLoadingAvailability: boolean;
  
  selectedAddons: Addon[];
  
  quote: QuoteBreakdown | null;
  quoteStatus: "IDLE" | "LOADING" | "SUCCESS" | "PRICING_NOT_CONFIGURED" | "UNAVAILABLE" | "INVALID_DURATION";

  holdToken: string | null;
  holdExpiresAt: Date | null;
  idempotencyKey: string;

  actionResultType?: string;
  actionResultIsNull?: string;
  actionResultKeys?: string;
  actionResultJson?: string;
  clientError?: string;
}

interface BookingContextType extends BookingState {
  setSelectedDate: (date: Date | null) => void;
  setDuration: (duration: number) => void;
  setTimeSlot: (slot: TimeSlot) => void;
  setGuests: (guests: number) => void;
  setMaxGuests: (max: number) => void;
  
  toggleAddon: (addon: Addon) => void;

  setHoldToken: (token: string | null) => void;
  setHoldExpiresAt: (date: Date | null) => void;
  
  // Actions
  isSubmitting: boolean;
  isSuccess: boolean;
  submitBooking: () => Promise<void>;
  resetBooking: () => void;
  fetchAvailability: (yachtId: string, month: number, year: number) => Promise<void>;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children, initialMaxGuests = 12, yachtId = "1" }: { children: ReactNode, initialMaxGuests?: number, yachtId?: string }) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [duration, setDuration] = useState<number>(4);
  const [timeSlot, setTimeSlot] = useState<TimeSlot>("Afternoon");
  const [guests, setGuests] = useState<number>(1);
  const [maxGuests, setMaxGuests] = useState<number>(initialMaxGuests);
  
  const [availableSlots, setAvailableSlots] = useState<Record<string, DayAvailability>>({});
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);
  
  const [selectedAddons, setSelectedAddons] = useState<Addon[]>([]);

  const [quote, setQuote] = useState<QuoteBreakdown | null>(null);
  const [quoteStatus, setQuoteStatus] = useState<BookingState["quoteStatus"]>("IDLE");

  const [holdToken, setHoldToken] = useState<string | null>(null);
  const [holdExpiresAt, setHoldExpiresAt] = useState<Date | null>(null);
  const [idempotencyKey] = useState<string>(() => crypto.randomUUID());

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [actionResultType, setActionResultType] = useState<string>("none");
  const [actionResultIsNull, setActionResultIsNull] = useState<string>("none");
  const [actionResultKeys, setActionResultKeys] = useState<string>("none");
  const [actionResultJson, setActionResultJson] = useState<string>("none");
  const [clientError, setClientError] = useState<string>("none");

  // Load initial availability
  useEffect(() => {
    if (!yachtId || yachtId === "1") return;
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Chicago', year: 'numeric', month: 'numeric' });
    const parts = formatter.formatToParts(now);
    let month = now.getMonth();
    let year = now.getFullYear();
    for (const p of parts) {
      if (p.type === 'month') month = parseInt(p.value, 10) - 1;
      if (p.type === 'year') year = parseInt(p.value, 10);
    }
    setAvailableSlots({});
    fetchAvailability(yachtId, month, year);
  }, [yachtId]);

  const fetchAvailability = async (id: string, month: number, year: number) => {
    if (!id || id === "1") return;
    setIsLoadingAvailability(true);
    try {
      const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
      const url = `/api/public/availability?yachtId=${id}&month=${monthStr}`;
      
      const response = await fetch(url);
      
      setActionResultType(response.status.toString());
      setActionResultIsNull("NO");
      
      const res = await response.json();
      
      if (res && typeof res === "object") {
        setActionResultKeys(Object.keys(res).join(", "));
        const safeJson: any = {
          success: res.success,
          error: res.error,
          stage: res.stage,
          dates: res.dates,
          slots: res.slots
        };
        setActionResultJson(JSON.stringify(safeJson));
      } else {
        setActionResultKeys("none");
        setActionResultJson(String(res));
      }

      if (response.ok && res && res.success && res.data) {
        const slotsObj: any = { ...res.data };
        if (res.debug) {
          slotsObj._debug = res.debug;
          slotsObj.debug = res.debug;
        }
        setAvailableSlots(slotsObj);
        setClientError("none");
      } else {
        const slotsObj: any = {};
        if (res && res.debug) {
          slotsObj._debug = res.debug;
          slotsObj.debug = res.debug;
        }
        setAvailableSlots(slotsObj);
        setClientError(`API Error (${res?.stage || "unknown"}): ` + (res?.error || response.statusText));
      }
    } catch (e: any) {
      console.error("Direct fetchAvailability call threw error:", e);
      setClientError(e?.message || String(e));
      setActionResultType("error");
      setActionResultIsNull("unknown");
      setActionResultKeys("none");
      setActionResultJson("error: " + (e?.message || String(e)));
      setAvailableSlots({});
    } finally {
      setIsLoadingAvailability(false);
    }
  };

  const formatDate = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const handleSetSelectedDate = (date: Date | null) => {
    setSelectedDate(date);
    if (date) {
      const dateStr = formatDate(date);
      const dayData = availableSlots[dateStr];
      if (dayData && dayData.slots[timeSlot] !== 'available') {
        const firstAvailable = (Object.keys(dayData.slots) as TimeSlot[]).find(slot => dayData.slots[slot] === 'available');
        if (firstAvailable) {
          setTimeSlot(firstAvailable);
        }
      }
    }
  };

  const toggleAddon = (addon: Addon) => {
    setSelectedAddons(prev => {
      const exists = prev.find(a => a.title === addon.title);
      if (exists) {
        return prev.filter(a => a.title !== addon.title);
      }
      return [...prev, addon];
    });
  };

  // ---------------------------------------------------------
  // Server-Authoritative Quote Engine Integration
  // ---------------------------------------------------------
  useEffect(() => {
    if (!selectedDate) {
      setQuote(null);
      setQuoteStatus("IDLE");
      return;
    }

    const fetchQuote = async () => {
      setQuoteStatus("LOADING");
      try {
        const addonsTotal = selectedAddons.reduce((sum, addon) => sum + addon.price, 0);
        
        const res = await getBookingQuoteAction({
          yachtId,
          dateStr: formatDate(selectedDate),
          timeSlot,
          duration,
          guests,
          addonsTotal
        });

        if (!isCurrent) return;

        setQuoteStatus(res.status);
        if (res.status === "SUCCESS" && res.quote) {
          setQuote(res.quote);
        } else {
          setQuote(null);
        }
      } catch (err) {
        if (!isCurrent) return;
        console.error("Failed to fetch quote from server action:", err);
        setQuoteStatus("PRICING_NOT_CONFIGURED"); // Fallback to allow UI to recover
        setQuote(null);
      }
    };

    let isCurrent = true;
    const timerId = setTimeout(() => {
      if (isCurrent) fetchQuote();
    }, 300); // Small debounce

    return () => {
      isCurrent = false;
      clearTimeout(timerId);
    };
  }, [yachtId, selectedDate, timeSlot, duration, guests, selectedAddons]);

  const submitBooking = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSuccess(true);
    
    setTimeout(() => {
      setIsSuccess(false);
      setSelectedDate(null);
    }, 3000);
  };

  const resetBooking = () => {
    setSelectedDate(null);
    setDuration(4);
    setTimeSlot("Afternoon");
    setGuests(1);
    setSelectedAddons([]);
    setIsSuccess(false);
  };

  const value = {
    selectedDate,
    setSelectedDate: handleSetSelectedDate,
    duration,
    setDuration,
    timeSlot,
    setTimeSlot,
    guests,
    setGuests,
    maxGuests,
    setMaxGuests,
    yachtId,
    
    availableSlots,
    isLoadingAvailability,
    
    selectedAddons,
    toggleAddon,
    
    quote,
    quoteStatus,

    holdToken,
    setHoldToken,
    holdExpiresAt,
    setHoldExpiresAt,
    idempotencyKey,
    
    isSubmitting,
    isSuccess,
    submitBooking,
    resetBooking,
    fetchAvailability,

    actionResultType,
    actionResultIsNull,
    actionResultKeys,
    actionResultJson,
    clientError
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
}
