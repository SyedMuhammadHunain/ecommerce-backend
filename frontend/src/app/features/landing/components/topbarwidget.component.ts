import { Component, inject } from '@angular/core';
import { StyleClassModule } from 'primeng/styleclass';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'topbar-widget',
    standalone: true,
    imports: [RouterModule, StyleClassModule, CommonModule, ButtonModule],
    template: `
        <header class="sticky top-0 z-50 w-full bg-white border-b border-[var(--palette-border-gray)]">
            <div class="px-6 md:px-10 lg:px-20 py-4 flex items-center justify-between mx-auto">
                
                <!-- Logo -->
                <a class="flex items-center text-[var(--palette-bg-primary-core)] cursor-pointer" (click)="router.navigate(['/landing'])">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />
                        <path d="M12 7c-2.757 0-5 2.243-5 5s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5zm0 8c-1.654 0-3-1.346-3-3s1.346-3 3-3 3 1.346 3 3-1.346 3-3 3z" />
                    </svg>
                    <span class="ml-2 font-bold text-xl tracking-tight hidden lg:block">Ecommerce</span>
                </a>
                
                <!-- Auth Actions -->
                <div class="flex items-center gap-3">
                    <p-button label="Log In" styleClass="bg-transparent border-none text-[var(--palette-text-primary)] font-semibold hover:bg-gray-100 transition-colors px-4 py-2 rounded-lg" (onClick)="router.navigate(['/login'])"></p-button>
                    <p-button label="Sign Up" styleClass="airbnb-radius-button bg-[var(--palette-bg-primary-core)] text-white border-none font-semibold hover:bg-[var(--palette-bg-tertiary-core)] transition-colors px-5 py-2" (onClick)="router.navigate(['/signup'])"></p-button>
                </div>
            </div>
        </header>
    `
})
export class TopbarWidget {
    router = inject(Router);
}
