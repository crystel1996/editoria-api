import { Router } from 'express';
import networkController from '../controllers/network.controller.js';

const router = Router();

router.get('/', (req, res) => networkController.getAll(req, res));
router.get('/:id', (req, res) => networkController.getById(req, res));
router.post('/', (req, res) => networkController.create(req, res));
router.put('/:id', (req, res) => networkController.update(req, res));
router.delete('/:id', (req, res) => networkController.delete(req, res));

export default router;
