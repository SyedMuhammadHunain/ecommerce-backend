import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../core/services/order.service';

// PrimeNG
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { TimelineModule } from 'primeng/timeline';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, TableModule, TagModule, SkeletonModule, TimelineModule, BadgeModule, ButtonModule, ImageModule],
  templateUrl: './orders.html'
})
export class OrdersComponent implements OnInit {
  public orderService = inject(OrderService);
  private router = inject(Router);
  
  expandedRows = {};

  timelineEvents = [
    { status: 'Ordered', icon: 'pi pi-shopping-cart', color: '#3B82F6', date: 'Date Ordered' },
    { status: 'Processing', icon: 'pi pi-cog', color: '#F59E0B', date: 'In Transit' },
    { status: 'Shipped', icon: 'pi pi-truck', color: '#10B981', date: 'Shipped' },
    { status: 'Delivered', icon: 'pi pi-check', color: '#059669', date: 'Completed' }
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

  getTimelineData(order: any) {
    const status = order.status?.toLowerCase();
    
    // Default base setup
    let events = [
      { status: 'Ordered', icon: 'pi pi-shopping-cart', color: '#3B82F6' },
      { status: 'Paid', icon: 'pi pi-credit-card', color: '#9CA3AF' },
      { status: 'Shipped', icon: 'pi pi-truck', color: '#9CA3AF' },
      { status: 'Delivered', icon: 'pi pi-check', color: '#9CA3AF' }
    ];

    if (status === 'pending') {
      events[0].color = '#F59E0B'; // yellow
    } else if (status === 'paid') {
      events[0].color = '#10B981';
      events[1].color = '#F59E0B';
    } else if (status === 'shipped') {
      events[0].color = '#10B981';
      events[1].color = '#10B981';
      events[2].color = '#F59E0B';
    } else if (status === 'delivered') {
      events[0].color = '#10B981';
      events[1].color = '#10B981';
      events[2].color = '#10B981';
      events[3].color = '#059669';
    } else if (status === 'cancelled') {
        return [
            { status: 'Ordered', icon: 'pi pi-shopping-cart', color: '#3B82F6' },
            { status: 'Cancelled', icon: 'pi pi-times', color: '#EF4444' }
        ]
    }
    
    return events;
  }

  cancelOrder(id: string) {
    this.orderService.cancelOrder(id).subscribe();
  }

  goToShop() {
    this.router.navigate(['/home']);
  }
}

