import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, UserCheck, UserX, Building2, 
  ArrowRight, Eye, Plus, ShieldCheck, Briefcase, Calendar, 
  TrendingUp, RefreshCw
} from 'lucide-react';
import { api, DashboardStats, Employee } from '../services/api.ts';
import { EmployeeDetailModal } from '../components/EmployeeDetailModal.tsx';
import { useToast } from '../context/ToastContext.tsx';

export const Dashboard: React.FC = () => {
  const { error } = useToast();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const res = await api.getDashboardStats();
      if (res.success) {
        setStats(res.data);
      }
    } catch (err: any) {
      error(err.message || 'Failed to load dashboard metrics.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    const handleRefresh = () => fetchStats();
    window.addEventListener('ems-data-refreshed', handleRefresh);
    return () => window.removeEventListener('ems-data-refreshed', handleRefresh);
  }, []);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            HR Dashboard Overview
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Real-time organizational statistics, workforce metrics, and department breakdown.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchStats}
            disabled={isLoading}
            className="p-2 text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors shadow-2xs"
            title="Refresh statistics"
            aria-label="Refresh statistics"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-blue-600' : ''}`} />
          </button>

          <Link
            to="/employees/add"
            className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Employee</span>
          </Link>
        </div>
      </div>

      {/* Top 4 KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Employees */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Employees
            </span>
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold text-slate-900 tabular-nums">
              {isLoading ? '...' : stats?.totalEmployees ?? 0}
            </span>
            <span className="text-xs text-slate-500 ml-2">registered staff</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Primary workforce</span>
            <Link to="/employees" className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Card 2: Active Employees */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Active Employees
            </span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold text-emerald-700 tabular-nums">
              {isLoading ? '...' : stats?.activeEmployees ?? 0}
            </span>
            <span className="text-xs text-slate-500 ml-2">on duty</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              {stats?.totalEmployees
                ? `${Math.round(((stats.activeEmployees || 0) / stats.totalEmployees) * 100)}% of total`
                : '0%'}
            </span>
            <span className="text-emerald-600 font-medium">In Service</span>
          </div>
        </div>

        {/* Card 3: Inactive Employees */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Inactive Employees
            </span>
            <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <UserX className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold text-slate-700 tabular-nums">
              {isLoading ? '...' : stats?.inactiveEmployees ?? 0}
            </span>
            <span className="text-xs text-slate-500 ml-2">on leave / exit</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              {stats?.totalEmployees
                ? `${Math.round(((stats.inactiveEmployees || 0) / stats.totalEmployees) * 100)}% of total`
                : '0%'}
            </span>
            <span className="text-rose-600 font-medium">Suspended / Left</span>
          </div>
        </div>

        {/* Card 4: Total Departments */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Departments
            </span>
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold text-slate-900 tabular-nums">
              {isLoading ? '...' : stats?.totalDepartments ?? 0}
            </span>
            <span className="text-xs text-slate-500 ml-2">operational units</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Relational Entities</span>
            <Link to="/departments" className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              Manage <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

      </div>

      {/* Middle Grid: Distribution Charts & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left (2 cols): Employees by Department Bar Breakdown */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Employees by Department
              </h2>
              <p className="text-xs text-slate-500">
                Distribution of workforce headcount across company divisions
              </p>
            </div>
            <Link
              to="/departments"
              className="text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              View Details
            </Link>
          </div>

          <div className="space-y-4 pt-2">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-8 bg-slate-100 rounded-md animate-pulse" />
                ))}
              </div>
            ) : stats?.departmentDistribution && stats.departmentDistribution.length > 0 ? (
              stats.departmentDistribution.map((dept) => {
                const maxCount = Math.max(...stats.departmentDistribution.map(d => d.employee_count), 1);
                const barWidth = Math.max((dept.employee_count / maxCount) * 100, 4);

                return (
                  <div key={dept.department_id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-700">
                        {dept.department_name}
                      </span>
                      <div className="flex items-center gap-2 text-slate-500 tabular-nums">
                        <span className="font-semibold text-slate-900">{dept.employee_count}</span>
                        <span>({dept.percentage}%)</span>
                      </div>
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all duration-500"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-slate-500 py-4 text-center">
                No department distribution data available.
              </p>
            )}
          </div>
        </div>

        {/* Right (1 col): Employment Ratio & Status Overview */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Workforce Status Ratio
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Active vs Inactive personnel health ratio
            </p>

            {/* Ratio visualization */}
            {stats && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      Active: {stats.activeEmployees}
                    </span>
                    <span className="text-rose-700 font-semibold flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                      Inactive: {stats.inactiveEmployees}
                    </span>
                  </div>

                  {/* Dual Segment Progress Bar */}
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-500"
                      style={{
                        width: stats.totalEmployees > 0 
                          ? `${(stats.activeEmployees / stats.totalEmployees) * 100}%` 
                          : '0%'
                      }}
                      title={`Active: ${stats.activeEmployees}`}
                    />
                    <div
                      className="h-full bg-rose-500 transition-all duration-500"
                      style={{
                        width: stats.totalEmployees > 0 
                          ? `${(stats.inactiveEmployees / stats.totalEmployees) * 100}%` 
                          : '0%'
                      }}
                      title={`Inactive: ${stats.inactiveEmployees}`}
                    />
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-600">
                  <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span>Project Examination Fact:</span>
                  </div>
                  <p className="leading-relaxed">
                    This system implements relational data integrity via MySQL foreign keys.
                    When deleting departments, the database automatically verifies that no employees are linked.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4">
            <Link
              to="/about"
              className="text-xs font-medium text-slate-600 hover:text-blue-600 flex items-center justify-between"
            >
              <span>Learn about project architecture</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>

      {/* Bottom Section: Recently Added Employees Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Recently Added Employees
            </h2>
            <p className="text-xs text-slate-500">
              Latest additions to the employee records database
            </p>
          </div>
          <Link
            to="/employees"
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <span>View All Records</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs text-slate-500 font-semibold border-b border-slate-100 uppercase tracking-wider">
              <tr>
                <th scope="col" className="px-6 py-3">Code / ID</th>
                <th scope="col" className="px-6 py-3">Employee Name</th>
                <th scope="col" className="px-6 py-3">Job Title</th>
                <th scope="col" className="px-6 py-3">Department</th>
                <th scope="col" className="px-6 py-3">Hire Date</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-400">
                    Loading recent employee records...
                  </td>
                </tr>
              ) : stats?.recentEmployees && stats.recentEmployees.length > 0 ? (
                stats.recentEmployees.map((emp) => (
                  <tr key={emp.employee_id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-3.5 font-mono text-xs font-medium text-slate-900">
                      {emp.employee_code}
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-semibold text-xs flex items-center justify-center shrink-0">
                          {emp.first_name[0]}{emp.last_name[0]}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">
                            {emp.first_name} {emp.last_name}
                          </div>
                          <div className="text-xs text-slate-500">{emp.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-slate-700">
                      {emp.job_title}
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="font-medium text-slate-800">
                        {emp.department_name}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-xs text-slate-500 tabular-nums">
                      {formatDate(emp.hire_date)}
                    </td>
                    <td className="px-6 py-3.5">
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          emp.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {emp.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <button
                        onClick={() => setSelectedEmployee(emp)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-400">
                    No recent employee records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Employee Detail Modal */}
      <EmployeeDetailModal
        isOpen={!!selectedEmployee}
        employee={selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
      />

    </div>
  );
};
