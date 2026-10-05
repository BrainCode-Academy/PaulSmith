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
  Upload,
  ArrowUp,
  ArrowDown,
  Play,
  ArrowRight,
  X,
  Sliders,
  ChevronLeft,
  ChevronRight,
  Gauge,
  Fuel,
  KeyRound,
  ShieldCheck,
} from 'lucide-react';
import { Vehicle, Lead, ImportRequest, CarRequest, AdminStats, AuditLog, DealerSettings, BrandHierarchyResult, Review, ShowroomSlide } from '../../types';
import { useDealer } from '../../context/DealerContext';
import { api } from '../../lib/api';
import { formatPrice, buildWhatsAppLink } from '../../lib/whatsapp';
import { SocialPostModal } from '../../components/SocialPostModal';
import { VehicleEditorModal } from './VehicleEditorModal';

interface AdminDashboardProps {
  onNavigate: (path: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { settings, updateSettings, isAdmin, login, logout, refreshSettings } = useDealer();

  // Auth state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  // Initial Admin Setup states
  const [adminSetupStatus, setAdminSetupStatus] = useState<{ isSetup: boolean; username: string } | null>(null);
  const [setupPassword, setSetupPassword] = useState('');
  const [setupConfirmPassword, setSetupConfirmPassword] = useState('');
  const [settingUp, setSettingUp] = useState(false);
  const [setupError, setSetupError] = useState<string | null>(null);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<'overview' | 'vehicles' | 'hero_slider' | 'brands' | 'leads' | 'imports' | 'find_car' | 'reviews' | 'settings' | 'audit'>('overview');
  const [sliderSubTab, setSliderSubTab] = useState<'showroom_slides' | 'featured_cars'>('showroom_slides');

  // Hero Slider states (Featured Vehicles)
  const [previewSlideVehicle, setPreviewSlideVehicle] = useState<Vehicle | null>(null);
  const [showAddSliderModal, setShowAddSliderModal] = useState(false);
  const [sliderSearchTerm, setSliderSearchTerm] = useState('');
  const [savingSliderOrder, setSavingSliderOrder] = useState(false);

  // Showroom Slider states (Physical Dealership Showroom Floor Images)
  const [showroomSlides, setShowroomSlides] = useState<ShowroomSlide[]>([]);
  const [showAddSlideModal, setShowAddSlideModal] = useState(false);
  const [newSlideUrl, setNewSlideUrl] = useState('');
  const [newSlideCaption, setNewSlideCaption] = useState('');
  const [uploadingSlide, setUploadingSlide] = useState(false);

  // Reviews states
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showAddReviewModal, setShowAddReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState<Partial<Review>>({
    customerName: '',
    vehiclePurchased: '',
    rating: 5,
    comment: '',
    date: new Date().toISOString().split('T')[0],
    verified: true,
    published: true,
  });
  const [savingReview, setSavingReview] = useState(false);

  // Password Change in Settings
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

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
  const [newBrandCountry, setNewBrandCountry] = useState('Japan');
  const [adminBrandSearch, setAdminBrandSearch] = useState('');
  const [editingBrand, setEditingBrand] = useState<{ id: string; name: string; country?: string } | null>(null);
  const [activeBrandAddModal, setActiveBrandAddModal] = useState<string | null>(null);
  const [newModelName, setNewModelName] = useState('');
  const [newModelYears, setNewModelYears] = useState('2022, 2023, 2024, 2025, 2026');
  const [newModelCategory, setNewModelCategory] = useState('SUV');
  const [editingModel, setEditingModel] = useState<{ brandId: string; modelId: string; name: string; years: string; category?: string } | null>(null);
  const [quickAddYearModel, setQuickAddYearModel] = useState<{ brandId: string; modelId: string } | null>(null);
  const [quickYearInput, setQuickYearInput] = useState('');

  // Modal states
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null | 'new'>(null);
  const [postGenVehicle, setPostGenVehicle] = useState<Vehicle | null>(null);

  // Settings form state
  const [settingsForm, setSettingsForm] = useState<Partial<DealerSettings>>({});
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [settingsError, setSettingsError] = useState<string | null>(null);
  const [uploadingCeoImage, setUploadingCeoImage] = useState(false);

  const handleCeoImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCeoImage(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64 = reader.result as string;
          const url = await api.uploadImage(base64, file.name);
          setSettingsForm((prev) => ({ ...prev, ceoImage: url }));
        } catch (err: any) {
          alert(`Failed to upload CEO portrait: ${err.message}`);
        } finally {
          setUploadingCeoImage(false);
        }
      };
      reader.readAsDataURL(file);
    } catch {
      setUploadingCeoImage(false);
    }
  };

  // Lead note state
  const [leadNoteInput, setLeadNoteInput] = useState<{ [leadId: string]: string }>({});

  const loadAllAdminData = async () => {
    if (!isAdmin) return;
    setLoading(true);
    try {
      const [statsData, vehiclesData, leadsData, importsData, findCarData, auditData, hierarchyData, reviewsData, slidesData] = await Promise.all([
        api.getStats(),
        api.getVehicles({ includeUnpublished: true }),
        api.getLeads(),
        api.getImportRequests(),
        api.getFindCarRequests(),
        api.getAuditLogs(),
        api.getHierarchy({ includeDisabled: true }),
        api.getAdminReviews(),
        api.getShowroomSlides(),
      ]);

      setStats(statsData);
      setVehicles(vehiclesData);
      setLeads(leadsData);
      setImports(importsData);
      setFindCarRequests(findCarData);
      setAuditLogs(auditData);
      setHierarchy(hierarchyData);
      setReviews(reviewsData);
      setShowroomSlides(slidesData);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    api.getAdminSetupStatus()
      .then(setAdminSetupStatus)
      .catch((err) => console.error('Failed to check admin setup status:', err));
  }, []);

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

  const handleInitialSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (setupPassword.length < 8) {
      setSetupError('Master password must be at least 8 characters long.');
      return;
    }
    if (setupPassword !== setupConfirmPassword) {
      setSetupError('Passwords do not match.');
      return;
    }
    setSettingUp(true);
    setSetupError(null);
    try {
      await api.setupInitialAdmin(setupPassword, setupConfirmPassword);
      window.location.reload();
    } catch (err: any) {
      setSetupError(err.message || 'Setup failed.');
    } finally {
      setSettingUp(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }
    setChangingPassword(true);
    setPasswordSuccess(null);
    setPasswordError(null);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('autoprime_admin_token') || ''}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update password');
      }
      setPasswordSuccess('Administrator password successfully updated.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to update password');
    } finally {
      setChangingPassword(false);
    }
  };

  // Showroom Slides Management Handlers
  const handleAddShowroomSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlideUrl.trim()) return;
    try {
      await api.addShowroomSlide(newSlideUrl.trim(), newSlideCaption.trim() || undefined);
      setShowAddSlideModal(false);
      setNewSlideUrl('');
      setNewSlideCaption('');
      const updated = await api.getShowroomSlides();
      setShowroomSlides(updated);
      await refreshSettings();
    } catch (err: any) {
      alert(`Failed to add showroom slide: ${err.message}`);
    }
  };

  const handleToggleShowroomSlideEnabled = async (slide: ShowroomSlide) => {
    try {
      await api.updateShowroomSlide(slide.id, { enabled: !slide.enabled });
      const updated = await api.getShowroomSlides();
      setShowroomSlides(updated);
      await refreshSettings();
    } catch (err: any) {
      alert(`Failed to toggle showroom slide: ${err.message}`);
    }
  };

  const handleDeleteShowroomSlide = async (slideId: string) => {
    if (!confirm('Remove this showroom slide from homepage background?')) return;
    try {
      await api.deleteShowroomSlide(slideId);
      const updated = await api.getShowroomSlides();
      setShowroomSlides(updated);
      await refreshSettings();
    } catch (err: any) {
      alert(`Failed to delete showroom slide: ${err.message}`);
    }
  };

  const handleMoveShowroomSlide = async (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= showroomSlides.length) return;
    const reordered = [...showroomSlides];
    const temp = reordered[index];
    reordered[index] = reordered[targetIdx];
    reordered[targetIdx] = temp;
    try {
      const orderedIds = reordered.map((s) => s.id);
      const saved = await api.reorderShowroomSlides(orderedIds);
      setShowroomSlides(saved);
      await refreshSettings();
    } catch (err: any) {
      alert(`Failed to reorder showroom slides: ${err.message}`);
    }
  };

  const handleSlideImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingSlide(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64 = reader.result as string;
          const url = await api.uploadImage(base64, file.name);
          setNewSlideUrl(url);
        } catch (err: any) {
          alert(`Image upload failed: ${err.message}`);
        } finally {
          setUploadingSlide(false);
        }
      };
      reader.readAsDataURL(file);
    } catch {
      setUploadingSlide(false);
    }
  };

  // Review Management Handlers
  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.customerName || !reviewForm.comment) {
      alert('Customer name and testimonial comment are required.');
      return;
    }
    setSavingReview(true);
    try {
      await api.createReview(reviewForm);
      setShowAddReviewModal(false);
      setReviewForm({
        customerName: '',
        vehiclePurchased: '',
        rating: 5,
        comment: '',
        date: new Date().toISOString().split('T')[0],
        verified: true,
        published: true,
      });
      const updated = await api.getAdminReviews();
      setReviews(updated);
    } catch (err: any) {
      alert(`Failed to create review: ${err.message}`);
    } finally {
      setSavingReview(false);
    }
  };

  const handleToggleReview = async (id: string, field: 'published' | 'verified') => {
    try {
      await api.toggleReview(id, field);
      const updated = await api.getAdminReviews();
      setReviews(updated);
    } catch (err: any) {
      alert(`Failed to toggle review: ${err.message}`);
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!confirm('Are you sure you want to delete this customer review?')) return;
    try {
      await api.deleteReview(id);
      const updated = await api.getAdminReviews();
      setReviews(updated);
    } catch (err: any) {
      alert(`Failed to delete review: ${err.message}`);
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

  // Hero Slider Management Handlers
  const handleAddToSlider = async (vehicleId: string) => {
    try {
      const currentFeatured = vehicles.filter(v => v.featured);
      await api.updateVehicle(vehicleId, {
        featured: true,
        heroSlideEnabled: true,
        featuredOrder: currentFeatured.length,
      });
      setShowAddSliderModal(false);
      await loadAllAdminData();
    } catch (err: any) {
      alert(`Failed to add vehicle to slider: ${err.message}`);
    }
  };

  const handleRemoveFromSlider = async (vehicle: Vehicle) => {
    if (!confirm(`Remove "${vehicle.title}" from the homepage hero slider?`)) return;
    try {
      await api.updateVehicle(vehicle.id, { featured: false });
      await loadAllAdminData();
    } catch (err: any) {
      alert(`Failed to remove vehicle from slider: ${err.message}`);
    }
  };

  const handleToggleSlideEnabled = async (vehicle: Vehicle) => {
    try {
      const nextState = vehicle.heroSlideEnabled === false ? true : false;
      await api.updateVehicle(vehicle.id, { heroSlideEnabled: nextState });
      await loadAllAdminData();
    } catch (err: any) {
      alert(`Failed to toggle slide status: ${err.message}`);
    }
  };

  const handleSetPrimarySlide = async (vehicleId: string) => {
    try {
      setSavingSliderOrder(true);
      const featured = vehicles
        .filter(v => v.featured)
        .sort((a, b) => (a.featuredOrder ?? 0) - (b.featuredOrder ?? 0));
      const targetVehicle = featured.find(v => v.id === vehicleId);
      if (!targetVehicle) return;

      const remaining = featured.filter(v => v.id !== vehicleId);
      const newOrder = [targetVehicle.id, ...remaining.map(v => v.id)];
      await api.reorderHeroSlides(newOrder);
      await loadAllAdminData();
    } catch (err: any) {
      alert(`Failed to set primary slide: ${err.message}`);
    } finally {
      setSavingSliderOrder(false);
    }
  };

  const handleMoveSlide = async (vehicleId: string, direction: 'up' | 'down') => {
    try {
      setSavingSliderOrder(true);
      const featured = vehicles
        .filter(v => v.featured)
        .sort((a, b) => (a.featuredOrder ?? 0) - (b.featuredOrder ?? 0));
      const currentIndex = featured.findIndex(v => v.id === vehicleId);
      if (currentIndex === -1) return;

      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (targetIndex < 0 || targetIndex >= featured.length) return;

      const newFeatured = [...featured];
      const temp = newFeatured[currentIndex];
      newFeatured[currentIndex] = newFeatured[targetIndex];
      newFeatured[targetIndex] = temp;

      const orderedIds = newFeatured.map(v => v.id);
      await api.reorderHeroSlides(orderedIds);
      await loadAllAdminData();
    } catch (err: any) {
      alert(`Failed to reorder slide: ${err.message}`);
    } finally {
      setSavingSliderOrder(false);
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
      await api.addBrand(newBrandName.trim(), newBrandCountry.trim());
      setNewBrandName('');
      setNewBrandCountry('Japan');
      await loadAllAdminData();
    } catch (err: any) {
      alert(`Failed to add brand: ${err.message}`);
    }
  };

  const handleEditBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBrand || !editingBrand.name.trim()) return;
    try {
      await api.updateBrand(editingBrand.id, {
        name: editingBrand.name.trim(),
        country: editingBrand.country?.trim() || 'Global',
      });
      setEditingBrand(null);
      await loadAllAdminData();
    } catch (err: any) {
      alert(`Failed to update brand: ${err.message}`);
    }
  };

  const handleToggleBrand = async (brandId: string) => {
    try {
      await api.toggleBrand(brandId);
      await loadAllAdminData();
    } catch (err: any) {
      alert(`Failed to toggle brand status: ${err.message}`);
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
      await api.addModel(brandId, newModelName.trim(), years, newModelCategory);
      setNewModelName('');
      setActiveBrandAddModal(null);
      await loadAllAdminData();
    } catch (err: any) {
      alert(`Failed to add model: ${err.message}`);
    }
  };

  const handleUpdateModel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingModel || !editingModel.name.trim()) return;
    const years = editingModel.years
      .split(',')
      .map((y) => parseInt(y.trim(), 10))
      .filter((y) => !isNaN(y));
    try {
      await api.updateModel(editingModel.brandId, editingModel.modelId, {
        name: editingModel.name.trim(),
        years,
        category: editingModel.category || undefined,
      });
      setEditingModel(null);
      await loadAllAdminData();
    } catch (err: any) {
      alert(`Failed to update model: ${err.message}`);
    }
  };

  const handleAddSupportedYear = async (brandId: string, modelId: string, currentYears: number[], newYear: number) => {
    if (!newYear || isNaN(newYear)) return;
    if (currentYears.includes(newYear)) return;
    const updatedYears = [...currentYears, newYear].sort((a, b) => b - a);
    try {
      await api.updateModel(brandId, modelId, { years: updatedYears });
      setQuickAddYearModel(null);
      setQuickYearInput('');
      await loadAllAdminData();
    } catch (err: any) {
      alert(`Failed to add supported year: ${err.message}`);
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
  // Login Screen or Initial Setup Screen if not authenticated
  // ----------------------------------------------------
  if (!isAdmin) {
    const isInitialSetup = adminSetupStatus && !adminSetupStatus.isSetup;

    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md bg-[#0e1422] border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-blue-600/10 border border-blue-500/30 rounded-xl flex items-center justify-center text-blue-400 mx-auto">
              <Shield className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              {isInitialSetup ? 'First-Time Administrator Setup' : 'Dealership Admin Portal'}
            </h1>
            <p className="text-xs text-slate-400">
              {isInitialSetup
                ? 'Create a secure master password for the administrator account to access the dealership console.'
                : 'Sign in to manage showroom inventory, client inquiries, and import requests.'}
            </p>
          </div>

          {isInitialSetup ? (
            /* First-Time Setup Wizard */
            <form onSubmit={handleInitialSetup} className="space-y-4">
              {setupError && (
                <div className="p-3 bg-red-950/40 border border-red-800/80 rounded-lg text-xs text-red-300">
                  {setupError}
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Administrator Username</label>
                <input
                  type="text"
                  disabled
                  value={adminSetupStatus?.username || 'admin'}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-slate-400 cursor-not-allowed font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Master Password (min. 8 characters)</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={setupPassword}
                  onChange={(e) => setSetupPassword(e.target.value)}
                  placeholder="Enter strong password..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Confirm Master Password</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={setupConfirmPassword}
                  onChange={(e) => setSetupConfirmPassword(e.target.value)}
                  placeholder="Repeat master password..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={settingUp}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer shadow-lg shadow-blue-600/20"
              >
                {settingUp ? 'Initializing Credentials...' : 'Set Admin Password & Access Console'}
              </button>

              <div className="p-3 bg-slate-950/80 border border-slate-800/80 rounded-lg text-[11px] text-slate-400 text-center">
                Credentials are salted and hashed with PBKDF2-SHA512. No plaintext passwords are saved.
              </div>
            </form>
          ) : (
            /* Regular Sign In */
            <form onSubmit={handleLogin} className="space-y-4">
              {loginError && (
                <div className="p-3 bg-red-950/40 border border-red-800/80 rounded-lg text-xs text-red-300">
                  {loginError}
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Username</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={loggingIn}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer shadow-lg shadow-blue-600/20"
              >
                {loggingIn ? 'Authenticating...' : 'Sign In to Portal'}
              </button>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-[11px] text-slate-400 text-center">
                Authorized dealership personnel only. Protected by cryptographic session verification.
              </div>
            </form>
          )}
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
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/60">
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
          { id: 'hero_slider', label: `Homepage & Sliders (${showroomSlides.length + vehicles.filter(v => v.featured).length})`, icon: Sparkles },
          { id: 'brands', label: `Brands & Models (${hierarchy.length})`, icon: Layers },
          { id: 'leads', label: `Inquiries & Leads (${leads.length})`, icon: Users },
          { id: 'imports', label: `Import Sourcing (${imports.length})`, icon: Ship },
          { id: 'find_car', label: `Car Requests (${findCarRequests.length})`, icon: Search },
          { id: 'reviews', label: `Reviews & Proof (${reviews.length})`, icon: Star },
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
                  ? 'bg-blue-600 text-white font-semibold shadow'
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
              <div className="text-2xl font-bold text-blue-400 font-mono">{stats?.totalLeads ?? leads.length}</div>
              <div className="text-[11px] text-blue-300/80 pt-1">
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
              <div className="w-10 h-10 rounded-lg bg-blue-600/10 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
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
                className="text-xs text-blue-400 hover:text-blue-300 font-medium"
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
                            ? 'bg-blue-950/60 text-blue-300 border border-blue-800/60'
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
              className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer"
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

                      <td className="py-3 px-4 font-mono font-semibold text-white">
                        {formatPrice(v.price, v.currency, settings?.currencySymbol || '₦')}
                      </td>

                      <td className="py-3 px-4 text-neutral-300">{v.condition}</td>

                      <td className="py-3 px-4">
                        <select
                          value={v.status}
                          onChange={(e) => handleStatusChange(v.id, e.target.value)}
                          className="bg-neutral-950 border border-neutral-800 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-blue-500"
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
                                ? 'bg-blue-950/60 text-amber-400 hover:bg-amber-900/60'
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
          TAB 2.5: HOMEPAGE & SLIDERS MANAGEMENT
          ---------------------------------------------------- */}
      {activeTab === 'hero_slider' && (
        <div className="space-y-6">
          {/* Sub-tab navigation */}
          <div className="flex items-center gap-3 border-b border-neutral-800 pb-3">
            <button
              onClick={() => setSliderSubTab('showroom_slides')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                sliderSubTab === 'showroom_slides'
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-neutral-900 text-neutral-300 hover:text-white hover:bg-neutral-800 border border-neutral-800'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Showroom Gallery Slider ({showroomSlides.length} slides)</span>
            </button>

            <button
              onClick={() => setSliderSubTab('featured_cars')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                sliderSubTab === 'featured_cars'
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-neutral-900 text-neutral-300 hover:text-white hover:bg-neutral-800 border border-neutral-800'
              }`}
            >
              <Car className="w-4 h-4" />
              <span>Featured Vehicle Carousel ({vehicles.filter(v => v.featured).length} cars)</span>
            </button>
          </div>

          {sliderSubTab === 'showroom_slides' ? (
            /* Showroom Display Slider Management (Physical Dealership Floor Photos) */
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">Dealership Showroom Floor Gallery</h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    Manage the authentic dealership showroom floor and facility photos displayed in the subtle homepage hero background.
                    <span className="text-blue-400 font-semibold block sm:inline sm:ml-1">
                      (Physical showroom background gallery, NOT a vehicle price slider).
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => onNavigate('/')}
                    className="flex items-center gap-1.5 px-3 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 rounded-xl text-xs font-medium transition cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Public Hero</span>
                  </button>

                  <button
                    onClick={() => setShowAddSlideModal(true)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-xs transition cursor-pointer shadow-md shadow-blue-600/10"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Showroom Slide</span>
                  </button>
                </div>
              </div>

              {showroomSlides.length === 0 ? (
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-12 text-center space-y-4">
                  <ImageIcon className="w-10 h-10 text-neutral-600 mx-auto" />
                  <p className="text-xs text-neutral-400">No showroom display slides uploaded yet.</p>
                  <button
                    onClick={() => setShowAddSlideModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-xl text-xs"
                  >
                    Add First Showroom Slide
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {showroomSlides.map((slide, idx) => (
                    <div
                      key={slide.id}
                      className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between"
                    >
                      <div className="relative aspect-[16/9] bg-neutral-950">
                        <img
                          src={slide.url}
                          alt={slide.caption || 'Showroom slide'}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 flex items-center gap-1.5">
                          <span className="bg-black/80 font-mono text-[10px] text-blue-400 px-2 py-0.5 rounded font-bold border border-blue-500/30">
                            Slide #{idx + 1}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              slide.enabled !== false
                                ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/80'
                                : 'bg-neutral-900/90 text-neutral-400 border border-neutral-700'
                            }`}
                          >
                            {slide.enabled !== false ? 'Active' : 'Disabled'}
                          </span>
                        </div>
                      </div>

                      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                        <div>
                          <p className="text-xs font-semibold text-white">
                            {slide.caption || 'Paul Smith Autos Showroom View'}
                          </p>
                          <p className="text-[11px] text-neutral-500 font-mono truncate mt-0.5">
                            {slide.url}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-neutral-800/60">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleMoveShowroomSlide(idx, 'up')}
                              disabled={idx === 0}
                              title="Move slide earlier"
                              className="p-1.5 bg-neutral-950 hover:bg-neutral-800 text-neutral-300 disabled:opacity-30 rounded-lg text-xs transition cursor-pointer"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleMoveShowroomSlide(idx, 'down')}
                              disabled={idx === showroomSlides.length - 1}
                              title="Move slide later"
                              className="p-1.5 bg-neutral-950 hover:bg-neutral-800 text-neutral-300 disabled:opacity-30 rounded-lg text-xs transition cursor-pointer"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleToggleShowroomSlideEnabled(slide)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                                slide.enabled !== false
                                  ? 'bg-neutral-800 text-neutral-300 hover:text-white'
                                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                              }`}
                            >
                              {slide.enabled !== false ? 'Disable' : 'Enable'}
                            </button>

                            <button
                              onClick={() => handleDeleteShowroomSlide(slide.id)}
                              className="p-1.5 text-neutral-400 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition cursor-pointer"
                              title="Delete slide"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">Homepage Hero Slider Management</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-600/20 text-blue-400 border border-blue-500/30">
                  {vehicles.filter((v) => v.featured).length} Featured Slides
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-1">
                Curate and order the full-width vehicle showcase on the homepage. Reorder slides, set the primary slide, or enable/disable slides with 1 click.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => onNavigate('/')}
                className="flex items-center gap-1.5 px-3 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 rounded-xl text-xs font-medium transition cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Live Slider</span>
              </button>

              <button
                onClick={() => setShowAddSliderModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-xs transition cursor-pointer shadow-md shadow-blue-600/10"
              >
                <Plus className="w-4 h-4" />
                <span>Add Vehicle to Slider</span>
              </button>
            </div>
          </div>

          {/* Business Logic Rule Notice */}
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <CheckCircle className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-neutral-200">Automatic Display Rule</p>
                <p className="text-neutral-400 text-[11px]">
                  Only vehicles marked <strong className="text-blue-400">Featured + Published + Available</strong> appear on the public homepage slider. Sold, reserved, or unpublished vehicles are automatically excluded.
                </p>
              </div>
            </div>

            <div className="text-[11px] text-neutral-400 font-mono bg-neutral-950 px-3 py-1.5 rounded-lg border border-neutral-800 shrink-0">
              Live in Rotation:{' '}
              <strong className="text-emerald-400 font-bold">
                {
                  vehicles.filter(
                    (v) =>
                      v.featured &&
                      v.published &&
                      v.status === 'Available' &&
                      v.heroSlideEnabled !== false
                  ).length
                }{' '}
                cars
              </strong>
            </div>
          </div>

          {/* Active Featured Slides Table */}
          {vehicles.filter((v) => v.featured).length === 0 ? (
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-500 mx-auto">
                <Sparkles className="w-6 h-6 text-blue-400" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white">No Vehicles Featured on Homepage Slider</h3>
                <p className="text-xs text-neutral-400 max-w-md mx-auto">
                  Select vehicles from your inventory to showcase on the homepage hero carousel. Customers will discover them first when visiting Paul Smith Autos.
                </p>
              </div>
              <button
                onClick={() => setShowAddSliderModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-xs transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Select First Featured Vehicle</span>
              </button>
            </div>
          ) : (
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                  Featured Slides in Carousel Order
                </span>
                {savingSliderOrder && (
                  <span className="text-xs text-blue-400 animate-pulse font-medium">
                    Saving slide order...
                  </span>
                )}
              </div>

              <div className="divide-y divide-neutral-800/80">
                {vehicles
                  .filter((v) => v.featured)
                  .sort((a, b) => (a.featuredOrder ?? 0) - (b.featuredOrder ?? 0))
                  .map((v, index, arr) => {
                    const isLive =
                      v.featured &&
                      v.published &&
                      v.status === 'Available' &&
                      v.heroSlideEnabled !== false;

                    const heroImg =
                      v.images && v.images.length > 0
                        ? v.images[0]
                        : '/images/hero_car_showroom_1790168724059.jpg';

                    return (
                      <div
                        key={v.id}
                        className="p-4 hover:bg-neutral-800/30 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        {/* Slide Ranking, Thumbnail & Info */}
                        <div className="flex items-center gap-4">
                          <div className="flex flex-col items-center justify-center w-8 shrink-0 text-center font-mono">
                            <span className="text-xs font-bold text-neutral-400">
                              #{index + 1}
                            </span>
                            {index === 0 && (
                              <span className="text-[9px] uppercase tracking-wider font-extrabold text-blue-400">
                                Primary
                              </span>
                            )}
                          </div>

                          <div className="relative w-20 h-14 sm:w-24 sm:h-16 rounded-lg overflow-hidden border border-neutral-800 bg-neutral-950 shrink-0">
                            <img
                              src={heroImg}
                              alt={v.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                            {index === 0 && (
                              <div className="absolute top-1 left-1 bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                                1st
                              </div>
                            )}
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-white hover:text-blue-300 transition cursor-pointer"
                                onClick={() => setPreviewSlideVehicle(v)}
                              >
                                {v.year} {v.make} {v.model}
                              </h4>
                              {isLive ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                  Live on Hero
                                </span>
                              ) : v.heroSlideEnabled === false ? (
                                <span className="text-[10px] font-medium text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded-full">
                                  Slide Disabled
                                </span>
                              ) : !v.published ? (
                                <span className="text-[10px] font-medium text-blue-400 bg-blue-950/50 px-2 py-0.5 rounded-full">
                                  Unpublished
                                </span>
                              ) : (
                                <span className="text-[10px] font-medium text-red-400 bg-red-950/50 px-2 py-0.5 rounded-full">
                                  {v.status}
                                </span>
                              )}
                            </div>

                            <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-400">
                              <span className="font-mono text-white font-medium">
                                {formatPrice(v.price, v.currency, settings?.currencySymbol || '₦')}
                              </span>
                              <span>·</span>
                              <span>{v.transmission}</span>
                              <span>·</span>
                              <span>{v.fuel}</span>
                              <span>·</span>
                              <span>{v.condition}</span>
                            </div>
                          </div>
                        </div>

                        {/* Interactive Controls */}
                        <div className="flex flex-wrap items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-neutral-800/60">
                          {/* Reorder Buttons */}
                          <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-lg border border-neutral-800">
                            <button
                              onClick={() => handleMoveSlide(v.id, 'up')}
                              disabled={index === 0 || savingSliderOrder}
                              title="Move Slide Up"
                              className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 disabled:opacity-30 rounded transition cursor-pointer"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleMoveSlide(v.id, 'down')}
                              disabled={index === arr.length - 1 || savingSliderOrder}
                              title="Move Slide Down"
                              className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 disabled:opacity-30 rounded transition cursor-pointer"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Set Primary Slide Button */}
                          {index !== 0 && (
                            <button
                              onClick={() => handleSetPrimarySlide(v.id)}
                              disabled={savingSliderOrder}
                              title="Set as First / Primary Slide"
                              className="px-2.5 py-1.5 text-[11px] font-semibold text-neutral-300 hover:text-blue-400 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 rounded-lg transition cursor-pointer"
                            >
                              Make Primary
                            </button>
                          )}

                          {/* Enable / Disable Slide Toggle */}
                          <button
                            onClick={() => handleToggleSlideEnabled(v)}
                            title={
                              v.heroSlideEnabled === false
                                ? 'Enable this slide in rotation'
                                : 'Disable this slide from rotation'
                            }
                            className={`px-2.5 py-1.5 text-[11px] font-semibold rounded-lg border transition cursor-pointer ${
                              v.heroSlideEnabled === false
                                ? 'bg-neutral-800 text-neutral-400 border-neutral-700 hover:text-white'
                                : 'bg-emerald-950/40 text-emerald-400 border-emerald-800/60 hover:bg-emerald-900/50'
                            }`}
                          >
                            {v.heroSlideEnabled === false ? 'Disabled' : 'Enabled'}
                          </button>

                          {/* Preview Slide Button */}
                          <button
                            onClick={() => setPreviewSlideVehicle(v)}
                            title="Preview Hero Slide"
                            className="px-2.5 py-1.5 text-[11px] font-semibold text-neutral-300 hover:text-white bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 rounded-lg transition flex items-center gap-1 cursor-pointer"
                          >
                            <Play className="w-3 h-3 text-blue-400" />
                            <span>Preview</span>
                          </button>

                          {/* Edit Vehicle */}
                          <button
                            onClick={() => setEditingVehicle(v)}
                            title="Edit Vehicle Details"
                            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Remove from Slider */}
                          <button
                            onClick={() => handleRemoveFromSlider(v)}
                            title="Remove from Homepage Slider"
                            className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded-lg transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
            </div>
          )}
        </div>
      )}

      {/* ----------------------------------------------------
          TAB: BRAND & MODEL HIERARCHY CATALOG
          ---------------------------------------------------- */}
      {activeTab === 'brands' && (
        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Brand & Model Hierarchy Catalog</h2>
              <p className="text-xs text-neutral-400">
                Manage the Brand → Model → Year hierarchy powering vehicle discovery, filters, and digital showroom inventory.
              </p>
            </div>

            {/* Quick Add Brand Form */}
            <form onSubmit={handleAddBrand} className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full lg:w-auto">
              <input
                type="text"
                required
                placeholder="Brand Name (e.g. Genesis)"
                value={newBrandName}
                onChange={(e) => setNewBrandName(e.target.value)}
                className="bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500 min-w-[160px]"
              />
              <select
                value={newBrandCountry}
                onChange={(e) => setNewBrandCountry(e.target.value)}
                className="bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Japan">Japan</option>
                <option value="Germany">Germany</option>
                <option value="United States">United States</option>
                <option value="South Korea">South Korea</option>
                <option value="China">China</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="France">France</option>
                <option value="Italy">Italy</option>
                <option value="Sweden">Sweden</option>
                <option value="India">India</option>
                <option value="Global">Other / Global</option>
              </select>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-xs whitespace-nowrap cursor-pointer uppercase tracking-wider shadow-sm flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Brand</span>
              </button>
            </form>
          </div>

          {/* Search Brand Filter */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search brands or countries (e.g. Toyota, China, Ford)..."
                value={adminBrandSearch}
                onChange={(e) => setAdminBrandSearch(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
              />
              {adminBrandSearch && (
                <button
                  type="button"
                  onClick={() => setAdminBrandSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white text-xs"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="text-xs text-neutral-400">
              Showing{' '}
              <span className="text-white font-bold">
                {hierarchy.filter((b) =>
                  adminBrandSearch
                    ? b.name.toLowerCase().includes(adminBrandSearch.toLowerCase()) ||
                      (b.country || '').toLowerCase().includes(adminBrandSearch.toLowerCase())
                    : true
                ).length}
              </span>{' '}
              of {hierarchy.length} manufacturers
            </div>
          </div>

          {/* Brands Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {hierarchy
              .filter((b) =>
                adminBrandSearch
                  ? b.name.toLowerCase().includes(adminBrandSearch.toLowerCase()) ||
                    (b.country || '').toLowerCase().includes(adminBrandSearch.toLowerCase())
                  : true
              )
              .map((brand) => (
                <div
                  key={brand.id}
                  className={`bg-neutral-900 border rounded-2xl p-6 space-y-4 shadow-xl flex flex-col justify-between transition-all ${
                    brand.enabled === false ? 'border-neutral-800/50 opacity-75' : 'border-neutral-800'
                  }`}
                >
                  <div>
                    {/* Brand Card Header */}
                    <div className="flex items-center justify-between border-b border-neutral-800 pb-3 gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-white">{brand.name}</h3>
                          <span className="text-[10px] bg-neutral-950 px-2 py-0.5 rounded text-neutral-400 border border-neutral-800">
                            {brand.country || 'Global'}
                          </span>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                              brand.enabled !== false
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-900'
                                : 'bg-red-950 text-red-400 border border-red-900'
                            }`}
                          >
                            {brand.enabled !== false ? 'Active' : 'Disabled'}
                          </span>
                        </div>
                        <span className="text-xs text-blue-400 font-medium mt-0.5 block">
                          {brand.vehicleCount} vehicle{brand.vehicleCount === 1 ? '' : 's'} in active stock
                        </span>
                      </div>

                      {/* Brand Quick Actions */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {/* Enable / Disable Brand Toggle */}
                        <button
                          type="button"
                          onClick={() => handleToggleBrand(brand.id)}
                          title={brand.enabled !== false ? 'Disable brand' : 'Enable brand'}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            brand.enabled !== false
                              ? 'text-emerald-400 hover:bg-neutral-800 hover:text-emerald-300'
                              : 'text-neutral-500 hover:bg-neutral-800 hover:text-emerald-400'
                          }`}
                        >
                          {brand.enabled !== false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>

                        {/* Edit Brand */}
                        <button
                          type="button"
                          onClick={() => setEditingBrand({ id: brand.id, name: brand.name, country: brand.country })}
                          title="Edit brand name & country"
                          className="p-1.5 text-neutral-400 hover:text-blue-400 hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        {/* Delete Brand */}
                        <button
                          type="button"
                          onClick={() => handleDeleteBrand(brand.id, brand.name)}
                          title="Delete brand"
                          className="p-1.5 text-neutral-400 hover:text-red-400 hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Inline Edit Brand Form if selected */}
                    {editingBrand && editingBrand.id === brand.id && (
                      <form onSubmit={handleEditBrand} className="mt-3 p-3 bg-neutral-950 rounded-xl border border-blue-500/50 space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-blue-400">
                          <span>Edit Brand Details</span>
                          <button
                            type="button"
                            onClick={() => setEditingBrand(null)}
                            className="text-neutral-400 hover:text-white"
                          >
                            Cancel
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            required
                            value={editingBrand.name}
                            onChange={(e) => setEditingBrand({ ...editingBrand, name: e.target.value })}
                            className="bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                            placeholder="Brand Name"
                          />
                          <select
                            value={editingBrand.country || 'Global'}
                            onChange={(e) => setEditingBrand({ ...editingBrand, country: e.target.value })}
                            className="bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                          >
                            <option value="Japan">Japan</option>
                            <option value="Germany">Germany</option>
                            <option value="United States">United States</option>
                            <option value="South Korea">South Korea</option>
                            <option value="China">China</option>
                            <option value="United Kingdom">United Kingdom</option>
                            <option value="France">France</option>
                            <option value="Italy">Italy</option>
                            <option value="Sweden">Sweden</option>
                            <option value="India">India</option>
                            <option value="Global">Global</option>
                          </select>
                        </div>
                        <button
                          type="submit"
                          className="w-full py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-xs"
                        >
                          Save Changes
                        </button>
                      </form>
                    )}

                    {/* Models list under this Brand */}
                    <div className="pt-3 space-y-2">
                      <span className="text-xs font-semibold text-neutral-400 block uppercase tracking-wider text-[11px]">
                        Models & Supported Years ({brand.models.length})
                      </span>

                      {brand.models.length === 0 ? (
                        <p className="text-xs text-neutral-500 italic py-2">No models added under {brand.name} yet.</p>
                      ) : (
                        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                          {brand.models.map((model) => (
                            <div
                              key={model.id}
                              className="p-2.5 bg-neutral-950 rounded-xl border border-neutral-800/80 flex flex-col gap-1.5 text-xs"
                            >
                              <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-white">{model.name}</span>
                                  {model.category && (
                                    <span className="text-[10px] text-blue-400 bg-blue-950/60 border border-blue-900/60 px-1.5 py-0.2 rounded">
                                      {model.category}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() =>
                                      setEditingModel({
                                        brandId: brand.id,
                                        modelId: model.id,
                                        name: model.name,
                                        years: model.years.join(', '),
                                        category: model.category,
                                      })
                                    }
                                    title="Edit Model"
                                    className="text-neutral-500 hover:text-blue-400 p-1 cursor-pointer transition-colors"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteModel(brand.id, model.id)}
                                    title="Delete Model"
                                    className="text-neutral-500 hover:text-red-400 p-1 cursor-pointer transition-colors"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              {/* Years & Quick Year Adder */}
                              <div className="flex flex-wrap items-center gap-1 text-[11px] text-neutral-400 font-mono">
                                <span>Years:</span>
                                {model.years && model.years.length > 0 ? (
                                  model.years.slice(0, 6).map((yr) => (
                                    <span key={yr} className="bg-neutral-900 px-1.5 py-0.5 rounded text-[10px] text-neutral-300">
                                      {yr}
                                    </span>
                                  ))
                                ) : (
                                  <span>Any</span>
                                )}

                                {/* Add supported year button */}
                                {quickAddYearModel?.modelId === model.id ? (
                                  <div className="flex items-center gap-1 ml-1">
                                    <input
                                      type="number"
                                      placeholder="YYYY"
                                      value={quickYearInput}
                                      onChange={(e) => setQuickYearInput(e.target.value)}
                                      className="w-16 bg-neutral-900 border border-blue-500 rounded px-1.5 py-0.5 text-[10px] text-white"
                                    />
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleAddSupportedYear(
                                          brand.id,
                                          model.id,
                                          model.years || [],
                                          parseInt(quickYearInput, 10)
                                        )
                                      }
                                      className="px-1.5 py-0.5 bg-blue-600 text-white font-semibold rounded text-[10px]"
                                    >
                                      Add
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setQuickAddYearModel(null)}
                                      className="text-neutral-400 text-[10px]"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setQuickAddYearModel({ brandId: brand.id, modelId: model.id });
                                      setQuickYearInput(String(new Date().getFullYear()));
                                    }}
                                    className="text-[10px] text-blue-400 hover:underline cursor-pointer ml-1"
                                  >
                                    + Add Year
                                  </button>
                                )}
                              </div>
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
                          placeholder="Model name (e.g. Camry, RAV4, X5)"
                          value={newModelName}
                          onChange={(e) => setNewModelName(e.target.value)}
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <select
                            value={newModelCategory}
                            onChange={(e) => setNewModelCategory(e.target.value)}
                            className="bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                          >
                            <option value="SUV">SUV</option>
                            <option value="Sedan">Sedan</option>
                            <option value="Crossover">Crossover</option>
                            <option value="Truck">Truck / Pickup</option>
                            <option value="Coupe">Coupe</option>
                            <option value="Hatchback">Hatchback</option>
                            <option value="Van">Van / MPV</option>
                          </select>
                          <input
                            type="text"
                            placeholder="Years (e.g. 2024, 2025)"
                            value={newModelYears}
                            onChange={(e) => setNewModelYears(e.target.value)}
                            className="bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-xs cursor-pointer"
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
                        <Plus className="w-3.5 h-3.5 text-blue-400" />
                        <span>Add Model to {brand.name}</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>

          {/* Edit Model Modal */}
          {editingModel && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                  <h3 className="text-sm font-bold text-white">Edit Automobile Model</h3>
                  <button
                    onClick={() => setEditingModel(null)}
                    className="text-neutral-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <form onSubmit={handleUpdateModel} className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">Model Name</label>
                    <input
                      type="text"
                      required
                      value={editingModel.name}
                      onChange={(e) => setEditingModel({ ...editingModel, name: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">Body Type / Category</label>
                    <select
                      value={editingModel.category || 'SUV'}
                      onChange={(e) => setEditingModel({ ...editingModel, category: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white"
                    >
                      <option value="SUV">SUV</option>
                      <option value="Sedan">Sedan</option>
                      <option value="Crossover">Crossover</option>
                      <option value="Truck">Truck / Pickup</option>
                      <option value="Coupe">Coupe</option>
                      <option value="Hatchback">Hatchback</option>
                      <option value="Van">Van / MPV</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">Supported Years (comma-separated)</label>
                    <input
                      type="text"
                      value={editingModel.years}
                      onChange={(e) => setEditingModel({ ...editingModel, years: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                      placeholder="2026, 2025, 2024, 2023, 2022"
                    />
                  </div>
                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingModel(null)}
                      className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-xs"
                    >
                      Update Model
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
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
                          {l.source === 'quick_quote' && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950/80 text-blue-300 border border-blue-800/80">
                              ⚡ Quick Quote (Price Lead)
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-neutral-500">
                          Received: {new Date(l.createdAt).toLocaleString()} · Source: {l.source === 'quick_quote' ? 'Quick Quote Calculator' : l.source}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={l.status}
                          onChange={(e) => handleUpdateLeadStatus(l.id, e.target.value)}
                          className="bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-blue-500"
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
                        <p className="text-blue-400 font-semibold">Vehicle: {l.vehicleTitle}</p>
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
                        className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
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
                          className="bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-blue-500"
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
                        <span className="text-blue-400 font-mono font-medium">{req.budget || 'Flexible'}</span>
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
                      <span className="text-blue-400 font-mono">{r.budget || 'Flexible'}</span>
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
          TAB 5.5: REVIEWS & CUSTOMER PROOF
          ---------------------------------------------------- */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">Verified Customer Reviews & Proof</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-600/20 text-blue-400 border border-blue-500/30">
                  {reviews.length} Total Reviews
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-1">
                Authentic testimonials from genuine car buyers. Manage verified status, publication visibility, or log customer feedback.
              </p>
            </div>

            <button
              onClick={() => setShowAddReviewModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-xs transition cursor-pointer shadow-md shadow-blue-600/10"
            >
              <Plus className="w-4 h-4" />
              <span>Add Verified Review</span>
            </button>
          </div>

          <div className="space-y-4">
            {reviews.length === 0 ? (
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-12 text-center space-y-3">
                <Star className="w-8 h-8 text-neutral-600 mx-auto" />
                <p className="text-xs text-neutral-400">No customer reviews recorded yet.</p>
                <button
                  onClick={() => setShowAddReviewModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-xl text-xs"
                >
                  Add First Review
                </button>
              </div>
            ) : (
              reviews.map((rev) => (
                <div key={rev.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-3 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">{rev.customerName}</h4>
                        {rev.verified && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> Verified Buyer
                          </span>
                        )}
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          rev.published ? 'bg-blue-950/80 text-blue-300 border border-blue-800/80' : 'bg-neutral-950 text-neutral-400 border border-neutral-800'
                        }`}>
                          {rev.published ? 'Published' : 'Hidden'}
                        </span>
                      </div>
                      <div className="text-xs text-neutral-400 mt-0.5">
                        Purchased: <strong className="text-neutral-200">{rev.vehiclePurchased || 'Showroom Vehicle'}</strong> · Date: {rev.date}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Star rating */}
                      <div className="flex items-center gap-0.5 bg-neutral-950 px-2 py-1 rounded-lg border border-neutral-800 text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < rev.rating ? 'fill-current' : 'text-neutral-700'}`} />
                        ))}
                      </div>

                      <button
                        onClick={() => handleToggleReview(rev.id, 'published')}
                        className="px-2.5 py-1 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 rounded-lg text-xs text-neutral-300 transition cursor-pointer"
                      >
                        {rev.published ? 'Hide' : 'Publish'}
                      </button>

                      <button
                        onClick={() => handleDeleteReview(rev.id)}
                        className="p-1.5 text-neutral-400 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition cursor-pointer"
                        title="Delete review"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-300 italic bg-neutral-950 p-3.5 rounded-xl border border-neutral-800/80">
                    "{rev.comment}"
                  </p>
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
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">Tagline / Subtitle</label>
                <input
                  type="text"
                  value={settingsForm.tagline || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Primary WhatsApp Sales Number <span className="text-blue-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="+2348012345678"
                  value={settingsForm.whatsappNumber || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
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
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
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
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">Dealership Email</label>
                <input
                  type="email"
                  value={settingsForm.email || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
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
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">Business Hours</label>
                <input
                  type="text"
                  placeholder="e.g. Mon - Sat: 8:30 AM - 6:00 PM"
                  value={settingsForm.businessHours || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, businessHours: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
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
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">Currency Code</label>
                <input
                  type="text"
                  placeholder="NGN, USD, EUR"
                  value={settingsForm.currency || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, currency: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 uppercase font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">Dealership Description</label>
              <textarea
                rows={3}
                value={settingsForm.businessDescription || ''}
                onChange={(e) => setSettingsForm({ ...settingsForm, businessDescription: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            {/* CEO Leadership Fields */}
            <div className="pt-4 border-t border-neutral-800 space-y-4">
              <h3 className="text-xs uppercase tracking-wider text-blue-400 font-bold">
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
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">Leadership Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Founder & CEO"
                    value={settingsForm.ceoTitle || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, ceoTitle: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">CEO Direct Contact Line</label>
                  <input
                    type="text"
                    placeholder="e.g. 08037781788"
                    value={settingsForm.ceoPhone || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, ceoPhone: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  CEO Official Portrait Photo
                </label>
                
                <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-5">
                  <div className="relative w-28 h-36 rounded-lg overflow-hidden border border-neutral-700 bg-neutral-900 shrink-0 shadow-lg">
                    {settingsForm.ceoImage ? (
                      <img
                        src={settingsForm.ceoImage}
                        alt="CEO Portrait"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-neutral-500 text-xs text-center p-2">
                        <ImageIcon className="w-6 h-6 mb-1 text-neutral-600" />
                        No photo set
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-3 w-full">
                    <div>
                      <p className="text-xs text-neutral-300 font-medium">Upload or Change CEO Portrait</p>
                      <p className="text-[11px] text-neutral-500">
                        Upload your authentic photo from your phone or computer, or enter a direct image path.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <label className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-lg cursor-pointer transition shadow-md">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{uploadingCeoImage ? 'Uploading...' : 'Choose Photo from Device'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleCeoImageUpload}
                          disabled={uploadingCeoImage}
                          className="hidden"
                        />
                      </label>

                      {settingsForm.ceoImage && (
                        <button
                          type="button"
                          onClick={() => setSettingsForm({ ...settingsForm, ceoImage: '/WhatsApp Image 2026-09-29 at 8.55.15 AM.jpeg' })}
                          className="text-[11px] text-neutral-400 hover:text-white px-2.5 py-1.5 border border-neutral-800 rounded-lg hover:border-neutral-700 transition cursor-pointer"
                        >
                          Reset to Uploaded CEO Photo
                        </button>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] text-neutral-400 mb-1">Image URL / Path</label>
                      <input
                        type="text"
                        placeholder="/WhatsApp Image 2026-09-29 at 8.55.15 AM.jpeg"
                        value={settingsForm.ceoImage || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, ceoImage: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-300 focus:outline-none focus:border-blue-500 font-mono"
                      />
                    </div>
                  </div>
                </div>
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
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-blue-500 resize-none"
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
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="inspectionOffered"
                checked={settingsForm.inspectionOffered !== false}
                onChange={(e) => setSettingsForm({ ...settingsForm, inspectionOffered: e.target.checked })}
                className="w-4 h-4 rounded text-blue-500 bg-neutral-950 border-neutral-800"
              />
              <label htmlFor="inspectionOffered" className="text-xs text-neutral-300 cursor-pointer">
                Enable "Schedule Inspection" booking CTA across showroom vehicle pages
              </label>
            </div>

            <div className="pt-4 border-t border-neutral-800">
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Save Settings
              </button>
            </div>
          </form>

          {/* Master Administrator Password Card */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                <KeyRound className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Administrator Security & Password</h3>
                <p className="text-xs text-neutral-400">
                  Update the master password for user 'admin'. Must be at least 8 characters.
                </p>
              </div>
            </div>

            {passwordSuccess && (
              <div className="p-3 bg-emerald-950/60 border border-emerald-800/80 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>{passwordSuccess}</span>
              </div>
            )}

            {passwordError && (
              <div className="p-3 bg-red-950/40 border border-red-800/80 rounded-xl text-xs text-red-300">
                {passwordError}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">Current Password</label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">New Password (8+ chars)</label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={changingPassword || !currentPassword || !newPassword}
                className="px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                {changingPassword ? 'Updating Password...' : 'Change Administrator Password'}
              </button>
            </form>
          </div>
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

      {/* Add Vehicle to Homepage Slider Modal */}
      {showAddSliderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Add Vehicle to Homepage Slider</h3>
                <p className="text-xs text-neutral-400">Select any car from showroom inventory to feature on the homepage.</p>
              </div>
              <button
                onClick={() => setShowAddSliderModal(false)}
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 border-b border-neutral-800 bg-neutral-950/60">
              <div className="relative">
                <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by make, model, year..."
                  value={sliderSearchTerm}
                  onChange={(e) => setSliderSearchTerm(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2 divide-y divide-neutral-800/60">
              {vehicles
                .filter((v) => !v.featured)
                .filter(
                  (v) =>
                    !sliderSearchTerm ||
                    v.title.toLowerCase().includes(sliderSearchTerm.toLowerCase()) ||
                    v.make.toLowerCase().includes(sliderSearchTerm.toLowerCase()) ||
                    v.model.toLowerCase().includes(sliderSearchTerm.toLowerCase())
                ).length === 0 ? (
                <div className="py-8 text-center text-xs text-neutral-500">
                  {sliderSearchTerm
                    ? 'No matching vehicles found.'
                    : 'All vehicles in inventory are already featured on the slider!'}
                </div>
              ) : (
                vehicles
                  .filter((v) => !v.featured)
                  .filter(
                    (v) =>
                      !sliderSearchTerm ||
                      v.title.toLowerCase().includes(sliderSearchTerm.toLowerCase()) ||
                      v.make.toLowerCase().includes(sliderSearchTerm.toLowerCase()) ||
                      v.model.toLowerCase().includes(sliderSearchTerm.toLowerCase())
                  )
                  .map((v) => (
                    <div key={v.id} className="pt-2 first:pt-0 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={v.images[0] || '/images/hero_car_showroom_1790168724059.jpg'}
                          alt={v.title}
                          referrerPolicy="no-referrer"
                          className="w-14 h-10 object-cover rounded-lg border border-neutral-800 shrink-0"
                        />
                        <div>
                          <div className="text-xs font-bold text-white">{v.title}</div>
                          <div className="text-[11px] text-neutral-400">
                            {formatPrice(v.price, v.currency, settings?.currencySymbol || '₦')} · {v.status}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleAddToSlider(v.id)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-xs transition cursor-pointer shrink-0"
                      >
                        Feature on Slider
                      </button>
                    </div>
                  ))
              )}
            </div>

            <div className="p-4 border-t border-neutral-800 bg-neutral-950 flex justify-end">
              <button
                onClick={() => setShowAddSliderModal(false)}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-medium cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Hero Slide Preview Modal */}
      {previewSlideVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4 text-blue-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Live Hero Slide Customer Preview
                </h3>
              </div>
              <button
                onClick={() => setPreviewSlideVehicle(null)}
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Simulated Hero Viewport */}
            <div className="relative h-[440px] sm:h-[480px] w-full bg-neutral-950 overflow-hidden select-none">
              <img
                src={previewSlideVehicle.images[0] || '/images/hero_car_showroom_1790168724059.jpg'}
                alt={previewSlideVehicle.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/90 via-neutral-950/40 to-transparent" />

              <div className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-end">
                <div className="max-w-xl space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold uppercase tracking-wider">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      AVAILABLE
                    </span>
                    <span className="text-xs text-blue-400 font-medium">
                      Featured Showroom Selection
                    </span>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-blue-400 tracking-wide uppercase">
                      {previewSlideVehicle.make}
                    </p>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      {previewSlideVehicle.year} {previewSlideVehicle.model}
                    </h2>
                  </div>

                  <div className="text-2xl font-extrabold text-white font-mono">
                    {formatPrice(
                      previewSlideVehicle.price,
                      previewSlideVehicle.currency,
                      settings?.currencySymbol || '₦'
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-neutral-300">
                    <span>
                      {previewSlideVehicle.mileage.toLocaleString()} {previewSlideVehicle.mileageUnit}
                    </span>
                    <span>·</span>
                    <span>{previewSlideVehicle.transmission}</span>
                    <span>·</span>
                    <span>{previewSlideVehicle.fuel}</span>
                  </div>

                  <p className="text-xs text-neutral-300 line-clamp-2">
                    {previewSlideVehicle.description}
                  </p>

                  <div className="flex items-center gap-3 pt-2">
                    <div className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow">
                      <span>View Vehicle</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                    <div className="px-5 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat on WhatsApp</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between text-xs">
              <span className="text-neutral-400">
                Slider Position: #{((previewSlideVehicle.featuredOrder ?? 0) + 1)} · Status:{' '}
                {previewSlideVehicle.status}
              </span>
              <button
                onClick={() => setPreviewSlideVehicle(null)}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-medium cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Showroom Display Slide Modal */}
      {showAddSlideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden space-y-4">
            <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Add Showroom Display Slide</h3>
                <p className="text-xs text-neutral-400">
                  Upload an authentic dealership showroom floor or facility photo for the homepage background.
                </p>
              </div>
              <button
                onClick={() => setShowAddSlideModal(false)}
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddShowroomSlide} className="p-5 pt-0 space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">Slide Photo</label>
                <div className="flex items-center gap-3 mb-2">
                  <label className="inline-flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl cursor-pointer transition">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingSlide ? 'Uploading...' : 'Choose Photo from Device'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleSlideImageFileUpload}
                      disabled={uploadingSlide}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[11px] text-neutral-500">or paste URL below</span>
                </div>

                <input
                  type="text"
                  required
                  placeholder="e.g. /images/showroom_floor.jpg or https://..."
                  value={newSlideUrl}
                  onChange={(e) => setNewSlideUrl(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              {newSlideUrl && (
                <div className="relative aspect-[16/9] rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950">
                  <img src={newSlideUrl} alt="Preview" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">Slide Caption (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Paul Smith Autos certified showroom floor & customer lounge"
                  value={newSlideCaption}
                  onChange={(e) => setNewSlideCaption(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddSlideModal(false)}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newSlideUrl || uploadingSlide}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold rounded-xl text-xs transition cursor-pointer"
                >
                  Save Showroom Slide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Verified Customer Review Modal */}
      {showAddReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden space-y-4">
            <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Add Verified Customer Review</h3>
                <p className="text-xs text-neutral-400">
                  Log an authentic review from a verified Paul Smith Autos buyer.
                </p>
              </div>
              <button
                onClick={() => setShowAddReviewModal(false)}
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddReview} className="p-5 pt-0 space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">Customer Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chief Adebayo Ogunlesi"
                  value={reviewForm.customerName || ''}
                  onChange={(e) => setReviewForm({ ...reviewForm, customerName: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">Vehicle Purchased</label>
                  <input
                    type="text"
                    placeholder="e.g. 2024 Mercedes-Benz GLE 450"
                    value={reviewForm.vehiclePurchased || ''}
                    onChange={(e) => setReviewForm({ ...reviewForm, vehiclePurchased: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">Star Rating (1 - 5)</label>
                  <select
                    value={reviewForm.rating || 5}
                    onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value={5}>★★★★★ (5 Stars - Exceptional)</option>
                    <option value={4}>★★★★☆ (4 Stars - Very Good)</option>
                    <option value={3}>★★★☆☆ (3 Stars - Good)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">Customer Testimonial Comment *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Write the customer's authentic review and inspection feedback..."
                  value={reviewForm.comment || ''}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="flex items-center gap-6 pt-1 text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-neutral-300">
                  <input
                    type="checkbox"
                    checked={reviewForm.verified !== false}
                    onChange={(e) => setReviewForm({ ...reviewForm, verified: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-500 bg-neutral-950 border-neutral-800"
                  />
                  <span>Mark as Verified Buyer</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-neutral-300">
                  <input
                    type="checkbox"
                    checked={reviewForm.published !== false}
                    onChange={(e) => setReviewForm({ ...reviewForm, published: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-500 bg-neutral-950 border-neutral-800"
                  />
                  <span>Publish Immediately</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddReviewModal(false)}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingReview}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold rounded-xl text-xs transition cursor-pointer"
                >
                  {savingReview ? 'Saving...' : 'Save Verified Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
