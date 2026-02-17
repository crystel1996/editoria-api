import { Router } from 'express';
import articleRoutes from './article.routes.js';
import categoryRoutes from './category.routes.js';
import networkRoutes from './network.routes.js';
import notificationRoutes from './notification.routes.js';
import importRoutes from './import.routes.js';

const router = Router();

router.use('/articles', articleRoutes);
router.use('/categories', categoryRoutes);
router.use('/networks', networkRoutes);
router.use('/notifications', notificationRoutes);
router.use('/import', importRoutes);

export default router;
