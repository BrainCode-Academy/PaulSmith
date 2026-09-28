import { Vehicle, DealerSettings } from '../types';

export function cleanPhoneNumber(phone: string): string {
  if (!phone) return '';
  let digits = phone.replace(/[^0-9]/g, '');
  if (digits.startsWith('0') && digits.length === 11) {
    digits = '234' + digits.slice(1);
  }
  return digits;
}

export function formatPrice(amount: number, currency = 'NGN', symbol = '₦'): string {
  if (!amount || isNaN(amount)) return 'Price on Request';
  return `${symbol}${amount.toLocaleString()}`;
}

export function buildWhatsAppLink(phone: string, message: string): string {
  const clean = cleanPhoneNumber(phone);
  if (!clean) return '#';
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
}

export function getVehicleInquiryMessage(vehicle: Vehicle, settings?: DealerSettings): string {
  const dealership = settings?.businessName || 'Paul Smith Autos';
  return `Hello ${dealership}, I am interested in the ${vehicle.year} ${vehicle.make} ${vehicle.model} listed on your website. Is it still available?`;
}

export function getVehicleVideoRequestMessage(vehicle: Vehicle): string {
  return `Hello, I would like to request a walk-around video of the ${vehicle.year} ${vehicle.make} ${vehicle.model} listed on your showroom website.`;
}

export function getVehicleInspectionMessage(vehicle: Vehicle): string {
  return `Hello, I would like to schedule an inspection for the ${vehicle.year} ${vehicle.make} ${vehicle.model}. What times are available?`;
}

export function getVehicleOfferMessage(vehicle: Vehicle, settings?: DealerSettings): string {
  const priceStr = formatPrice(vehicle.price, vehicle.currency, settings?.currencySymbol || '₦');
  return `Hello, I want to make an offer on the ${vehicle.year} ${vehicle.make} ${vehicle.model} (Listed at ${priceStr}).`;
}

export function getGeneralWhatsAppMessage(businessName: string): string {
  return `Hello ${businessName}, I am browsing your online showroom and would like to inquire about available vehicles and import services.`;
}

export function getImportInquiryMessage(req: {
  fullName: string;
  preferredBrand: string;
  preferredModel: string;
  preferredYear?: string;
  budget?: string;
  country?: string;
}): string {
  return `Hello, my name is ${req.fullName}. I submitted a custom vehicle import request for a ${req.preferredYear || ''} ${req.preferredBrand} ${req.preferredModel} from ${req.country || 'China'}. My approximate budget is ${req.budget || 'open'}. Looking forward to discussing details.`;
}

// ----------------------------------------------------
// Social Post Generators for Dealer Copy & Paste
// ----------------------------------------------------
export function generateWhatsAppStatusPost(vehicle: Vehicle, settings: DealerSettings, siteUrl: string): string {
  const priceStr = formatPrice(vehicle.price, vehicle.currency, settings.currencySymbol);
  const vehicleUrl = `${siteUrl}/cars/${vehicle.slug}`;
  const locationLine = vehicle.location ? `\n📍 ${vehicle.location}` : '';

  return `🚘 ${vehicle.year} ${vehicle.make} ${vehicle.model}

💰 Price: ${priceStr}
⚙️ Transmission: ${vehicle.transmission}
⛽ Fuel: ${vehicle.fuel}
🎯 Condition: ${vehicle.condition}${locationLine}

${vehicle.description.slice(0, 140)}...

🔗 Full Photos & Specs:
${vehicleUrl}

📲 Chat on WhatsApp:
${settings.whatsappNumber}`;
}

export function generateWhatsAppGroupPost(vehicle: Vehicle, settings: DealerSettings, siteUrl: string): string {
  const priceStr = formatPrice(vehicle.price, vehicle.currency, settings.currencySymbol);
  const vehicleUrl = `${siteUrl}/cars/${vehicle.slug}`;
  const topFeatures = vehicle.features.slice(0, 4).map(f => `• ${f}`).join('\n');

  return `🔥 NEW SHOWROOM INVENTORY 🔥

🚘 Vehicle: ${vehicle.year} ${vehicle.make} ${vehicle.model}
💰 Price: ${priceStr}
🛣️ Mileage: ${vehicle.mileage ? vehicle.mileage.toLocaleString() + ' ' + vehicle.mileageUnit : 'Undisclosed'}
⚙️ Transmission: ${vehicle.transmission}
⛽ Fuel: ${vehicle.fuel}
🛡️ Status: ${vehicle.status}

Key Highlights:
${topFeatures}

View Complete Gallery & Inspection Details:
👉 ${vehicleUrl}

Interested? Send a direct WhatsApp message:
📲 ${settings.whatsappNumber}
${settings.businessName}`;
}

export function generateFacebookPost(vehicle: Vehicle, settings: DealerSettings, siteUrl: string): string {
  const priceStr = formatPrice(vehicle.price, vehicle.currency, settings.currencySymbol);
  const vehicleUrl = `${siteUrl}/cars/${vehicle.slug}`;
  const locationLine = vehicle.location ? `\nLocation: ${vehicle.location}` : '';

  return `Available at ${settings.businessName}:

${vehicle.year} ${vehicle.make} ${vehicle.model}
Price: ${priceStr}
Condition: ${vehicle.condition}
Transmission: ${vehicle.transmission} | Fuel: ${vehicle.fuel}${locationLine}

${vehicle.description}

Key Features:
${vehicle.features.map(f => `- ${f}`).join('\n')}

Click the link below for complete photo gallery, specifications, and instant WhatsApp inquiry:
${vehicleUrl}

For quick inquiries, contact us on WhatsApp: ${settings.whatsappNumber}`;
}

export function generateInstagramCaption(vehicle: Vehicle, settings: DealerSettings, siteUrl: string): string {
  const priceStr = formatPrice(vehicle.price, vehicle.currency, settings.currencySymbol);

  return `${vehicle.year} ${vehicle.make} ${vehicle.model}
Showroom Status: ${vehicle.status}

Price: ${priceStr}
Condition: ${vehicle.condition}
Engine: ${vehicle.engine || 'Direct Specs'}
Transmission: ${vehicle.transmission}
Drive: ${vehicle.driveType}

${vehicle.description.slice(0, 160)}...

🔗 Link in bio to view full photos and request inspection!
WhatsApp: ${settings.whatsappNumber}

#${vehicle.make.replace(/\s+/g, '')} #${vehicle.model.replace(/\s+/g, '')} #CarSales #LuxuryCars #VehicleImport`;
}
