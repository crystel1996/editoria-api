export interface Article {
    id: string;
    title: string;
    content: string;
    excerpt: string;
    author: string;
    categories: string[]; // IDs des catégories
    network: string; // ID du réseau utilisateur
    status: ArticleStatus;
    featured: boolean;
    publishedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export type ArticleStatus = 'draft' | 'published' | 'archived';

export interface CreateArticleDTO {
    title: string;
    content: string;
    excerpt: string;
    author: string;
    categories: string[];
    network: string;
    status?: ArticleStatus;
    featured?: boolean;
}

export interface UpdateArticleDTO {
    title?: string;
    content?: string;
    excerpt?: string;
    author?: string;
    categories?: string[];
    network?: string;
    status?: ArticleStatus;
    featured?: boolean;
}

export interface ArticleFilters {
    status?: ArticleStatus;
    network?: string;
    category?: string;
    featured?: boolean;
    search?: string;
    page?: number;
    limit?: number;
}
