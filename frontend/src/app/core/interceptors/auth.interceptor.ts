import { inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpInterceptorFn,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, switchMap, catchError, BehaviorSubject, filter, take } from 'rxjs';
import { AuthService } from '../services/auth.service';

const isRefreshing = new BehaviorSubject<boolean>(false);
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const addToken = (request: HttpRequest<any>, token: string) => {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  };

  const handle401Error = (request: HttpRequest<any>, nextFn: HttpHandlerFn) => {
    if (!isRefreshing.value) {
      isRefreshing.next(true);
      refreshTokenSubject.next(null);

      return authService.refreshToken().pipe(
        switchMap((tokenResponse: any) => {
          isRefreshing.next(false);
          refreshTokenSubject.next(tokenResponse.accessToken);
          return nextFn(addToken(request, tokenResponse.accessToken));
        }),
        catchError(err => {
          isRefreshing.next(false);
          authService.logout();
          router.navigate(['/login']);
          return throwError(() => err);
        })
      );
    } else {
      return refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(jwt => {
          return nextFn(addToken(request, jwt as string));
        })
      );
    }
  };

  const accessToken = authService.getAccessToken();

  let modifiedReq = req;
  const isPublicRoute = req.url.includes('/auth/login') || req.url.includes('/auth/signUp') || req.url.includes('/auth/refresh-token');

  if (accessToken && !isPublicRoute) {
    modifiedReq = addToken(req, accessToken);
  }

  return next(modifiedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !isPublicRoute) {
        return handle401Error(modifiedReq, next);
      }
      return throwError(() => error);
    })
  );
};
