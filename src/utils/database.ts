import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, '../../database.sqlite'));

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
    -- Categories table
    CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        slug TEXT NOT NULL UNIQUE,
        description TEXT NOT NULL,
        color TEXT NOT NULL
    );

    -- Networks table
    CREATE TABLE IF NOT EXISTS networks (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL
    );

    -- Articles table
    CREATE TABLE IF NOT EXISTS articles (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        excerpt TEXT NOT NULL,
        author TEXT NOT NULL,
        network TEXT NOT NULL,
        status TEXT NOT NULL CHECK(status IN ('draft', 'published', 'archived')),
        featured INTEGER NOT NULL DEFAULT 0,
        publishedAt TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY (network) REFERENCES networks(id)
    );

    -- Article_Categories junction table (many-to-many)
    CREATE TABLE IF NOT EXISTS article_categories (
        articleId TEXT NOT NULL,
        categoryId TEXT NOT NULL,
        PRIMARY KEY (articleId, categoryId),
        FOREIGN KEY (articleId) REFERENCES articles(id) ON DELETE CASCADE,
        FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE CASCADE
    );

    -- Email notifications table
    CREATE TABLE IF NOT EXISTS email_notifications (
        id TEXT PRIMARY KEY,
        articleId TEXT NOT NULL,
        recipients TEXT NOT NULL, -- JSON array
        subject TEXT NOT NULL,
        sentAt TEXT NOT NULL,
        status TEXT NOT NULL CHECK(status IN ('sent', 'failed')),
        FOREIGN KEY (articleId) REFERENCES articles(id)
    );

    -- Indexes for better query performance
    CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
    CREATE INDEX IF NOT EXISTS idx_articles_network ON articles(network);
    CREATE INDEX IF NOT EXISTS idx_articles_featured ON articles(featured);
    CREATE INDEX IF NOT EXISTS idx_articles_publishedAt ON articles(publishedAt);
    CREATE INDEX IF NOT EXISTS idx_notifications_articleId ON email_notifications(articleId);
`);

console.log('Database initialized successfully');

export default db;
