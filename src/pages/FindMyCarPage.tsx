import React, { useState } from 'react';
import { Search, CheckCircle2, MessageSquare, Send } from 'lucide-react';
import { useDealer } from '../context/DealerContext';
import { api } from '../lib/api';
import { buildWhatsAppLink } from '../lib/whatsapp';

export const FindMyCarPage: React.FC = () => {
  const { settings } = useDealer();
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [budget, setBudget] = useState('');
  const [condition, setCondition] = useState('Any');
  const [transmission, setTransmission] = useState('Any');
  const [otherRequirements, setOtherRequirements] = useState('');

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !whatsapp || !brand) {
      setErrorMessage('Please fill in Name, WhatsApp number, and Brand.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      await api.createFindCarRequest({
        name,
        whatsapp,
        brand,
        model,
        year,
        budget,
        condition,
        transmission,
        otherRequirements,
      });

      // Also create an admin lead automatically
      await api.createLead({
        name,
        phone: whatsapp,
        whatsapp,
        source: 'find_my_car',
        message: `Find My Car Request: ${year || ''} ${brand} ${model || ''} (Budget: ${budget || 'Flexible'}). Requirements: ${otherRequirements || 'None'}`,
        budget,
      });

      api.trackEvent('find_car_submit', undefined, { brand, model });
      setSubmitted(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit request.');
    } finally {
      setLoading(false);
    }
  };

  const whatsappUrl = buildWhatsAppLink(
    settings?.whatsappNumber || '08037781788',
    `Hello, my name is ${name || 'Customer'}. I submitted a "Find My Car" request for a ${year || ''} ${brand} ${model || ''} on your showroom website.`
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-300 bg-blue-950/60 border border-blue-800/60 px-3.5 py-1.5 rounded-full">
          <Search className="w-3.5 h-3.5 text-blue-400" />
          <span>Vehicle Locator Service</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">Can’t Find Your Car?</h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
          Tell us what you are looking for. We will search our dealer partner inventory and incoming container manifests to match you with the right vehicle.
        </p>
      </div>

      <div className="bg-[#0e1422] border border-slate-800 rounded-xl p-6 sm:p-10 shadow-xl">
        {submitted ? (
          <div className="py-10 text-center space-y-5">
            <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto" />
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white">We’ve Received Your Car Request</h2>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Our sales team will review available and incoming inventory matching your{' '}
                <strong className="text-blue-400">{brand} {model}</strong> preferences.
              </p>
            </div>

            <div className="pt-2 max-w-xs mx-auto">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>Message Dealer on WhatsApp</span>
              </a>
            </div>

            <button
              onClick={() => setSubmitted(false)}
              className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer pt-3"
            >
              Submit another request
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {errorMessage && (
              <div className="p-3 bg-red-950/40 border border-red-800/80 rounded-lg text-xs text-red-300">
                {errorMessage}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Your Full Name <span className="text-blue-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Adebayo Ogunlesi"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full bg-[#090d16] border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Brand <span className="text-blue-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lexus, Toyota, Mercedes"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full bg-[#090d16] border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Model</label>
                <input
                  type="text"
                  placeholder="e.g. GX 460, Camry, GLE 450"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full bg-[#090d16] border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Year</label>
                <input
                  type="text"
                  placeholder="e.g. 2021 - 2024"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full bg-[#090d16] border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Budget Target</label>
                <input
                  type="text"
                  placeholder="e.g. ₦45,000,000"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full bg-[#090d16] border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Condition</label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full bg-[#090d16] border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Any">Any Condition</option>
                  <option value="Brand New">Brand New</option>
                  <option value="Foreign Used">Foreign Used (Tokunbo)</option>
                  <option value="Locally Used">Locally Used</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Transmission</label>
                <select
                  value={transmission}
                  onChange={(e) => setTransmission(e.target.value)}
                  className="w-full bg-[#090d16] border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Any">Any Transmission</option>
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Specific Features or Requirements
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Panoramic sunroof, red leather interior, 360 camera, low mileage..."
                value={otherRequirements}
                onChange={(e) => setOtherRequirements(e.target.value)}
                className="w-full bg-[#090d16] border border-slate-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold rounded-lg text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm shadow-blue-900/40"
            >
              {loading ? (
                <span>Submitting Request...</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Vehicle Request</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
