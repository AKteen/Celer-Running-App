import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 overflow-auto pb-16">
        <Outlet />
      </main>
      <nav className="fixed bottom-0 left-0 right-0 flex border-t border-[#1a1a1a] bg-[#0a0a0a] z-50">
        <NavLink to="/record" className={({ isActive }) =>
          `flex-1 flex flex-col items-center py-3 gap-1 ${isActive ? 'text-brand' : 'text-[#444]'}`}>
          <RecordIcon active={false} />
          <span className="text-[10px] tracking-widest uppercase font-semibold">Record</span>
        </NavLink>
        <NavLink to="/activities" className={({ isActive }) =>
          `flex-1 flex flex-col items-center py-3 gap-1 ${isActive ? 'text-brand' : 'text-[#444]'}`}>
          <ListIcon />
          <span className="text-[10px] tracking-widest uppercase font-semibold">Activities</span>
        </NavLink>
      </nav>
    </div>
  );
}

function RecordIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}
