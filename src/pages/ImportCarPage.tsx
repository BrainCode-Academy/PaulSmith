import React, { useState } from 'react';
import { Ship, CheckCircle2, MessageSquare, Send, Globe, ShieldCheck, ArrowRight } from 'lucide-react';
import { useDealer } from '../context/DealerContext';
import { api } from '../lib/api';
import { buildWhatsAppLink, getImportInquiryMessage } from '../lib/whatsapp';

export const ImportCarPage: React.FC = () => {
  const { settings } = useDealer();
  const [fullName, setFullName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [preferredBrand, setPreferredBrand] = useState('');
  const [preferredModel, setPreferredModel] = useState('');
  const [preferredYear, setPreferredYear] = useState('');
  const [budget, setBudget] = useState('');
  const [condition, setCondition] = useState<'Brand New' | 'Used' | 'Any'>('Brand New');
  const [preferredCountry, setPreferredCountry] = useState('China');
  const [specificRequirements, setSpecificRequirements] = useState('');
  const [additionalMessage, setAdditionalMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const importCountries = settings?.importCountries && settings.importCountries.length > 0
    ? settings.importCountries
    : ['China', 'United States', 'Canada', 'Germany', 'Japan'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !whatsappNumber || !preferredBrand || !preferredModel) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      await api.createImportRequest({
        fullName,
        whatsappNumber,
        preferredBrand,
        preferredModel,
        preferredYear,
        budget,
        condition,
        preferredCountry,
        specificRequirements,
        additionalMessage,
      });

      api.trackEvent('import_submit', undefined, {
        brand: preferredBrand,
        model: preferredModel,
        country: preferredCountry,
      });

      setSubmitted(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit import request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const whatsappFollowUpUrl = buildWhatsAppLink(
    settings?.whatsappNumber || '08037781788',
    getImportInquiryMessage({
      fullName,
      preferredBrand,
      preferredModel,
      preferredYear,
      budget,
      country: preferredCountry,
    })
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-3.5 py-1.5 rounded-full">
          <Ship className="w-3.5 h-3.5" />
          <span>Custom Vehicle Import & Sourcing</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
          Can’t Find Your Desired Vehicle?
        </h1>
        <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
          Tell us the exact vehicle you want and our direct sourcing partners in China and international automotive markets will locate, inspect, and import it for you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Side: Sourcing Process & Trust */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <h2 className="text-lg font-bold text-white tracking-tight">Our Sourcing Process</h2>

            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-amber-400/10 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border border-amber-400/30">
                  1
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-white">Requirement Specification</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Submit your exact vehicle preferences, including make, model, trim, color, and maximum budget.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-amber-400/10 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border border-amber-400/30">
                  2
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-white">Supplier Verification & Inspection</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    We source the vehicle from verified exporters in China or international hubs with high-resolution photo/video walk-arounds.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-amber-400/10 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border border-amber-400/30">
                  3
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-white">Shipping & Customs Logistics</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Handling container booking, marine freight, bill of lading, and port clearance procedures.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-amber-400/10 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border border-amber-400/30">
                  4
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-white">Arrival & Handover</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Final physical inspection, detailing, and vehicle collection or delivery directly to you.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sourcing Hubs */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>Active Sourcing Hubs</span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {importCountries.map((c) => (
                <span
                  key={c}
                  className="px-3 py-1 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-300 font-medium"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: High-Conversion Form */}
        <div className="lg:col-span-7 bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-10 shadow-xl">
          {submitted ? (
            <div className="py-12 text-center space-y-6">
              <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto" />
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">Import Request Received!</h2>
                <p className="text-xs sm:text-sm text-neutral-300 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong className="text-white">{fullName}</strong>. We have logged your request for the{' '}
                  <strong className="text-amber-400">{preferredYear} {preferredBrand} {preferredModel}</strong>.
                </p>
              </div>

              <div className="pt-2 max-w-sm mx-auto">
                <a
                  href={whatsappFollowUpUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  <MessageSquare className="w-4 h-4 fill-current" />
                  <span>Send Request Directly to WhatsApp</span>
                </a>
              </div>

              <button
                onClick={() => setSubmitted(false)}
                className="text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer pt-4"
              >
                Submit another vehicle request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Request Sourcing Assistance</h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Fill in your vehicle preferences. We will respond with availability and estimated landing costs.
                </p>
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-950/40 border border-red-800/80 rounded-lg text-xs text-red-300">
                  {errorMessage}
                </div>
              )}

              {/* Personal Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    Full Name <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    WhatsApp Number <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +234 800 000 0000"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Vehicle Specifications */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    Preferred Brand <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BYD, Toyota, Lexus"
                    value={preferredBrand}
                    onChange={(e) => setPreferredBrand(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    Preferred Model <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tang EV, Prado, RX 350"
                    value={preferredModel}
                    onChange={(e) => setPreferredModel(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">Preferred Year</label>
                  <input
                    type="text"
                    placeholder="e.g. 2023 - 2025"
                    value={preferredYear}
                    onChange={(e) => setPreferredYear(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Budget & Condition */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">Approximate Budget</label>
                  <input
                    type="text"
                    placeholder="e.g. $35,000 USD or ₦50M"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">Condition</label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as any)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Brand New">Brand New</option>
                    <option value="Used">Used / Pre-Owned</option>
                    <option value="Any">Either</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">Sourcing Country</label>
                  <select
                    value={preferredCountry}
                    onChange={(e) => setPreferredCountry(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    {importCountries.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Requirements & Message */}
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Specific Trim, Color or Options
                </label>
                <input
                  type="text"
                  placeholder="e.g. All-Wheel Drive, panoramic sunroof, black leather, 360 camera"
                  value={specificRequirements}
                  onChange={(e) => setSpecificRequirements(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">Additional Notes</label>
                <textarea
                  rows={3}
                  placeholder="Any timeline requirements, shipping port preference, or specific questions..."
                  value={additionalMessage}
                  onChange={(e) => setAdditionalMessage(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-neutral-950 font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/10"
              >
                {loading ? (
                  <span>Processing Request...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Request Import Assistance</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
