import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
export const authGuard: CanActivateFn = () => {
  if (inject(AuthService).isAuthenticated()) return true;
  return inject(Router).parseUrl('/landing');
};
