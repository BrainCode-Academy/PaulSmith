import React, { useState, useEffect } from 'react';
import {
  Car,
  Users,
  Ship,
  Settings,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  MessageSquare,
  Shield,
  Sparkles,
  Search,
  CheckCircle,
  Clock,
  LogOut,
  History,
  FileText,
  Image as ImageIcon,
  DollarSign,
  Eye,
  EyeOff,
  Star,
  Layers,
} from 'lucide-react';
import { Vehicle, Lead, ImportRequest, CarRequest, AdminStats, AuditLog, DealerSettings, BrandHierarchyResult } from '../../types';
import { useDealer } from '../../context/DealerContext';
import { api } from '../../lib/api';
import { formatPrice, buildWhatsAppLink } from '../../lib/whatsapp';
import { SocialPostModal } from '../../components/SocialPostModal';
import { VehicleEditorModal } from './VehicleEditorModal';

interface AdminDashboardProps {
  onNavigate: (path: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { settings, updateSettings, isAdmin, login, logout } = useDealer();

  // Auth state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<'overview' | 'vehicles' | 'brands' | 'leads' | 'imports' | 'find_car' | 'settings' | 'audit'>('overview');

  // Data states
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [hierarchy, setHierarchy] = useState<BrandHierarchyResult[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [imports, setImports] = useState<ImportRequest[]>([]);
  const [findCarRequests, setFindCarRequests] = useState<CarRequest[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);

  // Brand management state
  const [newBrandName, setNewBrandName] = useState('');
  const [activeBrandAddModal, setActiveBrandAddModal] = useState<string | null>(null);
  const [newModelName, setNewModelName] = useState('');
  const [newModelYears, setNewModelYears] = useState('2021, 2022, 2023, 2024');

  // Modal states
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null | 'new'>(null);
  const [postGenVehicle, setPostGenVehicle] = useState<Vehicle | null>(null);

  // Settings form state
  const [settingsForm, setSettingsForm] = useState<Partial<DealerSettings>>({});
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [settingsError, setSettingsError] = useState<string | null>(null);

  // Lead note state
  const [leadNoteInput, setLeadNoteInput] = useState<{ [leadId: string]: string }>({});

  const loadAllAdminData = async () => {
    if (!isAdmin) return;
    setLoading(true);
    try {
      const [statsData, vehiclesData, leadsData, importsData, findCarData, auditData, hierarchyData] = await Promise.all([
        api.getStats(),
        api.getVehicles({ includeUnpublished: true }),
        api.getLeads(),
        api.getImportRequests(),
        api.getFindCarRequests(),
        api.getAuditLogs(),
        api.getHierarchy(),
      ]);

      setStats(statsData);
      setVehicles(vehiclesData);
      setLeads(leadsData);
      setImports(importsData);
      setFindCarRequests(findCarData);
      setAuditLogs(auditData);
      setHierarchy(hierarchyData);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadAllAdminData();
      if (settings) {
        setSettingsForm(settings);
      }
    }
  }, [isAdmin, settings]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError(null);
    try {
      const ok = await login(username, password);
      if (!ok) {
        setLoginError('Invalid administrator credentials.');
      }
    } catch (err: any) {
      setLoginError(err.message || 'Login failed.');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleStatusChange = async (vehicleId: string, status: string) => {
    try {
      await api.updateVehicleStatus(vehicleId, status);
      await loadAllAdminData();
    } catch (err: any) {
      alert(`Failed to update status: ${err.message}`);
    }
  };

  const handleTogglePublish = async (vehicle: Vehicle) => {
    try {
      await api.updateVehicle(vehicle.id, { published: !vehicle.published });
      await loadAllAdminData();
    } catch (err: any) {
      alert(`Failed to update publication state: ${err.message}`);
    }
  };

  const handleToggleFeatured = async (vehicle: Vehicle) => {
    try {
      await api.updateVehicle(vehicle.id, { featured: !vehicle.featured });
      await loadAllAdminData();
    } catch (err: any) {
      alert(`Failed to update featured state: ${err.message}`);
    }
  };

  const handleDeleteVehicle = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${title}"?`)) return;
    try {
      await api.deleteVehicle(id);
      await loadAllAdminData();
    } catch (err: any) {
      alert(`Failed to delete vehicle: ${err.message}`);
    }
  };

  const handleAddBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrandName.trim()) return;
    try {
      await api.addBrand(newBrandName.trim());
      setNewBrandName('');
      await loadAllAdminData();
    } catch (err: any) {
      alert(`Failed to add brand: ${err.message}`);
    }
  };

  const handleDeleteBrand = async (brandId: string, brandName: string) => {
    if (!confirm(`Are you sure you want to remove ${brandName} from brand catalog?`)) return;
    try {
      await api.deleteBrand(brandId);
      await loadAllAdminData();
    } catch (err: any) {
      alert(`Failed to delete brand: ${err.message}`);
    }
  };

  const handleAddModel = async (brandId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!newModelName.trim()) return;
    const years = newModelYears
      .split(',')
      .map((y) => parseInt(y.trim(), 10))
      .filter((y) => !isNaN(y));
    try {
      await api.addModel(brandId, newModelName.trim(), years);
      setNewModelName('');
      setActiveBrandAddModal(null);
      await loadAllAdminData();
    } catch (err: any) {
      alert(`Failed to add model: ${err.message}`);
    }
  };

  const handleDeleteModel = async (brandId: string, modelId: string) => {
    if (!confirm('Are you sure you want to remove this model?')) return;
    try {
      await api.deleteModel(brandId, modelId);
      await loadAllAdminData();
    } catch (err: any) {
      alert(`Failed to delete model: ${err.message}`);
    }
  };

  const handleUpdateLeadStatus = async (id: string, status: string) => {
    try {
      await api.updateLeadStatus(id, status);
      await loadAllAdminData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleAddLeadNote = async (id: string) => {
    const note = leadNoteInput[id];
    if (!note || !note.trim()) return;
    try {
      await api.addLeadNote(id, note.trim());
      setLeadNoteInput({ ...leadNoteInput, [id]: '' });
      await loadAllAdminData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleUpdateImportStatus = async (id: string, status: string) => {
    try {
      await api.updateImportRequestStatus(id, status);
      await loadAllAdminData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSaved(false);
    setSettingsError(null);
    try {
      await updateSettings(settingsForm);
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 3000);
    } catch (err: any) {
      setSettingsError(err.message || 'Failed to save settings');
    }
  };

  // ----------------------------------------------------
  // Login Screen if not authenticated
  // ----------------------------------------------------
  if (!isAdmin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-amber-400/10 border border-amber-400/30 rounded-xl flex items-center justify-center text-amber-400 mx-auto">
              <Shield className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">Dealership Admin Portal</h1>
            <p className="text-xs text-neutral-400">
              Sign in to manage showroom inventory, client inquiries, and import requests.
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-red-950/40 border border-red-800/80 rounded-lg text-xs text-red-300">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full py-3 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-neutral-950 font-bold rounded-xl text-xs transition-colors cursor-pointer"
            >
              {loggingIn ? 'Authenticating...' : 'Sign In to Portal'}
            </button>
          </form>

          <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-400 text-center">
            Default credentials: <span className="text-amber-400 font-mono">admin</span> /{' '}
            <span className="text-amber-400 font-mono">AutoPrime2026!</span>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // Authenticated Admin Dashboard Screen
  // ----------------------------------------------------
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Admin Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60">
              Admin Mode
            </span>
            <h1 className="text-xl font-bold text-white tracking-tight">Dealership Management Console</h1>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            {settings?.businessName || 'Paul Smith Autos'} · Sourcing & Showroom Control Center
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('/')}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-neutral-300 bg-neutral-900 hover:bg-neutral-800 rounded-lg border border-neutral-800 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Public Storefront</span>
          </button>

          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-red-400 bg-red-950/30 hover:bg-red-900/40 rounded-lg border border-red-900/50 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-neutral-800">
        {[
          { id: 'overview', label: 'Dashboard Overview', icon: History },
          { id: 'vehicles', label: `Inventory (${vehicles.length})`, icon: Car },
          { id: 'brands', label: `Brands & Models (${hierarchy.length})`, icon: Layers },
          { id: 'leads', label: `Inquiries & Leads (${leads.length})`, icon: Users },
          { id: 'imports', label: `Import Sourcing (${imports.length})`, icon: Ship },
          { id: 'find_car', label: `Car Requests (${findCarRequests.length})`, icon: Search },
          { id: 'settings', label: 'Business Settings', icon: Settings },
          { id: 'audit', label: 'Audit Trail', icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-amber-400 text-neutral-950 font-bold shadow'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ----------------------------------------------------
          TAB 1: OVERVIEW METRICS
          ---------------------------------------------------- */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Key Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-1">
              <span className="text-xs text-neutral-400">Total Cars Listed</span>
              <div className="text-2xl font-bold text-white font-mono">{stats?.totalVehicles ?? vehicles.length}</div>
              <div className="text-[11px] text-emerald-400 pt-1">
                {stats?.availableVehicles ?? 0} available in showroom
              </div>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-1">
              <span className="text-xs text-neutral-400">Total Leads Received</span>
              <div className="text-2xl font-bold text-amber-400 font-mono">{stats?.totalLeads ?? leads.length}</div>
              <div className="text-[11px] text-amber-300/80 pt-1">
                {stats?.newLeads ?? 0} need follow-up
              </div>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-1">
              <span className="text-xs text-neutral-400">Import Sourcing Requests</span>
              <div className="text-2xl font-bold text-emerald-400 font-mono">{stats?.importRequests ?? imports.length}</div>
              <div className="text-[11px] text-neutral-400 pt-1">China & International</div>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-1">
              <span className="text-xs text-neutral-400">Inventory Sold</span>
              <div className="text-2xl font-bold text-neutral-300 font-mono">{stats?.soldVehicles ?? 0}</div>
              <div className="text-[11px] text-neutral-500 pt-1">Documented sales</div>
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => {
                setEditingVehicle('new');
              }}
              className="p-5 bg-neutral-900 hover:bg-neutral-800/80 border border-neutral-800 rounded-xl flex items-center gap-4 transition-colors text-left cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-lg bg-amber-400/10 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Add New Vehicle</h4>
                <p className="text-xs text-neutral-400">Upload photos, specs, pricing, and video link</p>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('leads')}
              className="p-5 bg-neutral-900 hover:bg-neutral-800/80 border border-neutral-800 rounded-xl flex items-center gap-4 transition-colors text-left cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-400/10 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Manage WhatsApp Leads</h4>
                <p className="text-xs text-neutral-400">Review customers awaiting answers or inspections</p>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className="p-5 bg-neutral-900 hover:bg-neutral-800/80 border border-neutral-800 rounded-xl flex items-center gap-4 transition-colors text-left cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-400/10 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Edit Dealer Profile</h4>
                <p className="text-xs text-neutral-400">Change WhatsApp number, business hours, and hubs</p>
              </div>
            </button>
          </div>

          {/* Recent Inquiries Preview */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white tracking-tight">Recent Client Inquiries</h3>
              <button
                onClick={() => setActiveTab('leads')}
                className="text-xs text-amber-400 hover:text-amber-300 font-medium"
              >
                View All Leads
              </button>
            </div>

            {leads.length === 0 ? (
              <p className="text-xs text-neutral-400 py-4">No inquiries received yet.</p>
            ) : (
              <div className="divide-y divide-neutral-800">
                {leads.slice(0, 5).map((l) => (
                  <div key={l.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                    <div>
                      <span className="font-semibold text-white">{l.name}</span>
                      <span className="text-neutral-400 ml-2">({l.phone})</span>
                      <p className="text-neutral-400 line-clamp-1 mt-0.5">{l.message}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                          l.status === 'New'
                            ? 'bg-amber-950/60 text-amber-300 border border-amber-800/60'
                            : 'bg-neutral-800 text-neutral-300'
                        }`}
                      >
                        {l.status}
                      </span>
                      <a
                        href={buildWhatsAppLink(
                          l.phone,
                          `Hello ${l.name}, thank you for reaching out to ${settings?.businessName || 'Paul Smith Autos'}.`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-semibold transition-colors flex items-center gap-1"
                      >
                        <MessageSquare className="w-3 h-3 fill-current" />
                        <span>Chat</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          TAB 2: INVENTORY MANAGER
          ---------------------------------------------------- */}
      {activeTab === 'vehicles' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Showroom Inventory Management</h2>
              <p className="text-xs text-neutral-400">
                Manage stock availability, pricing, photos, and generate instant WhatsApp broadcast posts.
              </p>
            </div>

            <button
              onClick={() => setEditingVehicle('new')}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold rounded-xl text-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Vehicle</span>
            </button>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-neutral-300">
                <thead className="bg-neutral-950/80 text-neutral-400 uppercase tracking-wider text-[11px] border-b border-neutral-800">
                  <tr>
                    <th className="py-3 px-4">Vehicle</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Condition</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Visibility</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/80">
                  {vehicles.map((v) => (
                    <tr key={v.id} className="hover:bg-neutral-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={v.images[0] || '/images/hero_car_showroom_1790168724059.jpg'}
                            alt={v.title}
                            referrerPolicy="no-referrer"
                            className="w-14 h-10 object-cover rounded-lg border border-neutral-800 shrink-0"
                          />
                          <div>
                            <div className="font-semibold text-white">{v.title}</div>
                            <div className="text-[11px] text-neutral-400">
                              {v.year} · {v.transmission} · {v.fuel}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono font-medium text-amber-400">
                        {formatPrice(v.price, v.currency, settings?.currencySymbol || '₦')}
                      </td>

                      <td className="py-3 px-4 text-neutral-300">{v.condition}</td>

                      <td className="py-3 px-4">
                        <select
                          value={v.status}
                          onChange={(e) => handleStatusChange(v.id, e.target.value)}
                          className="bg-neutral-950 border border-neutral-800 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-amber-400"
                        >
                          <option value="Available">Available</option>
                          <option value="In Transit">In Transit</option>
                          <option value="Reserved">Reserved</option>
                          <option value="Coming Soon">Coming Soon</option>
                          <option value="Sold">Sold</option>
                        </select>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleTogglePublish(v)}
                            title={v.published ? 'Unpublish from showroom' : 'Publish to showroom'}
                            className={`p-1.5 rounded transition-colors ${
                              v.published
                                ? 'bg-emerald-950/60 text-emerald-400 hover:bg-emerald-900/60'
                                : 'bg-neutral-800 text-neutral-500 hover:text-white'
                            }`}
                          >
                            {v.published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          </button>

                          <button
                            onClick={() => handleToggleFeatured(v)}
                            title={v.featured ? 'Featured on homepage' : 'Not featured'}
                            className={`p-1.5 rounded transition-colors ${
                              v.featured
                                ? 'bg-amber-950/60 text-amber-400 hover:bg-amber-900/60'
                                : 'bg-neutral-800 text-neutral-500 hover:text-white'
                            }`}
                          >
                            <Star className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setPostGenVehicle(v)}
                            title="Generate WhatsApp/Social Post"
                            className="p-1.5 text-emerald-400 hover:bg-neutral-800 rounded transition-colors"
                          >
                            <Sparkles className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setEditingVehicle(v)}
                            title="Edit Vehicle"
                            className="p-1.5 text-neutral-300 hover:text-white hover:bg-neutral-800 rounded transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDeleteVehicle(v.id, v.title)}
                            title="Delete Vehicle"
                            className="p-1.5 text-red-400 hover:bg-red-950/40 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          TAB: BRAND & MODEL HIERARCHY CATALOG
          ---------------------------------------------------- */}
      {activeTab === 'brands' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Brand & Model Hierarchy Catalog</h2>
              <p className="text-xs text-neutral-400">
                Manage the Brand → Model → Year hierarchy that powers vehicle search, categorization, and digital showroom inventory.
              </p>
            </div>

            {/* Quick Add Brand Form */}
            <form onSubmit={handleAddBrand} className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                required
                placeholder="New Brand Name (e.g. BMW)"
                value={newBrandName}
                onChange={(e) => setNewBrandName(e.target.value)}
                className="bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold rounded-xl text-xs whitespace-nowrap cursor-pointer uppercase tracking-wider shadow-sm"
              >
                Add Brand
              </button>
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {hierarchy.map((brand) => (
              <div
                key={brand.id}
                className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4 shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                    <div>
                      <h3 className="text-base font-bold text-white">{brand.name}</h3>
                      <span className="text-xs text-amber-400 font-medium">
                        {brand.vehicleCount} vehicle{brand.vehicleCount === 1 ? '' : 's'} in active stock
                      </span>
                    </div>

                    <button
                      onClick={() => handleDeleteBrand(brand.id, brand.name)}
                      title="Delete brand"
                      className="p-1.5 text-neutral-400 hover:text-red-400 hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Models list under this Brand */}
                  <div className="pt-3 space-y-2">
                    <span className="text-xs font-semibold text-neutral-400 block uppercase tracking-wider text-[11px]">
                      Models & Supported Years ({brand.models.length})
                    </span>

                    {brand.models.length === 0 ? (
                      <p className="text-xs text-neutral-500 italic py-2">No models added under {brand.name} yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {brand.models.map((model) => (
                          <div
                            key={model.id}
                            className="p-2.5 bg-neutral-950 rounded-xl border border-neutral-800/80 flex items-center justify-between gap-3 text-xs"
                          >
                            <div>
                              <span className="font-semibold text-white block">{model.name}</span>
                              <span className="text-[11px] text-neutral-400 font-mono">
                                Years: {model.years && model.years.length > 0 ? model.years.join(', ') : 'Any'}
                              </span>
                            </div>
                            <button
                              onClick={() => handleDeleteModel(brand.id, model.id)}
                              title="Delete model"
                              className="text-neutral-500 hover:text-red-400 p-1 cursor-pointer transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Add Model to this Brand */}
                <div className="pt-3 border-t border-neutral-800/80">
                  {activeBrandAddModal === brand.id ? (
                    <form onSubmit={(e) => handleAddModel(brand.id, e)} className="space-y-2 p-3 bg-neutral-950 rounded-xl border border-neutral-800">
                      <div className="flex items-center justify-between text-xs font-semibold text-white">
                        <span>Add Model to {brand.name}</span>
                        <button
                          type="button"
                          onClick={() => setActiveBrandAddModal(null)}
                          className="text-neutral-400 hover:text-white cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="Model name (e.g. Camry)"
                        value={newModelName}
                        onChange={(e) => setNewModelName(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                      <input
                        type="text"
                        placeholder="Years comma-separated (e.g. 2021, 2022, 2023)"
                        value={newModelYears}
                        onChange={(e) => setNewModelYears(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                      <button
                        type="submit"
                        className="w-full py-1.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold rounded-lg text-xs cursor-pointer"
                      >
                        Save Model
                      </button>
                    </form>
                  ) : (
                    <button
                      onClick={() => {
                        setActiveBrandAddModal(brand.id);
                        setNewModelName('');
                      }}
                      className="w-full py-2 bg-neutral-800/80 hover:bg-neutral-800 text-neutral-300 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-amber-400" />
                      <span>Add Model to {brand.name}</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          TAB 3: LEADS & INQUIRIES
          ---------------------------------------------------- */}
      {activeTab === 'leads' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Showroom Inquiries & Leads</h2>
            <p className="text-xs text-neutral-400">
              Track interested buyers, schedule showroom viewings, and contact them instantly on WhatsApp.
            </p>
          </div>

          <div className="space-y-4">
            {leads.length === 0 ? (
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 text-center text-xs text-neutral-400">
                No customer inquiries logged yet.
              </div>
            ) : (
              leads.map((l) => {
                const customerWhatsAppUrl = buildWhatsAppLink(
                  l.phone,
                  `Hello ${l.name}, thank you for contacting ${settings?.businessName || 'Paul Smith Autos'}. Regarding your interest in ${l.vehicleTitle || 'our vehicle inventory'}, how can we assist you?`
                );

                return (
                  <div
                    key={l.id}
                    className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4 shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-white">{l.name}</h3>
                          <span className="text-xs text-neutral-400">· {l.phone}</span>
                        </div>
                        <span className="text-[11px] text-neutral-500">
                          Received: {new Date(l.createdAt).toLocaleString()} · Source: {l.source}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={l.status}
                          onChange={(e) => handleUpdateLeadStatus(l.id, e.target.value)}
                          className="bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-amber-400"
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Qualified">Qualified</option>
                          <option value="Closed">Closed</option>
                        </select>

                        <a
                          href={customerWhatsAppUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
                        >
                          <MessageSquare className="w-3.5 h-3.5 fill-current" />
                          <span>Chat on WhatsApp</span>
                        </a>
                      </div>
                    </div>

                    {/* Inquiry Content */}
                    <div className="text-xs space-y-1">
                      {l.vehicleTitle && (
                        <p className="text-amber-400 font-semibold">Vehicle: {l.vehicleTitle}</p>
                      )}
                      {l.budget && (
                        <p className="text-neutral-300">Customer Offer / Budget: {l.budget}</p>
                      )}
                      <p className="text-neutral-300 bg-neutral-950 p-3 rounded-xl border border-neutral-800">
                        "{l.message}"
                      </p>
                    </div>

                    {/* Internal Notes History */}
                    {l.notes && l.notes.length > 0 && (
                      <div className="space-y-1 pt-1">
                        <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                          Internal Dealer Notes:
                        </span>
                        <div className="space-y-1">
                          {l.notes.map((n, i) => (
                            <div key={i} className="text-[11px] text-neutral-400 bg-neutral-950/60 px-2.5 py-1 rounded">
                              {n.text}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Add note field */}
                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="text"
                        placeholder="Add internal note (e.g. Mechanic inspection booked for Saturday)..."
                        value={leadNoteInput[l.id] || ''}
                        onChange={(e) => setLeadNoteInput({ ...leadNoteInput, [l.id]: e.target.value })}
                        className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                      <button
                        onClick={() => handleAddLeadNote(l.id)}
                        className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium rounded-lg transition-colors cursor-pointer"
                      >
                        Save Note
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          TAB 4: IMPORT REQUESTS
          ---------------------------------------------------- */}
      {activeTab === 'imports' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Custom Vehicle Import Sourcing</h2>
            <p className="text-xs text-neutral-400">
              Customer import requests for vehicles from China, USA, Canada, and Germany.
            </p>
          </div>

          <div className="space-y-4">
            {imports.length === 0 ? (
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 text-center text-xs text-neutral-400">
                No custom import requests yet.
              </div>
            ) : (
              imports.map((req) => {
                const customerWaUrl = buildWhatsAppLink(
                  req.whatsappNumber,
                  `Hello ${req.fullName}, I am following up on your custom vehicle import request for a ${req.preferredYear || ''} ${req.preferredBrand} ${req.preferredModel} from ${req.preferredCountry || 'China'}.`
                );

                return (
                  <div
                    key={req.id}
                    className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4 shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-white">{req.fullName}</h3>
                          <span className="text-xs text-neutral-400">· {req.whatsappNumber}</span>
                        </div>
                        <span className="text-[11px] text-neutral-500">
                          Submitted: {new Date(req.createdAt).toLocaleString()} · Sourcing Country:{' '}
                          <strong className="text-emerald-400">{req.preferredCountry || 'China'}</strong>
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={req.status}
                          onChange={(e) => handleUpdateImportStatus(req.id, e.target.value)}
                          className="bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-amber-400"
                        >
                          <option value="New">New</option>
                          <option value="Sourcing">Sourcing in Progress</option>
                          <option value="Quoted">Quoted to Customer</option>
                          <option value="Ordered">Ordered / In Transit</option>
                          <option value="Completed">Completed</option>
                          <option value="Closed">Closed</option>
                        </select>

                        <a
                          href={customerWaUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
                        >
                          <MessageSquare className="w-3.5 h-3.5 fill-current" />
                          <span>Chat on WhatsApp</span>
                        </a>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-neutral-950 p-3 rounded-xl border border-neutral-800">
                      <div>
                        <span className="text-neutral-500 block">Requested Vehicle</span>
                        <span className="text-white font-semibold">
                          {req.preferredYear} {req.preferredBrand} {req.preferredModel}
                        </span>
                      </div>

                      <div>
                        <span className="text-neutral-500 block">Target Budget</span>
                        <span className="text-amber-400 font-mono font-medium">{req.budget || 'Flexible'}</span>
                      </div>

                      <div>
                        <span className="text-neutral-500 block">Condition</span>
                        <span className="text-neutral-300">{req.condition || 'Brand New'}</span>
                      </div>

                      <div>
                        <span className="text-neutral-500 block">Trim / Requirements</span>
                        <span className="text-neutral-300">{req.specificRequirements || 'Standard'}</span>
                      </div>
                    </div>

                    {req.additionalMessage && (
                      <p className="text-xs text-neutral-300 italic">"{req.additionalMessage}"</p>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          TAB 5: FIND MY CAR REQUESTS
          ---------------------------------------------------- */}
      {activeTab === 'find_car' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Customer Car Finder Requests</h2>
            <p className="text-xs text-neutral-400">
              Inquiries from clients looking for specific models in local stock or network.
            </p>
          </div>

          <div className="space-y-4">
            {findCarRequests.length === 0 ? (
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 text-center text-xs text-neutral-400">
                No car locator requests logged.
              </div>
            ) : (
              findCarRequests.map((r) => (
                <div key={r.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                    <div>
                      <h4 className="text-sm font-bold text-white">{r.name}</h4>
                      <span className="text-xs text-neutral-400">{r.whatsapp}</span>
                    </div>

                    <a
                      href={buildWhatsAppLink(
                        r.whatsapp,
                        `Hello ${r.name}, following up from ${settings?.businessName || 'Paul Smith Autos'} on your car search for a ${r.year || ''} ${r.brand} ${r.model || ''}.`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5 fill-current" />
                      <span>Chat on WhatsApp</span>
                    </a>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-neutral-950 p-3 rounded-xl">
                    <div>
                      <span className="text-neutral-500 block">Vehicle</span>
                      <span className="text-white font-medium">
                        {r.year} {r.brand} {r.model}
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block">Budget</span>
                      <span className="text-amber-400 font-mono">{r.budget || 'Flexible'}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block">Condition</span>
                      <span className="text-neutral-300">{r.condition}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block">Transmission</span>
                      <span className="text-neutral-300">{r.transmission}</span>
                    </div>
                  </div>

                  {r.otherRequirements && (
                    <p className="text-xs text-neutral-300">Notes: {r.otherRequirements}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          TAB 6: BUSINESS SETTINGS
          ---------------------------------------------------- */}
      {activeTab === 'settings' && (
        <div className="space-y-6 max-w-4xl">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Dealership Profile & Settings</h2>
            <p className="text-xs text-neutral-400">
              Customize business name, WhatsApp sales number, currency symbols, and international sourcing countries.
            </p>
          </div>

          {settingsSaved && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-800/80 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Dealership settings successfully updated! Changes are live across the showroom.</span>
            </div>
          )}

          {settingsError && (
            <div className="p-3 bg-red-950/40 border border-red-800/80 rounded-xl text-xs text-red-300">
              {settingsError}
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">Business / Dealership Name</label>
                <input
                  type="text"
                  value={settingsForm.businessName || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, businessName: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">Tagline / Subtitle</label>
                <input
                  type="text"
                  value={settingsForm.tagline || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Primary WhatsApp Sales Number <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="+2348012345678"
                  value={settingsForm.whatsappNumber || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
                <span className="text-[11px] text-neutral-500 mt-1 block">
                  International format with country code (e.g. +2348000000000 or +1234567890)
                </span>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  VIP WhatsApp Group Invite Link (Optional)
                </label>
                <input
                  type="text"
                  placeholder="https://chat.whatsapp.com/..."
                  value={settingsForm.whatsappGroupLink || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, whatsappGroupLink: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">Phone Call Line</label>
                <input
                  type="text"
                  value={settingsForm.phone || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">Dealership Email</label>
                <input
                  type="email"
                  value={settingsForm.email || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">Physical Showroom Address</label>
                <input
                  type="text"
                  placeholder="e.g. Plot 14, Victoria Island, Lagos"
                  value={settingsForm.address || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">Business Hours</label>
                <input
                  type="text"
                  placeholder="e.g. Mon - Sat: 8:30 AM - 6:00 PM"
                  value={settingsForm.businessHours || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, businessHours: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">Currency Symbol</label>
                <input
                  type="text"
                  placeholder="₦ or $"
                  value={settingsForm.currencySymbol || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, currencySymbol: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">Currency Code</label>
                <input
                  type="text"
                  placeholder="NGN, USD, EUR"
                  value={settingsForm.currency || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, currency: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 uppercase font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">Dealership Description</label>
              <textarea
                rows={3}
                value={settingsForm.businessDescription || ''}
                onChange={(e) => setSettingsForm({ ...settingsForm, businessDescription: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-amber-400 resize-none"
              />
            </div>

            {/* CEO Leadership Fields */}
            <div className="pt-4 border-t border-neutral-800 space-y-4">
              <h3 className="text-xs uppercase tracking-wider text-amber-400 font-bold">
                Founder & Executive Leadership Profile
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">Founder / CEO Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Paul Smith"
                    value={settingsForm.ceoName || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, ceoName: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">Leadership Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Founder & CEO"
                    value={settingsForm.ceoTitle || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, ceoTitle: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">CEO Direct Contact Line</label>
                  <input
                    type="text"
                    placeholder="e.g. 08037781788"
                    value={settingsForm.ceoPhone || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, ceoPhone: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">CEO Image Asset URL</label>
                <input
                  type="text"
                  placeholder="/images/ceo_paul_smith_1790590776884.jpg"
                  value={settingsForm.ceoImage || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, ceoImage: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  CEO Authenticity Statement / Quote
                </label>
                <textarea
                  rows={2}
                  placeholder="At Paul Smith Autos, we inspect every car down to the bolt. No accident-concealed vehicles, no tampered odometers..."
                  value={settingsForm.ceoQuote || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, ceoQuote: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                Active Vehicle Import Sourcing Hubs (comma-separated)
              </label>
              <input
                type="text"
                placeholder="China, United States, Canada, Germany"
                value={(settingsForm.importCountries || []).join(', ')}
                onChange={(e) =>
                  setSettingsForm({
                    ...settingsForm,
                    importCountries: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                  })
                }
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="inspectionOffered"
                checked={settingsForm.inspectionOffered !== false}
                onChange={(e) => setSettingsForm({ ...settingsForm, inspectionOffered: e.target.checked })}
                className="w-4 h-4 rounded text-amber-400 bg-neutral-950 border-neutral-800"
              />
              <label htmlFor="inspectionOffered" className="text-xs text-neutral-300 cursor-pointer">
                Enable "Schedule Inspection" booking CTA across showroom vehicle pages
              </label>
            </div>

            <div className="pt-4 border-t border-neutral-800">
              <button
                type="submit"
                className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Save Settings
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ----------------------------------------------------
          TAB 7: AUDIT TRAIL
          ---------------------------------------------------- */}
      {activeTab === 'audit' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Audit Trail & Activity Log</h2>
            <p className="text-xs text-neutral-400">
              Immutable record of vehicle creations, status modifications, lead updates, and settings changes.
            </p>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
            <div className="divide-y divide-neutral-800 text-xs">
              {auditLogs.length === 0 ? (
                <div className="p-8 text-center text-neutral-500">No activity logged.</div>
              ) : (
                auditLogs.map((log) => (
                  <div key={log.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="font-semibold text-white uppercase tracking-wider text-[11px] bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800 mr-2">
                        {log.action}
                      </span>
                      <span className="text-neutral-300">{log.targetType} ({log.targetId})</span>
                      <div className="text-[11px] text-neutral-400 mt-1">
                        Details: {log.details}
                      </div>
                    </div>
                    <span className="text-[11px] text-neutral-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Vehicle Editor Modal (Add/Edit) */}
      {editingVehicle && (
        <VehicleEditorModal
          vehicle={editingVehicle === 'new' ? null : editingVehicle}
          onClose={() => setEditingVehicle(null)}
          onSaved={() => {
            setEditingVehicle(null);
            loadAllAdminData();
          }}
        />
      )}

      {/* Social Post Generator Modal */}
      {postGenVehicle && (
        <SocialPostModal vehicle={postGenVehicle} onClose={() => setPostGenVehicle(null)} />
      )}
    </div>
  );
};
