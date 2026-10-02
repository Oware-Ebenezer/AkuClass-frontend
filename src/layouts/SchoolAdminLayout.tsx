import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';

export default function SchoolAdminLayout() {
  const [navOpen, setNavOpen] = useState(false);
  return (
    <div className="min-h-screen bg-warm-100">
      <Sidebar open={navOpen} onClose={() => setNavOpen(false)} />
      <div className="lg:pl-64">
        <Header onMenu={() => setNavOpen(true)} />
        <main className="pt-16">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
