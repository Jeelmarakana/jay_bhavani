import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { loginClient, registerClient } from '../../../lib/client-auth';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  styleUrls: ['./auth-page.component.css'],
  templateUrl: './auth-page.component.html',
})
export class AuthPageComponent implements OnInit {
  mode: 'login' | 'register' = 'login';
  name = '';
  identifier = '';
  password = '';
  busy = false;
  showPassword = false;
  statusMessage = '';
  statusSuccess = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe(
      (data) => (this.mode = data['mode'] === 'register' ? 'register' : 'login'),
    );
  }

  submit(): void {
    this.busy = true;
    const result =
      this.mode === 'register'
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
}
