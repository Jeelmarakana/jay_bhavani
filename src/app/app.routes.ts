import { Routes } from '@angular/router';
import {
  AdminPageComponent,
  AuthPageComponent,
  HomePageComponent,
  NotFoundPageComponent,
  ProductPageComponent,
  ShopPageComponent,
  WishlistPageComponent,
} from './pages';

export const routes: Routes = [
  { path: '', component: HomePageComponent, title: 'Jay Bhavani Ornaments' },
  { path: 'shop', component: ShopPageComponent, title: 'Collections | Jay Bhavani Ornaments' },
  { path: 'product/:id', component: ProductPageComponent, title: 'Product | Jay Bhavani Ornaments' },
  { path: 'auth/login', component: AuthPageComponent, data: { mode: 'login' }, title: 'Login | Jay Bhavani Ornaments' },
  { path: 'auth/register', component: AuthPageComponent, data: { mode: 'register' }, title: 'Register | Jay Bhavani Ornaments' },
  { path: 'wishlist', component: WishlistPageComponent, title: 'Wishlist | Jay Bhavani Ornaments' },
  { path: 'admin', component: AdminPageComponent, title: 'Admin | Jay Bhavani Ornaments' },
  { path: '**', component: NotFoundPageComponent, title: 'Page not found | Jay Bhavani Ornaments' },
];
