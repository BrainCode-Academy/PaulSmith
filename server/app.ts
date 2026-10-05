import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { db, Vehicle, DealerSettings } from './db.js';

dotenv.config();

const app = express();

// Support base64 upload payload up to 25MB
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Active admin sessions tokens & HMAC stateless fallback for Vercel
const activeSessions = new Map<string, { username: string; expiresAt: number }>();
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'paul_smith_autos_adm_sec_2026';

function signToken(username: string): string {
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
  const payload = Buffer.from(JSON.stringify({ username, expiresAt })).toString('base64url');
  const signature = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

function verifyToken(token: string): { username: string; expiresAt: number } | null {
  const memSession = activeSessions.get(token);
  if (memSession && memSession.expiresAt >= Date.now()) {
    return memSession;
  }
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [payload, signature] = parts;
    const expectedSig = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url');
    if (signature !== expectedSig) return null;
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!data.username || !data.expiresAt || data.expiresAt < Date.now()) return null;
    return data;
  } catch {
    return null;
  }
}

function generateToken(username: string): string {
  const token = signToken(username);
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
  activeSessions.set(token, { username, expiresAt });
  return token;
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Admin authentication required' });
  }

  const token = authHeader.split(' ')[1];
  const session = verifyToken(token);
  if (!session) {
    return res.status(401).json({ error: 'Session expired or invalid. Please log in again.' });
  }

  next();
}

// Ensure public directories exist and are served
const PUBLIC_DIR = path.resolve(process.cwd(), 'public');
const UPLOADS_DIR = path.join(PUBLIC_DIR, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  try {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  } catch (e) {
    // Read-only filesystem handling for serverless
  }
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
app.get('/api/auth/setup-status', (_req, res) => {
  try {
    const status = db.getAdminSetupStatus();
    res.json(status);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to check admin setup status' });
  }
});

app.post('/api/auth/setup', (req, res) => {
  try {
    const { password, confirmPassword } = req.body;
    if (!password || password.length < 8) {
      return res.status(400).json({ error: 'Master password must be at least 8 characters long' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }
    const status = db.getAdminSetupStatus();
    if (status.isSetup) {
      return res.status(400).json({ error: 'Administrator account is already initialized. Please sign in.' });
    }

    const created = db.setInitialAdminPassword(password);
    if (!created) {
      return res.status(400).json({ error: 'Failed to initialize administrator account' });
    }

    const token = generateToken(status.username);
    res.status(201).json({
      success: true,
      token,
      user: { username: status.username, role: 'Dealer Administrator' },
      message: 'Administrator account successfully configured'
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Setup failed' });
  }
});

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
  const session = verifyToken(token);
  if (!session) {
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
  if (!currentPassword || !newPassword || newPassword.length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters' });
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
  try {
    const settings = db.getSettings();
    res.json(settings);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch dealer settings' });
  }
});

app.put('/api/settings', requireAdmin, (req, res) => {
  try {
    const updated = db.updateSettings(req.body);
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update dealer settings' });
  }
});

// Showroom background slides
app.get('/api/showroom-slides', (_req, res) => {
  try {
    const slides = db.getShowroomSlides();
    res.json(slides);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch showroom slides' });
  }
});

app.post('/api/admin/showroom-slides', requireAdmin, (req, res) => {
  try {
    const { url, caption } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'Slide image URL is required' });
    }
    const slide = db.addShowroomSlide(url, caption);
    res.status(201).json(slide);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to add showroom slide' });
  }
});

app.put('/api/admin/showroom-slides/:id', requireAdmin, (req, res) => {
  try {
    const updated = db.updateShowroomSlide(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Showroom slide not found' });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update showroom slide' });
  }
});

app.delete('/api/admin/showroom-slides/:id', requireAdmin, (req, res) => {
  try {
    const ok = db.deleteShowroomSlide(req.params.id);
    if (!ok) return res.status(404).json({ error: 'Showroom slide not found' });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to delete showroom slide' });
  }
});

app.post('/api/admin/showroom-slides/reorder', requireAdmin, (req, res) => {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ error: 'orderedIds must be an array of slide IDs' });
    }
    const updated = db.reorderShowroomSlides(orderedIds);
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to reorder showroom slides' });
  }
});

// ==========================================
// 3. VEHICLES ROUTES
// ==========================================
app.get('/api/vehicles', (req, res) => {
  try {
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
      minPrice: minPrice ? parseFloat(String(minPrice)) : undefined,
      maxPrice: maxPrice ? parseFloat(String(maxPrice)) : undefined,
      year: year ? parseInt(String(year), 10) : undefined,
      condition: condition ? String(condition) : undefined,
      transmission: transmission ? String(transmission) : undefined,
      fuel: fuel ? String(fuel) : undefined,
      bodyType: bodyType ? String(bodyType) : undefined,
      status: status ? String(status) : undefined,
      featured: featured !== undefined ? featured === 'true' : undefined,
      search: search ? String(search) : undefined,
      publishedOnly: includeUnpublished === 'true' ? false : true
    });

    res.json(vehicles);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch vehicles' });
  }
});

app.get('/api/vehicles/:slugOrId', (req, res) => {
  try {
    const vehicle = db.getVehicleBySlugOrId(req.params.slugOrId);
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    db.incrementVehicleStats(vehicle.id, 'view');
    res.json(vehicle);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch vehicle' });
  }
});

app.post('/api/vehicles', requireAdmin, (req, res) => {
  try {
    const vehicle = db.createVehicle(req.body);
    res.status(201).json(vehicle);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to create vehicle' });
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
    res.status(400).json({ error: err.message || 'Failed to update vehicle' });
  }
});

app.delete('/api/vehicles/:id', requireAdmin, (req, res) => {
  try {
    const success = db.deleteVehicle(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to delete vehicle' });
  }
});

app.post('/api/admin/hero-slider/reorder', requireAdmin, (req, res) => {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ error: 'orderedIds array is required' });
    }
    const updatedVehicles = db.reorderHeroSlides(orderedIds);
    res.json({ success: true, vehicles: updatedVehicles });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to reorder hero slides' });
  }
});

// ==========================================
// 4. BRAND HIERARCHY & CATALOG MANAGEMENT
// ==========================================
app.get('/api/hierarchy', (req, res) => {
  try {
    const includeDisabled = req.query.includeDisabled === 'true';
    const hierarchy = db.getBrandHierarchy({ includeDisabled });
    res.json(hierarchy);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch brand catalog' });
  }
});

app.post('/api/admin/brands', requireAdmin, (req, res) => {
  try {
    const { name, country, logoUrl } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Brand name is required' });
    }
    const brand = db.addBrand(name, country, logoUrl);
    res.status(201).json(brand);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to add brand' });
  }
});

app.put('/api/admin/brands/:id', requireAdmin, (req, res) => {
  try {
    const updated = db.updateBrand(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Brand not found' });
    }
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to update brand' });
  }
});

app.delete('/api/admin/brands/:id', requireAdmin, (req, res) => {
  try {
    const success = db.deleteBrand(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Brand not found' });
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to delete brand' });
  }
});

app.post('/api/admin/brands/:brandId/models', requireAdmin, (req, res) => {
  try {
    const { name, years, category } = req.body;
    if (!name || !years || !Array.isArray(years) || years.length === 0) {
      return res.status(400).json({ error: 'Model name and array of supported years are required' });
    }
    const model = db.addModel(req.params.brandId, name, years, category);
    if (!model) {
      return res.status(404).json({ error: 'Brand not found' });
    }
    res.status(201).json(model);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to add model' });
  }
});

app.put('/api/admin/brands/:brandId/models/:modelId', requireAdmin, (req, res) => {
  try {
    const updated = db.updateModel(req.params.brandId, req.params.modelId, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Brand or model not found' });
    }
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to update model' });
  }
});

app.delete('/api/admin/brands/:brandId/models/:modelId', requireAdmin, (req, res) => {
  try {
    const success = db.deleteModel(req.params.brandId, req.params.modelId);
    if (!success) {
      return res.status(404).json({ error: 'Brand or model not found' });
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to delete model' });
  }
});

// ==========================================
// 5. IMAGE UPLOADS
// ==========================================
app.post('/api/upload', requireAdmin, (req, res) => {
  try {
    const { fileData, fileName } = req.body;
    if (!fileData) {
      return res.status(400).json({ error: 'No image data provided' });
    }

    const matches = fileData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      // In case it's already an absolute URL or CDN image
      if (fileData.startsWith('http') || fileData.startsWith('/')) {
        return res.json({ url: fileData });
      }
      return res.status(400).json({ error: 'Invalid base64 image data' });
    }

    const extension = matches[1].split('/')[1] || 'jpg';
    const buffer = Buffer.from(matches[2], 'base64');
    const cleanFileName = `vehicle_${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${extension}`;

    // Write file to uploads directory or fallback to base64 data uri if filesystem is strictly read-only
    try {
      const filePath = path.join(UPLOADS_DIR, cleanFileName);
      fs.writeFileSync(filePath, buffer);
      return res.json({ url: `/uploads/${cleanFileName}` });
    } catch (fsErr) {
      console.warn('Filesystem write not permitted, serving as data URI:', fsErr);
      return res.json({ url: fileData });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to process image upload' });
  }
});

// ==========================================
// 6. LEADS & INQUIRIES
// ==========================================
app.post('/api/leads', (req, res) => {
  try {
    const { name, phone, whatsapp, vehicleId, vehicleTitle, source, message, budget } = req.body;
    if (!name || (!phone && !whatsapp)) {
      return res.status(400).json({ error: 'Name and contact phone or WhatsApp are required' });
    }
    const lead = db.createLead({
      name,
      phone: phone || whatsapp,
      whatsapp: whatsapp || phone,
      vehicleId,
      vehicleTitle,
      source: source || 'general_contact',
      message: message || '',
      budget,
      status: 'New'
    });
    res.status(201).json(lead);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to record lead' });
  }
});

app.get('/api/admin/leads', requireAdmin, (_req, res) => {
  try {
    const leads = db.getLeads();
    res.json(leads);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch customer leads' });
  }
});

app.post('/api/admin/leads/:id/notes', requireAdmin, (req, res) => {
  try {
    const { text, author } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Note text is required' });
    }
    const lead = db.addLeadNote(req.params.id, text, author || 'Admin');
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    res.json(lead);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to append note to lead' });
  }
});

// ==========================================
// 7. IMPORT REQUESTS & FIND MY CAR
// ==========================================
app.post('/api/import-requests', (req, res) => {
  try {
    const request = db.createImportRequest(req.body);
    res.status(201).json(request);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to submit import request' });
  }
});

app.get('/api/admin/import-requests', requireAdmin, (_req, res) => {
  try {
    const requests = db.getImportRequests();
    res.json(requests);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch import requests' });
  }
});

app.post('/api/find-car-requests', (req, res) => {
  try {
    const request = db.createCarRequest(req.body);
    res.status(201).json(request);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to submit vehicle inquiry' });
  }
});

app.get('/api/admin/find-car-requests', requireAdmin, (_req, res) => {
  try {
    const requests = db.getCarRequests();
    res.json(requests);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch Find My Car inquiries' });
  }
});

// ==========================================
// 8. REVIEWS & CUSTOMER PROOF
// ==========================================
app.get('/api/reviews', (_req, res) => {
  try {
    const reviews = db.getReviews(true);
    res.json(reviews);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch reviews' });
  }
});

app.get('/api/admin/reviews', requireAdmin, (_req, res) => {
  try {
    const reviews = db.getReviews(false);
    res.json(reviews);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch reviews' });
  }
});

app.post('/api/admin/reviews', requireAdmin, (req, res) => {
  try {
    const review = db.createReview(req.body);
    res.status(201).json(review);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to create review' });
  }
});

app.put('/api/admin/reviews/:id', requireAdmin, (req, res) => {
  try {
    const updated = db.updateReview(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to update review' });
  }
});

app.delete('/api/admin/reviews/:id', requireAdmin, (req, res) => {
  try {
    const ok = db.deleteReview(req.params.id);
    if (!ok) return res.status(404).json({ error: 'Review not found' });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to delete review' });
  }
});

// ==========================================
// 9. AUDIT & ANALYTICS
// ==========================================
app.get('/api/admin/stats', requireAdmin, (_req, res) => {
  try {
    const stats = db.getStats();
    res.json(stats);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to compute dealership statistics' });
  }
});

app.get('/api/admin/audit-logs', requireAdmin, (_req, res) => {
  try {
    const logs = db.getAuditLogs();
    res.json(logs);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch audit records' });
  }
});

app.post('/api/analytics/event', (req, res) => {
  try {
    const { eventType, vehicleId, metadata } = req.body;
    db.trackAnalytics({ eventType, vehicleId, metadata });
    res.json({ success: true });
  } catch {
    res.json({ success: false });
  }
});

app.get('/api/admin/analytics', requireAdmin, (_req, res) => {
  try {
    const analytics = db.getAnalyticsSummary();
    res.json(analytics);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch analytics' });
  }
});

// Robots.txt & Sitemap
app.get('/robots.txt', (req, res) => {
  const host = req.get('host') || 'paulsmithautos.com';
  const protocol = req.protocol;
  const content = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/admin/

Sitemap: ${protocol}://${host}/sitemap.xml
`;
  res.header('Content-Type', 'text/plain');
  res.send(content);
});

app.get('/sitemap.xml', (req, res) => {
  const host = req.get('host') || 'paulsmithautos.com';
  const protocol = req.protocol;
  const baseUrl = `${protocol}://${host}`;

  const staticUrls: { loc: string; changefreq: string; priority: string; lastmod?: string }[] = [
    { loc: `${baseUrl}/`, changefreq: 'daily', priority: '1.0' },
    { loc: `${baseUrl}/cars`, changefreq: 'daily', priority: '0.9' },
    { loc: `${baseUrl}/brands`, changefreq: 'weekly', priority: '0.8' },
    { loc: `${baseUrl}/import-a-car`, changefreq: 'weekly', priority: '0.8' },
    { loc: `${baseUrl}/find-my-car`, changefreq: 'weekly', priority: '0.8' },
    { loc: `${baseUrl}/how-it-works`, changefreq: 'monthly', priority: '0.6' },
    { loc: `${baseUrl}/about`, changefreq: 'monthly', priority: '0.7' },
    { loc: `${baseUrl}/contact`, changefreq: 'monthly', priority: '0.7' },
  ];

  const vehicles = db.getVehicles();
  const vehicleUrls = vehicles.map(v => ({
    loc: `${baseUrl}/cars/${encodeURIComponent(v.slug)}`,
    lastmod: v.updatedAt ? v.updatedAt.split('T')[0] : undefined,
    changefreq: 'weekly',
    priority: '0.8',
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

export default app;
export { app };
