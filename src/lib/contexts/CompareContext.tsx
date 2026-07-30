"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { yachts } from '@/lib/constants/demo-data';

// Determine the type from the demo data
export type Yacht = typeof yachts[0];

interface CompareContextType {
  selectedYachts: Yacht[];
  addYacht: (yachtId: string) => void;
  removeYacht: (yachtId: string) => void;
  clearCompare: () => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [selectedYachts, setSelectedYachts] = useState<Yacht[]>([]);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('compareYachts');
    if (saved) {
      try {
        const parsedIds = JSON.parse(saved) as string[];
        const matched = yachts.filter(y => parsedIds.includes(y.id));
        setSelectedYachts(matched);
      } catch (e) {
        console.error("Failed to parse compare yachts", e);
      }
    }
  }, []);

  // Save to local storage when changed
  useEffect(() => {
    const ids = selectedYachts.map(y => y.id);
    localStorage.setItem('compareYachts', JSON.stringify(ids));
  }, [selectedYachts]);

  const addYacht = (yachtId: string) => {
    if (selectedYachts.length >= 3) {
      // Could trigger a toast here
      alert("You can only compare up to 3 yachts at a time.");
      return;
    }
    
    if (selectedYachts.some(y => y.id === yachtId)) return;
    
    const yachtToAdd = yachts.find(y => y.id === yachtId);
    if (yachtToAdd) {
      setSelectedYachts(prev => [...prev, yachtToAdd]);
    }
  };

  const removeYacht = (yachtId: string) => {
    setSelectedYachts(prev => prev.filter(y => y.id !== yachtId));
  };

  const clearCompare = () => {
    setSelectedYachts([]);
  };

  return (
    <CompareContext.Provider value={{ selectedYachts, addYacht, removeYacht, clearCompare }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (context === undefined) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
}
