import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../core/services/product.service';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';
import { FrontendStripeService } from '../../../core/services/stripe.service';

// PrimeNG
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, ProgressSpinnerModule, ToastModule],
  providers: [MessageService],
  template: `
    <div class="p-6">
      <p-toast></p-toast>
      <h1 class="text-3xl font-bold mb-6 text-gray-800">Featured Products</h1>
      
      <div *ngIf="productService.isLoading()" class="flex justify-center items-center py-20">
          <p-progressSpinner></p-progressSpinner>
      </div>

      <div *ngIf="!productService.isLoading() && productService.products().length === 0" class="text-center py-10 text-gray-500">
          <i class="pi pi-box text-5xl mb-4"></i>
          <p class="text-xl">No products available at the moment.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6" *ngIf="!productService.isLoading()">
          <p-card *ngFor="let product of productService.products()" [header]="product.productName" [subheader]="'$' + product.price" [style]="{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }" styleClass="shadow-sm hover:shadow-md transition-shadow h-full">
              <ng-template pTemplate="header">
                  <div class="h-48 bg-gray-200 flex items-center justify-center rounded-t-lg overflow-hidden">
                      <i class="pi pi-image text-4xl text-gray-400"></i>
                  </div>
              </ng-template>
              
              <p class="text-gray-600 line-clamp-2 m-0 flex-grow">{{ product.description }}</p>
              
              <ng-template pTemplate="footer">
                  <div class="flex flex-col gap-2 mt-auto pt-4">
                      <!-- Existing Add to Cart -->
                      <p-button label="Add to Cart" icon="pi pi-shopping-cart"
                      (onClick)="addToCart(product._id!)" [loading]="cartService.loading()"
                      styleClass="w-full bg-blue-600 hover:bg-blue-700 border-none"></p-button>
                      
                      <!-- New Buy Now -> Stripe -->
                      <p-button label="Buy Now" icon="pi pi-credit-card"
                      (onClick)="buyNow(product)" [loading]="stripeService.isLoading()"
                      styleClass="w-full p-button-success border-none"></p-button>
                  </div>
              </ng-template>
          </p-card>
      </div>
    </div>
  `
})
export class HomeComponent implements OnInit {
  public productService = inject(ProductService);
  public authService = inject(AuthService);
  public cartService = inject(CartService);
  public stripeService = inject(FrontendStripeService);
  private messageService = inject(MessageService);

  ngOnInit() {
    this.fetchProducts();
    if (this.authService.currentUser()?.role === 'CUSTOMER') {
        this.cartService.getCart().subscribe();
    }
  }

  fetchProducts() {
    this.productService.getAllProducts().subscribe({
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load products' });
      }
    });
  }

  addToCart(productId: string) {
    if (!this.authService.currentUser()) {
        this.messageService.add({ severity: 'warn', summary: 'Login Required', detail: 'Please login to add to cart' });
        return;
    }
    
    this.cartService.addToCart(productId, 1).subscribe({
      next: (cart) => {
        if (cart) {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Added to cart' });
        }
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add to cart' });
      }
    });
  }

  buyNow(product: any) {
    if (!this.authService.currentUser()) {
        this.messageService.add({ severity: 'warn', summary: 'Login Required', detail: 'Please login to purchase' });
        return;
    }
    
    this.stripeService.createCheckoutSession({
      amount: product.price,
      currency: 'usd',
      productId: product._id,
      quantity: 1
    }).subscribe({
        error: () => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to initiate payment' });
        }
    });
  }
}
