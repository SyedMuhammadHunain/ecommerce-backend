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
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, ProgressSpinnerModule, ToastModule, TagModule],
  providers: [MessageService],
  template: `
    <div class="bg-gray-50 min-h-[calc(100vh-64px)] pb-12">
      <p-toast></p-toast>
      
      <!-- Modern Banner  -->
      <div class="bg-white border-b border-[var(--palette-border-gray)] mb-10">
        <div class="max-w-[1920px] mx-auto px-6 md:px-10 lg:px-20 py-12 md:py-16 flex flex-col items-center text-center">
            <h1 class="text-4xl md:text-5xl font-bold mb-4 text-[var(--palette-text-primary)] tracking-tight">Discover Amazing Products</h1>
            <p class="text-lg md:text-xl text-[var(--palette-text-secondary)] max-w-2xl">Shop the latest tech, gadgets, and exclusive deals crafted just for you.</p>
        </div>
      </div>

      <div class="max-w-[1920px] mx-auto px-6 md:px-10 lg:px-20">
        
        <div class="flex justify-between items-center mb-8">
            <h2 class="text-2xl md:text-3xl font-bold text-[var(--palette-text-primary)] tracking-tight">Trending Now</h2>
            <p-button label="View All" styleClass="p-button-text p-button-sm text-[var(--palette-bg-primary-core)] hover:bg-emerald-50 transition-colors font-semibold px-4 py-2 rounded-lg"></p-button>
        </div>

        <div *ngIf="productService.isLoading()" class="flex justify-center items-center py-20">
            <p-progressSpinner styleClass="w-12 h-12" strokeWidth="4" animationDuration=".5s"></p-progressSpinner>
        </div>

        <div *ngIf="!productService.isLoading() && productService.products().length === 0" class="text-center bg-white rounded-3xl border border-[var(--palette-border-gray)] py-20 text-gray-500 shadow-sm">
            <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <i class="pi pi-shopping-bag text-4xl text-gray-400"></i>
            </div>
            <h3 class="text-2xl font-bold text-[var(--palette-text-primary)] mb-2">No products found</h3>
            <p class="text-lg text-[var(--palette-text-secondary)]">Check back later for exciting new inventory!</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8" *ngIf="!productService.isLoading()">
            <div *ngFor="let product of productService.products(); let i = index" class="bg-white rounded-2xl border border-[var(--palette-border-gray)] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group cursor-pointer relative">
                
                <div class="relative h-60 bg-gray-100 overflow-hidden">
                    <p-tag severity="success" value="New" styleClass="absolute top-4 left-4 z-10 bg-[var(--palette-bg-primary-core)] rounded-md font-semibold px-2 py-1 text-xs"></p-tag>
                    <button class="absolute top-4 right-4 text-white border-none bg-black/20 cursor-pointer z-10 w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/40 transition-colors backdrop-blur-sm">
                       <i class="pi pi-heart"></i>
                    </button>
                    <img [src]="getImagePath(i)" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Product image" />
                </div>
                
                <div class="p-6 flex flex-col flex-grow">
                    <div class="flex justify-between items-start mb-2">
                        <h3 class="font-bold text-[var(--palette-text-primary)] text-lg leading-tight truncate pr-2">{{ product.productName }}</h3>
                    </div>
                    
                    <p class="text-[var(--palette-text-secondary)] text-sm line-clamp-2 mb-4 flex-grow">{{ product.description }}</p>
                    
                    <div class="flex items-center justify-between mb-5">
                        <span class="font-bold text-xl text-[var(--palette-text-primary)]">{{ product.price | currency }}</span>
                        <div class="flex items-center text-[var(--palette-text-primary)] text-sm font-medium">
                            <i class="pi pi-star-fill text-yellow-500 text-xs mr-1"></i> 4.96
                        </div>
                    </div>

                    <div class="flex gap-3 mt-auto pt-4 border-t border-gray-100">
                        <p-button icon="pi pi-shopping-cart"
                        (onClick)="addToCart(product._id!)" [loading]="cartService.loading()"
                        styleClass="w-12 h-12 flex justify-center items-center bg-gray-100 text-[var(--palette-text-primary)] hover:bg-gray-200 border-none transition-colors rounded-xl"></p-button>
                        
                        <p-button label="Buy Now" 
                        (onClick)="buyNow(product)" [loading]="stripeService.isLoading()"
                        styleClass="flex-1 bg-[var(--palette-bg-primary-core)] text-white hover:bg-[var(--palette-bg-tertiary-core)] border-none font-semibold transition-colors rounded-xl"></p-button>
                    </div>
                </div>
            </div>
        </div>
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

  getImagePath(index: number): string {
    return '/images/listing_image_' + ((index % 3) + 1) + '.png';
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
