import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Phone,
  Calendar,
  Share2,
  Tag,
  CheckCircle,
  Video,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Gauge,
  MapPin,
  Clock,
  Car,
  Check,
  Facebook,
  Copy,
  ReceiptText,
} from 'lucide-react';
import { Vehicle } from '../types';
import { useDealer } from '../context/DealerContext';
import { api } from '../lib/api';
import {
  formatPrice,
  buildWhatsAppLink,
  getVehicleInquiryMessage,
  getVehicleVideoRequestMessage,
} from '../lib/whatsapp';
import { VehicleCard } from '../components/VehicleCard';
import { ShareVehicleModal } from '../components/ShareVehicleModal';
import { LeadInquiryModal } from '../components/LeadInquiryModal';
import { QuickQuoteModal } from '../components/QuickQuoteModal';

interface VehicleDetailPageProps {
  slug: string;
  onNavigate: (path: string, params?: Record<string, string>) => void;
}

export const VehicleDetailPage: React.FC<VehicleDetailPageProps> = ({ slug, onNavigate }) => {
  const { settings } = useDealer();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [relatedVehicles, setRelatedVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  // Modals state
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [inquiryModalMode, setInquiryModalMode] = useState<'inquiry' | 'inspection' | 'offer' | null>(null);
  const [isQuickQuoteOpen, setIsQuickQuoteOpen] = useState(false);

  useEffect(() => {
    async function fetchVehicle() {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getVehicle(slug);
        setVehicle(data);
        document.title = `${data.year} ${data.make} ${data.model} - ${settings?.businessName || 'Paul Smith Autos'}`;

        // Fetch related vehicles
        const allVehicles = await api.getVehicles();
        const related = allVehicles
          .filter((v) => v.id !== data.id && (v.make === data.make || v.bodyType === data.bodyType))
          .slice(0, 3);
        setRelatedVehicles(related);
      } catch (err: any) {
        setError(err.message || 'Vehicle not found');
      } finally {
        setLoading(false);
      }
    }
    fetchVehicle();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug, settings?.businessName]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-pulse">
          <div className="lg:col-span-8 bg-[#0e1422] h-96 rounded-xl" />
          <div className="lg:col-span-4 bg-[#0e1422] h-96 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <Car className="w-16 h-16 text-slate-600 mx-auto" />
        <h2 className="text-2xl font-bold text-white">Vehicle Not Found</h2>
        <p className="text-xs text-slate-400">
          The requested vehicle may have been sold or removed from inventory.
        </p>
        <button
          onClick={() => onNavigate('/cars')}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-xs transition-colors cursor-pointer"
        >
          Return to Showroom
        </button>
      </div>
    );
  }

  const businessName = settings?.businessName || 'Paul Smith Autos';
  const dealerPhone = settings?.phone || '08037781788';
  const dealerWhatsApp = settings?.whatsappNumber || '08037781788';

  const priceFormatted = formatPrice(
    vehicle.price,
    vehicle.currency,
    settings?.currencySymbol || '₦'
  );

  const images = vehicle.images && vehicle.images.length > 0
    ? vehicle.images
    : ['/images/hero_car_showroom_1790168724059.jpg'];

  const whatsappInquiryUrl = buildWhatsAppLink(
    dealerWhatsApp,
    getVehicleInquiryMessage(vehicle, settings || undefined)
  );

  const whatsappVideoUrl = buildWhatsAppLink(
    dealerWhatsApp,
    getVehicleVideoRequestMessage(vehicle)
  );

  const handleWhatsAppAction = (actionType: string) => {
    api.createLead({
      name: 'Showroom Vehicle Visitor',
      phone: 'Via WhatsApp Action',
      whatsapp: 'Via WhatsApp Action',
      vehicleId: vehicle.id,
      vehicleTitle: vehicle.title,
      source: 'vehicle_detail',
      message: `Direct ${actionType} action for ${vehicle.title}`,
    }).catch(() => {});

    api.trackEvent('whatsapp_click', vehicle.id, { action: actionType });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const shareOnFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  const shareOnWhatsApp = () => {
    const text = encodeURIComponent(
      `Check out this ${vehicle.year} ${vehicle.make} ${vehicle.model} (${priceFormatted}) at ${businessName}: ${window.location.href}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 sm:pb-8 space-y-10">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <button
          onClick={() => onNavigate('/')}
          className="hover:text-white transition-colors cursor-pointer"
        >
          Home
        </button>
        <span aria-hidden="true">/</span>
        <button
          onClick={() => onNavigate('/cars')}
          className="hover:text-white transition-colors cursor-pointer"
        >
          Cars
        </button>
        <span aria-hidden="true">/</span>
        <button
          onClick={() => onNavigate('/cars', { make: vehicle.make })}
          className="hover:text-white transition-colors cursor-pointer"
        >
          {vehicle.make}
        </button>
        <span aria-hidden="true">/</span>
        <span className="text-white truncate max-w-xs">{vehicle.year} {vehicle.model}</span>
      </div>

      {/* Main Grid: Gallery & Digital Showroom Purchase Module */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Gallery & Details */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-8">
          {/* IMAGE / VIDEO GALLERY */}
          <div className="space-y-3">
            <div className="relative aspect-[16/10] bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-2xl">
              <img
                src={images[selectedImageIndex]}
                alt={`${vehicle.title} photo ${selectedImageIndex + 1}`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />

              {/* Status Badge overlay */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className={`px-3 py-1 text-xs font-bold rounded uppercase tracking-wider ${
                  vehicle.status === 'Available'
                    ? 'bg-emerald-600 text-white'
                    : vehicle.status === 'Sold'
                    ? 'bg-slate-800 text-slate-300'
                    : 'bg-amber-600 text-white'
                }`}>
                  {vehicle.status}
                </span>
                {vehicle.featured && (
                  <span className="px-2.5 py-1 text-xs font-semibold bg-slate-900/90 text-blue-300 rounded border border-blue-900/60">
                    Featured
                  </span>
                )}
              </div>

              {/* Carousel navigation controls if multiple images */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-slate-950/80 hover:bg-slate-900 text-white rounded-full border border-slate-700 transition-colors cursor-pointer"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-slate-950/80 hover:bg-slate-900 text-white rounded-full border border-slate-700 transition-colors cursor-pointer"
                    aria-label="Next photo"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              <div className="absolute bottom-3 right-3 bg-slate-950/80 px-2.5 py-1 rounded text-xs text-slate-300 font-mono">
                {selectedImageIndex + 1} / {images.length}
              </div>
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                      selectedImageIndex === idx
                        ? 'border-blue-500 opacity-100 shadow-sm'
                        : 'border-slate-800 opacity-60 hover:opacity-90'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* VEHICLE OVERVIEW */}
          <div className="bg-[#0e1422] border border-slate-800 rounded-xl p-6 sm:p-8 space-y-6">
            <h2 className="text-xl font-bold text-white tracking-tight border-b border-slate-800 pb-3">
              Vehicle Overview
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-5 gap-x-6 text-xs">
              <div>
                <span className="text-slate-500 block mb-1">Brand</span>
                <span className="text-white font-semibold text-sm">{vehicle.make}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">Model</span>
                <span className="text-white font-semibold text-sm">{vehicle.model}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">Year</span>
                <span className="text-white font-semibold text-sm">{vehicle.year}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">Mileage</span>
                <span className="text-white font-semibold text-sm font-mono">
                  {vehicle.mileage ? `${vehicle.mileage.toLocaleString()} ${vehicle.mileageUnit}` : 'Undisclosed'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">Transmission</span>
                <span className="text-white font-semibold text-sm">{vehicle.transmission}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">Fuel</span>
                <span className="text-white font-semibold text-sm">{vehicle.fuel}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">Condition</span>
                <span className="text-white font-semibold text-sm">{vehicle.condition}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">Body Type</span>
                <span className="text-white font-semibold text-sm">{vehicle.bodyType}</span>
              </div>
            </div>
          </div>

          {/* SPECIFICATIONS */}
          <div className="bg-[#0e1422] border border-slate-800 rounded-xl p-6 sm:p-8 space-y-6">
            <h2 className="text-xl font-bold text-white tracking-tight border-b border-slate-800 pb-3">
              Specifications
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-6 text-xs">
              <div>
                <span className="text-slate-500 block mb-0.5">Drivetrain</span>
                <span className="text-white font-semibold">{vehicle.driveType}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">Engine</span>
                <span className="text-white font-semibold">{vehicle.engine || 'Direct Specs'}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">Exterior Color</span>
                <span className="text-white font-semibold">{vehicle.color || 'Documented'}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">Interior Color</span>
                <span className="text-white font-semibold">{vehicle.interiorColor || 'Documented'}</span>
              </div>
              {vehicle.vin && (
                <div className="sm:col-span-2">
                  <span className="text-slate-500 block mb-0.5">VIN / Chassis Number</span>
                  <span className="text-slate-300 font-mono text-xs">{vehicle.vin}</span>
                </div>
              )}
            </div>
          </div>

          {/* FEATURES */}
          {vehicle.features && vehicle.features.length > 0 && (
            <div className="bg-[#0e1422] border border-slate-800 rounded-xl p-6 sm:p-8 space-y-4">
              <h2 className="text-xl font-bold text-white tracking-tight border-b border-slate-800 pb-3">
                Features & Equipment
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {vehicle.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs text-slate-300">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DESCRIPTION */}
          <div className="bg-[#0e1422] border border-slate-800 rounded-xl p-6 sm:p-8 space-y-4">
            <h2 className="text-xl font-bold text-white tracking-tight border-b border-slate-800 pb-3">
              Description
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {vehicle.description}
            </p>
          </div>

          {/* VIDEO */}
          {vehicle.videoUrl && (
            <div className="bg-[#0e1422] border border-slate-800 rounded-xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2 text-white font-semibold text-base border-b border-slate-800 pb-3">
                <Video className="w-5 h-5 text-blue-400" />
                <span>Vehicle Video Walk-Around</span>
              </div>
              <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                <iframe
                  src={vehicle.videoUrl}
                  title={`${vehicle.title} video`}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Contiguous Showroom Purchase & Contact Module */}
        <div className="lg:col-span-5 xl:col-span-4 sticky top-24 space-y-6">
          <div className="bg-[#0e1422] border border-slate-800 rounded-xl p-6 sm:p-7 shadow-2xl space-y-6">
            {/* Header info */}
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                <span>{vehicle.year}</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span>{vehicle.condition}</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className={`font-semibold uppercase tracking-wider ${
                  vehicle.status === 'Available' ? 'text-emerald-400' : 'text-slate-400'
                }`}>
                  {vehicle.status}
                </span>
              </div>

              <h1 className="text-2xl font-bold text-white tracking-tight leading-snug">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h1>

              {vehicle.location && (
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2">
                  <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>{vehicle.location}</span>
                </div>
              )}
            </div>

            {/* Price Box */}
            <div className="p-4 bg-[#090d16] rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-500 uppercase tracking-wider block mb-1 font-medium">Showroom Listed Price</span>
              <div className="text-2xl sm:text-3xl font-bold text-white font-mono tracking-tight tabular-nums">
                {priceFormatted}
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="space-y-3">
              {/* Dual Primary CTA: Chat on WhatsApp & Quick Quote */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <a
                  href={whatsappInquiryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleWhatsAppAction('inquiry')}
                  className="py-3.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-xs sm:text-sm transition-all shadow-md shadow-emerald-950/40 flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider text-center"
                >
                  <MessageSquare className="w-4 h-4 fill-current shrink-0" />
                  <span>Chat on WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={() => setIsQuickQuoteOpen(true)}
                  className="py-3.5 px-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-xs sm:text-sm transition-all shadow-md shadow-blue-950/40 flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider text-center"
                >
                  <ReceiptText className="w-4 h-4 shrink-0" />
                  <span>Quick Quote</span>
                </button>
              </div>

              {/* Request Video Walk-Around */}
              <a
                href={whatsappVideoUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleWhatsAppAction('video_request')}
                className="w-full py-2.5 px-4 bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/60 font-medium rounded-lg text-xs transition-colors flex items-center justify-center gap-2"
              >
                <Video className="w-4 h-4 text-blue-400" />
                <span>Request Walk-Around Video</span>
              </a>

              {/* Schedule Inspection CTA */}
              {settings?.inspectionOffered !== false && (
                <button
                  onClick={() => setInquiryModalMode('inspection')}
                  className="w-full py-2.5 px-4 bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/60 font-medium rounded-lg text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  <span>Schedule Physical Inspection</span>
                </button>
              )}

              {/* Make a Purchase Offer */}
              <button
                onClick={() => setInquiryModalMode('offer')}
                className="w-full py-2.5 px-4 bg-[#090d16] hover:bg-slate-800 border border-slate-700/80 text-slate-300 font-medium rounded-lg text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Tag className="w-4 h-4 text-blue-400" />
                <span>Make a Purchase Offer</span>
              </button>

              {/* Call Dealer */}
              <a
                href={`tel:${dealerPhone}`}
                className="w-full py-2.5 px-4 bg-[#090d16] hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white font-medium rounded-lg text-xs transition-colors flex items-center justify-center gap-2"
              >
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>Call Dealer: {dealerPhone}</span>
              </a>
            </div>

            {/* DEALER INFORMATION & TRUST */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>Verified Dealership Standard</span>
              </div>
              <div className="flex items-center gap-3">
                <img
                  src={settings?.ceoImage || '/WhatsApp Image 2026-09-29 at 8.55.15 AM.jpeg'}
                  alt="Paul Smith"
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-lg object-cover object-center border border-slate-700"
                />
                <div>
                  <span className="text-sm font-bold text-white block">{businessName}</span>
                  <span className="text-xs text-slate-400 block">CEO: Paul Smith ({dealerPhone})</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Sound engine & transmission verification guaranteed. Open mechanic pre-purchase inspection policy.
              </p>
            </div>

            {/* INTERESTED? */}
            <div className="p-4 bg-[#090d16] rounded-xl border border-slate-800 text-center space-y-2">
              <span className="text-xs font-semibold text-white block uppercase tracking-wider">
                Interested in this car?
              </span>
              <p className="text-xs text-slate-400">
                Chat with Paul Smith Autos directly on WhatsApp or call our executive line.
              </p>
              <div className="text-sm font-bold text-blue-400 font-mono">
                {dealerPhone}
              </div>
            </div>

            {/* SHARE THIS VEHICLE */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <span className="text-xs font-semibold text-slate-300 block">
                Share This Vehicle
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={shareOnWhatsApp}
                  className="py-2 px-2 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800/80 text-emerald-300 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 fill-current" />
                  <span>WhatsApp</span>
                </button>
                <button
                  onClick={shareOnFacebook}
                  className="py-2 px-2 bg-blue-950/60 hover:bg-blue-900/60 border border-blue-800/80 text-blue-300 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Facebook className="w-3.5 h-3.5 fill-current" />
                  <span>Facebook</span>
                </button>
                <button
                  onClick={handleCopyLink}
                  className="py-2 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-700/60"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RELATED VEHICLES */}
      {relatedVehicles.length > 0 && (
        <section className="pt-10 border-t border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Related Vehicles</h2>
              <p className="text-xs text-slate-400 mt-1">
                Other available options matching {vehicle.make} or {vehicle.bodyType} category.
              </p>
            </div>
            <button
              onClick={() => onNavigate('/cars')}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
            >
              View All Showroom Cars →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedVehicles.map((rel) => (
              <VehicleCard
                key={rel.id}
                vehicle={rel}
                onSelect={(s) => onNavigate(`/cars/${s}`)}
                onShare={() => setShareModalOpen(true)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Share Modal */}
      {shareModalOpen && (
        <ShareVehicleModal vehicle={vehicle} onClose={() => setShareModalOpen(false)} />
      )}

      {/* Lead Inquiry Modal */}
      {inquiryModalMode && (
        <LeadInquiryModal
          vehicle={vehicle}
          mode={inquiryModalMode}
          onClose={() => setInquiryModalMode(null)}
        />
      )}

      {/* Quick Quote Pricing Modal */}
      {isQuickQuoteOpen && (
        <QuickQuoteModal
          vehicle={vehicle}
          onClose={() => setIsQuickQuoteOpen(false)}
        />
      )}

      {/* Mobile Sticky Quick Action Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0e1422]/95 backdrop-blur-md border-t border-slate-800 p-2.5 px-3 flex items-center gap-2 shadow-2xl">
        <a
          href={`tel:${dealerPhone}`}
          className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg flex items-center justify-center shrink-0 border border-slate-700/60"
          aria-label="Call Dealership"
        >
          <Phone className="w-4 h-4 text-slate-300" />
        </a>

        <button
          type="button"
          onClick={() => setIsQuickQuoteOpen(true)}
          className="flex-1 py-3 px-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-blue-950/40 uppercase tracking-wider"
        >
          <ReceiptText className="w-3.5 h-3.5 shrink-0" />
          <span>Quick Quote</span>
        </button>

        <a
          href={whatsappInquiryUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleWhatsAppAction('mobile_sticky_inquiry')}
          className="flex-1 py-3 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950/40 uppercase tracking-wider"
        >
          <MessageSquare className="w-3.5 h-3.5 fill-current shrink-0" />
          <span>WhatsApp</span>
        </a>
      </div>
    </div>
  );
};
