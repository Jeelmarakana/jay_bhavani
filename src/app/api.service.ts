import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

export interface Product {
  id: string;
  _id?: string;
  name: string;
  category: string;
  categoryName: string;
  metal: string;
  purity: string;
  weight: number;
  makingCharges: number;
  description: string;
  image: string;
  images?: string[];
  featured?: boolean;
  occasion?: string;
  price?: number;
}

export interface GoldRates {
  gold24k: number;
  gold22k: number;
  gold18k: number;
  silver: number;
  timestamp?: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email?: string;
  phone: string;
  interestedIn?: string;
  productId?: string | null;
  productName?: string | null;
  message: string;
  status: string;
  createdAt: string;
}

export interface WhatsAppNotificationResult {
  sent: boolean;
  reason?: 'not_configured' | 'provider_rejected' | 'request_failed' | 'timeout';
  status?: number;
}

/** Normalize a product into client Product shape with valid image path */
export function normalizeProduct(p: Record<string, unknown>): Product {
  const id = String((p['_id'] ?? p['id']) || '');
  const rawImage =
    (p['image'] as string | undefined) ||
    ((p['images'] as string[] | undefined)?.[0]) ||
    '';

  let image = '/images/products/rings-4k.jpg';
  if (rawImage && typeof rawImage === 'string' && rawImage.trim()) {
    const trimmed = rawImage.trim();
    if (
      trimmed.startsWith('http://') ||
      trimmed.startsWith('https://') ||
      trimmed.startsWith('data:') ||
      trimmed.startsWith('/')
    ) {
      image = trimmed;
    } else {
      image = `/uploads/${trimmed}`;
    }
  }

  return {
    id,
    _id: id,
    name: String(p['name'] || ''),
    category: String(p['category'] || '').toLowerCase(),
    categoryName: String((p['categoryName'] as string | undefined) || p['category'] || ''),
    metal: String((p['metal'] as string | undefined) || 'Gold'),
    purity: String((p['purity'] as string | undefined) || '22K'),
    weight: Number(p['weight'] || 0),
    makingCharges: Number(p['makingCharges'] || 0),
    description: String(p['description'] || ''),
    image,
    images: (p['images'] as string[] | undefined) || [image],
    featured: Boolean(p['featured']),
    occasion: String((p['occasion'] as string | undefined) || ''),
    price: Number(p['price'] || 0),
  };
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private readonly http: HttpClient) {}

  products(
    filters: Record<string, string> = {},
  ): Observable<{ success: boolean; products: Product[] }> {
    const params = new URLSearchParams();
    if (filters['search']) params.set('search', filters['search']);
    if (filters['category'] && filters['category'] !== 'all') params.set('category', filters['category']);
    if (filters['metal'] && filters['metal'] !== 'all') params.set('metal', filters['metal']);
    if (filters['featured']) params.set('featured', filters['featured']);

    return this.http
      .get<{ success?: boolean; products?: unknown[] } | unknown[]>(
        `/api/products?${params.toString()}`,
      )
      .pipe(
        map((data) => {
          const arr: unknown[] = Array.isArray(data)
            ? data
            : ((data as Record<string, unknown>)?.['products'] as unknown[] | undefined) ?? [];
          let products = arr.map((p) => normalizeProduct(p as Record<string, unknown>));

          if (filters['featured'] === 'true') {
            products = products.filter((p) => p.featured);
          }
          if (filters['category'] && filters['category'] !== 'all') {
            products = products.filter(
              (p) => p.category.toLowerCase() === filters['category'].toLowerCase(),
            );
          }
          if (filters['metal'] && filters['metal'] !== 'all') {
            products = products.filter(
              (p) => p.metal.toLowerCase().includes(filters['metal'].toLowerCase()),
            );
          }
          if (filters['search']) {
            const s = filters['search'].toLowerCase();
            products = products.filter(
              (p) =>
                p.name.toLowerCase().includes(s) ||
                p.description.toLowerCase().includes(s),
            );
          }
          return { success: true, products };
        }),
      );
  }

  product(id: string): Observable<{ success: boolean; product?: Product; error?: string }> {
    return this.http
      .get<{ success?: boolean; product?: unknown; error?: string } | Record<string, unknown>>(
        `/api/products/${encodeURIComponent(id)}`,
      )
      .pipe(
        map((data) => {
          if (!data) return { success: false, error: 'Product not found' };
          const obj = data as Record<string, unknown>;
          if (obj['success'] === false) {
            return { success: false, error: String(obj['error'] || 'Product not found') };
          }
          const raw = (obj['product'] as Record<string, unknown>) || obj;
          return { success: true, product: normalizeProduct(raw) };
        }),
      );
  }

  goldRates(): Observable<{ success: boolean; rates: GoldRates }> {
    return this.http.get<{ success: boolean; rates: GoldRates }>('/api/gold-rate');
  }

  submitInquiry(payload: {
    name?: string;
    phone?: string;
    email?: string;
    productId?: string | null;
    productName?: string | null;
    interestedIn?: string;
    message?: string;
  }): Observable<{
    success: boolean;
    error?: string;
    inquiry?: Inquiry;
    notification?: WhatsAppNotificationResult;
  }> {
    const body = {
      name: payload.name || '',
      phone: payload.phone || '',
      email: payload.email || '',
      productId: payload.productId || null,
      productName: payload.productName || null,
      interestedIn: payload.interestedIn || '',
      message: payload.message || '',
    };

    return this.http
      .post<{
        success: boolean;
        inquiry?: Inquiry;
        notification?: WhatsAppNotificationResult;
        error?: string;
      }>('/api/inquiries', body)
      .pipe(
        map((res) => ({
          success: Boolean(res?.success),
          error: res?.error,
          inquiry: res?.inquiry,
          notification: res?.notification,
        })),
      );
  }

  // ── Admin session (uses local server on 3001) ──────────────────────────────
  adminSession(): Observable<{ authenticated: boolean }> {
    return this.http.get<{ authenticated: boolean }>('/api/admin/session', {
      withCredentials: true,
    });
  }

  adminLogin(credentials: {
    username: string;
    password: string;
  }): Observable<{ success: boolean; message?: string; error?: string }> {
    return this.http.post<{ success: boolean; message?: string; error?: string }>(
      '/api/admin/session',
      credentials,
      { withCredentials: true },
    );
  }

  adminLogout(): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>('/api/admin/session', { withCredentials: true });
  }

  inquiries(): Observable<{ success: boolean; inquiries: Inquiry[]; error?: string }> {
    return this.http.get<{ success: boolean; inquiries: Inquiry[]; error?: string }>(
      '/api/inquiries',
      { withCredentials: true },
    );
  }

  updateInquiryStatus(
    id: string,
    status: string,
  ): Observable<{ success: boolean; inquiry?: Inquiry; error?: string }> {
    return this.http.patch<{ success: boolean; inquiry?: Inquiry; error?: string }>(
      `/api/inquiries/${encodeURIComponent(id)}`,
      { status },
      { withCredentials: true },
    );
  }

  adminProducts(): Observable<{ success: boolean; products: Product[] }> {
    return this.http
      .get<{ success: boolean; products: unknown[] }>('/api/products', { withCredentials: true })
      .pipe(
        map((res) => ({
          success: Boolean(res?.success),
          products: (res?.products || []).map((p) =>
            normalizeProduct(p as Record<string, unknown>),
          ),
        })),
      );
  }

  uploadImage(
    dataUrl: string,
    filename?: string,
  ): Observable<{ success: boolean; url?: string; error?: string }> {
    return this.http.post<{ success: boolean; url?: string; error?: string }>(
      '/api/admin/upload',
      { image: dataUrl, filename },
      { withCredentials: true },
    );
  }

  createProduct(
    data: Partial<Product>,
  ): Observable<{ success: boolean; product?: Product; error?: string }> {
    return this.http.post<{ success: boolean; product?: Product; error?: string }>(
      '/api/admin/products',
      data,
      { withCredentials: true },
    );
  }

  updateProduct(
    id: string,
    data: Partial<Product>,
  ): Observable<{ success: boolean; product?: Product; error?: string }> {
    return this.http.put<{ success: boolean; product?: Product; error?: string }>(
      `/api/admin/products/${encodeURIComponent(id)}`,
      data,
      { withCredentials: true },
    );
  }

  deleteProduct(id: string): Observable<{ success: boolean; error?: string }> {
    return this.http.delete<{ success: boolean; error?: string }>(
      `/api/admin/products/${encodeURIComponent(id)}`,
      { withCredentials: true },
    );
  }
}
