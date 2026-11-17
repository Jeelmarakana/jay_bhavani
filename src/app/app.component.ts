import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import {
  DEFAULT_WHATSAPP_URL,
  INSTAGRAM_URL,
  SHOP_PHONE_DISPLAY,
  SHOP_WHATSAPP,
} from '../lib/config';
import { clearClientSession, getClientSession } from '../lib/client-auth';
import { getWishlist } from '../lib/client-wishlist';

@Component({
  selector: 'jb-root',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterOutlet],
  styleUrls: ['../components/Navbar.css'],
  template: `
    <header class="header" [class.scrolled]="scrolled">
      <div class="container navbar-container">
        <a routerLink="/" class="logo" (click)="closeMenu()">
          <span class="logoText">JAY BHAVANI</span><span class="logoSubtext">ORNAMENTS</span>
        </a>
        <nav class="desktopNav" aria-label="Main navigation">
          <a routerLink="/" class="navLink" [class.active]="pathname === '/'">Home</a>
          <a routerLink="/shop" class="navLink" [class.active]="pathname.startsWith('/shop')"
            >Collections</a
          >
          <a routerLink="/shop" [queryParams]="{ category: 'bridal-sets' }" class="navLink"
            >Bridal</a
          >
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
          <ng-container *ngIf="clientUser; else loginLink">
            <span class="userBadge" [title]="clientUser.email || clientUser.name"
              >👤 {{ clientUser.name }}</span
            >
            <button type="button" class="logoutBtn" (click)="logout()">Logout</button>
          </ng-container>
          <ng-template #loginLink
            ><a routerLink="/auth/login" class="authLink">Login</a></ng-template
          >
          <a [href]="whatsappUrl" target="_blank" rel="noreferrer" class="gold-btn navbar-whatsapp"
            >WhatsApp</a
          >
        </div>
        <button
          type="button"
          class="hamburger"
          [class.hamburgerActive]="menuOpen"
          (click)="toggleMenu()"
          aria-label="Toggle Menu"
        >
          <span class="bar"></span><span class="bar"></span><span class="bar"></span>
        </button>
        <div class="mobileDrawer" [class.drawerOpen]="menuOpen">
          <nav class="mobileNav" aria-label="Mobile navigation">
            <a routerLink="/" class="mobileNavLink" (click)="closeMenu()">Home</a>
            <a routerLink="/shop" class="mobileNavLink" (click)="closeMenu()">Collections</a>
            <a
              routerLink="/shop"
              [queryParams]="{ category: 'bridal-sets' }"
              class="mobileNavLink"
              (click)="closeMenu()"
              >Bridal</a
            >
            <a href="/#rates-section" class="mobileNavLink" (click)="closeMenu()">Gold Rates</a>
            <a href="/#about" class="mobileNavLink" (click)="closeMenu()">About Us</a>
            <a href="/#contact" class="mobileNavLink" (click)="closeMenu()">Contact</a>
            <a routerLink="/wishlist" class="mobileNavLink" (click)="closeMenu()"
              >♡ Wishlist {{ wishlistCount ? '(' + wishlistCount + ')' : '' }}</a
            >
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
            <a
              [href]="whatsappUrl"
              target="_blank"
              rel="noreferrer"
              class="gold-btn"
              (click)="closeMenu()"
              >WhatsApp</a
            >
          </nav>
        </div>
      </div>
    </header>

    <main class="app-main">
      <router-outlet></router-outlet>
    </main>

    <!-- Jay Bhavani Ornaments Luxury Footer (Structured like BlueStone, Styled to 100% match website UI) -->
    <footer class="jbFooter">
      <div class="jbContainer">

        <!-- Top Brand Row -->
        <div class="jbBrandRow">
          <div class="jbBrandIdentity">
            <a routerLink="/" class="jbLogoLink">
              <span class="jbLogoMain">JAY BHAVANI</span>
              <span class="jbLogoSub">ORNAMENTS • EST. 2005</span>
            </a>
            <p class="jbBrandDesc">
              Exclusive 22K BIS Hallmarked Gold, Antique, Kundan &amp; Bridal Jewellery Digital Showroom in Kamrej, Surat.
            </p>
          </div>
          <div class="jbBrandBadges">
            <div class="jbTrustPill">
              <span class="jbTrustIcon">★</span>
              <div class="jbTrustText">
                <strong>100% Certified</strong>
                <small>BIS 916 Hallmark</small>
              </div>
            </div>
            <div class="jbTrustPill">
              <span class="jbTrustIcon">💎</span>
              <div class="jbTrustText">
                <strong>Lifetime Trust</strong>
                <small>Exchange &amp; Buyback</small>
              </div>
            </div>
          </div>
        </div>

        <!-- 4-Column Structured Grid -->
        <div class="jbGrid">

          <!-- Column 1: ABOUT US & CUSTOMER DELIGHT -->
          <div class="jbCol">
            <div class="jbBlock">
              <h3 class="jbHeading">ABOUT US</h3>
              <ul class="jbList">
                <li><a href="/#about">Who We Are</a></li>
                <li><a routerLink="/shop">Our Signature Collections</a></li>
                <li><a href="/#rates-section">Daily Gold Rates (24K &amp; 22K)</a></li>
                <li><a href="tel:+919054049570">+91 90540 49570 (10 am – 8:30 pm)</a></li>
                <li><a href="mailto:info@jaybhavani-ornaments.com">info&#64;jaybhavani-ornaments.com</a></li>
              </ul>
            </div>

            <div class="jbBlock jbBlockSpaced">
              <h3 class="jbHeading">CUSTOMER DELIGHT</h3>
              <ul class="jbList">
                <li><a href="/#contact">Contact Boutique</a></li>
                <li><a routerLink="/wishlist">Saved Wishlist</a></li>
                <li><a href="tel:+919054049570">📞 +91 90540 49570</a></li>
                <li><a [href]="whatsappUrl" target="_blank" rel="noopener noreferrer">💬 WhatsApp Live Support</a></li>
                <li class="jbMutedText">(10:00 am – 8:30 pm, 7 days a week)</li>
              </ul>
            </div>
          </div>

          <!-- Column 2: POLICIES & SHOP WITH CONFIDENCE -->
          <div class="jbCol">
            <div class="jbBlock">
              <h3 class="jbHeading">POLICIES</h3>
              <ul class="jbList">
                <li><a href="/#about">Heritage &amp; Purity Standards</a></li>
                <li><a routerLink="/shop">Design Philosophy</a></li>
                <li><a href="/#rates-section">Gold Rate Transparency</a></li>
                <li><a href="/#contact">Showroom Visit Guidelines</a></li>
              </ul>
            </div>

            <div class="jbBlock jbBlockSpaced">
              <h3 class="jbHeading">SHOP WITH CONFIDENCE</h3>
              <ul class="jbList">
                <li><span class="jbCheckItem">✓ 100% Certified 22K Hallmarked Gold</span></li>
                <li><span class="jbCheckItem">✓ Lifetime Exchange &amp; Buyback</span></li>
                <li><span class="jbCheckItem">✓ Government Approved BIS 916 Hallmark</span></li>
                <li><span class="jbCheckItem">✓ Transparent Weight &amp; Making Charges</span></li>
                <li><span class="jbCheckItem">✓ Safe &amp; Insured Orders</span></li>
              </ul>
            </div>
          </div>

          <!-- Column 3: JEWELLERY GUIDE -->
          <div class="jbCol">
            <div class="jbBlock">
              <h3 class="jbHeading">JEWELLERY GUIDE</h3>
              <ul class="jbList">
                <li><a routerLink="/shop" [queryParams]="{ category: 'bridal-sets' }">Bridal Sets &amp; Chokers</a></li>
                <li><a routerLink="/shop" [queryParams]="{ category: 'rings' }">Engagement &amp; Solitaire Rings</a></li>
                <li><a routerLink="/shop" [queryParams]="{ category: 'bangles' }">Traditional Gold Bangles &amp; Kadas</a></li>
                <li><a routerLink="/shop" [queryParams]="{ category: 'mangalsutra' }">Designer Mangalsutras</a></li>
                <li><a routerLink="/shop" [queryParams]="{ category: 'temple' }">Temple &amp; Antique Jewellery</a></li>
                <li><a routerLink="/shop" [queryParams]="{ category: 'gold-coins' }">24K Pure Gold Coins</a></li>
                <li><a href="/#rates-section">Purity Guide (24K, 22K, 18K)</a></li>
                <li><a href="/#contact">Custom Wedding Jewellery Orders</a></li>
              </ul>
            </div>
          </div>

          <!-- Column 4: SHOWROOM & NEWSLETTER -->
          <div class="jbCol jbColWide">
            <div class="jbBlock">
              <h3 class="jbHeading">VISIT OUR SHOWROOM</h3>
              <p class="jbTagline">
                Shop No. 103, Vastu Palace-B, Pasodra Patiya, Kamrej, Surat, Gujarat.
              </p>
              <div class="jbStoreBadges">
                <a
                  href="https://maps.google.com/?q=Shop%20No.%20103%2C%20Vastu%20Palace-B%2C%20Pasodra%20Patiya%2C%20Kamrej%2C%20Surat"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="jbStoreBtn"
                >
                  <svg class="jbStoreIcon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  <div class="jbStoreText">
                    <span class="jbStoreSub">SURAT BOUTIQUE</span>
                    <span class="jbStoreMain">Google Maps</span>
                  </div>
                </a>

                <a [href]="whatsappUrl" target="_blank" rel="noopener noreferrer" class="jbStoreBtn">
                  <svg class="jbStoreIcon jbWaColor" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.592 2.654-.696c.969.528 1.905.817 2.806.817 3.18 0 5.767-2.587 5.768-5.766.001-3.182-2.585-5.8-5.768-5.8zm3.376 8.21c-.14.394-.808.734-1.116.78-.309.046-.713.064-2.307-.597-2.036-.845-3.328-2.92-3.429-3.056-.101-.136-.822-1.095-.822-2.088 0-.993.52-1.482.705-1.685.185-.203.404-.254.538-.254.135 0 .27.002.387.007.125.006.292-.047.457.348.169.404.575 1.4.626 1.502.051.102.085.22.017.355-.068.136-.101.22-.203.339-.101.119-.214.265-.305.356-.102.102-.208.213-.09.416.118.203.526.868 1.129 1.405.776.691 1.431.905 1.634 1.006.203.102.322.085.441-.051.118-.135.508-.592.643-.795.135-.203.27-.169.457-.102.186.068 1.185.559 1.388.66.203.102.338.153.388.238.051.084.051.491-.089.885z"/>
                  </svg>
                  <div class="jbStoreText">
                    <span class="jbStoreSub">INSTANT INQUIRY</span>
                    <span class="jbStoreMain">WhatsApp Chat</span>
                  </div>
                </a>
              </div>
            </div>

            <div class="jbBlock jbBlockSpaced">
              <h3 class="jbHeading">SUBSCRIBE TO OUR NEWSLETTER</h3>
              <p class="jbTagline">Be the first to know about new bridal arrivals &amp; daily gold rate updates.</p>
              <form (ngSubmit)="subscribeNewsletter()" class="jbNewsletterForm">
                <input
                  type="email"
                  class="jbNewsletterInput"
                  [(ngModel)]="newsletterEmail"
                  name="email"
                  placeholder="Enter email for our newsletter"
                  required
                />
                <button type="submit" class="jbNewsletterBtn">SUBSCRIBE</button>
              </form>
              <div *ngIf="newsletterSubscribed" class="jbSuccessMsg">
                ✓ Thank you for subscribing to Jay Bhavani updates!
              </div>
            </div>
          </div>
        </div>

        <!-- Divider Line -->
        <div class="jbDivider"></div>

        <!-- Bottom Row -->
        <div class="jbBottomRow">
          <!-- Follow Us on -->
          <div class="jbFollowGroup">
            <span class="jbBottomLabel">Follow us on</span>
            <div class="jbSocialList">
              <a [href]="instagramUrl" target="_blank" rel="noopener noreferrer" class="jbSocialCircle" title="Instagram" aria-label="Instagram">
                <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a [href]="whatsappUrl" target="_blank" rel="noopener noreferrer" class="jbSocialCircle" title="WhatsApp" aria-label="WhatsApp">
                <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.592 2.654-.696c.969.528 1.905.817 2.806.817 3.18 0 5.767-2.587 5.768-5.766.001-3.182-2.585-5.8-5.768-5.8zm3.376 8.21c-.14.394-.808.734-1.116.78-.309.046-.713.064-2.307-.597-2.036-.845-3.328-2.92-3.429-3.056-.101-.136-.822-1.095-.822-2.088 0-.993.52-1.482.705-1.685.185-.203.404-.254.538-.254.135 0 .27.002.387.007.125.006.292-.047.457.348.169.404.575 1.4.626 1.502.051.102.085.22.017.355-.068.136-.101.22-.203.339-.101.119-.214.265-.305.356-.102.102-.208.213-.09.416.118.203.526.868 1.129 1.405.776.691 1.431.905 1.634 1.006.203.102.322.085.441-.051.118-.135.508-.592.643-.795.135-.203.27-.169.457-.102.186.068 1.185.559 1.388.66.203.102.338.153.388.238.051.084.051.491-.089.885z"/>
                </svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" class="jbSocialCircle" title="Facebook" aria-label="Facebook">
                <span class="jbIconGlyph">f</span>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" class="jbSocialCircle" title="X (Twitter)" aria-label="X">
                <span class="jbIconGlyph">𝕏</span>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" class="jbSocialCircle" title="YouTube" aria-label="YouTube">
                <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                </svg>
              </a>
            </div>
          </div>

          <!-- We Accept: -->
          <div class="jbPayGroup">
            <span class="jbBottomLabel">We Accept:</span>
            <div class="jbPaymentPillBox">
              <a
                href="https://www.rupay.co.in"
                target="_blank"
                rel="noopener noreferrer"
                class="jbPayPill rupay"
                title="Click to visit RuPay Official Website"
              >
                RuPay
              </a>
              <a
                href="https://www.npci.org.in/what-we-do/upi/product-overview"
                target="_blank"
                rel="noopener noreferrer"
                class="jbPayPill upi"
                title="Click to visit NPCI UPI Official Portal"
              >
                UPI
              </a>
              <a
                href="https://www.visa.co.in"
                target="_blank"
                rel="noopener noreferrer"
                class="jbPayPill visa"
                title="Click to visit VISA Official Website"
              >
                VISA
              </a>
              <a
                href="https://www.mastercard.co.in"
                target="_blank"
                rel="noopener noreferrer"
                class="jbPayPill mc"
                title="Click to visit Mastercard Official Website"
              >
                Mastercard
              </a>
              <a
                href="https://www.rbi.org.in/Scripts/FAQView.aspx?Id=65"
                target="_blank"
                rel="noopener noreferrer"
                class="jbPayPill cod"
                title="Click to view RBI RTGS &amp; NEFT Official Banking Guidelines"
              >
                Cash / RTGS
              </a>
            </div>
          </div>

          <!-- Copyright -->
          <div class="jbCopyGroup">
            <p class="jbCopyText">© {{ year }} Jay Bhavani Ornaments. All Rights Reserved.</p>
            <p class="jbCinText">Government Certified 22K 916 Hallmark • Kamrej, Surat, Gujarat</p>
          </div>
        </div>
      </div>
    </footer>

    <a
      [href]="whatsappUrl"
      class="floating-whatsapp"
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      >WhatsApp</a
    >
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
      }
      .app-main {
        margin-top: var(--header-height);
        flex: 1;
      }
      .navbar-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
      }
      .navbar-whatsapp {
        padding: 0.55rem 1.3rem;
        font-size: 0.78rem;
      }

      /* ============================================================
         JAY BHAVANI LUXURY FOOTER (MATCHING SITE UI THEME 100%)
         ============================================================ */
      .jbFooter {
        background-color: var(--bg-secondary);
        color: var(--text-secondary);
        border-top: 2px solid var(--accent-gold);
        font-family: var(--font-sans);
        padding: 3.5rem 0 2rem;
        width: 100%;
        box-sizing: border-box;
      }

      .jbContainer {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1.5rem;
        box-sizing: border-box;
      }

      /* Brand Identity Header */
      .jbBrandRow {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2.5rem;
        padding-bottom: 1.8rem;
        border-bottom: 1px solid var(--border-color);
        gap: 1.5rem;
        flex-wrap: wrap;
      }

      .jbBrandIdentity {
        max-width: 580px;
      }

      .jbLogoLink {
        display: inline-flex;
        flex-direction: column;
        text-decoration: none;
        margin-bottom: 0.5rem;
      }

      .jbLogoMain {
        font-family: var(--font-serif);
        font-size: 1.6rem;
        font-weight: 700;
        color: var(--accent-gold);
        letter-spacing: 0.08em;
        line-height: 1.1;
      }

      .jbLogoSub {
        font-size: 0.65rem;
        letter-spacing: 0.25em;
        color: var(--text-muted);
        font-weight: 600;
        text-transform: uppercase;
      }

      .jbBrandDesc {
        font-size: 0.85rem;
        color: var(--text-muted);
        line-height: 1.5;
        margin: 0;
      }

      .jbBrandBadges {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
      }

      .jbTrustPill {
        display: inline-flex;
        align-items: center;
        gap: 0.6rem;
        background: #ffffff;
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 0.5rem 0.85rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
      }

      .jbTrustIcon {
        font-size: 1.2rem;
        color: var(--accent-gold);
      }

      .jbTrustText {
        display: flex;
        flex-direction: column;
      }

      .jbTrustText strong {
        font-size: 0.8rem;
        color: var(--text-primary);
        line-height: 1.2;
      }

      .jbTrustText small {
        font-size: 0.7rem;
        color: var(--text-muted);
      }

      /* 4-Column Grid */
      .jbGrid {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1.35fr;
        column-gap: 35px;
        row-gap: 20px;
      }

      .jbCol {
        display: flex;
        flex-direction: column;
      }

      .jbColWide {
        padding-left: 5px;
      }

      .jbBlock {
        display: flex;
        flex-direction: column;
      }

      .jbBlockSpaced {
        margin-top: 22px;
      }

      .jbHeading {
        color: var(--text-primary);
        font-family: var(--font-serif);
        font-size: 1rem;
        font-weight: 700;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        margin: 0 0 10px 0;
        line-height: 1.2;
      }

      .jbList {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .jbList li {
        margin: 0;
        padding: 0;
        line-height: 1.35;
      }

      .jbList a {
        color: var(--text-secondary);
        font-size: 0.83rem;
        text-decoration: none;
        transition: color 0.15s ease, transform 0.15s ease;
        display: inline-block;
      }

      .jbList a:hover {
        color: var(--accent-gold);
        transform: translateX(2px);
      }

      .jbCheckItem {
        color: #2e663a;
        font-size: 0.82rem;
        font-weight: 500;
        display: inline-block;
      }

      .jbMutedText {
        font-size: 0.78rem;
        color: var(--text-muted);
      }

      /* Store Section */
      .jbTagline {
        font-size: 0.82rem;
        color: var(--text-muted);
        margin: 0 0 10px 0;
        line-height: 1.45;
      }

      .jbStoreBadges {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
      }

      .jbStoreBtn {
        background: #ffffff;
        border: 1px solid var(--border-color);
        border-radius: 6px;
        padding: 0.45rem 0.85rem;
        display: inline-flex;
        align-items: center;
        gap: 0.55rem;
        text-decoration: none;
        transition: all 0.2s ease;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
      }

      .jbStoreBtn:hover {
        border-color: var(--accent-gold);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(184, 134, 11, 0.12);
      }

      .jbStoreIcon {
        width: 16px;
        height: 16px;
        flex-shrink: 0;
        color: var(--accent-gold);
      }

      .jbWaColor {
        color: #25d366;
      }

      .jbStoreText {
        display: flex;
        flex-direction: column;
        line-height: 1;
      }

      .jbStoreSub {
        color: var(--text-muted);
        font-size: 0.62rem;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        margin-bottom: 2px;
      }

      .jbStoreMain {
        color: var(--text-primary);
        font-size: 0.82rem;
        font-weight: 700;
        letter-spacing: 0.02em;
      }

      /* Newsletter */
      .jbNewsletterForm {
        display: flex;
        align-items: stretch;
        max-width: 380px;
        height: 36px;
      }

      .jbNewsletterInput {
        flex: 1;
        min-width: 0;
        background: #ffffff;
        border: 1px solid var(--border-color);
        border-right: none;
        border-radius: 4px 0 0 4px;
        padding: 0 12px;
        color: var(--text-primary);
        font-size: 0.83rem;
        outline: none;
        box-sizing: border-box;
      }

      .jbNewsletterInput::placeholder {
        color: var(--text-muted);
      }

      .jbNewsletterInput:focus {
        border-color: var(--accent-gold);
      }

      .jbNewsletterBtn {
        background: linear-gradient(135deg, #d4af37 0%, #b8860b 100%);
        color: #ffffff;
        border: none;
        border-radius: 0 4px 4px 0;
        padding: 0 18px;
        font-size: 0.78rem;
        font-weight: 700;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        cursor: pointer;
        white-space: nowrap;
        transition: opacity 0.15s ease;
        box-shadow: 0 2px 8px rgba(184, 134, 11, 0.2);
      }

      .jbNewsletterBtn:hover {
        opacity: 0.92;
      }

      .jbSuccessMsg {
        font-size: 0.78rem;
        color: #059669;
        margin-top: 6px;
        font-weight: 500;
      }

      /* Divider Line */
      .jbDivider {
        height: 1px;
        background: var(--border-color);
        margin: 2.8rem 0 1.8rem;
        width: 100%;
      }

      /* Bottom Row */
      .jbBottomRow {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1.5rem;
        flex-wrap: wrap;
      }

      .jbBottomLabel {
        color: var(--text-primary);
        font-size: 0.82rem;
        font-weight: 700;
        white-space: nowrap;
        font-family: var(--font-serif);
      }

      .jbFollowGroup {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .jbSocialList {
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .jbSocialCircle {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: #ffffff;
        border: 1px solid var(--border-color);
        color: var(--accent-gold);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        text-decoration: none;
        transition: all 0.18s ease;
        flex-shrink: 0;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
      }

      .jbSocialCircle:hover {
        background: var(--accent-gold);
        color: #ffffff;
        transform: translateY(-2px);
        box-shadow: 0 4px 10px rgba(184, 134, 11, 0.25);
      }

      .jbIconGlyph {
        font-size: 11px;
        font-weight: 800;
        line-height: 1;
        font-family: Arial, sans-serif;
      }

      /* We Accept: */
      .jbPayGroup {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .jbPaymentPillBox {
        display: flex;
        align-items: center;
        gap: 6px;
        flex-wrap: wrap;
      }

      .jbPayPill {
        background: #ffffff;
        border: 1px solid var(--border-color);
        border-radius: 4px;
        padding: 0.28rem 0.65rem;
        font-size: 0.72rem;
        font-weight: 700;
        color: var(--text-secondary);
        letter-spacing: 0.04em;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .jbPayPill:hover {
        border-color: var(--accent-gold);
        transform: translateY(-2px);
        box-shadow: 0 4px 10px rgba(184, 134, 11, 0.18);
        filter: brightness(1.05);
      }

      .jbPayPill.rupay { color: #0284c7; }
      .jbPayPill.upi { color: #7c3aed; }
      .jbPayPill.visa { color: #1e40af; }
      .jbPayPill.mc { color: #d97706; }
      .jbPayPill.cod { color: #059669; }

      /* Copyright & CIN */
      .jbCopyGroup {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        line-height: 1.35;
      }

      .jbCopyText {
        color: var(--text-secondary);
        font-size: 0.8rem;
        margin: 0;
        font-weight: 500;
      }

      .jbCinText {
        color: var(--text-muted);
        font-size: 0.72rem;
        margin: 0;
      }

      /* Responsive */
      @media (max-width: 980px) {
        .jbGrid {
          grid-template-columns: 1fr 1fr;
          row-gap: 30px;
        }
        .jbColWide {
          padding-left: 0;
        }
        .jbCopyGroup {
          align-items: flex-start;
        }
      }

      @media (max-width: 640px) {
        .jbGrid {
          grid-template-columns: 1fr;
          row-gap: 25px;
        }
        .jbBottomRow {
          flex-direction: column;
          align-items: flex-start;
          gap: 16px;
        }
        .jbCopyGroup {
          align-items: flex-start;
        }
      }
    `,
  ],
})
export class AppComponent implements OnInit {
  readonly whatsappUrl = DEFAULT_WHATSAPP_URL;
  readonly instagramUrl = INSTAGRAM_URL;
  readonly shopPhone = SHOP_PHONE_DISPLAY;
  readonly shopWhatsapp = SHOP_WHATSAPP;
  readonly year = new Date().getFullYear();

  newsletterEmail = '';
  newsletterSubscribed = false;

  pathname = '/';
  menuOpen = false;
  scrolled = false;
  wishlistCount = 0;
  clientUser: { name: string; email?: string } | null = null;

  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    this.pathname = this.router.url.split('?')[0] || '/';
    document.documentElement.setAttribute('data-theme', 'light');
    document.body.setAttribute('data-theme', 'light');
    this.refreshClientState();
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        const [urlPath, fragment] = event.urlAfterRedirects.split('#');
        this.pathname = urlPath.split('?')[0] || '/';
        this.closeMenu();
        if (fragment) {
          document
            .getElementById(decodeURIComponent(fragment))
            ?.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    window.addEventListener('wishlist-updated', this.refreshClientState);
    window.addEventListener('client-auth-updated', this.refreshClientState);
    window.addEventListener('storage', this.refreshClientState);
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled = window.scrollY > 50;
  }

  subscribeNewsletter(): void {
    if (this.newsletterEmail.trim()) {
      this.newsletterSubscribed = true;
      setTimeout(() => {
        this.newsletterEmail = '';
        this.newsletterSubscribed = false;
      }, 4000);
    }
  }

  private readonly refreshClientState = (): void => {
    this.wishlistCount = getWishlist().length;
    this.clientUser = getClientSession();
  };

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
