export interface DealerSettings {
  id: string;
  businessName: string;
  tagline: string;
  whatsappNumber: string;
  whatsappGroupLink: string;
  phone: string;
  email: string;
  address: string;
  businessDescription: string;
  ceoName?: string;
  ceoTitle?: string;
  ceoImage?: string;
  ceoPhone?: string;
  ceoQuote?: string;
  importCountries: string[];
  currency: string;
  currencySymbol: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  businessHours: string;
  inspectionOffered: boolean;
  sourcingProcess: string[];
  updatedAt: string;
}

export interface Vehicle {
  id: string;
  slug: string;
  title: string;
  make: string;
  model: string;
  year: number;
  price: number;
  currency: string;
  mileage: number;
  mileageUnit: 'km' | 'miles';
  transmission: 'Automatic' | 'Manual';
  fuel: 'Petrol' | 'Diesel' | 'Hybrid' | 'Electric';
  bodyType: 'SUV' | 'Sedan' | 'Coupe' | 'Hatchback' | 'Truck' | 'Crossover';
  condition: 'Brand New' | 'Foreign Used' | 'Locally Used' | 'In Transit';
  status: 'Available' | 'Reserved' | 'Sold' | 'Coming Soon' | 'In Transit';
  location: string;
  vin: string;
  engine: string;
  driveType: '4WD' | 'AWD' | 'FWD' | 'RWD';
  color: string;
  interiorColor: string;
  description: string;
  features: string[];
  images: string[];
  videoUrl?: string;
  featured: boolean;
  featuredOrder?: number;
  heroSlideEnabled?: boolean;
  published: boolean;
  viewsCount: number;
  inquiriesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  whatsapp: string;
  vehicleId?: string;
  vehicleTitle?: string;
  source: 'whatsapp_cta' | 'vehicle_detail' | 'general_contact' | 'direct_call' | 'import_funnel';
  message: string;
  budget?: string;
  status: 'New' | 'Contacted' | 'Negotiating' | 'Inspection' | 'Purchased' | 'Closed' | 'Not Interested';
  notes: { id: string; text: string; createdAt: string; author: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface ImportRequest {
  id: string;
  fullName: string;
  whatsappNumber: string;
  preferredBrand: string;
  preferredModel: string;
  preferredYear: string;
  budget: string;
  condition: 'Brand New' | 'Used' | 'Any';
  preferredCountry: string;
  specificRequirements: string;
  additionalMessage: string;
  status: 'New' | 'In Review' | 'Sourcing' | 'Found Options' | 'Closed';
  notes: { id: string; text: string; createdAt: string }[];
  createdAt: string;
}

export interface CarRequest {
  id: string;
  name: string;
  whatsapp: string;
  brand: string;
  model: string;
  year: string;
  budget: string;
  condition: string;
  transmission: string;
  otherRequirements: string;
  status: 'New' | 'Contacted' | 'Matching' | 'Closed';
  createdAt: string;
}

export interface Review {
  id: string;
  customerName: string;
  vehiclePurchased: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
  published: boolean;
}

export interface AuditLog {
  id: string;
  action: string;
  targetType: 'vehicle' | 'lead' | 'settings' | 'import_request' | 'auth';
  targetId: string;
  details: string;
  timestamp: string;
}

export interface AdminStats {
  totalVehicles: number;
  availableVehicles: number;
  soldVehicles: number;
  reservedVehicles: number;
  totalLeads: number;
  newLeads: number;
  importRequests: number;
  newImportRequests: number;
  carRequests: number;
  newCarRequests: number;
  reviewsCount: number;
}

export interface BrandModelItem {
  id: string;
  name: string;
  years: number[];
  category?: string;
}

export interface BrandCatalogItem {
  id: string;
  name: string;
  country?: string;
  region?: string;
  logo?: string;
  enabled?: boolean;
  models: BrandModelItem[];
}

export interface BrandHierarchyResult {
  id: string;
  name: string;
  country?: string;
  region?: string;
  logo?: string;
  enabled?: boolean;
  models: {
    id: string;
    name: string;
    years: number[];
    category?: string;
  }[];
  vehicleCount: number;
}
