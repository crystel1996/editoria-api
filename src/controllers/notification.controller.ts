import type { Request, Response } from 'express';
import notificationService from '../services/notification.service.js';

export class NotificationController {
    async getAll(req: Request, res: Response) {
        try {
            const notifications = notificationService.findAll();
            res.json(notifications);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const notification = notificationService.findById(id);
            
            if (!notification) {
                return res.status(404).json({ error: 'Notification non trouvée' });
            }

            res.json(notification);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default new NotificationController();
