const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Configuration
const DOMAIN = 'https://bluewaveplumbing.com';
const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/bluewaveplumbing';
const currentDate = new Date().toISOString().split('T')[0];

// Main categories based on your application
const categories = [
  'PPR pipes & fittings',
  'GI pipes & fittings',
  'HDPE pipes & fittings',
  'gutters & accessories',
  'toilets & accessories',
  'waste pipes & Fittings',
  'general plumbing Items'
];

// Enhanced location-based keywords for comprehensive local SEO
const locations = [
  'rongai', 'nairobi', 'kenya', 'kajiado', 'ngong', 'karen', 
  'langata', 'kibera', 'kawangware', 'dagoretti', 'kikuyu',
  'limuru', 'kiambu', 'ruiru', 'thika', 'machakos', 'kitengela',
  'machakos', 'kitengela', 'athiriver', 'mavoko', 'syokimau', 'mombasa', 'kisumu', 'nakuru', 'eldoret', 'thika', 'garissa',
  'meru', 'nakuru', 'kisii', 'nyeri', 'embu', 'machakos',
  'kitui', 'marsabit', 'turkana', 'wajir', 'mandera', 'samburu', 'isiolo', 'laikipia', 'baringo', 'west pokot', 'East african cities', 'kenyan towns', 'kenyan suburbs'
];

// Expanded product keywords for maximum search coverage
const productKeywords = [
  // Pipes
  'ppr pipes', 'gi pipes', 'hdpe pipes', 'pvc pipes', 'waste pipes',
  'water pipes', 'sewer pipes', 'drainage pipes', 'irrigation pipes',
  // Fittings
  'pipe fittings', 'ppr fittings', 'gi fittings', 'elbow fittings',
  'tee fittings', 'reducer fittings', 'coupling fittings', 'union fittings',
  // Specific products
  'gutters', 'toilets', 'water closets', 'cisterns', 'bidets',
  'sinks', 'basins', 'taps', 'faucets', 'showers', 'mixers',
  // Accessories
  'plumbing accessories', 'bathroom accessories', 'toilet accessories',
  'shower heads', 'towel rails', 'soap dispensers', 'tissue holders',
  // General
  'plumbing materials', 'plumbing supplies', 'plumbing hardware',
  'bathroom fittings', 'sanitary ware', 'water fixtures',
  // Services/Installations
  'plumbing installation', 'pipe fitting services', 'bathroom installation',
  'water connection', 'sewage connection'
];

// Import Item model
const Item = require('./models/Item');

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: "blue_wave_plumbing"
    });
    console.log('✅ Connected to MongoDB (blue_wave_plumbing database)');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

// Generate main sitemap
function generateMainSitemap() {
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

  // Add location-based pages for comprehensive local SEO
  locations.forEach(location => {
    sitemap += `  
  <url>
    <loc>${DOMAIN}/?location=${location}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
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
    <priority>0.6</priority>
  </url>`;
  });

  sitemap += `
</urlset>`;

  return sitemap;
}

// Generate products sitemap from database
async function generateProductsSitemap() {
  try {
    const items = await Item.find({}).select('_id name updatedAt').lean();
    
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
`;

    items.forEach(item => {
      const lastmod = item.updatedAt 
        ? new Date(item.updatedAt).toISOString().split('T')[0] 
        : currentDate;
      
      sitemap += `
  <url>
    <loc>${DOMAIN}/items/${item._id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
    });

    sitemap += `
</urlset>`;

    console.log(`✅ Generated products sitemap with ${items.length} items`);
    return sitemap;
  } catch (error) {
    console.error('❌ Error generating products sitemap:', error);
    return null;
  }
}

// Generate images sitemap from database
async function generateImagesSitemap() {
  try {
    const items = await Item.find({}).select('_id name images').lean();
    
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

    items.forEach(item => {
      if (item.images && item.images.length > 0) {
        sitemap += `
  <url>
    <loc>${DOMAIN}/items/${item._id}</loc>`;
        
        item.images.forEach(imageUrl => {
          sitemap += `
    <image:image>
      <image:loc>${imageUrl}</image:loc>
      <image:title>${item.name}</image:title>
      <image:caption>${item.name} - Bluewave Plumbers Rongai Kenya</image:caption>
    </image:image>`;
        });
        
        sitemap += `
  </url>`;
      }
    });

    sitemap += `
</urlset>`;

    const imageCount = items.reduce((sum, item) => sum + (item.images?.length || 0), 0);
    console.log(`✅ Generated images sitemap with ${imageCount} images from ${items.length} products`);
    return sitemap;
  } catch (error) {
    console.error('❌ Error generating images sitemap:', error);
    return null;
  }
}

// Generate sitemap index
function generateSitemapIndex() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${DOMAIN}/sitemap.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${DOMAIN}/products-sitemap.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${DOMAIN}/images-sitemap.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
</sitemapindex>`;
}

// Main execution
async function generateAllSitemaps() {
  try {
    console.log('🚀 Starting comprehensive sitemap generation...\n');
    
    // Connect to database
    await connectDB();
    
    const publicDir = path.join(__dirname, '..', 'client', 'public');
    
    // Generate main sitemap
    console.log('📄 Generating main sitemap...');
    const mainSitemap = generateMainSitemap();
    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), mainSitemap, 'utf8');
    const mainUrls = mainSitemap.split('<url>').length - 1;
    console.log(`✅ Main sitemap saved with ${mainUrls} URLs\n`);
    
    // Generate products sitemap
    console.log('📦 Generating products sitemap...');
    const productsSitemap = await generateProductsSitemap();
    if (productsSitemap) {
      fs.writeFileSync(path.join(publicDir, 'products-sitemap.xml'), productsSitemap, 'utf8');
      const productUrls = productsSitemap.split('<url>').length - 1;
      console.log(`✅ Products sitemap saved with ${productUrls} URLs\n`);
    }
    
    // Generate images sitemap
    console.log('🖼️  Generating images sitemap...');
    const imagesSitemap = await generateImagesSitemap();
    if (imagesSitemap) {
      fs.writeFileSync(path.join(publicDir, 'images-sitemap.xml'), imagesSitemap, 'utf8');
      console.log(`✅ Images sitemap saved\n`);
    }
    
    // Generate sitemap index
    console.log('📑 Generating sitemap index...');
    const sitemapIndex = generateSitemapIndex();
    fs.writeFileSync(path.join(publicDir, 'sitemap-index.xml'), sitemapIndex, 'utf8');
    console.log('✅ Sitemap index saved\n');
    
    // Summary
    console.log('═══════════════════════════════════════');
    console.log('✨ SITEMAP GENERATION COMPLETE ✨');
    console.log('═══════════════════════════════════════');
    console.log(`📊 Main sitemap: ${mainUrls} URLs`);
    console.log(`📦 Products sitemap: ${productsSitemap ? productsSitemap.split('<url>').length - 1 : 0} URLs`);
    console.log(`🖼️  Images sitemap: Generated`);
    console.log(`📑 Sitemap index: Created`);
    console.log(`🌐 Domain: ${DOMAIN}`);
    console.log(`📅 Date: ${currentDate}`);
    console.log('═══════════════════════════════════════\n');
    
    // Close database connection
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    
  } catch (error) {
    console.error('❌ Error during sitemap generation:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  generateAllSitemaps();
}

module.exports = { 
  generateMainSitemap, 
  generateProductsSitemap,
  generateImagesSitemap,
  generateSitemapIndex,
  generateAllSitemaps 
};
