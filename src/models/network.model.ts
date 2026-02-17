export interface Network {
    id: string;
    name: string;
    description: string;
}

export interface CreateNetworkDTO {
    name: string;
    description: string;
}

export interface UpdateNetworkDTO {
    name?: string;
    description?: string;
}
