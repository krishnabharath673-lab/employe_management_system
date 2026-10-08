import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, Plus, Edit, Trash2, Users, 
  RefreshCw, AlertCircle, CheckCircle2, X, ExternalLink
} from 'lucide-react';
import { api, Department } from '../services/api.ts';
import { ConfirmationModal } from '../components/ConfirmationModal.tsx';
import { useToast } from '../context/ToastContext.tsx';

export const Departments: React.FC = () => {
  const navigate = useNavigate();
  const { success, error } = useToast();

  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Modal states for Create & Edit
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [activeDeptId, setActiveDeptId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ department_name: '', description: '' });
  const [modalError, setModalError] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<Department | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const loadDepartments = async () => {
    setIsLoading(true);
    try {
      const res = await api.getDepartments();
      if (res.success) {
        setDepartments(res.data);
      }
    } catch (err: any) {
      error(err.message || 'Failed to load departments.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDepartments();

    const handleRefresh = () => loadDepartments();
    window.addEventListener('ems-data-refreshed', handleRefresh);
    return () => window.removeEventListener('ems-data-refreshed', handleRefresh);
  }, []);

  const openCreateModal = () => {
    setModalMode('create');
    setActiveDeptId(null);
    setFormData({ department_name: '', description: '' });
    setModalError('');
    setIsModalOpen(true);
  };

  const openEditModal = (dept: Department) => {
    setModalMode('edit');
    setActiveDeptId(dept.department_id);
    setFormData({
      department_name: dept.department_name,
      description: dept.description || ''
    });
    setModalError('');
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.department_name.trim()) {
      setModalError('Department name is required.');
      return;
    }

    setIsSaving(true);
    setModalError('');
    try {
      if (modalMode === 'create') {
        const res = await api.createDepartment(formData);
        success(res.message || 'Department created successfully!');
      } else if (activeDeptId) {
        const res = await api.updateDepartment(activeDeptId, formData);
        success(res.message || 'Department updated successfully!');
      }
      setIsModalOpen(false);
      loadDepartments();
    } catch (err: any) {
      setModalError(err.message || 'Operation failed.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await api.deleteDepartment(deleteTarget.department_id);
      success(res.message || 'Department deleted successfully!');
      setDeleteTarget(null);
      loadDepartments();
    } catch (err: any) {
      error(err.message || 'Cannot delete department.');
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Department Management
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Configure business departments, maintain employee relationships, and enforce referential integrity.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadDepartments}
            disabled={isLoading}
            className="p-2 text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors shadow-2xs"
            title="Refresh Departments"
            aria-label="Refresh Departments"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-blue-600' : ''}`} />
          </button>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Department</span>
          </button>
        </div>
      </div>

      {/* Info Card explaining B.Tech Database Principles */}
      <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 flex items-start gap-3 text-xs text-blue-900">
        <Building2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="font-semibold block text-blue-950 mb-0.5">
            Relational Integrity & Foreign Key Constraint:
          </strong>
          The <code>department_id</code> column is referenced by the <code>employees</code> table with <code>ON DELETE RESTRICT</code>.
          If active employees are assigned to a department, deletion is prevented by the database to ensure data integrity.
        </div>
      </div>

      {/* Departments Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th scope="col" className="px-6 py-3.5">ID</th>
                <th scope="col" className="px-6 py-3.5">Department Name</th>
                <th scope="col" className="px-6 py-3.5">Description</th>
                <th scope="col" className="px-6 py-3.5">Employees Count</th>
                <th scope="col" className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
                      <span>Fetching departments from database...</span>
                    </div>
                  </td>
                </tr>
              ) : departments.length > 0 ? (
                departments.map((dept) => (
                  <tr key={dept.department_id} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* ID */}
                    <td className="px-6 py-4 font-mono text-xs text-slate-800 font-bold">
                      #{dept.department_id}
                    </td>

                    {/* Name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                          {dept.department_name.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="font-semibold text-slate-900 text-sm">
                          {dept.department_name}
                        </span>
                      </div>
                    </td>

                    {/* Description */}
                    <td className="px-6 py-4 text-xs text-slate-600 max-w-md">
                      {dept.description || <span className="text-slate-400 italic">No description provided</span>}
                    </td>

                    {/* Employee Count */}
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() => navigate(`/employees?departmentId=${dept.department_id}`)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 transition-colors cursor-pointer"
                        title="View employees in this department"
                      >
                        <Users className="w-3.5 h-3.5 text-blue-600" />
                        <span className="tabular-nums">{dept.employee_count ?? 0}</span> employees
                        <ExternalLink className="w-3 h-3 ml-0.5 opacity-60" />
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openEditModal(dept)}
                          className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                          title="Edit Department"
                          aria-label="Edit Department"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeleteTarget(dept)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                          title="Delete Department"
                          aria-label="Delete Department"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                    No departments found in the database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Department Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">
                {modalMode === 'create' ? 'Add New Department' : 'Edit Department'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleModalSubmit}>
              <div className="p-6 space-y-4">
                {modalError && (
                  <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{modalError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Department Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.department_name}
                    onChange={(e) => setFormData({ ...formData, department_name: e.target.value })}
                    placeholder="e.g. Research & Development"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of department scope and responsibilities..."
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2"
                >
                  {isSaving && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                  <span>{modalMode === 'create' ? 'Create Department' : 'Save Changes'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Delete Department Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!deleteTarget}
        title="Delete Department?"
        message={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.department_name}"? Note that if any employees are currently assigned to this department (${deleteTarget.employee_count ?? 0} employee(s)), MySQL foreign key constraints will prevent deletion.`
            : 'Are you sure you want to delete this department?'
        }
        confirmText="Confirm Delete"
        cancelText="Cancel"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />

    </div>
  );
};
