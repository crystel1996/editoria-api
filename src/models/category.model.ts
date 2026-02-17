export interface Category {
    id: string;
    name: string;
    slug: string;
    description: string;
    color: string; // code couleur hex
}

export interface CreateCategoryDTO {
    name: string;
    description: string;
    color: string;
}

export interface UpdateCategoryDTO {
    name?: string;
    description?: string;
    color?: string;
}
