/**
 * Department Controller
 * Handles CRUD operations and validation for departments
 */

import { Request, Response, NextFunction } from 'express';
import { db } from '../config/db.ts';

export const getAllDepartments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const departments = db.getDepartments();
    res.status(200).json({
      success: true,
      count: departments.length,
      data: departments
    });
  } catch (error) {
    next(error);
  }
};

export const getDepartmentById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid department ID format. Expected numeric ID.'
      });
      return;
    }

    const dept = db.getDepartmentById(id);
    if (!dept) {
      res.status(404).json({
        success: false,
        message: `Department with ID ${id} not found.`
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: dept
    });
  } catch (error) {
    next(error);
  }
};

export const createDepartment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { department_name, description } = req.body;

    if (!department_name || typeof department_name !== 'string' || department_name.trim() === '') {
      res.status(400).json({
        success: false,
        message: 'Department name is required and cannot be empty.'
      });
      return;
    }

    const newDept = db.createDepartment(department_name, description || '');
    res.status(201).json({
      success: true,
      message: 'Department created successfully.',
      data: newDept
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create department.'
    });
  }
};

export const updateDepartment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid department ID format.'
      });
      return;
    }

    const { department_name, description } = req.body;

    if (!department_name || typeof department_name !== 'string' || department_name.trim() === '') {
      res.status(400).json({
        success: false,
        message: 'Department name is required.'
      });
      return;
    }

    const updatedDept = db.updateDepartment(id, department_name, description || '');
    res.status(200).json({
      success: true,
      message: 'Department updated successfully.',
      data: updatedDept
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update department.'
    });
  }
};

export const deleteDepartment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid department ID format.'
      });
      return;
    }

    db.deleteDepartment(id);
    res.status(200).json({
      success: true,
      message: 'Department deleted successfully.'
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to delete department.'
    });
  }
};
