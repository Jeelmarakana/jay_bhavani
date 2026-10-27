import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from '../../api.service';
import type { Product } from '../../api.service';
import { getWishlist, toggleWishlist } from '../../../lib/client-wishlist';
import { CATEGORY_LIST } from '../shared/page-data';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  styleUrls: ['./shop-page.component.css'],
  templateUrl: './shop-page.component.html',
})
export class ShopPageComponent implements OnInit, OnDestroy {
  readonly categories = [
    { name: 'All Collection', value: 'all' },
    ...CATEGORY_LIST.map(({ name, slug }) => ({ name, value: slug })),
  ];
  products: Product[] = [];
  loading = true;
  search = '';
  category = 'all';
  metal = 'all';
  sortBy = 'none';
  wishlistIds = new Set<string>();
  private querySubscription?: Subscription;
  private requestSequence = 0;
  private readonly syncWishlist = (): void => {
    this.wishlistIds = new Set(getWishlist().map((item) => item.id));
  };

  constructor(
    private readonly api: ApiService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {}

  get activeCategory(): (typeof CATEGORY_LIST)[number] | undefined {
    return CATEGORY_LIST.find((item) => item.slug === this.category);
  }

  ngOnInit(): void {
    this.syncWishlist();
    window.addEventListener('wishlist-updated', this.syncWishlist);
    window.addEventListener('storage', this.syncWishlist);
    this.querySubscription = this.route.queryParamMap.subscribe((params) => {
      this.search = params.get('search') || '';
      this.category = params.get('category') || 'all';
      this.loadProducts();
    });
  }

  ngOnDestroy(): void {
    this.querySubscription?.unsubscribe();
    window.removeEventListener('wishlist-updated', this.syncWishlist);
    window.removeEventListener('storage', this.syncWishlist);
  }

  loadProducts(): void {
    const requestId = ++this.requestSequence;
    this.loading = true;
    this.api
      .products({ search: this.search, category: this.category, metal: this.metal })
      .subscribe({
        next: (result) => {
          if (requestId !== this.requestSequence) return;
          this.products = result.products;
          this.sortProducts();
          this.loading = false;
        },
        error: (error: unknown) => {
          if (requestId !== this.requestSequence) return;
          console.error('Unable to load jewellery products.', error);
          this.products = [];
          this.loading = false;
        },
      });
  }

  sortProducts(): void {
    const sorted = [...this.products];
    if (this.sortBy === 'weight-asc') sorted.sort((a, b) => a.weight - b.weight);
    if (this.sortBy === 'weight-desc') sorted.sort((a, b) => b.weight - a.weight);
    if (this.sortBy === 'name-asc') sorted.sort((a, b) => a.name.localeCompare(b.name));
    this.products = sorted;
  }

  clearFilters(): void {
    this.search = '';
    this.category = 'all';
    this.metal = 'all';
    this.sortBy = 'none';
    void this.router.navigateByUrl('/shop');
    this.loadProducts();
  }

  toggleWishlist(product: Product): void {
    toggleWishlist(product);
  }

  isWishlisted(productId: string): boolean {
    return this.wishlistIds.has(productId);
  }
}
