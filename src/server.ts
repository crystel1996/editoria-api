import express from 'express';
import './utils/database.js'; // Initialize database
import routes from './routes/index.js';
import { cors } from './middlewares/cors.js';
import { logger } from './middlewares/logger.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors);
app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route non trouvée' });
});

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`API available at http://localhost:${PORT}/api`);
});
