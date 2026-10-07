import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { DEFAULT_WHATSAPP_URL, INSTAGRAM_URL, SHOP_PHONE_DISPLAY, SHOP_WHATSAPP } from '../lib/config';
import { clearClientSession, getClientSession } from '../lib/client-auth';
import { getWishlist } from '../lib/client-wishlist';

@Component({
  selector: 'jb-root',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  styleUrls: ['../components/Navbar.css', '../components/ThemeToggle.css'],
  template: `
    <header class="header" [class.scrolled]="scrolled">
      <div class="container navbar-container">
        <a routerLink="/" class="logo" (click)="closeMenu()">
          <span class="logoText">JAY BHAVANI</span><span class="logoSubtext">ORNAMENTS</span>
        </a>
        <nav class="desktopNav" aria-label="Main navigation">
          <a routerLink="/" class="navLink" [class.active]="pathname === '/'">Home</a>
          <a routerLink="/shop" class="navLink" [class.active]="pathname.startsWith('/shop')">Collections</a>
          <a routerLink="/shop" [queryParams]="{ category: 'bridal-sets' }" class="navLink">Bridal</a>
          <a href="/#rates-section" class="navLink">Gold Rates</a>
          <a href="/#about" class="navLink">About Us</a>
          <a href="/#contact" class="navLink">Contact</a>
        </nav>
        <div class="rightActions">
          <a routerLink="/wishlist" class="wishlistLink" aria-label="My Wishlist">
            <span class="wishlistIcon">♡</span>
            <span *ngIf="wishlistCount > 0" class="wishlistBadge">{{ wishlistCount }}</span>
            <span class="wishlistLabel">Wishlist</span>
          </a>
          <button type="button" class="themeToggle" (click)="toggleTheme()" [attr.aria-label]="themeLabel">
            <span class="iconWrap">{{ isDark ? '🌙' : '☀️' }}</span><span class="label">{{ isDark ? 'Dark' : 'Light' }}</span>
          </button>
          <ng-container *ngIf="clientUser; else loginLink">
            <span class="userBadge" [title]="clientUser.email || clientUser.name">👤 {{ clientUser.name }}</span>
            <button type="button" class="logoutBtn" (click)="logout()">Logout</button>
          </ng-container>
          <ng-template #loginLink><a routerLink="/auth/login" class="authLink">Login</a></ng-template>
          <a [href]="whatsappUrl" target="_blank" rel="noreferrer" class="gold-btn navbar-whatsapp">WhatsApp</a>
        </div>
        <button type="button" class="hamburger" [class.hamburgerActive]="menuOpen" (click)="toggleMenu()" aria-label="Toggle Menu">
          <span class="bar"></span><span class="bar"></span><span class="bar"></span>
        </button>
        <div class="mobileDrawer" [class.drawerOpen]="menuOpen">
          <nav class="mobileNav" aria-label="Mobile navigation">
            <a routerLink="/" class="mobileNavLink" (click)="closeMenu()">Home</a>
            <a routerLink="/shop" class="mobileNavLink" (click)="closeMenu()">Collections</a>
            <a routerLink="/shop" [queryParams]="{ category: 'bridal-sets' }" class="mobileNavLink" (click)="closeMenu()">Bridal</a>
            <a href="/#rates-section" class="mobileNavLink" (click)="closeMenu()">Gold Rates</a>
            <a href="/#about" class="mobileNavLink" (click)="closeMenu()">About Us</a>
            <a href="/#contact" class="mobileNavLink" (click)="closeMenu()">Contact</a>
            <a routerLink="/wishlist" class="mobileNavLink" (click)="closeMenu()">♡ Wishlist {{ wishlistCount ? '(' + wishlistCount + ')' : '' }}</a>
            <button type="button" class="themeToggle" (click)="toggleTheme()">{{ isDark ? '🌙 Dark' : '☀️ Light' }}</button>
            <div class="mobileAuthGroup">
              <ng-container *ngIf="clientUser; else mobileAuthLinks">
                <span class="userBadge">👤 {{ clientUser.name }}</span>
                <button type="button" class="logoutBtn" (click)="logout()">Logout</button>
              </ng-container>
              <ng-template #mobileAuthLinks>
                <a routerLink="/auth/login" class="authLink" (click)="closeMenu()">Login</a>
                <a routerLink="/auth/register" class="authLink" (click)="closeMenu()">Register</a>
              </ng-template>
            </div>
            <a [href]="whatsappUrl" target="_blank" rel="noreferrer" class="gold-btn" (click)="closeMenu()">WhatsApp</a>
          </nav>
        </div>
      </div>
    </header>

    <main class="app-main">
      <router-outlet></router-outlet>
    </main>

    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <section class="brand">
            <a routerLink="/" class="logo"><span class="logoText">JAY BHAVANI</span><span class="logoSubtext">ORNAMENTS</span></a>
            <p class="description">Digital Showroom + WhatsApp Sales Machine — premium 22K gold, bridal and antique jewellery in Kamrej, Surat.</p>
            <div class="social">
              <a [href]="whatsappUrl" target="_blank" rel="noopener noreferrer">WhatsApp</a>
              <a [href]="instagramUrl" target="_blank" rel="noopener noreferrer">Instagram</a>
              <a href="https://maps.google.com/?q=Shop%20No.%20103%2C%20Vastu%20Palace-B%2C%20Pasodra%20Patiya%2C%20Kamrej%2C%20Surat" target="_blank" rel="noopener noreferrer">Maps</a>
            </div>
          </section>
          <section class="links">
            <h3 class="title">Categories</h3>
            <ul class="list categoryList">
              <li *ngFor="let category of footerCategories"><a [routerLink]="['/shop']" [queryParams]="{ category: category.slug }">{{ category.name }}</a></li>
            </ul>
          </section>
          <section class="links">
            <h3 class="title">Quick Links</h3>
            <ul class="list">
              <li><a routerLink="/">Home</a></li><li><a routerLink="/shop">Collections</a></li>
              <li><a href="/#rates-section">Gold Rates</a></li><li><a href="/#about">About Us</a></li>
              <li><a routerLink="/wishlist">My Wishlist</a></li>
            </ul>
          </section>
          <section class="contact">
            <h3 class="title">Our Boutique</h3>
            <p class="contactItem"><strong>Address:</strong> Jay Bhavani Ornaments, Shop No. 103, Vastu Palace-B, Pasodra Patiya, Kamrej, Surat.</p>
            <p class="contactItem"><strong>Phone:</strong> <a [href]="'tel:+' + shopWhatsapp">{{ shopPhone }}</a></p>
            <p class="contactItem"><strong>Email:</strong> info&#64;jaybhavani_ornaments.com</p>
            <p class="contactItem"><strong>Hours:</strong> Mon – Sat: 11:00 AM – 8:30 PM</p>
          </section>
        </div>
        <div class="bottom">
          <p>© {{ year }} Jay Bhavani Ornaments. All rights reserved.</p>
          <button type="button" class="themeToggle" (click)="toggleTheme()">{{ isDark ? '🌙 Dark' : '☀️ Light' }}</button>
        </div>
      </div>
    </footer>
    <a [href]="whatsappUrl" class="floating-whatsapp" target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp">WhatsApp</a>
  `,
  styles: [`
    :host { display:flex; flex-direction:column; min-height:100vh; }
    .app-main { margin-top: var(--header-height); flex: 1; }
    .navbar-container { display:flex; align-items:center; justify-content:space-between; gap:1rem; }
    .navbar-whatsapp { padding:.55rem 1.3rem; font-size:.78rem; }
    .footer { background:var(--bg-secondary); border-top:1px solid var(--border-color); padding:5rem 0 2rem; color:var(--text-secondary); }
    .footer .container { display:block; }
    .footer-grid { display:grid; grid-template-columns:1.5fr 1fr 1fr 1.3fr; gap:2rem; }
    .bottom { display:flex; align-items:center; justify-content:space-between; gap:1rem; padding:1.5rem 0 5rem; border-top:1px solid var(--border-color); }
    .footer .logo { display:flex; flex-direction:column; margin-bottom:1rem; }
    .footer .logoText { font-family:var(--font-serif); color:var(--accent-gold); font-size:1.5rem; font-weight:700; letter-spacing:.1em; }
    .footer .logoSubtext { color:var(--text-secondary); font-size:.65rem; letter-spacing:.35em; }
    .description { color:var(--text-muted); margin-bottom:1rem; }
    .social { display:flex; gap:1rem; }
    .title { color:var(--text-primary); font-family:var(--font-serif); margin-bottom:1rem; }
    .list { list-style:none; display:grid; gap:.5rem; }
    .categoryList { grid-template-columns:repeat(2,minmax(0,1fr)); align-content:start; column-gap:1rem; }
    .categoryList a { display:block; overflow-wrap:anywhere; }
    .list a:hover,.social a:hover { color:var(--accent-gold); }
    .contactItem { margin-bottom:.75rem; color:var(--text-muted); }
    @media (max-width: 980px) { .footer-grid { grid-template-columns:repeat(2,minmax(0,1fr)); } }
    @media (max-width: 740px) { .footer-grid { grid-template-columns:1fr; } .bottom { flex-direction:column; } }
  `],
})
export class AppComponent implements OnInit {
  readonly whatsappUrl = DEFAULT_WHATSAPP_URL;
  readonly instagramUrl = INSTAGRAM_URL;
  readonly shopPhone = SHOP_PHONE_DISPLAY;
  readonly shopWhatsapp = SHOP_WHATSAPP;
  readonly year = new Date().getFullYear();
  readonly footerCategories = [
    { name: 'Rings', slug: 'rings' }, { name: 'Necklaces & Har', slug: 'necklaces' },
    { name: 'Earrings', slug: 'earrings' }, { name: 'Bangles & Bracelets', slug: 'bangles' },
    { name: 'Mangalsutras', slug: 'mangalsutra' }, { name: 'Bridal Sets', slug: 'bridal-sets' },
    { name: 'Silver Jewellery', slug: 'silver' }, { name: 'Temple Jewellery', slug: 'temple' },
    { name: 'Kundan Jewellery', slug: 'kundan' }, { name: 'Pendant Sets', slug: 'pendants' },
    { name: 'Chains', slug: 'chains' }, { name: 'Anklets (Payal)', slug: 'anklets' },
    { name: 'Nose Pins', slug: 'nose-pins' }, { name: 'Brooches', slug: 'brooches' },
    { name: 'Kamarband', slug: 'kamarband' }, { name: 'Hair Accessories', slug: 'hair-accessories' },
    { name: "Men's Jewellery", slug: 'mens-jewellery' }, { name: 'Gold Coins', slug: 'gold-coins' },
    { name: 'Religious Items', slug: 'religious' }, { name: 'Lockets', slug: 'lockets' },
    { name: 'Solitaires', slug: 'solitaires' }, { name: 'Antique Jewellery', slug: 'antique' },
  ];
  pathname = '/';
  menuOpen = false;
  scrolled = false;
  wishlistCount = 0;
  clientUser: { name: string; email?: string } | null = null;
  isDark = false;
  themeLabel = 'Switch to dark theme';

  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    this.pathname = this.router.url.split('?')[0] || '/';
    this.isDark = localStorage.getItem('jay_bhavani_theme') === 'dark';
    this.applyTheme();
    this.refreshClientState();
    this.router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        const [urlPath, fragment] = event.urlAfterRedirects.split('#');
        this.pathname = urlPath.split('?')[0] || '/';
        this.closeMenu();
        if (fragment) {
          document.getElementById(decodeURIComponent(fragment))?.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    window.addEventListener('wishlist-updated', this.refreshClientState);
    window.addEventListener('client-auth-updated', this.refreshClientState);
    window.addEventListener('storage', this.refreshClientState);
    window.addEventListener('storage', this.refreshTheme);
    window.addEventListener('theme-updated', this.refreshTheme);
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled = window.scrollY > 50;
  }

  private readonly refreshClientState = (): void => {
    this.wishlistCount = getWishlist().length;
    this.clientUser = getClientSession();
  };

  private readonly refreshTheme = (): void => {
    this.isDark = localStorage.getItem('jay_bhavani_theme') === 'dark';
    this.applyTheme();
  };

  private applyTheme(): void {
    const theme = this.isDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
    this.themeLabel = `Switch to ${this.isDark ? 'light' : 'dark'} theme`;
  }

  toggleTheme(): void {
    this.isDark = !this.isDark;
    localStorage.setItem('jay_bhavani_theme', this.isDark ? 'dark' : 'light');
    this.applyTheme();
    window.dispatchEvent(new Event('theme-updated'));
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
    document.body.style.overflow = this.menuOpen ? 'hidden' : '';
  }

  closeMenu(): void {
    this.menuOpen = false;
    document.body.style.overflow = '';
  }

  logout(): void {
    clearClientSession();
    this.refreshClientState();
    window.dispatchEvent(new Event('client-auth-updated'));
    this.closeMenu();
  }
}
