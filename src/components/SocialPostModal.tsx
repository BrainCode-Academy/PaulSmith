import React, { useState } from 'react';
import { X, Copy, Check, Share2, Sparkles, MessageSquare, Facebook, Instagram } from 'lucide-react';
import { Vehicle } from '../types';
import { useDealer } from '../context/DealerContext';
import {
  formatPrice,
  generateWhatsAppStatusPost,
  generateWhatsAppGroupPost,
  generateFacebookPost,
  generateInstagramCaption,
} from '../lib/whatsapp';

interface SocialPostModalProps {
  vehicle: Vehicle;
  onClose: () => void;
}

export const SocialPostModal: React.FC<SocialPostModalProps> = ({ vehicle, onClose }) => {
  const { settings } = useDealer();
  const [activeTab, setActiveTab] = useState<'whatsapp_status' | 'whatsapp_group' | 'facebook' | 'instagram' | 'card'>('whatsapp_status');
  const [copied, setCopied] = useState(false);

  const siteUrl = window.location.origin;
  const currentSettings = settings || {
    id: 'default',
    businessName: 'Paul Smith Autos',
    tagline: 'Verified Automobile Showroom & Direct Import Sourcing',
    whatsappNumber: '08037781788',
    whatsappGroupLink: '',
    phone: '',
    email: '',
    address: '',
    businessDescription: '',
    importCountries: ['China'],
    currency: 'NGN',
    currencySymbol: '₦',
    facebook: '',
    instagram: '',
    tiktok: '',
    businessHours: '',
    inspectionOffered: true,
    sourcingProcess: [],
    updatedAt: '',
  };

  const statusPost = generateWhatsAppStatusPost(vehicle, currentSettings, siteUrl);
  const groupPost = generateWhatsAppGroupPost(vehicle, currentSettings, siteUrl);
  const fbPost = generateFacebookPost(vehicle, currentSettings, siteUrl);
  const igPost = generateInstagramCaption(vehicle, currentSettings, siteUrl);

  const currentContent = {
    whatsapp_status: statusPost,
    whatsapp_group: groupPost,
    facebook: fbPost,
    instagram: igPost,
    card: '',
  }[activeTab];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWhatsApp = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(currentContent)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="font-semibold text-base text-white">Generate Social & WhatsApp Posts</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Vehicle Reference Banner */}
        <div className="flex items-center gap-3 bg-neutral-950 p-3 rounded-xl border border-neutral-800">
          <img
            src={vehicle.images[0] || '/images/hero_car_showroom_1790168724059.jpg'}
            alt={vehicle.title}
            referrerPolicy="no-referrer"
            className="w-16 h-12 object-cover rounded-lg"
          />
          <div>
            <h4 className="text-sm font-semibold text-white">{vehicle.title}</h4>
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <span className="text-amber-400 font-mono font-medium">
                {formatPrice(vehicle.price, vehicle.currency, currentSettings.currencySymbol)}
              </span>
              <span>·</span>
              <span>{vehicle.condition}</span>
              <span>·</span>
              <span>{vehicle.transmission}</span>
            </div>
          </div>
        </div>

        {/* Tab Switcher (Segmented buttons - allowed per frontend design constitution) */}
        <div className="flex items-center gap-1.5 p-1 bg-neutral-950 rounded-xl overflow-x-auto border border-neutral-800">
          <button
            onClick={() => setActiveTab('whatsapp_status')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'whatsapp_status'
                ? 'bg-neutral-800 text-amber-400 font-semibold shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            WhatsApp Status
          </button>
          <button
            onClick={() => setActiveTab('whatsapp_group')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'whatsapp_group'
                ? 'bg-neutral-800 text-amber-400 font-semibold shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            WhatsApp Group Broadcast
          </button>
          <button
            onClick={() => setActiveTab('facebook')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'facebook'
                ? 'bg-neutral-800 text-amber-400 font-semibold shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Facebook Post
          </button>
          <button
            onClick={() => setActiveTab('instagram')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'instagram'
                ? 'bg-neutral-800 text-amber-400 font-semibold shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Instagram Caption
          </button>
          <button
            onClick={() => setActiveTab('card')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'card'
                ? 'bg-neutral-800 text-amber-400 font-semibold shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Shareable Card
          </button>
        </div>

        {/* Content Preview */}
        {activeTab !== 'card' ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-neutral-400">
              <span>Ready to copy & paste:</span>
              <div className="flex items-center gap-2">
                {(activeTab === 'whatsapp_status' || activeTab === 'whatsapp_group') && (
                  <button
                    onClick={handleOpenWhatsApp}
                    className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors font-medium cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Open in WhatsApp</span>
                  </button>
                )}
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-amber-400 hover:text-amber-300 transition-colors font-semibold cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy Post Text'}</span>
                </button>
              </div>
            </div>

            <textarea
              readOnly
              rows={9}
              value={currentContent}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-xs font-mono text-neutral-200 resize-none focus:outline-none leading-relaxed"
            />
          </div>
        ) : (
          /* Shareable Visual Vehicle Card */
          <div className="space-y-4">
            <div className="p-6 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 border border-neutral-800 rounded-2xl shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <span className="text-sm font-bold text-white tracking-tight">
                  {currentSettings.businessName}
                </span>
                <span className="text-xs text-amber-400 font-medium">Showroom Ready</span>
              </div>

              <div className="aspect-[16/9] w-full rounded-xl overflow-hidden bg-neutral-950 relative">
                <img
                  src={vehicle.images[0] || '/images/hero_car_showroom_1790168724059.jpg'}
                  alt={vehicle.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-neutral-950/90 text-white text-xs px-2.5 py-1 rounded font-medium border border-neutral-800">
                  {vehicle.year} · {vehicle.condition}
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="text-base font-bold text-white">{vehicle.title}</h4>
                <div className="text-lg font-bold text-amber-400 font-mono">
                  {formatPrice(vehicle.price, vehicle.currency, currentSettings.currencySymbol)}
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
                <span>WhatsApp: {currentSettings.whatsappNumber}</span>
                <span className="text-neutral-500">{siteUrl.replace(/^https?:\/\//, '')}</span>
              </div>
            </div>

            <p className="text-xs text-neutral-400 text-center">
              Screenshot or share this card directly on your WhatsApp Status and social media stories!
            </p>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-medium transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
