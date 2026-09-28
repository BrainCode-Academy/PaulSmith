import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

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

export interface AnalyticsEvent {
  id: string;
  eventType: 'vehicle_view' | 'whatsapp_click' | 'call_click' | 'vehicle_share' | 'import_submit' | 'find_car_submit' | 'page_view';
  vehicleId?: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

export interface BrandModelItem {
  id: string;
  name: string;
  years: number[];
}

export interface BrandCatalogItem {
  id: string;
  name: string;
  logo?: string;
  models: BrandModelItem[];
}

export interface BrandHierarchyResult {
  id: string;
  name: string;
  logo?: string;
  models: {
    id: string;
    name: string;
    years: number[];
  }[];
  vehicleCount: number;
}

export interface DatabaseSchema {
  settings: DealerSettings;
  vehicles: Vehicle[];
  leads: Lead[];
  importRequests: ImportRequest[];
  carRequests: CarRequest[];
  reviews: Review[];
  auditLogs: AuditLog[];
  analyticsEvents: AnalyticsEvent[];
  brandCatalog?: BrandCatalogItem[];
  admin: {
    username: string;
    passwordHash: string;
    salt: string;
  };
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

const defaultSalt = 'autoprime_salt_2026';
const initialAdminPasswordHash = hashPassword('admin123', defaultSalt);

const initialData: DatabaseSchema = {
  settings: {
    id: 'default',
    businessName: 'Paul Smith Autos',
    tagline: 'Certified Automobile Showroom & Direct Import Sourcing',
    whatsappNumber: '+2348037781788',
    whatsappGroupLink: 'https://chat.whatsapp.com/KPf3ssd38y35dyrty1WsYf?s=qt&p=a&mlu=4&ilr=4',
    phone: '08037781788',
    email: 'paulsmithautos@gmail.com',
    address: 'Plot 14, Auto Boulevard, Victoria Island / Lekki Expressway, Lagos, Nigeria',
    businessDescription: 'Paul Smith Autos is a premier automotive dealership and direct vehicle import specialist. Founded by Paul Smith, we guarantee 100% verified sound engines, original customs documentation, and zero compromises on mechanical integrity. No fakes, no altered odometers, and direct personal service.',
    ceoName: 'Paul Smith',
    ceoTitle: 'Founder & CEO',
    ceoImage: '/images/ceo_paul_smith_1790590776884.jpg',
    ceoPhone: '08037781788',
    ceoQuote: 'At Paul Smith Autos, we inspect every car down to the bolt. No accident-concealed vehicles, no tampered odometers. You deal directly with a team that values your safety and hard-earned capital.',
    importCountries: ['China', 'United States', 'Canada', 'Germany', 'Japan'],
    currency: 'NGN',
    currencySymbol: '₦',
    facebook: '',
    instagram: '',
    tiktok: '',
    businessHours: 'Monday – Saturday: 8:30 AM – 6:30 PM',
    inspectionOffered: true,
    sourcingProcess: [
      'Tell us your vehicle specification, preferred year and budget',
      'Direct sourcing inspection and verified pricing breakdown',
      'Port clearance and transparent logistics tracking',
      'Final vehicle handover with full documentation'
    ],
    updatedAt: new Date().toISOString()
  },
  vehicles: [
    {
      id: 'v-prado-2023',
      slug: '2023-toyota-land-cruiser-prado-txl',
      title: '2023 Toyota Land Cruiser Prado TX-L',
      make: 'Toyota',
      model: 'Land Cruiser Prado',
      year: 2023,
      price: 78500000,
      currency: 'NGN',
      mileage: 12500,
      mileageUnit: 'km',
      transmission: 'Automatic',
      fuel: 'Diesel',
      bodyType: 'SUV',
      condition: 'Foreign Used',
      status: 'Available',
      location: 'Showroom Ready',
      vin: 'JTEBX3FJ5P0019284',
      engine: '2.8L D-4D Turbocharged 4-Cylinder',
      driveType: '4WD',
      color: 'Dark Metallic Grey',
      interiorColor: 'Black Leather',
      description: 'Exceptional 2023 Toyota Land Cruiser Prado TX-L. Features multi-terrain select, 360-degree surround cameras, triple-zone climate control, keyless smart entry, cooler box, and full LED adaptive illumination. Thoroughly inspected and showroom ready.',
      features: [
        'Multi-Terrain Select & Crawl Control',
        '360-Degree Surround View Cameras',
        'Center Console Refrigerator (Cooler Box)',
        'Push Button Start & Smart Keyless Entry',
        'Touchscreen Infotainment with Apple CarPlay',
        'Electric Leather Seats with Memory Setting'
      ],
      images: [
        '/images/vehicle_suv_prado_1790168736955.jpg',
        '/images/hero_car_showroom_1790168724059.jpg'
      ],
      featured: true,
      published: true,
      viewsCount: 142,
      inquiriesCount: 28,
      createdAt: '2026-03-01T10:00:00.000Z',
      updatedAt: '2026-03-20T14:30:00.000Z'
    },
    {
      id: 'v-camry-2022',
      slug: '2022-toyota-camry-xse',
      title: '2022 Toyota Camry XSE Luxury Sedan',
      make: 'Toyota',
      model: 'Camry',
      year: 2022,
      price: 36000000,
      currency: 'NGN',
      mileage: 28400,
      mileageUnit: 'km',
      transmission: 'Automatic',
      fuel: 'Petrol',
      bodyType: 'Sedan',
      condition: 'Foreign Used',
      status: 'Available',
      location: 'Showroom Ready',
      vin: '4T1B11HK5NU382910',
      engine: '2.5L Dynamic Force 4-Cylinder DOHC',
      driveType: 'FWD',
      color: 'Pearl White Metallic',
      interiorColor: 'Cockpit Red & Black Leather',
      description: 'Pristine 2022 Toyota Camry XSE with full sport appearance package. Dual chrome quad exhaust tips, panoramic glass sunroof, Qi wireless smartphone charging, JBL premium sound system, and Toyota Safety Sense suite.',
      features: [
        'Panoramic Dual-Pane Sunroof',
        'Sport-Tuned Suspension & Dual Exhaust',
        'JBL 9-Speaker Audio System',
        'Full LED Headlights & Taillights',
        'Blind Spot Monitor with Rear Cross Traffic Alert',
        'Dual-Zone Automatic Climate Control'
      ],
      images: [
        '/images/vehicle_sedan_camry_1790168748387.jpg',
        '/images/hero_car_showroom_1790168724059.jpg'
      ],
      featured: true,
      published: true,
      viewsCount: 219,
      inquiriesCount: 45,
      createdAt: '2026-03-05T12:00:00.000Z',
      updatedAt: '2026-03-22T09:15:00.000Z'
    },
    {
      id: 'v-lexus-rx-2021',
      slug: '2021-lexus-rx-350-awd',
      title: '2021 Lexus RX 350 AWD Luxury',
      make: 'Lexus',
      model: 'RX 350',
      year: 2021,
      price: 49500000,
      currency: 'NGN',
      mileage: 34100,
      mileageUnit: 'km',
      transmission: 'Automatic',
      fuel: 'Petrol',
      bodyType: 'Crossover',
      condition: 'Foreign Used',
      status: 'Available',
      location: 'Showroom Ready',
      vin: '2T2BZMCA4MC198273',
      engine: '3.5L V6 24-Valve DOHC',
      driveType: 'AWD',
      color: 'Midnight Blue Mica',
      interiorColor: 'Parchment Semi-Aniline Leather',
      description: 'Luxurious 2021 Lexus RX 350 All-Wheel Drive. Smooth V6 power, whisper-quiet cabin insulation, wood-trimmed heated steering wheel, power hands-free tailgate, and comprehensive Lexus Safety System+ 2.0.',
      features: [
        'Active Torque Control All-Wheel Drive',
        '12.3-inch Multimedia Navigation Display',
        'Heated & Ventilated Front Seats',
        'Power Rear Tailgate with Kick Sensor',
        'Pre-Collision System with Pedestrian Detection',
        'Panoramic Moonroof'
      ],
      images: [
        '/images/vehicle_luxury_lexus_1790168762494.jpg',
        '/images/hero_car_showroom_1790168724059.jpg'
      ],
      featured: true,
      published: true,
      viewsCount: 185,
      inquiriesCount: 36,
      createdAt: '2026-03-10T15:00:00.000Z',
      updatedAt: '2026-03-21T11:45:00.000Z'
    }
  ],
  leads: [
    {
      id: 'lead-1',
      name: 'Emeka Okafor',
      phone: '+2348034567890',
      whatsapp: '+2348034567890',
      vehicleId: 'v-prado-2023',
      vehicleTitle: '2023 Toyota Land Cruiser Prado TX-L',
      source: 'whatsapp_cta',
      message: 'Hello, I saw the 2023 Prado on your website. Is it available for showroom inspection this Friday?',
      budget: '₦75,000,000',
      status: 'Negotiating',
      notes: [
        {
          id: 'n1',
          text: 'Customer requested inspection on Friday. Sent vehicle walk-around video via WhatsApp.',
          createdAt: '2026-03-21T16:00:00.000Z',
          author: 'Admin'
        }
      ],
      createdAt: '2026-03-21T15:20:00.000Z',
      updatedAt: '2026-03-21T16:00:00.000Z'
    }
  ],
  importRequests: [
    {
      id: 'imp-1',
      fullName: 'Tunde Adeleke',
      whatsappNumber: '+2348123456789',
      preferredBrand: 'BYD',
      preferredModel: 'Tang EV Flagship',
      preferredYear: '2024',
      budget: '$38,000 USD',
      condition: 'Brand New',
      preferredCountry: 'China',
      specificRequirements: 'All-wheel drive, dual motor, emerald green exterior, direct shipping from Shenzhen/Guangzhou.',
      additionalMessage: 'Please provide quotation including shipping and documentation to Lagos port.',
      status: 'Sourcing',
      notes: [
        {
          id: 'imp-n1',
          text: 'Reached out to verified supplier partner in Ningbo/Shenzhen. Gathering FOB and CIF rates.',
          createdAt: '2026-03-22T08:30:00.000Z'
        }
      ],
      createdAt: '2026-03-21T18:10:00.000Z'
    }
  ],
  carRequests: [
    {
      id: 'req-1',
      name: 'Fatima Aliyu',
      whatsapp: '+2348098765432',
      brand: 'Mercedes-Benz',
      model: 'GLE 450 AMG Line',
      year: '2022',
      budget: '₦85,000,000',
      condition: 'Foreign Used',
      transmission: 'Automatic',
      otherRequirements: 'Panoramic roof, Burmester sound, obsidian black or polar white.',
      status: 'Matching',
      createdAt: '2026-03-22T14:10:00.000Z'
    }
  ],
  reviews: [],
  auditLogs: [
    {
      id: 'log-1',
      action: 'SYSTEM_INITIALIZED',
      targetType: 'settings',
      targetId: 'default',
      details: 'Automobile dealership database initialized with persistent storage',
      timestamp: new Date().toISOString()
    }
  ],
  analyticsEvents: [],
  admin: {
    username: 'admin',
    passwordHash: initialAdminPasswordHash,
    salt: defaultSalt
  }
};

class Database {
  private data: DatabaseSchema;

  constructor() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
      } catch (err) {
        console.error('Failed reading existing DB file, writing initial:', err);
        this.data = initialData;
        this.persist();
      }
    } else {
      this.data = initialData;
      this.persist();
    }
  }

  private persist() {
    const tmp = `${DB_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tmp, JSON.stringify(this.data, null, 2), 'utf-8');
    fs.renameSync(tmp, DB_FILE);
  }

  // --- Settings ---
  getSettings(): DealerSettings {
    return { ...this.data.settings };
  }

  updateSettings(updates: Partial<DealerSettings>): DealerSettings {
    this.data.settings = {
      ...this.data.settings,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.logAudit('SETTINGS_UPDATED', 'settings', 'default', 'Dealer business profile updated');
    this.persist();
    return this.getSettings();
  }

  // --- Vehicles ---
  getVehicles(filters?: {
    make?: string;
    model?: string;
    minPrice?: number;
    maxPrice?: number;
    year?: number;
    condition?: string;
    transmission?: string;
    fuel?: string;
    status?: string;
    featured?: boolean;
    search?: string;
    publishedOnly?: boolean;
  }): Vehicle[] {
    let list = [...this.data.vehicles];

    if (filters?.publishedOnly !== false) {
      list = list.filter(v => v.published);
    }

    if (filters?.make) {
      const q = filters.make.toLowerCase();
      list = list.filter(v => v.make.toLowerCase() === q);
    }
    if (filters?.model) {
      const q = filters.model.toLowerCase();
      list = list.filter(v => v.model.toLowerCase().includes(q));
    }
    if (filters?.condition) {
      list = list.filter(v => v.condition === filters.condition);
    }
    if (filters?.status) {
      list = list.filter(v => v.status === filters.status);
    }
    if (filters?.transmission) {
      list = list.filter(v => v.transmission === filters.transmission);
    }
    if (filters?.fuel) {
      list = list.filter(v => v.fuel === filters.fuel);
    }
    if (filters?.featured !== undefined) {
      list = list.filter(v => v.featured === filters.featured);
    }
    if (filters?.year) {
      list = list.filter(v => v.year === filters.year);
    }
    if (filters?.minPrice !== undefined) {
      list = list.filter(v => v.price >= filters.minPrice!);
    }
    if (filters?.maxPrice !== undefined) {
      list = list.filter(v => v.price <= filters.maxPrice!);
    }
    if (filters?.search) {
      const s = filters.search.toLowerCase();
      list = list.filter(v =>
        v.title.toLowerCase().includes(s) ||
        v.make.toLowerCase().includes(s) ||
        v.model.toLowerCase().includes(s) ||
        v.description.toLowerCase().includes(s)
      );
    }

    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getVehicleBySlugOrId(idOrSlug: string): Vehicle | null {
    const v = this.data.vehicles.find(item => item.id === idOrSlug || item.slug === idOrSlug);
    return v ? { ...v } : null;
  }

  createVehicle(vehicle: Omit<Vehicle, 'id' | 'slug' | 'viewsCount' | 'inquiriesCount' | 'createdAt' | 'updatedAt'>): Vehicle {
    const id = `v-${Date.now()}`;
    const slugBase = `${vehicle.year}-${vehicle.make}-${vehicle.model}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    let slug = slugBase;
    let counter = 1;
    while (this.data.vehicles.some(v => v.slug === slug)) {
      slug = `${slugBase}-${counter++}`;
    }

    const newVehicle: Vehicle = {
      ...vehicle,
      id,
      slug,
      viewsCount: 0,
      inquiriesCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.data.vehicles.unshift(newVehicle);
    this.logAudit('VEHICLE_CREATED', 'vehicle', id, `Created vehicle ${newVehicle.title}`);
    this.persist();
    return newVehicle;
  }

  updateVehicle(id: string, updates: Partial<Vehicle>): Vehicle | null {
    const idx = this.data.vehicles.findIndex(v => v.id === id);
    if (idx === -1) return null;

    const existing = this.data.vehicles[idx];
    const updated: Vehicle = {
      ...existing,
      ...updates,
      id: existing.id,
      updatedAt: new Date().toISOString()
    };

    this.data.vehicles[idx] = updated;
    this.logAudit('VEHICLE_UPDATED', 'vehicle', id, `Updated vehicle ${updated.title}`);
    this.persist();
    return updated;
  }

  deleteVehicle(id: string): boolean {
    const idx = this.data.vehicles.findIndex(v => v.id === id);
    if (idx === -1) return false;
    const title = this.data.vehicles[idx].title;
    this.data.vehicles.splice(idx, 1);
    this.logAudit('VEHICLE_DELETED', 'vehicle', id, `Deleted vehicle ${title}`);
    this.persist();
    return true;
  }

  incrementVehicleStats(id: string, type: 'view' | 'inquiry') {
    const v = this.data.vehicles.find(item => item.id === id);
    if (v) {
      if (type === 'view') v.viewsCount = (v.viewsCount || 0) + 1;
      if (type === 'inquiry') v.inquiriesCount = (v.inquiriesCount || 0) + 1;
      this.persist();
    }
  }

  // --- Brand & Model Hierarchy Catalog ---
  getBrandHierarchy(): BrandHierarchyResult[] {
    const catalog = this.data.brandCatalog || [];
    const vehicles = this.data.vehicles.filter(v => v.published);

    const brandMap = new Map<string, {
      id: string;
      name: string;
      logo?: string;
      modelsMap: Map<string, { id: string; name: string; yearsSet: Set<number> }>;
      count: number;
    }>();

    // 1. Seed from defined brandCatalog
    for (const b of catalog) {
      const bKey = b.name.trim().toLowerCase();
      const modelsMap = new Map<string, { id: string; name: string; yearsSet: Set<number> }>();
      for (const m of (b.models || [])) {
        modelsMap.set(m.name.trim().toLowerCase(), {
          id: m.id,
          name: m.name.trim(),
          yearsSet: new Set(m.years || [])
        });
      }
      brandMap.set(bKey, {
        id: b.id,
        name: b.name.trim(),
        logo: b.logo,
        modelsMap,
        count: 0
      });
    }

    // 2. Aggregate from live vehicles in database
    for (const v of vehicles) {
      if (!v.make) continue;
      const bKey = v.make.trim().toLowerCase();
      let brandEntry = brandMap.get(bKey);
      if (!brandEntry) {
        brandEntry = {
          id: `b-${bKey.replace(/[^a-z0-9]+/g, '-')}`,
          name: v.make.trim(),
          modelsMap: new Map(),
          count: 0
        };
        brandMap.set(bKey, brandEntry);
      }

      if (v.status === 'Available') {
        brandEntry.count += 1;
      }

      if (v.model) {
        const mKey = v.model.trim().toLowerCase();
        let modelEntry = brandEntry.modelsMap.get(mKey);
        if (!modelEntry) {
          modelEntry = {
            id: `m-${mKey.replace(/[^a-z0-9]+/g, '-')}`,
            name: v.model.trim(),
            yearsSet: new Set()
          };
          brandEntry.modelsMap.set(mKey, modelEntry);
        }
        if (v.year) {
          modelEntry.yearsSet.add(v.year);
        }
      }
    }

    // Convert to sorted result array
    const results: BrandHierarchyResult[] = [];
    for (const [, b] of brandMap) {
      const models = Array.from(b.modelsMap.values()).map(m => ({
        id: m.id,
        name: m.name,
        years: Array.from(m.yearsSet).sort((x, y) => y - x)
      })).sort((a, b) => a.name.localeCompare(b.name));

      results.push({
        id: b.id,
        name: b.name,
        logo: b.logo,
        models,
        vehicleCount: b.count
      });
    }

    return results.sort((a, b) => {
      if (b.vehicleCount !== a.vehicleCount) {
        return b.vehicleCount - a.vehicleCount;
      }
      return a.name.localeCompare(b.name);
    });
  }

  addBrand(name: string, logo?: string): BrandCatalogItem {
    if (!this.data.brandCatalog) this.data.brandCatalog = [];
    const id = `b-${Date.now()}`;
    const newBrand: BrandCatalogItem = {
      id,
      name: name.trim(),
      logo: logo || '',
      models: []
    };
    this.data.brandCatalog.push(newBrand);
    this.logAudit('BRAND_CREATED', 'settings', id, `Added brand ${newBrand.name}`);
    this.persist();
    return newBrand;
  }

  deleteBrand(id: string): boolean {
    if (!this.data.brandCatalog) return false;
    const idx = this.data.brandCatalog.findIndex(b => b.id === id);
    if (idx === -1) return false;
    const name = this.data.brandCatalog[idx].name;
    this.data.brandCatalog.splice(idx, 1);
    this.logAudit('BRAND_DELETED', 'settings', id, `Deleted brand ${name}`);
    this.persist();
    return true;
  }

  addModel(brandId: string, modelName: string, years: number[]): BrandCatalogItem | null {
    if (!this.data.brandCatalog) this.data.brandCatalog = [];
    const brand = this.data.brandCatalog.find(b => b.id === brandId);
    if (!brand) return null;
    const modelId = `m-${Date.now()}`;
    brand.models.push({
      id: modelId,
      name: modelName.trim(),
      years: years.sort((a, b) => b - a)
    });
    this.logAudit('MODEL_CREATED', 'settings', modelId, `Added model ${modelName} to ${brand.name}`);
    this.persist();
    return brand;
  }

  deleteModel(brandId: string, modelId: string): BrandCatalogItem | null {
    if (!this.data.brandCatalog) return null;
    const brand = this.data.brandCatalog.find(b => b.id === brandId);
    if (!brand) return null;
    const idx = brand.models.findIndex(m => m.id === modelId);
    if (idx === -1) return null;
    brand.models.splice(idx, 1);
    this.persist();
    return brand;
  }

  // --- Leads ---
  getLeads(status?: string): Lead[] {
    let list = [...this.data.leads];
    if (status) {
      list = list.filter(l => l.status === status);
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  createLead(lead: Omit<Lead, 'id' | 'notes' | 'createdAt' | 'updatedAt'>): Lead {
    const newLead: Lead = {
      ...lead,
      id: `lead-${Date.now()}`,
      notes: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.leads.unshift(newLead);
    if (lead.vehicleId) {
      this.incrementVehicleStats(lead.vehicleId, 'inquiry');
    }
    this.logAudit('LEAD_CREATED', 'lead', newLead.id, `New lead received from ${newLead.name}`);
    this.persist();
    return newLead;
  }

  updateLeadStatus(id: string, status: Lead['status'], noteText?: string): Lead | null {
    const lead = this.data.leads.find(l => l.id === id);
    if (!lead) return null;
    lead.status = status;
    lead.updatedAt = new Date().toISOString();
    if (noteText) {
      lead.notes.push({
        id: `note-${Date.now()}`,
        text: noteText,
        createdAt: new Date().toISOString(),
        author: 'Admin'
      });
    }
    this.logAudit('LEAD_STATUS_UPDATED', 'lead', id, `Status changed to ${status}`);
    this.persist();
    return lead;
  }

  addLeadNote(id: string, text: string, author = 'Admin'): Lead | null {
    const lead = this.data.leads.find(l => l.id === id);
    if (!lead) return null;
    lead.notes.push({
      id: `note-${Date.now()}`,
      text,
      createdAt: new Date().toISOString(),
      author
    });
    lead.updatedAt = new Date().toISOString();
    this.persist();
    return lead;
  }

  // --- Import Requests ---
  getImportRequests(): ImportRequest[] {
    return [...this.data.importRequests].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  createImportRequest(req: Omit<ImportRequest, 'id' | 'status' | 'notes' | 'createdAt'>): ImportRequest {
    const newReq: ImportRequest = {
      ...req,
      id: `imp-${Date.now()}`,
      status: 'New',
      notes: [],
      createdAt: new Date().toISOString()
    };
    this.data.importRequests.unshift(newReq);
    this.logAudit('IMPORT_REQUEST_CREATED', 'import_request', newReq.id, `Import request for ${req.preferredBrand} ${req.preferredModel}`);
    this.persist();
    return newReq;
  }

  updateImportRequestStatus(id: string, status: ImportRequest['status'], noteText?: string): ImportRequest | null {
    const req = this.data.importRequests.find(r => r.id === id);
    if (!req) return null;
    req.status = status;
    if (noteText) {
      req.notes.push({
        id: `note-${Date.now()}`,
        text: noteText,
        createdAt: new Date().toISOString()
      });
    }
    this.persist();
    return req;
  }

  // --- Find My Car Requests ---
  getCarRequests(): CarRequest[] {
    return [...this.data.carRequests].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  createCarRequest(req: Omit<CarRequest, 'id' | 'status' | 'createdAt'>): CarRequest {
    const newReq: CarRequest = {
      ...req,
      id: `req-${Date.now()}`,
      status: 'New',
      createdAt: new Date().toISOString()
    };
    this.data.carRequests.unshift(newReq);
    this.persist();
    return newReq;
  }

  updateCarRequestStatus(id: string, status: CarRequest['status']): CarRequest | null {
    const req = this.data.carRequests.find(r => r.id === id);
    if (!req) return null;
    req.status = status;
    this.persist();
    return req;
  }

  // --- Customer Reviews (Genuine dealer reviews only) ---
  getReviews(publishedOnly = true): Review[] {
    let list = [...this.data.reviews];
    if (publishedOnly) {
      list = list.filter(r => r.published);
    }
    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  createReview(rev: Omit<Review, 'id'>): Review {
    const newRev: Review = {
      ...rev,
      id: `rev-${Date.now()}`
    };
    this.data.reviews.unshift(newRev);
    this.persist();
    return newRev;
  }

  deleteReview(id: string): boolean {
    const idx = this.data.reviews.findIndex(r => r.id === id);
    if (idx === -1) return false;
    this.data.reviews.splice(idx, 1);
    this.persist();
    return true;
  }

  // --- Audit Logs ---
  private logAudit(action: string, targetType: AuditLog['targetType'], targetId: string, details: string) {
    const log: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      action,
      targetType,
      targetId,
      details,
      timestamp: new Date().toISOString()
    };
    this.data.auditLogs.unshift(log);
    if (this.data.auditLogs.length > 500) {
      this.data.auditLogs = this.data.auditLogs.slice(0, 500);
    }
  }

  getAuditLogs(limit = 100): AuditLog[] {
    return this.data.auditLogs.slice(0, limit);
  }

  // --- Analytics ---
  trackAnalytics(event: Omit<AnalyticsEvent, 'id' | 'timestamp'>): AnalyticsEvent {
    const ev: AnalyticsEvent = {
      ...event,
      id: `ev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString()
    };
    this.data.analyticsEvents.unshift(ev);
    if (this.data.analyticsEvents.length > 2000) {
      this.data.analyticsEvents = this.data.analyticsEvents.slice(0, 2000);
    }
    this.persist();
    return ev;
  }

  getAnalyticsSummary() {
    const events = this.data.analyticsEvents;
    const totalViews = events.filter(e => e.eventType === 'page_view' || e.eventType === 'vehicle_view').length;
    const vehicleViews = events.filter(e => e.eventType === 'vehicle_view').length;
    const whatsappClicks = events.filter(e => e.eventType === 'whatsapp_click').length;
    const callClicks = events.filter(e => e.eventType === 'call_click').length;
    const vehicleShares = events.filter(e => e.eventType === 'vehicle_share').length;
    const importSubmits = events.filter(e => e.eventType === 'import_submit').length;

    return {
      totalViews,
      vehicleViews,
      whatsappClicks,
      callClicks,
      vehicleShares,
      importSubmits,
      recentEvents: events.slice(0, 20)
    };
  }

  // --- Stats ---
  getStats() {
    const vehicles = this.data.vehicles;
    return {
      totalVehicles: vehicles.length,
      availableVehicles: vehicles.filter(v => v.status === 'Available').length,
      soldVehicles: vehicles.filter(v => v.status === 'Sold').length,
      reservedVehicles: vehicles.filter(v => v.status === 'Reserved').length,
      totalLeads: this.data.leads.length,
      newLeads: this.data.leads.filter(l => l.status === 'New').length,
      importRequests: this.data.importRequests.length,
      newImportRequests: this.data.importRequests.filter(r => r.status === 'New').length,
      carRequests: this.data.carRequests.length,
      newCarRequests: this.data.carRequests.filter(r => r.status === 'New').length,
      reviewsCount: this.data.reviews.length
    };
  }

  // --- Authentication ---
  verifyAdminPassword(password: string): boolean {
    const hash = hashPassword(password, this.data.admin.salt);
    return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(this.data.admin.passwordHash));
  }

  updateAdminPassword(oldPassword: string, newPassword: string): boolean {
    if (!this.verifyAdminPassword(oldPassword)) return false;
    const salt = crypto.randomBytes(16).toString('hex');
    this.data.admin.salt = salt;
    this.data.admin.passwordHash = hashPassword(newPassword, salt);
    this.logAudit('ADMIN_PASSWORD_CHANGED', 'auth', 'admin', 'Admin password successfully updated');
    this.persist();
    return true;
  }
}

export const db = new Database();
