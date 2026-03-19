import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Product } from '../models/product.interface';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = 'http://localhost:3000/product';
  private http = inject(HttpClient);

  // Global state for products
  public products = signal<Product[]>([]);
  public isLoading = signal<boolean>(false);

  // Fetch all available products
  public getAllProducts(): Observable<Product[]> {
    this.isLoading.set(true);
    return this.http.get<Product[]>(this.apiUrl).pipe(
      tap((data) => {
        this.products.set(data);
        this.isLoading.set(false);
      }),
      tap({ error: () => this.isLoading.set(false) })
    );
  }

  // Get single product
  public getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  // Seller: Create Product
  public createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  // Seller: Update Product
  public updateProduct(id: string, product: Partial<Product>): Observable<Product> {
    return this.http.patch<Product>(`${this.apiUrl}/${id}`, product);
  }

  // Seller: Delete Product
  public deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
