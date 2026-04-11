import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-seller-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule],
  template: `
    <div class="p-6 md:p-10 max-w-7xl mx-auto">
      
      <!-- Welcome Banner -->
      <div class="rounded-2xl bg-gradient-to-r from-[var(--palette-bg-primary-core)] to-teal-400 p-8 md:p-10 text-white mb-10 shadow-lg relative overflow-hidden">
        <div class="relative z-10">
          <h1 class="text-3xl md:text-4xl font-bold mb-3 tracking-tight">Welcome back, {{ sellerName }}!</h1>
          <p class="opacity-95 text-lg max-w-lg leading-relaxed">Here's what's happening with your store today. Keep up the great work and watch your sales grow.</p>
        </div>
        <i class="pi pi-shop absolute -right-6 -bottom-10 text-9xl opacity-20 transform -rotate-12"></i>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div class="bg-white p-6 rounded-2xl border border-[var(--palette-border-gray)] shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-[var(--palette-text-secondary)] font-medium">Total Revenue</h3>
            <div class="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-[var(--palette-bg-primary-core)]"><i class="pi pi-dollar text-xl"></i></div>
          </div>
          <p class="text-3xl font-bold text-[var(--palette-text-primary)] mt-2">$0.00</p>
          <p class="text-sm text-emerald-600 mt-2 flex items-center"><i class="pi pi-arrow-up mr-1 text-xs"></i> 0% from last month</p>
        </div>

        <div class="bg-white p-6 rounded-2xl border border-[var(--palette-border-gray)] shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-[var(--palette-text-secondary)] font-medium">Orders</h3>
            <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"><i class="pi pi-shopping-bag text-xl"></i></div>
          </div>
          <p class="text-3xl font-bold text-[var(--palette-text-primary)] mt-2">0</p>
          <p class="text-sm text-gray-400 mt-2 flex items-center"><i class="pi pi-minus mr-1 text-xs"></i> No change</p>
        </div>

        <div class="bg-white p-6 rounded-2xl border border-[var(--palette-border-gray)] shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-[var(--palette-text-secondary)] font-medium">Active Products</h3>
            <div class="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600"><i class="pi pi-tags text-xl"></i></div>
          </div>
          <p class="text-3xl font-bold text-[var(--palette-text-primary)] mt-2">0</p>
          <p class="text-sm text-[var(--palette-text-secondary)] mt-2">Manage your inventory</p>
        </div>

        <div class="bg-white p-6 rounded-2xl border border-[var(--palette-border-gray)] shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-[var(--palette-text-secondary)] font-medium">Store Views</h3>
            <div class="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600"><i class="pi pi-eye text-xl"></i></div>
          </div>
          <p class="text-3xl font-bold text-[var(--palette-text-primary)] mt-2">0</p>
          <p class="text-sm text-[var(--palette-text-secondary)] mt-2">Past 30 days</p>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white p-8 rounded-2xl border border-[var(--palette-border-gray)] shadow-sm">
        <div class="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-gray-100 pb-4">
          <h2 class="text-xl font-bold text-[var(--palette-text-primary)] flex items-center"><i class="pi pi-bolt text-yellow-500 mr-2 text-2xl"></i> Quick Actions</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <p-button label="Add New Product" icon="pi pi-plus" styleClass="w-full bg-[var(--palette-bg-primary-core)] border-none text-white hover:bg-[var(--palette-bg-tertiary-core)] transition-colors p-4 rounded-xl font-semibold shadow-sm"></p-button>
          <p-button label="View Pending Orders" icon="pi pi-list" styleClass="w-full text-[var(--palette-text-primary)] bg-gray-100 border-none hover:bg-gray-200 transition-colors p-4 rounded-xl font-medium shadow-sm"></p-button>
          <p-button label="Store Settings" icon="pi pi-cog" styleClass="w-full text-[var(--palette-text-primary)] bg-gray-100 border-none hover:bg-gray-200 transition-colors p-4 rounded-xl font-medium shadow-sm"></p-button>
        </div>
      </div>

    </div>
  `
})
export class DashboardComponent {
  authService = inject(AuthService);
  
  get sellerName(): string {
    const user = this.authService.currentUser();
    return user?.firstName ? \`\${user.firstName}\` : 'Seller';
  }
}
