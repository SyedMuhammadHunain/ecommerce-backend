import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';

import { catchError } from 'rxjs/operators';
import { of, tap } from 'rxjs';

export interface CartItem {
  _id?: string;
  productId: any; // Mapped to Product schema via populate
  quantity: number;
}

export interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:3000/cart';

  public cart = signal<Cart | null>(null);
  public loading = signal<boolean>(false);
  public cartItemCount = signal<number>(0);

  constructor(private http: HttpClient) {}

  getCart() {
    this.loading.set(true);
    return this.http.get<Cart>(this.apiUrl).pipe(
      tap((cart) => {
        this.cart.set(cart);
        this.updateItemCount(cart);
        this.loading.set(false);
      }),
      catchError((error) => {
        console.error('Failed to get cart', error);
        this.loading.set(false);
        return of(null);
      })
    );
  }

  addToCart(productId: string, quantity: number = 1) {
    this.loading.set(true);
    return this.http.post<Cart>(`${this.apiUrl}/add-to-cart`, { productId, quantity }).pipe(
      tap(() => {
        // Since addToCart in backend doesn't populate, we should refetch the cart
        this.getCart().subscribe();
      }),
      catchError((error) => {
        console.error('Failed to add to cart', error);
        this.loading.set(false);
        return of(null);
      })
    );
  }

  private updateItemCount(cart: Cart | null) {
    if (cart && cart.items) {
      const count = cart.items.reduce((total, item) => total + item.quantity, 0);
      this.cartItemCount.set(count);
    } else {
      this.cartItemCount.set(0);
    }
  }
}
