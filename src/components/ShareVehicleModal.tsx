import React, { useState } from 'react';
import { X, Check, Copy, MessageSquare, Share2, Facebook, Twitter } from 'lucide-react';
import { Vehicle } from '../types';
import { useDealer } from '../context/DealerContext';
import { formatPrice, generateWhatsAppStatusPost, generateFacebookPost } from '../lib/whatsapp';

interface ShareVehicleModalProps {
  vehicle: Vehicle;
  onClose: () => void;
}

export const ShareVehicleModal: React.FC<ShareVehicleModalProps> = ({ vehicle, onClose }) => {
  const { settings } = useDealer();
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);

  const siteUrl = window.location.origin;
  const vehicleUrl = `${siteUrl}/cars/${vehicle.slug}`;
  const priceFormatted = formatPrice(vehicle.price, vehicle.currency, settings?.currencySymbol || '₦');

  const shareCaption = settings
    ? generateWhatsAppStatusPost(vehicle, settings, siteUrl)
    : `🚘 ${vehicle.year} ${vehicle.make} ${vehicle.model}\n💰 Price: ${priceFormatted}\n\nView details: ${vehicleUrl}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(vehicleUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(shareCaption);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareCaption)}`;
    window.open(waUrl, '_blank');
  };

  const handleFacebookShare = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(vehicleUrl)}`;
    window.open(fbUrl, '_blank');
  };

  const handleTwitterShare = () => {
    const tweet = `Check out this ${vehicle.year} ${vehicle.make} ${vehicle.model} on ${settings?.businessName || 'Paul Smith Autos'}: ${vehicleUrl}`;
    const twUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`;
    window.open(twUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl space-y-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-2 text-white">
            <Share2 className="w-5 h-5 text-blue-400" />
            <h3 className="font-semibold text-base">Share Vehicle</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Vehicle Mini Summary */}
        <div className="flex items-center gap-4 bg-neutral-950 p-3 rounded-xl border border-neutral-800">
          <img
            src={vehicle.images[0] || '/images/hero_car_showroom_1790168724059.jpg'}
            alt={vehicle.title}
            referrerPolicy="no-referrer"
            className="w-16 h-12 object-cover rounded-lg"
          />
          <div>
            <h4 className="text-sm font-semibold text-white">{vehicle.title}</h4>
            <p className="text-xs text-blue-400 font-mono font-semibold">{priceFormatted}</p>
          </div>
        </div>

        {/* Quick Social Action Buttons */}
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={handleWhatsAppShare}
            className="flex flex-col items-center justify-center gap-1.5 p-3 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-800/60 rounded-xl text-emerald-300 text-xs font-medium transition-colors"
          >
            <MessageSquare className="w-5 h-5" />
            <span>WhatsApp</span>
          </button>

          <button
            onClick={handleFacebookShare}
            className="flex flex-col items-center justify-center gap-1.5 p-3 bg-blue-950/40 hover:bg-blue-900/50 border border-blue-800/60 rounded-xl text-blue-300 text-xs font-medium transition-colors"
          >
            <Facebook className="w-5 h-5" />
            <span>Facebook</span>
          </button>

          <button
            onClick={handleTwitterShare}
            className="flex flex-col items-center justify-center gap-1.5 p-3 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 rounded-xl text-neutral-200 text-xs font-medium transition-colors"
          >
            <Twitter className="w-5 h-5" />
            <span>X / Twitter</span>
          </button>
        </div>

        {/* Copy Vehicle Web Link */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-neutral-400">Direct Vehicle URL</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={vehicleUrl}
              className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-300 focus:outline-none"
            />
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-medium transition-colors whitespace-nowrap"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* WhatsApp & Social Pre-Formatted Post */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-neutral-400">Formatted Caption</label>
            <button
              onClick={handleCopyCaption}
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium cursor-pointer"
            >
              {copiedCaption ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedCaption ? 'Copied Caption' : 'Copy Caption'}</span>
            </button>
          </div>
          <textarea
            readOnly
            rows={4}
            value={shareCaption}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-xs text-neutral-300 font-mono resize-none focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};
