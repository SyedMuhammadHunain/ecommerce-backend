import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isAuthenticated()) {
      if (allowedRoles.includes('ADMIN')) return router.parseUrl('/admin/login');
      if (allowedRoles.includes('SELLER')) return router.parseUrl('/seller/login');
      return router.parseUrl('/login');
    }

    const user = authService.currentUser();
    if (user && user.role && allowedRoles.includes(user.role)) {
      return true;
    }

    return router.parseUrl('/');
  };
};
