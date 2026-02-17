import db from '../utils/database.js';
import { generateId } from '../utils/generateId.js';
import { slugify } from '../utils/slugify.js';
import type { Category, CreateCategoryDTO, UpdateCategoryDTO } from '../models/category.model.js';

export class CategoryService {
    findAll(): Category[] {
        return db.prepare('SELECT * FROM categories ORDER BY name').all() as Category[];
    }

    findById(id: string): Category | null {
        return db.prepare('SELECT * FROM categories WHERE id = ?').get(id) as Category | null;
    }

    findBySlug(slug: string): Category | null {
        return db.prepare('SELECT * FROM categories WHERE slug = ?').get(slug) as Category | null;
    }

    create(data: CreateCategoryDTO): Category {
        const id = generateId();
        const slug = slugify(data.name);

        // Check if slug already exists
        const existing = this.findBySlug(slug);
        if (existing) {
            throw new Error('Une catégorie avec ce nom existe déjà');
        }

        db.prepare(`
            INSERT INTO categories (id, name, slug, description, color)
            VALUES (?, ?, ?, ?, ?)
        `).run(id, data.name, slug, data.description, data.color);

        return this.findById(id)!;
    }

    update(id: string, data: UpdateCategoryDTO): Category | null {
        const category = this.findById(id);
        if (!category) return null;

        const updates: string[] = [];
        const params: any[] = [];

        if (data.name !== undefined) {
            const slug = slugify(data.name);
            const existing = this.findBySlug(slug);
            if (existing && existing.id !== id) {
                throw new Error('Une catégorie avec ce nom existe déjà');
            }
            updates.push('name = ?', 'slug = ?');
            params.push(data.name, slug);
        }

        if (data.description !== undefined) {
            updates.push('description = ?');
            params.push(data.description);
        }

        if (data.color !== undefined) {
            updates.push('color = ?');
            params.push(data.color);
        }

        if (updates.length > 0) {
            params.push(id);
            db.prepare(`UPDATE categories SET ${updates.join(', ')} WHERE id = ?`).run(...params);
        }

        return this.findById(id);
    }

    delete(id: string): boolean {
        // Check if category is used by articles
        const count = db.prepare('SELECT COUNT(*) as count FROM article_categories WHERE categoryId = ?').get(id) as { count: number };
        
        if (count.count > 0) {
            throw new Error('Impossible de supprimer une catégorie utilisée par des articles');
        }

        const result = db.prepare('DELETE FROM categories WHERE id = ?').run(id);
        return result.changes > 0;
    }
}

export default new CategoryService();
