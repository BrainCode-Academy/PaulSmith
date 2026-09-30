import React, { useState, useEffect } from 'react';
import { Vehicle } from '../types';
import { VehicleCard } from '../components/VehicleCard';
import { SearchFilter, FilterState } from '../components/SearchFilter';
import { ShareVehicleModal } from '../components/ShareVehicleModal';
import { api } from '../lib/api';
import { Car, Ship, RotateCcw } from 'lucide-react';

interface CarsPageProps {
  initialFilters?: Record<string, string>;
  onNavigate: (path: string) => void;
}

export const CarsPage: React.FC<CarsPageProps> = ({ initialFilters, onNavigate }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [sharingVehicle, setSharingVehicle] = useState<Vehicle | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    make: initialFilters?.make || '',
    model: initialFilters?.model || '',
    year: initialFilters?.year || '',
    condition: initialFilters?.condition || '',
    transmission: initialFilters?.transmission || '',
    fuel: initialFilters?.fuel || '',
    bodyType: initialFilters?.bodyType || '',
    minPrice: initialFilters?.minPrice || '',
    maxPrice: initialFilters?.maxPrice || '',
    search: initialFilters?.search || '',
    status: '',
  });

  useEffect(() => {
    if (initialFilters) {
      setFilters((prev) => ({
        ...prev,
        make: initialFilters.make !== undefined ? initialFilters.make : prev.make,
        model: initialFilters.model !== undefined ? initialFilters.model : prev.model,
        year: initialFilters.year !== undefined ? initialFilters.year : prev.year,
        condition: initialFilters.condition !== undefined ? initialFilters.condition : prev.condition,
        bodyType: initialFilters.bodyType !== undefined ? initialFilters.bodyType : prev.bodyType,
        maxPrice: initialFilters.maxPrice !== undefined ? initialFilters.maxPrice : prev.maxPrice,
      }));
    }
  }, [initialFilters]);

  const loadVehicles = async () => {
    setLoading(true);
    try {
      const data = await api.getVehicles({
        make: filters.make || undefined,
        model: filters.model || undefined,
        year: filters.year ? Number(filters.year) : undefined,
        condition: filters.condition || undefined,
        transmission: filters.transmission || undefined,
        fuel: filters.fuel || undefined,
        bodyType: filters.bodyType || undefined,
        minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
        maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
        status: filters.status || undefined,
        search: filters.search || undefined,
      });
      setVehicles(data);
    } catch (err) {
      console.error('Failed to load showroom vehicles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles();
    api.trackEvent('page_view', undefined, { page: 'cars_showroom' });
  }, [filters]);

  const handleResetFilters = () => {
    setFilters({
      make: '',
      model: '',
      year: '',
      condition: '',
      transmission: '',
      fuel: '',
      bodyType: '',
      minPrice: '',
      maxPrice: '',
      search: '',
      status: '',
    });
  };

  const availableMakes = Array.from(new Set(vehicles.map((v) => v.make))).filter(Boolean);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Vehicle Showroom</h1>
        <p className="text-xs text-neutral-400 mt-1">
          Explore available vehicles ready for inspection and immediate sale.
        </p>
      </div>

      {/* Filter Bar */}
      <SearchFilter
        filters={filters}
        onChange={setFilters}
        onReset={handleResetFilters}
        availableMakes={availableMakes}
        totalResults={vehicles.length}
      />

      {/* Showroom Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-neutral-900 border border-neutral-800 rounded-xl h-80 animate-pulse" />
          ))}
        </div>
      ) : vehicles.length === 0 ? (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-12 text-center space-y-4 max-w-xl mx-auto">
          <Car className="w-12 h-12 text-neutral-600 mx-auto" />
          <h3 className="text-lg font-semibold text-white">No vehicles match your criteria</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            We source vehicles regularly. If you cannot find the exact car you need, submit an import or car finder request.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={handleResetFilters}
              className="w-full sm:w-auto px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
            <button
              onClick={() => onNavigate('/import-a-car')}
              className="w-full sm:w-auto px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Ship className="w-3.5 h-3.5" />
              <span>Import a Car</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((v) => (
            <VehicleCard
              key={v.id}
              vehicle={v}
              onSelect={(slug) => onNavigate(`/cars/${slug}`)}
              onShare={(vehicle) => setSharingVehicle(vehicle)}
            />
          ))}
        </div>
      )}

      {/* Share Vehicle Modal */}
      {sharingVehicle && (
        <ShareVehicleModal vehicle={sharingVehicle} onClose={() => setSharingVehicle(null)} />
      )}
    </div>
  );
};
