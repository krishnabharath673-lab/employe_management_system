import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Building2, Users, UserPlus, RotateCcw, 
  Menu, X, Database, GraduationCap, LayoutDashboard
} from 'lucide-react';
import { ConfirmationModal } from './ConfirmationModal.tsx';
import { api } from '../services/api.ts';
import { useToast } from '../context/ToastContext.tsx';

interface NavbarProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const location = useLocation();
  const { success, error } = useToast();
  const [showResetModal, setShowResetModal] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleResetData = async () => {
    setIsResetting(true);
    try {
      const res = await api.resetSampleData();
      success(res.message || 'Sample database data restored successfully!');
      setShowResetModal(false);
      // Reload current route or fire custom event to re-fetch
      window.dispatchEvent(new CustomEvent('ems-data-refreshed'));
    } catch (err: any) {
      error(err.message || 'Failed to reset sample data.');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Zone 1: Brand & Mobile Toggle */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onToggleSidebar}
                className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Toggle navigation menu"
              >
                {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <Link to="/" className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs group-hover:bg-blue-700 transition-colors">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 text-base sm:text-lg tracking-tight block leading-tight">
                    Employee Management System
                  </span>
                  <span className="text-[11px] text-slate-500 block leading-tight">
                    HR CRUD Operations · B.Tech Project
                  </span>
                </div>
              </Link>
            </div>

            {/* Zone 2: Navigation Links (Desktop) */}
            <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
              <Link
                to="/"
                className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                  location.pathname === '/'
                    ? 'text-blue-700 bg-blue-50 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>

              <Link
                to="/employees"
                className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                  location.pathname === '/employees'
                    ? 'text-blue-700 bg-blue-50 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Employees</span>
              </Link>

              <Link
                to="/departments"
                className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                  location.pathname === '/departments'
                    ? 'text-blue-700 bg-blue-50 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Departments</span>
              </Link>

              <Link
                to="/about"
                className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                  location.pathname === '/about'
                    ? 'text-blue-700 bg-blue-50 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>About Project</span>
              </Link>
            </nav>

            {/* Zone 3: Primary Actions */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setShowResetModal(true)}
                title="Reset Database to default sample records"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 rounded-lg transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Demo Data</span>
              </button>

              <Link
                to="/employees/add"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
              >
                <UserPlus className="w-4 h-4" />
                <span>Add Employee</span>
              </Link>
            </div>

          </div>
        </div>
      </header>

      {/* Confirmation Modal for Resetting Demo Data */}
      <ConfirmationModal
        isOpen={showResetModal}
        title="Reset Sample Database?"
        message="This will re-initialize the relational store with the original 6 departments and 12 sample employee records. Any newly created or modified records will be replaced with initial seed data."
        confirmText="Reset to Defaults"
        isDestructive={false}
        isLoading={isResetting}
        onConfirm={handleResetData}
        onCancel={() => setShowResetModal(false)}
      />
    </>
  );
};
