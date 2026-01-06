import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from './routes/index.js';
import viewsController from './controllers/ViewsController.js';
import { testConnection } from './config/database.js';
import { errorHandler } from './middleware/validation.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files (for future CSS/JS assets)
app.use('/static', express.static(path.join(__dirname, 'public')));

// View Routes (HTML pages)
app.use('/', viewsController);

// API Routes
app.use('/api', routes);

// 404 handler for views
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    next();
  } else {
    res.status(404).render('error', { message: 'Page not found' });
  }
});

// Error handler
app.use(errorHandler);

// Start server
async function start() {
  // Test database connection
  const dbConnected = await testConnection();
  if (!dbConnected) {
    console.error('⚠️  Database connection failed. Starting server anyway...');
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📄 Question Feed at http://localhost:${PORT}/questions`);
    console.log(`📚 API available at http://localhost:${PORT}/api`);
    console.log(`❤️  Health check at http://localhost:${PORT}/api/health`);
  });
}

start();
