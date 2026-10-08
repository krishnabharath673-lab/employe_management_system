import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, Mail, Phone, MapPin, Calendar, Briefcase, 
  Building2, DollarSign, Edit, User, ShieldCheck, Clock
} from 'lucide-react';
import { Employee } from '../services/api.ts';

interface EmployeeDetailModalProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({
  employee,
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();
  if (!isOpen || !employee) return null;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between bg-slate-50/60">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-xs">
              {employee.first_name[0]}{employee.last_name[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">
                  {employee.first_name} {employee.last_name}
                </h2>
                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                    employee.status === 'Active'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  {employee.status}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 font-mono">
                <span>Code: {employee.employee_code}</span>
                <span>·</span>
                <span>ID: #{employee.employee_id}</span>
                <span>·</span>
                <span className="text-blue-700 font-sans font-medium">{employee.job_title}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-2 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Section: Professional & Department */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Employment Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-lg border border-slate-200 bg-white">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Building2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Department</span>
                </div>
                <div className="mt-1 font-semibold text-slate-900 text-sm">
                  {employee.department_name || 'N/A'}
                </div>
              </div>

              <div className="p-3.5 rounded-lg border border-slate-200 bg-white">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                  <span>Role / Title</span>
                </div>
                <div className="mt-1 font-semibold text-slate-900 text-sm truncate">
                  {employee.job_title}
                </div>
              </div>

              <div className="p-3.5 rounded-lg border border-slate-200 bg-white">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Monthly Salary</span>
                </div>
                <div className="mt-1 font-bold text-slate-900 text-sm tabular-nums">
                  {formatCurrency(employee.salary)}
                </div>
              </div>
            </div>
          </div>

          {/* Section: Contact Information */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Contact & Location
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-lg border border-slate-200 bg-white flex items-start gap-3">
                <Mail className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs text-slate-500">Official Email</div>
                  <div className="text-sm font-medium text-slate-900 truncate">
                    {employee.email}
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-lg border border-slate-200 bg-white flex items-start gap-3">
                <Phone className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs text-slate-500">Phone Number</div>
                  <div className="text-sm font-medium text-slate-900 tabular-nums">
                    {employee.phone}
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-lg border border-slate-200 bg-white flex items-start gap-3 md:col-span-2">
                <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs text-slate-500">Residential Address</div>
                  <div className="text-sm font-medium text-slate-900">
                    {employee.address}, <span className="font-semibold text-blue-700">{employee.city}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Personal & Timeline */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Demographics & History
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-lg border border-slate-200 bg-white">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Gender</span>
                </div>
                <div className="mt-1 font-medium text-slate-900 text-sm">
                  {employee.gender}
                </div>
              </div>

              <div className="p-3.5 rounded-lg border border-slate-200 bg-white">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Date of Birth</span>
                </div>
                <div className="mt-1 font-medium text-slate-900 text-sm tabular-nums">
                  {formatDate(employee.date_of_birth)}
                </div>
              </div>

              <div className="p-3.5 rounded-lg border border-slate-200 bg-white">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Date of Joining</span>
                </div>
                <div className="mt-1 font-medium text-slate-900 text-sm tabular-nums">
                  {formatDate(employee.hire_date)}
                </div>
              </div>
            </div>
          </div>

          {/* Metadata Footer */}
          <div className="pt-2 text-xs text-slate-400 flex items-center justify-between border-t border-slate-100">
            <span>Record Created: {formatDate(employee.created_at || '')}</span>
            <span>Last Updated: {formatDate(employee.updated_at || '')}</span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="bg-slate-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              navigate(`/employees/${employee.employee_id}/edit`);
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2 shadow-xs"
          >
            <Edit className="w-4 h-4" />
            Edit Employee
          </button>
        </div>

      </div>
    </div>
  );
};
