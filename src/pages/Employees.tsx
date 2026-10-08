import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, Filter, Plus, Eye, Edit, Trash2, 
  ChevronLeft, ChevronRight, ArrowUpDown, Building2, 
  X, RefreshCw, AlertCircle, FileSpreadsheet
} from 'lucide-react';
import { api, Employee, Department } from '../services/api.ts';
import { EmployeeDetailModal } from '../components/EmployeeDetailModal.tsx';
import { ConfirmationModal } from '../components/ConfirmationModal.tsx';
import { useToast } from '../context/ToastContext.tsx';

export const Employees: React.FC = () => {
  const navigate = useNavigate();
  const { success, error } = useToast();

  // State
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Filters & Pagination
  const [search, setSearch] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('employee_id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const pageSize = 8;

  // Modals state
  const [detailEmployee, setDetailEmployee] = useState<Employee | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);

  // Fetch departments for filter dropdown
  const loadDepartments = async () => {
    try {
      const res = await api.getDepartments();
      if (res.success) {
        setDepartments(res.data);
      }
    } catch (err: any) {
      console.error('Failed to load departments:', err);
    }
  };

  // Fetch employees
  const loadEmployees = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.getEmployees({
        search,
        departmentId: selectedDepartment === 'All' ? undefined : selectedDepartment,
        status: selectedStatus === 'All' ? undefined : selectedStatus,
        sortBy,
        sortOrder,
        page: currentPage,
        limit: pageSize,
      });

      if (res.success) {
        setEmployees(res.employees);
        setTotalPages(res.totalPages);
        setTotalCount(res.total);
      }
    } catch (err: any) {
      error(err.message || 'Error fetching employees from backend.');
    } finally {
      setIsLoading(false);
    }
  }, [search, selectedDepartment, selectedStatus, sortBy, sortOrder, currentPage, error]);

  useEffect(() => {
    loadDepartments();
  }, []);

  useEffect(() => {
    loadEmployees();

    const handleRefresh = () => loadEmployees();
    window.addEventListener('ems-data-refreshed', handleRefresh);
    return () => window.removeEventListener('ems-data-refreshed', handleRefresh);
  }, [loadEmployees]);

  // Handle Search Input Change with reset page
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearch('');
    setSelectedDepartment('All');
    setSelectedStatus('All');
    setSortBy('employee_id');
    setSortOrder('asc');
    setCurrentPage(1);
  };

  // Handle Delete
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await api.deleteEmployee(deleteTarget.employee_id);
      success(res.message || `Employee ${deleteTarget.first_name} ${deleteTarget.last_name} deleted.`);
      setDeleteTarget(null);
      loadEmployees();
    } catch (err: any) {
      error(err.message || 'Failed to delete employee.');
    } finally {
      setIsDeleting(false);
    }
  };

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

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Employee Directory
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage employee master data, filter by department, update profiles, and delete records.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => loadEmployees()}
            disabled={isLoading}
            className="p-2 text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors shadow-2xs"
            title="Refresh Table"
            aria-label="Refresh Table"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-blue-600' : ''}`} />
          </button>

          <Link
            to="/employees/add"
            className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Employee</span>
          </Link>
        </div>
      </div>

      {/* Filter Toolbar (Combined Search + Department Filter + Status Filter) */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* 1. Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search by name, ID, email, role..."
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
            />
            {search && (
              <button
                onClick={() => { setSearch(''); setCurrentPage(1); }}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* 2. Department Filter Dropdown (KEY REQUIREMENT) */}
          <div>
            <select
              value={selectedDepartment}
              onChange={(e) => {
                setSelectedDepartment(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 font-medium"
            >
              <option value="All">All Departments</option>
              {departments.map((dept) => (
                <option key={dept.department_id} value={dept.department_id}>
                  {dept.department_name} ({dept.employee_count ?? 0})
                </option>
              ))}
            </select>
          </div>

          {/* 3. Status Filter Dropdown */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 font-medium"
            >
              <option value="All">All Status (Active & Inactive)</option>
              <option value="Active">Active Only</option>
              <option value="Inactive">Inactive Only</option>
            </select>
          </div>

          {/* 4. Sort By Field */}
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 font-medium"
            >
              <option value="employee_id">Sort by: ID</option>
              <option value="name">Sort by: Name</option>
              <option value="salary">Sort by: Salary</option>
              <option value="hire_date">Sort by: Hire Date</option>
            </select>

            <button
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-600 transition-colors"
              title={`Sort direction: ${sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}
              aria-label="Toggle sort direction"
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Filter Summary & Active Pills */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>Showing <strong className="text-slate-800">{employees.length}</strong> of <strong className="text-slate-800">{totalCount}</strong> matching records</span>
            {(search || selectedDepartment !== 'All' || selectedStatus !== 'All') && (
              <span className="text-blue-600 font-medium">· Filter Active</span>
            )}
          </div>

          {(search || selectedDepartment !== 'All' || selectedStatus !== 'All') && (
            <button
              onClick={handleResetFilters}
              className="text-xs text-rose-600 hover:text-rose-800 font-medium underline cursor-pointer"
            >
              Clear All Filters
            </button>
          )}
        </div>
      </div>

      {/* Employees Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th scope="col" className="px-5 py-3.5">Code / ID</th>
                <th scope="col" className="px-5 py-3.5">Employee Name</th>
                <th scope="col" className="px-5 py-3.5">Contact Details</th>
                <th scope="col" className="px-5 py-3.5">Job Title</th>
                <th scope="col" className="px-5 py-3.5">Department</th>
                <th scope="col" className="px-5 py-3.5">Hire Date</th>
                <th scope="col" className="px-5 py-3.5">Salary</th>
                <th scope="col" className="px-5 py-3.5">Status</th>
                <th scope="col" className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
                      <span>Querying employee records from database...</span>
                    </div>
                  </td>
                </tr>
              ) : employees.length > 0 ? (
                employees.map((emp) => (
                  <tr key={emp.employee_id} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* ID / Code */}
                    <td className="px-5 py-3.5 font-mono text-xs text-slate-800">
                      <div className="font-bold">{emp.employee_code}</div>
                      <div className="text-[11px] text-slate-400">#{emp.employee_id}</div>
                    </td>

                    {/* Employee Name */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-semibold text-xs flex items-center justify-center shrink-0">
                          {emp.first_name[0]}{emp.last_name[0]}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-slate-900 leading-tight">
                            {emp.first_name} {emp.last_name}
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5">
                            {emp.gender} · {emp.city}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-5 py-3.5 text-xs">
                      <div className="text-slate-900 font-medium truncate max-w-[170px]" title={emp.email}>
                        {emp.email}
                      </div>
                      <div className="text-slate-500 font-mono mt-0.5">
                        {emp.phone}
                      </div>
                    </td>

                    {/* Job Title */}
                    <td className="px-5 py-3.5 text-slate-800 font-medium">
                      {emp.job_title}
                    </td>

                    {/* Department */}
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                        {emp.department_name}
                      </span>
                    </td>

                    {/* Hire Date */}
                    <td className="px-5 py-3.5 text-xs text-slate-500 tabular-nums">
                      {formatDate(emp.hire_date)}
                    </td>

                    {/* Salary */}
                    <td className="px-5 py-3.5 text-xs font-semibold text-slate-900 tabular-nums">
                      {formatCurrency(emp.salary)}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3.5">
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

                    {/* Actions */}
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        
                        {/* View Action */}
                        <button
                          type="button"
                          onClick={() => setDetailEmployee(emp)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          title="View Employee Details"
                          aria-label="View Employee Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Edit Action */}
                        <button
                          type="button"
                          onClick={() => navigate(`/employees/${emp.employee_id}/edit`)}
                          className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                          title="Edit Employee"
                          aria-label="Edit Employee"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        {/* Delete Action */}
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(emp)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                          title="Delete Employee"
                          aria-label="Delete Employee"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-slate-400">
                    <div className="max-w-sm mx-auto space-y-2">
                      <AlertCircle className="w-8 h-8 text-slate-300 mx-auto" />
                      <p className="text-slate-700 font-semibold text-base">No employees found</p>
                      <p className="text-xs text-slate-500">
                        No employee records matched your active search query or department filters.
                      </p>
                      <button
                        onClick={handleResetFilters}
                        className="mt-3 px-3.5 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors inline-block"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Toolbar */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div>
            Showing <span className="font-semibold text-slate-900">{totalCount > 0 ? (currentPage - 1) * pageSize + 1 : 0}</span> to{' '}
            <span className="font-semibold text-slate-900">{Math.min(currentPage * pageSize, totalCount)}</span> of{' '}
            <span className="font-semibold text-slate-900">{totalCount}</span> records
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage <= 1 || isLoading}
              className="px-2.5 py-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white text-slate-700 transition-colors flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            <span className="px-3 py-1 font-semibold text-slate-800">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages || isLoading}
              className="px-2.5 py-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white text-slate-700 transition-colors flex items-center gap-1"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* View Detail Modal */}
      <EmployeeDetailModal
        isOpen={!!detailEmployee}
        employee={detailEmployee}
        onClose={() => setDetailEmployee(null)}
      />

      {/* Delete Confirmation Modal (KEY REQUIREMENT) */}
      <ConfirmationModal
        isOpen={!!deleteTarget}
        title="Delete Employee Record?"
        message={
          deleteTarget
            ? `Are you sure you want to delete ${deleteTarget.first_name} ${deleteTarget.last_name} (${deleteTarget.employee_code})? This will permanently delete the employee record from the MySQL database.`
            : 'Are you sure you want to delete this employee?'
        }
        confirmText="Yes, Delete Record"
        cancelText="Cancel"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />

    </div>
  );
};
