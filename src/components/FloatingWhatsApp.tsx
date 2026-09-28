import React from 'react';
import { MessageSquare } from 'lucide-react';
import { useDealer } from '../context/DealerContext';
import { buildWhatsAppLink, getGeneralWhatsAppMessage } from '../lib/whatsapp';
import { api } from '../lib/api';

export const FloatingWhatsApp: React.FC = () => {
  const { settings } = useDealer();
  const businessName = settings?.businessName || 'Paul Smith Autos';

  if (!settings?.whatsappNumber) return null;

  const whatsappUrl = buildWhatsAppLink(
    settings.whatsappNumber,
    getGeneralWhatsAppMessage(businessName)
  );

  const handleClick = () => {
    api.trackEvent('whatsapp_click', undefined, { source: 'floating_sticky_button' });
  };

  return (
    <aside
      aria-label="Direct WhatsApp Contact"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 group"
    >
      <span className="hidden sm:inline-block bg-neutral-900/90 text-neutral-200 text-xs px-3 py-1.5 rounded-lg border border-neutral-800 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
        Chat with sales on WhatsApp
      </span>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        aria-label="Chat on WhatsApp"
        className="flex items-center justify-center w-14 h-14 bg-emerald-500 hover:bg-emerald-400 text-white rounded-full shadow-2xl transition-transform hover:scale-105 active:scale-95"
      >
        <MessageSquare className="w-7 h-7 fill-current" />
      </a>
    </aside>
  );
};
