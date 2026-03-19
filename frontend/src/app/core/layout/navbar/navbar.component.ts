import { Component, inject, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

// PrimeNG
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, MenubarModule, ButtonModule, BadgeModule],
  template: `
    <div class="card">
        <p-menubar [model]="items()">
            <ng-template pTemplate="start">
                <span class="text-xl font-bold text-blue-600 mr-8 cursor-pointer" (click)="navigateHome()">
                    <i class="pi pi-cart-plus text-xl mr-2"></i>E-Commerce
                </span>
            </ng-template>
            <ng-template pTemplate="end">
                <div class="flex items-center gap-4">
                    <span *ngIf="user()" class="text-gray-700 hidden sm:inline-block">
                        Welcome, <strong>{{ user()?.name || user()?.email }}</strong>
                    </span>
                    <span *ngIf="user()?.role === 'CUSTOMER'" class="cursor-pointer hover:text-blue-600 transition-colors p-overlay-badge mr-4" style="font-size: 1.25rem" (click)="goToCart()">
                       <i class="pi pi-shopping-cart text-2xl"></i>
                       <p-badge [value]="cartService.cartItemCount().toString()" severity="danger" styleClass="absolute top-0 right-0" [style]="{transform: 'translate(50%, -50%)'}"></p-badge>
                    </span>
                    <p-button 
                        label="Logout" 
                        icon="pi pi-power-off" 
                        (onClick)="logout()" 
                        styleClass="p-button-danger p-button-sm ml-4">
                    </p-button>
                </div>
            </ng-template>
        </p-menubar>
    </div>
  `
})
export class NavbarComponent implements OnInit {
  public authService = inject(AuthService);
  public cartService = inject(CartService);
  private router = inject(Router);

  public user = this.authService.currentUser;

  ngOnInit() {
    if (this.user()?.role === 'CUSTOMER') {
      this.cartService.getCart().subscribe();
    }
  }

  public items = computed<MenuItem[]>(() => {
    const role = this.user()?.role;
    
    if (role === 'SELLER') {
      return [
        { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/seller/dashboard'] },
        { label: 'Products', icon: 'pi pi-fw pi-box', routerLink: ['/seller/products'] },
        { label: 'Orders', icon: 'pi pi-fw pi-shopping-bag', routerLink: ['/seller/orders'] }
      ];
    }

    if (role === 'ADMIN') {
        return [
          { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/admin'] },
          { label: 'Manage Orders', icon: 'pi pi-fw pi-cog', routerLink: ['/admin/orders'] }
        ];
    }

    // Default Customer
    return [
      { label: 'Home', icon: 'pi pi-fw pi-home', routerLink: ['/home'] },
      { label: 'Categories', icon: 'pi pi-fw pi-tags', items: [
          { label: 'Electronics' },
          { label: 'Clothing' },
          { label: 'Home & Living' }
      ]},
      { label: 'Become a Seller', icon: 'pi pi-fw pi-star' },
      { label: 'My Orders', icon: 'pi pi-fw pi-box', routerLink: ['/orders'] }
    ];
  });

  navigateHome() {
      const role = this.user()?.role;
      if (role === 'SELLER') this.router.navigate(['/seller/dashboard']);
      else if (role === 'ADMIN') this.router.navigate(['/admin']);
      else this.router.navigate(['/home']);
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }

  logout() {
    this.authService.logout();
  }
}
