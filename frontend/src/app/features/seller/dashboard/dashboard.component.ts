import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-seller-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-3xl font-bold mb-6 text-gray-800">Seller Dashboard</h1>
      <div class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
        <p class="font-bold">Welcome Seller!</p>
        <p>This is where you will manage your products and view orders.</p>
      </div>
    </div>
  `
})
export class DashboardComponent {}
