import { DealerSettings, Vehicle, Lead, ImportRequest, CarRequest, Review, AdminStats, AuditLog } from '../types';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('autoprime_admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  // Settings
  async getSettings(): Promise<DealerSettings> {
    const res = await fetch('/api/settings');
    if (!res.ok) throw new Error('Failed to fetch settings');
    return res.json();
  },

  async updateSettings(settings: Partial<DealerSettings>): Promise<DealerSettings> {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(settings),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update settings');
    }
    return res.json();
  },

  // Vehicles
  async getVehicles(params?: {
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
    includeUnpublished?: boolean;
  }): Promise<Vehicle[]> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== '' && v !== null) {
          searchParams.append(k, String(v));
        }
      });
    }
    const res = await fetch(`/api/vehicles?${searchParams.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch vehicles');
    return res.json();
  },

  async getVehicle(slugOrId: string): Promise<Vehicle> {
    const res = await fetch(`/api/vehicles/${encodeURIComponent(slugOrId)}`);
    if (!res.ok) {
      if (res.status === 404) throw new Error('Vehicle not found');
      throw new Error('Failed to fetch vehicle');
    }
    return res.json();
  },

  async createVehicle(vehicleData: Partial<Vehicle>): Promise<Vehicle> {
    const res = await fetch('/api/vehicles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(vehicleData),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create vehicle');
    }
    return res.json();
  },

  async updateVehicle(id: string, vehicleData: Partial<Vehicle>): Promise<Vehicle> {
    const res = await fetch(`/api/vehicles/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(vehicleData),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update vehicle');
    }
    return res.json();
  },

  async updateVehicleStatus(id: string, status: string): Promise<Vehicle> {
    const res = await fetch(`/api/vehicles/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update status');
    }
    return res.json();
  },

  async deleteVehicle(id: string): Promise<void> {
    const res = await fetch(`/api/vehicles/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to delete vehicle');
    }
  },

  // Image Upload
  async uploadImage(fileData: string, fileName?: string): Promise<string> {
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ fileData, fileName }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Upload failed');
    }
    const data = await res.json();
    return data.url;
  },

  // Leads
  async createLead(leadData: {
    name: string;
    phone: string;
    whatsapp?: string;
    vehicleId?: string;
    vehicleTitle?: string;
    source?: string;
    message?: string;
    budget?: string;
  }): Promise<{ success: boolean; leadId: string }> {
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leadData),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to submit lead');
    }
    return res.json();
  },

  async getLeads(status?: string): Promise<Lead[]> {
    const url = status ? `/api/admin/leads?status=${encodeURIComponent(status)}` : '/api/admin/leads';
    const res = await fetch(url, { headers: getAuthHeader() });
    if (!res.ok) throw new Error('Failed to fetch leads');
    return res.json();
  },

  async updateLeadStatus(id: string, status: string, note?: string): Promise<Lead> {
    const res = await fetch(`/api/admin/leads/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ status, note }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update lead');
    }
    return res.json();
  },

  async addLeadNote(id: string, note: string): Promise<Lead> {
    const res = await fetch(`/api/admin/leads/${id}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ note }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to add note');
    }
    return res.json();
  },

  // Import Requests
  async createImportRequest(req: {
    fullName: string;
    whatsappNumber: string;
    preferredBrand: string;
    preferredModel: string;
    preferredYear?: string;
    budget?: string;
    condition?: string;
    preferredCountry?: string;
    specificRequirements?: string;
    additionalMessage?: string;
  }): Promise<{ success: boolean; requestId: string }> {
    const res = await fetch('/api/import-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to submit import request');
    }
    return res.json();
  },

  async getImportRequests(): Promise<ImportRequest[]> {
    const res = await fetch('/api/admin/import-requests', { headers: getAuthHeader() });
    if (!res.ok) throw new Error('Failed to fetch import requests');
    return res.json();
  },

  async updateImportRequestStatus(id: string, status: string, note?: string): Promise<ImportRequest> {
    const res = await fetch(`/api/admin/import-requests/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ status, note }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update request');
    }
    return res.json();
  },

  // Find My Car
  async createFindCarRequest(req: {
    name: string;
    whatsapp: string;
    brand: string;
    model?: string;
    year?: string;
    budget?: string;
    condition?: string;
    transmission?: string;
    otherRequirements?: string;
  }): Promise<{ success: boolean; requestId: string }> {
    const res = await fetch('/api/find-car-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to submit request');
    }
    return res.json();
  },

  async getFindCarRequests(): Promise<CarRequest[]> {
    const res = await fetch('/api/admin/find-car-requests', { headers: getAuthHeader() });
    if (!res.ok) throw new Error('Failed to fetch car requests');
    return res.json();
  },

  async updateFindCarStatus(id: string, status: string): Promise<CarRequest> {
    const res = await fetch(`/api/admin/find-car-requests/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update status');
    }
    return res.json();
  },

  // Reviews
  async getReviews(): Promise<Review[]> {
    const res = await fetch('/api/reviews');
    if (!res.ok) return [];
    return res.json();
  },

  async getAdminReviews(): Promise<Review[]> {
    const res = await fetch('/api/admin/reviews', { headers: getAuthHeader() });
    if (!res.ok) throw new Error('Failed to fetch reviews');
    return res.json();
  },

  async createReview(rev: Partial<Review>): Promise<Review> {
    const res = await fetch('/api/admin/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(rev),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to add review');
    }
    return res.json();
  },

  async deleteReview(id: string): Promise<void> {
    const res = await fetch(`/api/admin/reviews/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Failed to delete review');
  },

  // Admin Stats & Audit
  async getStats(): Promise<AdminStats> {
    const res = await fetch('/api/admin/stats', { headers: getAuthHeader() });
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  },

  async getAuditLogs(): Promise<AuditLog[]> {
    const res = await fetch('/api/admin/audit-logs', { headers: getAuthHeader() });
    if (!res.ok) throw new Error('Failed to fetch audit logs');
    return res.json();
  },

  async getAnalytics(): Promise<any> {
    const res = await fetch('/api/admin/analytics', { headers: getAuthHeader() });
    if (!res.ok) throw new Error('Failed to fetch analytics');
    return res.json();
  },

  async trackEvent(eventType: string, vehicleId?: string, metadata?: Record<string, any>) {
    try {
      await fetch('/api/analytics/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventType, vehicleId, metadata }),
      });
    } catch {
      // quiet analytics fail
    }
  },

  // Auth
  async login(username: string, password: string): Promise<{ token: string; user: any }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Login failed');
    }
    const data = await res.json();
    localStorage.setItem('autoprime_admin_token', data.token);
    return data;
  },

  async verifyAuth(): Promise<boolean> {
    const token = localStorage.getItem('autoprime_admin_token');
    if (!token) return false;
    try {
      const res = await fetch('/api/auth/verify', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      return Boolean(data.valid);
    } catch {
      return false;
    }
  },

  logout() {
    const token = localStorage.getItem('autoprime_admin_token');
    if (token) {
      fetch('/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
    localStorage.removeItem('autoprime_admin_token');
  },

  // Brand & Model Hierarchy
  async getHierarchy(): Promise<any[]> {
    const res = await fetch('/api/hierarchy');
    if (!res.ok) throw new Error('Failed to fetch brand hierarchy');
    return res.json();
  },

  async addBrand(name: string, logo?: string): Promise<any> {
    const res = await fetch('/api/admin/brands', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ name, logo }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to add brand');
    }
    return res.json();
  },

  async deleteBrand(id: string): Promise<void> {
    const res = await fetch(`/api/admin/brands/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Failed to delete brand');
  },

  async addModel(brandId: string, name: string, years: number[]): Promise<any> {
    const res = await fetch(`/api/admin/brands/${brandId}/models`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ name, years }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to add model');
    }
    return res.json();
  },

  async deleteModel(brandId: string, modelId: string): Promise<void> {
    const res = await fetch(`/api/admin/brands/${brandId}/models/${modelId}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Failed to delete model');
  },
};
