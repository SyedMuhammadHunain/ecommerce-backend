import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

export interface Order {
  _id: string;
  userId: string;
  productId: any;
  amount: number;
  status: string;
  currency: string;
  quantity: number;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:3000/orders';
  
  public orders = signal<Order[]>([]);
  public isLoading = signal<boolean>(false);

  constructor(private http: HttpClient) {}

  getUserOrders() {
    this.isLoading.set(true);
    return this.http.get<Order[]>(this.apiUrl).pipe(
      tap((data) => {
        this.orders.set(data);
        this.isLoading.set(false);
      }),
      catchError((error) => {
        console.error('Failed to get orders', error);
        this.isLoading.set(false);
        return of([]);
      })
    );
  }

  cancelOrder(orderId: string) {
    return this.http.patch<Order>(`${this.apiUrl}/${orderId}/cancel`, {}).pipe(
      tap((updated) => {
        const currentOrders = this.orders();
        const index = currentOrders.findIndex(o => o._id === orderId);
        if (index > -1) {
            currentOrders[index] = updated;
            this.orders.set([...currentOrders]);
        }
      })
    );
  }

  // Admin/Seller specific features
  updateOrderStatus(orderId: string, status: string) {
    return this.http.patch<Order>(`${this.apiUrl}/${orderId}/status?status=${status}`, {}).pipe(
      tap((updated) => {
        const currentOrders = this.orders();
        const index = currentOrders.findIndex(o => o._id === orderId);
        if (index > -1) {
            currentOrders[index] = updated;
            this.orders.set([...currentOrders]);
        }
      })
    );
  }
}
