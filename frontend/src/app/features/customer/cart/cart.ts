import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../core/services/cart.service';
import { Router } from '@angular/router';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { DividerModule } from 'primeng/divider';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule, TableModule, DividerModule, ProgressSpinnerModule],
  templateUrl: './cart.html'
})
export class CartComponent implements OnInit {
  public cartService = inject(CartService);
  private router = inject(Router);

  ngOnInit() {
    this.cartService.getCart().subscribe();
  }

  getTotalPrice(): number {
    const currentCart = this.cartService.cart();
    if (!currentCart || !currentCart.items) return 0;
    
    return currentCart.items.reduce((acc, item) => {
      // populate returns the full product object 
      return acc + (item.productId?.price || 0) * item.quantity;
    }, 0);
  }

  continueShopping() {
    this.router.navigate(['/home']);
  }

  checkout() {
    this.router.navigate(['/checkout']);
  }
}
