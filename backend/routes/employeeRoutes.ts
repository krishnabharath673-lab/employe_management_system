import { Router } from 'express';
import {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeesByDepartment,
  getDashboardStats,
  resetSampleData
} from '../controllers/employeeController.ts';

const router = Router();

// Routes for /api/employees
router.get('/dashboard-stats', getDashboardStats);
router.post('/reset-sample-data', resetSampleData);
router.get('/department/:departmentId', getEmployeesByDepartment);

router.get('/', getAllEmployees);
router.get('/:id', getEmployeeById);
router.post('/', createEmployee);
router.put('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);

export default router;
