"use client"

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useCompanyInfo } from "@/hooks/useData";

export function EnquiryForm() {
  const { companyInfo, loading } = useCompanyInfo();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  if (loading || !companyInfo) return null;

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-[2rem] p-12 text-center border border-slate-100 shadow-xl h-full flex flex-col items-center justify-center min-h-[600px]">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-600 mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h3 className="text-3xl font-medium text-slate-900 mb-4 tracking-tight">Enquiry Received</h3>
        <p className="text-slate-500 font-light text-lg max-w-md mx-auto leading-relaxed">
          Thank you for reaching out. A member of our concierge team will contact you within the next 24 hours to begin planning your experience.
        </p>
        <Button 
          onClick={() => setIsSubmitted(false)}
          variant="outline" 
          className="mt-10 rounded-full px-8 h-12"
        >
          Send Another Enquiry
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2rem] p-8 md:p-12 border border-slate-100 shadow-xl relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      
      <div className="mb-10 relative z-10">
        <h2 className="text-3xl font-normal text-slate-900 tracking-tight mb-3">Plan Your Experience</h2>
        <p className="text-slate-500 font-light text-sm">Fill out the form below and our concierge will handle the rest.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-wider text-slate-500">First Name</label>
            <input required type="text" className="w-full h-12 bg-slate-50 border-transparent rounded-xl px-4 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-colors text-sm" placeholder="James" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-wider text-slate-500">Last Name</label>
            <input required type="text" className="w-full h-12 bg-slate-50 border-transparent rounded-xl px-4 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-colors text-sm" placeholder="Sterling" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-wider text-slate-500">Email</label>
            <input required type="email" className="w-full h-12 bg-slate-50 border-transparent rounded-xl px-4 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-colors text-sm" placeholder="james@example.com" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-wider text-slate-500">Phone Number</label>
            <input required type="tel" className="w-full h-12 bg-slate-50 border-transparent rounded-xl px-4 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-colors text-sm" placeholder="+1 (555) 000-0000" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-wider text-slate-500">Preferred Date</label>
            <input type="date" className="w-full h-12 bg-slate-50 border-transparent rounded-xl px-4 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-colors text-sm text-slate-700" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-wider text-slate-500">Time</label>
            <input type="time" className="w-full h-12 bg-slate-50 border-transparent rounded-xl px-4 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-colors text-sm text-slate-700" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-wider text-slate-500">Guests</label>
            <input type="number" min="1" max="50" className="w-full h-12 bg-slate-50 border-transparent rounded-xl px-4 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-colors text-sm" placeholder="e.g. 12" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-wider text-slate-500">Occasion</label>
            <select className="w-full h-12 bg-slate-50 border-transparent rounded-xl px-4 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-colors text-sm text-slate-700 appearance-none">
              <option value="">Select an occasion...</option>
              <option value="birthday">Birthday</option>
              <option value="corporate">Corporate Event</option>
              <option value="proposal">Proposal</option>
              <option value="anniversary">Anniversary</option>
              <option value="bachelor">Bachelor Party</option>
              <option value="bachelorette">Bachelorette Party</option>
              <option value="sunset">Sunset Cruise</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-wider text-slate-500">Preferred Yacht</label>
            <select className="w-full h-12 bg-slate-50 border-transparent rounded-xl px-4 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-colors text-sm text-slate-700 appearance-none">
              <option value="">No preference / Advise me</option>
              <option value="azimut-60">Azimut 60</option>
              <option value="sunseeker-68">Sunseeker 68</option>
              <option value="princess-72">Princess 72</option>
              <option value="riva-corsaro">Riva Corsaro</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium uppercase tracking-wider text-slate-500">Message / Special Requests</label>
          <textarea rows={4} className="w-full bg-slate-50 border-transparent rounded-xl p-4 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-colors text-sm resize-none" placeholder="Tell us about your ideal experience, catering preferences, or any special requirements..."></textarea>
        </div>
        <div className="flex items-start gap-3">
          <input required type="checkbox" id="privacy" className="mt-1 border-slate-300 rounded text-slate-900 focus:ring-slate-900" />
          <label htmlFor="privacy" className="text-xs text-slate-500 font-light leading-relaxed">
            I agree to the <Link href={companyInfo.policies.privacy} className="underline hover:text-slate-900">Privacy Policy</Link> and consent to being contacted regarding my enquiry.
          </label>
        </div>

        <Button type="submit" className="w-full rounded-xl h-14 bg-slate-900 text-white hover:bg-slate-800 text-base font-medium transition-luxury shadow-lg shadow-slate-900/20">
          Send Enquiry
        </Button>
      </form>
    </div>
  );
}
