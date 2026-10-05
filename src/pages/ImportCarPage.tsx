import React, { useState } from 'react';
import { Ship, Globe, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { api } from '../lib/api';
import { useDealer } from '../context/DealerContext';
import { buildWhatsAppLink, getGeneralWhatsAppMessage } from '../lib/whatsapp';

export const ImportCarPage: React.FC = () => {
  const { settings } = useDealer();
  const [fullName, setFullName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [preferredBrand, setPreferredBrand] = useState('');
  const [preferredModel, setPreferredModel] = useState('');
  const [preferredYear, setPreferredYear] = useState('');
  const [budget, setBudget] = useState('');
  const [condition, setCondition] = useState<'Brand New' | 'Used' | 'Any'>('Any');
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
        preferredYear: preferredYear || 'Not specified',
        budget: budget || 'To be discussed',
        condition,
        preferredCountry,
        specificRequirements,
        additionalMessage,
      });

      // Also create a lead entry
      await api.createLead({
        name: fullName,
        phone: whatsappNumber,
        whatsapp: whatsappNumber,
        source: 'import_funnel',
        message: `Import request for ${preferredBrand} ${preferredModel} (${preferredYear || 'Any year'}) from ${preferredCountry}. Budget: ${budget || 'Flexible'}`,
        budget: budget || undefined,
      }).catch(() => {});

      setSubmitted(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const businessName = settings?.businessName || 'Paul Smith Autos';
  const whatsappUrl = buildWhatsAppLink(
    settings?.whatsappNumber || '08037781788',
    getGeneralWhatsAppMessage(businessName)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-300 bg-blue-950/60 border border-blue-800/60 px-3.5 py-1.5 rounded-full">
          <Ship className="w-3.5 h-3.5 text-blue-400" />
          <span>Custom Vehicle Import & Sourcing</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
          Can’t Find Your Desired Vehicle?
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Tell us the exact vehicle you want and our direct sourcing partners in China and international automotive markets will locate, inspect, and import it for you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Side: Sourcing Process & Trust */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#0e1422] border border-slate-800 rounded-xl p-6 sm:p-8 space-y-6">
            <h2 className="text-lg font-bold text-white tracking-tight">Our Sourcing Process</h2>

            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-blue-950/60 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border border-blue-800/60">
                  1
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-white">Requirement Specification</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Submit your exact vehicle preferences, including make, model, trim, color, and maximum budget.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-blue-950/60 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border border-blue-800/60">
                  2
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-white">Supplier Verification & Inspection</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    We source the vehicle from verified exporters in China or international hubs with high-resolution photo/video walk-arounds.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-blue-950/60 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border border-blue-800/60">
                  3
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-white">Shipping & Customs Logistics</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Handling container booking, marine freight, bill of lading, and port clearance procedures.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-blue-950/60 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border border-blue-800/60">
                  4
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-white">Arrival & Handover</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Final physical inspection, detailing, and vehicle collection or delivery directly to you.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sourcing Hubs */}
          <div className="bg-[#0e1422] border border-slate-800 rounded-xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <Globe className="w-4 h-4 text-blue-400" />
              <span>Active Sourcing Hubs</span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {importCountries.map((c) => (
                <span
                  key={c}
                  className="px-3 py-1 bg-[#090d16] border border-slate-800 rounded-md text-xs text-slate-300"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="lg:col-span-7 bg-[#0e1422] border border-slate-800 rounded-xl p-6 sm:p-10 shadow-2xl">
          {submitted ? (
            <div className="text-center py-12 space-y-5 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Import Request Received</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Thank you for your submission, <strong className="text-white">{fullName}</strong>. Our sourcing team has received your vehicle parameters for{' '}
                <strong className="text-blue-400">{preferredYear} {preferredBrand} {preferredModel}</strong>.
              </p>
              <div className="pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-xs transition-colors shadow-sm"
                >
                  <MessageSquare className="w-4 h-4 fill-current" />
                  <span>Connect with Sourcing Team</span>
                </a>
              </div>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setPreferredBrand('');
                  setPreferredModel('');
                  setPreferredYear('');
                  setBudget('');
                  setSpecificRequirements('');
                  setAdditionalMessage('');
                }}
                className="text-xs text-slate-400 hover:text-white underline block mx-auto cursor-pointer"
              >
                Submit another request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Request Sourcing Assistance</h2>
                <p className="text-xs text-slate-400 mt-1">
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
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Full Name <span className="text-blue-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    WhatsApp Number <span className="text-blue-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +234 800 000 0000"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Vehicle Specifications */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Preferred Brand <span className="text-blue-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BYD, Toyota, Lexus"
                    value={preferredBrand}
                    onChange={(e) => setPreferredBrand(e.target.value)}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Preferred Model <span className="text-blue-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tang EV, Prado, RX 350"
                    value={preferredModel}
                    onChange={(e) => setPreferredModel(e.target.value)}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Preferred Year</label>
                  <input
                    type="text"
                    placeholder="e.g. 2023 - 2025"
                    value={preferredYear}
                    onChange={(e) => setPreferredYear(e.target.value)}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Budget & Condition */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Approximate Budget</label>
                  <input
                    type="text"
                    placeholder="e.g. $35,000 USD or ₦50M"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Condition</label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as any)}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Brand New">Brand New</option>
                    <option value="Used">Used / Pre-Owned</option>
                    <option value="Any">Either</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Sourcing Country</label>
                  <select
                    value={preferredCountry}
                    onChange={(e) => setPreferredCountry(e.target.value)}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
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
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Specific Trim, Color or Options
                </label>
                <input
                  type="text"
                  placeholder="e.g. All-Wheel Drive, panoramic sunroof, black leather, 360 camera"
                  value={specificRequirements}
                  onChange={(e) => setSpecificRequirements(e.target.value)}
                  className="w-full bg-[#090d16] border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Additional Notes</label>
                <textarea
                  rows={3}
                  placeholder="Any timeline requirements, shipping port preference, or specific questions..."
                  value={additionalMessage}
                  onChange={(e) => setAdditionalMessage(e.target.value)}
                  className="w-full bg-[#090d16] border border-slate-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold rounded-lg text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm shadow-blue-900/40"
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
