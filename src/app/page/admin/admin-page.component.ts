import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../api.service';
import type { Inquiry } from '../../api.service';
import { errorMessage } from '../shared/page-data';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  styleUrls: ['./admin-page.component.css'],
  templateUrl: './admin-page.component.html',
})
export class AdminPageComponent implements OnInit {
  authLoading = true;
  isAdmin = false;
  loading = false;
  submitting = false;
  showPassword = false;
  searchTerm = '';
  inquiriesList: Inquiry[] = [];
  statusMessage = '';
  statusSuccess = false;
  credentials = { username: '', password: '' };

  constructor(private readonly api: ApiService) {}

  get filteredInquiries(): Inquiry[] {
    const term = this.searchTerm.toLowerCase();
    return this.inquiriesList.filter(
      (item) =>
        item.name.toLowerCase().includes(term) ||
        item.phone.includes(term) ||
        (item.productName || '').toLowerCase().includes(term) ||
        (item.productId || '').includes(term) ||
        item.message.toLowerCase().includes(term),
    );
  }

  get todayInquiries(): number {
    const today = new Date().toDateString();
    return this.inquiriesList.filter((item) => new Date(item.createdAt).toDateString() === today)
      .length;
  }

  get pendingInquiries(): number {
    return this.inquiriesList.filter((item) => item.status.toLowerCase() === 'pending').length;
  }

  ngOnInit(): void {
    this.api.adminSession().subscribe({
      next: (session) => {
        this.isAdmin = session.authenticated;
        this.authLoading = false;
        if (this.isAdmin) this.loadInquiries();
      },
      error: (error: unknown) => {
        console.error('Unable to check admin session.', error);
        this.status(false, errorMessage(error, 'Unable to connect to the server.'));
        this.authLoading = false;
      },
    });
  }

  login(): void {
    this.submitting = true;
    this.api.adminLogin(this.credentials).subscribe({
      next: (result) => {
        if (!result.success) {
          this.status(false, result.error || 'Admin login failed.');
          this.submitting = false;
          return;
        }
        this.isAdmin = true;
        this.status(true, result.message || 'Admin login successful.');
        this.loadInquiries();
        this.submitting = false;
      },
      error: (error: unknown) => {
        this.status(false, errorMessage(error, 'Unable to connect to the server.'));
        this.submitting = false;
      },
    });
  }

  loadInquiries(): void {
    this.loading = true;
    this.api.inquiries().subscribe({
      next: (result) => {
        this.inquiriesList = result.inquiries;
        this.loading = false;
      },
      error: (error: unknown) => {
        this.status(false, errorMessage(error, 'Unable to retrieve inquiries.'));
        this.loading = false;
      },
    });
  }

  logout(): void {
    this.api.adminLogout().subscribe({
      next: () => {
        this.isAdmin = false;
        this.inquiriesList = [];
        this.status(true, 'Logged out successfully.');
      },
      error: (error: unknown) =>
        this.status(false, errorMessage(error, 'Unable to log out. Please try again.')),
    });
  }

  whatsapp(phone: string): string {
    return `https://wa.me/${phone.replace(/[^0-9]/g, '')}`;
  }

  private status(success: boolean, message: string): void {
    this.statusSuccess = success;
    this.statusMessage = message;
  }
}
