import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ThemeProvider } from './hooks/useTheme';
import { useToast } from './hooks/useToast';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ToastContainer from './components/ui/Toast';
import BackToTop from './components/ui/BackToTop';
import ScrollProgress from './components/ui/ScrollProgress';

// Eagerly loaded (above the fold)
import HomePage from './pages/Home';

// Lazily loaded pages
const ToolsPage      = lazy(() => import('./pages/Tools'));
const CategoriesPage = lazy(() => import('./pages/Categories'));
const CategoryPage   = lazy(() => import('./pages/Category'));
const AboutPage      = lazy(() => import('./pages/About'));
const ContactPage    = lazy(() => import('./pages/Contact'));
const RoadmapPage    = lazy(() => import('./pages/Roadmap'));
const FavoritesPage  = lazy(() => import('./pages/Favorites'));
const ChangelogPage  = lazy(() => import('./pages/Changelog'));
const NotFoundPage   = lazy(() => import('./pages/NotFound'));
const ComingSoonPage = lazy(() => import('./pages/ComingSoon'));

// Tool pages
const IPLookupPage    = lazy(() => import('./pages/tools/IPLookup'));
const DNSLookupPage   = lazy(() => import('./pages/tools/DNSLookup'));
const WHOISLookupPage = lazy(() => import('./pages/tools/WHOISLookup'));
const SSLCheckerPage  = lazy(() => import('./pages/tools/SSLChecker'));
const HTTPHeadersPage = lazy(() => import('./pages/tools/HTTPHeaders'));
// Phase 2B tool pages
const WebTechPage          = lazy(() => import('./pages/tools/WebTech'));
const GeoIPPage            = lazy(() => import('./pages/tools/GeoIP'));
const ReverseDNSPage       = lazy(() => import('./pages/tools/ReverseDNS'));
const DNSPropagationPage   = lazy(() => import('./pages/tools/DNSPropagation'));
const RedirectCheckerPage  = lazy(() => import('./pages/tools/RedirectChecker'));

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-5">
        <div className="relative">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #3B82F6, #06B6D4)' }}>
            <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="8" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none"/>
              <line x1="16" y1="8" x2="16" y2="24" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
              <path d="M8 16 Q16 19.5 24 16" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none"/>
              <circle cx="16" cy="16" r="2" fill="white"/>
            </svg>
          </div>
          <div className="absolute inset-0 rounded-2xl animate-ping opacity-20" style={{ background: 'linear-gradient(135deg, #3B82F6, #06B6D4)' }} />
        </div>
        <div className="flex gap-1.5">
          {[0, 1, 2].map(i => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-400"
              style={{ animation: `bounce 1s ${i * 0.15}s infinite` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        style={{ minHeight: '60vh' }}
      >
        <Suspense fallback={<PageLoader />}>
          <Routes location={location}>
            <Route path="/" element={<HomePage />} />
            <Route path="/tools" element={<ToolsPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/categories/:id" element={<CategoryPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/roadmap" element={<RoadmapPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/changelog" element={<ChangelogPage />} />

            {/* Live tools — Phase 1 */}
            <Route path="/tools/ip-lookup"    element={<IPLookupPage />} />
            <Route path="/tools/dns-lookup"   element={<DNSLookupPage />} />
            <Route path="/tools/whois-lookup" element={<WHOISLookupPage />} />
            <Route path="/tools/ssl-checker"  element={<SSLCheckerPage />} />
            <Route path="/tools/http-headers" element={<HTTPHeadersPage />} />

            {/* Live tools — Phase 2B */}
            <Route path="/tools/website-tech"     element={<WebTechPage />} />
            <Route path="/tools/geoip-lookup"     element={<GeoIPPage />} />
            <Route path="/tools/reverse-dns"      element={<ReverseDNSPage />} />
            <Route path="/tools/dns-propagation"  element={<DNSPropagationPage />} />
            <Route path="/tools/redirect-checker" element={<RedirectCheckerPage />} />

            {/* Coming soon tools */}
            <Route path="/tools/password-generator" element={<ComingSoonPage />} />
            <Route path="/tools/hash-generator"     element={<ComingSoonPage />} />
            <Route path="/tools/qr-generator"       element={<ComingSoonPage />} />
            <Route path="/tools/uuid-generator"     element={<ComingSoonPage />} />
            <Route path="/tools/base64"             element={<ComingSoonPage />} />
            <Route path="/tools/url-encoder"        element={<ComingSoonPage />} />
            <Route path="/tools/json-formatter"     element={<ComingSoonPage />} />
            <Route path="/tools/timestamp"          element={<ComingSoonPage />} />
            <Route path="/tools/robots-viewer"      element={<ComingSoonPage />} />
            <Route path="/tools/sitemap-viewer"     element={<ComingSoonPage />} />
            <Route path="/tools/http-status"        element={<ComingSoonPage />} />
            <Route path="/tools/port-scanner"       element={<ComingSoonPage />} />
            <Route path="/tools/ping"               element={<ComingSoonPage />} />

            <Route path="/privacy" element={<Navigate to="/about" replace />} />
            <Route path="/terms"   element={<Navigate to="/about" replace />} />
            <Route path="*"        element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}

function AppContent() {
  const { toasts, removeToast } = useToast();
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-primary)' }}>
      <ScrollProgress />
      <Navbar />
      <main className="flex-1">
        <AnimatedRoutes />
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
      <AppContent />
    </ThemeProvider>
  );
}
