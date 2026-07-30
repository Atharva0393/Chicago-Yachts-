import React from "react";
import { Quote } from "lucide-react";

const stories = [
  {
    type: "Wedding Anniversary",
    quote: "The attention to detail was beyond anything we expected. Celebrating our 10th anniversary on Lake Michigan with a private chef made it the most memorable night of our lives.",
    author: "Sarah & James T.",
  },
  {
    type: "Corporate Event",
    quote: "We hosted our executive team retreat aboard the Sea Ray. The seamless service and stunning backdrop of the Chicago skyline elevated our entire offsite experience.",
    author: "Michael R., CEO",
  },
  {
    type: "Marriage Proposal",
    quote: "The concierge team handled everything flawlessly. From the hidden photographer to the timed sunset cruise, she said yes, and the moment was absolutely perfect.",
    author: "David M.",
  }
];

export function ClientStories() {
  return (
    <section className="py-32 bg-slate-900 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container px-4 md:px-8 max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-3xl md:text-5xl font-normal tracking-tight mb-4">
            Client Stories
          </h2>
          <p className="text-slate-400 text-lg font-light leading-relaxed">
            Real experiences from guests who trusted us with their most important moments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stories.map((story) => (
            <div key={story.author} className="flex flex-col bg-slate-800/50 backdrop-blur-sm rounded-[24px] p-10 border border-slate-700/50 hover:bg-slate-800 transition-colors duration-300">
              <Quote className="w-8 h-8 text-slate-600 mb-6" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 mb-4 block">
                {story.type}
              </span>
              <p className="text-lg text-slate-200 font-light leading-relaxed flex-1 mb-8">
                "{story.quote}"
              </p>
              <div className="flex items-center gap-4 border-t border-slate-700/50 pt-6">
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-sm font-medium">
                  {story.author.charAt(0)}
                </div>
                <span className="text-sm font-medium text-slate-300">{story.author}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
