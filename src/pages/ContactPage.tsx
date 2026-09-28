import React, { useState } from 'react';
import { MessageSquare, Phone, Mail, MapPin, Clock, Send, CheckCircle2, Globe } from 'lucide-react';
import { useDealer } from '../context/DealerContext';
import { api } from '../lib/api';
import { buildWhatsAppLink, getGeneralWhatsAppMessage } from '../lib/whatsapp';

export const ContactPage: React.FC = () => {
  const { settings } = useDealer();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const businessName = settings?.businessName || 'Paul Smith Autos';
  const ceoPhone = settings?.ceoPhone || settings?.phone || '08037781788';
  const ceoWhatsApp = settings?.whatsappNumber || '+2348037781788';
  const whatsappUrl = buildWhatsAppLink(
    ceoWhatsApp,
    getGeneralWhatsAppMessage(businessName)
  );

  const directCeoWhatsappUrl = buildWhatsAppLink(
    ceoWhatsApp,
    `Hello Mr. Paul Smith, I am contacting you directly regarding vehicle acquisition from ${businessName}.`
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !message) {
      setErrorMessage('Please provide your Name, Phone/WhatsApp number, and Message.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      await api.createLead({
        name,
        phone,
        whatsapp: phone,
        source: 'general_contact',
        message,
      });

      api.trackEvent('contact_submit', undefined, { name });
      setSubmitted(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">Contact Our Team</h1>
        <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
          Have an inquiry regarding an available vehicle, import sourcing, or inspection? Reach out to us directly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Info Card */}
        <div className="lg:col-span-5 bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <h2 className="text-base font-bold text-white tracking-tight">Direct Showroom Channels</h2>

          {/* CEO Direct VIP Channel */}
          <div className="p-4 bg-amber-950/20 border border-amber-800/50 rounded-xl space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden border border-amber-700/60 shrink-0 bg-neutral-950">
                <img
                  src={settings?.ceoImage || '/images/ceo_paul_smith_1790590776884.jpg'}
                  alt="Paul Smith - CEO"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Paul Smith</span>
                <span className="text-[11px] text-amber-400 block font-medium">Founder & CEO</span>
                <span className="text-xs text-neutral-300 font-mono">{ceoPhone}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <a
                href={directCeoWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 fill-current" />
                <span>CEO WhatsApp</span>
              </a>
              <a
                href={`tel:${ceoPhone}`}
                className="py-2 px-3 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Direct</span>
              </a>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            {settings?.whatsappGroupLink && (
              <a
                href={settings.whatsappGroupLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-emerald-950/30 hover:bg-emerald-950/50 rounded-xl border border-emerald-800/60 text-emerald-300 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <MessageSquare className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <span className="text-[11px] text-emerald-400 font-bold block">VIP WhatsApp Community</span>
                  <span className="text-xs text-neutral-300">Join for fresh container arrival updates</span>
                </div>
              </a>
            )}

            {settings?.whatsappNumber && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-neutral-950 hover:bg-neutral-800/80 rounded-xl border border-neutral-800 text-neutral-300 hover:text-white transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                  <MessageSquare className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <span className="text-[11px] text-neutral-500 block">General WhatsApp Line</span>
                  <span className="font-semibold text-white">{settings.whatsappNumber}</span>
                </div>
              </a>
            )}

            {settings?.phone && (
              <a
                href={`tel:${settings.phone}`}
                className="flex items-center gap-3 p-3 bg-neutral-950 hover:bg-neutral-800/80 rounded-xl border border-neutral-800 text-neutral-300 hover:text-white transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center text-amber-400 shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] text-neutral-500 block">Showroom Desk</span>
                  <span className="font-semibold text-white">{settings.phone}</span>
                </div>
              </a>
            )}

            {settings?.email && (
              <a
                href={`mailto:${settings.email}`}
                className="flex items-center gap-3 p-3 bg-neutral-950 hover:bg-neutral-800/80 rounded-xl border border-neutral-800 text-neutral-300 hover:text-white transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] text-neutral-500 block">Direct Email</span>
                  <span className="font-semibold text-white">{settings.email}</span>
                </div>
              </a>
            )}

            {settings?.businessHours && (
              <div className="flex items-start gap-3 p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-neutral-300">
                <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-neutral-400 shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] text-neutral-500 block">Business Hours</span>
                  <span className="font-medium text-neutral-300">{settings.businessHours}</span>
                </div>
              </div>
            )}

            {settings?.address && (
              <div className="flex items-start gap-3 p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-neutral-300">
                <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-neutral-400 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] text-neutral-500 block">Location</span>
                  <span className="font-medium text-neutral-300">{settings.address}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-xl">
          {submitted ? (
            <div className="py-10 text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h2 className="text-xl font-bold text-white">Message Delivered</h2>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                Thank you, {name}. Our sales advisor has received your message and will contact you via WhatsApp shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold cursor-pointer pt-2"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-base font-bold text-white tracking-tight">Send an Inquiry</h2>

              {errorMessage && (
                <div className="p-3 bg-red-950/40 border border-red-800/80 rounded-lg text-xs text-red-300">
                  {errorMessage}
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. David Eze"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Phone or WhatsApp Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +234 800 000 0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Your Message or Question *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="How can we assist you today? Inquire about an available car, import advice, or inspection..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-neutral-950 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/10"
              >
                {loading ? (
                  <span>Sending...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message</span>
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
