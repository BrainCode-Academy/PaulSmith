import React, { useState } from 'react';
import { X, CheckCircle, MessageSquare, Send, Calendar, Tag } from 'lucide-react';
import { Vehicle } from '../types';
import { useDealer } from '../context/DealerContext';
import { api } from '../lib/api';
import { formatPrice, buildWhatsAppLink } from '../lib/whatsapp';

interface LeadInquiryModalProps {
  vehicle: Vehicle;
  mode: 'inquiry' | 'inspection' | 'offer';
  onClose: () => void;
}

export const LeadInquiryModal: React.FC<LeadInquiryModalProps> = ({ vehicle, mode, onClose }) => {
  const { settings } = useDealer();
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [message, setMessage] = useState('');
  const [offerAmount, setOfferAmount] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const priceFormatted = formatPrice(vehicle.price, vehicle.currency, settings?.currencySymbol || '₦');

  const modalTitle = {
    inquiry: 'Request Vehicle Information',
    inspection: 'Schedule Showroom Inspection',
    offer: 'Submit a Purchase Offer',
  }[mode];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !whatsapp) return;

    setLoading(true);
    try {
      let finalMessage = message;
      if (mode === 'inspection') {
        finalMessage = `Inspection request for ${preferredDate || 'upcoming weekend'}. Additional notes: ${message || 'None'}`;
      } else if (mode === 'offer') {
        finalMessage = `Offer of ${offerAmount} submitted for ${vehicle.title} (Listed at ${priceFormatted}). Notes: ${message || 'None'}`;
      }

      await api.createLead({
        name,
        phone: whatsapp,
        whatsapp,
        vehicleId: vehicle.id,
        vehicleTitle: vehicle.title,
        source: mode === 'inspection' ? 'inspection' : mode === 'offer' ? 'offer' : 'vehicle_detail',
        message: finalMessage || `Interested in ${vehicle.title}`,
        budget: offerAmount || undefined,
      });

      api.trackEvent(mode === 'inspection' ? 'inspection_booked' : 'lead_submitted', vehicle.id, {
        mode,
        vehicleTitle: vehicle.title,
      });

      setSuccess(true);
    } catch (err) {
      console.error('Failed to submit inquiry:', err);
    } finally {
      setLoading(false);
    }
  };

  const directWhatsAppUrl = buildWhatsAppLink(
    settings?.whatsappNumber || '',
    `Hello, my name is ${name || 'Customer'}. I submitted an ${mode} request for the ${vehicle.year} ${vehicle.make} ${vehicle.model} on your website.`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <h3 className="font-semibold text-base text-white">{modalTitle}</h3>
          <button onClick={onClose} className="p-1 text-neutral-400 hover:text-white transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Vehicle Mini banner */}
        <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 flex items-center gap-3">
          <img
            src={vehicle.images[0] || '/images/hero_car_showroom_1790168724059.jpg'}
            alt={vehicle.title}
            referrerPolicy="no-referrer"
            className="w-14 h-10 object-cover rounded-md"
          />
          <div>
            <h4 className="text-xs font-semibold text-white">{vehicle.title}</h4>
            <p className="text-xs text-blue-400 font-mono font-semibold">{priceFormatted}</p>
          </div>
        </div>

        {success ? (
          <div className="py-6 text-center space-y-4">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
            <div>
              <h4 className="text-base font-semibold text-white">Request Received</h4>
              <p className="text-xs text-neutral-400 mt-1">
                The dealer has received your details and will follow up with you on WhatsApp shortly.
              </p>
            </div>

            <a
              href={directWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              <span>Continue Directly to WhatsApp</span>
            </a>

            <button
              onClick={onClose}
              className="w-full text-xs text-neutral-400 hover:text-white transition-colors pt-2 cursor-pointer"
            >
              Close Window
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Your Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">WhatsApp / Phone Number *</label>
              <input
                type="tel"
                required
                placeholder="e.g. +234 800 000 0000"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {mode === 'inspection' && (
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Preferred Inspection Date / Time</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. Friday morning, 11:00 AM"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-3 pr-8 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                  <Calendar className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                </div>
              </div>
            )}

            {mode === 'offer' && (
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Your Offer Amount ({vehicle.currency})</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. 74,000,000"
                    value={offerAmount}
                    onChange={(e) => setOfferAmount(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-3 pr-8 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                  <Tag className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Additional Note or Question</label>
              <textarea
                rows={3}
                placeholder="Any specific questions about condition, documentation, or viewing..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold rounded-lg text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-600/20"
            >
              {loading ? (
                <span>Submitting...</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Request</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
