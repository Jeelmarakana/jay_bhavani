import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { register, type SwiperContainer } from 'swiper/element/bundle';
import { ApiService } from '../../api.service';
import { MotionDirective } from '../../motion.directive';
import type { GoldRates, Product } from '../../api.service';
import { getWishlist, toggleWishlist } from '../../../lib/client-wishlist';
import { buildWhatsAppUrl, INSTAGRAM_URL, SHOP_PHONE_DISPLAY } from '../../../lib/config';
import { CATEGORY_LIST, errorMessage } from '../shared/page-data';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MotionDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styleUrls: ['./home-page.component.css'],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('heroSwiper') private heroSwiper?: ElementRef<SwiperContainer>;

  readonly autoplayEnabled = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  readonly categories = CATEGORY_LIST;
  readonly instagramUrl = INSTAGRAM_URL;
  readonly heroSlides = [
    {
      category: 'Rings',
      categorySlug: 'rings',
      eyebrow: 'Made for your forever moments',
      title: 'A Little Brilliance. A Lifetime of Meaning.',
      description:
        'Discover elegant gold and diamond rings, thoughtfully crafted for the moments you will always remember.',
      image: '/images/products/solitaires-4k.jpg',
      alt: 'Gold and diamond rings displayed on a light grey background',
    },
    {
      category: 'Earrings',
      categorySlug: 'earrings',
      eyebrow: 'Details that make you shine',
      title: 'The Finishing Touch to Every Look.',
      description:
        'Explore beautifully detailed gold earrings, from graceful everyday styles to statement jhumkas.',
      image: '/images/products/rings-4k.jpg',
      alt: 'Traditional gold jhumka earrings displayed in a jewellery showroom',
    },
    {
      category: 'Bridal Sets',
      categorySlug: 'bridal-sets',
      eyebrow: 'A celebration of your story',
      title: 'Make Your Wedding Day Unforgettable.',
      description:
        'Find a distinctive bridal jewellery set, designed to make every celebration feel truly yours.',
      image: '/images/products/bridal-sets-4k.jpg',
      alt: 'Traditional bridal necklace and matching earrings on a display bust',
    },
    {
      category: 'Bangles & Bracelets',
      categorySlug: 'bangles',
      eyebrow: 'Crafted to be treasured',
      title: 'Tradition, Wrapped Around Your Wrist.',
      description:
        'Browse detailed gold bangles and bracelets made to bring timeless elegance to every occasion.',
      image: '/images/products/bangles-4k.jpg',
      alt: 'Ornate gold bangles arranged on a jewellery display',
    },
  ];
  readonly reviews = [
    {
      name: 'Aarohi Patel',
      quote:
        'The bridal set was exactly what we wanted. The design felt grand but still elegant and very personal.',
    },
    {
      name: 'Pratik Shah',
      quote:
        'Their pricing transparency and quality gave us total confidence. We felt respected throughout the buying process.',
    },
    {
      name: 'Nisha Desai',
      quote:
        'From quick WhatsApp replies to the final fitting, the experience was smooth and reassuring.',
    },
  ];
  readonly gallery = [
    '/images/products/rings-4k.jpg',
    '/images/products/bridal-sets-4k.jpg',
    '/images/products/temple-jewellery-4k.jpg',
    '/images/products/silver-jewellery-4k.jpg',
    '/images/products/bangles-4k.jpg',
    '/images/products/antique-jewellery-4k.jpg',
    '/images/products/earrings-4k.jpg',
    '/images/products/solitaires-4k.jpg',
    '/images/products/mangalsutras-4k.jpg',
    '/images/products/necklaces-4k.jpg',
    '/images/products/chains-4k.jpg',
    '/images/products/anklets-4k.jpg',
    '/images/products/pendant-sets-4k.jpg',
    '/images/products/kundan-jewellery-4k.jpg',
  ];
  readonly trustPoints = [
    '22K Gold Jewellery',
    'Transparent Pricing',
    'Custom Jewellery',
    'Trusted Craftsmanship',
    'Purity Check',
  ];
  readonly consultUrl = buildWhatsAppUrl(
    'Hi Jay Bhavani Ornaments, I am visiting your digital showroom and would like to explore your jewellery collection.',
  );
  readonly bridalUrl = buildWhatsAppUrl(
    'Hi Jay Bhavani Ornaments, I would like to book a bridal consultation.',
  );
  readonly visitUrl = buildWhatsAppUrl(
    'Hi Jay Bhavani Ornaments, I would like to visit the showroom.',
  );
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
  private readonly syncWishlist = (): void => {
    this.wishlistIds = new Set(getWishlist().map((item) => item.id));
  };

  constructor(
    private readonly api: ApiService,
    private readonly host: ElementRef<HTMLElement>,
  ) {
    register();
  }

  ngOnInit(): void {
    this.syncWishlist();
    window.addEventListener('wishlist-updated', this.syncWishlist);
    window.addEventListener('storage', this.syncWishlist);
    this.loadRates();
    this.rateTimer = setInterval(() => this.loadRates(), 15000);
    this.api.products({ featured: 'true' }).subscribe({
      next: (result) => {
        this.featuredProducts = result.products.slice(0, 4);
        this.loading = false;
      },
      error: (error: unknown) => {
        console.error('Unable to load featured jewellery.', error);
        this.loading = false;
      },
    });
  }

  ngAfterViewInit(): void {
    this.heroSwiper?.nativeElement.initialize();
    this.revealGalleryCardsInView();
  }

  @HostListener('window:scroll')
  revealGalleryCardsInView(): void {
    this.host.nativeElement
      .querySelectorAll<HTMLElement>('.instagramCard[galleryReveal]:not(.is-visible)')
      .forEach((card) => {
        const bounds = card.getBoundingClientRect();
        if (bounds.top < window.innerHeight && bounds.bottom > 0) card.classList.add('is-visible');
      });
  }

  ngOnDestroy(): void {
    if (this.rateTimer) clearInterval(this.rateTimer);
    window.removeEventListener('wishlist-updated', this.syncWishlist);
    window.removeEventListener('storage', this.syncWishlist);
  }

  private loadRates(): void {
    this.api.goldRates().subscribe({
      next: (result) => {
        this.rates = result.rates;
        this.updatedLabel = result.rates.timestamp
          ? new Date(result.rates.timestamp).toLocaleString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
            })
          : 'Today';
      },
      error: (error: unknown) => console.error('Unable to load current rates.', error),
    });
  }

  rate(value: number | undefined): string {
    return value === undefined
      ? 'Rates unavailable'
      : `₹${Math.round(value).toLocaleString('en-IN')}`;
  }

  previousHeroSlide(): void {
    this.heroSwiper?.nativeElement.swiper.slidePrev();
  }

  nextHeroSlide(): void {
    this.heroSwiper?.nativeElement.swiper.slideNext();
  }

  isWishlisted(productId: string): boolean {
    return this.wishlistIds.has(productId);
  }

  toggleWishlist(product: Product): void {
    toggleWishlist(product);
  }

  submitEnquiry(): void {
    if (
      !this.formData.name.trim() ||
      !this.formData.phone.trim() ||
      !this.formData.message.trim()
    ) {
      this.enquirySuccess = false;
      this.enquiryMessage = 'Please fill in your name, mobile number and enquiry message.';
      return;
    }
    this.submitting = true;
    this.enquiryMessage = '';
    this.api.submitInquiry(this.formData).subscribe({
      next: (result) => {
        this.enquirySuccess = result.success;
        this.enquiryMessage = !result.success
          ? result.error || 'Failed to submit enquiry.'
          : result.notification?.sent
            ? `Your enquiry is saved and the WhatsApp provider accepted the notification request. Our team at ${SHOP_PHONE_DISPLAY} will contact you shortly.`
            : result.notification?.reason === 'not_configured'
              ? `Your enquiry is saved, but automatic WhatsApp notifications are not configured. Please call us at ${SHOP_PHONE_DISPLAY}.`
              : result.notification?.reason === 'timeout'
                ? `Your enquiry is saved, but WhatsApp did not respond in time. Please call us at ${SHOP_PHONE_DISPLAY}.`
                : `Your enquiry is saved, but the WhatsApp provider did not accept the notification. Please call us at ${SHOP_PHONE_DISPLAY}.`;
        if (result.success)
          this.formData = { name: '', phone: '', interestedIn: 'Rings', message: '' };
        this.submitting = false;
      },
      error: (error: unknown) => {
        this.enquirySuccess = false;
        this.enquiryMessage = errorMessage(
          error,
          'Something went wrong. Please try again or send us a WhatsApp message.',
        );
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
