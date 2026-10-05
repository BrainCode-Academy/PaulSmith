import React from 'react';
import { ShieldCheck, Ship, MessageSquare, Phone, Mail, MapPin, Clock, Award, CheckCircle2, Users } from 'lucide-react';
import { useDealer } from '../context/DealerContext';
import { buildWhatsAppLink, getGeneralWhatsAppMessage } from '../lib/whatsapp';

interface AboutPageProps {
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const { settings } = useDealer();
  const businessName = settings?.businessName || 'Paul Smith Autos';
  const ceoPhone = settings?.ceoPhone || settings?.phone || '08037781788';
  const ceoWhatsApp = settings?.whatsappNumber || '+2348037781788';

  const generalWhatsappUrl = buildWhatsAppLink(
    ceoWhatsApp,
    getGeneralWhatsAppMessage(businessName)
  );

  const directCeoWhatsappUrl = buildWhatsAppLink(
    ceoWhatsApp,
    `Hello Mr. Paul Smith, I am reaching out to you directly from the ${businessName} website regarding vehicle acquisition.`
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">
      {/* Header */}
      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">About {businessName}</h1>
        <p className="text-sm text-neutral-400 max-w-2xl leading-relaxed">
          {settings?.tagline || 'Certified Automobile Showroom & Direct Import Sourcing'}
        </p>
      </div>

      {/* 1. FOUNDER & CEO SPOTLIGHT */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center p-6 sm:p-10">
          {/* CEO Photo */}
          <div className="md:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-[260px] aspect-[3/4] rounded-2xl overflow-hidden border border-neutral-700/80 shadow-2xl bg-neutral-950">
              <img
                src={settings?.ceoImage || '/WhatsApp Image 2026-09-29 at 8.55.15 AM.jpeg'}
                alt="Paul Smith - Founder & CEO of Paul Smith Autos"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-center sm:text-left">
                <span className="text-xs font-bold text-white block">Paul Smith</span>
                <span className="text-[11px] text-blue-400 block font-medium">Founder & CEO</span>
              </div>
            </div>
          </div>

          {/* CEO Bio & Authenticity Message */}
          <div className="md:col-span-7 space-y-4">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-wider text-blue-400 font-semibold">Executive Leadership</span>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                "NO Fakes. No Compromise on Engine Soundness or Customs Authenticity."
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              {settings?.ceoQuote ||
                'At Paul Smith Autos, we inspect every car down to the bolt. In a market where buyers are often exposed to flooded vehicles, doctored odometers, and questionable paperwork, our bedrock principle is total transparency. When you partner with us, you are guaranteed authentic mileage, flawless diagnostics, and original customs documentation.'}
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <a
                href={directCeoWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>Chat Direct with CEO ({ceoPhone})</span>
              </a>

              {settings?.whatsappGroupLink && (
                <a
                  href={settings.whatsappGroupLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span>Join VIP WhatsApp Community</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. OUR BUSINESS PROFILE */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-10 space-y-6">
        <h2 className="text-lg font-bold text-white tracking-tight">Our Dealership Profile</h2>
        <p className="text-sm text-neutral-300 leading-relaxed">
          {settings?.businessDescription ||
            'Paul Smith Autos is a premier automotive dealership and direct vehicle import specialist. Founded by Paul Smith, we guarantee 100% verified sound engines, original customs documentation, and zero compromises on mechanical integrity. No fakes, no altered odometers, and direct personal service.'}
        </p>

        {settings?.importCountries && settings.importCountries.length > 0 && (
          <div className="pt-2 border-t border-neutral-800/80">
            <h3 className="text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-3">
              Direct International Sourcing Hubs
            </h3>
            <div className="flex flex-wrap gap-2 text-xs text-neutral-300">
              {settings.importCountries.map((country, index) => (
                <React.Fragment key={country}>
                  <span className="text-neutral-200 font-medium">{country}</span>
                  {index < settings.importCountries.length - 1 && <span className="text-neutral-600">·</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. FOUR PILLARS OF INTEGRITY */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white tracking-tight">The Paul Smith Autos Standards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600/10 flex items-center justify-center text-blue-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Zero Odometer Tampering Guarantee</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Every vehicle is verified against factory service logs, auction manifests, and OBD computer diagnostics. What you see on the dashboard is the true mileage.
            </p>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-400/10 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Mechanic Pre-Purchase Inspection</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              We operate an open inspection policy. You are actively encouraged to bring your trusted independent mechanic, auto electrician, or scanning specialist to evaluate any car before making a payment.
            </p>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-blue-400/10 flex items-center justify-center text-blue-400">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Genuine Customs Clearing Documentation</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Full customs duty documentation, valuation assessment, and single goods declaration papers are verified and provided with every foreign-used import.
            </p>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-purple-400/10 flex items-center justify-center text-purple-400">
              <Ship className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Personalized Import Sourcing Desk</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Can't find your desired spec in our immediate showroom? We procure directly from trusted dealer networks in China, the USA, Canada, Germany, and Japan with step-by-step video updates.
            </p>
          </div>
        </div>
      </div>

      {/* 4. VERIFIED BUSINESS CONTACT & REACH */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Showroom & Headquarters Contact</h2>
            <p className="text-xs text-neutral-400">Reach Paul Smith Autos directly during showroom hours.</p>
          </div>

          <a
            href={`tel:${ceoPhone}`}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call CEO: {ceoPhone}</span>
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {settings?.whatsappNumber && (
            <div className="flex items-center gap-2.5 text-neutral-300">
              <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>WhatsApp Sales: {settings.whatsappNumber}</span>
            </div>
          )}
          {ceoPhone && (
            <div className="flex items-center gap-2.5 text-neutral-300">
              <Phone className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Direct Executive Line: {ceoPhone}</span>
            </div>
          )}
          {settings?.email && (
            <div className="flex items-center gap-2.5 text-neutral-300">
              <Mail className="w-4 h-4 text-neutral-400 shrink-0" />
              <span>Email: {settings.email}</span>
            </div>
          )}
          {settings?.address && (
            <div className="flex items-start gap-2.5 text-neutral-300">
              <MapPin className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
              <span>Showroom: {settings.address}</span>
            </div>
          )}
          {settings?.businessHours && (
            <div className="flex items-center gap-2.5 text-neutral-300">
              <Clock className="w-4 h-4 text-neutral-400 shrink-0" />
              <span>Hours: {settings.businessHours}</span>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-neutral-800 flex flex-wrap gap-3">
          <a
            href={generalWhatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4 fill-current" />
            <span>Chat on WhatsApp</span>
          </a>

          <button
            onClick={() => onNavigate('/cars')}
            className="px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-medium transition-colors cursor-pointer"
          >
            Browse Available Vehicles
          </button>
        </div>
      </div>
    </div>
  );
};
