import db from '../utils/database.js';
import type { Article, CreateArticleDTO, ArticleStatus } from '../models/article.model.js';
import articleService from './article.service.js';
import categoryService from './category.service.js';
import networkService from './network.service.js';
import { slugify } from '../utils/slugify.js';

interface ImportArticleData {
    title: string;
    content: string;
    excerpt: string;
    author: string;
    categories?: string[]; // Peut être des noms ou des IDs
    category?: string; // Support du singular aussi
    network: string; // Nom du réseau
    status?: string;
    featured?: boolean;
}

const VALID_STATUSES: ArticleStatus[] = ['draft', 'published', 'archived'];

export class ImportService {
    private resolveCategories(categoryInput: string[] | string | undefined): string[] {
        if (!categoryInput) return [];
        
        const categoryNames = Array.isArray(categoryInput) ? categoryInput : [categoryInput];
        const categoryIds: string[] = [];

        for (const categoryName of categoryNames) {
            try {
                // Try to find by slug
                const slug = slugify(categoryName);
                let category = categoryService.findBySlug(slug);

                // If not found, create it
                if (!category) {
                    category = categoryService.create({
                        name: categoryName,
                        description: `Catégorie importée: ${categoryName}`,
                        color: '#3B82F6', // Default blue color
                    });
                }

                categoryIds.push(category.id);
            } catch (error: any) {
                throw new Error(`Erreur de catégorie "${categoryName}": ${error.message}`);
            }
        }

        return categoryIds;
    }

    private resolveNetwork(networkName: string): string {
        try {
            // Try to find by name
            let network = networkService.findByName(networkName);

            // If not found, create it
            if (!network) {
                network = networkService.create({
                    name: networkName,
                    description: `Réseau importé: ${networkName}`,
                });
            }

            return network.id;
        } catch (error: any) {
            throw new Error(`Erreur de réseau "${networkName}": ${error.message}`);
        }
    }

    private validateStatus(status: string | undefined): ArticleStatus {
        if (!status) return 'draft';

        const normalizedStatus = status.toLowerCase() as ArticleStatus;

        if (!VALID_STATUSES.includes(normalizedStatus)) {
            throw new Error(`Statut invalide "${status}". Valeurs acceptées: ${VALID_STATUSES.join(', ')}`);
        }

        return normalizedStatus;
    }

    importArticles(articles: ImportArticleData[]): { success: number; errors: any[] } {
        let success = 0;
        const errors: any[] = [];

        const transaction = db.transaction((articles: ImportArticleData[]) => {
            articles.forEach((articleData, index) => {
                try {
                    // Validate required fields
                    if (!articleData.title || !articleData.content || !articleData.excerpt || !articleData.author || !articleData.network) {
                        throw new Error('Champs requis manquants (title, content, excerpt, author, network)');
                    }

                    // Resolve categories (support both 'categories' and 'category')
                    const categoryInput = articleData.categories || articleData.category;
                    const resolvedCategories = this.resolveCategories(categoryInput);

                    // Resolve network
                    const resolvedNetworkId = this.resolveNetwork(articleData.network);

                    // Validate and normalize status
                    const validatedStatus = this.validateStatus(articleData.status);

                    // Prepare article data for creation
                    const articleToCreate: CreateArticleDTO = {
                        title: articleData.title,
                        content: articleData.content,
                        excerpt: articleData.excerpt,
                        author: articleData.author,
                        categories: resolvedCategories,
                        network: resolvedNetworkId,
                        status: validatedStatus,
                        featured: articleData.featured || false,
                    };

                    articleService.create(articleToCreate);
                    success++;
                } catch (error: any) {
                    errors.push({
                        index,
                        title: articleData.title || 'Sans titre',
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
