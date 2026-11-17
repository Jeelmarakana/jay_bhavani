import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../api.service';
import type { Inquiry, Product } from '../../api.service';
import { errorMessage, CATEGORY_LIST } from '../shared/page-data';

type AdminTab = 'inquiries' | 'products';

interface ProductForm {
  id: string;
  name: string;
  category: string;
  categoryName: string;
  metal: string;
  purity: string;
  weight: number | string;
  makingCharges: number | string;
  description: string;
  image: string;
  featured: boolean;
  occasion: string;
}

const EMPTY_PRODUCT_FORM: ProductForm = {
  id: '',
  name: '',
  category: 'rings',
  categoryName: 'Rings',
  metal: 'Gold',
  purity: '22K',
  weight: '',
  makingCharges: 12,
  description: '',
  image: '',
  featured: false,
  occasion: '',
};

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
  activeTab: AdminTab = 'inquiries';

  // Inquiries
  searchTerm = '';
  inquiriesList: Inquiry[] = [];

  // Products
  productSearch = '';
  productsList: Product[] = [];
  productsLoading = false;
  showProductForm = false;
  editingProductId: string | null = null;
  productForm: ProductForm = { ...EMPTY_PRODUCT_FORM };
  productSubmitting = false;
  uploadingImage = false;
  deleteConfirmId: string | null = null;

  statusMessage = '';
  statusSuccess = false;
  credentials = { username: '', password: '' };

  readonly categories = CATEGORY_LIST;
  readonly metalOptions = ['Gold', 'Silver', 'Diamond', 'Platinum'];
  readonly purityOptions = ['24K', '22K', '18K', '14K', '925 Silver', '999 Silver', 'Other'];

  readonly sampleImages = [
    { label: 'Rings', url: '/images/products/rings-4k.jpg' },
    { label: 'Necklace', url: '/images/products/necklaces-4k.jpg' },
    { label: 'Bangles', url: '/images/products/bangles-4k.jpg' },
    { label: 'Earrings', url: '/images/products/earrings-4k.jpg' },
    { label: 'Bridal Set', url: '/images/products/bridal-sets-4k.jpg' },
    { label: 'Mangalsutra', url: '/images/products/mangalsutras-4k.jpg' },
    { label: 'Pendant', url: '/images/products/pendant-sets-4k.jpg' },
    { label: 'Chains', url: '/images/products/chains-4k.jpg' },
    { label: 'Gold Coins', url: '/images/products/gold-coins-4k.jpg' },
  ];

  constructor(private readonly api: ApiService) {}

  // Inquiry getters
  get filteredInquiries(): Inquiry[] {
    const term = this.searchTerm.toLowerCase();
    if (!term) return this.inquiriesList;
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
    return this.inquiriesList.filter(
      (item) => new Date(item.createdAt).toDateString() === today,
    ).length;
  }

  get pendingInquiries(): number {
    return this.inquiriesList.filter((item) => item.status.toLowerCase() === 'pending').length;
  }

  // Product getters
  get filteredProducts(): Product[] {
    const term = this.productSearch.toLowerCase();
    if (!term) return this.productsList;
    return this.productsList.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term) ||
        p.metal.toLowerCase().includes(term),
    );
  }

  ngOnInit(): void {
    this.api.adminSession().subscribe({
      next: (session) => {
        this.isAdmin = session.authenticated;
        this.authLoading = false;
        if (this.isAdmin) {
          this.loadInquiries();
          this.loadProducts();
        }
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
        this.loadProducts();
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
        this.inquiriesList = result.inquiries || [];
        this.loading = false;
      },
      error: (error: unknown) => {
        this.status(false, errorMessage(error, 'Unable to retrieve inquiries.'));
        this.loading = false;
      },
    });
  }

  markStatus(inquiry: Inquiry, status: string): void {
    this.api.updateInquiryStatus(inquiry.id, status).subscribe({
      next: (result) => {
        if (result.success && result.inquiry) {
          const index = this.inquiriesList.findIndex((i) => i.id === inquiry.id);
          if (index !== -1) this.inquiriesList[index] = result.inquiry;
          this.status(true, `Marked as ${status}.`);
        }
      },
      error: (error: unknown) =>
        this.status(false, errorMessage(error, 'Failed to update status.')),
    });
  }

  loadProducts(): void {
    this.productsLoading = true;
    this.api.adminProducts().subscribe({
      next: (result) => {
        this.productsList = result.products || [];
        this.productsLoading = false;
      },
      error: (error: unknown) => {
        this.status(false, errorMessage(error, 'Unable to load products.'));
        this.productsLoading = false;
      },
    });
  }

  openAddProduct(): void {
    this.editingProductId = null;
    this.productForm = { ...EMPTY_PRODUCT_FORM };
    this.showProductForm = true;
  }

  openEditProduct(product: Product): void {
    this.editingProductId = product.id;
    this.productForm = {
      id: product.id,
      name: product.name,
      category: product.category,
      categoryName: product.categoryName,
      metal: product.metal,
      purity: product.purity,
      weight: product.weight,
      makingCharges: product.makingCharges,
      description: product.description,
      image: product.image,
      featured: product.featured ?? false,
      occasion: product.occasion ?? '',
    };
    this.showProductForm = true;
  }

  onCategoryChange(): void {
    const found = this.categories.find((c) => c.slug === this.productForm.category);
    if (found) this.productForm.categoryName = found.name;
  }

  cancelProductForm(): void {
    this.showProductForm = false;
    this.editingProductId = null;
    this.uploadingImage = false;
    this.productForm = { ...EMPTY_PRODUCT_FORM };
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];

    if (!file.type.startsWith('image/')) {
      this.status(false, 'Please select a valid image file (PNG, JPG, WEBP, etc.).');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      this.status(false, 'Image size exceeds 15MB limit.');
      return;
    }

    this.uploadingImage = true;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      this.api.uploadImage(dataUrl, file.name).subscribe({
        next: (result) => {
          this.uploadingImage = false;
          if (result.success && result.url) {
            this.productForm.image = result.url;
            this.status(true, 'Product image uploaded successfully!');
          } else {
            this.productForm.image = dataUrl;
            this.status(true, 'Image preview loaded.');
          }
        },
        error: () => {
          this.uploadingImage = false;
          // Fallback to data URL so the user is not blocked
          this.productForm.image = dataUrl;
          this.status(true, 'Image loaded as data URL.');
        },
      });
    };
    reader.onerror = () => {
      this.uploadingImage = false;
      this.status(false, 'Failed to read image file.');
    };
    reader.readAsDataURL(file);
  }

  setSampleImage(url: string): void {
    this.productForm.image = url;
  }

  clearImage(): void {
    this.productForm.image = '';
  }

  submitProduct(): void {
    if (
      !this.productForm.name.trim() ||
      !this.productForm.category ||
      !this.productForm.metal ||
      !this.productForm.purity ||
      !this.productForm.weight ||
      !this.productForm.description.trim()
    ) {
      this.status(
        false,
        'Please fill all required fields (Name, Category, Metal, Purity, Weight, Description).',
      );
      return;
    }
    this.productSubmitting = true;
    const payload = {
      ...this.productForm,
      weight: Number(this.productForm.weight),
      makingCharges: Number(this.productForm.makingCharges),
    };

    const call = this.editingProductId
      ? this.api.updateProduct(this.editingProductId, payload)
      : this.api.createProduct(payload);

    call.subscribe({
      next: (result) => {
        if (!result.success) {
          this.status(false, result.error || 'Failed to save product.');
          this.productSubmitting = false;
          return;
        }
        this.status(
          true,
          this.editingProductId ? 'Product updated successfully.' : 'Product added successfully.',
        );
        this.cancelProductForm();
        this.loadProducts();
        this.productSubmitting = false;
      },
      error: (error: unknown) => {
        this.status(false, errorMessage(error, 'Failed to save product.'));
        this.productSubmitting = false;
      },
    });
  }

  confirmDelete(productId: string): void {
    this.deleteConfirmId = productId;
  }

  cancelDelete(): void {
    this.deleteConfirmId = null;
  }

  deleteProduct(productId: string): void {
    this.api.deleteProduct(productId).subscribe({
      next: (result) => {
        if (result.success) {
          this.productsList = this.productsList.filter((p) => p.id !== productId);
          this.status(true, 'Product deleted.');
        } else {
          this.status(false, result.error || 'Failed to delete product.');
        }
        this.deleteConfirmId = null;
      },
      error: (error: unknown) => {
        this.status(false, errorMessage(error, 'Failed to delete product.'));
        this.deleteConfirmId = null;
      },
    });
  }

  logout(): void {
    this.api.adminLogout().subscribe({
      next: () => {
        this.isAdmin = false;
        this.inquiriesList = [];
        this.productsList = [];
        this.status(true, 'Logged out successfully.');
      },
      error: (error: unknown) =>
        this.status(false, errorMessage(error, 'Unable to log out. Please try again.')),
    });
  }

  whatsapp(phone: string): string {
    return `https://wa.me/${phone.replace(/[^0-9]/g, '')}`;
  }

  setTab(tab: AdminTab): void {
    this.activeTab = tab;
  }

  private status(success: boolean, message: string): void {
    this.statusSuccess = success;
    this.statusMessage = message;
    setTimeout(() => {
      this.statusMessage = '';
    }, 4000);
  }
}
