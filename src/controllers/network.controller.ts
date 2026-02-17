import type { Request, Response } from 'express';
import networkService from '../services/network.service.js';
import type { CreateNetworkDTO, UpdateNetworkDTO } from '../models/network.model.js';

export class NetworkController {
    async getAll(req: Request, res: Response) {
        try {
            const networks = networkService.findAll();
            res.json(networks);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const network = networkService.findById(id);
            
            if (!network) {
                return res.status(404).json({ error: 'Réseau non trouvé' });
            }

            res.json(network);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const data: CreateNetworkDTO = req.body;
            const network = networkService.create(data);
            res.status(201).json(network);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const data: UpdateNetworkDTO = req.body;
            const network = networkService.update(id, data);

            if (!network) {
                return res.status(404).json({ error: 'Réseau non trouvé' });
            }

            res.json(network);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const deleted = networkService.delete(id);

            if (!deleted) {
                return res.status(404).json({ error: 'Réseau non trouvé' });
            }

            res.status(204).send();
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}

export default new NetworkController();
