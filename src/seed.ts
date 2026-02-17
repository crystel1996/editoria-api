import db from './utils/database.js';
import categoryService from './services/category.service.js';
import networkService from './services/network.service.js';
import articleService from './services/article.service.js';

// Clear existing data
db.exec(`
    DELETE FROM article_categories;
    DELETE FROM email_notifications;
    DELETE FROM articles;
    DELETE FROM categories;
    DELETE FROM networks;
`);

console.log('Seeding database...');

// Create categories
const categories = [
    categoryService.create({ name: 'Technologie', description: 'Articles sur la technologie', color: '#2196F3' }),
    categoryService.create({ name: 'Business', description: 'Articles sur le business', color: '#FF9800' }),
    categoryService.create({ name: 'Science', description: 'Articles scientifiques', color: '#009688' }),
    categoryService.create({ name: 'Culture', description: 'Articles culturels', color: '#9C27B0' }),
    categoryService.create({ name: 'Politique', description: 'Articles politiques', color: '#F44336' }),
    categoryService.create({ name: 'Sport', description: 'Articles sportifs', color: '#00BCD4' }),
];

console.log(`Created ${categories.length} categories`);

// Create networks
const networks = [
    networkService.create({ name: 'Réseau Principal', description: 'Réseau principal de diffusion' }),
    networkService.create({ name: 'Réseau Partenaires', description: 'Réseau des partenaires' }),
    networkService.create({ name: 'Réseau Interne', description: 'Réseau interne de l\'entreprise' }),
];

console.log(`Created ${networks.length} networks`);

// Create articles
const articles = [
    articleService.create({
        title: 'L\'intelligence artificielle révolutionne le secteur médical',
        content: 'L\'intelligence artificielle (IA) transforme profondément le secteur médical en permettant des diagnostics plus rapides et plus précis. Les algorithmes de machine learning analysent des millions de données médicales pour détecter des patterns invisibles à l\'œil humain. Cette révolution technologique améliore significativement la qualité des soins et réduit les erreurs médicales.',
        excerpt: 'L\'IA transforme le secteur médical avec des diagnostics plus rapides et précis.',
        author: 'Marie Dupont',
        categories: [categories[0].id, categories[2].id],
        network: networks[0].id,
        status: 'published',
        featured: true,
    }),
    articleService.create({
        title: 'Le festival de Cannes 2025 : les films à ne pas manquer',
        content: 'Le 78e Festival de Cannes s\'annonce exceptionnel avec une sélection officielle de films internationaux de haute qualité. Les réalisateurs les plus prestigieux présenteront leurs dernières créations sur la Croisette. Entre drames intimistes et fresques épiques, la compétition s\'annonce particulièrement relevée cette année.',
        excerpt: 'Découvrez la sélection exceptionnelle du Festival de Cannes 2025.',
        author: 'Pierre Moreau',
        categories: [categories[3].id],
        network: networks[0].id,
        status: 'published',
        featured: false,
    }),
    articleService.create({
        title: 'Les marchés financiers en pleine mutation',
        content: 'Les marchés financiers connaissent actuellement une transformation majeure. L\'émergence des cryptomonnaies, la digitalisation des services bancaires et l\'évolution des réglementations internationales redessinent le paysage économique mondial. Les investisseurs doivent s\'adapter à ces nouvelles réalités pour optimiser leurs stratégies.',
        excerpt: 'Les marchés financiers se transforment avec les nouvelles technologies.',
        author: 'Jean Martin',
        categories: [categories[1].id, categories[0].id],
        network: networks[1].id,
        status: 'published',
        featured: false,
    }),
    articleService.create({
        title: 'La Ligue des Champions : analyse des quarts de finale',
        content: 'Les quarts de finale de la Ligue des Champions promettent des matchs spectaculaires. Les meilleures équipes européennes s\'affrontent dans une compétition acharnée pour décrocher le titre suprême. Les tactiques, les joueurs clés et les enjeux de chaque rencontre sont analysés en profondeur.',
        excerpt: 'Analyse détaillée des quarts de finale de la Ligue des Champions.',
        author: 'Thomas Bernard',
        categories: [categories[5].id],
        network: networks[0].id,
        status: 'published',
        featured: true,
    }),
    articleService.create({
        title: 'Les énergies renouvelables : enjeux et perspectives',
        content: 'Le développement des énergies renouvelables est crucial pour l\'avenir de notre planète. L\'éolien, le solaire et l\'hydraulique progressent rapidement grâce aux innovations technologiques et aux investissements massifs. Cet article explore les défis et opportunités de la transition énergétique mondiale.',
        excerpt: 'Les énergies renouvelables au cœur de la transition écologique.',
        author: 'Sophie Laurent',
        categories: [categories[2].id, categories[0].id],
        network: networks[0].id,
        status: 'draft',
        featured: false,
    }),
    articleService.create({
        title: 'Les nouvelles tendances du e-commerce en 2025',
        content: 'Le commerce électronique continue d\'évoluer avec l\'intégration de l\'intelligence artificielle, la réalité augmentée et des expériences d\'achat personnalisées. Les entreprises qui s\'adaptent à ces nouvelles tendances gagnent des parts de marché significatives.',
        excerpt: 'Découvrez les tendances qui transforment le e-commerce en 2025.',
        author: 'Marc Dubois',
        categories: [categories[1].id, categories[0].id],
        network: networks[1].id,
        status: 'draft',
        featured: false,
    }),
    articleService.create({
        title: 'Les élections européennes : tour d\'horizon',
        content: 'À l\'approche des élections européennes, cet article analyse les principaux enjeux politiques, les programmes des différents partis et les attentes des citoyens. L\'avenir de l\'Union européenne se dessine à travers les débats actuels.',
        excerpt: 'Analyse complète des enjeux des élections européennes.',
        author: 'Claire Rousseau',
        categories: [categories[4].id],
        network: networks[2].id,
        status: 'archived',
        featured: false,
    }),
];

console.log(`Created ${articles.length} articles`);
console.log('Database seeded successfully!');
console.log('\nYou can now start the server with: npm run dev');
