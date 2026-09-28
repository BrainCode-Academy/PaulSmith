import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  MessageSquare,
  Ship,
  CheckCircle2,
  Search,
  Sparkles,
  Phone,
  ShieldCheck,
  ChevronRight,
  Layers,
  Flame,
  Award,
} from 'lucide-react';
import { Vehicle, Review, BrandHierarchyResult } from '../types';
import { useDealer } from '../context/DealerContext';
import { VehicleCard } from '../components/VehicleCard';
import { ShareVehicleModal } from '../components/ShareVehicleModal';
import { buildWhatsAppLink, getGeneralWhatsAppMessage } from '../lib/whatsapp';
import { api } from '../lib/api';

interface HomePageProps {
  onNavigate: (path: string, params?: Record<string, string>) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { settings } = useDealer();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [hierarchy, setHierarchy] = useState<BrandHierarchyResult[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [sharingVehicle, setSharingVehicle] = useState<Vehicle | null>(null);

  // "Find Your Car" Search state
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedBudget, setSelectedBudget] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const [vehiclesData, hierarchyData, reviewsData] = await Promise.all([
          api.getVehicles(),
          api.getHierarchy(),
          api.getReviews(),
        ]);
        setVehicles(vehiclesData);
        setHierarchy(hierarchyData);
        setReviews(reviewsData);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
    api.trackEvent('page_view', undefined, { page: 'home' });
  }, []);

  const businessName = settings?.businessName || 'Paul Smith Autos';
  const ceoPhone = settings?.ceoPhone || settings?.phone || '08037781788';
  const ceoWhatsApp = settings?.whatsappNumber || '08037781788';
  const directCeoWhatsappUrl = buildWhatsAppLink(
    ceoWhatsApp,
    `Hello Mr. Paul Smith, I am contacting you directly regarding vehicle acquisition from ${businessName}.`
  );
  const whatsappUrl = buildWhatsAppLink(
    settings?.whatsappNumber || '08037781788',
    getGeneralWhatsAppMessage(businessName)
  );

  // Available models based on selected brand
  const activeBrandObj = hierarchy.find(
    (b) => b.name.toLowerCase() === selectedBrand.toLowerCase()
  );
  const availableModels = activeBrandObj?.models || [];

  // Available years based on selected model
  const activeModelObj = availableModels.find(
    (m) => m.name.toLowerCase() === selectedModel.toLowerCase()
  );
  const availableYears = activeModelObj
    ? activeModelObj.years
    : Array.from(new Set(availableModels.flatMap((m) => m.years))).sort((a, b) => b - a);

  // Handle Find Your Car form submission
  const handleSearchCars = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('/cars', {
      make: selectedBrand,
      model: selectedModel,
      year: selectedYear,
      maxPrice: selectedBudget,
    });
  };

  // Brands with available inventory
  const brandsWithInventory = hierarchy.filter((b) => b.vehicleCount > 0);

  // Featured vehicles
  const featuredVehicles = vehicles.filter((v) => v.featured);

  // Just Arrived vehicles (sorted by creation date)
  const justArrivedVehicles = [...vehicles]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  return (
    <div className="space-y-16 lg:space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[580px] lg:min-h-[640px] flex items-center justify-center bg-neutral-950 overflow-hidden">
        {/* Background Hero Image with measured scrim for high contrast */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero_car_showroom_1790168724059.jpg"
            alt="Paul Smith Autos digital showroom"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-40 scale-105 transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/75 to-neutral-950/50" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 bg-amber-950/60 border border-amber-800/80 px-3.5 py-1.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Digital Showroom & Direct International Sourcing</span>
          </div>

          <h1
            className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-tight"
            style={{ textWrap: 'balance' }}
          >
            Find Your Next Car With Confidence.
          </h1>

          <p className="text-base sm:text-lg text-neutral-300 max-w-2xl mx-auto leading-relaxed">
            {settings?.businessDescription ||
              '100% verified vehicle inventory, authentic customs clearance, sound engine integrity, and direct vehicle sourcing across international markets.'}
          </p>

          {/* Buttons: Browse Cars, Import a Car, Chat on WhatsApp */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={() => onNavigate('/cars')}
              className="w-full sm:w-auto px-7 py-3.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Browse Cars</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('/import-a-car')}
              className="w-full sm:w-auto px-7 py-3.5 bg-neutral-900/90 hover:bg-neutral-800 text-white border border-neutral-700 font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Ship className="w-4 h-4 text-amber-400" />
              <span>Import a Car</span>
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-7 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. FIND YOUR CAR SECTION (Immediately after the hero) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-14 relative z-20">
        <div className="bg-neutral-900/95 backdrop-blur-md border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <Search className="w-5 h-5 text-amber-400" />
                <span>Find Your Car</span>
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Explore real inventory directly from our verified showroom database
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedBrand('');
                setSelectedModel('');
                setSelectedYear('');
                setSelectedBudget('');
              }}
              className="text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              Clear filters
            </button>
          </div>

          <form onSubmit={handleSearchCars} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end pt-2">
            {/* 1. Brand */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Brand
              </label>
              <select
                value={selectedBrand}
                onChange={(e) => {
                  setSelectedBrand(e.target.value);
                  setSelectedModel('');
                  setSelectedYear('');
                }}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 transition-colors"
              >
                <option value="">All Brands</option>
                {hierarchy.map((b) => (
                  <option key={b.id} value={b.name}>
                    {b.name} {b.vehicleCount > 0 ? `(${b.vehicleCount} in stock)` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Model (filtered by selected brand) */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Model
              </label>
              <select
                value={selectedModel}
                onChange={(e) => {
                  setSelectedModel(e.target.value);
                  setSelectedYear('');
                }}
                disabled={!selectedBrand && availableModels.length === 0}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 disabled:opacity-50 transition-colors"
              >
                <option value="">
                  {selectedBrand ? 'All Models' : 'Select Brand First'}
                </option>
                {availableModels.map((m) => (
                  <option key={m.id} value={m.name}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Year */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Year
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 transition-colors"
              >
                <option value="">Any Year</option>
                {availableYears.length > 0 ? (
                  availableYears.map((y) => (
                    <option key={y} value={String(y)}>
                      {y}
                    </option>
                  ))
                ) : (
                  [2024, 2023, 2022, 2021, 2020, 2019, 2018].map((y) => (
                    <option key={y} value={String(y)}>
                      {y}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* 4. Budget */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Budget
              </label>
              <select
                value={selectedBudget}
                onChange={(e) => setSelectedBudget(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 transition-colors"
              >
                <option value="">Any Budget</option>
                <option value="30000000">Up to ₦30M</option>
                <option value="50000000">Up to ₦50M</option>
                <option value="80000000">Up to ₦80M</option>
                <option value="120000000">Up to ₦120M</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="sm:col-span-2 lg:col-span-4 pt-2">
              <button
                type="submit"
                className="w-full py-3 px-6 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider shadow-md"
              >
                <Search className="w-4 h-4" />
                <span>SEARCH CARS</span>
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* 3. BROWSE BY BRAND (Real database counts) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
              <Layers className="w-3.5 h-3.5" />
              <span>Inventory Catalog</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">Browse By Brand</h2>
            <p className="text-xs text-neutral-400 mt-1">
              Select a brand to view available vehicles currently in our showroom.
            </p>
          </div>
          <button
            onClick={() => onNavigate('/cars')}
            className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
          >
            <span>View All Cars</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {brandsWithInventory.length === 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {hierarchy.slice(0, 4).map((b) => (
              <button
                key={b.id}
                onClick={() => onNavigate('/cars', { make: b.name })}
                className="p-5 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-xl text-left transition-colors cursor-pointer group"
              >
                <div className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                  {b.name}
                </div>
                <div className="text-xs text-neutral-400 mt-1">Direct Import Available</div>
              </button>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {brandsWithInventory.map((brand) => (
              <button
                key={brand.id}
                onClick={() => onNavigate('/cars', { make: brand.name })}
                className="p-6 bg-neutral-900 border border-neutral-800 hover:border-amber-400/60 rounded-xl text-left transition-all duration-200 cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                    {brand.name}
                  </div>
                  <div className="text-xs font-medium text-amber-400/90 mt-1">
                    {brand.vehicleCount} {brand.vehicleCount === 1 ? 'Vehicle' : 'Vehicles'} Available
                  </div>
                </div>
                <div className="mt-4 flex items-center text-xs text-neutral-400 group-hover:text-white transition-colors">
                  <span>View collection</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* 4. JUST ARRIVED (Recently published vehicles) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
              <Flame className="w-3.5 h-3.5" />
              <span>Fresh Showroom Arrivals</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">Just Arrived</h2>
            <p className="text-xs text-neutral-400 mt-1">
              Newly landed and recently published vehicles ready for instant physical inspection.
            </p>
          </div>
          <button
            onClick={() => onNavigate('/cars')}
            className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
          >
            <span>See All Cars</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-neutral-900 border border-neutral-800 rounded-xl h-72 animate-pulse" />
            ))}
          </div>
        ) : justArrivedVehicles.length === 0 ? (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-10 text-center space-y-3">
            <h3 className="text-base font-semibold text-white">No vehicles recently added</h3>
            <p className="text-xs text-neutral-400">Check back shortly or submit an import request.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {justArrivedVehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onSelect={(slug) => onNavigate(`/cars/${slug}`)}
                onShare={(v) => setSharingVehicle(v)}
              />
            ))}
          </div>
        )}
      </section>

      {/* 5. FEATURED VEHICLES (Admin-marked featured vehicles only) */}
      {featuredVehicles.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
                <Award className="w-3.5 h-3.5" />
                <span>Handpicked Selection</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white">Featured Vehicles</h2>
              <p className="text-xs text-neutral-400 mt-1">
                Special spotlight vehicles curated by our dealership management.
              </p>
            </div>
            <button
              onClick={() => onNavigate('/cars')}
              className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
            >
              <span>Explore All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredVehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onSelect={(slug) => onNavigate(`/cars/${slug}`)}
                onShare={(v) => setSharingVehicle(v)}
              />
            ))}
          </div>
        </section>
      )}

      {/* 6. IMPORT A CAR SPOTLIGHT BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-950 border border-neutral-800 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 sm:p-12">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-3 py-1 rounded-md">
              <Ship className="w-3.5 h-3.5" />
              <span>International Vehicle Sourcing</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug">
              Can’t find the exact car you want? We source and import directly for you.
            </h2>

            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              Tell us your preferred make, model, year, and target budget. We leverage direct sourcing channels across{' '}
              <strong className="text-white">
                {settings?.importCountries && settings.importCountries.length > 0
                  ? settings.importCountries.join(', ')
                  : 'China, United States, Canada, and Germany'}
              </strong>
              , handling vehicle verification, container logistics, and port clearance documentation.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-neutral-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Documented vehicle physical inspection</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Transparent shipping & clearing breakdown</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Direct WhatsApp tracking updates</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Port clearance and delivery assistance</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                onClick={() => onNavigate('/import-a-car')}
                className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold rounded-xl text-xs transition-colors cursor-pointer uppercase tracking-wider"
              >
                Import a Car
              </button>

              <button
                onClick={() => onNavigate('/find-my-car')}
                className="px-6 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Find My Car
              </button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-xl overflow-hidden aspect-[16/10] border border-neutral-700/60 shadow-2xl">
              <img
                src="/images/import_shipping_port_1790168781597.jpg"
                alt="Automotive container logistics and shipping"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 7. MEET THE FOUNDER & CEO (Paul Smith) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center p-6 sm:p-10">
            <div className="md:col-span-4 flex justify-center">
              <div className="relative w-48 sm:w-60 aspect-square rounded-2xl overflow-hidden border border-neutral-700/80 shadow-2xl bg-neutral-950">
                <img
                  src={settings?.ceoImage || '/images/ceo_paul_smith_1790590776884.jpg'}
                  alt="Paul Smith - Founder & CEO of Paul Smith Autos"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-transparent to-transparent" />
                <div className="absolute bottom-2.5 left-3 right-3 text-center sm:text-left">
                  <span className="text-xs font-bold text-white block">Paul Smith</span>
                  <span className="text-[11px] text-amber-400 block font-medium">Founder & CEO</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-8 space-y-4 text-center sm:text-left">
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold">Leadership & Personal Guarantee</span>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  "No Fakes. No Compromise on Engine Soundness or Customs Authenticity."
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                {settings?.ceoQuote ||
                  'At Paul Smith Autos, we inspect every car down to the bolt. No accident-concealed vehicles, no tampered odometers. You deal directly with a team that values your safety and hard-earned capital.'}
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2">
                <a
                  href={directCeoWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 fill-current" />
                  <span>Chat with Paul Smith ({ceoPhone})</span>
                </a>

                <a
                  href={`tel:${ceoPhone}`}
                  className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-medium transition-colors flex items-center gap-2"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>Call: {ceoPhone}</span>
                </a>

                <button
                  onClick={() => onNavigate('/about')}
                  className="px-4 py-2.5 bg-transparent hover:bg-neutral-800 text-amber-400 border border-amber-800/60 rounded-xl text-xs font-medium transition-colors cursor-pointer"
                >
                  About Dealership
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. WHATSAPP VIP COMMUNITY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-emerald-950/50 via-neutral-900 to-neutral-950 border border-emerald-900/40 rounded-2xl p-8 sm:p-12 text-center space-y-4 shadow-xl">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 mx-auto">
            <MessageSquare className="w-6 h-6 fill-current" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Join Our Official WhatsApp Community</h2>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-xl mx-auto leading-relaxed">
            Get instant updates on fresh vehicle arrivals, private discounts, and container shipment manifests before they are publicly listed on social media.
          </p>
          <div className="pt-2">
            <a
              href={settings?.whatsappGroupLink || 'https://chat.whatsapp.com/KPf3ssd38y35dyrty1WsYf?s=qt&p=a&mlu=4&ilr=4'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors shadow-lg shadow-emerald-900/30 uppercase tracking-wider"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              <span>Join WhatsApp Community</span>
            </a>
          </div>
        </div>
      </section>

      {/* 9. REVIEWS (Authentic dealer reviews) */}
      {reviews.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-white">Verified Customer Experiences</h2>
            <p className="text-xs text-neutral-400 mt-1">Real feedback from clients who purchased or imported vehicles.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((rev) => (
              <div key={rev.id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-3">
                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <span className="font-semibold text-white">{rev.customerName}</span>
                  <span>{rev.date}</span>
                </div>
                {rev.vehiclePurchased && (
                  <div className="text-xs text-amber-400 font-medium">Vehicle: {rev.vehiclePurchased}</div>
                )}
                <p className="text-xs text-neutral-300 leading-relaxed">"{rev.comment}"</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Sharing modal if triggered */}
      {sharingVehicle && (
        <ShareVehicleModal vehicle={sharingVehicle} onClose={() => setSharingVehicle(null)} />
      )}
    </div>
  );
};
