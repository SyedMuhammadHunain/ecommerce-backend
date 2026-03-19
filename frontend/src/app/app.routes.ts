import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  // Public auth routes
  { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'signup', loadComponent: () => import('./features/auth/signup/signup').then(m => m.Signup) },
  { path: 'forgot-password', loadComponent: () => import('./features/auth/forgot-password/forgot-password').then(m => m.ForgotPassword) },
  { path: 'reset-password/:token', loadComponent: () => import('./features/auth/reset-password/reset-password').then(m => m.ResetPassword) },
  
  // Guarded Layout Routes
  { 
    path: '', 
    loadComponent: () => import('./core/layout/main-layout.component').then(m => m.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      
      // Customer Routes
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
      },

      // Seller Routes
      { 
        path: 'seller/dashboard', 
        canActivate: [roleGuard(['SELLER'])],
        loadComponent: () => import('./features/seller/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      { 
        path: 'seller/products', 
        canActivate: [roleGuard(['SELLER'])],
        loadComponent: () => import('./features/seller/products/products.component').then(m => m.ProductsComponent)
      },
      {
        path: 'seller/orders',
        canActivate: [roleGuard(['SELLER'])],
        loadComponent: () => import('./features/seller/orders/orders').then(m => m.SellerOrdersComponent)
      },

      // Admin Routes
      { 
        path: 'admin', 
        canActivate: [roleGuard(['ADMIN'])],
        loadComponent: () => import('./features/admin/admin.component').then(m => m.AdminComponent)
      }
    ]
  },
  
  // Fallback
  { path: '**', redirectTo: 'home' }
];
