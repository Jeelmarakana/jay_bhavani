import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Product {
  id: string;
  name: string;
  category: string;
  categoryName: string;
  metal: string;
  purity: string;
  weight: number;
  makingCharges: number;
  description: string;
  image: string;
  featured?: boolean;
  occasion?: string;
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

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private readonly http: HttpClient) {}

  products(filters: Record<string, string> = {}): Observable<{ success: boolean; products: Product[] }> {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(filters)) {
      if (value && value !== 'all') params.set(key, value);
    }
    return this.http.get<{ success: boolean; products: Product[] }>(`/api/products?${params.toString()}`);
  }

  product(id: string): Observable<{ success: boolean; product?: Product; error?: string }> {
    return this.http.get<{ success: boolean; product?: Product; error?: string }>(`/api/products/${encodeURIComponent(id)}`);
  }

  goldRates(): Observable<{ success: boolean; rates: GoldRates }> {
    return this.http.get<{ success: boolean; rates: GoldRates }>('/api/gold-rate');
  }

  submitInquiry(payload: Partial<Inquiry>): Observable<{ success: boolean; error?: string; notifyUrl?: string }> {
    return this.http.post<{ success: boolean; error?: string; notifyUrl?: string }>('/api/inquiries', payload);
  }

  adminSession(): Observable<{ authenticated: boolean }> {
    return this.http.get<{ authenticated: boolean }>('/api/admin/session', { withCredentials: true });
  }

  adminLogin(credentials: { username: string; password: string }): Observable<{ success: boolean; message?: string; error?: string }> {
    return this.http.post<{ success: boolean; message?: string; error?: string }>('/api/admin/session', credentials, { withCredentials: true });
  }

  adminLogout(): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>('/api/admin/session', { withCredentials: true });
  }

  inquiries(): Observable<{ success: boolean; inquiries: Inquiry[]; error?: string }> {
    return this.http.get<{ success: boolean; inquiries: Inquiry[]; error?: string }>('/api/inquiries', { withCredentials: true });
  }
}
