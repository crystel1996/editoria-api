import db from '../utils/database.js';
import { generateId } from '../utils/generateId.js';
import type { Network, CreateNetworkDTO, UpdateNetworkDTO } from '../models/network.model.js';

export class NetworkService {
    findAll(): Network[] {
        return db.prepare('SELECT * FROM networks ORDER BY name').all() as Network[];
    }

    findById(id: string): Network | null {
        return db.prepare('SELECT * FROM networks WHERE id = ?').get(id) as Network | null;
    }

    create(data: CreateNetworkDTO): Network {
        const id = generateId();

        db.prepare(`
            INSERT INTO networks (id, name, description)
            VALUES (?, ?, ?)
        `).run(id, data.name, data.description);

        return this.findById(id)!;
    }

    update(id: string, data: UpdateNetworkDTO): Network | null {
        const network = this.findById(id);
        if (!network) return null;

        const updates: string[] = [];
        const params: any[] = [];

        if (data.name !== undefined) {
            updates.push('name = ?');
            params.push(data.name);
        }

        if (data.description !== undefined) {
            updates.push('description = ?');
            params.push(data.description);
        }

        if (updates.length > 0) {
            params.push(id);
            db.prepare(`UPDATE networks SET ${updates.join(', ')} WHERE id = ?`).run(...params);
        }

        return this.findById(id);
    }

    delete(id: string): boolean {
        // Check if network is used by articles
        const count = db.prepare('SELECT COUNT(*) as count FROM articles WHERE network = ?').get(id) as { count: number };
        
        if (count.count > 0) {
            throw new Error('Impossible de supprimer un réseau utilisé par des articles');
        }

        const result = db.prepare('DELETE FROM networks WHERE id = ?').run(id);
        return result.changes > 0;
    }
}

export default new NetworkService();
