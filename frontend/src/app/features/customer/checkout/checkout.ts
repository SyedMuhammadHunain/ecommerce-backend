import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { CheckoutService } from '../../../core/services/checkout.service';

// PrimeNG
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    InputTextModule, 
    ButtonModule, 
    CardModule, 
    ToastModule,
    DividerModule
  ],
  providers: [MessageService],
  templateUrl: './checkout.html'
})
export class CheckoutComponent implements OnInit {
  checkoutForm!: FormGroup;
  private fb = inject(FormBuilder);
  public cartService = inject(CartService);
  public checkoutService = inject(CheckoutService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  ngOnInit() {
    // If cart is empty, redirect back
    const cart = this.cartService.cart();
    if (!cart || !cart.items || cart.items.length === 0) {
      this.router.navigate(['/cart']);
    }

    this.checkoutForm = this.fb.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', Validators.required],
      country: ['', Validators.required]
    });
  }

  getTotalPrice(): number {
    const currentCart = this.cartService.cart();
    if (!currentCart || !currentCart.items) return 0;
    
    return currentCart.items.reduce((acc, item) => {
      return acc + (item.productId?.price || 0) * item.quantity;
    }, 0);
  }

  onSubmit() {
    if (this.checkoutForm.invalid) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all required fields' });
      return;
    }

    const currentCart = this.cartService.cart();
    if (!currentCart || !currentCart.items) return;

    // Transform cart to payload format
    const payload = {
      shippingAddress: this.checkoutForm.value,
      items: currentCart.items.map(item => ({
        productId: item.productId._id,
        quantity: item.quantity,
        price: item.productId.price
      }))
    };

    this.checkoutService.placeOrder(payload).subscribe({
      next: (response: any) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Order placed successfully! Redirecting to payment...' });
        
        // Clear the cart on frontend explicitly
        this.cartService.clearCart().subscribe();

        // Let user see the success message
        setTimeout(() => {
          if (response && response.url) {
            window.location.href = response.url;
          } else {
            this.router.navigate(['/home']);
          }
        }, 1500);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to place order' });
      }
    });
  }
}

