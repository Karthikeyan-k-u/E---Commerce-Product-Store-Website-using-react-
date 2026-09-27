import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { MobileNav } from './MobileNav';
import { CartDrawer } from '../cart/CartDrawer';
import { SearchOverlay } from '../search/SearchOverlay';
import { ToastContainer } from '../ui/Toast';

export const Layout: React.FC = () => {
  const location = useLocation();

  // Scroll to top automatically when location changes
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen flex flex-col bg-background text-text-primary overflow-x-hidden selection:bg-[#4F46E5]/20 selection:text-[#4F46E5]">
      {/* Subtle Atmospheric Gradient Orbs */}
      <div className="fixed top-0 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#4F46E5]/5 dark:bg-[#4F46E5]/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-1/4 right-1/4 w-[28rem] h-[28rem] bg-[#7C3AED]/5 dark:bg-[#7C3AED]/10 rounded-full blur-[160px] pointer-events-none -z-10" />

      {/* Top Navigation */}
      <Header />

      {/* Main Routed Page Content */}
      <main className="flex-1 pb-16 md:pb-0">
        <Outlet />
      </main>

      {/* Global Drawers, Overlays & Modals */}
      <CartDrawer />
      <SearchOverlay />
      <ToastContainer />

      {/* Footer & Mobile Bottom Navigation */}
      <Footer />
      <MobileNav />
    </div>
  );
};
