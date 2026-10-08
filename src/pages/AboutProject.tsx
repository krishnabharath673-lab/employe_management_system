import React, { useState } from 'react';
import { 
  GraduationCap, Server, Database, Code, 
  Layers, CheckCircle2, Copy, Check, Terminal, 
  HelpCircle, ShieldCheck, ArrowRight, BookOpen
} from 'lucide-react';

export const AboutProject: React.FC = () => {
  const [copiedSql, setCopiedSql] = useState(false);

  const sampleSchema = `-- MySQL Database Schema Summary
CREATE TABLE departments (
    department_id INT AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

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
    CONSTRAINT fk_employee_department 
        FOREIGN KEY (department_id) 
        REFERENCES departments(department_id) 
        ON DELETE RESTRICT
);`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(sampleSchema);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      
      {/* Hero / Project Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs relative overflow-hidden">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
            <GraduationCap className="w-4 h-4" />
            <span>B.Tech Computer Science & Information Technology Final Year Capstone Project</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Employee Management System – HR CRUD Operations with Department Filters
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            A production-ready full-stack web application engineered to demonstrate foundational 
            and practical software engineering concepts: <strong>RESTful API Architecture</strong>, 
            <strong>Relational Database Management with MySQL</strong>, <strong>Foreign Key Referential Integrity</strong>, 
            and responsive <strong>React Frontend UI</strong>.
          </p>
        </div>
      </div>

      {/* Grid: Project Objectives & Architectural Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Code className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900">1. Full-Stack CRUD</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Complete implementation of Create, Read, Update, and Delete operations across both Employee records and organizational Departments with robust client & server validations.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Database className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900">2. Relational Integrity</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            One-to-Many (1:N) relationship connecting Departments and Employees. Enforces primary keys, auto-increment, unique email constraints, and <code>ON DELETE RESTRICT</code> foreign key safeguards.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900">3. Search & Department Filters</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Compound client-side and server-side filtering allowing HR managers to combine Department dropdowns, employment status filters, and fuzzy textual search seamlessly.
          </p>
        </div>

      </div>

      {/* Tech Stack Summary */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-6">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Server className="w-5 h-5 text-blue-600" />
          <span>Technology Stack Architecture</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div className="space-y-2 border-l-2 border-blue-500 pl-4">
            <h3 className="text-sm font-semibold text-slate-900">Frontend Tier</h3>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
              <li><strong>React 19 & TypeScript:</strong> Component-based SPA architecture</li>
              <li><strong>React Router v7:</strong> Declarative client-side routing</li>
              <li><strong>Tailwind CSS v4:</strong> Responsive, utility-first layout styling</li>
              <li><strong>Lucide React:</strong> Semantic vector iconography</li>
            </ul>
          </div>

          <div className="space-y-2 border-l-2 border-emerald-500 pl-4">
            <h3 className="text-sm font-semibold text-slate-900">Backend Tier</h3>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
              <li><strong>Node.js & Express.js:</strong> Lightweight REST API server</li>
              <li><strong>Modular Architecture:</strong> Controllers, Routes, and Config separated</li>
              <li><strong>Input Sanitization:</strong> Regular expression email checking & type validation</li>
              <li><strong>CORS Middleware:</strong> Cross-Origin Resource Sharing handling</li>
            </ul>
          </div>

          <div className="space-y-2 border-l-2 border-purple-500 pl-4">
            <h3 className="text-sm font-semibold text-slate-900">Database Tier</h3>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
              <li><strong>MySQL 8.0+ / MariaDB:</strong> RDBMS relational storage</li>
              <li><strong>schema.sql:</strong> Canonical DDL script with seed data</li>
              <li><strong>Foreign Keys:</strong> <code>fk_employee_department</code></li>
              <li><strong>Auto-Fallback Engine:</strong> Zero-downtime persistent layer for viva demos</li>
            </ul>
          </div>

        </div>
      </div>

      {/* REST API Endpoints Specification */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              RESTful API Endpoints Specification
            </h2>
            <p className="text-xs text-slate-500">
              Clean HTTP verb mapping designed according to REST principles
            </p>
          </div>
          <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2.5 py-1 rounded">
            Base: /api
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 font-semibold text-slate-700 border-b border-slate-200">
              <tr>
                <th className="px-4 py-2.5">Method</th>
                <th className="px-4 py-2.5">Endpoint URL</th>
                <th className="px-4 py-2.5">Description</th>
                <th className="px-4 py-2.5">Parameters / Payload</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              <tr>
                <td className="px-4 py-2 text-blue-600 font-bold">GET</td>
                <td className="px-4 py-2 text-slate-900">/api/employees</td>
                <td className="px-4 py-2 font-sans">Get all employees (supports search, filters, pagination)</td>
                <td className="px-4 py-2 text-slate-500 font-sans">?search, ?departmentId, ?status, ?page</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-blue-600 font-bold">GET</td>
                <td className="px-4 py-2 text-slate-900">/api/employees/:id</td>
                <td className="px-4 py-2 font-sans">Fetch single employee record by primary key</td>
                <td className="px-4 py-2 text-slate-500 font-sans">:id (numeric)</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-emerald-600 font-bold">POST</td>
                <td className="px-4 py-2 text-slate-900">/api/employees</td>
                <td className="px-4 py-2 font-sans">Create a new employee record</td>
                <td className="px-4 py-2 text-slate-500 font-sans">JSON employee object</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-amber-600 font-bold">PUT</td>
                <td className="px-4 py-2 text-slate-900">/api/employees/:id</td>
                <td className="px-4 py-2 font-sans">Update an existing employee record</td>
                <td className="px-4 py-2 text-slate-500 font-sans">:id + JSON updated fields</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-rose-600 font-bold">DELETE</td>
                <td className="px-4 py-2 text-slate-900">/api/employees/:id</td>
                <td className="px-4 py-2 font-sans">Delete an employee from the database</td>
                <td className="px-4 py-2 text-slate-500 font-sans">:id (numeric)</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-blue-600 font-bold">GET</td>
                <td className="px-4 py-2 text-slate-900">/api/departments</td>
                <td className="px-4 py-2 font-sans">Get all departments with count of assigned employees</td>
                <td className="px-4 py-2 text-slate-500 font-sans">None</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-emerald-600 font-bold">POST</td>
                <td className="px-4 py-2 text-slate-900">/api/departments</td>
                <td className="px-4 py-2 font-sans">Create a new business department</td>
                <td className="px-4 py-2 text-slate-500 font-sans">department_name, description</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-rose-600 font-bold">DELETE</td>
                <td className="px-4 py-2 text-slate-900">/api/departments/:id</td>
                <td className="px-4 py-2 font-sans">Delete department (enforces foreign key check)</td>
                <td className="px-4 py-2 text-slate-500 font-sans">:id (fails if employees exist)</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-blue-600 font-bold">GET</td>
                <td className="px-4 py-2 text-slate-900">/api/employees/dashboard-stats</td>
                <td className="px-4 py-2 font-sans">Fetch aggregate statistics & department breakdown</td>
                <td className="px-4 py-2 text-slate-500 font-sans">None</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* SQL Schema Viewer */}
      <div className="bg-slate-900 text-slate-200 rounded-xl p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-blue-400" />
            <span className="font-mono text-sm text-slate-100 font-semibold">
              database/schema.sql (MySQL DDL)
            </span>
          </div>

          <button
            onClick={handleCopySql}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 transition-colors"
          >
            {copiedSql ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy SQL</span>
              </>
            )}
          </button>
        </div>

        <pre className="bg-slate-950 p-4 rounded-lg text-xs font-mono overflow-x-auto text-blue-300/90 leading-relaxed">
          {sampleSchema}
        </pre>
      </div>

      {/* Viva Voce Questions & Answers Guide for Students */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-bold text-slate-900">
            Project Viva-Voce Examination Preparation Guide
          </h2>
        </div>

        <div className="space-y-4 text-xs sm:text-sm">
          
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
            <h3 className="font-semibold text-slate-900">
              Q1: How is referential integrity maintained in this system?
            </h3>
            <p className="text-slate-600 leading-relaxed">
              <strong>Answer:</strong> The <code>employees</code> table defines a Foreign Key constraint <code>fk_employee_department</code> on <code>department_id</code> that references <code>departments(department_id)</code> with <code>ON DELETE RESTRICT</code>. This prevents an admin from accidentally deleting a department that currently has employees assigned to it.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
            <h3 className="font-semibold text-slate-900">
              Q2: How does the application prevent SQL Injection attacks?
            </h3>
            <p className="text-slate-600 leading-relaxed">
              <strong>Answer:</strong> All database queries utilize parameterized prepared statements (using <code>?</code> placeholders) rather than string concatenation. Furthermore, input data types (salary, dates, emails) are validated before hitting the query execution layer.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
            <h3 className="font-semibold text-slate-900">
              Q3: What normalization level is achieved in the database schema?
            </h3>
            <p className="text-slate-600 leading-relaxed">
              <strong>Answer:</strong> The database satisfies <strong>Third Normal Form (3NF)</strong>:
              1. 1NF: All column values are atomic (e.g. separate first_name, last_name, address).
              2. 2NF: All non-key attributes are fully functionally dependent on primary keys.
              3. 3NF: Transitive dependencies are removed by isolating department information into its own <code>departments</code> table instead of redundantly storing department names in every employee row.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
            <h3 className="font-semibold text-slate-900">
              Q4: How does the compound department and status filtering work?
            </h3>
            <p className="text-slate-600 leading-relaxed">
              <strong>Answer:</strong> The backend <code>getAllEmployees</code> controller parses query parameters (<code>departmentId</code>, <code>status</code>, <code>search</code>) and applies combined predicate filters. In SQL, this is equivalent to <code>WHERE (e.department_id = ?) AND (e.status = ?) AND (first_name LIKE ? OR email LIKE ?)</code>.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};
