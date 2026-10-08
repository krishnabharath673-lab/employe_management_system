import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Users, UserPlus, Building2, 
  GraduationCap, Database, Server, CheckCircle2, X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/employees', label: 'Employees', icon: Users },
    { to: '/employees/add', label: 'Add Employee', icon: UserPlus },
    { to: '/departments', label: 'Departments', icon: Building2 },
    { to: '/about', label: 'About Project', icon: GraduationCap },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-white transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col justify-between`}
      >
        <div>
          {/* Top Brand & Close on mobile */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-xs">
                EM
              </div>
              <div>
                <div className="font-bold text-sm text-slate-100 tracking-tight leading-none">
                  EMS Portal
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 leading-none font-mono">
                  B.Tech Project v1.0
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Section */}
          <div className="p-4 space-y-1">
            <div className="px-3 py-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
              Main Menu
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={() => {
                    // close mobile menu upon navigation
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Bottom System & Viva Card */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="bg-slate-800/60 rounded-lg p-3 border border-slate-700/60 text-xs text-slate-300">
            <div className="flex items-center justify-between font-semibold text-slate-200 mb-1">
              <span className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-blue-400" />
                <span>MySQL Relational</span>
              </span>
              <span className="flex items-center gap-1 text-[10px] text-emerald-400">
                <CheckCircle2 className="w-3 h-3" />
                <span>Active</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
              REST APIs with parameterized queries, foreign key cascade, & indexes.
            </p>
          </div>

          <div className="text-[11px] text-slate-500 text-center font-mono">
            Final Year Project · CS / IT
          </div>
        </div>
      </aside>
    </>
  );
};
