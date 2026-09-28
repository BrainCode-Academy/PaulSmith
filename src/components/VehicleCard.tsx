import React, { useState } from 'react';
import { MessageSquare, ArrowRight, Share2, Eye, ShieldCheck, Gauge } from 'lucide-react';
import { Vehicle } from '../types';
import { useDealer } from '../context/DealerContext';
import { formatPrice, buildWhatsAppLink, getVehicleInquiryMessage } from '../lib/whatsapp';
import { api } from '../lib/api';

interface VehicleCardProps {
  vehicle: Vehicle;
  onSelect: (slug: string) => void;
  onShare?: (vehicle: Vehicle) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onSelect, onShare }) => {
  const { settings } = useDealer();
  const [imageError, setImageError] = useState(false);

  const priceFormatted = formatPrice(
    vehicle.price,
    vehicle.currency,
    settings?.currencySymbol || '₦'
  );

  const whatsappMessage = getVehicleInquiryMessage(vehicle, settings || undefined);
  const whatsappUrl = buildWhatsAppLink(settings?.whatsappNumber || '', whatsappMessage);

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Asynchronously log lead and analytics in background
    api.createLead({
      name: 'Showroom WhatsApp Visitor',
      phone: 'Via WhatsApp Link',
      whatsapp: 'Via WhatsApp Link',
      vehicleId: vehicle.id,
      vehicleTitle: vehicle.title,
      source: 'whatsapp_cta',
      message: `Clicked WhatsApp CTA for ${vehicle.title} (${priceFormatted})`,
    }).catch(() => {});

    api.trackEvent('whatsapp_click', vehicle.id, {
      title: vehicle.title,
      price: vehicle.price,
    });
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onShare) {
      onShare(vehicle);
    }
  };

  const primaryImage = vehicle.images && vehicle.images.length > 0 ? vehicle.images[0] : null;

  return (
    <div
      onClick={() => onSelect(vehicle.slug)}
      className="group relative bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden hover:border-neutral-700 transition-all duration-200 cursor-pointer flex flex-col"
    >
      {/* Vehicle Media Image */}
      <div className="relative aspect-[16/10] w-full bg-neutral-950 overflow-hidden">
        {primaryImage && !imageError ? (
          <img
            src={primaryImage}
            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            referrerPolicy="no-referrer"
            loading="lazy"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-900 text-neutral-500 p-4 text-center">
            <Gauge className="w-10 h-10 mb-2 opacity-40 text-neutral-400" />
            <span className="text-xs text-neutral-400 font-medium">{vehicle.title}</span>
          </div>
        )}

        {/* Real Status Badges - strictly from real DB state */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
          {vehicle.status === 'Sold' && (
            <span className="bg-neutral-900/90 backdrop-blur-sm text-neutral-300 text-[11px] font-semibold px-2.5 py-1 rounded border border-neutral-700 tracking-wide uppercase">
              Sold
            </span>
          )}
          {vehicle.status === 'Reserved' && (
            <span className="bg-amber-950/90 backdrop-blur-sm text-amber-300 text-[11px] font-semibold px-2.5 py-1 rounded border border-amber-800 tracking-wide uppercase">
              Reserved
            </span>
          )}
          {vehicle.status === 'In Transit' && (
            <span className="bg-blue-950/90 backdrop-blur-sm text-blue-300 text-[11px] font-semibold px-2.5 py-1 rounded border border-blue-800 tracking-wide uppercase">
              In Transit
            </span>
          )}
          {vehicle.status === 'Coming Soon' && (
            <span className="bg-purple-950/90 backdrop-blur-sm text-purple-300 text-[11px] font-semibold px-2.5 py-1 rounded border border-purple-800 tracking-wide uppercase">
              Coming Soon
            </span>
          )}
          {vehicle.status === 'Available' && (
            <span className="bg-emerald-950/90 backdrop-blur-sm text-emerald-300 text-[11px] font-semibold px-2.5 py-1 rounded border border-emerald-800 tracking-wide uppercase">
              Available
            </span>
          )}
          {vehicle.featured && (
            <span className="bg-neutral-900/90 backdrop-blur-sm text-amber-400 text-[11px] font-semibold px-2 py-1 rounded border border-neutral-700">
              Featured
            </span>
          )}
        </div>

        {/* Share Quick Button */}
        {onShare && (
          <button
            onClick={handleShareClick}
            title="Share vehicle details"
            className="absolute top-3 right-3 p-2 bg-neutral-950/80 hover:bg-neutral-900 text-neutral-300 hover:text-white rounded-lg border border-neutral-800 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Vehicle Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Metadata: Clean unboxed text with typographic separators */}
          <div className="flex items-center gap-1.5 text-xs text-neutral-400 mb-1.5 flex-wrap">
            <span className="text-white font-medium">{vehicle.year}</span>
            <span aria-hidden="true">·</span>
            <span>{vehicle.condition}</span>
            <span aria-hidden="true">·</span>
            <span>{vehicle.transmission}</span>
            <span aria-hidden="true">·</span>
            <span>{vehicle.fuel}</span>
          </div>

          {/* Brand + Model Title */}
          <h3 className="text-base font-semibold text-white tracking-tight group-hover:text-amber-400 transition-colors line-clamp-1">
            {vehicle.make} {vehicle.model}
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5 line-clamp-1">{vehicle.title}</p>

          {/* Price & Key Specs */}
          <div className="mt-3 flex items-baseline justify-between pt-2 border-t border-neutral-800/60">
            <div>
              <span className="text-xs text-neutral-500 block">Price</span>
              <span className="text-lg font-bold text-amber-400 font-mono tabular-nums">
                {priceFormatted}
              </span>
            </div>
            {vehicle.mileage > 0 && (
              <div className="text-right">
                <span className="text-xs text-neutral-500 block">Mileage</span>
                <span className="text-xs text-neutral-300 font-mono">
                  {vehicle.mileage.toLocaleString()} {vehicle.mileageUnit}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action Controls: CTA VIEW DETAILS and WHATSAPP */}
        <div className="pt-3 border-t border-neutral-800/80 grid grid-cols-2 gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(vehicle.slug);
            }}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-semibold text-neutral-200 bg-neutral-800 hover:bg-neutral-700 hover:text-white rounded-lg transition-colors whitespace-nowrap uppercase tracking-wider"
          >
            <span>View Details</span>
            <ArrowRight className="w-3 h-3" />
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleWhatsAppClick}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap uppercase tracking-wider shadow-sm"
          >
            <MessageSquare className="w-3.5 h-3.5 fill-current" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};
