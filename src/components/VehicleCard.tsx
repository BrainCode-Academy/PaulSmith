import React, { useState } from 'react';
import { MessageSquare, ArrowRight, Share2, Gauge } from 'lucide-react';
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
      className="group relative bg-[#0e1422] border border-slate-800/80 rounded-xl overflow-hidden hover:border-slate-700 hover:shadow-xl hover:shadow-black/40 transition-all duration-200 cursor-pointer flex flex-col"
    >
      {/* Vehicle Media Image */}
      <div className="relative aspect-[16/10] w-full bg-slate-950 overflow-hidden">
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
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 text-slate-500 p-4 text-center">
            <Gauge className="w-10 h-10 mb-2 opacity-30 text-slate-400" />
            <span className="text-xs text-slate-400 font-medium">{vehicle.title}</span>
          </div>
        )}

        {/* Real Status Badges - strictly from real DB state */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
          {vehicle.status === 'Sold' && (
            <span className="bg-slate-950/85 backdrop-blur-sm text-slate-400 text-[11px] font-semibold px-2 py-0.5 rounded border border-slate-700/80 tracking-wide uppercase">
              Sold
            </span>
          )}
          {vehicle.status === 'Reserved' && (
            <span className="bg-amber-950/85 backdrop-blur-sm text-amber-200 text-[11px] font-semibold px-2 py-0.5 rounded border border-amber-800/60 tracking-wide uppercase">
              Reserved
            </span>
          )}
          {vehicle.status === 'In Transit' && (
            <span className="bg-blue-950/85 backdrop-blur-sm text-blue-200 text-[11px] font-semibold px-2 py-0.5 rounded border border-blue-800/60 tracking-wide uppercase">
              In Transit
            </span>
          )}
          {vehicle.status === 'Coming Soon' && (
            <span className="bg-indigo-950/85 backdrop-blur-sm text-indigo-200 text-[11px] font-semibold px-2 py-0.5 rounded border border-indigo-800/60 tracking-wide uppercase">
              Coming Soon
            </span>
          )}
          {vehicle.status === 'Available' && (
            <span className="bg-emerald-950/85 backdrop-blur-sm text-emerald-300 text-[11px] font-semibold px-2 py-0.5 rounded border border-emerald-800/60 tracking-wide uppercase flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
              Available
            </span>
          )}
          {vehicle.featured && (
            <span className="bg-slate-900/90 backdrop-blur-sm text-blue-300 text-[11px] font-semibold px-2 py-0.5 rounded border border-blue-900/60">
              Featured
            </span>
          )}
        </div>

        {/* Share Quick Button */}
        {onShare && (
          <button
            onClick={handleShareClick}
            title="Share vehicle details"
            className="absolute top-3 right-3 p-2 bg-slate-950/80 hover:bg-slate-900 text-slate-300 hover:text-white rounded-lg border border-slate-800 transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Vehicle Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Metadata: Clean unboxed text with typographic separators */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1.5 flex-wrap">
            <span className="text-white font-medium">{vehicle.year}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>{vehicle.condition}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>{vehicle.transmission}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>{vehicle.fuel}</span>
          </div>

          {/* Brand + Model Title */}
          <h3 className="text-base font-semibold text-white tracking-tight group-hover:text-blue-400 transition-colors line-clamp-1">
            {vehicle.make} {vehicle.model}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{vehicle.title}</p>

          {/* Price & Key Specs */}
          <div className="mt-3 flex items-baseline justify-between pt-2 border-t border-slate-800/80">
            <div>
              <span className="text-[11px] text-slate-500 block uppercase tracking-wider font-medium">Price</span>
              <span className="text-lg font-bold text-white font-mono tracking-tight tabular-nums">
                {priceFormatted}
              </span>
            </div>
            {vehicle.mileage > 0 && (
              <div className="text-right">
                <span className="text-[11px] text-slate-500 block uppercase tracking-wider font-medium">Mileage</span>
                <span className="text-xs text-slate-300 font-mono">
                  {vehicle.mileage.toLocaleString()} {vehicle.mileageUnit}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action Controls: CTA VIEW DETAILS and WHATSAPP */}
        <div className="pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(vehicle.slug);
            }}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700 hover:text-white border border-slate-700/60 rounded-lg transition-colors whitespace-nowrap cursor-pointer uppercase tracking-wider"
          >
            <span>View Details</span>
            <ArrowRight className="w-3 h-3 text-slate-400" />
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleWhatsAppClick}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors whitespace-nowrap uppercase tracking-wider shadow-sm shadow-emerald-950/40"
          >
            <MessageSquare className="w-3.5 h-3.5 fill-current" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};
