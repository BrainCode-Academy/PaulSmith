import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { db, Vehicle, DealerSettings } from './server/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProd = process.env.NODE_ENV === 'production';

// Support base64 upload payload up to 25MB
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Active admin sessions tokens
const activeSessions = new Map<string, { username: string; expiresAt: number }>();

function generateToken(username: string): string {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
  activeSessions.set(token, { username, expiresAt });
  return token;
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Admin authentication required' });
  }

  const token = authHeader.split(' ')[1];
  const session = activeSessions.get(token);
  if (!session || session.expiresAt < Date.now()) {
    if (session) activeSessions.delete(token);
    return res.status(401).json({ error: 'Session expired or invalid. Please log in again.' });
  }

  next();
}

// Ensure public directories exist and are served
const PUBLIC_DIR = path.resolve(process.cwd(), 'public');
const UPLOADS_DIR = path.join(PUBLIC_DIR, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

app.use(['/*WhatsApp*Image*', '/*8.55.15*'], (req, res, next) => {
  const filePath = path.join(PUBLIC_DIR, 'WhatsApp Image 2026-09-29 at 8.55.15 AM.jpeg');
  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Type', 'image/jpeg');
    return res.sendFile(filePath);
  }
  next();
});

app.use(express.static(PUBLIC_DIR));

// ==========================================
// 1. AUTHENTICATION ROUTES
// ==========================================
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  if (username !== 'admin' || !db.verifyAdminPassword(password)) {
    return res.status(401).json({ error: 'Invalid admin credentials' });
  }

  const token = generateToken(username);
  res.json({
    success: true,
    token,
    user: { username: 'admin', role: 'Dealer Administrator' }
  });
});

app.get('/api/auth/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ valid: false });
  }
  const token = authHeader.split(' ')[1];
  const session = activeSessions.get(token);
  if (!session || session.expiresAt < Date.now()) {
    return res.status(401).json({ valid: false });
  }
  res.json({ valid: true, user: { username: session.username, role: 'Dealer Administrator' } });
});

app.post('/api/auth/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    activeSessions.delete(token);
  }
  res.json({ success: true });
});

app.post('/api/auth/change-password', requireAdmin, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters' });
  }
  const updated = db.updateAdminPassword(currentPassword, newPassword);
  if (!updated) {
    return res.status(400).json({ error: 'Current password verification failed' });
  }
  res.json({ success: true, message: 'Password successfully updated' });
});

// ==========================================
// 2. DEALER SETTINGS
// ==========================================
app.get('/api/settings', (req, res) => {
  const settings = db.getSettings();
  res.json(settings);
});

app.put('/api/settings', requireAdmin, (req, res) => {
  try {
    const updated = db.updateSettings(req.body);
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update settings' });
  }
});

// Image upload endpoint (supports base64 image data from file pickers)
app.post('/api/upload', (req, res) => {
  try {
    const { image, filename } = req.body;
    if (!image) {
      return res.status(400).json({ error: 'Image data is required' });
    }

    const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let buffer: Buffer;
    let ext = 'jpg';

    if (matches && matches.length === 3) {
      const mime = matches[1];
      buffer = Buffer.from(matches[2], 'base64');
      if (mime.includes('png')) ext = 'png';
      else if (mime.includes('webp')) ext = 'webp';
      else if (mime.includes('jpeg') || mime.includes('jpg')) ext = 'jpg';
    } else {
      buffer = Buffer.from(image, 'base64');
    }

    const safeName = filename 
      ? filename.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase() 
      : `upload_${Date.now()}`;
    const targetFile = `${safeName}_${Date.now()}.${ext}`;
    const imagesDir = path.join(PUBLIC_DIR, 'images');
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }
    const targetPath = path.join(imagesDir, targetFile);
    fs.writeFileSync(targetPath, buffer);

    const publicUrl = `/images/${targetFile}`;
    res.json({ success: true, url: publicUrl });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to upload image' });
  }
});

// ==========================================
// 3. VEHICLE INVENTORY
// ==========================================
app.get('/api/vehicles', (req, res) => {
  const {
    make,
    model,
    minPrice,
    maxPrice,
    year,
    condition,
    transmission,
    fuel,
    bodyType,
    status,
    featured,
    search,
    includeUnpublished
  } = req.query;

  const vehicles = db.getVehicles({
    make: make ? String(make) : undefined,
    model: model ? String(model) : undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    year: year ? Number(year) : undefined,
    condition: condition ? String(condition) : undefined,
    transmission: transmission ? String(transmission) : undefined,
    fuel: fuel ? String(fuel) : undefined,
    bodyType: bodyType ? String(bodyType) : undefined,
    status: status ? String(status) : undefined,
    featured: featured !== undefined ? featured === 'true' : undefined,
    search: search ? String(search) : undefined,
    publishedOnly: includeUnpublished !== 'true'
  });

  res.json(vehicles);
});

app.get('/api/vehicles/:slugOrId', (req, res) => {
  const v = db.getVehicleBySlugOrId(req.params.slugOrId);
  if (!v) {
    return res.status(404).json({ error: 'Vehicle not found' });
  }
  // Track vehicle view
  db.incrementVehicleStats(v.id, 'view');
  res.json(v);
});

app.post('/api/vehicles', requireAdmin, (req, res) => {
  try {
    const data = req.body;
    if (!data.title || !data.make || !data.model || !data.year || !data.price) {
      return res.status(400).json({ error: 'Title, Make, Model, Year, and Price are required' });
    }
    const created = db.createVehicle({
      title: data.title,
      make: data.make,
      model: data.model,
      year: Number(data.year),
      price: Number(data.price),
      currency: data.currency || 'NGN',
      mileage: Number(data.mileage) || 0,
      mileageUnit: data.mileageUnit || 'km',
      transmission: data.transmission || 'Automatic',
      fuel: data.fuel || 'Petrol',
      bodyType: data.bodyType || 'SUV',
      condition: data.condition || 'Foreign Used',
      status: data.status || 'Available',
      location: data.location || '',
      vin: data.vin || '',
      engine: data.engine || '',
      driveType: data.driveType || 'AWD',
      color: data.color || '',
      interiorColor: data.interiorColor || '',
      description: data.description || '',
      features: Array.isArray(data.features) ? data.features : [],
      images: Array.isArray(data.images) && data.images.length > 0 ? data.images : ['/images/hero_car_showroom_1790168724059.jpg'],
      videoUrl: data.videoUrl || '',
      featured: Boolean(data.featured),
      published: data.published !== false
    });
    res.status(201).json(created);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to create vehicle' });
  }
});

app.put('/api/vehicles/:id', requireAdmin, (req, res) => {
  try {
    const updated = db.updateVehicle(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update vehicle' });
  }
});

app.delete('/api/vehicles/:id', requireAdmin, (req, res) => {
  const deleted = db.deleteVehicle(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Vehicle not found' });
  }
  res.json({ success: true });
});

app.post('/api/admin/hero-slider/reorder', requireAdmin, (req, res) => {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ error: 'orderedIds must be an array of vehicle IDs' });
    }
    const updatedVehicles = db.reorderHeroSlides(orderedIds);
    res.json({ success: true, vehicles: updatedVehicles });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to reorder hero slides' });
  }
});

app.patch('/api/vehicles/:id/status', requireAdmin, (req, res) => {
  const { status } = req.body;
  if (!['Available', 'Reserved', 'Sold', 'Coming Soon', 'In Transit'].includes(status)) {
    return res.status(400).json({ error: 'Invalid vehicle status' });
  }
  const updated = db.updateVehicle(req.params.id, { status });
  if (!updated) {
    return res.status(404).json({ error: 'Vehicle not found' });
  }
  res.json(updated);
});

// ==========================================
// 3B. BRAND & MODEL HIERARCHY
// ==========================================
app.get('/api/hierarchy', (req, res) => {
  try {
    const includeDisabled = req.query.includeDisabled === 'true';
    const inventoryOnly = req.query.inventoryOnly === 'true';
    const hierarchy = db.getBrandHierarchy({ includeDisabled, inventoryOnly });
    res.json(hierarchy);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch hierarchy' });
  }
});

app.post('/api/admin/brands', requireAdmin, (req, res) => {
  try {
    const { name, country, logo } = req.body;
    if (!name) return res.status(400).json({ error: 'Brand name is required' });
    const created = db.addBrand(name, country, logo);
    res.status(201).json(created);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to create brand' });
  }
});

app.put('/api/admin/brands/:id', requireAdmin, (req, res) => {
  try {
    const updated = db.updateBrand(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Brand not found' });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update brand' });
  }
});

app.patch('/api/admin/brands/:id/toggle', requireAdmin, (req, res) => {
  try {
    const updated = db.toggleBrand(req.params.id);
    if (!updated) return res.status(404).json({ error: 'Brand not found' });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to toggle brand status' });
  }
});

app.delete('/api/admin/brands/:id', requireAdmin, (req, res) => {
  const deleted = db.deleteBrand(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Brand not found' });
  res.json({ success: true });
});

app.post('/api/admin/brands/:brandId/models', requireAdmin, (req, res) => {
  try {
    const { name, years, category } = req.body;
    if (!name) return res.status(400).json({ error: 'Model name is required' });
    const updated = db.addModel(req.params.brandId, name, Array.isArray(years) ? years : [], category);
    if (!updated) return res.status(404).json({ error: 'Brand not found' });
    res.status(201).json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to add model' });
  }
});

app.put('/api/admin/brands/:brandId/models/:modelId', requireAdmin, (req, res) => {
  try {
    const updated = db.updateModel(req.params.brandId, req.params.modelId, req.body);
    if (!updated) return res.status(404).json({ error: 'Brand or model not found' });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update model' });
  }
});

app.delete('/api/admin/brands/:brandId/models/:modelId', requireAdmin, (req, res) => {
  const updated = db.deleteModel(req.params.brandId, req.params.modelId);
  if (!updated) return res.status(404).json({ error: 'Brand or model not found' });
  res.json({ success: true });
});

// ==========================================
// 4. IMAGE UPLOADS
// ==========================================
app.post('/api/upload', requireAdmin, (req, res) => {
  try {
    const { fileData, fileName } = req.body;
    if (!fileData) {
      return res.status(400).json({ error: 'No image data provided' });
    }

    const matches = fileData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ error: 'Invalid base64 image data' });
    }

    const mimeType = matches[1];
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowed.includes(mimeType.toLowerCase())) {
      return res.status(400).json({ error: 'Only JPEG, PNG, and WebP images are supported' });
    }

    const ext = mimeType.split('/')[1] === 'jpeg' ? 'jpg' : mimeType.split('/')[1];
    const buffer = Buffer.from(matches[2], 'base64');

    // Limit to 10MB
    if (buffer.length > 10 * 1024 * 1024) {
      return res.status(400).json({ error: 'File size exceeds 10MB limit' });
    }

    const safeName = `car_${Date.now()}_${crypto.randomBytes(4).toString('hex')}.${ext}`;
    const filePath = path.join(UPLOADS_DIR, safeName);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${safeName}`;
    res.json({ success: true, url: publicUrl });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Image upload failed' });
  }
});

// ==========================================
// 5. LEADS MANAGEMENT
// ==========================================
app.post('/api/leads', (req, res) => {
  try {
    const { name, phone, whatsapp, vehicleId, vehicleTitle, source, message, budget } = req.body;
    if (!name || (!phone && !whatsapp)) {
      return res.status(400).json({ error: 'Name and Phone/WhatsApp number are required' });
    }

    const created = db.createLead({
      name,
      phone: phone || whatsapp,
      whatsapp: whatsapp || phone,
      vehicleId,
      vehicleTitle,
      source: source || 'whatsapp_cta',
      message: message || 'Interested in vehicle inquiry',
      budget,
      status: 'New'
    });

    res.status(201).json({ success: true, leadId: created.id });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to capture lead' });
  }
});

app.get('/api/admin/leads', requireAdmin, (req, res) => {
  const { status } = req.query;
  const leads = db.getLeads(status ? String(status) : undefined);
  res.json(leads);
});

app.patch('/api/admin/leads/:id', requireAdmin, (req, res) => {
  const { status, note } = req.body;
  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }
  const updated = db.updateLeadStatus(req.params.id, status, note);
  if (!updated) {
    return res.status(404).json({ error: 'Lead not found' });
  }
  res.json(updated);
});

app.post('/api/admin/leads/:id/notes', requireAdmin, (req, res) => {
  const { note } = req.body;
  if (!note) {
    return res.status(400).json({ error: 'Note text is required' });
  }
  const updated = db.addLeadNote(req.params.id, note);
  if (!updated) {
    return res.status(404).json({ error: 'Lead not found' });
  }
  res.json(updated);
});

// ==========================================
// 6. IMPORT REQUESTS
// ==========================================
app.post('/api/import-requests', (req, res) => {
  try {
    const {
      fullName,
      whatsappNumber,
      preferredBrand,
      preferredModel,
      preferredYear,
      budget,
      condition,
      preferredCountry,
      specificRequirements,
      additionalMessage
    } = req.body;

    if (!fullName || !whatsappNumber || !preferredBrand || !preferredModel) {
      return res.status(400).json({ error: 'Full name, WhatsApp number, brand, and model are required' });
    }

    const reqRecord = db.createImportRequest({
      fullName,
      whatsappNumber,
      preferredBrand,
      preferredModel,
      preferredYear: preferredYear || '',
      budget: budget || '',
      condition: condition || 'Any',
      preferredCountry: preferredCountry || 'China',
      specificRequirements: specificRequirements || '',
      additionalMessage: additionalMessage || ''
    });

    res.status(201).json({ success: true, requestId: reqRecord.id });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to submit import request' });
  }
});

app.get('/api/admin/import-requests', requireAdmin, (req, res) => {
  const requests = db.getImportRequests();
  res.json(requests);
});

app.patch('/api/admin/import-requests/:id', requireAdmin, (req, res) => {
  const { status, note } = req.body;
  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }
  const updated = db.updateImportRequestStatus(req.params.id, status, note);
  if (!updated) {
    return res.status(404).json({ error: 'Import request not found' });
  }
  res.json(updated);
});

// ==========================================
// 7. FIND MY CAR REQUESTS
// ==========================================
app.post('/api/find-car-requests', (req, res) => {
  try {
    const { name, whatsapp, brand, model, year, budget, condition, transmission, otherRequirements } = req.body;
    if (!name || !whatsapp || !brand) {
      return res.status(400).json({ error: 'Name, WhatsApp, and Brand are required' });
    }

    const created = db.createCarRequest({
      name,
      whatsapp,
      brand,
      model: model || '',
      year: year || '',
      budget: budget || '',
      condition: condition || 'Any',
      transmission: transmission || 'Any',
      otherRequirements: otherRequirements || ''
    });

    res.status(201).json({ success: true, requestId: created.id });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to submit car request' });
  }
});

app.get('/api/admin/find-car-requests', requireAdmin, (req, res) => {
  const requests = db.getCarRequests();
  res.json(requests);
});

app.patch('/api/admin/find-car-requests/:id', requireAdmin, (req, res) => {
  const { status } = req.body;
  const updated = db.updateCarRequestStatus(req.params.id, status);
  if (!updated) {
    return res.status(404).json({ error: 'Car request not found' });
  }
  res.json(updated);
});

// ==========================================
// 8. VERIFIED CUSTOMER REVIEWS (AUTHENTIC ONLY)
// ==========================================
app.get('/api/reviews', (req, res) => {
  const reviews = db.getReviews(true);
  res.json(reviews);
});

app.get('/api/admin/reviews', requireAdmin, (req, res) => {
  const reviews = db.getReviews(false);
  res.json(reviews);
});

app.post('/api/admin/reviews', requireAdmin, (req, res) => {
  try {
    const { customerName, vehiclePurchased, rating, comment, date, verified, published } = req.body;
    if (!customerName || !comment) {
      return res.status(400).json({ error: 'Customer name and comment are required' });
    }
    const created = db.createReview({
      customerName,
      vehiclePurchased: vehiclePurchased || '',
      rating: Number(rating) || 5,
      comment,
      date: date || new Date().toISOString().split('T')[0],
      verified: verified !== false,
      published: published !== false
    });
    res.status(201).json(created);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to add review' });
  }
});

app.delete('/api/admin/reviews/:id', requireAdmin, (req, res) => {
  const deleted = db.deleteReview(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Review not found' });
  }
  res.json({ success: true });
});

// ==========================================
// 9. STATS & AUDIT LOGS
// ==========================================
app.get('/api/admin/stats', requireAdmin, (req, res) => {
  const stats = db.getStats();
  res.json(stats);
});

app.get('/api/admin/audit-logs', requireAdmin, (req, res) => {
  const logs = db.getAuditLogs();
  res.json(logs);
});

// ==========================================
// 10. ANALYTICS
// ==========================================
app.post('/api/analytics/event', (req, res) => {
  const { eventType, vehicleId, metadata } = req.body;
  if (!eventType) {
    return res.status(400).json({ error: 'eventType is required' });
  }
  db.trackAnalytics({
    eventType,
    vehicleId,
    metadata
  });
  res.json({ success: true });
});

app.get('/api/admin/analytics', requireAdmin, (req, res) => {
  const summary = db.getAnalyticsSummary();
  res.json(summary);
});

// ==========================================
// 11. SEO: SITEMAP & ROBOTS
// ==========================================
app.get('/robots.txt', (req, res) => {
  const host = req.get('host') || 'localhost:3000';
  const protocol = req.protocol === 'https' || req.get('x-forwarded-proto') === 'https' ? 'https' : 'http';
  const baseUrl = `${protocol}://${host}`;

  const robots = `# Technical SEO Robots file
User-agent: *
Allow: /
Allow: /cars
Allow: /import-a-car
Allow: /find-my-car
Allow: /about
Allow: /how-it-works
Allow: /contact
Disallow: /admin
Disallow: /admin/*
Disallow: /api/*

Sitemap: ${baseUrl}/sitemap.xml
`;
  res.header('Content-Type', 'text/plain');
  res.send(robots);
});

app.get('/sitemap.xml', (req, res) => {
  const host = req.get('host') || 'localhost:3000';
  const protocol = req.protocol === 'https' || req.get('x-forwarded-proto') === 'https' ? 'https' : 'http';
  const baseUrl = `${protocol}://${host}`;

  const vehicles = db.getVehicles({ publishedOnly: true });

  const staticUrls: { loc: string; priority: string; changefreq: string; lastmod?: string }[] = [
    { loc: `${baseUrl}/`, priority: '1.0', changefreq: 'daily' },
    { loc: `${baseUrl}/cars`, priority: '0.9', changefreq: 'daily' },
    { loc: `${baseUrl}/import-a-car`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/find-my-car`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/how-it-works`, priority: '0.7', changefreq: 'monthly' },
    { loc: `${baseUrl}/about`, priority: '0.7', changefreq: 'monthly' },
    { loc: `${baseUrl}/contact`, priority: '0.7', changefreq: 'monthly' },
  ];

  const vehicleUrls = vehicles.map(v => ({
    loc: `${baseUrl}/cars/${v.slug}`,
    priority: '0.9',
    changefreq: 'weekly',
    lastmod: v.updatedAt.split('T')[0]
  }));

  const allUrls = [...staticUrls, ...vehicleUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    u => `  <url>
    <loc>${u.loc}</loc>
    ${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  res.header('Content-Type', 'application/xml');
  res.send(xml);
});

// ==========================================
// 12. VITE DEV MIDDLEWARE & PRODUCTION SERVING
// ==========================================
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AutoPrime Motors Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
