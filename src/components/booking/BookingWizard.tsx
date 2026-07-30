"use client"

import React, { useState } from "react"
import { Yacht } from "@/lib/constants/demo-data"
import { BookingProgress } from "./BookingProgress"
import { BookingSummary } from "./BookingSummary"
import { StepDate } from "./StepDate"
import { StepTime } from "./StepTime"
import { StepGuests } from "./StepGuests"
import { StepPayment } from "./StepPayment"
import { StepConfirmation } from "./StepConfirmation"

export interface BookingData {
  date: Date | null;
  timeSlot: string | null;
  guests: { adults: number; children: number };
  specialRequests: string;
}

interface Props {
  yacht: Yacht;
}

export function BookingWizard({ yacht }: Props) {
  // Step State (1-5)
  const [currentStep, setCurrentStep] = useState(1);
  
  // Accumulated Booking Data
  const [bookingData, setBookingData] = useState<BookingData>({
    date: null,
    timeSlot: null,
    guests: { adults: 1, children: 0 },
    specialRequests: "",
  });

  // Calculate total price for the payment step
  const duration = 4;
  const basePrice = yacht.pricePerHour * duration;
  const timeSurcharge = bookingData.timeSlot === "Sunset (4:00 PM - 8:00 PM)" ? basePrice * 0.15 : 0;
  const subtotal = basePrice + timeSurcharge;
  const taxes = subtotal * 0.09;
  const totalPrice = subtotal + taxes;

  // Navigation handlers
  const handleNext = () => {
    setCurrentStep(prev => Math.min(prev + 1, 5));
    // Scroll to top of wizard on mobile
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  // Determine which step component to render
  const renderStep = () => {
    switch(currentStep) {
      case 1:
        return <StepDate bookingData={bookingData} setBookingData={setBookingData} onNext={handleNext} />;
      case 2:
        return <StepTime bookingData={bookingData} setBookingData={setBookingData} onNext={handleNext} onBack={handleBack} />;
      case 3:
        return <StepGuests bookingData={bookingData} setBookingData={setBookingData} onNext={handleNext} onBack={handleBack} maxCapacity={yacht.capacity} />;
      case 4:
        return <StepPayment bookingData={bookingData} onNext={handleNext} onBack={handleBack} totalPrice={totalPrice} />;
      case 5:
        return <StepConfirmation bookingData={bookingData} yacht={yacht} />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-8 py-8 md:py-12 max-w-[1400px]">
      
      {/* Hide Progress indicator if booking is confirmed */}
      {currentStep < 5 && (
        <div className="mb-12 md:mb-16 max-w-4xl mx-auto">
          <BookingProgress currentStep={currentStep} />
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start relative">
        
        {/* Main Form Area */}
        <div className="w-full lg:flex-1 min-w-0">
          <div className="w-full">
            {renderStep()}
          </div>
        </div>

        {/* Sticky Sidebar (Hidden on Confirmation Step) */}
        {currentStep < 5 && (
          <div className="w-full lg:w-[400px] shrink-0">
            <BookingSummary yacht={yacht} bookingData={bookingData} />
          </div>
        )}
        
      </div>
    </div>
  );
}
