import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../core/services/order.service';

// PrimeNG
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-seller-orders',
  standalone: true,
  imports: [CommonModule, TableModule, TagModule, ButtonModule, SelectModule, FormsModule, ProgressSpinnerModule, ToastModule],
  providers: [MessageService],
  templateUrl: './orders.html'
})
export class SellerOrdersComponent implements OnInit {
  public orderService = inject(OrderService);
  private messageService = inject(MessageService);

  statuses = [
    { label: 'Pending', value: 'pending' },
    { label: 'Paid', value: 'paid' },
    { label: 'Shipped', value: 'shipped' },
    { label: 'Delivered', value: 'delivered' },
    { label: 'Cancelled', value: 'cancelled' }
  ];

  ngOnInit() {
    this.orderService.getUserOrders().subscribe();
  }

  getSeverity(status: string) {
    if (!status) return 'info';
    switch (status.toLowerCase()) {
        case 'delivered':
        case 'paid':
            return 'success';
        case 'shipped':
            return 'info';
        case 'pending':
            return 'warn';
        case 'cancelled':
            return 'danger';
        default:
            return 'info';
    }
  }

  updateStatus(orderId: string, newStatus: string) {
    this.orderService.updateOrderStatus(orderId, newStatus).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Order status updated' });
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update order status' });
      }
    });
  }
}
