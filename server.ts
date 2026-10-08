import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import departmentRoutes from './backend/routes/departmentRoutes.ts';
import employeeRoutes from './backend/routes/employeeRoutes.ts';
import { errorHandler } from './backend/middleware/errorHandler.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// REST API Endpoints
app.use('/api/departments', departmentRoutes);
app.use('/api/employees', employeeRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    project: 'Employee Management System - B.Tech CS/IT Project',
    timestamp: new Date().toISOString()
  });
});

// Vite Middleware for Development / Static Serving for Production
const isProduction = process.env.NODE_ENV === 'production';

async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  // Global Error Handler
  app.use(errorHandler);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[EMS Server] Employee Management System backend listening on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[EMS Server] Startup failure:', err);
  process.exit(1);
});
