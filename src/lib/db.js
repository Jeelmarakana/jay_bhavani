import fs from 'fs/promises';
import path from 'path';

const seedPath = path.join(process.cwd(), 'src', 'data', 'database.json');
const writableDir = path.join(process.cwd(), '.data');
const dbPath = path.join(writableDir, 'database.json');

let seedPromise = null;

async function ensureWritableDb() {
  if (seedPromise) return seedPromise;

  seedPromise = (async () => {
    await fs.mkdir(writableDir, { recursive: true });

    try {
      await fs.access(dbPath);
    } catch {
      const seed = await fs.readFile(seedPath, 'utf-8');
      await fs.writeFile(dbPath, seed, 'utf-8');
    }
  })();

  return seedPromise;
}

async function readDb() {
  await ensureWritableDb();

  try {
    const data = await fs.readFile(dbPath, 'utf-8');
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed.inquiries)) parsed.inquiries = [];
    if (!Array.isArray(parsed.products)) parsed.products = [];
    if (!parsed.rates) {
      parsed.rates = { gold24k: 7200, gold22k: 6600, gold18k: 5400, silver: 85 };
    }
    return parsed;
  } catch (error) {
    console.error('Error reading database file, using seed fallback:', error);
    try {
      const seed = await fs.readFile(seedPath, 'utf-8');
      return JSON.parse(seed);
    } catch {
      return {
        products: [],
        inquiries: [],
        rates: { gold24k: 7200, gold22k: 6600, gold18k: 5400, silver: 85 },
      };
    }
  }
}

async function writeDb(data) {
  await ensureWritableDb();

  const tmpPath = `${dbPath}.${Date.now()}.tmp`;

  try {
    await fs.writeFile(tmpPath, JSON.stringify(data, null, 2), 'utf-8');
    await fs.rename(tmpPath, dbPath);
    return true;
  } catch (error) {
    console.error('Error writing to database file:', error);
    try {
      await fs.unlink(tmpPath);
    } catch {
      /* ignore cleanup errors */
    }
    return false;
  }
}

export { readDb, writeDb };

export async function getProducts(filters = {}) {
  const db = await readDb();
  let results = [...db.products];

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
    );
  }

  if (filters.category && filters.category !== 'all') {
    results = results.filter((p) => p.category === filters.category);
  }

  if (filters.metal && filters.metal !== 'all') {
    results = results.filter((p) => p.metal.toLowerCase().includes(filters.metal.toLowerCase()));
  }

  if (filters.purity && filters.purity !== 'all') {
    results = results.filter((p) => p.purity === filters.purity);
  }

  if (filters.featured !== undefined) {
    const isFeatured = filters.featured === 'true' || filters.featured === true;
    results = results.filter((p) => p.featured === isFeatured);
  }

  return results;
}

export async function getProductById(id) {
  const db = await readDb();
  return db.products.find((p) => p.id === id) || null;
}

export async function getGoldRates() {
  const db = await readDb();
  return db.rates;
}

export async function addInquiry(inquiryData) {
  const db = await readDb();

  const newInquiry = {
    id: Date.now().toString(),
    name: inquiryData.name,
    email: inquiryData.email || '',
    phone: inquiryData.phone,
    interestedIn: inquiryData.interestedIn || '',
    productId: inquiryData.productId || null,
    productName: inquiryData.productName || null,
    message: inquiryData.message,
    status: 'Pending',
    createdAt: new Date().toISOString(),
  };

  db.inquiries.unshift(newInquiry);
  const success = await writeDb(db);

  return success ? newInquiry : null;
}

export async function getInquiries() {
  const db = await readDb();
  return db.inquiries;
}
