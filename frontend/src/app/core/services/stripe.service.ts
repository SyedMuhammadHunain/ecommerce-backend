import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

export interface StripeSessionRequest {
  amount: number;
  currency: string;
  productId: string;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class FrontendStripeService {
  private apiUrl = 'http://localhost:3000/payment';
  public isLoading = signal<boolean>(false);

  constructor(private http: HttpClient) {}

  createCheckoutSession(payload: StripeSessionRequest) {
    this.isLoading.set(true);
    return this.http.post<any>(`${this.apiUrl}/create-checkout-session`, payload).pipe(
      tap((session) => {
        this.isLoading.set(false);
        if (session && session.url) {
            window.location.href = session.url;
        }
      }),
      tap({ error: () => this.isLoading.set(false) })
    );
  }
}
