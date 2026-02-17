import type { Request, Response } from 'express';
import articleService from '../services/article.service.js';
import notificationService from '../services/notification.service.js';
import type { CreateArticleDTO, UpdateArticleDTO, ArticleStatus } from '../models/article.model.js';

export class ArticleController {
    async getAll(req: Request, res: Response) {
        try {
            const filters = {
                status: req.query.status as ArticleStatus | undefined,
                network: req.query.network as string | undefined,
                category: req.query.category as string | undefined,
                featured: req.query.featured === 'true' ? true : req.query.featured === 'false' ? false : undefined,
                search: req.query.search as string | undefined,
                page: req.query.page ? parseInt(req.query.page as string) : 1,
                limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
            };

            const result = articleService.findAll(filters);
            res.json(result);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const article = articleService.findById(id);
            
            if (!article) {
                return res.status(404).json({ error: 'Article non trouvé' });
            }

            res.json(article);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const data: CreateArticleDTO = req.body;
            const article = articleService.create(data);
            res.status(201).json(article);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const data: UpdateArticleDTO = req.body;
            const article = articleService.update(id, data);

            if (!article) {
                return res.status(404).json({ error: 'Article non trouvé' });
            }

            res.json(article);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const deleted = articleService.delete(id);

            if (!deleted) {
                return res.status(404).json({ error: 'Article non trouvé' });
            }

            res.status(204).send();
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateStatus(req: Request, res: Response) {
        try {
            const { status } = req.body;

            if (!status || !['draft', 'published', 'archived'].includes(status)) {
                return res.status(400).json({ error: 'Statut invalide' });
            }

            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const article = articleService.updateStatus(id, status as ArticleStatus);

            if (!article) {
                return res.status(404).json({ error: 'Article non trouvé' });
            }

            res.json(article);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async sendNotification(req: Request, res: Response) {
        try {
            const { recipients } = req.body;

            if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
                return res.status(400).json({ error: 'Destinataires manquants ou invalides' });
            }

            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const notification = await notificationService.sendArticleNotification(id, recipients);
            res.status(201).json(notification);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}

export default new ArticleController();
