import type { Request, Response } from 'express';
import categoryService from '../services/category.service.js';
import type { CreateCategoryDTO, UpdateCategoryDTO } from '../models/category.model.js';

export class CategoryController {
    async getAll(req: Request, res: Response) {
        try {
            const categories = categoryService.findAll();
            res.json(categories);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const category = categoryService.findById(id);
            
            if (!category) {
                return res.status(404).json({ error: 'Catégorie non trouvée' });
            }

            res.json(category);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const data: CreateCategoryDTO = req.body;
            const category = categoryService.create(data);
            res.status(201).json(category);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const data: UpdateCategoryDTO = req.body;
            const category = categoryService.update(id, data);

            if (!category) {
                return res.status(404).json({ error: 'Catégorie non trouvée' });
            }

            res.json(category);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const deleted = categoryService.delete(id);

            if (!deleted) {
                return res.status(404).json({ error: 'Catégorie non trouvée' });
            }

            res.status(204).send();
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}

export default new CategoryController();
