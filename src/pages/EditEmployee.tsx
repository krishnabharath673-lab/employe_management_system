import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, Building2, Save, 
  AlertCircle, CheckCircle2, User, Mail, Phone, Calendar, 
  Briefcase, DollarSign, MapPin, RefreshCw
} from 'lucide-react';
import { api, Department, EmployeeInput } from '../services/api.ts';
import { useToast } from '../context/ToastContext.tsx';

export const EditEmployee: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { success, error } = useToast();

  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<EmployeeInput>({
    employee_code: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    gender: 'Male',
    date_of_birth: '',
    hire_date: '',
    job_title: '',
    salary: 0,
    department_id: 1,
    address: '',
    city: '',
    status: 'Active'
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // 1. Fetch departments
        const deptRes = await api.getDepartments();
        if (deptRes.success) {
          setDepartments(deptRes.data);
        }

        // 2. Fetch employee
        const empId = parseInt(id || '', 10);
        if (isNaN(empId)) {
          error('Invalid employee ID.');
          navigate('/employees');
          return;
        }

        const empRes = await api.getEmployeeById(empId);
        if (empRes.success && empRes.data) {
          const emp = empRes.data;
          setFormData({
            employee_code: emp.employee_code,
            first_name: emp.first_name,
            last_name: emp.last_name,
            email: emp.email,
            phone: emp.phone,
            gender: emp.gender,
            date_of_birth: emp.date_of_birth ? emp.date_of_birth.substring(0, 10) : '',
            hire_date: emp.hire_date ? emp.hire_date.substring(0, 10) : '',
            job_title: emp.job_title,
            salary: emp.salary,
            department_id: emp.department_id,
            address: emp.address,
            city: emp.city,
            status: emp.status
          });
        }
      } catch (err: any) {
        error(err.message || 'Failed to load employee details.');
        navigate('/employees');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, navigate, error]);

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.employee_code.trim()) {
      errors.employee_code = 'Employee Code is required.';
    }

    if (!formData.first_name.trim()) {
      errors.first_name = 'First Name is required.';
    }

    if (!formData.last_name.trim()) {
      errors.last_name = 'Last Name is required.';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Contact phone number is required.';
    }

    if (!formData.date_of_birth) {
      errors.date_of_birth = 'Date of birth is required.';
    }

    if (!formData.hire_date) {
      errors.hire_date = 'Hire date is required.';
    }

    if (!formData.job_title.trim()) {
      errors.job_title = 'Job title/designation is required.';
    }

    if (formData.salary === undefined || formData.salary === null || isNaN(Number(formData.salary))) {
      errors.salary = 'Please enter a valid numeric salary.';
    } else if (Number(formData.salary) < 0) {
      errors.salary = 'Salary cannot be negative.';
    }

    if (!formData.department_id) {
      errors.department_id = 'Please select a department.';
    }

    if (!formData.address.trim()) {
      errors.address = 'Street address is required.';
    }

    if (!formData.city.trim()) {
      errors.city = 'City name is required.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'salary' || name === 'department_id' ? (value === '' ? '' : Number(value)) : value
    }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      error('Please fix validation errors before saving.');
      return;
    }

    const empId = parseInt(id || '', 10);
    setIsSubmitting(true);
    try {
      const res = await api.updateEmployee(empId, {
        ...formData,
        salary: Number(formData.salary),
        department_id: Number(formData.department_id)
      });

      if (res.success) {
        success(res.message || 'Employee record updated successfully in database!');
        navigate('/employees');
      }
    } catch (err: any) {
      error(err.message || 'Failed to update employee.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center space-y-3">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
        <p className="text-sm text-slate-500">Loading employee details from database...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/employees"
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            title="Back to Employees"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Edit Employee Details
            </h1>
            <p className="text-sm text-slate-500">
              Updating record for <strong className="text-slate-800">{formData.first_name} {formData.last_name}</strong> ({formData.employee_code})
            </p>
          </div>
        </div>
      </div>

      {/* Main Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        
        {/* Form Body */}
        <div className="p-6 sm:p-8 space-y-8">

          {/* Section 1: Official Identifiers */}
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-4">
              <User className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                1. Official Identification
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Employee Code */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Employee Code <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="employee_code"
                  value={formData.employee_code}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 text-sm rounded-lg border font-mono ${
                    formErrors.employee_code ? 'border-rose-300 bg-rose-50/50' : 'border-slate-200'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {formErrors.employee_code && (
                  <p className="mt-1 text-xs text-rose-600">{formErrors.employee_code}</p>
                )}
              </div>

              {/* First Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  First Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 text-sm rounded-lg border ${
                    formErrors.first_name ? 'border-rose-300 bg-rose-50/50' : 'border-slate-200'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {formErrors.first_name && (
                  <p className="mt-1 text-xs text-rose-600">{formErrors.first_name}</p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Last Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 text-sm rounded-lg border ${
                    formErrors.last_name ? 'border-rose-300 bg-rose-50/50' : 'border-slate-200'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {formErrors.last_name && (
                  <p className="mt-1 text-xs text-rose-600">{formErrors.last_name}</p>
                )}
              </div>

            </div>
          </div>

          {/* Section 2: Contact Information */}
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-4">
              <Mail className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                2. Contact & Demographics
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Work Email <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 text-sm rounded-lg border ${
                    formErrors.email ? 'border-rose-300 bg-rose-50/50' : 'border-slate-200'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {formErrors.email && (
                  <p className="mt-1 text-xs text-rose-600">{formErrors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 text-sm rounded-lg border font-mono ${
                    formErrors.phone ? 'border-rose-300 bg-rose-50/50' : 'border-slate-200'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {formErrors.phone && (
                  <p className="mt-1 text-xs text-rose-600">{formErrors.phone}</p>
                )}
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Gender <span className="text-rose-500">*</span>
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Date of Birth <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 text-sm rounded-lg border ${
                    formErrors.date_of_birth ? 'border-rose-300 bg-rose-50/50' : 'border-slate-200'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {formErrors.date_of_birth && (
                  <p className="mt-1 text-xs text-rose-600">{formErrors.date_of_birth}</p>
                )}
              </div>

              {/* Residential Address */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Residential Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 text-sm rounded-lg border ${
                    formErrors.address ? 'border-rose-300 bg-rose-50/50' : 'border-slate-200'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {formErrors.address && (
                  <p className="mt-1 text-xs text-rose-600">{formErrors.address}</p>
                )}
              </div>

              {/* City */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  City <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 text-sm rounded-lg border ${
                    formErrors.city ? 'border-rose-300 bg-rose-50/50' : 'border-slate-200'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {formErrors.city && (
                  <p className="mt-1 text-xs text-rose-600">{formErrors.city}</p>
                )}
              </div>

            </div>
          </div>

          {/* Section 3: Job Role & Compensation */}
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-4">
              <Briefcase className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                3. Employment & Department Assignment
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Job Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Job Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="job_title"
                  value={formData.job_title}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 text-sm rounded-lg border ${
                    formErrors.job_title ? 'border-rose-300 bg-rose-50/50' : 'border-slate-200'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {formErrors.job_title && (
                  <p className="mt-1 text-xs text-rose-600">{formErrors.job_title}</p>
                )}
              </div>

              {/* Department (Foreign Key dropdown) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Department (Foreign Key) <span className="text-rose-500">*</span>
                </label>
                <select
                  name="department_id"
                  value={formData.department_id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium"
                >
                  {departments.map((d) => (
                    <option key={d.department_id} value={d.department_id}>
                      {d.department_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Monthly Salary */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Monthly Salary (₹ / $) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  min="0"
                  step="500"
                  className={`w-full px-3 py-2 text-sm rounded-lg border font-mono ${
                    formErrors.salary ? 'border-rose-300 bg-rose-50/50' : 'border-slate-200'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {formErrors.salary && (
                  <p className="mt-1 text-xs text-rose-600">{formErrors.salary}</p>
                )}
              </div>

              {/* Hire Date */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Hire Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  name="hire_date"
                  value={formData.hire_date}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 text-sm rounded-lg border ${
                    formErrors.hire_date ? 'border-rose-300 bg-rose-50/50' : 'border-slate-200'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {formErrors.hire_date && (
                  <p className="mt-1 text-xs text-rose-600">{formErrors.hire_date}</p>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Employment Status <span className="text-rose-500">*</span>
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 px-6 sm:px-8 py-4 border-t border-slate-200 flex items-center justify-between">
          <Link
            to="/employees"
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Updating in Database...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Update Employee</span>
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
};
