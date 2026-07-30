"use client"

import React, { useState } from "react";
import Image from "next/image";
import { Grid, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface YachtGalleryProps {
  images: string[];
  yachtName: string;
}

export function YachtGallery({ images, yachtName }: YachtGalleryProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const mainImage = images[0] || "";
  const secondaryImages = images.slice(1, 5);

  const openGallery = (index: number) => {
    setCurrentIndex(index);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeGallery = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  const nextImage = () => setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  const prevImage = () => setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  return (
    <div className="relative pt-6">
      <div className="container px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-2 h-[400px] md:h-[500px] lg:h-[600px] rounded-3xl overflow-hidden group">
          
          {/* Main Hero Image */}
          <div 
            className="col-span-1 md:col-span-2 row-span-2 relative cursor-pointer overflow-hidden"
            onClick={() => openGallery(0)}
          >
            <Image 
              src={mainImage} 
              alt={`${yachtName} main view`} 
              fill 
              priority
              className="object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-black/10 hover:bg-transparent transition-colors duration-300" />
          </div>

          {/* Secondary Images Grid */}
          {secondaryImages.map((src, idx) => (
            <div 
              key={idx} 
              className={`hidden md:block relative cursor-pointer overflow-hidden ${idx === 1 ? 'md:col-start-4 md:row-start-1' : ''} ${idx === 2 ? 'md:col-start-3 md:row-start-2' : ''} ${idx === 3 ? 'md:col-start-4 md:row-start-2' : ''}`}
              onClick={() => openGallery(idx + 1)}
            >
              <Image 
                src={src} 
                alt={`${yachtName} detail ${idx + 1}`} 
                fill 
                className="object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-black/10 hover:bg-transparent transition-colors duration-300" />
            </div>
          ))}

          {/* Show All Photos Button */}
          <Button 
            onClick={() => openGallery(0)}
            className="absolute bottom-6 right-6 md:right-12 z-10 bg-white hover:bg-slate-50 text-slate-900 rounded-full shadow-lg border border-slate-200 transition-luxury hover-lift flex items-center gap-2"
          >
            <Grid className="w-4 h-4" />
            <span className="font-medium text-sm">Show all photos</span>
          </Button>

        </div>
      </div>

      {/* Fullscreen Gallery Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center animate-in fade-in duration-300">
          
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-10">
            <span className="text-white text-sm font-medium">{currentIndex + 1} / {images.length}</span>
            <button 
              onClick={closeGallery} 
              className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <button 
            onClick={prevImage}
            className="absolute left-4 md:left-8 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-10"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          
          <button 
            onClick={nextImage}
            className="absolute right-4 md:right-8 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-10"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          {/* Current Image */}
          <div className="relative w-full max-w-6xl h-[80vh] px-16">
            <Image 
              src={images[currentIndex]} 
              alt={`${yachtName} gallery ${currentIndex + 1}`} 
              fill 
              className="object-contain"
              priority
            />
          </div>

        </div>
      )}
    </div>
  );
}
