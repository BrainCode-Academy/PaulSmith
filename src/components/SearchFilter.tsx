import React, { useEffect, useState } from 'react';
import { Search, RotateCcw } from 'lucide-react';
import { api } from '../lib/api';
import { BrandHierarchyResult } from '../types';

export interface FilterState {
  make: string;
  model: string;
  year: string;
  condition: string;
  transmission: string;
  fuel: string;
  bodyType: string;
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
  const [hierarchy, setHierarchy] = useState<BrandHierarchyResult[]>([]);

  useEffect(() => {
    api.getHierarchy().then(setHierarchy).catch(() => {});
  }, []);

  const updateField = (field: keyof FilterState, value: string) => {
    if (field === 'make') {
      // strict model reset when brand changes
      onChange({
        ...filters,
        make: value,
        model: '',
      });
    } else {
      onChange({
        ...filters,
        [field]: value,
      });
    }
  };

  const hasActiveFilters = Object.entries(filters).some(([k, v]) => k !== 'status' && Boolean(v));

  // Determine models for selected brand from database hierarchy
  const activeBrandObj = hierarchy.find(
    (b) => b.name.toLowerCase() === filters.make.toLowerCase()
  );
  const brandModels = activeBrandObj?.models || [];

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 sm:p-6 mb-8">
      {/* Search Input */}
      <div className="relative mb-4">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <input
          type="text"
          placeholder="Search by vehicle make, model, features, or specs..."
          value={filters.search}
          onChange={(e) => updateField('search', e.target.value)}
          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 transition-colors"
        />
      </div>

      {/* Filter Grid - Supports Brand, Model, Year, Price, Condition, Transmission, Fuel, Body Type, Availability */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-3">
        {/* 1. Make / Brand (Dynamically from real database inventory) */}
        <div>
          <label className="block text-xs font-medium text-neutral-400 mb-1">Make / Brand</label>
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

        {/* 2. Model (Dynamically filtered by selected brand) */}
        <div>
          <label className="block text-xs font-medium text-neutral-400 mb-1">Model</label>
          {brandModels.length > 0 ? (
            <select
              value={filters.model}
              onChange={(e) => updateField('model', e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
            >
              <option value="">All Models</option>
              {brandModels.map((m) => (
                <option key={m.id} value={m.name}>
                  {m.name}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              placeholder="e.g. Camry"
              value={filters.model}
              onChange={(e) => updateField('model', e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          )}
        </div>

        {/* 3. Year */}
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

        {/* 4. Body Type */}
        <div>
          <label className="block text-xs font-medium text-neutral-400 mb-1">Body Type</label>
          <select
            value={filters.bodyType}
            onChange={(e) => updateField('bodyType', e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
          >
            <option value="">Any Body Type</option>
            <option value="SUV">SUV</option>
            <option value="Sedan">Sedan</option>
            <option value="Crossover">Crossover</option>
            <option value="Truck">Truck / Pickup</option>
            <option value="Coupe">Coupe</option>
            <option value="Hatchback">Hatchback</option>
            <option value="Van">Van</option>
          </select>
        </div>

        {/* 5. Condition */}
        <div>
          <label className="block text-xs font-medium text-neutral-400 mb-1">Condition</label>
          <select
            value={filters.condition}
            onChange={(e) => updateField('condition', e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
          >
            <option value="">Any Condition</option>
            <option value="Foreign Used">Foreign Used (Tokunbo)</option>
            <option value="Brand New">Brand New</option>
            <option value="Locally Used">Locally Used</option>
            <option value="In Transit">In Transit</option>
          </select>
        </div>

        {/* 6. Transmission */}
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

        {/* 7. Fuel */}
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

        {/* 8. Availability */}
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

      {/* Budget / Price filter row */}
      <div className="mt-3 pt-3 border-t border-neutral-800/60 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-neutral-400 font-medium">Max Budget:</span>
          {[
            { label: 'Any', value: '' },
            { label: 'Up to ₦35M', value: '35000000' },
            { label: 'Up to ₦60M', value: '60000000' },
            { label: 'Up to ₦90M', value: '90000000' },
            { label: 'Up to ₦150M', value: '150000000' },
          ].map((b) => (
            <button
              key={b.label}
              type="button"
              onClick={() => updateField('maxPrice', b.value)}
              className={`px-2.5 py-1 rounded-lg cursor-pointer transition-colors text-[11px] ${
                filters.maxPrice === b.value
                  ? 'bg-amber-400 text-neutral-950 font-bold'
                  : 'bg-neutral-950 text-neutral-300 hover:bg-neutral-800 border border-neutral-800'
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>

        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 transition-colors cursor-pointer text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        )}
      </div>

      {/* Bottom Summary */}
      <div className="mt-3 pt-2 border-t border-neutral-800/40 text-[11px] text-neutral-400">
        Showing <span className="text-white font-medium">{totalResults}</span> vehicle{totalResults === 1 ? '' : 's'} matching criteria
      </div>
    </div>
  );
};
