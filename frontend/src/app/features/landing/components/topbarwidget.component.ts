import { Component, inject } from '@angular/core';
import { StyleClassModule } from 'primeng/styleclass';
import { Router, RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'topbar-widget',
    standalone: true,
    imports: [RouterModule, StyleClassModule, ButtonModule, RippleModule, CommonModule],
    template: `
        <div class="flex items-center justify-between w-full">
            <a class="flex items-center" href="#">
                <svg viewBox="0 0 54 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-12 mr-2">
                    <path d="M27.3546 0C34.5281 0 40.8075 3.82591 44.2613 9.54743L40.9084 10.2176C37.9134 5.95821 32.9593 3.1746 27.3546 3.1746C21.7442 3.1746 16.7856 5.96385 13.7915 10.2305L10.4399 9.56057C13.892 3.83178 20.1756 0 27.3546 0Z" fill="var(--primary-color)"/>
                </svg>
                <span class="text-surface-900 dark:text-surface-0 font-medium text-2xl leading-normal mr-8">E-COMMERCE</span>
            </a>

            <div class="flex items-center gap-2">
                <button pButton pRipple label="Login" routerLink="/login" [rounded]="true" [text]="true"></button>
                <button pButton pRipple label="Register" routerLink="/signup" [rounded]="true"></button>
            </div>
        </div>
    `
})
export class TopbarWidget {
    router = inject(Router);
}
