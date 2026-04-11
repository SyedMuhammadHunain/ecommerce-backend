import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  // Public auth routes
  { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'signup', loadComponent: () => import('./features/auth/signup/signup').then(m => m.Signup) },
  { path: 'forgot-password', loadComponent: () => import('./features/auth/forgot-password/forgot-password').then(m => m.ForgotPassword) },
  { path: 'reset-password/:token', loadComponent: () => import('./features/auth/reset-password/reset-password').then(m => m.ResetPassword) },

  // Public Landing route
  { path: 'landing', loadComponent: () => import('./features/landing/landing.component').then(m => m.LandingComponent) },

  // Storefront Portal
  {
    path: '',
    loadComponent: () => import('./core/layout/customer-layout.component').then(m => m.CustomerLayoutComponent),
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        loadComponent: () => import('./features/customer/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'cart',
        canActivate: [roleGuard(['CUSTOMER'])],
        loadComponent: () => import('./features/customer/cart/cart').then(m => m.CartComponent)
      },
      {
        path: 'checkout',
        canActivate: [roleGuard(['CUSTOMER'])],
        loadComponent: () => import('./features/customer/checkout/checkout').then(m => m.CheckoutComponent)
      },
      {
        path: 'orders',
        canActivate: [roleGuard(['CUSTOMER'])],
        loadComponent: () => import('./features/customer/orders/orders').then(m => m.OrdersComponent)
      }
    ]
  },

  // Admin Portal
  { path: 'admin/login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
  {
    path: 'admin',
    canActivate: [roleGuard(['ADMIN'])],
    loadComponent: () => import('./core/layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      { path: '', loadComponent: () => import('./features/admin/admin.component').then(m => m.AdminComponent) }
    ]
  },

  // Seller Portal
  { path: 'seller/login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
  {
    path: 'seller',
    canActivate: [roleGuard(['SELLER'])],
    loadComponent: () => import('./core/layout/seller-layout.component').then(m => m.SellerLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/seller/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'products',
        loadComponent: () => import('./features/seller/products/products.component').then(m => m.ProductsComponent)
      },
      {
        path: 'orders',
        loadComponent: () => import('./features/seller/orders/orders').then(m => m.SellerOrdersComponent)
      }
    ]
  },

  // Fallback
  { path: '**', redirectTo: 'landing' }
];
