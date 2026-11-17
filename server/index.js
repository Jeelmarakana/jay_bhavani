import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import cookieParser from 'cookie-parser';
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE,
  createAdminSessionToken,
  hasAdminConfiguration,
  isValidAdminSession,
  verifyAdminCredentials,
} from '../src/lib/admin-auth.js';
import {
  addInquiry,
  getInquiries,
  updateInquiryStatus,
  getProductById,
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from '../src/lib/db.js';
import { pushOwnerWhatsAppNotification } from '../src/lib/whatsapp.js';

const app = express();
const port = Number(process.env.PORT || 3001);
const currentDir = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(currentDir, '../dist/jay-bhavani/browser');
const uploadsDir = path.resolve(currentDir, '../public/uploads');

// Ensure uploads directory exists on startup
await fs.mkdir(uploadsDir, { recursive: true }).catch(() => {});

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(cookieParser());

// Serve uploaded product images
app.use('/uploads', express.static(uploadsDir));

app.get('/api/products', async (request, response, next) => {
  try {
    const { search, category, metal, purity, featured } = request.query;
    const textFilter = (value) => (typeof value === 'string' ? value : undefined);
    const products = await getProducts({
      search: textFilter(search),
      category: textFilter(category),
      metal: textFilter(metal),
      purity: textFilter(purity),
      featured: textFilter(featured) || undefined,
    });
    response.json({ success: true, products });
  } catch (error) {
    next(error);
  }
});

app.get('/api/products/:id', async (request, response, next) => {
  try {
    const product = await getProductById(request.params.id);
    if (!product) {
      response.status(404).json({ success: false, error: 'Product not found' });
      return;
    }
    response.json({ success: true, product });
  } catch (error) {
    next(error);
  }
});

app.get('/api/gold-rate', async (_request, response, next) => {
  try {
    const shift = (max) => (Math.random() - 0.5) * max;
    response.json({
      success: true,
      rates: {
        gold24k: Math.round(7250 + shift(30)),
        gold22k: Math.round(6650 + shift(25)),
        gold18k: Math.round(5440 + shift(20)),
        silver: Math.round((88 + shift(1.5)) * 10) / 10,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
});

app.post('/api/inquiries', async (request, response, next) => {
  try {
    const {
      name = request.body?.clientName,
      phone,
      email = '',
      productId = null,
      productName = null,
      interestedIn = '',
      message,
    } = request.body ?? {};

    const cleanName = (typeof name === 'string' ? name : '').trim();
    const cleanPhone = (typeof phone === 'string' ? phone : '').trim();
    const cleanMessage = (typeof message === 'string' ? message : '').trim();

    if (!cleanName || !cleanPhone || !cleanMessage) {
      response.status(400).json({
        success: false,
        error: 'Name, Phone number, and Message are required.',
      });
      return;
    }

    const inquiry = await addInquiry({
      name: cleanName,
      email: (typeof email === 'string' ? email : '').trim(),
      phone: cleanPhone,
      productId: productId ? String(productId) : null,
      productName: productName ? String(productName) : null,
      interestedIn: interestedIn ? String(interestedIn) : '',
      message: cleanMessage,
    });

    if (!inquiry) {
      response.status(500).json({
        success: false,
        error: 'Unable to save your enquiry. Please try again.',
      });
      return;
    }

    const notification = await pushOwnerWhatsAppNotification(inquiry);
    response.status(201).json({ success: true, inquiry, notification });
  } catch (error) {
    next(error);
  }
});

app.get('/api/admin/session', (request, response) => {
  response.json({ authenticated: isValidAdminSession(request.cookies[ADMIN_SESSION_COOKIE]) });
});

app.post('/api/admin/session', (request, response) => {
  if (!hasAdminConfiguration()) {
    response.status(503).json({
      success: false,
      error: 'Admin login is not configured on the server.',
    });
    return;
  }

  const username = typeof request.body?.username === 'string' ? request.body.username : '';
  const password = typeof request.body?.password === 'string' ? request.body.password : '';
  if (!verifyAdminCredentials(username, password)) {
    response.status(401).json({ success: false, error: 'Invalid admin username or password.' });
    return;
  }

  response.cookie(ADMIN_SESSION_COOKIE, createAdminSessionToken(), {
    httpOnly: true,
    maxAge: ADMIN_SESSION_MAX_AGE * 1000,
    path: '/',
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  });
  response.json({ success: true, message: 'Admin login successful.' });
});

app.delete('/api/admin/session', (_request, response) => {
  response.clearCookie(ADMIN_SESSION_COOKIE, {
    httpOnly: true,
    path: '/',
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  });
  response.json({ success: true });
});

app.get('/api/inquiries', async (request, response, next) => {
  if (!isValidAdminSession(request.cookies[ADMIN_SESSION_COOKIE])) {
    response.status(401).json({ success: false, error: 'Unauthorized.' });
    return;
  }

  try {
    response.json({ success: true, inquiries: await getInquiries() });
  } catch (error) {
    next(error);
  }
});

app.patch('/api/inquiries/:id', async (request, response, next) => {
  if (!isValidAdminSession(request.cookies[ADMIN_SESSION_COOKIE])) {
    response.status(401).json({ success: false, error: 'Unauthorized.' });
    return;
  }
  try {
    const { status } = request.body ?? {};
    if (!status) {
      response.status(400).json({ success: false, error: 'Status is required.' });
      return;
    }
    const updated = await updateInquiryStatus(request.params.id, status);
    if (!updated) {
      response.status(404).json({ success: false, error: 'Inquiry not found.' });
      return;
    }
    response.json({ success: true, inquiry: updated });
  } catch (error) {
    next(error);
  }
});

// Admin product image upload
app.post('/api/admin/upload', async (request, response, next) => {
  if (!isValidAdminSession(request.cookies[ADMIN_SESSION_COOKIE])) {
    response.status(401).json({ success: false, error: 'Unauthorized.' });
    return;
  }
  try {
    const { image, filename } = request.body ?? {};
    if (!image || typeof image !== 'string') {
      response.status(400).json({ success: false, error: 'No image data provided.' });
      return;
    }

    const matches = image.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/);
    let buffer;
    let ext = 'jpg';
    if (matches && matches.length === 3) {
      ext = matches[1].toLowerCase();
      if (ext === 'jpeg') ext = 'jpg';
      if (ext === 'svg+xml') ext = 'svg';
      buffer = Buffer.from(matches[2], 'base64');
    } else {
      buffer = Buffer.from(image, 'base64');
    }

    const safeBase = (filename || 'product')
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .replace(/\.[^.]+$/, '');
    const savedFilename = `${Date.now()}-${safeBase}.${ext}`;
    await fs.writeFile(path.join(uploadsDir, savedFilename), buffer);

    response.json({ success: true, url: `/uploads/${savedFilename}` });
  } catch (error) {
    next(error);
  }
});

// Admin product CRUD
app.post('/api/admin/products', async (request, response, next) => {
  if (!isValidAdminSession(request.cookies[ADMIN_SESSION_COOKIE])) {
    response.status(401).json({ success: false, error: 'Unauthorized.' });
    return;
  }
  try {
    const { name, category, categoryName, metal, purity, weight, makingCharges, description, image, featured, occasion } = request.body ?? {};
    if (!name || !category || !metal || !purity || !weight || !description) {
      response.status(400).json({ success: false, error: 'Name, category, metal, purity, weight, and description are required.' });
      return;
    }
    const product = await addProduct({
      name,
      category,
      categoryName: categoryName || category,
      metal,
      purity,
      weight,
      makingCharges: makingCharges || 12,
      description,
      image,
      featured,
      occasion,
    });
    if (!product) {
      response.status(500).json({ success: false, error: 'Failed to save product.' });
      return;
    }
    response.status(201).json({ success: true, product });
  } catch (error) {
    next(error);
  }
});

app.put('/api/admin/products/:id', async (request, response, next) => {
  if (!isValidAdminSession(request.cookies[ADMIN_SESSION_COOKIE])) {
    response.status(401).json({ success: false, error: 'Unauthorized.' });
    return;
  }
  try {
    const updated = await updateProduct(request.params.id, request.body ?? {});
    if (!updated) {
      response.status(404).json({ success: false, error: 'Product not found.' });
      return;
    }
    response.json({ success: true, product: updated });
  } catch (error) {
    next(error);
  }
});

app.delete('/api/admin/products/:id', async (request, response, next) => {
  if (!isValidAdminSession(request.cookies[ADMIN_SESSION_COOKIE])) {
    response.status(401).json({ success: false, error: 'Unauthorized.' });
    return;
  }
  try {
    const success = await deleteProduct(request.params.id);
    if (!success) {
      response.status(404).json({ success: false, error: 'Product not found.' });
      return;
    }
    response.json({ success: true });
  } catch (error) {
    next(error);
  }
});

app.use('/api', (_request, response) => {
  response.status(404).json({ message: 'Not found' });
});

app.use((error, _request, response, _next) => {
  console.error('API request failed:', error);
  response.status(500).json({ success: false, error: 'Internal Server Error' });
});

app.use(express.static(webRoot));
app.get('/{*path}', (_request, response, next) => {
  response.sendFile(path.join(webRoot, 'index.html'), (error) => {
    if (error) next(error);
  });
});

app.listen(port, () => {
  console.log(`Jay Bhavani API and Angular app listening on http://localhost:${port}`);
});
