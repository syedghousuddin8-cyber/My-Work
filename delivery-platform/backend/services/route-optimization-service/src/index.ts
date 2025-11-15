import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import routeRoutes from './routes/route.routes';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3009;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// Logging
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/v1/routes', routeRoutes);

app.get('/', (req: Request, res: Response) => {
  res.json({
    service: 'route-optimization-service',
    version: '1.0.0',
    status: 'running',
  });
});

// Error handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Route Optimization Service running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
