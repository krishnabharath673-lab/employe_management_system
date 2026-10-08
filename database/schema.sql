-- =====================================================================
-- DATABASE SCHEMA: Employee Management System (EMS)
-- B.Tech Final Year Computer Science & IT Capstone Project
-- RDBMS: MySQL 8.0+ / MariaDB
-- =====================================================================

-- Step 1: Create Database
CREATE DATABASE IF NOT EXISTS employee_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE employee_db;

-- Step 2: Drop existing tables if they exist (clean setup)
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS departments;

-- Step 3: Create Departments Table
-- Master entity representing organization departments
CREATE TABLE departments (
    department_id INT AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Step 4: Create Employees Table
-- Core operational entity storing staff credentials, contact details, and employment metadata
CREATE TABLE employees (
    employee_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_code VARCHAR(20) NOT NULL UNIQUE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    date_of_birth DATE NOT NULL,
    hire_date DATE NOT NULL,
    job_title VARCHAR(100) NOT NULL,
    salary DECIMAL(10, 2) NOT NULL,
    department_id INT NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Key Constraint ensuring referential integrity
    CONSTRAINT fk_employee_department 
        FOREIGN KEY (department_id) 
        REFERENCES departments(department_id) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Step 5: Add Indexes for Optimized Search & Filter Queries
CREATE INDEX idx_emp_department ON employees(department_id);
CREATE INDEX idx_emp_status ON employees(status);
CREATE INDEX idx_emp_email ON employees(email);
CREATE INDEX idx_emp_code ON employees(employee_code);

-- =====================================================================
-- SAMPLE DATA INSERTION (SEED DATA)
-- =====================================================================

-- 1. Insert Sample Departments
INSERT INTO departments (department_id, department_name, description) VALUES
(1, 'Human Resources', 'Handles talent acquisition, employee relations, onboarding, and workforce policies.'),
(2, 'IT', 'Software architecture, cloud infrastructure, IT support, and cybersecurity.'),
(3, 'Finance', 'Financial accounting, payroll administration, compliance, budgeting, and fiscal audits.'),
(4, 'Marketing', 'Brand positioning, digital outreach, advertising campaigns, and public relations.'),
(5, 'Sales', 'Enterprise business development, client relations, and revenue generation.'),
(6, 'Operations', 'Supply chain management, logistical workflows, and internal organizational efficiency.');

-- 2. Insert Sample Employees (12 realistic records across departments)
INSERT INTO employees (
    employee_id, employee_code, first_name, last_name, email, phone, 
    gender, date_of_birth, hire_date, job_title, salary, department_id, 
    address, city, status
) VALUES
(1, 'EMP-1001', 'Aarav', 'Sharma', 'aarav.sharma@company.com', '+91 98765 43210', 'Male', '1992-04-15', '2021-03-01', 'Senior Full Stack Engineer', 85000.00, 2, 'Flat 402, Green Glen Heights, Bellandur', 'Bengaluru', 'Active'),
(2, 'EMP-1002', 'Priya', 'Nair', 'priya.nair@company.com', '+91 98123 45678', 'Female', '1994-08-22', '2022-01-15', 'HR Operations Lead', 68000.00, 1, 'B-12, Palm Meadows, Whitefield', 'Bengaluru', 'Active'),
(3, 'EMP-1003', 'Rohan', 'Verma', 'rohan.verma@company.com', '+91 97234 56789', 'Male', '1990-11-05', '2019-07-10', 'Financial Controller', 92000.00, 3, '504 Aster Tower, Worli Sea Face', 'Mumbai', 'Active'),
(4, 'EMP-1004', 'Ananya', 'Iyer', 'ananya.iyer@company.com', '+91 96345 67890', 'Female', '1996-02-18', '2023-05-02', 'Digital Marketing Specialist', 54000.00, 4, '14 Anna Salai, T Nagar', 'Chennai', 'Active'),
(5, 'EMP-1005', 'Vikram', 'Patel', 'vikram.patel@company.com', '+91 95456 78901', 'Male', '1993-09-30', '2020-11-18', 'Enterprise Account Executive', 78000.00, 5, '302 Shanti Sadan, CG Road', 'Ahmedabad', 'Active'),
(6, 'EMP-1006', 'Sneha', 'Mukherjee', 'sneha.mukherjee@company.com', '+91 94567 89012', 'Female', '1991-06-12', '2018-09-01', 'Logistics Operations Director', 95000.00, 6, '78 Lake View Enclave, Salt Lake', 'Kolkata', 'Active'),
(7, 'EMP-1007', 'Karthik', 'Rao', 'karthik.rao@company.com', '+91 93678 90123', 'Male', '1997-12-03', '2024-02-15', 'DevOps & Cloud Engineer', 72000.00, 2, '22/A Gachibowli Tech Corridor', 'Hyderabad', 'Active'),
(8, 'EMP-1008', 'Neha', 'Kapoor', 'neha.kapoor@company.com', '+91 92789 01234', 'Female', '1995-07-27', '2022-08-20', 'Talent Acquisition Partner', 58000.00, 1, 'Plot 45, Sector 29', 'Gurugram', 'Inactive'),
(9, 'EMP-1009', 'Aditya', 'Joshi', 'aditya.joshi@company.com', '+91 91890 12345', 'Male', '1989-03-14', '2017-04-10', 'Senior Payroll Accountant', 81000.00, 3, '19 Shivaji Park, Dadar', 'Mumbai', 'Active'),
(10, 'EMP-1010', 'Meera', 'Chopra', 'meera.chopra@company.com', '+91 90901 23456', 'Female', '1998-10-09', '2024-06-01', 'Content Strategist & Copywriter', 48000.00, 4, '88 Koregaon Park Road', 'Pune', 'Active'),
(11, 'EMP-1011', 'Devansh', 'Singhania', 'devansh.s@company.com', '+91 89012 34567', 'Male', '1992-01-25', '2021-09-15', 'Regional Sales Manager', 86000.00, 5, 'Flat 101, Golf Links Road', 'New Delhi', 'Active'),
(12, 'EMP-1012', 'Divya', 'Reddy', 'divya.reddy@company.com', '+91 88123 45678', 'Female', '1996-05-19', '2023-11-01', 'QA & Automation Specialist', 62000.00, 2, '4th Floor, Jubilee Hills Check Post', 'Hyderabad', 'Inactive');

-- Verification Query: Inspect Employee List with Department Names
-- SELECT e.employee_id, e.employee_code, e.first_name, e.last_name, e.email, e.job_title, d.department_name, e.status 
-- FROM employees e 
-- JOIN departments d ON e.department_id = d.department_id;
