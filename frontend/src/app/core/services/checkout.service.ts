import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { tap } from 'rxjs/operators';


export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface CheckoutPayload {
  items: { productId: string; quantity: number; price: number }[];
  shippingAddress: ShippingAddress;
}

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private apiUrl = 'http://localhost:3000/checkout';
  public isLoading = signal<boolean>(false);

  constructor(private http: HttpClient) {}

  placeOrder(payload: CheckoutPayload) {
    this.isLoading.set(true);
    return this.http.post(this.apiUrl, payload).pipe(
      tap(() => this.isLoading.set(false)),
      tap({ error: () => this.isLoading.set(false) })
    );
  }
}
