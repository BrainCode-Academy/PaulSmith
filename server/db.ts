import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { COMPREHENSIVE_BRAND_CATALOG } from './brandCatalogData';
import { syncDocToFirestore, deleteDocFromFirestore, loadCollectionFromFirestore, getFirestoreDb } from './firebaseStorage.js';

export interface ShowroomSlide {
  id: string;
  url: string;
  caption?: string;
  order: number;
  enabled: boolean;
}

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
  showroomSlides?: ShowroomSlide[];
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
  source: 'whatsapp_cta' | 'vehicle_detail' | 'general_contact' | 'direct_call' | 'import_funnel' | 'quick_quote' | 'inspection' | 'offer';
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
    isInitialSetupRequired?: boolean;
  };
}

const IS_VERCEL = Boolean(process.env.VERCEL);
const DATA_DIR = IS_VERCEL ? path.join('/tmp', 'data') : path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

const defaultAdminPassword = process.env.ADMIN_PASSWORD;
const defaultSalt = 'autoprime_salt_2026';
const initialAdminPasswordHash = defaultAdminPassword ? hashPassword(defaultAdminPassword, defaultSalt) : '';

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
    ceoImage: '/WhatsApp Image 2026-09-29 at 8.55.15 AM.jpeg',
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
    showroomSlides: [
      {
        id: 'slide-1',
        url: '/images/hero_car_showroom_1790168724059.jpg',
        caption: 'Paul Smith Autos certified dealership showroom',
        order: 0,
        enabled: true
      },
      {
        id: 'slide-2',
        url: '/images/vehicle_luxury_lexus_1790168762494.jpg',
        caption: 'Vehicles displayed inside Paul Smith Autos showroom',
        order: 1,
        enabled: true
      },
      {
        id: 'slide-3',
        url: '/images/vehicle_suv_prado_1790168736955.jpg',
        caption: 'Showroom vehicle selection and inspection floor',
        order: 2,
        enabled: true
      },
      {
        id: 'slide-4',
        url: '/images/import_shipping_port_1790168781597.jpg',
        caption: 'Direct international automotive sourcing and logistics',
        order: 3,
        enabled: true
      }
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
    username: process.env.ADMIN_USERNAME || 'admin',
    passwordHash: initialAdminPasswordHash,
    salt: defaultSalt,
    isInitialSetupRequired: !defaultAdminPassword
  }
};

class Database {
  private data: DatabaseSchema;

  constructor() {
    if (!fs.existsSync(DATA_DIR)) {
      try {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      } catch (err) {
        console.error('Failed creating DATA_DIR:', err);
      }
    }

    // On Vercel, copy pre-seeded database.json from repository to /tmp/data if not yet copied
    if (IS_VERCEL && !fs.existsSync(DB_FILE)) {
      const seedFile = path.resolve(process.cwd(), 'data', 'database.json');
      if (fs.existsSync(seedFile)) {
        try {
          fs.copyFileSync(seedFile, DB_FILE);
        } catch (copyErr) {
          console.error('Failed copying seed database to /tmp:', copyErr);
        }
      }
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

    // Ensure comprehensive catalog is seeded if missing or incomplete
    if (!this.data.brandCatalog || this.data.brandCatalog.length < 10) {
      const existingMap = new Map((this.data.brandCatalog || []).map(b => [b.name.toLowerCase(), b]));
      const merged: BrandCatalogItem[] = [...(this.data.brandCatalog || [])];
      for (const comp of COMPREHENSIVE_BRAND_CATALOG) {
        if (!existingMap.has(comp.name.toLowerCase())) {
          merged.push(comp);
        }
      }
      this.data.brandCatalog = merged;
      this.persist();
    }

    // Seed showroomSlides if missing
    if (!this.data.settings.showroomSlides || this.data.settings.showroomSlides.length === 0) {
      this.data.settings.showroomSlides = [...initialData.settings.showroomSlides!];
      this.persist();
    }

    // Sync admin password from process.env.ADMIN_PASSWORD if provided
    if (process.env.ADMIN_PASSWORD) {
      const salt = crypto.randomBytes(16).toString('hex');
      this.data.admin = {
        username: process.env.ADMIN_USERNAME || 'admin',
        salt,
        passwordHash: hashPassword(process.env.ADMIN_PASSWORD, salt),
        isInitialSetupRequired: false
      };
      this.persist();
    }

    // Connect and synchronize with Cloud Firestore for persistent storage
    this.initFirestoreSync().catch((err) => {
      console.warn('[Firestore] Sync warning during boot:', err);
    });
  }

  private async initFirestoreSync() {
    try {
      const db = getFirestoreDb();
      if (!db) return;

      // 1. Vehicles: Load from Firestore or seed if cloud is empty
      const cloudVehicles = await loadCollectionFromFirestore<Vehicle>('vehicles');
      if (cloudVehicles && cloudVehicles.length > 0) {
        this.data.vehicles = cloudVehicles;
        console.log(`[Firestore] Synced ${cloudVehicles.length} vehicles from persistent cloud storage.`);
      } else if (this.data.vehicles && this.data.vehicles.length > 0) {
        for (const v of this.data.vehicles) {
          await syncDocToFirestore('vehicles', v.id, v);
        }
        console.log(`[Firestore] Seeded ${this.data.vehicles.length} vehicles to cloud storage.`);
      }

      // 2. Settings: Load or seed
      const cloudSettings = await loadCollectionFromFirestore<DealerSettings>('settings');
      if (cloudSettings && cloudSettings.length > 0) {
        this.data.settings = cloudSettings[0];
        console.log('[Firestore] Synced dealer business profile from cloud.');
      } else {
        await syncDocToFirestore('settings', 'default', this.data.settings);
      }

      // 3. Leads: Load
      const cloudLeads = await loadCollectionFromFirestore<Lead>('leads');
      if (cloudLeads && cloudLeads.length > 0) {
        this.data.leads = cloudLeads;
      }

      // 4. Import Requests: Load
      const cloudImports = await loadCollectionFromFirestore<ImportRequest>('importRequests');
      if (cloudImports && cloudImports.length > 0) {
        this.data.importRequests = cloudImports;
      }

      // 5. Admin credentials: Load
      const cloudAdmin = await loadCollectionFromFirestore<any>('admin');
      if (cloudAdmin && cloudAdmin.length > 0 && cloudAdmin[0].passwordHash) {
        this.data.admin = cloudAdmin[0];
        console.log('[Firestore] Synced administrator credentials from cloud.');
      } else if (this.data.admin && this.data.admin.passwordHash) {
        await syncDocToFirestore('admin', 'credentials', this.data.admin);
      }

      // 6. Reviews: Load or seed
      const cloudReviews = await loadCollectionFromFirestore<Review>('reviews');
      if (cloudReviews && cloudReviews.length > 0) {
        this.data.reviews = cloudReviews;
      } else if (this.data.reviews && this.data.reviews.length > 0) {
        for (const r of this.data.reviews) {
          await syncDocToFirestore('reviews', r.id, r);
        }
      }

      // 7. Brand Catalog: Load or seed
      const cloudBrands = await loadCollectionFromFirestore<BrandCatalogItem>('brandCatalog');
      if (cloudBrands && cloudBrands.length > 0) {
        this.data.brandCatalog = cloudBrands;
      } else if (this.data.brandCatalog && this.data.brandCatalog.length > 0) {
        for (const b of this.data.brandCatalog) {
          await syncDocToFirestore('brandCatalog', b.id, b);
        }
      }
    } catch (err) {
      console.warn('[Firestore] Non-blocking sync error:', err);
    }
  }

  private persist() {
    try {
      const tmp = `${DB_FILE}.tmp.${Date.now()}`;
      fs.writeFileSync(tmp, JSON.stringify(this.data, null, 2), 'utf-8');
      fs.renameSync(tmp, DB_FILE);
    } catch (err) {
      console.error('Failed persisting database file:', err);
    }
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
    syncDocToFirestore('settings', 'default', this.data.settings);
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
    bodyType?: string;
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
    if (filters?.bodyType) {
      list = list.filter(v => v.bodyType === filters.bodyType);
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
    syncDocToFirestore('vehicles', newVehicle.id, newVehicle);
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
    syncDocToFirestore('vehicles', updated.id, updated);
    return updated;
  }

  deleteVehicle(id: string): boolean {
    const idx = this.data.vehicles.findIndex(v => v.id === id);
    if (idx === -1) return false;
    const title = this.data.vehicles[idx].title;
    this.data.vehicles.splice(idx, 1);
    this.logAudit('VEHICLE_DELETED', 'vehicle', id, `Deleted vehicle ${title}`);
    this.persist();
    deleteDocFromFirestore('vehicles', id);
    return true;
  }

  reorderHeroSlides(orderedIds: string[]): Vehicle[] {
    orderedIds.forEach((id, index) => {
      const v = this.data.vehicles.find(item => item.id === id);
      if (v) {
        v.featuredOrder = index;
        syncDocToFirestore('vehicles', v.id, v);
      }
    });
    this.logAudit('HERO_SLIDER_REORDERED', 'vehicle', 'hero-slider', `Reordered ${orderedIds.length} homepage slides`);
    this.persist();
    return this.getVehicles({ publishedOnly: false });
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
  getBrandHierarchy(options?: { inventoryOnly?: boolean; includeDisabled?: boolean }): BrandHierarchyResult[] {
    const catalog = this.data.brandCatalog || COMPREHENSIVE_BRAND_CATALOG;
    const vehicles = this.data.vehicles.filter(v => v.published);

    const brandMap = new Map<string, {
      id: string;
      name: string;
      country: string;
      region: string;
      logo?: string;
      enabled: boolean;
      modelsMap: Map<string, { id: string; name: string; yearsSet: Set<number>; category?: string }>;
      count: number;
    }>();

    // 1. Seed from defined brandCatalog
    for (const b of catalog) {
      if (!options?.includeDisabled && b.enabled === false) continue;
      const bKey = b.name.trim().toLowerCase();
      const modelsMap = new Map<string, { id: string; name: string; yearsSet: Set<number>; category?: string }>();
      for (const m of (b.models || [])) {
        modelsMap.set(m.name.trim().toLowerCase(), {
          id: m.id,
          name: m.name.trim(),
          yearsSet: new Set(m.years || []),
          category: m.category
        });
      }
      brandMap.set(bKey, {
        id: b.id,
        name: b.name.trim(),
        country: b.country || 'Global',
        region: b.region || 'International',
        logo: b.logo,
        enabled: b.enabled !== false,
        modelsMap,
        count: 0
      });
    }

    // 2. Count active inventory & dynamically register models from inventory
    for (const v of vehicles) {
      if (!v.make) continue;
      const bKey = v.make.trim().toLowerCase();
      let brandEntry = brandMap.get(bKey);
      if (!brandEntry) {
        brandEntry = {
          id: `b-${bKey.replace(/[^a-z0-9]+/g, '-')}`,
          name: v.make.trim(),
          country: 'Global',
          region: 'International',
          enabled: true,
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
            yearsSet: new Set(),
            category: v.bodyType
          };
          brandEntry.modelsMap.set(mKey, modelEntry);
        }
        if (v.year) {
          modelEntry.yearsSet.add(v.year);
        }
      }
    }

    // Convert to result array
    const results: BrandHierarchyResult[] = [];
    for (const [, b] of brandMap) {
      if (options?.inventoryOnly && b.count === 0) continue;

      const models = Array.from(b.modelsMap.values()).map(m => ({
        id: m.id,
        name: m.name,
        years: Array.from(m.yearsSet).sort((x, y) => y - x),
        category: m.category
      })).sort((a, b) => a.name.localeCompare(b.name));

      results.push({
        id: b.id,
        name: b.name,
        country: b.country || 'Global',
        region: b.region || 'International',
        logo: b.logo,
        enabled: b.enabled,
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

  addBrand(name: string, country?: string, logo?: string): BrandCatalogItem {
    if (!this.data.brandCatalog) this.data.brandCatalog = [];
    const id = `b-${Date.now()}`;
    const newBrand: BrandCatalogItem = {
      id,
      name: name.trim(),
      country: country?.trim() || 'Global',
      region: 'International',
      logo: logo || '',
      enabled: true,
      models: []
    };
    this.data.brandCatalog.push(newBrand);
    this.logAudit('BRAND_CREATED', 'settings', id, `Added brand ${newBrand.name} (${newBrand.country})`);
    this.persist();
    syncDocToFirestore('brandCatalog', newBrand.id, newBrand);
    return newBrand;
  }

  updateBrand(id: string, updates: Partial<BrandCatalogItem>): BrandCatalogItem | null {
    if (!this.data.brandCatalog) return null;
    const brand = this.data.brandCatalog.find(b => b.id === id);
    if (!brand) return null;
    if (updates.name !== undefined) brand.name = updates.name.trim();
    if (updates.country !== undefined) brand.country = updates.country.trim();
    if (updates.logo !== undefined) brand.logo = updates.logo;
    if (updates.enabled !== undefined) brand.enabled = updates.enabled;
    this.logAudit('BRAND_UPDATED', 'settings', id, `Updated brand ${brand.name}`);
    this.persist();
    syncDocToFirestore('brandCatalog', brand.id, brand);
    return brand;
  }

  toggleBrand(id: string): BrandCatalogItem | null {
    if (!this.data.brandCatalog) return null;
    const brand = this.data.brandCatalog.find(b => b.id === id);
    if (!brand) return null;
    brand.enabled = brand.enabled === false ? true : false;
    this.logAudit('BRAND_TOGGLED', 'settings', id, `Toggled brand ${brand.name} to ${brand.enabled}`);
    this.persist();
    syncDocToFirestore('brandCatalog', brand.id, brand);
    return brand;
  }

  deleteBrand(id: string): boolean {
    if (!this.data.brandCatalog) return false;
    const idx = this.data.brandCatalog.findIndex(b => b.id === id);
    if (idx === -1) return false;
    const name = this.data.brandCatalog[idx].name;
    this.data.brandCatalog.splice(idx, 1);
    this.logAudit('BRAND_DELETED', 'settings', id, `Deleted brand ${name}`);
    this.persist();
    deleteDocFromFirestore('brandCatalog', id);
    return true;
  }

  addModel(brandId: string, modelName: string, years: number[], category?: string): BrandCatalogItem | null {
    if (!this.data.brandCatalog) this.data.brandCatalog = [];
    const brand = this.data.brandCatalog.find(b => b.id === brandId);
    if (!brand) return null;
    const modelId = `m-${Date.now()}`;
    brand.models.push({
      id: modelId,
      name: modelName.trim(),
      years: (years.length > 0 ? years : [2026, 2025, 2024, 2023, 2022, 2021, 2020]).sort((a, b) => b - a),
      category
    });
    this.logAudit('MODEL_CREATED', 'settings', modelId, `Added model ${modelName} to ${brand.name}`);
    this.persist();
    syncDocToFirestore('brandCatalog', brand.id, brand);
    return brand;
  }

  updateModel(brandId: string, modelId: string, updates: Partial<BrandModelItem>): BrandCatalogItem | null {
    if (!this.data.brandCatalog) return null;
    const brand = this.data.brandCatalog.find(b => b.id === brandId);
    if (!brand) return null;
    const model = brand.models.find(m => m.id === modelId);
    if (!model) return null;
    if (updates.name !== undefined) model.name = updates.name.trim();
    if (updates.years !== undefined) model.years = updates.years.sort((a, b) => b - a);
    if (updates.category !== undefined) model.category = updates.category;
    this.logAudit('MODEL_UPDATED', 'settings', modelId, `Updated model ${model.name}`);
    this.persist();
    syncDocToFirestore('brandCatalog', brand.id, brand);
    return brand;
  }

  deleteModel(brandId: string, modelId: string): BrandCatalogItem | null {
    if (!this.data.brandCatalog) return null;
    const brand = this.data.brandCatalog.find(b => b.id === brandId);
    if (!brand) return null;
    const idx = brand.models.findIndex(m => m.id === modelId);
    if (idx === -1) return null;
    brand.models.splice(idx, 1);
    this.logAudit('MODEL_DELETED', 'settings', modelId, `Deleted model from ${brand.name}`);
    this.persist();
    syncDocToFirestore('brandCatalog', brand.id, brand);
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
    syncDocToFirestore('leads', newLead.id, newLead);
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
    syncDocToFirestore('leads', lead.id, lead);
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
    syncDocToFirestore('leads', lead.id, lead);
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
    syncDocToFirestore('importRequests', newReq.id, newReq);
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
    syncDocToFirestore('importRequests', req.id, req);
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
    syncDocToFirestore('carRequests', newReq.id, newReq);
    return newReq;
  }

  updateCarRequestStatus(id: string, status: CarRequest['status']): CarRequest | null {
    const req = this.data.carRequests.find(r => r.id === id);
    if (!req) return null;
    req.status = status;
    this.persist();
    syncDocToFirestore('carRequests', req.id, req);
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
    syncDocToFirestore('reviews', newRev.id, newRev);
    return newRev;
  }

  deleteReview(id: string): boolean {
    const idx = this.data.reviews.findIndex(r => r.id === id);
    if (idx === -1) return false;
    this.data.reviews.splice(idx, 1);
    this.persist();
    deleteDocFromFirestore('reviews', id);
    return true;
  }

  updateReview(id: string, updates: Partial<Review>): Review | null {
    const rev = this.data.reviews.find(r => r.id === id);
    if (!rev) return null;
    if (updates.customerName !== undefined) rev.customerName = updates.customerName;
    if (updates.vehiclePurchased !== undefined) rev.vehiclePurchased = updates.vehiclePurchased;
    if (updates.rating !== undefined) rev.rating = updates.rating;
    if (updates.comment !== undefined) rev.comment = updates.comment;
    if (updates.verified !== undefined) rev.verified = updates.verified;
    if (updates.published !== undefined) rev.published = updates.published;
    this.persist();
    syncDocToFirestore('reviews', rev.id, rev);
    return rev;
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
  getAdminSetupStatus(): { isSetup: boolean; username: string } {
    const isSetup = Boolean(this.data.admin && this.data.admin.passwordHash && !this.data.admin.isInitialSetupRequired);
    return {
      isSetup,
      username: this.data.admin?.username || process.env.ADMIN_USERNAME || 'admin'
    };
  }

  setInitialAdminPassword(password: string): boolean {
    if (this.data.admin && this.data.admin.passwordHash && this.data.admin.isInitialSetupRequired === false) {
      return false;
    }
    const salt = crypto.randomBytes(16).toString('hex');
    this.data.admin = {
      username: process.env.ADMIN_USERNAME || 'admin',
      salt,
      passwordHash: hashPassword(password, salt),
      isInitialSetupRequired: false
    };
    this.logAudit('ADMIN_INITIAL_SETUP', 'auth', 'admin', 'Initial administrator password configured');
    this.persist();
    syncDocToFirestore('admin', 'credentials', this.data.admin);
    return true;
  }

  verifyAdminPassword(password: string): boolean {
    const hash = hashPassword(password, this.data.admin.salt);
    return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(this.data.admin.passwordHash));
  }

  updateAdminPassword(oldPassword: string, newPassword: string): boolean {
    if (!this.verifyAdminPassword(oldPassword)) return false;
    const salt = crypto.randomBytes(16).toString('hex');
    this.data.admin.salt = salt;
    this.data.admin.passwordHash = hashPassword(newPassword, salt);
    this.data.admin.isInitialSetupRequired = false;
    this.logAudit('ADMIN_PASSWORD_CHANGED', 'auth', 'admin', 'Admin password successfully updated');
    this.persist();
    syncDocToFirestore('admin', 'credentials', this.data.admin);
    return true;
  }

  // --- Showroom Slides Management ---
  getShowroomSlides(): ShowroomSlide[] {
    const slides = this.data.settings.showroomSlides || [];
    return [...slides].sort((a, b) => a.order - b.order);
  }

  addShowroomSlide(url: string, caption?: string): ShowroomSlide {
    if (!this.data.settings.showroomSlides) this.data.settings.showroomSlides = [];
    const newSlide: ShowroomSlide = {
      id: `slide-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      url: url.trim(),
      caption: caption?.trim() || 'Showroom Display View',
      order: this.data.settings.showroomSlides.length,
      enabled: true
    };
    this.data.settings.showroomSlides.push(newSlide);
    this.logAudit('SHOWROOM_SLIDE_ADDED', 'settings', newSlide.id, `Added showroom slide`);
    this.persist();
    syncDocToFirestore('settings', 'default', this.data.settings);
    return newSlide;
  }

  updateShowroomSlide(id: string, updates: Partial<ShowroomSlide>): ShowroomSlide | null {
    if (!this.data.settings.showroomSlides) return null;
    const slide = this.data.settings.showroomSlides.find(s => s.id === id);
    if (!slide) return null;
    if (updates.url !== undefined) slide.url = updates.url.trim();
    if (updates.caption !== undefined) slide.caption = updates.caption.trim();
    if (updates.enabled !== undefined) slide.enabled = updates.enabled;
    if (updates.order !== undefined) slide.order = updates.order;
    this.logAudit('SHOWROOM_SLIDE_UPDATED', 'settings', id, `Updated showroom slide`);
    this.persist();
    syncDocToFirestore('settings', 'default', this.data.settings);
    return slide;
  }

  deleteShowroomSlide(id: string): boolean {
    if (!this.data.settings.showroomSlides) return false;
    const idx = this.data.settings.showroomSlides.findIndex(s => s.id === id);
    if (idx === -1) return false;
    this.data.settings.showroomSlides.splice(idx, 1);
    this.logAudit('SHOWROOM_SLIDE_DELETED', 'settings', id, `Deleted showroom slide`);
    this.persist();
    syncDocToFirestore('settings', 'default', this.data.settings);
    return true;
  }

  reorderShowroomSlides(orderedIds: string[]): ShowroomSlide[] {
    if (!this.data.settings.showroomSlides) return [];
    const map = new Map(this.data.settings.showroomSlides.map(s => [s.id, s]));
    const reordered: ShowroomSlide[] = [];
    orderedIds.forEach((id, index) => {
      const slide = map.get(id);
      if (slide) {
        slide.order = index;
        reordered.push(slide);
        map.delete(id);
      }
    });
    for (const remaining of map.values()) {
      remaining.order = reordered.length;
      reordered.push(remaining);
    }
    this.data.settings.showroomSlides = reordered;
    this.logAudit('SHOWROOM_SLIDES_REORDERED', 'settings', 'slider', `Reordered showroom slides`);
    this.persist();
    syncDocToFirestore('settings', 'default', this.data.settings);
    return reordered;
  }
}

export const db = new Database();
