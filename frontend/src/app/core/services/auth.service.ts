import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { User } from './user.interface';
import { jwtDecode } from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth';
  private http = inject(HttpClient);
  private router = inject(Router);

  public currentUser = signal<User | null>(null);
  public isAuthenticated = signal<boolean>(false);
  public isAuthLoading = signal<boolean>(false);

  constructor() { 
    this.checkToken(); 
  }

  private checkToken() {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const decoded = jwtDecode<any>(token);
        // Basic check if token is expired
        const isExpired = decoded.exp ? (decoded.exp * 1000 < Date.now()) : false;
        
        if (!isExpired) {
          this.currentUser.set({
            id: decoded.id || decoded.sub,
            email: decoded.email,
            role: decoded.role,
            name: decoded.name
          });
          this.isAuthenticated.set(true);
        } else {
          this.logout();
        }
      } catch(e) {
        this.logout();
      }
    }
  }

  public getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  public getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  public signUp(data: any): Observable<any> { 
    this.isAuthLoading.set(true);
    return this.http.post(`${this.apiUrl}/signUp`, data).pipe(
        tap(() => this.isAuthLoading.set(false)),
        catchError(error => {
            this.isAuthLoading.set(false);
            return throwError(() => error);
        })
    ); 
  }

  public login(data: any): Observable<any> {
    this.isAuthLoading.set(true);
    return this.http.post(`${this.apiUrl}/login`, data).pipe(
      tap((res: any) => {
        localStorage.setItem('access_token', res.accessToken);
        localStorage.setItem('refresh_token', res.refreshToken);
        
        // Decode token directly here instead of checking app reload
        const decoded = jwtDecode<any>(res.accessToken);
        this.currentUser.set({
            id: decoded.id || decoded.sub,
            email: decoded.email,
            role: decoded.role,
            name: decoded.name
        });
        
        this.isAuthenticated.set(true);
        this.isAuthLoading.set(false);
        this.routeBasedOnRole(decoded.role);
      }),
      catchError(error => {
        this.isAuthLoading.set(false);
        return throwError(() => error);
      })
    );
  }

  private routeBasedOnRole(role: string) {
     if (role === 'SELLER') {
         this.router.navigate(['/seller/dashboard']);
     } else if (role === 'ADMIN') {
         this.router.navigate(['/admin']);
     } else {
         this.router.navigate(['/home']);
     }
  }

  public refreshToken(): Observable<{ accessToken: string }> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token'));
    }

    return this.http.post<{ accessToken: string }>(`${this.apiUrl}/refresh-token`, { refreshToken }).pipe(
      tap(response => {
        localStorage.setItem('access_token', response.accessToken);
        const decoded = jwtDecode<any>(response.accessToken);
        this.currentUser.set({
            id: decoded.id || decoded.sub,
            email: decoded.email,
            role: decoded.role,
            name: decoded.name
        });
      }),
      catchError(error => {
        this.logout();
        return throwError(() => error);
      })
    );
  }

  public forgotPassword(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, data);
  }

  public resendOtp(data: { email: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/resend-otp`, data);
  }

  public resetPassword(token: string, data: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/reset-password/${token}`, data);
  }

  public logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }
}
