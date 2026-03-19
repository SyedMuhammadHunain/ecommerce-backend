import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

// We import loadStripe but cast the resulting stripe object to any 
// if types are giving trouble, though in a real setting you would map it exactly
import { loadStripe } from '@stripe/stripe-js';

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

  private stripePromise = loadStripe('pk_test_oKxK9J0X3zP8U9u072iM25fH1'); 

  constructor(private http: HttpClient) {}

  createCheckoutSession(payload: StripeSessionRequest) {
    this.isLoading.set(true);
    return this.http.post<any>(`${this.apiUrl}/create-checkout-session`, payload).pipe(
      tap(async (session) => {
        this.isLoading.set(false);
        const stripe: any = await this.stripePromise;
        if (stripe && session && session.id) {
            const { error } = await stripe.redirectToCheckout({
                sessionId: session.id
            });
            if (error) {
                console.error('Stripe redirect error:', error);
            }
        }
      }),
      tap({ error: () => this.isLoading.set(false) })
    );
  }
}
