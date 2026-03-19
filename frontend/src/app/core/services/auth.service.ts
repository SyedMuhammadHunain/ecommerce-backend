import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface User { id: string; email: string; name: string; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth';
  currentUser = signal<User | null>(null);
  isAuthenticated = signal<boolean>(false);
  constructor(private http: HttpClient) { this.checkToken(); }
  private checkToken() {
    if (localStorage.getItem('accessToken')) this.isAuthenticated.set(true);
  }
  signUp(data: any): Observable<any> { return this.http.post(`${this.apiUrl}/signUp`, data); }
  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data).pipe(
      tap((res: any) => {
        localStorage.setItem('accessToken', res.accessToken);
        localStorage.setItem('refreshToken', res.refreshToken);
        this.isAuthenticated.set(true);
      })
    );
  }
  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.isAuthenticated.set(false);
  }
}
