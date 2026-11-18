import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { ThemeProvider } from './hooks/useTheme';
import { useToast } from './hooks/useToast';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollManager from './components/layout/ScrollManager';
import ToastContainer from './components/ui/Toast';
import BackToTop from './components/ui/BackToTop';
import ScrollProgress from './components/ui/ScrollProgress';

// Eagerly loaded
import HomePage from './pages/Home';

// Core pages
const ToolsPage      = lazy(() => import('./pages/Tools'));
const CategoriesPage = lazy(() => import('./pages/Categories'));
const CategoryPage   = lazy(() => import('./pages/Category'));
const AboutPage      = lazy(() => import('./pages/About'));
const ContactPage    = lazy(() => import('./pages/Contact'));
const FavoritesPage  = lazy(() => import('./pages/Favorites'));
const NotFoundPage   = lazy(() => import('./pages/NotFound'));

// Legal pages
const PrivacyPage    = lazy(() => import('./pages/Privacy'));
const TermsPage      = lazy(() => import('./pages/Terms'));
const DisclaimerPage = lazy(() => import('./pages/Disclaimer'));

// Live tool pages — Phase 1
const IPLookupPage    = lazy(() => import('./pages/tools/IPLookup'));
const DNSLookupPage   = lazy(() => import('./pages/tools/DNSLookup'));
const WHOISLookupPage = lazy(() => import('./pages/tools/WHOISLookup'));
const SSLCheckerPage  = lazy(() => import('./pages/tools/SSLChecker'));
const HTTPHeadersPage = lazy(() => import('./pages/tools/HTTPHeaders'));

// Live tool pages — Phase 2B
const WebTechPage         = lazy(() => import('./pages/tools/WebTech'));
const GeoIPPage           = lazy(() => import('./pages/tools/GeoIP'));
const ReverseDNSPage      = lazy(() => import('./pages/tools/ReverseDNS'));
const DNSPropagationPage  = lazy(() => import('./pages/tools/DNSPropagation'));
const RedirectCheckerPage = lazy(() => import('./pages/tools/RedirectChecker'));

function PageLoader() {
  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20"
      role="status"
      aria-busy="true"
    >
      <span className="sr-only">Loading page…</span>
      <div className="skeleton h-4 w-40 mb-8" />
      <div className="skeleton h-10 w-2/3 max-w-md mb-4" />
      <div className="skeleton h-4 w-full max-w-xl mb-10" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[0, 1, 2].map(i => (
          <div key={i} className="skeleton h-36" />
        ))}
      </div>
    </div>
  );
}

function PageRoutes() {
  const { pathname } = useLocation();
  return (
    // Opacity-only fade (150 ms, see globals.css). No exit animation, no translation.
    <div key={pathname} className="page-fade" style={{ minHeight: '60vh' }}>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Core */}
          <Route path="/"               element={<HomePage />} />
          <Route path="/tools"          element={<ToolsPage />} />
          <Route path="/categories"     element={<CategoriesPage />} />
          <Route path="/categories/:id" element={<CategoryPage />} />
          <Route path="/about"          element={<AboutPage />} />
          <Route path="/contact"        element={<ContactPage />} />
          <Route path="/favorites"      element={<FavoritesPage />} />

          {/* Legal */}
          <Route path="/privacy"    element={<PrivacyPage />} />
          <Route path="/terms"      element={<TermsPage />} />
          <Route path="/disclaimer" element={<DisclaimerPage />} />

          {/* Live tools */}
          <Route path="/tools/ip-lookup"        element={<IPLookupPage />} />
          <Route path="/tools/dns-lookup"       element={<DNSLookupPage />} />
          <Route path="/tools/whois-lookup"     element={<WHOISLookupPage />} />
          <Route path="/tools/ssl-checker"      element={<SSLCheckerPage />} />
          <Route path="/tools/http-headers"     element={<HTTPHeadersPage />} />
          <Route path="/tools/website-tech"     element={<WebTechPage />} />
          <Route path="/tools/geoip-lookup"     element={<GeoIPPage />} />
          <Route path="/tools/reverse-dns"      element={<ReverseDNSPage />} />
          <Route path="/tools/dns-propagation"  element={<DNSPropagationPage />} />
          <Route path="/tools/redirect-checker" element={<RedirectCheckerPage />} />

          {/* Retired pages (the host also 301s these via public/_redirects) */}
          <Route path="/roadmap"   element={<Navigate to="/" replace />} />
          <Route path="/changelog" element={<Navigate to="/" replace />} />

          {/* Everything else, including removed tool URLs */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </div>
  );
}

function AppContent() {
  const { toasts, removeToast } = useToast();
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-primary)' }}>
      <ScrollManager />
      <ScrollProgress />
      <Navbar />
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        <PageRoutes />
      </main>
      <Footer />
      <BackToTop />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MotionConfig reducedMotion="user">
        <AppContent />
      </MotionConfig>
    </ThemeProvider>
  );
}