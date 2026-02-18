import type { Request, Response } from 'express';
import importService from '../services/import.service.js';

interface ImportArticleData {
    title: string;
    content: string;
    excerpt: string;
    author: string;
    categories?: string[];
    category?: string;
    network: string;
    status?: string;
    featured?: boolean;
}

export class ImportController {
    async importArticles(req: Request, res: Response) {
        try {
            const articles: ImportArticleData[] = req.body;

            if (!Array.isArray(articles)) {
                return res.status(400).json({ error: 'Le corps de la requête doit être un tableau d\'articles' });
            }

            if (articles.length === 0) {
                return res.status(400).json({ error: 'Le tableau d\'articles ne peut pas être vide' });
            }

            const result = importService.importArticles(articles);
            res.status(201).json(result);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}

export default new ImportController();
