const fs = require('fs');
const path = require('path');

// Configuration
const DOMAIN = 'https://bluewavesplumbing.com';
const currentDate = new Date().toISOString().split('T')[0];

// Main categories based on your home page
const categories = [
  'PPR pipes & fittings',
  'GI pipes & fittings',
  'HDPE pipes & fittings',
  'gutters & accessories',
  'toilets & accessories',
  'waste pipes & Fittings',
  'general plumbing Items'
];

// Location-based keywords for local SEO
const locations = ['rongai', 'nairobi', 'kenya'];

// Product keywords for better search coverage
const productKeywords = [
  'ppr pipes',
  'gi pipes',
  'hdpe pipes',
  'gutters',
  'toilets',
  'waste pipes',
  'plumbing accessories',
  'pipe fittings',
  'bathroom accessories',
  'plumbing materials'
];

function generateSitemap() {
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  
  <!-- Homepage -->
  <url>
    <loc>${DOMAIN}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- Main Pages -->
  <url>
    <loc>${DOMAIN}/home</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  
  <url>
    <loc>${DOMAIN}/about</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <url>
    <loc>${DOMAIN}/contact</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
`;

  // Add category pages
  categories.forEach(category => {
    const encodedCategory = encodeURIComponent(category);
    sitemap += `  
  <url>
    <loc>${DOMAIN}/category/${encodedCategory}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
  });

  // Add location-based search pages for local SEO
  locations.forEach(location => {
    sitemap += `  
  <url>
    <loc>${DOMAIN}/?location=${location}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  });

  // Add product search pages for better keyword coverage
  productKeywords.forEach(keyword => {
    const encodedKeyword = encodeURIComponent(keyword);
    sitemap += `  
  <url>
    <loc>${DOMAIN}/?search=${encodedKeyword}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
  });

  sitemap += `
</urlset>`;

  return sitemap;
}

// Generate and save sitemap
const sitemapContent = generateSitemap();
const publicDir = path.join(__dirname, 'client', 'public');
const sitemapPath = path.join(publicDir, 'sitemap.xml');

try {
  fs.writeFileSync(sitemapPath, sitemapContent, 'utf8');
  console.log('✅ Sitemap generated successfully at:', sitemapPath);
  console.log('📊 Total URLs:', sitemapContent.split('<url>').length - 1);
  console.log('🌐 Domain:', DOMAIN);
  console.log('📅 Last modified:', currentDate);
} catch (error) {
  console.error('❌ Error generating sitemap:', error);
}

module.exports = { generateSitemap };