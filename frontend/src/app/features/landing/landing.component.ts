import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { AuthService } from '../../core/services/auth.service';
import { Product } from '../../core/models/product.interface';
import { TopbarWidget } from './components/topbarwidget.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TopbarWidget,
  ],
  template: `
    <div class="min-h-screen flex flex-col bg-white">
      <topbar-widget></topbar-widget>
      
      <!-- Airbnb-style Hero Section -->
      <div class="px-6 md:px-10 lg:px-20 mt-6 mx-auto w-full max-w-[1920px]">
        <div class="relative w-full overflow-hidden airbnb-radius-large" style="height: 600px;">
          <img src="/images/landing_hero.png" class="absolute inset-0 w-full h-full object-cover" alt="Beautiful vacation home" />
          <div class="absolute inset-0 bg-black/20"></div>
          <div class="absolute inset-0 flex flex-col pt-32 px-12 md:px-24 z-10 text-white" style="text-shadow: 0 4px 12px rgba(0,0,0,0.5);">
            <h1 class="text-5xl md:text-6xl font-bold leading-tight mb-4 max-w-xl" style="letter-spacing: -0.44px;">Find your next <br>great tech discovery</h1>
            <p class="text-xl md:text-2xl mb-8 font-medium">Join thousands of buyers and sellers on finconnect.</p>
            <div class="flex gap-4">
              <button class="airbnb-radius-button bg-[var(--palette-bg-primary-core)] text-white px-6 py-3 font-semibold text-base hover:bg-[var(--palette-bg-tertiary-core)] transition-colors inline-block text-center border-none cursor-pointer" (click)="handleCtaClick()">Start Shopping</button>
              <button class="airbnb-radius-button bg-white text-[var(--palette-text-primary)] px-6 py-3 font-semibold text-base hover:bg-gray-50 transition-colors inline-block text-center border-none cursor-pointer" (click)="handleCtaClick()">Become a Seller</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Marketplace Section -->
      <div class="px-6 md:px-10 lg:px-20 mt-16 mb-20 mx-auto w-full max-w-[1920px]">
        <div class="mb-8">
            <h2 class="text-3xl md:text-4xl font-bold text-[var(--palette-text-primary)] mb-2" style="letter-spacing: -0.44px;">Latest Marketplace Products</h2>
            <p class="text-[var(--palette-text-secondary)] text-lg">Discover the newest items posted by our community.</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <div *ngFor="let product of products; let i = index" class="group cursor-pointer" (click)="handleBuyClick(product)">
            <div class="relative w-full aspect-[16/15] overflow-hidden airbnb-radius-card mb-3">
              <img [src]="getImagePath(i)" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" alt="Listing image" />
              <button class="absolute top-3 right-3 text-white border-none bg-transparent cursor-pointer z-10 w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/10 transition-colors" style="text-shadow: 0 1px 4px rgba(0,0,0,0.4)">
                 <i class="pi pi-heart text-xl"></i>
              </button>
            </div>
            <div class="flex flex-col">
              <div class="flex justify-between items-start">
                <h3 class="font-semibold text-base text-[var(--palette-text-primary)] leading-tight truncate pr-2">{{ product.productName }}</h3>
                <div class="flex items-center text-[var(--palette-text-primary)] text-sm whitespace-nowrap">
                  <i class="pi pi-star-fill text-xs mr-1"></i> 4.96
                </div>
              </div>
              <p class="text-[var(--palette-text-secondary)] text-sm mt-1 line-clamp-1 truncate">{{ product.description }}</p>
              <div class="mt-2 text-[var(--palette-text-primary)]">
                <span class="font-semibold text-base">{{ product.price | currency }}</span> <span class="font-normal text-sm">each</span>
              </div>
            </div>
          </div>
          
          <div *ngIf="products.length === 0 && !isLoading" class="col-span-full text-center py-20 bg-gray-50 airbnb-radius-card airbnb-shadow">
            <i class="pi pi-inbox text-gray-400 text-5xl mb-4"></i>
            <h3 class="text-2xl font-semibold text-[var(--palette-text-primary)]">No Products Available</h3>
            <p class="text-[var(--palette-text-secondary)] mt-2">Our sellers haven't stocked the shelves yet. Check back soon!</p>
          </div>

          <div *ngIf="isLoading" class="col-span-full text-center py-20">
            <i class="pi pi-spin pi-spinner text-[var(--palette-bg-primary-core)] text-4xl"></i>
          </div>
        </div>
      </div>
      
      <!-- Footer -->
      <footer class="border-t border-[var(--palette-border-gray)] bg-gray-50 py-10 px-6 md:px-10 lg:px-20 mt-auto">
         <div class="flex flex-col md:flex-row justify-between items-center text-sm text-[var(--palette-text-secondary)]">
            <div class="flex gap-4 mb-4 md:mb-0">
               <span>© 2026 finconnect, Inc.</span>
               <a href="#" class="hover:underline">Terms</a>
               <a href="#" class="hover:underline">Sitemap</a>
               <a href="#" class="hover:underline">Privacy</a>
            </div>
            <div class="flex items-center gap-4 font-semibold text-[var(--palette-text-primary)]">
               <span class="flex items-center gap-1 cursor-pointer hover:underline"><i class="pi pi-globe"></i> English (US)</span>
               <span class="cursor-pointer hover:underline">$ USD</span>
               <div class="flex gap-3 ml-2 text-lg">
                  <i class="pi pi-facebook cursor-pointer hover:text-blue-600"></i>
                  <i class="pi pi-twitter cursor-pointer hover:text-blue-400"></i>
                  <i class="pi pi-instagram cursor-pointer hover:text-pink-600"></i>
               </div>
            </div>
         </div>
      </footer>
    </div>
  `
})
export class LandingComponent implements OnInit {
  products: Product[] = [];
  isLoading = true;

  private productService = inject(ProductService);
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit() {
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data.slice(0, 10); // show a few more for the grid
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load public products', err);
        this.isLoading = false;
      }
    });
  }

  getImagePath(index: number): string {
    return '/images/listing_image_' + ((index % 3) + 1) + '.png';
  }

  handleCtaClick() {
    this.redirectLogic();
  }

  handleBuyClick(product: Product) {
    this.redirectLogic();
  }

  private redirectLogic() {
    const isLoggedIn = this.authService.isAuthenticated();
    if (isLoggedIn) {
      const role = this.authService.currentUser()?.role;
      if (role === 'SELLER') {
          this.router.navigate(['/seller/dashboard']);
      } else if (role === 'ADMIN') {
          this.router.navigate(['/admin']);
      } else {
          this.router.navigate(['/']); // or /home depending on customer path
      }
    } else {
      this.router.navigate(['/login']); // updated from /auth/login based on routing
    }
  }
}
