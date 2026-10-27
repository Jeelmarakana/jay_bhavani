import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { getWishlist, removeWishlistItem, wishlistShareUrl } from '../../../lib/client-wishlist';
import type { WishlistProduct } from '../../../lib/client-wishlist';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  styleUrls: ['./wishlist-page.component.css'],
  templateUrl: './wishlist-page.component.html',
})
export class WishlistPageComponent implements OnInit, OnDestroy {
  items: WishlistProduct[] = [];
  private readonly handleUpdate = (): void => {
    this.items = getWishlist();
  };

  ngOnInit(): void {
    this.items = getWishlist();
    window.addEventListener('wishlist-updated', this.handleUpdate);
  }

  ngOnDestroy(): void {
    window.removeEventListener('wishlist-updated', this.handleUpdate);
  }

  get shareUrl(): string {
    return wishlistShareUrl(this.items);
  }

  remove(id: string): void {
    removeWishlistItem(id);
  }
}
