import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../core/services/order.service';

// PrimeNG
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, TableModule, TagModule, ProgressSpinnerModule, ButtonModule],
  templateUrl: './orders.html'
})
export class OrdersComponent implements OnInit {
  public orderService = inject(OrderService);

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

  cancelOrder(id: string) {
    this.orderService.cancelOrder(id).subscribe();
  }
}
