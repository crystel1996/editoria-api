import { Router } from 'express';
import notificationController from '../controllers/notification.controller.js';

const router = Router();

router.get('/', (req, res) => notificationController.getAll(req, res));
router.get('/:id', (req, res) => notificationController.getById(req, res));

export default router;
