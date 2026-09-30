import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ShowroomSlide } from '../types';

interface ShowroomHeroSliderProps {
  customImages?: string[];
  slides?: ShowroomSlide[];
}

const DEFAULT_SHOWROOM_IMAGES = [
  {
    url: '/images/hero_car_showroom_1790168724059.jpg',
    alt: 'Paul Smith Autos certified dealership showroom',
  },
  {
    url: '/images/vehicle_luxury_lexus_1790168762494.jpg',
    alt: 'Vehicles displayed inside Paul Smith Autos showroom',
  },
  {
    url: '/images/vehicle_suv_prado_1790168736955.jpg',
    alt: 'Showroom vehicle selection and inspection floor',
  },
  {
    url: '/images/import_shipping_port_1790168781597.jpg',
    alt: 'Direct international automotive sourcing and logistics',
  },
];

export const ShowroomHeroSlider: React.FC<ShowroomHeroSliderProps> = ({ customImages, slides: propSlides }) => {
  // If ShowroomSlide[] is provided, use enabled slides sorted by order
  const activeConfigSlides = propSlides && propSlides.length > 0
    ? propSlides.filter(s => s.enabled !== false).sort((a, b) => a.order - b.order)
    : null;

  const slides =
    activeConfigSlides && activeConfigSlides.length > 0
      ? activeConfigSlides.map((s, i) => ({ url: s.url, alt: s.caption || `Paul Smith Autos Showroom View ${i + 1}` }))
      : customImages && customImages.length > 0
      ? customImages.map((url, i) => ({ url, alt: `Paul Smith Autos Showroom View ${i + 1}` }))
      : DEFAULT_SHOWROOM_IMAGES;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Automatic slide cycle (6s)
  useEffect(() => {
    if (slides.length <= 1) return;

    timerRef.current = setInterval(() => {
      goToNext();
    }, 6000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [slides.length, goToNext]);

  // Mobile Touch Swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
    setTouchEndX(null);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX !== null && touchEndX !== null) {
      const distance = touchStartX - touchEndX;
      const minSwipeDistance = 45;
      if (distance > minSwipeDistance) {
        goToNext();
      } else if (distance < -minSwipeDistance) {
        goToPrev();
      }
    }
    setTouchStartX(null);
    setTouchEndX(null);
  };

  return (
    <div
      className="absolute inset-0 z-0 overflow-hidden select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Slides */}
      {slides.map((slide, index) => {
        const isActive = index === currentIndex;
        return (
          <div
            key={slide.url}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-40 z-1' : 'opacity-0 z-0'
            }`}
          >
            <img
              src={slide.url}
              alt={slide.alt}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center scale-105 transform duration-1000"
            />
          </div>
        );
      })}

      {/* Measured Dark Scrim & Gradients to guarantee high contrast & readability for hero text */}
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/75 to-neutral-950/50 z-2 pointer-events-none" />

      {/* Subtle Navigation Controls */}
      {slides.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            aria-label="Previous showroom slide"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-neutral-950/40 hover:bg-neutral-900/80 text-white/70 hover:text-white border border-white/10 backdrop-blur-sm transition cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <button
            onClick={goToNext}
            aria-label="Next showroom slide"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-neutral-950/40 hover:bg-neutral-900/80 text-white/70 hover:text-white border border-white/10 backdrop-blur-sm transition cursor-pointer"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Subtle Pagination Indicators */}
          <div className="absolute bottom-6 left-0 right-0 z-20 flex items-center justify-center gap-2 pointer-events-auto">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to showroom slide ${idx + 1}`}
                className={`h-1 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentIndex
                    ? 'w-6 bg-amber-400'
                    : 'w-2 bg-neutral-600/70 hover:bg-neutral-400'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
