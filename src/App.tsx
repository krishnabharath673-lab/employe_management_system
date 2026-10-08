import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Sidebar } from './components/Sidebar.tsx';
import { Dashboard } from './pages/Dashboard.tsx';
import { Employees } from './pages/Employees.tsx';
import { AddEmployee } from './pages/AddEmployee.tsx';
import { EditEmployee } from './pages/EditEmployee.tsx';
import { Departments } from './pages/Departments.tsx';
import { AboutProject } from './pages/AboutProject.tsx';

function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans">
      
      {/* Top Navbar */}
      <Navbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      />

      <div className="flex flex-1">
        
        {/* Responsive Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content Viewport */}
        <main className="flex-1 lg:pl-64 flex flex-col transition-all duration-200">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto flex-1">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/employees" element={<Employees />} />
              <Route path="/employees/add" element={<AddEmployee />} />
              <Route path="/employees/:id/edit" element={<EditEmployee />} />
              <Route path="/departments" element={<Departments />} />
              <Route path="/about" element={<AboutProject />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>

          {/* Clean Academic Footer */}
          <footer className="bg-white border-t border-slate-200 py-4 px-6 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 mt-auto">
            <div>
              <strong>Employee Management System</strong> · Final Year B.Tech Project (CS / IT)
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <span>Node.js / Express</span>
              <span>·</span>
              <span>MySQL RDBMS</span>
              <span>·</span>
              <span>React SPA</span>
            </div>
          </footer>
        </main>

      </div>

    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </ToastProvider>
  );
}
