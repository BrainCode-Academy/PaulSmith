import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Pause,
  Play,
  Gauge,
  Fuel,
  Compass,
} from 'lucide-react';
import { Vehicle, DealerSettings } from '../types';
import { formatPrice, buildWhatsAppLink, getVehicleInquiryMessage } from '../lib/whatsapp';

interface HeroSliderProps {
  vehicles: Vehicle[];
  settings: DealerSettings | null;
  onNavigate: (path: string, params?: Record<string, string>) => void;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ vehicles, settings, onNavigate }) => {
  // Business logic: Vehicle must be Featured + Published + Available (+ heroSlideEnabled !== false)
  const eligibleVehicles = vehicles
    .filter(
      (v) =>
        v.featured === true &&
        v.published === true &&
        v.status === 'Available' &&
        v.heroSlideEnabled !== false
    )
    .sort((a, b) => (a.featuredOrder ?? 0) - (b.featuredOrder ?? 0));

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalSlides = eligibleVehicles.length;

  // Safe navigation helpers
  const goToNext = useCallback(() => {
    if (totalSlides <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const goToPrev = useCallback(() => {
    if (totalSlides <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Keep index within bounds if list shrinks
  useEffect(() => {
    if (currentIndex >= totalSlides && totalSlides > 0) {
      setCurrentIndex(0);
    }
  }, [totalSlides, currentIndex]);

  // Auto sliding timer (5.5s)
  useEffect(() => {
    if (totalSlides <= 1 || isPaused) return;

    timerRef.current = setInterval(() => {
      goToNext();
    }, 5500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [totalSlides, isPaused, goToNext]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'ArrowRight') goToNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToPrev, goToNext]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
    setTouchEndX(null);
    setIsPaused(true);
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
    setIsPaused(false);
  };

  const businessName = settings?.businessName || 'Paul Smith Autos';
  const dealerWhatsApp = settings?.whatsappNumber || '08037781788';

  // Fallback if no vehicles are marked featured
  if (totalSlides === 0) {
    return (
      <section className="relative min-h-[540px] lg:min-h-[620px] flex items-center justify-center bg-neutral-950 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero_car_showroom_1790168724059.jpg"
            alt="Paul Smith Autos digital showroom"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-40 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-neutral-950/60" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400 bg-blue-950/60 border border-blue-800/80 px-3.5 py-1.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Digital Showroom & Direct International Sourcing</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Find Your Next Car With Confidence.
          </h1>

          <p className="text-base sm:text-lg text-neutral-300 max-w-2xl mx-auto leading-relaxed">
            {settings?.businessDescription ||
              '100% verified vehicle inventory, authentic customs clearance, sound engine integrity, and direct vehicle sourcing across international markets.'}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={() => onNavigate('/cars')}
              className="w-full sm:w-auto px-7 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Browse Cars</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('/import-a-car')}
              className="w-full sm:w-auto px-7 py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-xl text-sm transition border border-neutral-700 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Import a Car</span>
            </button>
            <a
              href={buildWhatsAppLink(dealerWhatsApp, `Hello ${businessName}, I would like to inquire about your available cars.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-7 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-sm transition shadow-lg flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>
    );
  }

  const currentVehicle = eligibleVehicles[currentIndex] || eligibleVehicles[0];

  return (
    <section
      className="relative w-full overflow-hidden bg-neutral-950 select-none group"
      aria-label="Featured Vehicles Showcase"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides Container */}
      <div className="relative h-[620px] sm:h-[660px] lg:h-[700px] w-full">
        {eligibleVehicles.map((vehicle, index) => {
          const isActive = index === currentIndex;
          const heroImage =
            vehicle.images && vehicle.images.length > 0
              ? vehicle.images[0]
              : '/images/hero_car_showroom_1790168724059.jpg';
          const vehicleWhatsAppUrl = buildWhatsAppLink(
            dealerWhatsApp,
            getVehicleInquiryMessage(vehicle, settings || undefined)
          );

          return (
            <div
              key={vehicle.id}
              className={`absolute inset-0 w-full h-full transition-all duration-700 ease-out ${
                isActive
                  ? 'opacity-100 scale-100 z-10 pointer-events-auto'
                  : 'opacity-0 scale-105 z-0 pointer-events-none'
              }`}
            >
              {/* Background Vehicle Image */}
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={heroImage}
                  alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center transform transition-transform duration-1000 ease-out"
                />

                {/* Multi-layered Vignette & Gradients for maximum visual impact & text contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent opacity-95 sm:opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/90 via-neutral-950/40 to-transparent" />
                <div className="absolute inset-0 bg-neutral-950/20 backdrop-brightness-[0.88]" />
              </div>

              {/* Slide Content Overlay */}
              <div className="relative z-20 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-20 sm:pb-24 lg:pb-28">
                <div className="max-w-2xl space-y-4 sm:space-y-5">
                  {/* Status & Promoted Badge */}
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      AVAILABLE
                    </span>

                    <span className="inline-flex items-center gap-1 text-xs text-blue-400/90 font-medium">
                      <Sparkles className="w-3.5 h-3.5" />
                      Featured Showroom Selection
                    </span>

                    <span className="text-xs text-neutral-400 font-medium">
                      {vehicle.condition}
                    </span>
                  </div>

                  {/* Vehicle Heading */}
                  <div>
                    <p className="text-sm sm:text-base font-semibold text-blue-400 tracking-wide uppercase">
                      {vehicle.make}
                    </p>
                    <h2
                      onClick={() => onNavigate(`/cars/${vehicle.slug}`)}
                      className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight hover:text-blue-300 transition-colors cursor-pointer"
                    >
                      {vehicle.year} {vehicle.model}
                    </h2>
                  </div>

                  {/* Price Tag */}
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
                      {formatPrice(vehicle.price, vehicle.currency)}
                    </span>
                    <span className="text-xs text-neutral-400 uppercase tracking-wider">
                      Verified Pricing
                    </span>
                  </div>

                  {/* Quick Spec Highlights (clean typographic separators, anti-slop) */}
                  <div className="flex flex-wrap items-center gap-y-1 gap-x-2.5 text-xs text-neutral-300 font-medium">
                    <span className="flex items-center gap-1">
                      <Gauge className="w-3.5 h-3.5 text-blue-400" />
                      {vehicle.mileage.toLocaleString()} {vehicle.mileageUnit}
                    </span>
                    <span aria-hidden="true" className="text-neutral-600">·</span>
                    <span>{vehicle.transmission}</span>
                    <span aria-hidden="true" className="text-neutral-600">·</span>
                    <span className="flex items-center gap-1">
                      <Fuel className="w-3.5 h-3.5 text-blue-400" />
                      {vehicle.fuel}
                    </span>
                    {vehicle.driveType && (
                      <>
                        <span aria-hidden="true" className="text-neutral-600">·</span>
                        <span className="flex items-center gap-1">
                          <Compass className="w-3.5 h-3.5 text-blue-400" />
                          {vehicle.driveType}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Short Description */}
                  {vehicle.description && (
                    <p className="text-xs sm:text-sm text-neutral-300 line-clamp-2 max-w-xl leading-relaxed">
                      {vehicle.description}
                    </p>
                  )}

                  {/* CTA Buttons */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={() => onNavigate(`/cars/${vehicle.slug}`)}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2 cursor-pointer"
                    >
                      <span>View Vehicle</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <a
                      href={vehicleWhatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Chat on WhatsApp</span>
                    </a>

                    <button
                      onClick={() => onNavigate('/cars')}
                      className="hidden sm:inline-flex px-5 py-3 bg-neutral-900/80 hover:bg-neutral-800 text-neutral-200 text-xs font-semibold rounded-xl transition border border-neutral-700/80"
                    >
                      Browse All ({vehicles.length})
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Prev / Next Navigation Arrows (Desktop and Tablet) */}
      {totalSlides > 1 && (
        <>
          <button
            onClick={goToPrev}
            aria-label="Previous Vehicle Slide"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-neutral-900/70 hover:bg-neutral-800 text-white border border-neutral-700/70 backdrop-blur-sm transition-all opacity-80 group-hover:opacity-100 hover:scale-105 cursor-pointer shadow-xl"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <button
            onClick={goToNext}
            aria-label="Next Vehicle Slide"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-neutral-900/70 hover:bg-neutral-800 text-white border border-neutral-700/70 backdrop-blur-sm transition-all opacity-80 group-hover:opacity-100 hover:scale-105 cursor-pointer shadow-xl"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </>
      )}

      {/* Slide Pagination & Progress Bar (Bottom Center) */}
      {totalSlides > 1 && (
        <div className="absolute bottom-6 left-0 right-0 z-30 flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pointer-events-none">
          {/* Pagination Indicators */}
          <div className="flex items-center gap-2 pointer-events-auto">
            {eligibleVehicles.map((vehicle, idx) => {
              const active = idx === currentIndex;
              return (
                <button
                  key={vehicle.id}
                  onClick={() => goToSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}: ${vehicle.title}`}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    active
                      ? 'w-8 sm:w-10 bg-blue-600 shadow-sm shadow-blue-600/50'
                      : 'w-2 sm:w-3 bg-neutral-600/70 hover:bg-neutral-400'
                  }`}
                />
              );
            })}
          </div>

          {/* Slide Counter & Pause/Play Control */}
          <div className="flex items-center gap-3 bg-neutral-950/70 border border-neutral-800/80 backdrop-blur-md px-3 py-1.5 rounded-full text-xs text-neutral-300 pointer-events-auto font-mono">
            <span>
              <strong className="text-white">0{currentIndex + 1}</strong>
              <span className="text-neutral-500 mx-1">/</span>
              <span>0{totalSlides}</span>
            </span>

            <button
              onClick={() => setIsPaused(!isPaused)}
              aria-label={isPaused ? 'Resume Slideshow' : 'Pause Slideshow'}
              className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              {isPaused ? <Play className="w-3.5 h-3.5 text-blue-400" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
