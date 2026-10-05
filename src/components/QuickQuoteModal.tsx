import React, { useState } from 'react';
import { X, CheckCircle, ReceiptText, MessageSquare, Send, ShieldCheck, Truck, ChevronRight } from 'lucide-react';
import { Vehicle } from '../types';
import { useDealer } from '../context/DealerContext';
import { api } from '../lib/api';
import { formatPrice, buildWhatsAppLink } from '../lib/whatsapp';

interface QuickQuoteModalProps {
  vehicle: Vehicle;
  onClose: () => void;
}

export const QuickQuoteModal: React.FC<QuickQuoteModalProps> = ({ vehicle, onClose }) => {
  const { settings } = useDealer();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState('Lagos Showroom Pickup');
  const [timeline, setTimeline] = useState('Immediate (Ready to inspect)');
  const [paymentOption, setPaymentOption] = useState('Full Outright Payment');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [quoteReference, setQuoteReference] = useState('');

  const currencySymbol = settings?.currencySymbol || '₦';
  const priceFormatted = formatPrice(vehicle.price, vehicle.currency, currencySymbol);

  // Delivery logistics estimated addition
  const getLogisticsEstimate = (loc: string) => {
    switch (loc) {
      case 'Abuja (FCT)':
        return 450000;
      case 'Port Harcourt / South-South':
        return 550000;
      case 'Ibadan / South-West':
        return 200000;
      case 'Kano / North':
        return 650000;
      case 'Enugu / South-East':
        return 500000;
      case 'Direct Port Delivery (Tin Can / Apapa)':
        return 100000;
      default:
        return 0; // Lagos pickup
    }
  };

  const logisticsCost = getLogisticsEstimate(deliveryLocation);
  const totalEstimatedCost = vehicle.price + logisticsCost;
  const formattedTotalEstimate = formatPrice(totalEstimatedCost, vehicle.currency, currencySymbol);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    setLoading(true);
    try {
      const generatedRef = `PSA-QUOTE-${Math.floor(10000 + Math.random() * 90000)}`;
      setQuoteReference(generatedRef);

      const detailedMessage = `[QUICK QUOTE REQUEST - ${generatedRef}]
Vehicle: ${vehicle.year} ${vehicle.make} ${vehicle.model}
Base Listed Price: ${priceFormatted}
Selected Delivery Hub: ${deliveryLocation} (Est. Logistics: ${logisticsCost > 0 ? formatPrice(logisticsCost, vehicle.currency, currencySymbol) : 'Complimentary Pickup'})
Est. Total Landing Quote: ${formattedTotalEstimate}
Purchase Timeline: ${timeline}
Preferred Payment Mode: ${paymentOption}
Customer Notes: ${notes.trim() || 'None provided'}`;

      await api.createLead({
        name: name.trim(),
        phone: phone.trim(),
        whatsapp: phone.trim(),
        vehicleId: vehicle.id,
        vehicleTitle: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
        source: 'quick_quote',
        message: detailedMessage,
        budget: formattedTotalEstimate,
      });

      api.trackEvent('quick_quote_requested', vehicle.id, {
        quoteRef: generatedRef,
        vehicleTitle: vehicle.title,
        price: vehicle.price,
        deliveryLocation,
      });

      setSubmitted(true);
    } catch (err: any) {
      alert(`Could not submit quote request: ${err.message || 'Please try again or chat via WhatsApp.'}`);
    } finally {
      setLoading(false);
    }
  };

  const salesWhatsApp = settings?.whatsappNumber || '08037781788';
  const whatsappQuoteUrl = buildWhatsAppLink(
    salesWhatsApp,
    `Hello Paul Smith Autos, I just generated a Quick Quote (${quoteReference || 'Ref: Request'}) for the ${vehicle.year} ${vehicle.make} ${vehicle.model} (${priceFormatted}). Please send the itemized invoice and inspection clearance breakdown to my WhatsApp.`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#0e1422] border border-slate-800 rounded-2xl shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 z-10 bg-[#0e1422]/95 backdrop-blur-md px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <ReceiptText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white tracking-tight">Instant Vehicle Quick Quote</h3>
              <p className="text-[11px] text-slate-400">Itemized pricing, documented clearance, and delivery options</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            aria-label="Close quote modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 pt-0 space-y-6">
          {/* Vehicle Snapshot */}
          <div className="flex items-center gap-3.5 bg-[#090d16] p-3.5 rounded-xl border border-slate-800">
            <img
              src={vehicle.images[0] || '/images/hero_car_showroom_1790168724059.jpg'}
              alt={vehicle.title}
              referrerPolicy="no-referrer"
              className="w-16 h-12 object-cover rounded-lg border border-slate-700/60 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-bold text-white truncate">{vehicle.year} {vehicle.make} {vehicle.model}</h4>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                <span>{vehicle.condition}</span>
                <span>·</span>
                <span>{vehicle.transmission}</span>
                <span>·</span>
                <span className="text-emerald-400 font-medium">{vehicle.status}</span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 block">Showroom Price</span>
              <span className="text-sm font-bold text-white font-mono">{priceFormatted}</span>
            </div>
          </div>

          {submitted ? (
            /* Success State */
            <div className="text-center py-6 space-y-5">
              <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div className="space-y-1.5">
                <span className="text-xs uppercase tracking-wider text-blue-400 font-bold bg-blue-950/60 px-2.5 py-1 rounded border border-blue-800/60">
                  {quoteReference}
                </span>
                <h4 className="text-xl font-bold text-white tracking-tight mt-2">
                  Quote Request Received!
                </h4>
                <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong className="text-white">{name}</strong>. Our pricing and vehicle desk is preparing your formal invoice with customs paperwork and destination breakdown.
                </p>
              </div>

              {/* Quote Breakdown Card */}
              <div className="bg-[#090d16] border border-slate-800 rounded-xl p-4 text-xs space-y-2.5 text-left max-w-md mx-auto">
                <div className="flex justify-between text-slate-400">
                  <span>Base Showroom Price:</span>
                  <span className="font-mono text-white font-semibold">{priceFormatted}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Customs Duty & Documentation:</span>
                  <span className="text-emerald-400 font-medium">100% Genuine & Cleared</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Destination Logistics ({deliveryLocation}):</span>
                  <span className="font-mono text-white font-semibold">
                    {logisticsCost > 0 ? formatPrice(logisticsCost, vehicle.currency, currencySymbol) : 'Showroom Handover'}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-sm">
                  <span className="text-slate-200">Estimated Total Quote:</span>
                  <span className="font-mono text-blue-400">{formattedTotalEstimate}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 max-w-md mx-auto pt-2">
                <a
                  href={whatsappQuoteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40"
                >
                  <MessageSquare className="w-4 h-4 fill-current" />
                  <span>Receive Full Breakdown on WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                >
                  Done & Close
                </button>
              </div>
            </div>
          ) : (
            /* Lead Capture & Calculation Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Dynamic Estimated Landing Breakdown */}
              <div className="bg-[#090d16] border border-slate-800 rounded-xl p-4 text-xs space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Base Vehicle Price:</span>
                  <span className="font-mono text-white font-medium">{priceFormatted}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                    <span>Physical Inspection & VIN Verification:</span>
                  </span>
                  <span className="text-emerald-400 font-medium">Included</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-blue-400" />
                    <span>Selected Delivery / Pickup:</span>
                  </span>
                  <span className="font-mono text-white font-medium">
                    {logisticsCost > 0 ? `+${formatPrice(logisticsCost, vehicle.currency, currencySymbol)}` : 'Showroom Pickup'}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-slate-200 font-semibold">Estimated Total Landing:</span>
                  <span className="font-mono text-blue-400 font-bold text-sm sm:text-base">
                    {formattedTotalEstimate}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Samuel Adekunle"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">WhatsApp / Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 0803 000 0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Preferred Delivery / Handover</label>
                  <select
                    value={deliveryLocation}
                    onChange={(e) => setDeliveryLocation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Lagos Showroom Pickup">Lagos Showroom Pickup (Complimentary)</option>
                    <option value="Abuja (FCT)">Abuja (FCT Delivery)</option>
                    <option value="Port Harcourt / South-South">Port Harcourt / South-South</option>
                    <option value="Ibadan / South-West">Ibadan / South-West</option>
                    <option value="Enugu / South-East">Enugu / South-East</option>
                    <option value="Kano / North">Kano / Northern Hub</option>
                    <option value="Direct Port Delivery (Tin Can / Apapa)">Direct Port Delivery (Tin Can / Apapa)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Purchase Timeline</label>
                  <select
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Immediate (Ready to inspect)">Immediate (Ready to inspect & pay)</option>
                    <option value="Within 1 - 2 Weeks">Within 1 - 2 Weeks</option>
                    <option value="Within This Month">Within This Month</option>
                    <option value="Planning / Budgeting Phase">Planning / Budgeting Phase</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Payment / Procurement Method</label>
                <select
                  value={paymentOption}
                  onChange={(e) => setPaymentOption(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Full Outright Payment">Direct Outright Payment (Wire / Transfer)</option>
                  <option value="Trade-in + Cash Balance">Trade-In Existing Car + Balance</option>
                  <option value="Corporate / Fleet Procurement">Corporate Purchase / Official Invoice</option>
                  <option value="Installment / Structured Plan Inquiry">Installment / Structured Payment Discussion</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Specific Inquiries or Target Offer (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Any discount for outright wire? Can I bring my mechanic on Saturday morning?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-blue-500 resize-none leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold rounded-lg text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-600/20 uppercase tracking-wider"
              >
                {loading ? (
                  <span>Generating Detailed Quote...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Request Itemized Quick Quote</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-[11px] text-slate-400 text-center">
                Instant delivery to sales desk. You will receive an official invoice breakdown via WhatsApp and direct call.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
