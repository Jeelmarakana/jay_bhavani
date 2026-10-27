import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from '../../api.service';
import type { GoldRates, Product } from '../../api.service';
import { SHOP_PHONE_DISPLAY } from '../../../lib/config';
import { errorMessage } from '../shared/page-data';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  styleUrls: ['./product-page.component.css'],
  templateUrl: './product-page.component.html',
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

  constructor(
    private readonly api: ApiService,
    private readonly route: ActivatedRoute,
  ) {}

  get price(): {
    ratePerGram: number;
    metalValue: number;
    diamondValue: number;
    makingCharges: number;
    gst: number;
    total: number;
  } | null {
    if (!this.product || !this.rates) return null;
    const item = this.product;
    const metal = item.metal.toLowerCase();
    const rate = metal.includes('silver')
      ? this.rates.silver
      : metal.includes('diamond')
        ? this.rates.gold18k
        : item.purity === '22K'
          ? this.rates.gold22k
          : item.purity === '18K'
            ? this.rates.gold18k
            : this.rates.gold24k;
    const metalValue = item.weight * rate;
    const diamondValue = metal.includes('diamond') ? item.weight * 12000 : 0;
    const makingCharges = (metalValue * item.makingCharges) / 100;
    const gst = (metalValue + makingCharges + diamondValue) * 0.03;
    return {
      ratePerGram: Math.round(rate),
      metalValue: Math.round(metalValue),
      diamondValue: Math.round(diamondValue),
      makingCharges: Math.round(makingCharges),
      gst: Math.round(gst),
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
        this.product = result.success ? (result.product ?? null) : null;
        this.errorText = result.error || 'The requested product could not be found.';
        if (this.product) {
          this.form.message = `Hello, I am interested in inquiring about "${this.product.name}" (Product ID: ${this.product.id}, Weight: ${this.product.weight}g). Please provide availability details.`;
          this.api.goldRates().subscribe({
            next: (rateResult) => {
              this.rates = rateResult.rates;
            },
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
    this.api
      .submitInquiry({ ...this.form, productId: this.product.id, productName: this.product.name })
      .subscribe({
        next: (result) => {
          this.statusSuccess = result.success;
          this.statusMessage = !result.success
            ? result.error || 'Failed to submit enquiry.'
            : result.notification?.sent
              ? `Your enquiry is saved and the WhatsApp provider accepted the notification request. We will contact you shortly or call you at ${SHOP_PHONE_DISPLAY}.`
              : result.notification?.reason === 'not_configured'
                ? `Your enquiry is saved, but automatic WhatsApp notifications are not configured. Please call us at ${SHOP_PHONE_DISPLAY}.`
                : result.notification?.reason === 'timeout'
                  ? `Your enquiry is saved, but WhatsApp did not respond in time. Please call us at ${SHOP_PHONE_DISPLAY}.`
                  : `Your enquiry is saved, but the WhatsApp provider did not accept the notification. Please call us at ${SHOP_PHONE_DISPLAY}.`;
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
