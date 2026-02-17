import db from '../utils/database.js';
import type { Article, CreateArticleDTO } from '../models/article.model.js';
import articleService from './article.service.js';

export class ImportService {
    importArticles(articles: CreateArticleDTO[]): { success: number; errors: any[] } {
        let success = 0;
        const errors: any[] = [];

        const transaction = db.transaction((articles: CreateArticleDTO[]) => {
            articles.forEach((articleData, index) => {
                try {
                    // Validate required fields
                    if (!articleData.title || !articleData.content || !articleData.excerpt || !articleData.author || !articleData.network) {
                        throw new Error('Champs requis manquants');
                    }

                    articleService.create(articleData);
                    success++;
                } catch (error: any) {
                    errors.push({
                        index,
                        title: articleData.title,
                        error: error.message,
                    });
                }
            });
        });

        transaction(articles);

        return { success, errors };
    }
}

export default new ImportService();
