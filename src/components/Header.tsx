import React, { useState } from 'react';
import { MessageSquare, Menu, X, Shield, Phone } from 'lucide-react';
import { useDealer } from '../context/DealerContext';
import { buildWhatsAppLink, getGeneralWhatsAppMessage } from '../lib/whatsapp';
import { api } from '../lib/api';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, onNavigate }) => {
  const { settings, isAdmin } = useDealer();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const businessName = settings?.businessName || 'Paul Smith Autos';
  const whatsappUrl = buildWhatsAppLink(
    settings?.whatsappNumber || '',
    getGeneralWhatsAppMessage(businessName)
  );

  const handleWhatsAppClick = () => {
    api.trackEvent('whatsapp_click', undefined, { source: 'header_nav' });
  };

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Cars', path: '/cars' },
    { label: 'All Brands', path: '/brands' },
    { label: 'Import a Car', path: '/import-a-car' },
    { label: 'Find My Car', path: '/find-my-car' },
    { label: 'About', path: '/about' },
    { label: 'How It Works', path: '/how-it-works' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-neutral-950/95 backdrop-blur-md border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onNavigate('/')}
          className="text-xl font-bold tracking-tight text-white hover:text-amber-400 transition-colors whitespace-nowrap text-left"
        >
          {businessName}
        </button>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-300">
          {navItems.map((item) => {
            const isActive = currentPath === item.path || (item.path === '/cars' && currentPath.startsWith('/cars/'));
            return (
              <button
                key={item.path}
                onClick={() => onNavigate(item.path)}
                className={`transition-colors whitespace-nowrap hover:text-white cursor-pointer py-1 border-b-2 ${
                  isActive ? 'text-amber-400 border-amber-400' : 'border-transparent text-neutral-300'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          {isAdmin && (
            <button
              onClick={() => onNavigate('/admin')}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-400 bg-amber-950/40 border border-amber-800/60 rounded-md hover:bg-amber-900/50 transition-colors whitespace-nowrap"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Panel</span>
            </button>
          )}

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleWhatsAppClick}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap"
          >
            <MessageSquare className="w-4 h-4 fill-current" />
            <span>Chat on WhatsApp</span>
          </a>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-neutral-400 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-neutral-950 border-b border-neutral-800 px-4 pt-3 pb-5 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                onNavigate(item.path);
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left py-2.5 px-3 rounded-md text-sm font-medium ${
                currentPath === item.path ? 'bg-neutral-900 text-amber-400' : 'text-neutral-300 hover:bg-neutral-900 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}

          {isAdmin && (
            <button
              onClick={() => {
                onNavigate('/admin');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2.5 px-3 rounded-md text-sm font-medium text-amber-400 bg-amber-950/30"
            >
              Dealer Admin Dashboard
            </button>
          )}

          {settings?.phone && (
            <a
              href={`tel:${settings.phone}`}
              className="flex items-center gap-2 py-2 px-3 text-xs text-neutral-400"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call: {settings.phone}</span>
            </a>
          )}
        </div>
      )}
    </header>
  );
};
