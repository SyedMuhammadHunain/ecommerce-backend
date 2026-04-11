import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';

@Component({
    selector: 'app-admin-layout',
    standalone: true,
    imports: [CommonModule, RouterOutlet, NavbarComponent],
    template: `
    <div class="min-h-screen bg-gray-50 flex flex-col">
      <app-navbar></app-navbar>
      <main class="flex-grow p-4 md:p-6 lg:p-8">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class AdminLayoutComponent { }
