import fs from 'fs/promises';
import path from 'path';

const dbPath = path.join(process.cwd(), 'src', 'data', 'database.json');

// Helper to read database
export async function readDb() {
  try {
    const data = await fs.readFile(dbPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database file, returning fallback:', error);
    return { products: [], inquiries: [], rates: { gold24k: 7200, gold22k: 6600, gold18k: 5400, silver: 85 } };
  }
}

// Helper to write database
export async function writeDb(data) {
  try {
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing to database file:', error);
    return false;
  }
}

// Get all products with filters
export async function getProducts(filters = {}) {
  const db = await readDb();
  let results = [...db.products];

  // Search filter
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    results = results.filter(
      p => p.name.toLowerCase().includes(searchLower) || 
           p.description.toLowerCase().includes(searchLower)
    );
  }

  // Category filter
  if (filters.category && filters.category !== 'all') {
    results = results.filter(p => p.category === filters.category);
  }

  // Metal filter
  if (filters.metal && filters.metal !== 'all') {
    results = results.filter(p => p.metal.toLowerCase().includes(filters.metal.toLowerCase()));
  }

  // Purity filter
  if (filters.purity && filters.purity !== 'all') {
    results = results.filter(p => p.purity === filters.purity);
  }

  // Featured filter
  if (filters.featured !== undefined) {
    const isFeatured = filters.featured === 'true' || filters.featured === true;
    results = results.filter(p => p.featured === isFeatured);
  }

  return results;
}

// Get a single product by ID
export async function getProductById(id) {
  const db = await readDb();
  return db.products.find(p => p.id === id) || null;
}

// Get current live gold/silver rates
export async function getGoldRates() {
  const db = await readDb();
  return db.rates;
}

// Save customer inquiry
export async function addInquiry(inquiryData) {
  const db = await readDb();
  
  const newInquiry = {
    id: Date.now().toString(),
    name: inquiryData.name,
    email: inquiryData.email || '',
    phone: inquiryData.phone,
    productId: inquiryData.productId || null,
    productName: inquiryData.productName || null,
    message: inquiryData.message,
    status: 'Pending',
    createdAt: new Date().toISOString()
  };

  db.inquiries.unshift(newInquiry); // Add to the top
  const success = await writeDb(db);
  
  return success ? newInquiry : null;
}

// Get all inquiries (for Admin Dashboard)
export async function getInquiries() {
  const db = await readDb();
  return db.inquiries;
}
