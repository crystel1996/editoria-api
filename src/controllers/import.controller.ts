import type { Request, Response } from 'express';
import importService from '../services/import.service.js';
import type { CreateArticleDTO } from '../models/article.model.js';

export class ImportController {
    async importArticles(req: Request, res: Response) {
        try {
            const articles: CreateArticleDTO[] = req.body;

            if (!Array.isArray(articles)) {
                return res.status(400).json({ error: 'Le corps de la requête doit être un tableau d\'articles' });
            }

            const result = importService.importArticles(articles);
            res.status(201).json(result);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}

export default new ImportController();
