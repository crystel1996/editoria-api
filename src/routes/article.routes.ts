import { Router } from 'express';
import articleController from '../controllers/article.controller.js';

const router = Router();

router.get('/', (req, res) => articleController.getAll(req, res));
router.get('/:id', (req, res) => articleController.getById(req, res));
router.post('/', (req, res) => articleController.create(req, res));
router.put('/:id', (req, res) => articleController.update(req, res));
router.delete('/:id', (req, res) => articleController.delete(req, res));
router.patch('/:id/status', (req, res) => articleController.updateStatus(req, res));
router.post('/:id/notify', (req, res) => articleController.sendNotification(req, res));

export default router;
