import type { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    console.error('Error:', err);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Erreur interne du serveur';

    res.status(statusCode).json({
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
}
