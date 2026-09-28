import React from 'react';
import { Search, RotateCcw, SlidersHorizontal } from 'lucide-react';

export interface FilterState {
  make: string;
  model: string;
  year: string;
  condition: string;
  transmission: string;
  fuel: string;
  minPrice: string;
  maxPrice: string;
  search: string;
  status: string;
}

interface SearchFilterProps {
  filters: FilterState;
  onChange: (newFilters: FilterState) => void;
  onReset: () => void;
  availableMakes: string[];
  totalResults: number;
}

export const SearchFilter: React.FC<SearchFilterProps> = ({
  filters,
  onChange,
  onReset,
  availableMakes,
  totalResults,
}) => {
  const updateField = (field: keyof FilterState, value: string) => {
    onChange({
      ...filters,
      [field]: value,
    });
  };

  const hasActiveFilters = Object.entries(filters).some(([k, v]) => k !== 'status' && Boolean(v));

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 sm:p-6 mb-8">
      {/* Search Input */}
      <div className="relative mb-4">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <input
          type="text"
          placeholder="Search by vehicle make, model, or features..."
          value={filters.search}
          onChange={(e) => updateField('search', e.target.value)}
          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 transition-colors"
        />
      </div>

      {/* Filter Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        {/* Make */}
        <div>
          <label className="block text-xs font-medium text-neutral-400 mb-1">Make</label>
          <select
            value={filters.make}
            onChange={(e) => updateField('make', e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
          >
            <option value="">All Makes</option>
            {availableMakes.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Model */}
        <div>
          <label className="block text-xs font-medium text-neutral-400 mb-1">Model</label>
          <input
            type="text"
            placeholder="e.g. Camry"
            value={filters.model}
            onChange={(e) => updateField('model', e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Condition */}
        <div>
          <label className="block text-xs font-medium text-neutral-400 mb-1">Condition</label>
          <select
            value={filters.condition}
            onChange={(e) => updateField('condition', e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
          >
            <option value="">Any Condition</option>
            <option value="Foreign Used">Foreign Used</option>
            <option value="Brand New">Brand New</option>
            <option value="Locally Used">Locally Used</option>
            <option value="In Transit">In Transit</option>
          </select>
        </div>

        {/* Transmission */}
        <div>
          <label className="block text-xs font-medium text-neutral-400 mb-1">Transmission</label>
          <select
            value={filters.transmission}
            onChange={(e) => updateField('transmission', e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
          >
            <option value="">Any Transmission</option>
            <option value="Automatic">Automatic</option>
            <option value="Manual">Manual</option>
          </select>
        </div>

        {/* Fuel */}
        <div>
          <label className="block text-xs font-medium text-neutral-400 mb-1">Fuel Type</label>
          <select
            value={filters.fuel}
            onChange={(e) => updateField('fuel', e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
          >
            <option value="">Any Fuel</option>
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Electric">Electric</option>
          </select>
        </div>

        {/* Year */}
        <div>
          <label className="block text-xs font-medium text-neutral-400 mb-1">Year</label>
          <select
            value={filters.year}
            onChange={(e) => updateField('year', e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
          >
            <option value="">Any Year</option>
            {[2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015].map((y) => (
              <option key={y} value={String(y)}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-xs font-medium text-neutral-400 mb-1">Availability</label>
          <select
            value={filters.status}
            onChange={(e) => updateField('status', e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
          >
            <option value="">All Statuses</option>
            <option value="Available">Available Only</option>
            <option value="Reserved">Reserved</option>
            <option value="In Transit">In Transit</option>
            <option value="Sold">Sold Archive</option>
          </select>
        </div>
      </div>

      {/* Bottom Summary & Reset */}
      <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
        <span>
          Showing <span className="text-white font-medium">{totalResults}</span> vehicle{totalResults === 1 ? '' : 's'}
        </span>

        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>
    </div>
  );
};
