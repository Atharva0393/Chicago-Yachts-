"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { yachts } from '@/lib/constants/demo-data';

export type Yacht = typeof yachts[0];

interface RecentlyViewedContextType {
  recentYachts: Yacht[];
  addRecentYacht: (yachtId: string) => void;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined);

export function RecentlyViewedProvider({ children }: { children: React.ReactNode }) {
  const [recentYachtIds, setRecentYachtIds] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('recentlyViewedYachts');
    if (saved) {
      try {
        setRecentYachtIds(JSON.parse(saved) as string[]);
      } catch (e) {
        console.error("Failed to parse recently viewed yachts", e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('recentlyViewedYachts', JSON.stringify(recentYachtIds));
    }
  }, [recentYachtIds, isLoaded]);

  const addRecentYacht = (yachtId: string) => {
    setRecentYachtIds(prev => {
      // Remove if it exists so we can move it to the front
      const filtered = prev.filter(id => id !== yachtId);
      // Add to beginning, max 10
      return [yachtId, ...filtered].slice(0, 10);
    });
  };

  // Map IDs back to full yacht objects
  const recentYachts = recentYachtIds
    .map(id => yachts.find(y => y.id === id))
    .filter((y): y is Yacht => y !== undefined);

  return (
    <RecentlyViewedContext.Provider value={{ recentYachts, addRecentYacht }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed() {
  const context = useContext(RecentlyViewedContext);
  if (context === undefined) {
    throw new Error('useRecentlyViewed must be used within a RecentlyViewedProvider');
  }
  return context;
}
