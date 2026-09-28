import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, MessageSquare, Ship, Car, ShieldCheck } from 'lucide-react';
import { useDealer } from '../context/DealerContext';
import { buildWhatsAppLink, getGeneralWhatsAppMessage } from '../lib/whatsapp';

interface HowItWorksPageProps {
  onNavigate: (path: string) => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ onNavigate }) => {
  const { settings } = useDealer();
  const [activeTab, setActiveTab] = useState<'showroom' | 'import'>('showroom');

  const businessName = settings?.businessName || 'Paul Smith Autos';
  const whatsappUrl = buildWhatsAppLink(
    settings?.whatsappNumber || '',
    getGeneralWhatsAppMessage(businessName)
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">How It Works</h1>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto leading-relaxed">
          Whether selecting a vehicle already in our showroom or commissioning a custom import, our process is clear, documented, and transparent.
        </p>
      </div>

      {/* Process Tabs */}
      <div className="flex justify-center">
        <div className="flex items-center gap-1.5 p-1 bg-neutral-900 border border-neutral-800 rounded-xl">
          <button
            onClick={() => setActiveTab('showroom')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'showroom'
                ? 'bg-amber-400 text-neutral-950 shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Car className="w-4 h-4" />
            <span>Buying Showroom Vehicles</span>
          </button>

          <button
            onClick={() => setActiveTab('import')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'import'
                ? 'bg-amber-400 text-neutral-950 shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Ship className="w-4 h-4" />
            <span>Custom Import Sourcing</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Buying Showroom Inventory */}
      {activeTab === 'showroom' && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-10 space-y-8">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white tracking-tight">Showroom Purchasing Process</h2>
            <p className="text-xs text-neutral-400">
              For vehicles physically available in inventory.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2">
              <div className="flex items-center gap-2.5 text-amber-400 font-bold text-xs">
                <span className="w-6 h-6 rounded-full bg-amber-400/10 flex items-center justify-center border border-amber-400/30">1</span>
                <span>Browse Inventory</span>
              </div>
              <h3 className="text-sm font-semibold text-white">Choose Your Vehicle</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Review verified photos, mileage, specifications, price, and condition details on our showroom website.
              </p>
            </div>

            <div className="p-5 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2">
              <div className="flex items-center gap-2.5 text-amber-400 font-bold text-xs">
                <span className="w-6 h-6 rounded-full bg-amber-400/10 flex items-center justify-center border border-amber-400/30">2</span>
                <span>Direct WhatsApp Contact</span>
              </div>
              <h3 className="text-sm font-semibold text-white">Confirm Availability & Details</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Click "Chat on WhatsApp" on the vehicle card to speak directly with the dealer, request extra videos, or make an offer.
              </p>
            </div>

            <div className="p-5 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2">
              <div className="flex items-center gap-2.5 text-amber-400 font-bold text-xs">
                <span className="w-6 h-6 rounded-full bg-amber-400/10 flex items-center justify-center border border-amber-400/30">3</span>
                <span>Physical Inspection</span>
              </div>
              <h3 className="text-sm font-semibold text-white">Vehicle Viewing & Verification</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Schedule a convenient showroom viewing or mechanic inspection to verify vehicle condition in person.
              </p>
            </div>

            <div className="p-5 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2">
              <div className="flex items-center gap-2.5 text-amber-400 font-bold text-xs">
                <span className="w-6 h-6 rounded-full bg-amber-400/10 flex items-center justify-center border border-amber-400/30">4</span>
                <span>Purchase & Collection</span>
              </div>
              <h3 className="text-sm font-semibold text-white">Documentation & Handover</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Complete payment directly with verified documents (customs papers, invoice, receipt), drive away or arrange delivery.
              </p>
            </div>
          </div>

          <div className="pt-4 flex justify-center">
            <button
              onClick={() => onNavigate('/cars')}
              className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold rounded-xl text-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span>Explore Showroom Inventory</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Custom Import Sourcing */}
      {activeTab === 'import' && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-10 space-y-8">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white tracking-tight">Direct Import Sourcing Process</h2>
            <p className="text-xs text-neutral-400">
              For vehicles sourced directly from China, USA, Canada, or Germany.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2">
              <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-xs">
                <span className="w-6 h-6 rounded-full bg-emerald-400/10 flex items-center justify-center border border-emerald-400/30">1</span>
                <span>Requirement Specification</span>
              </div>
              <h3 className="text-sm font-semibold text-white">Submit Vehicle Details</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Provide your desired make, model, year, target budget, and specific trim/features via our import form.
              </p>
            </div>

            <div className="p-5 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2">
              <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-xs">
                <span className="w-6 h-6 rounded-full bg-emerald-400/10 flex items-center justify-center border border-emerald-400/30">2</span>
                <span>Direct Global Sourcing</span>
              </div>
              <h3 className="text-sm font-semibold text-white">Inspection & Video Walk-Through</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                We review overseas stock with verified partners, obtaining detailed high-res photos, diagnostic reports, and landing cost quotes.
              </p>
            </div>

            <div className="p-5 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2">
              <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-xs">
                <span className="w-6 h-6 rounded-full bg-emerald-400/10 flex items-center justify-center border border-emerald-400/30">3</span>
                <span>Shipping & Tracking</span>
              </div>
              <h3 className="text-sm font-semibold text-white">Container Loading & Port Transit</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Vehicle is secured into shipping containers or RoRo vessel. Container tracking numbers and bill of lading shared on WhatsApp.
              </p>
            </div>

            <div className="p-5 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2">
              <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-xs">
                <span className="w-6 h-6 rounded-full bg-emerald-400/10 flex items-center justify-center border border-emerald-400/30">4</span>
                <span>Port Clearance & Handover</span>
              </div>
              <h3 className="text-sm font-semibold text-white">Arrival, Clearing & Delivery</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Customs duties cleared, full documentation verified, vehicle prepared and handed over to you in pristine condition.
              </p>
            </div>
          </div>

          <div className="pt-4 flex justify-center">
            <button
              onClick={() => onNavigate('/import-a-car')}
              className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold rounded-xl text-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span>Submit Import Request</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
