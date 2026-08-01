import React from "react";
import { dataService } from "@/services/data.service";

export async function BusinessInfo() {
  const companyInfo = await dataService.getCompanyInfo();
  return (
    <div className="bg-slate-900 rounded-[2rem] p-8 md:p-12 text-white relative overflow-hidden h-full">
      {/* Decorative gradients */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-slate-800 rounded-full blur-[80px] opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-slate-800 rounded-full blur-[60px] opacity-50 translate-y-1/2 -translate-x-1/2 pointer-events-none" />
      
      <div className="relative z-10">
        <h3 className="text-xl font-medium mb-8">Business Information</h3>
        
        <div className="space-y-8">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Office Hours</h4>
            <p className="text-lg font-light text-slate-200">{companyInfo.operatingHours}</p>
            <p className="text-sm font-light text-slate-400">Available Daily</p>
          </div>
          
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Emergency Contact</h4>
            <p className="text-lg font-light text-slate-200">+1 (312) 555-9999</p>
            <p className="text-sm font-light text-slate-400">For active charters only</p>
          </div>
          
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Response Time</h4>
            <p className="text-lg font-light text-slate-200">&lt; 2 Hours</p>
            <p className="text-sm font-light text-slate-400">During regular office hours</p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Service Area</h4>
            <p className="text-lg font-light text-slate-200">Lake Michigan & Chicago River</p>
            <p className="text-sm font-light text-slate-400">Burnham, Monroe & Navy Pier Harbors</p>
          </div>
        </div>
      </div>
    </div>
  );
}
