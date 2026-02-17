export interface EmailNotification {
    id: string;
    articleId: string;
    recipients: string[]; // emails
    subject: string;
    sentAt: Date;
    status: NotificationStatus;
}

export type NotificationStatus = 'sent' | 'failed';

export interface CreateNotificationDTO {
    articleId: string;
    recipients: string[];
    subject: string;
}
