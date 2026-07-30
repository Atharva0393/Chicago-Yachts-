"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { yachts } from '@/lib/constants/demo-data';

export type Yacht = typeof yachts[0];

interface WishlistContextType {
  savedYachts: Yacht[];
  toggleWishlist: (yachtId: string) => void;
  isSaved: (yachtId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [savedYachtIds, setSavedYachtIds] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('wishlistYachts');
    if (saved) {
      try {
        setSavedYachtIds(JSON.parse(saved) as string[]);
      } catch (e) {
        console.error("Failed to parse wishlist yachts", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Persist to localStorage when changed, but only after initial load
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('wishlistYachts', JSON.stringify(savedYachtIds));
    }
  }, [savedYachtIds, isLoaded]);

  const toggleWishlist = (yachtId: string) => {
    setSavedYachtIds(prev => 
      prev.includes(yachtId) 
        ? prev.filter(id => id !== yachtId) 
        : [...prev, yachtId]
    );
  };

  const isSaved = (yachtId: string) => savedYachtIds.includes(yachtId);

  // Map IDs back to full yacht objects for the dashboard
  const savedYachts = savedYachtIds
    .map(id => yachts.find(y => y.id === id))
    .filter((y): y is Yacht => y !== undefined);

  return (
    <WishlistContext.Provider value={{ savedYachts, toggleWishlist, isSaved }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
