import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { CarouselModule } from 'primeng/carousel';
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
    ButtonModule,
    RippleModule,
    CardModule,
    TagModule,
    CarouselModule,
    TopbarWidget,
  ],
  template: `
    <div class="bg-surface-0 dark:bg-surface-900 min-h-screen flex flex-col">
      <topbar-widget class="py-6 px-6 mx-0 md:mx-12 lg:mx-20 lg:px-20 flex flex-wrap items-center justify-between relative lg:static" />
      
      <div id="hero" class="flex flex-col pt-6 px-6 lg:px-20 overflow-hidden">
        <div class="mx-6 md:mx-20 mt-0 md:mt-12 text-center">
            <h1 class="text-6xl font-bold text-surface-900 dark:text-surface-0 mb-2 leading-tight">Explore the Best Tech at E-Commerce</h1>
            <div class="font-normal text-2xl leading-normal text-surface-700 dark:text-surface-100 mb-8">
              Join thousands of buyers and sellers using our high-performance marketplace. Buy cool stuff or become a seller!
            </div>
            <div class="flex justify-center gap-4">
              <button pButton pRipple type="button" label="Start Shopping" class="p-button-rounded text-xl border-none font-normal" (click)="handleCtaClick()"></button>
              <button pButton pRipple type="button" label="Become a Seller" class="p-button-rounded text-xl border-none font-normal p-button-secondary" (click)="handleSellerClick()"></button>
            </div>
        </div>
      </div>

      <div id="trusted" class="py-12 px-6 lg:px-20 mx-0 mt-8 text-center">
          <div class="text-center mb-8">
              <h2 class="text-2xl font-semibold text-surface-500 dark:text-surface-400 mb-4 uppercase tracking-wider">Trusted By</h2>
          </div>
          <div class="flex justify-center gap-8 md:gap-16 flex-wrap items-center">
              <i class="pi pi-amazon text-5xl md:text-6xl text-surface-400"></i>
              <i class="pi pi-apple text-5xl md:text-6xl text-surface-400"></i>
              <i class="pi pi-discord text-5xl md:text-6xl text-surface-400"></i>
              <i class="pi pi-github text-5xl md:text-6xl text-surface-400"></i>
              <i class="pi pi-google text-5xl md:text-6xl text-surface-400"></i>
          </div>
      </div>

      <div id="features" class="py-12 px-6 lg:px-20 mx-0 md:mx-12 lg:mx-20 mt-12 bg-surface-50 dark:bg-surface-900/50 rounded-xl">
          <div class="text-center mb-12">
              <h2 class="text-4xl font-bold text-surface-900 dark:text-surface-0 mb-4">Features</h2>
              <p class="text-surface-600 dark:text-surface-300 text-lg">What makes our platform the best.</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div class="p-4">
                  <div class="w-16 h-16 mx-auto bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mb-4">
                      <i class="pi pi-bolt text-3xl text-primary-500"></i>
                  </div>
                  <h3 class="text-xl text-surface-900 dark:text-surface-0 font-semibold mb-2">Fast Delivery</h3>
                  <p class="text-surface-600 dark:text-surface-300 leading-relaxed">Get your products delivered in record time directly to your door.</p>
              </div>
              <div class="p-4">
                  <div class="w-16 h-16 mx-auto bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mb-4">
                      <i class="pi pi-shield text-3xl text-primary-500"></i>
                  </div>
                  <h3 class="text-xl text-surface-900 dark:text-surface-0 font-semibold mb-2">Secure Payments</h3>
                  <p class="text-surface-600 dark:text-surface-300 leading-relaxed">Your transactions are 100% secure with enterprise-grade encryption.</p>
              </div>
              <div class="p-4">
                  <div class="w-16 h-16 mx-auto bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mb-4">
                      <i class="pi pi-star text-3xl text-primary-500"></i>
                  </div>
                  <h3 class="text-xl text-surface-900 dark:text-surface-0 font-semibold mb-2">Top Quality</h3>
                  <p class="text-surface-600 dark:text-surface-300 leading-relaxed">We only work with trusted sellers to ensure the best products.</p>
              </div>
          </div>
      </div>

      <div id="products-catalog" class="py-12 px-6 lg:px-20 mx-0 md:mx-12 lg:mx-20 mt-12 bg-surface-50 dark:bg-surface-900/50 rounded-xl rounded-b-none">
        <div class="text-center mb-8">
            <h2 class="text-4xl font-bold text-surface-900 dark:text-surface-0 mb-4">Latest Marketplace Products</h2>
            <p class="text-surface-600 dark:text-surface-300 text-lg">Browse our newest items posted by sellers across the platform.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          <div *ngFor="let product of products" class="col-span-1">
            <p-card [style]="{ 'height': '100%', 'display': 'flex', 'flex-direction': 'column' }" styleClass="p-card-shadow h-full flex flex-col relative overflow-hidden">
              <p-tag value="Featured" severity="info" class="absolute top-4 right-4 z-10"></p-tag>
              
              <ng-template pTemplate="header">
                   <div class="w-full h-48 bg-surface-200 dark:bg-surface-800 flex items-center justify-center relative overflow-hidden">
                      <div class="absolute inset-0 bg-gradient-to-tr from-primary-400 to-indigo-500 opacity-20"></div>
                      <i class="pi pi-box text-6xl text-surface-400"></i>
                   </div>
              </ng-template>

              <div class="flex-grow flex flex-col mt-2">
                <div class="text-2xl font-semibold text-surface-900 dark:text-surface-0 mb-2">{{ product.productName }}</div>
                <div class="text-surface-600 dark:text-surface-200 mb-4 line-clamp-2 text-sm">{{ product.description }}</div>
              </div>

               <ng-template pTemplate="footer">
                  <div class="flex justify-between items-center w-full border-t border-surface-200 dark:border-surface-700 pt-4 mt-auto">
                    <span class="text-xl font-bold text-primary-600 dark:text-primary-400">{{ product.price | currency }}</span>
                    <button pButton pRipple icon="pi pi-shopping-cart" label="Buy" size="small" (click)="handleBuyClick(product)"></button>
                  </div>
               </ng-template>
            </p-card>
          </div>
          
          <div *ngIf="products.length === 0 && !isLoading" class="col-span-1 md:col-span-2 xl:col-span-3 text-center py-12">
            <i class="pi pi-inbox text-surface-500 text-5xl mb-4"></i>
            <h3 class="text-2xl font-medium text-surface-900 dark:text-surface-0">No Products Available</h3>
            <p class="text-surface-600 dark:text-surface-300">Our sellers haven't stocked the shelves yet. Check back soon!</p>
          </div>

          <div *ngIf="isLoading" class="col-span-1 md:col-span-2 xl:col-span-3 text-center py-12">
            <i class="pi pi-spin pi-spinner text-primary-500 text-5xl"></i>
          </div>

        </div>
      </div>

      <div id="testimonials" class="py-12 px-6 lg:px-20 mx-0 md:mx-12 lg:mx-20 mt-12 mb-20 bg-surface-50 dark:bg-surface-900/50 rounded-xl">
          <div class="text-center mb-8">
              <h2 class="text-4xl font-bold text-surface-900 dark:text-surface-0 mb-4">Testimonials</h2>
              <p class="text-surface-600 dark:text-surface-300 text-lg">What our users say about us.</p>
          </div>
          <p-carousel [value]="testimonials" [numVisible]="3" [numScroll]="1" [circular]="true" [responsiveOptions]="responsiveOptions" [autoplayInterval]="3000">
              <ng-template let-testimonial pTemplate="item">
                  <div class="p-6 border border-surface-200 dark:border-surface-700 rounded-xl m-2 bg-surface-0 dark:bg-surface-900 text-center flex flex-col items-center">
                      <div class="w-16 h-16 rounded-full mb-4 shadow-md bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                          <i class="pi pi-user text-3xl text-primary-500"></i>
                      </div>
                      <p class="text-surface-600 dark:text-surface-200 italic mb-4 h-20 overflow-hidden line-clamp-3">"{{ testimonial.review }}"</p>
                      <h4 class="text-lg font-bold text-surface-900 dark:text-surface-0">{{ testimonial.name }}</h4>
                      <p class="text-surface-500 dark:text-surface-400 text-sm">{{ testimonial.role }}</p>
                  </div>
              </ng-template>
          </p-carousel>
      </div>

      <div id="footer" class="py-12 px-6 lg:px-20 mx-0 mt-auto bg-surface-900 dark:bg-surface-950 text-surface-0">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div class="col-span-1 md:col-span-1 border-r-0 md:border-r border-surface-700 pr-0 md:pr-4 relative mt-[-10px]">
                  <a class="flex items-center mb-4" href="#">
                      <svg viewBox="0 0 54 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-8 mr-2">
                          <path d="M27.3546 0C34.5281 0 40.8075 3.82591 44.2613 9.54743L40.9084 10.2176C37.9134 5.95821 32.9593 3.1746 27.3546 3.1746C21.7442 3.1746 16.7856 5.96385 13.7915 10.2305L10.4399 9.56057C13.892 3.83178 20.1756 0 27.3546 0Z" fill="var(--primary-color)"/>
                      </svg>
                      <span class="text-surface-0 font-medium text-xl leading-normal">E-COMMERCE</span>
                  </a>
                  <p class="text-surface-400 text-sm mt-3">Your ultimate destination for the best tech products and seamless shopping experiences. Join our community today!</p>
              </div>
              <div class="col-span-1 md:col-span-1 pl-0 md:pl-4">
                  <h4 class="text-lg font-bold mb-4">Quick Links</h4>
                  <ul class="list-none p-0 m-0 text-surface-400 flex flex-col gap-2">
                      <li><a class="cursor-pointer hover:text-primary-400 transition-colors">Home</a></li>
                      <li><a class="cursor-pointer hover:text-primary-400 transition-colors">Products</a></li>
                      <li><a class="cursor-pointer hover:text-primary-400 transition-colors">Features</a></li>
                      <li><a class="cursor-pointer hover:text-primary-400 transition-colors">Testimonials</a></li>
                  </ul>
              </div>
              <div class="col-span-1 md:col-span-1">
                  <h4 class="text-lg font-bold mb-4">Support</h4>
                  <ul class="list-none p-0 m-0 text-surface-400 flex flex-col gap-2">
                      <li><a class="cursor-pointer hover:text-primary-400 transition-colors">Help Center</a></li>
                      <li><a class="cursor-pointer hover:text-primary-400 transition-colors">Terms of Service</a></li>
                      <li><a class="cursor-pointer hover:text-primary-400 transition-colors">Privacy Policy</a></li>
                      <li><a class="cursor-pointer hover:text-primary-400 transition-colors">Contact Us</a></li>
                  </ul>
              </div>
              <div class="col-span-1 md:col-span-1">
                  <h4 class="text-lg font-bold mb-4">Follow Us</h4>
                  <div class="flex gap-4">
                      <a class="w-10 h-10 rounded-full bg-surface-800 flex items-center justify-center hover:bg-primary-500 transition-colors cursor-pointer text-surface-0"><i class="pi pi-facebook text-xl"></i></a>
                      <a class="w-10 h-10 rounded-full bg-surface-800 flex items-center justify-center hover:bg-primary-500 transition-colors cursor-pointer text-surface-0"><i class="pi pi-twitter text-xl"></i></a>
                      <a class="w-10 h-10 rounded-full bg-surface-800 flex items-center justify-center hover:bg-primary-500 transition-colors cursor-pointer text-surface-0"><i class="pi pi-instagram text-xl"></i></a>
                  </div>
              </div>
          </div>
          <div class="border-t border-surface-800 pt-6 text-center text-surface-400 text-sm">
              &copy; 2026 E-Commerce. All rights reserved.
          </div>
      </div>

    </div>
  `
})
export class LandingComponent implements OnInit {
  products: Product[] = [];
  isLoading = true;

  testimonials = [
    { name: 'John Doe', role: 'Happy Customer', review: 'Amazing platform with top notch products! I have found everything I needed.' },
    { name: 'Jane Smith', role: 'Verified Seller', review: 'Selling here has boosted my business exponentially. Highly recommend this platform.' },
    { name: 'Michael Johnson', role: 'Tech Enthusiast', review: 'I found the best tech deals on this site. The delivery was also super fast!' },
    { name: 'Sarah Williams', role: 'Boutique Owner', review: 'Very easy to use, secure payments, and a wonderful community of buyers.' },
    { name: 'David Lee', role: 'Regular Buyer', review: 'Great customer support and high-quality products. 5 stars all the way!' }
  ];

  responsiveOptions = [
    { breakpoint: '1400px', numVisible: 3, numScroll: 1 },
    { breakpoint: '1199px', numVisible: 2, numScroll: 1 },
    { breakpoint: '767px', numVisible: 1, numScroll: 1 }
  ];

  private productService = inject(ProductService);
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit() {
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data.slice(0, 6);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load public products', err);
        this.isLoading = false;
      }
    });
  }

  handleCtaClick() {
    this.redirectLogic();
  }

  handleSellerClick() {
    const isLoggedIn = this.authService.isAuthenticated();
    if (isLoggedIn) {
      const role = this.authService.currentUser()?.role;
      if (role === 'SELLER') {
          this.router.navigate(['/seller/dashboard']);
      } else if (role === 'CUSTOMER') {
          this.authService.becomeSeller().subscribe({
             next: () => console.log('Successfully became seller'),
             error: (err) => console.error('Failed to become seller', err)
          });
      } else {
         this.router.navigate(['/admin']);
      }
    } else {
      this.router.navigate(['/login']);
    }
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
          this.router.navigate(['/home']);
      }
    } else {
      this.router.navigate(['/login']);
    }
  }
}

