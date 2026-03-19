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

      // Seller Routes
      { 
        path: 'seller/dashboard', 
        canActivate: [roleGuard(['SELLER'])],
        loadComponent: () => import('./features/seller/dashboard/dashboard.component').then(m => m.DashboardComponent) 
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
