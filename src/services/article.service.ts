import db from '../utils/database.js';
import { generateId } from '../utils/generateId.js';
import type { Article, CreateArticleDTO, UpdateArticleDTO, ArticleFilters, ArticleStatus } from '../models/article.model.js';

export class ArticleService {
    findAll(filters: ArticleFilters = {}) {
        const { status, network, category, featured, search, page = 1, limit = 10 } = filters;
        const offset = (page - 1) * limit;

        let query = `
            SELECT DISTINCT a.*
            FROM articles a
            LEFT JOIN article_categories ac ON a.id = ac.articleId
            WHERE 1=1
        `;
        const params: any[] = [];

        if (status) {
            query += ` AND a.status = ?`;
            params.push(status);
        }

        if (network) {
            query += ` AND a.network = ?`;
            params.push(network);
        }

        if (category) {
            query += ` AND ac.categoryId = ?`;
            params.push(category);
        }

        if (featured !== undefined) {
            query += ` AND a.featured = ?`;
            params.push(featured ? 1 : 0);
        }

        if (search) {
            query += ` AND (a.title LIKE ? OR a.content LIKE ? OR a.excerpt LIKE ?)`;
            const searchTerm = `%${search}%`;
            params.push(searchTerm, searchTerm, searchTerm);
        }

        query += ` ORDER BY a.createdAt DESC LIMIT ? OFFSET ?`;
        params.push(limit, offset);

        const articles = db.prepare(query).all(...params) as any[];

        // Get categories for each article
        const articlesWithCategories = articles.map((article) => {
            const categories = db
                .prepare('SELECT categoryId FROM article_categories WHERE articleId = ?')
                .all(article.id)
                .map((row: any) => row.categoryId);

            return {
                ...article,
                categories,
                featured: Boolean(article.featured),
                publishedAt: article.publishedAt ? new Date(article.publishedAt) : null,
                createdAt: new Date(article.createdAt),
                updatedAt: new Date(article.updatedAt),
            };
        });

        // Get total count
        let countQuery = `
            SELECT COUNT(DISTINCT a.id) as count
            FROM articles a
            LEFT JOIN article_categories ac ON a.id = ac.articleId
            WHERE 1=1
        `;
        const countParams: any[] = [];

        if (status) {
            countQuery += ` AND a.status = ?`;
            countParams.push(status);
        }
        if (network) {
            countQuery += ` AND a.network = ?`;
            countParams.push(network);
        }
        if (category) {
            countQuery += ` AND ac.categoryId = ?`;
            countParams.push(category);
        }
        if (featured !== undefined) {
            countQuery += ` AND a.featured = ?`;
            countParams.push(featured ? 1 : 0);
        }
        if (search) {
            countQuery += ` AND (a.title LIKE ? OR a.content LIKE ? OR a.excerpt LIKE ?)`;
            const searchTerm = `%${search}%`;
            countParams.push(searchTerm, searchTerm, searchTerm);
        }

        const { count } = db.prepare(countQuery).get(...countParams) as { count: number };

        return {
            data: articlesWithCategories,
            pagination: {
                page,
                limit,
                total: count,
                totalPages: Math.ceil(count / limit),
            },
        };
    }

    findById(id: string): Article | null {
        const article = db.prepare('SELECT * FROM articles WHERE id = ?').get(id) as any;

        if (!article) return null;

        const categories = db
            .prepare('SELECT categoryId FROM article_categories WHERE articleId = ?')
            .all(id)
            .map((row: any) => row.categoryId);

        return {
            ...article,
            categories,
            featured: Boolean(article.featured),
            publishedAt: article.publishedAt ? new Date(article.publishedAt) : null,
            createdAt: new Date(article.createdAt),
            updatedAt: new Date(article.updatedAt),
        };
    }

    create(data: CreateArticleDTO): Article {
        const id = generateId();
        const now = new Date().toISOString();
        const status = data.status || 'draft';
        const featured = data.featured ? 1 : 0;

        db.prepare(`
            INSERT INTO articles (id, title, content, excerpt, author, network, status, featured, publishedAt, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(id, data.title, data.content, data.excerpt, data.author, data.network, status, featured, null, now, now);

        // Insert categories
        if (data.categories && data.categories.length > 0) {
            const insertCategory = db.prepare('INSERT INTO article_categories (articleId, categoryId) VALUES (?, ?)');
            for (const categoryId of data.categories) {
                insertCategory.run(id, categoryId);
            }
        }

        return this.findById(id)!;
    }

    update(id: string, data: UpdateArticleDTO): Article | null {
        const article = this.findById(id);
        if (!article) return null;

        const updates: string[] = [];
        const params: any[] = [];

        if (data.title !== undefined) {
            updates.push('title = ?');
            params.push(data.title);
        }
        if (data.content !== undefined) {
            updates.push('content = ?');
            params.push(data.content);
        }
        if (data.excerpt !== undefined) {
            updates.push('excerpt = ?');
            params.push(data.excerpt);
        }
        if (data.author !== undefined) {
            updates.push('author = ?');
            params.push(data.author);
        }
        if (data.network !== undefined) {
            updates.push('network = ?');
            params.push(data.network);
        }
        if (data.status !== undefined) {
            updates.push('status = ?');
            params.push(data.status);
            
            // Set publishedAt when status changes to published
            if (data.status === 'published' && article.status !== 'published') {
                updates.push('publishedAt = ?');
                params.push(new Date().toISOString());
            }
        }
        if (data.featured !== undefined) {
            updates.push('featured = ?');
            params.push(data.featured ? 1 : 0);
        }

        updates.push('updatedAt = ?');
        params.push(new Date().toISOString());

        params.push(id);

        if (updates.length > 0) {
            db.prepare(`UPDATE articles SET ${updates.join(', ')} WHERE id = ?`).run(...params);
        }

        // Update categories if provided
        if (data.categories !== undefined) {
            db.prepare('DELETE FROM article_categories WHERE articleId = ?').run(id);
            if (data.categories.length > 0) {
                const insertCategory = db.prepare('INSERT INTO article_categories (articleId, categoryId) VALUES (?, ?)');
                for (const categoryId of data.categories) {
                    insertCategory.run(id, categoryId);
                }
            }
        }

        return this.findById(id);
    }

    delete(id: string): boolean {
        const result = db.prepare('DELETE FROM articles WHERE id = ?').run(id);
        return result.changes > 0;
    }

    updateStatus(id: string, status: ArticleStatus): Article | null {
        const article = this.findById(id);
        if (!article) return null;

        const updates = ['status = ?', 'updatedAt = ?'];
        const params = [status, new Date().toISOString()];

        // Set publishedAt when status changes to published
        if (status === 'published' && article.status !== 'published') {
            updates.push('publishedAt = ?');
            params.push(new Date().toISOString());
        }

        params.push(id);

        db.prepare(`UPDATE articles SET ${updates.join(', ')} WHERE id = ?`).run(...params);

        return this.findById(id);
    }
}

export default new ArticleService();
