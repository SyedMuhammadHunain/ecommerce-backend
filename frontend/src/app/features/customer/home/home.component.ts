import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule],
  template: `
    <div class="p-6">
      <h1 class="text-3xl font-bold mb-6 text-gray-800">Featured Products</h1>
      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <p-card *ngFor="let i of [1,2,3,4,5,6]" header="Product Title" subheader="$99.99" [style]="{ width: '100%' }">
              <ng-template pTemplate="header">
                  <div class="h-48 bg-gray-200 flex items-center justify-center rounded-t-md">
                      <i class="pi pi-image text-4xl text-gray-400"></i>
                  </div>
              </ng-template>
              <p>A brief description of this amazing product that you definitely want to buy.</p>
              <ng-template pTemplate="footer">
                  <div class="flex gap-3 mt-1">
                      <p-button label="Add to Cart" icon="pi pi-shopping-cart" styleClass="w-full"></p-button>
                  </div>
              </ng-template>
          </p-card>
      </div>
    </div>
  `
})
export class HomeComponent {}
