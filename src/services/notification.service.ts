import db from '../utils/database.js';
import { generateId } from '../utils/generateId.js';
import type { EmailNotification, CreateNotificationDTO, NotificationStatus } from '../models/notification.model.js';
import articleService from './article.service.js';

export class NotificationService {
    findAll(): EmailNotification[] {
        const notifications = db.prepare('SELECT * FROM email_notifications ORDER BY sentAt DESC').all() as any[];

        return notifications.map((notif) => ({
            ...notif,
            recipients: JSON.parse(notif.recipients),
            sentAt: new Date(notif.sentAt),
        }));
    }

    findById(id: string): EmailNotification | null {
        const notification = db.prepare('SELECT * FROM email_notifications WHERE id = ?').get(id) as any;

        if (!notification) return null;

        return {
            ...notification,
            recipients: JSON.parse(notification.recipients),
            sentAt: new Date(notification.sentAt),
        };
    }

    create(data: CreateNotificationDTO): EmailNotification {
        const id = generateId();
        const sentAt = new Date().toISOString();
        const recipients = JSON.stringify(data.recipients);

        // Simulate email sending (in real app, use nodemailer or similar)
        const status: NotificationStatus = 'sent'; // Or 'failed' based on actual sending

        db.prepare(`
            INSERT INTO email_notifications (id, articleId, recipients, subject, sentAt, status)
            VALUES (?, ?, ?, ?, ?, ?)
        `).run(id, data.articleId, recipients, data.subject, sentAt, status);

        return this.findById(id)!;
    }

    async sendArticleNotification(articleId: string, recipients: string[]): Promise<EmailNotification> {
        const article = articleService.findById(articleId);
        
        if (!article) {
            throw new Error('Article non trouvé');
        }

        const subject = `Nouvel article : ${article.title}`;

        // In a real application, you would send actual emails here
        // using nodemailer or a similar library
        console.log(`Sending notification for article "${article.title}" to ${recipients.length} recipients`);

        return this.create({
            articleId,
            recipients,
            subject,
        });
    }
}

export default new NotificationService();
