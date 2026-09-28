import React from 'react';
import { useDealer } from '../context/DealerContext';

export const PrivacyPage: React.FC = () => {
  const { settings } = useDealer();
  const businessName = settings?.businessName || 'Paul Smith Autos';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6 text-neutral-300 text-xs leading-relaxed">
      <h1 className="text-2xl font-bold text-white tracking-tight">Privacy Policy</h1>
      <p className="text-neutral-400">Effective Date: March 2026</p>

      <section className="space-y-2 bg-neutral-900 border border-neutral-800 p-6 rounded-xl">
        <h2 className="text-sm font-semibold text-white">1. Information We Collect</h2>
        <p>
          At {businessName}, we collect information you voluntarily provide to us when submitting inquiries, booking inspections, requesting vehicle import assistance, or contacting us through WhatsApp and web forms. This information typically includes your name, phone or WhatsApp number, and vehicle preferences.
        </p>
      </section>

      <section className="space-y-2 bg-neutral-900 border border-neutral-800 p-6 rounded-xl">
        <h2 className="text-sm font-semibold text-white">2. How We Use Your Information</h2>
        <p>
          We use the collected information exclusively to communicate regarding your vehicle inquiries, provide sourcing quotations, schedule physical showroom inspections, and share requested vehicle photo/video walk-arounds. We do not sell or rent your personal information to third parties.
        </p>
      </section>

      <section className="space-y-2 bg-neutral-900 border border-neutral-800 p-6 rounded-xl">
        <h2 className="text-sm font-semibold text-white">3. Third-Party Messaging Platforms (WhatsApp)</h2>
        <p>
          Our platform facilitates direct communication via WhatsApp. When you initiate a conversation with us via WhatsApp, your interactions are also subject to WhatsApp's standard terms and privacy policies.
        </p>
      </section>

      <section className="space-y-2 bg-neutral-900 border border-neutral-800 p-6 rounded-xl">
        <h2 className="text-sm font-semibold text-white">4. Data Security & Retention</h2>
        <p>
          Customer inquiries and import specifications are stored in secure dealership databases and accessible only to authorized sales personnel for operational fulfillment.
        </p>
      </section>
    </div>
  );
};

export const TermsPage: React.FC = () => {
  const { settings } = useDealer();
  const businessName = settings?.businessName || 'Paul Smith Autos';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6 text-neutral-300 text-xs leading-relaxed">
      <h1 className="text-2xl font-bold text-white tracking-tight">Terms and Conditions</h1>
      <p className="text-neutral-400">Effective Date: March 2026</p>

      <section className="space-y-2 bg-neutral-900 border border-neutral-800 p-6 rounded-xl">
        <h2 className="text-sm font-semibold text-white">1. Vehicle Listings and Availability</h2>
        <p>
          All vehicles displayed in our digital showroom are subject to prior sale, availability confirmation, and final physical verification. While {businessName} endeavors to maintain accurate specifications, pricing, and mileage representations, prospective buyers are encouraged to inspect vehicles before concluding purchases.
        </p>
      </section>

      <section className="space-y-2 bg-neutral-900 border border-neutral-800 p-6 rounded-xl">
        <h2 className="text-sm font-semibold text-white">2. Vehicle Inspections</h2>
        <p>
          We welcome and encourage customer inspections. Prospective purchasers may inspect vehicles at our designated showroom or arrange an inspection with a qualified automotive technician prior to payment.
        </p>
      </section>

      <section className="space-y-2 bg-neutral-900 border border-neutral-800 p-6 rounded-xl">
        <h2 className="text-sm font-semibold text-white">3. Custom Import Sourcing Terms</h2>
        <p>
          For vehicles imported upon customer request, specific sourcing agreements detailing FOB/CIF prices, estimated shipping timelines, port clearance protocols, and documentation will be executed between the parties prior to procurement.
        </p>
      </section>

      <section className="space-y-2 bg-neutral-900 border border-neutral-800 p-6 rounded-xl">
        <h2 className="text-sm font-semibold text-white">4. Governing Law</h2>
        <p>
          These terms and commercial transactions are subject to applicable commercial laws governing automotive trade and vehicle registration.
        </p>
      </section>
    </div>
  );
};
