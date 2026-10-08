# Employee Management System – HR CRUD Operations with Department Filters

**B.Tech Computer Science & Information Technology Final-Year Project**

---

## 1. Project Title
**Employee Management System (EMS) – HR CRUD Operations with Department Filters**

---

## 2. Project Description
The **Employee Management System** is a full-stack web application developed as a final-year B.Tech capstone project. It allows Human Resources (HR) administrators to manage organizational workforce records through an intuitive, modern, and responsive web portal.

The application implements full **CRUD operations (Create, Read, Update, Delete)** for employees and departments, supported by compound multi-criteria filtering (department, status, search, and sorting). Built on top of a 3-tier architecture (Client, REST API Server, Relational Database), it showcases core software engineering competencies including database normalization, foreign key referential integrity, parameterized SQL query execution, and component-based user interfaces.

---

## 3. Objectives
1. **Practical Demonstration of Full-Stack Architecture:** Connect a React.js single-page frontend to an Express.js REST API backend communicating with a MySQL relational database.
2. **Referential Integrity Enforcement:** Implement primary keys and foreign keys between `departments` and `employees` with strict `ON DELETE RESTRICT` constraints to prevent orphan records.
3. **Robust Data Validation:** Enforce server-side and client-side validations for email formatting, non-negative salaries, unique identifiers, and required fields.
4. **Enhanced Data Retrieval:** Provide HR administrators with real-time compound filtering (department filter, status filter, keyword search, and column sorting).
5. **Viva-Voce Ready Engineering:** Write clean, readable code with descriptive comments and standard architectural patterns that students can confidently explain to university examiners.

---

## 4. Key Features

### 4.1 Executive HR Dashboard
- **Workforce KPIs:** Instant counts for Total Employees, Active Employees, Inactive Employees, and Departments.
- **Department Headcount Breakdown:** Visual distribution meters showing headcount and percentage allocation per department.
- **Active vs. Inactive Ratio:** Visual workforce operational status gauge.
- **Recently Added Employees:** Quick-access list showing the latest onboarded staff members.

### 4.2 Employee Management (CRUD)
- **Read (Directory Table):** High-density, mobile-responsive table with employee code, full name, avatar, contact details, job title, department, salary, and status badge.
- **Create (Add Employee):** Multi-section form capturing official codes, personal demographics, contact info, job role, salary, and department assignment. Includes automated employee code generation (`EMP-XXXX`).
- **Update (Edit Employee):** Pre-populates existing record data, allows safe modification, validates inputs, and writes changes back to the database.
- **Delete (Employee Deletion):** Safeguarded by an explicit confirmation modal dialog (`"Are you sure you want to delete this employee?"`).
- **View Modal:** Clean card view detailing personal information, job history, and timestamp audit logs.

### 4.3 Department Filtering & Multi-Search
- **Department Dropdown Filter:** Filter employee records dynamically by selecting any department (Human Resources, IT, Finance, Marketing, Sales, Operations).
- **Status Filter:** Filter by `Active` or `Inactive` personnel.
- **Fuzzy Search:** Instant search across employee name, code, email, and job title.
- **Column Sorting:** Sort records by ID, Name, Salary, or Hire Date in ascending/descending order.
- **Pagination:** Handles pagination smoothly for growing workforce databases.

### 4.4 Department Management (1:N Master)
- View all company departments alongside real-time employee counts.
- Add new departments with descriptions.
- Edit existing department titles and duties.
- Safe deletion with foreign key referential integrity checks (blocks deletion if active staff are assigned).

### 4.5 System & Viva Voce Documentation
- Interactive About Project page with architectural diagrams, REST API specs, MySQL DDL schema viewer with copy button, and a curated list of viva-voce questions and model answers.
- Demo data reset button to instantly restore initial sample records during viva presentations.

---

## 5. Technologies Used

### Frontend Tier
- **React.js (v19)** – Component-based User Interface library
- **React Router (v7)** – Client-side SPA routing and navigation
- **Tailwind CSS (v4)** – Responsive UI layout and styling
- **Lucide React** – Clean vector icons

### Backend Tier
- **Node.js** – Server-side JavaScript runtime
- **Express.js (v4)** – Minimalist, robust RESTful API web framework
- **CORS & Body-Parser** – Cross-Origin Resource Sharing and JSON request parsing
- **dotenv** – Environment variable isolation

### Database Tier
- **MySQL 8.0+ / MariaDB** – Relational Database Management System (RDBMS)
- **schema.sql** – DDL scripts with primary keys, foreign key constraints, and seed data
- **Embedded Persistent Relational Layer** – Automatic fallback layer that mirrors MySQL relational rules (`db_store.json`), allowing instant execution out of the box in testing environments.

---

## 6. System Requirements
- **Node.js:** v18.0.0 or higher
- **npm:** v9.0.0 or higher
- **MySQL Server (Optional for local deployment):** MySQL 8.0+ or MariaDB 10.4+ (e.g. via XAMPP, WAMP, or standalone MySQL)
- **Modern Web Browser:** Google Chrome, Firefox, Safari, or Microsoft Edge

---

## 7. Database Setup (MySQL)

### Step 1: Open MySQL Console or phpMyAdmin
Log in to your MySQL server:
```bash
mysql -u root -p
```

### Step 2: Execute `database/schema.sql`
Run the provided SQL script:
```sql
SOURCE /path/to/employee-management-system/database/schema.sql;
```
*Or open phpMyAdmin -> Click **Import** -> Select `database/schema.sql` -> Click **Go**.*

### Step 3: Verify Tables Created
```sql
USE employee_db;
SHOW TABLES;
-- Expected output:
-- +-----------------------+
-- | Tables_in_employee_db |
-- +-----------------------+
-- | departments           |
-- | employees             |
-- +-----------------------+

SELECT * FROM departments;
SELECT employee_id, first_name, last_name, job_title, status FROM employees;
```

---

## 8. Backend Configuration

Configure environment variables in your `.env` file (copy from `.env.example`):

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=employee_db
DB_PORT=3306
```

*Note: If MySQL server credentials are not provided or the MySQL daemon is not running, the application seamlessly activates its embedded persistent relational driver, pre-populated with all 6 departments and 12 employees.*

---

## 9. How to Run the Project

### Installation
Clone the repository and install dependencies:

```bash
# 1. Install all required dependencies
npm install
```

### Starting the Application
To run the full-stack system (Express REST API backend + React frontend):

```bash
npm run dev
```

The application will start on **http://localhost:3000**.

### Production Build
```bash
npm run build
npm start
```

---

## 10. REST API Endpoints Specification

| HTTP Method | Route | Description | Query / Body Parameters |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/employees` | Retrieve paginated employees list | `?search`, `?departmentId`, `?status`, `?sortBy`, `?page`, `?limit` |
| **GET** | `/api/employees/:id` | Get employee details by ID | Param `:id` |
| **POST** | `/api/employees` | Create a new employee | JSON employee payload |
| **PUT** | `/api/employees/:id` | Update employee information | Param `:id` + JSON update payload |
| **DELETE** | `/api/employees/:id` | Delete an employee | Param `:id` |
| **GET** | `/api/employees/department/:departmentId` | Fetch employees by department | Param `:departmentId` |
| **GET** | `/api/employees/dashboard-stats` | Aggregated dashboard KPI metrics | None |
| **POST** | `/api/employees/reset-sample-data` | Re-seed sample database records | None |
| **GET** | `/api/departments` | List all departments with headcount | None |
| **GET** | `/api/departments/:id` | Get department details | Param `:id` |
| **POST** | `/api/departments` | Create new department | `department_name`, `description` |
| **PUT** | `/api/departments/:id` | Update department details | Param `:id` + updated fields |
| **DELETE** | `/api/departments/:id` | Delete department | Param `:id` (Protected by foreign key) |

---

## 11. Database Structure & Schema

### Entity Relationship (ER) Summary:
- **`departments` Table:**
  - `department_id` (INT, Primary Key, Auto Increment)
  - `department_name` (VARCHAR(100), UNIQUE, NOT NULL)
  - `description` (TEXT)
  - `created_at` (TIMESTAMP)
  - `updated_at` (TIMESTAMP)

- **`employees` Table:**
  - `employee_id` (INT, Primary Key, Auto Increment)
  - `employee_code` (VARCHAR(20), UNIQUE, NOT NULL)
  - `first_name` (VARCHAR(50), NOT NULL)
  - `last_name` (VARCHAR(50), NOT NULL)
  - `email` (VARCHAR(100), UNIQUE, NOT NULL)
  - `phone` (VARCHAR(20), NOT NULL)
  - `gender` (ENUM('Male', 'Female', 'Other'), NOT NULL)
  - `date_of_birth` (DATE, NOT NULL)
  - `hire_date` (DATE, NOT NULL)
  - `job_title` (VARCHAR(100), NOT NULL)
  - `salary` (DECIMAL(10,2), NOT NULL)
  - `department_id` (INT, Foreign Key referencing `departments.department_id`)
  - `address` (VARCHAR(255), NOT NULL)
  - `city` (VARCHAR(100), NOT NULL)
  - `status` (ENUM('Active', 'Inactive'), DEFAULT 'Active')
  - `created_at` (TIMESTAMP)
  - `updated_at` (TIMESTAMP)

### Constraint:
```sql
CONSTRAINT fk_employee_department 
    FOREIGN KEY (department_id) 
    REFERENCES departments(department_id) 
    ON DELETE RESTRICT 
    ON UPDATE CASCADE;
```

---

## 12. Screenshots Section (Placeholder for Project Report)

```
+-----------------------------------------------------------------------+
|  [Screenshot 1]: HR Dashboard with KPI Cards and Department Chart    |
|  [Screenshot 2]: Employee Directory with Department Filters & Search  |
|  [Screenshot 3]: Add Employee Form with Real-time Validations         |
|  [Screenshot 4]: Employee Profile Detail View Modal                   |
|  [Screenshot 5]: Department Management with Foreign Key Safeguards   |
|  [Screenshot 6]: About Project Page with Viva Examination Guide       |
+-----------------------------------------------------------------------+
```

---

## 13. Viva-Voce Quick Reference for Students

1. **What is CRUD?**
   - **C**reate (`POST`), **R**ead (`GET`), **U**pdate (`PUT`), **D**elete (`DELETE`).
2. **Why use Foreign Keys with `ON DELETE RESTRICT`?**
   - It maintains referential integrity by forbidding the deletion of a department if any employee is currently assigned to it.
3. **What is 3NF in this project?**
   - Normalization removes data anomalies. Department attributes (`department_name`, `description`) are stored once in `departments` rather than repeating for every employee.
4. **How are SQL Injections avoided?**
   - By using parameterized SQL queries (`?`) instead of concatenated raw strings, separating data from executable SQL commands.

---

## 14. Future Enhancements
- Export employee records to Excel / CSV format.
- Attendance and leave management tracking module.
- Role-based Access Control (RBAC) separating HR Managers and Department Supervisors.
- Automated email onboarding welcome notifications.

---

## 15. Conclusion
The **Employee Management System** successfully fulfills the academic requirements for a B.Tech Computer Science / Information Technology capstone project. It bridges database design theory with practical full-stack implementation, providing a dependable, clean, and extensible foundation for human resources administration.
