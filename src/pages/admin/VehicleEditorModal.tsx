import React, { useState, useEffect } from 'react';
import { X, Upload, Plus, Trash2, CheckCircle, Image as ImageIcon } from 'lucide-react';
import { Vehicle, BrandHierarchyResult } from '../../types';
import { api } from '../../lib/api';

interface VehicleEditorModalProps {
  vehicle: Vehicle | null; // null means create new
  onClose: () => void;
  onSaved: () => void;
}

export const VehicleEditorModal: React.FC<VehicleEditorModalProps> = ({ vehicle, onClose, onSaved }) => {
  const isEdit = Boolean(vehicle);

  const [title, setTitle] = useState(vehicle?.title || '');
  const [make, setMake] = useState(vehicle?.make || '');
  const [model, setModel] = useState(vehicle?.model || '');
  const [year, setYear] = useState(vehicle?.year ? String(vehicle.year) : '2023');
  const [price, setPrice] = useState(vehicle?.price ? String(vehicle.price) : '');
  const [mileage, setMileage] = useState(vehicle?.mileage ? String(vehicle.mileage) : '0');
  const [mileageUnit, setMileageUnit] = useState(vehicle?.mileageUnit || 'km');
  const [condition, setCondition] = useState(vehicle?.condition || 'Foreign Used');
  const [transmission, setTransmission] = useState(vehicle?.transmission || 'Automatic');
  const [fuel, setFuel] = useState(vehicle?.fuel || 'Petrol');
  const [driveType, setDriveType] = useState<'4WD' | 'AWD' | 'FWD' | 'RWD'>(vehicle?.driveType || 'AWD');
  const [engine, setEngine] = useState(vehicle?.engine || '');
  const [color, setColor] = useState(vehicle?.color || '');
  const [interiorColor, setInteriorColor] = useState(vehicle?.interiorColor || '');
  const [vin, setVin] = useState(vehicle?.vin || '');
  const [bodyType, setBodyType] = useState<'SUV' | 'Sedan' | 'Coupe' | 'Hatchback' | 'Truck' | 'Crossover'>(vehicle?.bodyType || 'SUV');
  const [location, setLocation] = useState(vehicle?.location || 'Main Showroom');
  const [status, setStatus] = useState<'Available' | 'Reserved' | 'Sold' | 'Coming Soon' | 'In Transit'>(vehicle?.status || 'Available');
  const [featured, setFeatured] = useState(vehicle?.featured || false);
  const [featuredOrder, setFeaturedOrder] = useState<number>(vehicle?.featuredOrder ?? 0);
  const [heroSlideEnabled, setHeroSlideEnabled] = useState<boolean>(vehicle?.heroSlideEnabled !== false);
  const [published, setPublished] = useState(vehicle ? vehicle.published : true);
  const [videoUrl, setVideoUrl] = useState(vehicle?.videoUrl || '');
  const [description, setDescription] = useState(vehicle?.description || '');
  const [features, setFeatures] = useState<string[]>(vehicle?.features || ['Leather Interior', 'Keyless Entry & Push Start', 'Reverse Camera']);
  const [newFeatureText, setNewFeatureText] = useState('');
  const [images, setImages] = useState<string[]>(vehicle?.images || ['/images/hero_car_showroom_1790168724059.jpg']);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [hierarchy, setHierarchy] = useState<BrandHierarchyResult[]>([]);
  const [customMakeMode, setCustomMakeMode] = useState(false);
  const [customModelMode, setCustomModelMode] = useState(false);

  useEffect(() => {
    api.getHierarchy({ includeDisabled: true }).then(setHierarchy).catch(() => {});
  }, []);

  const selectedBrandObj = hierarchy.find(b => b.name.toLowerCase() === make.toLowerCase());
  const suggestedModels = selectedBrandObj?.models || [];
  const selectedModelObj = suggestedModels.find(m => m.name.toLowerCase() === model.toLowerCase());

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-generate title if empty
  const handleAutoTitle = () => {
    if (make && model && year) {
      setTitle(`${year} ${make} ${model}`);
    }
  };

  const handleAddFeature = () => {
    if (newFeatureText.trim()) {
      setFeatures([...features, newFeatureText.trim()]);
      setNewFeatureText('');
    }
  };

  const handleRemoveFeature = (idx: number) => {
    setFeatures(features.filter((_, i) => i !== idx));
  };

  const handleAddImageUrl = () => {
    if (newImageUrl.trim()) {
      setImages([...images, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (idx: number) => {
    setImages(images.filter((_, i) => i !== idx));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64 = reader.result as string;
          const uploadedUrl = await api.uploadImage(base64, file.name);
          setImages((prev) => [...prev, uploadedUrl]);
        } catch (err: any) {
          alert(`Upload failed: ${err.message}`);
        } finally {
          setUploading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !make || !model || !price) {
      setError('Please provide Title, Make, Model, and Price.');
      return;
    }

    setSaving(true);
    setError(null);

    const payload: Partial<Vehicle> = {
      title,
      make,
      model,
      year: Number(year) || new Date().getFullYear(),
      price: Number(price) || 0,
      mileage: Number(mileage) || 0,
      mileageUnit: mileageUnit as any,
      bodyType: bodyType as any,
      condition: condition as any,
      transmission: transmission as any,
      fuel: fuel as any,
      driveType,
      engine,
      color,
      interiorColor,
      vin,
      location,
      status: status as any,
      featured,
      featuredOrder: Number(featuredOrder) || 0,
      heroSlideEnabled,
      published,
      videoUrl,
      description,
      features,
      images: images.length > 0 ? images : ['/images/hero_car_showroom_1790168724059.jpg'],
    };

    try {
      if (isEdit && vehicle) {
        await api.updateVehicle(vehicle.id, payload);
      } else {
        await api.createVehicle(payload);
      }
      onSaved();
    } catch (err: any) {
      setError(err.message || 'Failed to save vehicle');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <h2 className="text-base font-bold text-white tracking-tight">
            {isEdit ? 'Edit Vehicle Listing' : 'Add New Showroom Vehicle'}
          </h2>
          <button onClick={onClose} className="p-1 text-neutral-400 hover:text-white transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-950/40 border border-red-800/80 rounded-lg text-xs text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Main Title & Auto Generator */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-neutral-300">Vehicle Title *</label>
              <button
                type="button"
                onClick={handleAutoTitle}
                className="text-[11px] text-amber-400 hover:text-amber-300 cursor-pointer"
              >
                Auto-generate from make/model
              </button>
            </div>
            <input
              type="text"
              required
              placeholder="e.g. 2024 Toyota Land Cruiser Prado TX-L"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-medium"
            />
          </div>

          {/* Make, Model, Year */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* 1. Make / Brand Selection */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-neutral-300">Make / Brand *</label>
                <button
                  type="button"
                  onClick={() => {
                    setCustomMakeMode(!customMakeMode);
                    if (!customMakeMode) {
                      setCustomModelMode(true);
                    }
                  }}
                  className="text-[11px] text-amber-400 hover:text-amber-300 cursor-pointer"
                >
                  {customMakeMode ? 'Select from list' : '+ Custom brand'}
                </button>
              </div>

              {customMakeMode ? (
                <input
                  type="text"
                  required
                  placeholder="e.g. Lucid"
                  value={make}
                  onChange={(e) => {
                    const val = e.target.value;
                    setMake(val);
                    if (val && model && year) setTitle(`${year} ${val} ${model}`);
                  }}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              ) : (
                <select
                  required
                  value={make}
                  onChange={(e) => {
                    const selectedMake = e.target.value;
                    setMake(selectedMake);
                    setModel(''); // Strict reset when brand changes
                    setCustomModelMode(false);
                    if (selectedMake && year) {
                      setTitle(`${year} ${selectedMake}`);
                    }
                  }}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="">-- Select Brand ({hierarchy.length} available) --</option>
                  {hierarchy.map((b) => (
                    <option key={b.id} value={b.name}>
                      {b.name} ({b.country || 'Global'})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* 2. Model Selection (Strictly Dependent on Selected Brand) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-neutral-300">
                  Model {make ? `(${make})` : ''} *
                </label>
                {make && (
                  <button
                    type="button"
                    onClick={() => setCustomModelMode(!customModelMode)}
                    className="text-[11px] text-amber-400 hover:text-amber-300 cursor-pointer"
                  >
                    {customModelMode ? 'Select brand model' : '+ Unlisted model'}
                  </button>
                )}
              </div>

              {customModelMode || !make || suggestedModels.length === 0 ? (
                <input
                  type="text"
                  required
                  placeholder={make ? `Enter ${make} model name` : 'Select brand first'}
                  disabled={!make}
                  value={model}
                  onChange={(e) => {
                    const val = e.target.value;
                    setModel(val);
                    if (make && year && val) setTitle(`${year} ${make} ${val}`);
                  }}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 disabled:opacity-50"
                />
              ) : (
                <select
                  required
                  value={model}
                  onChange={(e) => {
                    const chosenModelName = e.target.value;
                    if (chosenModelName === '__custom__') {
                      setCustomModelMode(true);
                      setModel('');
                      return;
                    }
                    setModel(chosenModelName);
                    const foundModel = suggestedModels.find((m) => m.name === chosenModelName);
                    if (foundModel) {
                      if (foundModel.category) {
                        setBodyType(foundModel.category as any);
                      }
                      if (foundModel.years && foundModel.years.length > 0 && !year) {
                        setYear(String(foundModel.years[0]));
                      }
                    }
                    if (make && chosenModelName && year) {
                      setTitle(`${year} ${make} ${chosenModelName}`);
                    }
                  }}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="">-- Select {make} Model --</option>
                  {suggestedModels.map((m) => (
                    <option key={m.id} value={m.name}>
                      {m.name} {m.category ? `(${m.category})` : ''}
                    </option>
                  ))}
                  <option value="__custom__">+ Enter custom / unlisted model...</option>
                </select>
              )}

              {/* Supported Years Quick-Pill Badges */}
              {selectedModelObj && selectedModelObj.years && selectedModelObj.years.length > 0 && (
                <div className="flex flex-wrap items-center gap-1 mt-1.5">
                  <span className="text-[10px] text-neutral-400">Years:</span>
                  {selectedModelObj.years.slice(0, 5).map((y) => (
                    <button
                      key={y}
                      type="button"
                      onClick={() => {
                        setYear(String(y));
                        if (make && model) setTitle(`${y} ${make} ${model}`);
                      }}
                      className={`text-[10px] px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                        year === String(y)
                          ? 'bg-amber-400 text-neutral-950 font-bold'
                          : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                      }`}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Year */}
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Year *</label>
              <input
                type="number"
                required
                placeholder="2024"
                value={year}
                onChange={(e) => {
                  setYear(e.target.value);
                  if (make && model) setTitle(`${e.target.value} ${make} ${model}`);
                }}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Price, Mileage, Status */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Price (NGN) *</label>
              <input
                type="number"
                required
                placeholder="78500000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Mileage</label>
              <input
                type="number"
                placeholder="15000"
                value={mileage}
                onChange={(e) => setMileage(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Mileage Unit</label>
              <select
                value={mileageUnit}
                onChange={(e) => setMileageUnit(e.target.value as any)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="km">Kilometers (km)</option>
                <option value="miles">Miles (mi)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Status *</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-semibold"
              >
                <option value="Available">Available</option>
                <option value="In Transit">In Transit</option>
                <option value="Reserved">Reserved</option>
                <option value="Coming Soon">Coming Soon</option>
                <option value="Sold">Sold</option>
              </select>
            </div>
          </div>

          {/* Condition, Body Type, Transmission, Fuel */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Condition</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as any)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="Foreign Used">Foreign Used (Tokunbo)</option>
                <option value="Brand New">Brand New</option>
                <option value="Locally Used">Locally Used</option>
                <option value="In Transit">In Transit</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Body Type</label>
              <select
                value={bodyType}
                onChange={(e) => setBodyType(e.target.value as any)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-medium"
              >
                <option value="SUV">SUV</option>
                <option value="Sedan">Sedan</option>
                <option value="Crossover">Crossover</option>
                <option value="Truck">Truck / Pickup</option>
                <option value="Coupe">Coupe</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Van">Van / MPV</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Transmission</label>
              <select
                value={transmission}
                onChange={(e) => setTransmission(e.target.value as any)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Fuel Type</label>
              <select
                value={fuel}
                onChange={(e) => setFuel(e.target.value as any)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Electric">Electric</option>
              </select>
            </div>
          </div>

          {/* Drivetrain, Engine, Location, VIN */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Drive Type</label>
              <select
                value={driveType}
                onChange={(e) => setDriveType(e.target.value as any)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="AWD">AWD</option>
                <option value="4WD">4WD</option>
                <option value="FWD">FWD</option>
                <option value="RWD">RWD</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Engine Specs</label>
              <input
                type="text"
                placeholder="e.g. 2.4L Turbo 4-Cylinder"
                value={engine}
                onChange={(e) => setEngine(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Showroom Location</label>
              <input
                type="text"
                placeholder="e.g. Main Showroom"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">VIN / Chassis Number</label>
              <input
                type="text"
                placeholder="Optional"
                value={vin}
                onChange={(e) => setVin(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>
          </div>

          {/* Colors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Exterior Color</label>
              <input
                type="text"
                placeholder="e.g. Pearl White"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Interior Color</label>
              <input
                type="text"
                placeholder="e.g. Black Leather"
                value={interiorColor}
                onChange={(e) => setInteriorColor(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Video Walk-around Link */}
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              Video Walk-Around Embed Link (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. https://www.youtube.com/embed/..."
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">Vehicle Description</label>
            <textarea
              rows={4}
              required
              placeholder="Detailed description of the vehicle condition, documentation, origin, and service history..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-amber-400 resize-none leading-relaxed"
            />
          </div>

          {/* Features List */}
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">Key Highlights & Features</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Add feature (e.g. 360-degree camera, heads-up display)..."
                value={newFeatureText}
                onChange={(e) => setNewFeatureText(e.target.value)}
                className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-medium cursor-pointer"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {features.map((f, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-300"
                >
                  <span>{f}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(i)}
                    className="text-neutral-500 hover:text-red-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Photo Gallery & Upload */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-neutral-300">Vehicle Photos</label>
              <label className="cursor-pointer text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1">
                <Upload className="w-3.5 h-3.5" />
                <span>{uploading ? 'Uploading...' : 'Upload Image File'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="Or paste image URL (e.g. /images/prado.jpg or https://...)..."
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
              />
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-medium cursor-pointer"
              >
                Add URL
              </button>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {images.map((img, i) => (
                <div key={i} className="relative aspect-[16/10] bg-neutral-950 rounded-lg overflow-hidden border border-neutral-800 group">
                  <img src={img} alt="Vehicle thumbnail" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i)}
                    className="absolute top-1.5 right-1.5 p-1 bg-black/80 hover:bg-red-900 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Status & Featured Toggles */}
          <div className="pt-2 border-t border-neutral-800 space-y-3 text-xs">
            <div className="flex flex-wrap items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer text-neutral-300">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-400 bg-neutral-950 border-neutral-800"
                />
                <span className="font-semibold text-amber-400">Featured on Homepage Hero Slider</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-neutral-300">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-400 bg-neutral-950 border-neutral-800"
                />
                <span>Published (Visible to public)</span>
              </label>
            </div>

            {featured && (
              <div className="flex flex-wrap items-center gap-4 bg-neutral-950 border border-neutral-800/80 rounded-lg p-3">
                <label className="flex items-center gap-2 cursor-pointer text-neutral-300">
                  <input
                    type="checkbox"
                    checked={heroSlideEnabled}
                    onChange={(e) => setHeroSlideEnabled(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-400 bg-neutral-950 border-neutral-800"
                  />
                  <span>Active in Slider Rotation</span>
                </label>

                <div className="flex items-center gap-2">
                  <span className="text-neutral-400">Slide Order:</span>
                  <input
                    type="number"
                    min="0"
                    value={featuredOrder}
                    onChange={(e) => setFeaturedOrder(parseInt(e.target.value, 10) || 0)}
                    className="w-16 bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-white font-mono text-center"
                  />
                  <span className="text-[11px] text-neutral-500">(0 = Primary / First)</span>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-neutral-950 font-bold rounded-lg text-xs cursor-pointer"
              >
                {saving ? 'Saving...' : isEdit ? 'Update Vehicle' : 'Add Vehicle'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
