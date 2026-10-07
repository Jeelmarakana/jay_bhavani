import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from './api.service';
import { MotionDirective } from './motion.directive';
import type { GoldRates, Inquiry, Product } from './api.service';
import { loginClient, registerClient } from '../lib/client-auth';
import { getWishlist, removeWishlistItem, toggleWishlist, wishlistShareUrl } from '../lib/client-wishlist';
import type { WishlistProduct } from '../lib/client-wishlist';
import { buildWhatsAppUrl, INSTAGRAM_URL, SHOP_PHONE_DISPLAY } from '../lib/config';

const CATEGORY_LIST = [
  { name: 'Rings', slug: 'rings', image: '/images/products/rings-4k.jpg', fallback: '💍' },
  { name: 'Necklaces & Har', slug: 'necklaces', image: '/images/products/necklaces-4k.jpg', fallback: '📿' },
  { name: 'Earrings', slug: 'earrings', image: '/images/products/earrings-4k.jpg', fallback: '✨' },
  { name: 'Bangles & Bracelets', slug: 'bangles', image: '/images/products/bangles-4k.jpg', fallback: '⚪' },
  { name: 'Mangalsutras', slug: 'mangalsutra', image: '/images/products/mangalsutras-4k.jpg', fallback: '🔗' },
  { name: 'Bridal Sets', slug: 'bridal-sets', image: '/images/products/bridal-sets-4k.jpg', fallback: '👑' },
  { name: 'Silver Jewellery', slug: 'silver', image: '/images/products/silver-jewellery-4k.jpg', fallback: '🥈' },
  { name: 'Temple Jewellery', slug: 'temple', image: '/images/products/temple-jewellery-4k.jpg', fallback: '🏛️' },
  { name: 'Kundan Jewellery', slug: 'kundan', image: '/images/products/kundan-jewellery-4k.jpg', fallback: '💎' },
  { name: 'Pendant Sets', slug: 'pendants', image: '/images/products/pendant-sets-4k.jpg', fallback: '📿' },
  { name: 'Chains', slug: 'chains', image: '/images/products/chains-4k.jpg', fallback: '⛓️' },
  { name: 'Anklets (Payal)', slug: 'anklets', image: '/images/products/anklets-4k.jpg', fallback: '🦶' },
  { name: 'Nose Pins', slug: 'nose-pins', image: '/images/products/nose-pins-4k.jpg', fallback: '💎' },
  { name: 'Brooches', slug: 'brooches', image: '/images/products/brooches-4k.jpg', fallback: '🌸' },
  { name: 'Kamarband (Waist Belt)', slug: 'kamarband', image: '/images/products/kamarband-4k.jpg', fallback: '🎀' },
  { name: 'Hair Accessories', slug: 'hair-accessories', image: '/images/products/hair-accessories-4k.jpg', fallback: '👑' },
  { name: "Men's Jewellery", slug: 'mens-jewellery', image: '/images/products/mens-jewellery-4k.jpg', fallback: '🤵' },
  { name: 'Gold Coins', slug: 'gold-coins', image: '/images/products/gold-coins-4k.jpg', fallback: '🪙' },
  { name: 'Religious Items', slug: 'religious', image: '/images/products/religious-items-4k.jpg', fallback: '🙏' },
  { name: 'Lockets', slug: 'lockets', image: '/images/products/lockets-4k.jpg', fallback: '🔒' },
  { name: 'Solitaires', slug: 'solitaires', image: '/images/products/solitaires-4k.jpg', fallback: '💎' },
  { name: 'Antique Jewellery', slug: 'antique', image: '/images/products/antique-jewellery-4k.jpg', fallback: '🏺' },
];

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof HttpErrorResponse
    ? (error.error?.error || fallback)
    : fallback;
}

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MotionDirective],
  styleUrls: ['./page.css'],
  template: `
    <div class="homeContainer animate-fade-in">
      <section class="hero">
        <div class="heroSlides" aria-hidden="true">
          <div *ngFor="let slide of heroSlides; let index = index" class="heroSlide" [class.isActive]="currentHeroSlide === index" [class.isLeaving]="previousHeroSlide === index" [class.slideFromLeft]="heroSlideDirection === 'previous'" (animationend)="onHeroSlideAnimationEnd($event, index)">
            <img class="heroSlideImage" [src]="slide.image" [alt]="slide.alt" loading="eager" [attr.fetchpriority]="index === 0 ? 'high' : 'low'">
          </div>
        </div>
        <div class="heroContent container">
          <span class="heroSubtitle">Digital Showroom + WhatsApp Sales Machine</span>
          <h1 class="heroTitle serif-title">Timeless Gold Elegance, Crafted With Trust.</h1>
          <p class="heroText">22K Gold • Diamond • Bridal • Antique Jewellery — Kamrej, Surat's Most Trusted Family Jewellery Destination.</p>
          <div class="heroActions">
            <div class="heroBtns">
              <a href="#shop-by-category" class="gold-btn">Explore Collection</a>
              <a [href]="consultUrl" class="outline-btn" target="_blank" rel="noreferrer">WhatsApp Us</a>
            </div>
            <div class="heroSliderDots" role="group" aria-label="Choose a hero image">
              <button *ngFor="let slide of heroSlides; let index = index" type="button" class="heroSliderDot" [class.isActive]="currentHeroSlide === index" [attr.aria-label]="'Show image ' + (index + 1) + ' of ' + heroSlides.length" [attr.aria-pressed]="currentHeroSlide === index" (click)="showHeroSlide(index)"></button>
            </div>
          </div>
        </div>
        <div class="heroSliderControls" aria-label="Hero image controls">
          <button type="button" class="heroArrow" aria-label="Previous image" (click)="moveHeroSlide(-1)">‹</button>
          <button type="button" class="heroArrow" aria-label="Next image" (click)="moveHeroSlide(1)">›</button>
        </div>
      </section>
      <section id="rates-section" class="ratesSection" data-3d-reveal>
        <div class="container"><div class="ratesCard">
          <div class="ratesHeader"><span class="pulseDot"></span><h2 class="serif-title">Today's Gold Rate — Kamrej, Surat</h2></div>
          <div class="ratesGrid">
            <div class="rateBox"><span class="rateLabel">24K Gold / 10g</span><span class="rateVal">{{ rate(rates?.gold24k) }}</span></div>
            <div class="rateBox"><span class="rateLabel">22K Gold / 10g</span><span class="rateVal">{{ rate(rates?.gold22k) }}</span></div>
            <div class="rateBox"><span class="rateLabel">18K Gold / 10g</span><span class="rateVal">{{ rate(rates?.gold18k) }}</span></div>
            <div class="rateBox"><span class="rateLabel">Silver / 100g</span><span class="rateVal">{{ rates ? rate(rates.silver * 10) : 'Rates unavailable' }}</span></div>
          </div>
          <p class="ratesDisclaimer">Updated: {{ updatedLabel }} • Rates are indicative and may vary at store.</p>
        </div></div>
      </section>
      <section id="shop-by-category" class="section categoriesSection">
        <div class="container">
          <div class="sectionHeader"><h2 class="sectionTitle serif-title">Shop by Category</h2><div class="titleDivider"></div></div>
          <div class="categoriesGrid">
            <a *ngFor="let category of categories" [routerLink]="['/shop']" [queryParams]="{ category: category.slug }" class="categoryCard" [class.categoryCardFallback]="imageFallbacks[category.slug]" data-3d-tilt>
              <div *ngIf="imageFallbacks[category.slug]" class="categoryFallback"><span class="fallbackIcon">{{ category.fallback }}</span></div>
              <img *ngIf="!imageFallbacks[category.slug]" class="categoryImage" [src]="category.image" [alt]="category.name" loading="lazy" (error)="imageFallback($event, category.slug)">
              <span class="categoryName serif-title">{{ category.name }}</span>
            </a>
          </div>
        </div>
      </section>
      <section class="section darkBg" data-3d-reveal>
        <div class="container">
          <div class="sectionHeader"><h2 class="sectionTitle serif-title">Our Signature Collection</h2><div class="titleDivider"></div></div>
          <div class="grid-4">
            <article *ngFor="let product of featuredProducts" class="card" data-3d-tilt>
              <a [routerLink]="['/product', product.id]" class="productLink">
                <div class="productImgWrapper"><img [src]="product.image" [alt]="product.name" class="productImg" loading="lazy"><span class="metalTag">{{ product.metal }}</span></div>
              </a>
              <div class="productInfo"><span class="productCategory">{{ product.categoryName }}</span><h3 class="productName">{{ product.name }}</h3>
                <div class="productFooter"><span class="productWeight">{{ product.weight }}g | {{ product.purity }}</span><a [routerLink]="['/product', product.id]" class="viewLink">View Details →</a></div>
                <button class="outline-btn wishlistSaveBtn" type="button" [class.isSaved]="isWishlisted(product.id)" [attr.aria-pressed]="isWishlisted(product.id)" [attr.aria-label]="(isWishlisted(product.id) ? 'Remove ' : 'Save ') + product.name + (isWishlisted(product.id) ? ' from' : ' to') + ' wishlist'" (click)="toggleWishlist(product)">{{ isWishlisted(product.id) ? '♥ Saved to Wishlist' : '♡ Save to Wishlist' }}</button>
              </div>
            </article>
          </div>
          <p *ngIf="!featuredProducts.length && !loading" class="emptyBox">Explore our complete collection of handcrafted jewellery.</p>
        </div>
      </section>
      <section id="bridal" class="bridalSection"><div class="bridalLayout"><div class="container"><div class="bridalContent">
        <span class="kicker">Bridal Jewellery</span><h2 class="serif-title">Bridal Jewellery, Made for Your Big Day</h2>
        <p>Traditional elegance meets modern craftsmanship. From red-carpet-worthy bridal sets to heirloom-worthy family pieces, every design is crafted with a balance of beauty, comfort, and lasting value.</p>
        <div class="bridalBtns"><a routerLink="/shop" [queryParams]="{ category: 'bridal-sets' }" class="gold-btn">Explore Bridal Collection</a>
          <a [href]="bridalUrl" class="outline-btn" target="_blank" rel="noreferrer">Book Bridal Consultation</a></div>
      </div></div></div></section>
      <section class="section"><div class="container">
        <div class="sectionHeader"><h2 class="sectionTitle serif-title">What Our Customers Say</h2><div class="titleDivider"></div></div>
        <div class="reviewGrid">
          <article *ngFor="let review of reviews" class="reviewCard"><div class="reviewStars" aria-label="5 out of 5 stars">★★★★★</div><p>“{{ review.quote }}”</p><strong>{{ review.name }}</strong></article>
        </div>
      </div></section>
      <section class="section"><div class="container">
        <div class="sectionHeader"><h2 class="sectionTitle serif-title">From Our Jewellery Collection</h2><div class="titleDivider"></div></div>
        <div class="instagramGrid">
          <a *ngFor="let image of gallery; let index = index" [href]="instagramUrl" target="_blank" rel="noopener noreferrer" class="instagramCard" galleryReveal [style.--gallery-delay]="(index % 6) * 75 + 'ms'" aria-label="View design on Instagram">
            <span class="instagramImageFrame"><img [src]="image" alt="Latest jewellery design at Jay Bhavani Ornaments" class="instagramImage" loading="lazy"></span>
            <div class="instagramOverlay"><span class="instagramIcon">📸</span><span>View on Instagram</span></div>
          </a>
        </div>
        <div class="instagramFollow"><a [href]="instagramUrl" target="_blank" rel="noopener noreferrer" class="gold-btn">Follow @jaybhavani_ornaments on Instagram</a></div>
      </div></section>
      <section id="about" class="section"><div class="container">
        <div class="sectionHeader"><h2 class="sectionTitle serif-title">Why Choose Jay Bhavani Ornaments?</h2><div class="titleDivider"></div></div>
        <div class="trustGrid"><div *ngFor="let point of trustPoints" class="trustCard"><span class="checkmark" aria-hidden="true">✓</span><h3>{{ point }}</h3></div></div>
        <div class="customCTA"><h2 class="serif-title">Visit Our Boutique in Kamrej, Surat</h2><p>Discover trusted craftsmanship, transparent pricing and a personal jewellery experience.</p><a [href]="consultUrl" target="_blank" rel="noreferrer" class="gold-btn">Talk to Our Team</a></div>
      </div></section>
      <section id="contact" class="section"><div class="container">
        <div class="visitCard"><div class="visitContent"><span class="kicker">Visit Our Showroom</span><h2 class="serif-title">Visit Our Showroom</h2>
          <p>📍 Jay Bhavani Ornaments, Shop No. 103, Vastu Palace-B, Pasodra Patiya, Kamrej, Surat</p><p>🕐 Mon–Sat: 11:00 AM – 8:30 PM</p>
          <div class="heroBtns"><a href="https://maps.google.com/?q=Shop%20No.%20103%2C%20Vastu%20Palace-B%2C%20Pasodra%20Patiya%2C%20Kamrej%2C%20Surat" class="gold-btn" target="_blank" rel="noreferrer">Get Directions</a><a [href]="visitUrl" class="outline-btn" target="_blank" rel="noreferrer">WhatsApp for Visit</a></div>
        </div><div class="mapWrap"><iframe title="Jay Bhavani Ornaments location" src="https://maps.google.com/maps?q=shop%20no.%20103%20vasto%20palace-b%20pasodra%20patiya%20kamrej%20surat&t=&z=15&ie=UTF8&iwloc=&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div></div>
      </div></section>
      <section class="finalCTASection"><div class="container"><div class="finalCTA"><h2 class="serif-title">Your perfect ornament is waiting.</h2><a [href]="consultUrl" class="gold-btn" target="_blank" rel="noreferrer">WhatsApp Us</a></div></div></section>
      <section class="section" data-3d-reveal><div class="container">
        <div class="enquiryGrid"><div class="enquiryInfo"><span class="kicker">Quick Enquiry</span><h2 class="serif-title">Tell us what you are looking for</h2>
          <p>Choose a category, share your preferred design type, and our team will guide you with the right options and latest pricing.</p>
          <p class="optionalText">Login to save your enquiries and wishlist. Login is optional and never required for a quote.</p></div>
          <div class="enquiryFormWrap glassmorphism">
            <div *ngIf="enquiryMessage" class="statusMsg" [class.successMsg]="enquirySuccess" [class.errorMsg]="!enquirySuccess">{{ enquiryMessage }}</div>
            <form (ngSubmit)="submitEnquiry()">
              <div class="grid-2 enquiryFields"><div class="form-group"><label class="form-label" for="home-name">Name *</label><input id="home-name" class="form-control" name="name" [(ngModel)]="formData.name" required placeholder="Your name"></div>
                <div class="form-group"><label class="form-label" for="home-phone">Mobile / WhatsApp *</label><input id="home-phone" class="form-control" name="phone" type="tel" [(ngModel)]="formData.phone" required placeholder="Mobile number"></div></div>
              <div class="form-group"><label class="form-label" for="home-category">Interested In</label><select id="home-category" class="form-control" name="interestedIn" [(ngModel)]="formData.interestedIn">
                <option *ngFor="let category of categories" [value]="category.name">{{ category.name }}</option><option>Custom Design</option>
              </select></div>
              <div class="form-group"><label class="form-label" for="home-message">Message *</label><textarea id="home-message" class="form-control" name="message" rows="4" [(ngModel)]="formData.message" required placeholder="Tell us your preferred style, metal or occasion"></textarea></div>
              <button type="submit" class="gold-btn enquirySubmit" [disabled]="submitting">{{ submitting ? 'Sending...' : 'Send Enquiry' }}</button>
            </form>
          </div>
        </div>
      </div></section>
      <div *ngIf="loading" class="page-loader"><div class="loader-content"><div class="loader-spinner"></div><p class="loader-text">Loading Jay Bhavani Ornaments...</p></div></div>
    </div>
  `,
})
export class HomePageComponent implements OnInit, AfterViewInit, OnDestroy {
  readonly categories = CATEGORY_LIST;
  readonly instagramUrl = INSTAGRAM_URL;
  readonly heroSlides = [
    { image: '/images/products/rings-4k.jpg', alt: 'Diamond rings displayed on a light background with a rose' },
    { image: '/images/products/brooches-4k.jpg', alt: 'Gold brooch displayed on a bright white background' },
    { image: '/images/products/solitaires-4k.jpg', alt: 'Gold and diamond solitaire rings displayed on a light grey background' },
  ];
  readonly reviews = [
    { name: 'Aarohi Patel', quote: 'The bridal set was exactly what we wanted. The design felt grand but still elegant and very personal.' },
    { name: 'Pratik Shah', quote: 'Their pricing transparency and quality gave us total confidence. We felt respected throughout the buying process.' },
    { name: 'Nisha Desai', quote: 'From quick WhatsApp replies to the final fitting, the experience was smooth and reassuring.' },
  ];
  readonly gallery = [
    '/images/products/rings-4k.jpg', '/images/products/bridal-sets-4k.jpg',
    '/images/products/temple-jewellery-4k.jpg', '/images/products/silver-jewellery-4k.jpg',
    '/images/products/bangles-4k.jpg', '/images/products/antique-jewellery-4k.jpg',
    '/images/products/earrings-4k.jpg', '/images/products/solitaires-4k.jpg',
    '/images/products/mangalsutras-4k.jpg', '/images/products/necklaces-4k.jpg',
    '/images/products/chains-4k.jpg', '/images/products/anklets-4k.jpg',
    '/images/products/pendant-sets-4k.jpg', '/images/products/kundan-jewellery-4k.jpg',
  ];
  readonly trustPoints = ['22K Gold Jewellery', 'Transparent Pricing', 'Custom Jewellery', 'Trusted Craftsmanship', 'Purity Check'];
  readonly consultUrl = buildWhatsAppUrl('Hi Jay Bhavani Ornaments, I am visiting your digital showroom and would like to explore your jewellery collection.');
  readonly bridalUrl = buildWhatsAppUrl('Hi Jay Bhavani Ornaments, I would like to book a bridal consultation.');
  readonly visitUrl = buildWhatsAppUrl('Hi Jay Bhavani Ornaments, I would like to visit the showroom.');
  rates: GoldRates | null = null;
  featuredProducts: Product[] = [];
  loading = true;
  updatedLabel = 'Today';
  submitting = false;
  enquiryMessage = '';
  enquirySuccess = false;
  formData = { name: '', phone: '', interestedIn: 'Rings', message: '' };
  wishlistIds = new Set<string>();
  private rateTimer?: ReturnType<typeof setInterval>;
  private heroTimer?: ReturnType<typeof setInterval>;
  currentHeroSlide = 0;
  previousHeroSlide?: number;
  heroSlideDirection: 'next' | 'previous' = 'next';
  private readonly syncWishlist = (): void => {
    this.wishlistIds = new Set(getWishlist().map((item) => item.id));
  };

  constructor(
    private readonly api: ApiService,
    private readonly host: ElementRef<HTMLElement>,
  ) {}

  ngOnInit(): void {
    this.syncWishlist();
    window.addEventListener('wishlist-updated', this.syncWishlist);
    window.addEventListener('storage', this.syncWishlist);
    this.startHeroAutoplay();
    this.loadRates();
    this.rateTimer = setInterval(() => this.loadRates(), 15000);
    this.api.products({ featured: 'true' }).subscribe({
      next: (result) => { this.featuredProducts = result.products.slice(0, 4); this.loading = false; },
      error: (error: unknown) => { console.error('Unable to load featured jewellery.', error); this.loading = false; },
    });
  }

  ngAfterViewInit(): void {
    this.revealGalleryCardsInView();
  }

  @HostListener('window:scroll')
  revealGalleryCardsInView(): void {
    this.host.nativeElement.querySelectorAll<HTMLElement>('.instagramCard[galleryReveal]:not(.is-visible)')
      .forEach((card) => {
        const bounds = card.getBoundingClientRect();
        if (bounds.top < window.innerHeight && bounds.bottom > 0) card.classList.add('is-visible');
      });
  }

  ngOnDestroy(): void {
    if (this.rateTimer) clearInterval(this.rateTimer);
    if (this.heroTimer) clearInterval(this.heroTimer);
    window.removeEventListener('wishlist-updated', this.syncWishlist);
    window.removeEventListener('storage', this.syncWishlist);
  }

  private loadRates(): void {
    this.api.goldRates().subscribe({
      next: (result) => {
        this.rates = result.rates;
        this.updatedLabel = result.rates.timestamp
          ? new Date(result.rates.timestamp).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' })
          : 'Today';
      },
      error: (error: unknown) => console.error('Unable to load current rates.', error),
    });
  }

  rate(value: number | undefined): string {
    return value === undefined ? 'Rates unavailable' : `₹${Math.round(value).toLocaleString('en-IN')}`;
  }

  moveHeroSlide(direction: -1 | 1, restartAutoplay = true): void {
    this.showHeroSlide(this.currentHeroSlide + direction, direction === 1 ? 'next' : 'previous', restartAutoplay);
  }

  showHeroSlide(index: number, direction?: 'next' | 'previous', restartAutoplay = true): void {
    const nextSlide = (index + this.heroSlides.length) % this.heroSlides.length;
    if (nextSlide !== this.currentHeroSlide) {
      const forwardDistance = (nextSlide - this.currentHeroSlide + this.heroSlides.length) % this.heroSlides.length;
      this.heroSlideDirection = direction
        ?? (forwardDistance <= this.heroSlides.length / 2 ? 'next' : 'previous');
      this.previousHeroSlide = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? undefined
        : this.currentHeroSlide;
      this.currentHeroSlide = nextSlide;
    }
    if (restartAutoplay) this.startHeroAutoplay();
  }

  onHeroSlideAnimationEnd(event: AnimationEvent, index: number): void {
    if (event.target !== event.currentTarget || !event.animationName.startsWith('heroSlideExit')) return;
    if (this.previousHeroSlide === index) this.previousHeroSlide = undefined;
  }

  private startHeroAutoplay(): void {
    if (this.heroTimer) clearInterval(this.heroTimer);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.heroTimer = undefined;
      return;
    }
    this.heroTimer = setInterval(() => this.moveHeroSlide(1, false), 2000);
  }

  isWishlisted(productId: string): boolean {
    return this.wishlistIds.has(productId);
  }

  toggleWishlist(product: Product): void {
    toggleWishlist(product);
  }

  submitEnquiry(): void {
    if (!this.formData.name.trim() || !this.formData.phone.trim() || !this.formData.message.trim()) {
      this.enquirySuccess = false;
      this.enquiryMessage = 'Please fill in your name, mobile number and enquiry message.';
      return;
    }
    this.submitting = true;
    this.enquiryMessage = '';
    this.api.submitInquiry(this.formData).subscribe({
      next: (result) => {
        this.enquirySuccess = result.success;
        this.enquiryMessage = result.success
          ? 'Thank you! Your enquiry has been sent. Our team at 9054049570 will contact you shortly.'
          : result.error || 'Failed to send enquiry.';
        if (result.success && result.notifyUrl) window.open(result.notifyUrl, '_blank', 'noopener,noreferrer');
        if (result.success) this.formData = { name: '', phone: '', interestedIn: 'Rings', message: '' };
        this.submitting = false;
      },
      error: (error: unknown) => {
        this.enquirySuccess = false;
        this.enquiryMessage = errorMessage(error, 'Something went wrong. Please try again or send us a WhatsApp message.');
        this.submitting = false;
      },
    });
  }

  imageFallbacks: Record<string, boolean> = {};

  imageFallback(event: Event, slug: string): void {
    const image = event.target as HTMLImageElement;
    image.style.display = 'none';
    this.imageFallbacks[slug] = true;
  }
}

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  styleUrls: ['./shop/page.css'],
  template: `
    <div class="container animate-fade-in shopPage">
      <div class="shopHeader"><span class="shopSubtitle">Jay Bhavani Catalog</span><h1 class="serif-title">Our Collection</h1><p class="shopDesc">Browse through our authentic 22K Gold and Diamond signature pieces.</p></div>
      <section *ngIf="activeCategory" class="categoryHero"><img [src]="activeCategory.image" [alt]="activeCategory.name" class="categoryHeroImage">
        <div class="categoryHeroContent"><span class="categoryHeroLabel">Category collection</span><h2 class="serif-title">{{ activeCategory.name }}</h2><p>{{ products.length }} designs</p></div></section>
      <div class="shopLayout">
        <aside class="sidebar glassmorphism">
          <div class="sidebarHeader"><h3 class="serif-title">Filter By</h3><button type="button" class="clearBtn" (click)="clearFilters()">Clear All</button></div>
          <div class="filterSection"><label class="form-label" for="shop-search">Search Ornaments</label><input id="shop-search" class="form-control" [(ngModel)]="search" (ngModelChange)="loadProducts()" placeholder="e.g. Kundan, Ring..."></div>
          <div class="filterSection"><label class="form-label">Category</label><div class="radioList">
            <button *ngFor="let item of categories" type="button" class="filterBtn" [class.filterBtnActive]="category === item.value" (click)="category = item.value; loadProducts()">{{ item.name }}</button>
          </div></div>
          <div class="filterSection"><label class="form-label" for="shop-metal">Metal Type</label><select id="shop-metal" class="form-control" [(ngModel)]="metal" (ngModelChange)="loadProducts()">
            <option value="all">All Metals</option><option value="Gold">Gold</option><option value="Diamond">Diamond</option><option value="Precious Stones">Precious Stones</option>
          </select></div>
          <div class="filterSection"><label class="form-label" for="shop-sort">Sort By</label><select id="shop-sort" class="form-control" [(ngModel)]="sortBy" (ngModelChange)="sortProducts()">
            <option value="none">Default Sorting</option><option value="weight-asc">Weight: Low to High</option><option value="weight-desc">Weight: High to Low</option><option value="name-asc">Alphabetical: A-Z</option>
          </select></div>
        </aside>
        <section class="gridSection"><div class="gridHeader"><p class="resultsCount">Showing <strong>{{ products.length }}</strong> items</p></div>
          <div *ngIf="loading" class="statusBox"><div class="spinner"></div><p>Fetching master creations...</p></div>
          <div *ngIf="!loading && !products.length" class="emptyBox"><p>No jewellery matches your current selection.</p><button type="button" class="outline-btn" (click)="clearFilters()">View All Ornaments</button></div>
          <div *ngIf="!loading && products.length" class="productsGrid">
            <article *ngFor="let product of products" class="shopCard card">
              <a [routerLink]="['/product', product.id]" class="imgLink"><div class="imgWrapper"><img [src]="product.image" [alt]="product.name" class="productImg" loading="lazy"><span class="purityTag">{{ product.purity }}</span></div></a>
              <div class="details"><span class="categoryLabel">{{ product.categoryName }}</span><h3 class="name">{{ product.name }}</h3><p class="specs">{{ product.weight }} grams | {{ product.metal }}</p>
                <div class="cardFooter"><a [routerLink]="['/product', product.id]" class="gold-btn">View Details &amp; Enquire</a><button class="outline-btn" type="button" [class.isSaved]="isWishlisted(product.id)" [attr.aria-pressed]="isWishlisted(product.id)" [attr.aria-label]="(isWishlisted(product.id) ? 'Remove ' : 'Save ') + product.name + (isWishlisted(product.id) ? ' from' : ' to') + ' wishlist'" (click)="toggleWishlist(product)">{{ isWishlisted(product.id) ? '♥' : '♡' }}</button></div></div>
            </article>
          </div>
        </section>
      </div>
    </div>
  `,
  styles: [`.shopPage{padding:3rem 2rem 5rem}.shopHeader h1{font-size:2.5rem;margin-bottom:.5rem}.shopHeader{text-align:center;margin-bottom:3rem}.categoryHeroImage{width:100%;height:100%;object-fit:cover;position:absolute}.sidebarHeader{display:flex;justify-content:space-between;align-items:center}.cardFooter{display:flex;gap:.6rem;align-items:center}.cardFooter .gold-btn{flex:1;text-align:center}.cardFooter .outline-btn{min-width:44px;padding:.5rem}.cardFooter .outline-btn.isSaved{background:var(--accent-gold-light)}`],
})
export class ShopPageComponent implements OnInit, OnDestroy {
  readonly categories = [{ name: 'All Collection', value: 'all' }, ...CATEGORY_LIST.map(({ name, slug }) => ({ name, value: slug }))];
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
    this.api.products({ search: this.search, category: this.category, metal: this.metal })
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

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  styleUrls: ['./product/[id]/page.css'],
  template: `
    <div *ngIf="loading" class="page-loader"><div class="loader-content"><div class="loader-spinner"></div><p class="loader-text">Loading Product Details...</p></div></div>
    <div *ngIf="!loading && !product" class="container productError"><h2 class="serif-title">Product not found</h2><p>{{ errorText }}</p><a routerLink="/shop" class="gold-btn">Back to Shop Catalog</a></div>
    <ng-container *ngIf="product as item">
      <div class="container productPage">
        <nav class="breadcrumbs"><a routerLink="/">Home</a> / <a routerLink="/shop">Shop</a> / <a [routerLink]="['/shop']" [queryParams]="{ category: item.category }">{{ item.categoryName }}</a> / {{ item.name }}</nav>
        <div class="detailLayout">
          <div class="imageGallery"><div class="mainImageWrapper glassmorphism"><img [src]="item.image" [alt]="item.name" class="mainImage"><span class="purityBadge">{{ item.purity }} Purity</span></div></div>
          <div class="infoDetails"><span class="categoryTag">{{ item.categoryName }}</span><h1 class="productName serif-title">{{ item.name }}</h1>
            <div class="specificationBox"><h3 class="specTitle">Specifications</h3><table class="specTable"><tbody>
              <tr><td>Product ID</td><td><strong>#{{ item.id }}</strong></td></tr><tr><td>Metal Type</td><td>{{ item.metal }}</td></tr>
              <tr><td>Gold Purity</td><td>{{ item.purity }} (Hallmarked)</td></tr><tr><td>Gross Weight</td><td><strong>{{ item.weight }} grams</strong></td></tr>
              <tr><td>Making Charges</td><td>{{ item.makingCharges }}%</td></tr>
            </tbody></table></div>
            <div class="descriptionSection"><p>{{ item.description }}</p></div>
            <div *ngIf="price as breakdown" class="priceBox glassmorphism">
              <div class="priceHeader"><span class="pricingTitle">Estimated Value Breakdown</span><span class="liveTag">Live Rates Applied</span></div>
              <div class="priceRow"><span>Base Metal Value ({{ item.weight }}g @ ₹{{ breakdown.ratePerGram }}/g)</span><span>{{ money(breakdown.metalValue) }}</span></div>
              <div *ngIf="breakdown.diamondValue > 0" class="priceRow"><span>Diamond Gem Charges</span><span>{{ money(breakdown.diamondValue) }}</span></div>
              <div class="priceRow"><span>Making Charges ({{ item.makingCharges }}%)</span><span>{{ money(breakdown.makingCharges) }}</span></div>
              <div class="priceRow"><span>GST (3%)</span><span>{{ money(breakdown.gst) }}</span></div>
              <div class="priceRow totalRow"><span>Total Approximate Price</span><span class="gold-text">{{ money(breakdown.total) }}</span></div>
              <p class="priceNotice">*Calculations are approximate. Final pricing depends on the current rate at time of purchase.</p>
            </div>
            <div class="detailInquiryForm glassmorphism"><h3 class="serif-title">Send enquiry for this piece</h3>
              <div *ngIf="statusMessage" class="statusMsg" [class.successMsg]="statusSuccess" [class.errorMsg]="!statusSuccess">{{ statusMessage }}</div>
              <form (ngSubmit)="submitInquiry()">
                <div class="grid-2 inquiryFields"><div class="form-group"><label class="form-label" for="product-name">Name *</label><input id="product-name" class="form-control" name="name" [(ngModel)]="form.name" required placeholder="Your name"></div>
                  <div class="form-group"><label class="form-label" for="product-phone">Phone *</label><input id="product-phone" class="form-control" name="phone" type="tel" [(ngModel)]="form.phone" required placeholder="Mobile number"></div></div>
                <div class="form-group"><label class="form-label" for="product-email">Email</label><input id="product-email" class="form-control" name="email" type="email" [(ngModel)]="form.email" placeholder="Email address"></div>
                <div class="form-group"><label class="form-label" for="product-message">Inquiry Message *</label><textarea id="product-message" class="form-control" name="message" rows="3" [(ngModel)]="form.message" required></textarea></div>
                <p class="loginNote">Login is optional and never required for a price quote or showroom visit.</p>
                <button type="submit" class="outline-btn" [disabled]="submitting">{{ submitting ? 'Sending Request...' : 'Send Enquiry' }}</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </ng-container>
  `,
  styles: [`.productPage{padding:1.5rem 2rem 5rem}.breadcrumbs{margin-bottom:1.5rem;color:var(--text-muted);font-size:.85rem}.productError{text-align:center;padding:8rem 2rem}.productError p{margin:1rem 0 2rem}.inquiryFields{gap:1rem;margin-bottom:.8rem}.detailInquiryForm h3{font-size:1.1rem;margin-bottom:1.2rem;color:var(--accent-gold)}.detailInquiryForm button{width:100%;padding:.6rem}.detailInquiryForm textarea{padding:.6rem .8rem;font-size:.9rem}`],
})
export class ProductPageComponent implements OnInit, OnDestroy {
  product: Product | null = null;
  rates: GoldRates | null = null;
  loading = true;
  submitting = false;
  errorText = '';
  statusMessage = '';
  statusSuccess = false;
  form = { name: '', phone: '', email: '', message: '' };
  private routeSubscription?: Subscription;

  constructor(private readonly api: ApiService, private readonly route: ActivatedRoute) {}

  get price(): { ratePerGram: number; metalValue: number; diamondValue: number; makingCharges: number; gst: number; total: number } | null {
    if (!this.product || !this.rates) return null;
    const item = this.product;
    const metal = item.metal.toLowerCase();
    const rate = metal.includes('silver') ? this.rates.silver
      : metal.includes('diamond') ? this.rates.gold18k
        : item.purity === '22K' ? this.rates.gold22k
          : item.purity === '18K' ? this.rates.gold18k : this.rates.gold24k;
    const metalValue = item.weight * rate;
    const diamondValue = metal.includes('diamond') ? item.weight * 12000 : 0;
    const makingCharges = metalValue * item.makingCharges / 100;
    const gst = (metalValue + makingCharges + diamondValue) * 0.03;
    return {
      ratePerGram: Math.round(rate), metalValue: Math.round(metalValue), diamondValue: Math.round(diamondValue),
      makingCharges: Math.round(makingCharges), gst: Math.round(gst),
      total: Math.round(metalValue + makingCharges + diamondValue + gst),
    };
  }

  ngOnInit(): void {
    this.routeSubscription = this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) this.load(id);
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
  }

  private load(id: string): void {
    this.loading = true;
    this.api.product(id).subscribe({
      next: (result) => {
        this.product = result.success ? result.product ?? null : null;
        this.errorText = result.error || 'The requested product could not be found.';
        if (this.product) {
          this.form.message = `Hello, I am interested in inquiring about "${this.product.name}" (Product ID: ${this.product.id}, Weight: ${this.product.weight}g). Please provide availability details.`;
          this.api.goldRates().subscribe({
            next: (rateResult) => { this.rates = rateResult.rates; },
            error: (error: unknown) => console.error('Unable to load current gold rates.', error),
          });
        }
        this.loading = false;
      },
      error: (error: unknown) => {
        this.errorText = errorMessage(error, 'Failed to load product details.');
        this.product = null;
        this.loading = false;
      },
    });
  }

  submitInquiry(): void {
    if (!this.product) return;
    if (!this.form.name.trim() || !this.form.phone.trim() || !this.form.message.trim()) {
      this.statusMessage = 'Please fill in all required fields.';
      this.statusSuccess = false;
      return;
    }
    this.submitting = true;
    this.statusMessage = '';
    this.api.submitInquiry({ ...this.form, productId: this.product.id, productName: this.product.name }).subscribe({
      next: (result) => {
        this.statusSuccess = result.success;
        this.statusMessage = result.success
          ? `Thank you! Your product enquiry has been sent. We will get back to you shortly or call you at ${SHOP_PHONE_DISPLAY}.`
          : result.error || 'Failed to submit enquiry.';
        if (result.success && result.notifyUrl) window.open(result.notifyUrl, '_blank', 'noopener,noreferrer');
        this.submitting = false;
      },
      error: (error: unknown) => {
        this.statusSuccess = false;
        this.statusMessage = errorMessage(error, 'An error occurred. Please try again.');
        this.submitting = false;
      },
    });
  }

  money(value: number): string {
    return `₹${value.toLocaleString('en-IN')}`;
  }
}

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  styleUrls: ['./auth/register/page.css'],
  template: `
    <div class="authShell animate-fade-in">
      <div *ngIf="statusMessage" class="toast" [class.success]="statusSuccess" [class.error]="!statusSuccess"><span>{{ statusMessage }}</span></div>
      <div class="authCard">
        <div class="authCardHeader"><span class="kicker">{{ mode === 'register' ? 'Client Registration' : 'Client Login' }}</span><button class="themeToggle" type="button" (click)="toggleTheme()">{{ dark ? '🌙 Dark' : '☀️ Light' }}</button></div>
        <h1 class="serif-title">{{ mode === 'register' ? 'Create Account' : 'Welcome Back' }}</h1>
        <p class="subtitle">{{ mode === 'register' ? 'Register your account to continue shopping and manage your jewellery enquiries.' : 'Login with your registered email or name to continue shopping.' }}</p>
        <form (ngSubmit)="submit()" class="form">
          <div *ngIf="mode === 'register'" class="form-group"><label class="form-label" for="client-name">Full Name</label><input id="client-name" class="form-control" name="name" [(ngModel)]="name" required placeholder="Enter your name"></div>
          <div class="form-group"><label class="form-label" [for]="mode === 'register' ? 'client-email' : 'client-identifier'">{{ mode === 'register' ? 'Email Address' : 'Email or Name' }}</label><input [id]="mode === 'register' ? 'client-email' : 'client-identifier'" class="form-control" [type]="mode === 'register' ? 'email' : 'text'" name="identifier" [(ngModel)]="identifier" required [placeholder]="mode === 'register' ? 'Enter your email' : 'Enter your registered email or name'"></div>
          <div class="form-group"><label class="form-label" for="client-password">Password</label><div class="passwordWrap"><input id="client-password" class="form-control" [type]="showPassword ? 'text' : 'password'" name="password" [(ngModel)]="password" required [placeholder]="mode === 'register' ? 'Create a password' : 'Enter your password'"><button type="button" class="eyeButton" (click)="showPassword = !showPassword">{{ showPassword ? '🙈' : '👁️' }}</button></div></div>
          <button type="submit" class="gold-btn authSubmit" [disabled]="busy">{{ busy ? (mode === 'register' ? 'Creating account...' : 'Logging in...') : (mode === 'register' ? 'Register' : 'Login') }}</button>
        </form>
        <div class="footerRow"><span>{{ mode === 'register' ? 'Already have an account?' : "Don't have an account?" }}</span><a *ngIf="mode === 'register'; else registerLink" routerLink="/auth/login" class="linkText">Login here</a><ng-template #registerLink><a routerLink="/auth/register" class="linkText">Register now</a></ng-template></div>
      </div>
    </div>
  `,
  styles: [`.authCardHeader{display:flex;justify-content:space-between;align-items:center;margin-bottom:.5rem}.authSubmit{width:100%}`],
})
export class AuthPageComponent implements OnInit {
  mode: 'login' | 'register' = 'login';
  name = '';
  identifier = '';
  password = '';
  busy = false;
  showPassword = false;
  dark = false;
  statusMessage = '';
  statusSuccess = false;

  constructor(private readonly route: ActivatedRoute, private readonly router: Router) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => this.mode = data['mode'] === 'register' ? 'register' : 'login');
    this.dark = localStorage.getItem('jay_bhavani_theme') === 'dark';
  }

  submit(): void {
    this.busy = true;
    const result = this.mode === 'register'
      ? registerClient(this.name, this.identifier, this.password)
      : loginClient(this.identifier, this.password);
    this.statusSuccess = result.success;
    this.statusMessage = result.message;
    this.busy = false;
    if (result.success && this.mode === 'register') {
      const login = loginClient(this.identifier, this.password);
      if (!login.success) {
        this.statusSuccess = false;
        this.statusMessage = login.message;
        return;
      }
    }
    if (result.success) {
      window.dispatchEvent(new Event('client-auth-updated'));
      window.setTimeout(() => void this.router.navigate(['/shop']), 800);
    }
  }

  toggleTheme(): void {
    this.dark = !this.dark;
    const theme = this.dark ? 'dark' : 'light';
    localStorage.setItem('jay_bhavani_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
    window.dispatchEvent(new Event('theme-updated'));
  }
}

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  styleUrls: ['./wishlist/page.css'],
  template: `
    <div class="container wishlistPage">
      <div class="header"><span class="kicker">My Shortlist</span><h1 class="serif-title">My Wishlist</h1><p class="desc">Save designs you love and share your shortlist on WhatsApp before your showroom visit. No login required — saved in your browser.</p></div>
      <div *ngIf="!items.length" class="empty"><p>Your wishlist is empty. Browse our collection and tap ♡ on any design.</p><a routerLink="/shop" class="gold-btn">Explore Collection</a></div>
      <ng-container *ngIf="items.length">
        <div class="actions"><p><strong>{{ items.length }}</strong> design{{ items.length !== 1 ? 's' : '' }} saved</p><a [href]="shareUrl" target="_blank" rel="noreferrer" class="gold-btn">Share on WhatsApp</a></div>
        <div class="grid"><article *ngFor="let item of items" class="card wishlistCard">
          <a [routerLink]="['/product', item.id]" class="imgLink"><div class="imgWrap"><img [src]="item.image" [alt]="item.name" class="img" loading="lazy"></div></a>
          <div class="details"><span class="category">{{ item.categoryName }}</span><h3>{{ item.name }}</h3><p>{{ item.weight }}g · {{ item.purity }}</p><a [routerLink]="['/product', item.id]" class="viewLink">View Details →</a>
            <button type="button" class="outline-btn removeWish" (click)="remove(item.id)">Remove</button></div>
        </article></div>
        <p class="loginNote"><a routerLink="/auth/login">Login</a> to save your wishlist permanently across devices — optional, never required.</p>
      </ng-container>
    </div>
  `,
  styles: [`.wishlistPage{padding:3rem 2rem 5rem}.header{text-align:center}.header h1{font-size:2.4rem;margin-bottom:.5rem}.actions{display:flex;justify-content:space-between;align-items:center;margin:2rem 0}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:1.4rem}.wishlistCard .imgWrap{aspect-ratio:1;overflow:hidden}.wishlistCard .img{width:100%;height:100%;object-fit:cover}.details{padding:1rem}.removeWish{margin-top:.75rem}`],
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

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  styleUrls: ['./admin/page.css'],
  template: `
    <div class="container adminPage">
      <div *ngIf="authLoading" class="statusBox"><div class="spinner"></div><p>Checking admin access...</p></div>
      <ng-container *ngIf="!authLoading && !isAdmin">
        <div *ngIf="statusMessage" class="toast" [class.success]="statusSuccess" [class.error]="!statusSuccess">{{ statusMessage }}</div>
        <div class="authCard"><span class="adminSubtitle">Restricted Access</span><h1 class="serif-title">Admin Login</h1><p class="adminDesc">Use the protected admin account to launch the control dashboard.</p>
          <form (ngSubmit)="login()" class="loginForm">
            <div class="form-group"><label class="form-label" for="admin-username">Username</label><input id="admin-username" class="form-control" name="username" autocomplete="username" [(ngModel)]="credentials.username" required></div>
            <div class="form-group"><label class="form-label" for="admin-password">Password</label><div class="passwordWrap"><input id="admin-password" class="form-control" [type]="showPassword ? 'text' : 'password'" name="password" autocomplete="current-password" [(ngModel)]="credentials.password" required><button type="button" class="eyeButton" (click)="showPassword = !showPassword">{{ showPassword ? 'Hide' : 'Show' }}</button></div></div>
            <button type="submit" class="gold-btn adminSubmit" [disabled]="submitting">{{ submitting ? 'Signing in...' : 'Login as Admin' }}</button>
          </form>
        </div>
      </ng-container>
      <ng-container *ngIf="!authLoading && isAdmin">
        <div class="adminHeader"><div><span class="adminSubtitle">Jay Bhavani Administration</span><h1 class="serif-title">Customer Inquiries</h1><p class="adminDesc">Manage, check, and follow up on customer product callback requests and web forms.</p></div>
          <button type="button" class="outline-btn" (click)="logout()">Logout Admin</button></div>
        <div class="controlPanel glassmorphism"><div class="searchControl"><label class="form-label" for="inquiry-search">Search Submissions</label><input id="inquiry-search" class="form-control" [(ngModel)]="searchTerm" placeholder="Search by customer name, phone, product ID..."></div><div class="statBox"><span class="statLabel">Total Submissions</span><span class="statCount">{{ filteredInquiries.length }}</span></div></div>
        <div *ngIf="loading" class="statusBox"><div class="spinner"></div><p>Retrieving secure submissions from database...</p></div>
        <div *ngIf="!loading && !filteredInquiries.length" class="emptyBox"><p>No customer inquiries found.</p></div>
        <div *ngIf="!loading && filteredInquiries.length" class="inquiriesContainer">
          <article *ngFor="let inquiry of filteredInquiries" class="inquiryCard glassmorphism">
            <div class="cardHeader"><div class="customerMeta"><h3 class="customerName">{{ inquiry.name }}</h3><div class="badgeRow"><span class="badge phoneBadge">📞 {{ inquiry.phone }}</span><span *ngIf="inquiry.email" class="badge emailBadge">✉️ {{ inquiry.email }}</span></div></div>
              <div class="timeMeta"><span class="dateLabel">{{ inquiry.createdAt | date:'medium' }}</span><span class="statusLabel pendingStatus">{{ inquiry.status }}</span></div></div>
            <div class="cardBody"><div *ngIf="inquiry.productId" class="productTagLine"><span>Product Interest: </span><a [routerLink]="['/product', inquiry.productId]" class="prodLink">{{ inquiry.productName || 'Product #' + inquiry.productId }} (ID: #{{ inquiry.productId }}) →</a></div>
              <div class="messageBox"><strong>Inquiry Message:</strong><p class="messageText">“{{ inquiry.message }}”</p></div></div>
            <div class="cardFooter"><a [href]="'tel:' + inquiry.phone" class="outline-btn">Call Client</a><a [href]="whatsapp(inquiry.phone)" target="_blank" rel="noopener noreferrer" class="gold-btn">WhatsApp Follow Up</a></div>
          </article>
        </div>
        <div *ngIf="statusMessage" class="toast" [class.success]="statusSuccess" [class.error]="!statusSuccess">{{ statusMessage }}</div>
      </ng-container>
    </div>
  `,
  styles: [`.adminPage{padding:3rem 2rem 5rem}.authCard{max-width:560px;margin:2rem auto}.authCard h1{font-size:2.1rem;margin:.8rem 0}.adminSubmit{width:100%}.adminHeader{display:flex;justify-content:space-between;gap:1rem;align-items:center;margin-bottom:2rem}.adminHeader h1{font-size:2.5rem;margin:.5rem 0}.controlPanel{display:flex;gap:2rem;align-items:end;padding:1.2rem;margin-bottom:2rem}.searchControl{flex:1}.inquiriesContainer{display:grid;gap:1rem}.cardHeader{display:flex;justify-content:space-between;gap:1rem}.cardBody{padding:1.2rem 0}.cardFooter{display:flex;gap:.8rem}.messageText{white-space:pre-wrap}.toast{position:fixed;top:6rem;right:1.5rem;background:var(--bg-secondary);padding:1rem;border:1px solid var(--border-color);z-index:1200}.toast.error{color:var(--error)}.toast.success{color:var(--success)}@media(max-width:700px){.adminHeader,.controlPanel,.cardHeader{align-items:stretch;flex-direction:column}.adminPage{padding:2rem 1rem}}`],
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
    return this.inquiriesList.filter((item) =>
      item.name.toLowerCase().includes(term) || item.phone.includes(term) ||
      (item.productName || '').toLowerCase().includes(term) ||
      (item.productId || '').includes(term) || item.message.toLowerCase().includes(term),
    );
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

  private loadInquiries(): void {
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
      error: (error: unknown) => this.status(false, errorMessage(error, 'Unable to log out. Please try again.')),
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

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `<div class="container" style="padding:8rem 2rem;text-align:center"><h1 class="serif-title">Page not found</h1><p style="margin:1rem 0 2rem">The page you are looking for does not exist.</p><a routerLink="/" class="gold-btn">Return Home</a></div>`,
})
export class NotFoundPageComponent {}
