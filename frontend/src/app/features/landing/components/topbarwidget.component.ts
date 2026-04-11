import { Component, inject } from '@angular/core';
import { StyleClassModule } from 'primeng/styleclass';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'topbar-widget',
    standalone: true,
    imports: [RouterModule, StyleClassModule, CommonModule],
    template: `
        <header class="sticky top-0 z-50 w-full bg-white border-b border-[var(--palette-border-gray)]">
            <div class="px-6 md:px-10 lg:px-20 py-4 flex items-center justify-between mx-auto">
                
                <!-- Logo -->
                <a class="flex items-center text-[var(--palette-bg-primary-core)] cursor-pointer" (click)="router.navigate(['/landing'])">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />
                        <path d="M12 7c-2.757 0-5 2.243-5 5s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5zm0 8c-1.654 0-3-1.346-3-3s1.346-3 3-3 3 1.346 3 3-1.346 3-3 3z" />
                    </svg>
                    <span class="ml-2 font-bold text-xl tracking-tight hidden lg:block">finconnect</span>
                </a>

                <!-- Search Pill -->
                <div class="hidden md:flex items-center airbnb-shadow hover:shadow-[var(--shadow-hover)] transition-shadow duration-200 border border-[var(--palette-border-gray)] rounded-full px-2 py-2 cursor-pointer" style="border-radius: 40px;">
                    <button class="px-4 text-sm font-semibold text-[var(--palette-text-primary)] bg-transparent border-none cursor-pointer">Anywhere</button>
                    <span class="w-px h-6 bg-gray-300"></span>
                    <button class="px-4 text-sm font-semibold text-[var(--palette-text-primary)] bg-transparent border-none cursor-pointer">Any week</button>
                    <span class="w-px h-6 bg-gray-300"></span>
                    <button class="pl-4 pr-2 text-sm text-[var(--palette-text-secondary)] bg-transparent border-none cursor-pointer flex items-center gap-3">
                        Add guests
                        <div class="bg-[var(--palette-bg-primary-core)] text-white w-8 h-8 rounded-full flex items-center justify-center">
                            <i class="pi pi-search text-xs"></i>
                        </div>
                    </button>
                </div>

                <!-- Right Menu -->
                <div class="flex items-center gap-2">
                    <button class="hidden lg:block text-sm font-semibold px-4 py-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer border-none bg-transparent" routerLink="/auth/signup">
                        Airbnb your home
                    </button>
                    <button class="hidden lg:flex items-center justify-center w-10 h-10 hover:bg-gray-100 rounded-full transition-colors cursor-pointer border-none bg-transparent">
                        <i class="pi pi-globe text-[var(--palette-text-primary)] text-lg"></i>
                    </button>
                    <div class="flex items-center gap-3 border border-[var(--palette-border-gray)] rounded-full p-1 pl-3 hover:shadow-[var(--shadow-card)] transition-shadow cursor-pointer bg-white" routerLink="/login">
                        <i class="pi pi-bars text-[var(--palette-text-primary)] text-sm"></i>
                        <i class="pi pi-user text-gray-500 text-2xl"></i>
                    </div>
                </div>
            </div>
            
            <!-- Category Pills (mock) -->
            <div class="px-6 md:px-10 lg:px-20 py-4 flex gap-8 overflow-x-auto border-t border-[var(--palette-border-gray)] hide-scrollbar">
                <div class="flex flex-col items-center gap-2 cursor-pointer text-[var(--palette-text-primary)] min-w-[max-content] pb-2 border-b-2 border-[var(--palette-text-primary)]">
                    <i class="pi pi-home text-2xl"></i>
                    <span class="text-xs font-semibold">Cabins</span>
                </div>
                <div class="flex flex-col items-center gap-2 cursor-pointer text-[var(--palette-text-secondary)] hover:text-[var(--palette-text-primary)] min-w-[max-content] pb-2 hover:border-b-2 hover:border-gray-300 transition-all">
                    <i class="pi pi-bolt text-2xl"></i>
                    <span class="text-xs font-medium">Trending</span>
                </div>
                <div class="flex flex-col items-center gap-2 cursor-pointer text-[var(--palette-text-secondary)] hover:text-[var(--palette-text-primary)] min-w-[max-content] pb-2 hover:border-b-2 hover:border-gray-300 transition-all">
                    <i class="pi pi-sun text-2xl"></i>
                    <span class="text-xs font-medium">Amazing pools</span>
                </div>
                <div class="flex flex-col items-center gap-2 cursor-pointer text-[var(--palette-text-secondary)] hover:text-[var(--palette-text-primary)] min-w-[max-content] pb-2 hover:border-b-2 hover:border-gray-300 transition-all">
                    <i class="pi pi-compass text-2xl"></i>
                    <span class="text-xs font-medium">National parks</span>
                </div>
                 <div class="flex flex-col items-center gap-2 cursor-pointer text-[var(--palette-text-secondary)] hover:text-[var(--palette-text-primary)] min-w-[max-content] pb-2 hover:border-b-2 hover:border-gray-300 transition-all">
                    <i class="pi pi-star text-2xl"></i>
                    <span class="text-xs font-medium">Luxe</span>
                </div>
            </div>
        </header>
    `
})
export class TopbarWidget {
    router = inject(Router);
}
