import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  ChevronRight,
  Globe,
  Ship,
  Sparkles,
  Info,
  Car,
  CheckCircle2,
  X,
  MessageSquare
} from 'lucide-react';
import { api } from '../lib/api';
import { BrandHierarchyResult, DealerSettings } from '../types';
import { buildWhatsAppLink } from '../lib/whatsapp';

interface BrandsPageProps {
  onNavigate: (path: string, params?: Record<string, string>) => void;
  settings?: DealerSettings | null;
}

export const BrandsPage: React.FC<BrandsPageProps> = ({ onNavigate, settings }) => {
  const [hierarchy, setHierarchy] = useState<BrandHierarchyResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLetter, setSelectedLetter] = useState<string>('ALL');
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');
  const [filterInStockOnly, setFilterInStockOnly] = useState(false);
  const [selectedBrandModal, setSelectedBrandModal] = useState<BrandHierarchyResult | null>(null);

  useEffect(() => {
    const loadCatalog = async () => {
      setLoading(true);
      try {
        const data = await api.getHierarchy();
        setHierarchy(data);
      } catch (err) {
        console.error('Failed to load brand directory:', err);
      } finally {
        setLoading(false);
      }
    };
    loadCatalog();
    api.trackEvent('page_view', undefined, { page: 'all_brands' });
  }, []);

  const businessName = settings?.businessName || 'Paul Smith Autos';
  const whatsappNumber = settings?.whatsappNumber || '08037781788';

  // Distinct country/regions
  const regions = useMemo(() => {
    const set = new Set<string>();
    hierarchy.forEach((b) => {
      if (b.country) set.add(b.country);
    });
    return Array.from(set).sort();
  }, [hierarchy]);

  // Available Alphabet letters
  const alphabetLetters = useMemo(() => {
    const set = new Set<string>();
    hierarchy.forEach((b) => {
      const firstChar = b.name.charAt(0).toUpperCase();
      if (/[A-Z]/.test(firstChar)) set.add(firstChar);
    });
    return Array.from(set).sort();
  }, [hierarchy]);

  // Filtered list
  const filteredBrands = useMemo(() => {
    return hierarchy.filter((brand) => {
      // 1. Search filter
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchesName = brand.name.toLowerCase().includes(query);
        const matchesCountry = (brand.country || '').toLowerCase().includes(query);
        const matchesModel = brand.models.some((m) => m.name.toLowerCase().includes(query));
        if (!matchesName && !matchesCountry && !matchesModel) return false;
      }

      // 2. Letter filter
      if (selectedLetter !== 'ALL') {
        if (!brand.name.toUpperCase().startsWith(selectedLetter)) return false;
      }

      // 3. Country / Region filter
      if (selectedRegion !== 'ALL') {
        if (brand.country !== selectedRegion) return false;
      }

      // 4. In stock only
      if (filterInStockOnly) {
        if (brand.vehicleCount <= 0) return false;
      }

      return true;
    }).sort((a, b) => a.name.localeCompare(b.name));
  }, [hierarchy, searchTerm, selectedLetter, selectedRegion, filterInStockOnly]);

  // Group by alphabetical letter
  const groupedByLetter = useMemo(() => {
    const map: Record<string, BrandHierarchyResult[]> = {};
    filteredBrands.forEach((brand) => {
      const letter = brand.name.charAt(0).toUpperCase();
      if (!map[letter]) {
        map[letter] = [];
      }
      map[letter].push(brand);
    });
    return map;
  }, [filteredBrands]);

  const totalInStock = hierarchy.reduce((acc, curr) => acc + curr.vehicleCount, 0);
  const brandsWithStockCount = hierarchy.filter((b) => b.vehicleCount > 0).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* 1. Page Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-800/60 text-blue-300 text-xs font-semibold">
          <Globe className="w-3.5 h-3.5 text-blue-400" />
          <span>Global Automobile Manufacturers Catalog</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              All Car Brands
            </h1>
            <p className="text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
              Explore our comprehensive database of automobile manufacturers. View models currently in our
              showroom inventory, or request direct foreign import sourcing for any brand worldwide.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-[#0e1422] border border-slate-800 px-5 py-3 rounded-xl shrink-0">
            <div>
              <span className="block text-xl font-bold text-white font-mono">{hierarchy.length}</span>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                Supported Brands
              </span>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div>
              <span className="block text-xl font-bold text-blue-400 font-mono">{brandsWithStockCount}</span>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                With In-Stock Cars
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Search & Controls Bar */}
      <div className="bg-[#0e1422] border border-slate-800 rounded-xl p-5 space-y-5 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search manufacturers, countries (e.g. Toyota, Germany, BYD)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#090d16] border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Region / Country Filter */}
          <div className="w-full sm:w-auto flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full sm:w-48 bg-[#090d16] border border-slate-800 rounded-lg px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Countries / Markets</option>
              {regions.map((reg) => (
                <option key={reg} value={reg}>
                  {reg}
                </option>
              ))}
            </select>
          </div>

          {/* In-Stock Toggle */}
          <button
            type="button"
            onClick={() => setFilterInStockOnly(!filterInStockOnly)}
            className={`w-full sm:w-auto px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer border ${
              filterInStockOnly
                ? 'bg-blue-600 text-white border-blue-500 font-semibold shadow-sm'
                : 'bg-[#090d16] text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>In-Stock Only ({totalInStock})</span>
          </button>
        </div>

        {/* Alphabet Index Filter */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs text-slate-400 font-semibold mr-1 shrink-0 uppercase tracking-wider text-[11px]">
            Index:
          </span>
          <button
            onClick={() => setSelectedLetter('ALL')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold shrink-0 transition-colors cursor-pointer ${
              selectedLetter === 'ALL'
                ? 'bg-blue-600 text-white'
                : 'bg-[#090d16] text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            All (A-Z)
          </button>
          {alphabetLetters.map((letter) => (
            <button
              key={letter}
              onClick={() => setSelectedLetter(letter)}
              className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-semibold shrink-0 transition-colors cursor-pointer ${
                selectedLetter === letter
                  ? 'bg-blue-600 text-white'
                  : 'bg-[#090d16] text-slate-400 hover:text-white hover:border-slate-700 border border-slate-800'
              }`}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Brands Directory Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="bg-[#0e1422] border border-slate-800 rounded-xl h-44 animate-pulse" />
          ))}
        </div>
      ) : filteredBrands.length === 0 ? (
        <div className="bg-[#0e1422] border border-slate-800 rounded-xl p-12 text-center space-y-4 max-w-xl mx-auto shadow-xl">
          <Globe className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No manufacturers match your filter</h3>
          <p className="text-xs text-slate-400">
            Try adjusting your search query, selecting another country, or resetting the alphabetical index.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedLetter('ALL');
              setSelectedRegion('ALL');
              setFilterInStockOnly(false);
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium cursor-pointer border border-slate-700"
          >
            Reset Catalog Filters
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          {Object.keys(groupedByLetter)
            .sort()
            .map((letter) => (
              <div key={letter} className="space-y-4">
                {/* Alphabet Section Header */}
                <div className="flex items-center gap-3 border-b border-slate-800 pb-2">
                  <span className="w-8 h-8 rounded-lg bg-blue-950/60 border border-blue-800/60 text-blue-300 font-bold flex items-center justify-center text-sm">
                    {letter}
                  </span>
                  <span className="text-xs text-slate-400">
                    {groupedByLetter[letter].length} manufacturer
                    {groupedByLetter[letter].length === 1 ? '' : 's'}
                  </span>
                </div>

                {/* Brands Grid for this Letter */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {groupedByLetter[letter].map((brand) => {
                    const hasInventory = brand.vehicleCount > 0;
                    return (
                      <div
                        key={brand.id}
                        className="bg-[#0e1422] hover:bg-[#121a2c] border border-slate-800 hover:border-slate-700 rounded-xl p-5 flex flex-col justify-between transition-all duration-200 shadow-md group"
                      >
                        <div className="space-y-3">
                          {/* Top Badges */}
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[11px] font-medium text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                              {brand.country || 'Global'}
                            </span>
                            {hasInventory ? (
                              <span className="text-[11px] font-semibold text-emerald-300 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                {brand.vehicleCount} in stock
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-500 bg-slate-950/60 px-2 py-0.5 rounded border border-slate-800/60">
                                Direct Import
                              </span>
                            )}
                          </div>

                          {/* Brand Name & Monogram */}
                          <div className="flex items-start gap-3">
                            <div className="w-11 h-11 rounded-lg bg-[#090d16] border border-slate-800 flex items-center justify-center text-blue-400 font-bold text-base shrink-0 group-hover:border-blue-500/40 transition-colors">
                              {brand.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                                {brand.name}
                              </h3>
                              <p className="text-[11px] text-slate-400">
                                {brand.models.length} supported model{brand.models.length === 1 ? '' : 's'}
                              </p>
                            </div>
                          </div>

                          {/* Inventory / Availability Notice */}
                          <div className="pt-1">
                            {hasInventory ? (
                              <div className="text-xs text-slate-300 flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                <span>{brand.vehicleCount} vehicle{brand.vehicleCount === 1 ? '' : 's'} available in showroom</span>
                              </div>
                            ) : (
                              <div className="text-[11px] text-slate-500 italic">
                                No vehicles currently listed in showroom.
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Card Action Buttons */}
                        <div className="pt-4 border-t border-slate-800/80 mt-4 flex items-center gap-2">
                          {hasInventory ? (
                            <button
                              onClick={() => onNavigate('/cars', { make: brand.name })}
                              className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                            >
                              <span>View Vehicles</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => onNavigate('/import-a-car', { preferredBrand: brand.name })}
                              className="flex-1 py-2 px-3 bg-[#090d16] hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-medium border border-slate-800 transition-colors cursor-pointer flex items-center justify-center gap-1"
                            >
                              <Ship className="w-3 h-3 text-blue-400" />
                              <span>Request Import</span>
                            </button>
                          )}

                          <button
                            onClick={() => setSelectedBrandModal(brand)}
                            title="View supported models & years"
                            className="p-2 text-slate-400 hover:text-white bg-[#090d16] hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors cursor-pointer"
                          >
                            <Info className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
        </div>
      )}

      {/* 4. Direct Import Sourcing Banner */}
      <div className="bg-gradient-to-r from-[#0d131f] via-[#101726] to-[#0d131f] border border-slate-800 rounded-xl p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-300 bg-blue-950/60 border border-blue-800/60 px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Custom Sourcing For Any Brand Worldwide</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Can’t Find Your Preferred Automobile Brand in Stock?
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            {businessName} sources luxury, executive, commercial, and electric vehicles directly from verified auctions and dealership networks across North America, Europe, Asia, and the Middle East.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => onNavigate('/import-a-car')}
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm"
          >
            <Ship className="w-4 h-4" />
            <span>Order Custom Import</span>
          </button>
          <a
            href={buildWhatsAppLink(whatsappNumber, `Hello ${businessName}, I would like to inquire about importing a specific automobile brand.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-5 py-3 bg-[#090d16] hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>WhatsApp Sourcing Desk</span>
          </a>
        </div>
      </div>

      {/* 5. Brand Models Detail Modal */}
      {selectedBrandModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-[#0e1422] border border-slate-800 rounded-xl p-6 shadow-2xl space-y-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#090d16] border border-slate-800 flex items-center justify-center text-blue-400 font-bold text-base">
                  {selectedBrandModal.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <span>{selectedBrandModal.name}</span>
                    <span className="text-xs font-normal text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {selectedBrandModal.country || 'Global'}
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    {selectedBrandModal.vehicleCount} vehicle{selectedBrandModal.vehicleCount === 1 ? '' : 's'} in showroom inventory
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedBrandModal(null)}
                className="p-1.5 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Catalog Models & Supported Years ({selectedBrandModal.models.length})
                </h3>
                {selectedBrandModal.vehicleCount > 0 ? (
                  <button
                    onClick={() => {
                      const brandName = selectedBrandModal.name;
                      setSelectedBrandModal(null);
                      onNavigate('/cars', { make: brandName });
                    }}
                    className="text-xs text-blue-400 hover:text-blue-300 font-medium cursor-pointer flex items-center gap-1"
                  >
                    <span>View Showroom Cars ({selectedBrandModal.vehicleCount})</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <span className="text-[11px] text-slate-500 italic">No inventory currently in showroom</span>
                )}
              </div>

              {selectedBrandModal.models.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-4">
                  No specific models registered under this brand yet. Contact our sourcing desk for any model request.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedBrandModal.models.map((model) => (
                    <div
                      key={model.id}
                      className="p-3 bg-[#090d16] border border-slate-800/80 rounded-lg space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{model.name}</span>
                        {model.category && (
                          <span className="text-[10px] text-blue-300 bg-blue-950/60 border border-blue-900/60 px-1.5 py-0.5 rounded">
                            {model.category}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        Supported: {model.years && model.years.length > 0 ? model.years.join(', ') : 'Any'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedBrandModal(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium cursor-pointer border border-slate-700"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const bName = selectedBrandModal.name;
                  setSelectedBrandModal(null);
                  onNavigate('/import-a-car', { preferredBrand: bName });
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-xs cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <Ship className="w-3.5 h-3.5" />
                <span>Import a {selectedBrandModal.name}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
