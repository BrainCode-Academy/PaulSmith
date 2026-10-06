import React, { useState, useEffect } from 'react';
import { DealerProvider, useDealer } from './context/DealerContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { DealershipChatbot } from './components/DealershipChatbot';
import { HomePage } from './pages/HomePage';
import { CarsPage } from './pages/CarsPage';
import { VehicleDetailPage } from './pages/VehicleDetailPage';
import { ImportCarPage } from './pages/ImportCarPage';
import { FindMyCarPage } from './pages/FindMyCarPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { BrandsPage } from './pages/BrandsPage';
import { PrivacyPage, TermsPage } from './pages/LegalPages';
import { AdminDashboard } from './pages/admin/AdminDashboard';

function AppRouter() {
  const { settings } = useDealer();
  const [currentPath, setCurrentPath] = useState(window.location.pathname || '/');
  const [routeParams, setRouteParams] = useState<Record<string, string>>({});

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string, params?: Record<string, string>) => {
    if (params) {
      setRouteParams(params);
    } else {
      setRouteParams({});
    }

    if (path !== currentPath) {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Synchronize document title and description based on path
  useEffect(() => {
    const businessName = settings?.businessName || 'Paul Smith Autos';
    if (currentPath === '/') {
      document.title = `${businessName} | Verified Car Dealership & Direct Import Sourcing`;
    } else if (currentPath === '/cars' || currentPath === '/vehicles') {
      document.title = `Showroom Inventory | ${businessName}`;
    } else if (currentPath === '/brands') {
      document.title = `All Car Brands & Global Catalog | ${businessName}`;
    } else if (currentPath === '/import-a-car') {
      document.title = `Custom Vehicle Import Sourcing | ${businessName}`;
    } else if (currentPath === '/find-my-car') {
      document.title = `Find My Car Service | ${businessName}`;
    } else if (currentPath === '/how-it-works') {
      document.title = `How It Works | ${businessName}`;
    } else if (currentPath === '/about') {
      document.title = `About Us | ${businessName}`;
    } else if (currentPath === '/contact') {
      document.title = `Contact & Inquiries | ${businessName}`;
    } else if (currentPath === '/admin' || currentPath.startsWith('/admin/')) {
      document.title = `Dealership Admin Console | ${businessName}`;
    }
  }, [currentPath, settings?.businessName]);

  // Route matching
  const renderCurrentPage = () => {
    if (currentPath === '/') {
      return <HomePage onNavigate={navigate} />;
    }

    if (currentPath === '/cars' || currentPath === '/vehicles') {
      return <CarsPage initialFilters={routeParams} onNavigate={navigate} />;
    }

    if (currentPath === '/brands') {
      return <BrandsPage onNavigate={navigate} settings={settings} />;
    }

    if (currentPath.startsWith('/cars/')) {
      const slug = currentPath.replace('/cars/', '');
      return <VehicleDetailPage slug={slug} onNavigate={navigate} />;
    }

    if (currentPath.startsWith('/vehicles/')) {
      const slug = currentPath.replace('/vehicles/', '');
      return <VehicleDetailPage slug={slug} onNavigate={navigate} />;
    }

    if (currentPath === '/import-a-car') {
      return <ImportCarPage />;
    }

    if (currentPath === '/find-my-car') {
      return <FindMyCarPage />;
    }

    if (currentPath === '/how-it-works') {
      return <HowItWorksPage onNavigate={navigate} />;
    }

    if (currentPath === '/about') {
      return <AboutPage onNavigate={navigate} />;
    }

    if (currentPath === '/contact') {
      return <ContactPage />;
    }

    if (currentPath === '/privacy') {
      return <PrivacyPage />;
    }

    if (currentPath === '/terms') {
      return <TermsPage />;
    }

    if (currentPath === '/admin' || currentPath.startsWith('/admin/')) {
      return <AdminDashboard onNavigate={navigate} />;
    }

    // Fallback 404
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-3xl font-bold text-white">404 - Page Not Found</h2>
        <p className="text-xs text-slate-400">
          The requested page could not be located in our dealership portal.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-xs transition-colors cursor-pointer"
        >
          Return to Home
        </button>
      </div>
    );
  };

  const isAdminRoute = currentPath === '/admin' || currentPath.startsWith('/admin/');

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f19] text-slate-100 selection:bg-blue-600 selection:text-white">
      <Header currentPath={currentPath} onNavigate={navigate} />

      <main className="flex-1">
        {renderCurrentPage()}
      </main>

      {!isAdminRoute && <Footer onNavigate={navigate} />}
      {!isAdminRoute && <FloatingWhatsApp />}
      {!isAdminRoute && <DealershipChatbot />}
    </div>
  );
}

export default function App() {
  return (
    <DealerProvider>
      <AppRouter />
    </DealerProvider>
  );
}
