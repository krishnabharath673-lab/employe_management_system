/**
 * Employee Controller
 * Handles CRUD operations, search, filters, and statistics for employees
 */

import { Request, Response, NextFunction } from 'express';
import { db } from '../config/db.ts';

// Email regex pattern
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const getAllEmployees = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const search = req.query.search as string | undefined;
    const departmentIdStr = req.query.departmentId as string | undefined;
    const departmentId = departmentIdStr ? parseInt(departmentIdStr, 10) : undefined;
    const status = req.query.status as string | undefined;
    const sortBy = (req.query.sortBy as string) || 'employee_id';
    const sortOrder = (req.query.sortOrder as 'asc' | 'desc') || 'asc';
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;

    const result = db.getEmployees({
      search,
      departmentId,
      status,
      sortBy,
      sortOrder,
      page,
      limit
    });

    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
};

export const getEmployeeById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid employee ID format.'
      });
      return;
    }

    const employee = db.getEmployeeById(id);
    if (!employee) {
      res.status(404).json({
        success: false,
        message: `Employee with ID ${id} not found.`
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: employee
    });
  } catch (error) {
    next(error);
  }
};

export const getEmployeesByDepartment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const deptId = parseInt(req.params.departmentId, 10);
    if (isNaN(deptId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid department ID format.'
      });
      return;
    }

    const employees = db.getEmployeesByDepartmentId(deptId);
    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees
    });
  } catch (error) {
    next(error);
  }
};

export const createEmployee = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      employee_code,
      first_name,
      last_name,
      email,
      phone,
      gender,
      date_of_birth,
      hire_date,
      job_title,
      salary,
      department_id,
      address,
      city,
      status
    } = req.body;

    // 1. Required field validation
    const errors: string[] = [];
    if (!employee_code?.trim()) errors.push('Employee Code is required.');
    if (!first_name?.trim()) errors.push('First Name is required.');
    if (!last_name?.trim()) errors.push('Last Name is required.');
    if (!email?.trim()) errors.push('Email address is required.');
    if (!phone?.trim()) errors.push('Phone number is required.');
    if (!gender) errors.push('Gender selection is required.');
    if (!date_of_birth) errors.push('Date of Birth is required.');
    if (!hire_date) errors.push('Hire Date is required.');
    if (!job_title?.trim()) errors.push('Job Title is required.');
    if (salary === undefined || salary === null || salary === '') errors.push('Salary is required.');
    if (!department_id) errors.push('Department selection is required.');
    if (!address?.trim()) errors.push('Address is required.');
    if (!city?.trim()) errors.push('City is required.');

    if (errors.length > 0) {
      res.status(400).json({
        success: false,
        message: errors[0],
        errors
      });
      return;
    }

    // 2. Email format validation
    if (!EMAIL_REGEX.test(email.trim())) {
      res.status(400).json({
        success: false,
        message: 'Please provide a valid email address format (e.g., name@domain.com).'
      });
      return;
    }

    // 3. Numeric salary validation
    const parsedSalary = parseFloat(salary);
    if (isNaN(parsedSalary) || parsedSalary < 0) {
      res.status(400).json({
        success: false,
        message: 'Salary must be a valid non-negative number.'
      });
      return;
    }

    // 4. Department ID numeric validation
    const parsedDeptId = parseInt(department_id, 10);
    if (isNaN(parsedDeptId)) {
      res.status(400).json({
        success: false,
        message: 'Department ID must be a valid integer.'
      });
      return;
    }

    // 5. Gender validation
    if (!['Male', 'Female', 'Other'].includes(gender)) {
      res.status(400).json({
        success: false,
        message: 'Gender must be Male, Female, or Other.'
      });
      return;
    }

    // 6. Status validation
    const empStatus = status === 'Inactive' ? 'Inactive' : 'Active';

    // 7. Insert via database service
    const newEmployee = db.createEmployee({
      employee_code: employee_code.trim(),
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      gender,
      date_of_birth,
      hire_date,
      job_title: job_title.trim(),
      salary: parsedSalary,
      department_id: parsedDeptId,
      address: address.trim(),
      city: city.trim(),
      status: empStatus
    });

    res.status(201).json({
      success: true,
      message: `Employee ${newEmployee.first_name} ${newEmployee.last_name} (${newEmployee.employee_code}) added successfully.`,
      data: newEmployee
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create employee.'
    });
  }
};

export const updateEmployee = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid employee ID format.'
      });
      return;
    }

    const {
      employee_code,
      first_name,
      last_name,
      email,
      phone,
      gender,
      date_of_birth,
      hire_date,
      job_title,
      salary,
      department_id,
      address,
      city,
      status
    } = req.body;

    const updatePayload: any = {};

    if (employee_code !== undefined) {
      if (!employee_code.trim()) {
        res.status(400).json({ success: false, message: 'Employee Code cannot be empty.' });
        return;
      }
      updatePayload.employee_code = employee_code.trim();
    }

    if (first_name !== undefined) {
      if (!first_name.trim()) {
        res.status(400).json({ success: false, message: 'First Name cannot be empty.' });
        return;
      }
      updatePayload.first_name = first_name.trim();
    }

    if (last_name !== undefined) {
      if (!last_name.trim()) {
        res.status(400).json({ success: false, message: 'Last Name cannot be empty.' });
        return;
      }
      updatePayload.last_name = last_name.trim();
    }

    if (email !== undefined) {
      if (!EMAIL_REGEX.test(email.trim())) {
        res.status(400).json({ success: false, message: 'Invalid email address format.' });
        return;
      }
      updatePayload.email = email.trim().toLowerCase();
    }

    if (phone !== undefined) {
      if (!phone.trim()) {
        res.status(400).json({ success: false, message: 'Phone cannot be empty.' });
        return;
      }
      updatePayload.phone = phone.trim();
    }

    if (gender !== undefined) {
      if (!['Male', 'Female', 'Other'].includes(gender)) {
        res.status(400).json({ success: false, message: 'Gender must be Male, Female, or Other.' });
        return;
      }
      updatePayload.gender = gender;
    }

    if (date_of_birth !== undefined) updatePayload.date_of_birth = date_of_birth;
    if (hire_date !== undefined) updatePayload.hire_date = hire_date;

    if (job_title !== undefined) {
      if (!job_title.trim()) {
        res.status(400).json({ success: false, message: 'Job title cannot be empty.' });
        return;
      }
      updatePayload.job_title = job_title.trim();
    }

    if (salary !== undefined) {
      const parsedSalary = parseFloat(salary);
      if (isNaN(parsedSalary) || parsedSalary < 0) {
        res.status(400).json({ success: false, message: 'Salary must be a valid non-negative number.' });
        return;
      }
      updatePayload.salary = parsedSalary;
    }

    if (department_id !== undefined) {
      const parsedDeptId = parseInt(department_id, 10);
      if (isNaN(parsedDeptId)) {
        res.status(400).json({ success: false, message: 'Department ID must be a valid integer.' });
        return;
      }
      updatePayload.department_id = parsedDeptId;
    }

    if (address !== undefined) updatePayload.address = address.trim();
    if (city !== undefined) updatePayload.city = city.trim();
    if (status !== undefined) {
      if (!['Active', 'Inactive'].includes(status)) {
        res.status(400).json({ success: false, message: 'Status must be Active or Inactive.' });
        return;
      }
      updatePayload.status = status;
    }

    const updatedEmployee = db.updateEmployee(id, updatePayload);

    res.status(200).json({
      success: true,
      message: `Employee ${updatedEmployee.first_name} ${updatedEmployee.last_name} updated successfully.`,
      data: updatedEmployee
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update employee.'
    });
  }
};

export const deleteEmployee = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid employee ID format.'
      });
      return;
    }

    const deleted = db.deleteEmployee(id);
    res.status(200).json({
      success: true,
      message: `Employee "${deleted.first_name} ${deleted.last_name}" (${deleted.employee_code}) was successfully deleted.`
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to delete employee.'
    });
  }
};

export const getDashboardStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const stats = db.getDashboardStats();
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

export const resetSampleData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    db.resetToSampleData();
    res.status(200).json({
      success: true,
      message: 'Database reset to initial sample state successfully with 6 departments and 12 employees.'
    });
  } catch (error) {
    next(error);
  }
};
