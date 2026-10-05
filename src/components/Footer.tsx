import React from 'react';
import { MessageSquare, Phone, Mail, Clock, MapPin, Users, Shield } from 'lucide-react';
import { useDealer } from '../context/DealerContext';
import { buildWhatsAppLink, getGeneralWhatsAppMessage } from '../lib/whatsapp';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { settings } = useDealer();
  const businessName = settings?.businessName || 'Paul Smith Autos';
  const whatsappUrl = buildWhatsAppLink(
    settings?.whatsappNumber || '',
    getGeneralWhatsAppMessage(businessName)
  );

  return (
    <footer className="bg-[#080c14] border-t border-slate-900 text-slate-400 text-sm">
      {/* WhatsApp Community Banner if link provided */}
      {settings?.whatsappGroupLink && (
        <div className="bg-gradient-to-r from-emerald-950/30 via-slate-900/60 to-[#080c14] border-b border-emerald-900/20 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-semibold">Join Our VIP WhatsApp Community</h4>
                <p className="text-xs text-slate-400">
                  Receive instant notifications when fresh inventory and direct import slots become available.
                </p>
              </div>
            </div>
            <a
              href={settings.whatsappGroupLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shadow-sm shadow-emerald-950/40"
            >
              Join WhatsApp Group
            </a>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand & Overview */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <h3 className="text-white text-lg font-bold tracking-tight">{businessName}</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {settings?.businessDescription ||
                'Direct automotive vehicle sales and customized import sourcing from China and global auto markets. Transparent communication and documented vehicle history.'}
            </p>
            {settings?.importCountries && settings.importCountries.length > 0 && (
              <div className="pt-2 text-xs text-slate-400">
                <span className="text-slate-300 font-medium">Sourcing Hubs:</span>{' '}
                <span>{settings.importCountries.join(' · ')}</span>
              </div>
            )}
          </div>

          {/* Quick Showroom Links */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-slate-200 font-semibold">Showroom</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('/cars')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Browse Available Cars
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/brands')}
                  className="hover:text-white transition-colors cursor-pointer text-left text-slate-300 hover:text-blue-400"
                >
                  All Car Brands Directory
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/import-a-car')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Custom Vehicle Import
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/find-my-car')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Vehicle Request (Find My Car)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/how-it-works')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/about')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  About Dealership & CEO
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-slate-200 font-semibold">Showroom & Direct Contact</h4>
            <ul className="space-y-2.5 text-xs">
              {settings?.phone && (
                <li>
                  <a
                    href={`tel:${settings.phone}`}
                    className="flex items-center gap-2 hover:text-white transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{settings.phone}</span>
                  </a>
                </li>
              )}
              {settings?.whatsappNumber && (
                <li>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-emerald-400 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0 fill-current" />
                    <span>WhatsApp: {settings.whatsappNumber}</span>
                  </a>
                </li>
              )}
              {settings?.email && (
                <li>
                  <a
                    href={`mailto:${settings.email}`}
                    className="flex items-center gap-2 hover:text-white transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{settings.email}</span>
                  </a>
                </li>
              )}
              {settings?.address && (
                <li className="flex items-start gap-2 text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{settings.address}</span>
                </li>
              )}
              {settings?.businessHours && (
                <li className="flex items-center gap-2 text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{settings.businessHours}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Social & Admin Access */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-slate-200 font-semibold">Connect & Management</h4>
            <div className="flex flex-col gap-2 text-xs">
              {settings?.facebook && (
                <a
                  href={settings.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Facebook Page
                </a>
              )}
              {settings?.instagram && (
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Instagram
                </a>
              )}
              {settings?.tiktok && (
                <a
                  href={settings.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  TikTok
                </a>
              )}
            </div>

            <div className="pt-4 border-t border-slate-900">
              <button
                onClick={() => onNavigate('/admin')}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-blue-400 transition-colors cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Dealer Administration Portal</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {businessName}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <button
              onClick={() => onNavigate('/privacy')}
              className="hover:text-slate-400 transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => onNavigate('/terms')}
              className="hover:text-slate-400 transition-colors cursor-pointer"
            >
              Terms & Conditions
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => onNavigate('/admin')}
              className="hover:text-blue-400 transition-colors cursor-pointer"
            >
              Admin Login
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
