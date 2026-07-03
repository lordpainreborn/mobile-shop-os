"use client";
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-10 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <main className="lg:ml-64 flex-1 flex flex-col min-h-screen">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <div className="p-4 sm:p-6 lg:p-8 flex-1">{children}</div>
      </main>
    </>
  );
}
