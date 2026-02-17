import { Router } from 'express';
import importController from '../controllers/import.controller.js';

const router = Router();

router.post('/articles', (req, res) => importController.importArticles(req, res));

export default router;
