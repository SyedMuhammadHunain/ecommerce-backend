import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService, AdminUser } from '../../core/services/admin.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule, 
    TableModule, 
    ButtonModule, 
    ToastModule, 
    ConfirmDialogModule
  ],
  providers: [ConfirmationService, MessageService],
  template: `
    <div class="px-6 md:px-10 lg:px-20 mx-auto w-full max-w-[1920px] py-8">
      <p-toast></p-toast>
      <p-confirmDialog [style]="{width: '450px'}"></p-confirmDialog>

      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-[var(--palette-text-primary)] tracking-tight">Admin Dashboard</h1>
          <p class="text-[var(--palette-text-secondary)] mt-2">Manage sellers and customers across the platform.</p>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-[var(--palette-border-gray)] overflow-hidden">
        
        <!-- Tab Headers -->
        <div class="flex border-b border-[var(--palette-border-gray)]">
            <button class="px-6 py-4 font-semibold text-[var(--palette-text-primary)] focus:outline-none transition-colors border-b-2"
                    [ngClass]="activeTab === 'customers' ? 'border-[var(--palette-bg-primary-core)] text-[var(--palette-bg-primary-core)]' : 'border-transparent text-[var(--palette-text-secondary)] hover:text-[var(--palette-text-primary)]'"
                    (click)="activeTab = 'customers'">
                Customers ({{customers.length}})
            </button>
            <button class="px-6 py-4 font-semibold text-[var(--palette-text-primary)] focus:outline-none transition-colors border-b-2"
                    [ngClass]="activeTab === 'sellers' ? 'border-[var(--palette-bg-primary-core)] text-[var(--palette-bg-primary-core)]' : 'border-transparent text-[var(--palette-text-secondary)] hover:text-[var(--palette-text-primary)]'"
                    (click)="activeTab = 'sellers'">
                Sellers ({{sellers.length}})
            </button>
        </div>

        <div class="p-6">
          <!-- Customers Tab -->
          <div *ngIf="activeTab === 'customers'">
             <p-table [value]="customers" [paginator]="true" [rows]="10" responsiveLayout="scroll" [loading]="loading">
               <ng-template pTemplate="header">
                 <tr>
                   <th pSortableColumn="name">Name <p-sortIcon field="name"></p-sortIcon></th>
                   <th pSortableColumn="email">Email <p-sortIcon field="email"></p-sortIcon></th>
                   <th>Actions</th>
                 </tr>
               </ng-template>
               <ng-template pTemplate="body" let-customer>
                 <tr>
                   <td class="font-medium">{{customer.name}}</td>
                   <td>{{customer.email}}</td>
                   <td>
                     <p-button icon="pi pi-trash" styleClass="p-button-danger p-button-text p-button-rounded" (onClick)="confirmDelete(customer, 'CUSTOMER')"></p-button>
                   </td>
                 </tr>
               </ng-template>
               <ng-template pTemplate="emptymessage">
                 <tr>
                   <td colspan="3" class="text-center py-6 text-[var(--palette-text-secondary)]">No customers found.</td>
                 </tr>
               </ng-template>
             </p-table>
          </div>

          <!-- Sellers Tab -->
          <div *ngIf="activeTab === 'sellers'">
             <p-table [value]="sellers" [paginator]="true" [rows]="10" responsiveLayout="scroll" [loading]="loading">
               <ng-template pTemplate="header">
                 <tr>
                   <th pSortableColumn="name">Name <p-sortIcon field="name"></p-sortIcon></th>
                   <th pSortableColumn="email">Email <p-sortIcon field="email"></p-sortIcon></th>
                   <th>Actions</th>
                 </tr>
               </ng-template>
               <ng-template pTemplate="body" let-seller>
                 <tr>
                   <td class="font-medium">{{seller.name}}</td>
                   <td>{{seller.email}}</td>
                   <td>
                     <p-button icon="pi pi-trash" styleClass="p-button-danger p-button-text p-button-rounded" (onClick)="confirmDelete(seller, 'SELLER')"></p-button>
                   </td>
                 </tr>
               </ng-template>
               <ng-template pTemplate="emptymessage">
                 <tr>
                   <td colspan="3" class="text-center py-6 text-[var(--palette-text-secondary)]">No sellers found.</td>
                 </tr>
               </ng-template>
             </p-table>
          </div>
        </div>

      </div>
    </div>
  `
})
export class AdminComponent implements OnInit {
  customers: AdminUser[] = [];
  sellers: AdminUser[] = [];
  loading = false;
  activeTab: 'customers' | 'sellers' = 'customers';

  private adminService = inject(AdminService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.adminService.getCustomers().subscribe({
      next: (res) => {
        this.customers = res;
        this.loading = false;
      },
      error: () => this.loading = false
    });

    this.adminService.getSellers().subscribe({
      next: (res) => this.sellers = res,
      error: () => {}
    });
  }

  confirmDelete(user: AdminUser, type: string) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the ' + type.toLowerCase() + ' ' + user.name + '?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.adminService.deleteUser(user._id).subscribe({
          next: () => {
            if (type === 'CUSTOMER') {
               this.customers = this.customers.filter(c => c._id !== user._id);
            } else {
               this.sellers = this.sellers.filter(s => s._id !== user._id);
            }
            this.messageService.add({severity: 'success', summary: 'Success', detail: 'User deleted successfully'});
          },
          error: () => {
            this.messageService.add({severity: 'error', summary: 'Error', detail: 'Failed to delete user'});
          }
        });
      }
    });
  }
}
