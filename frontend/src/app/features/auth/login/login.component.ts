import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

// PrimeNG
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    MessageModule,
    MessagesModule,
    ToastModule
  ],
  template: `
    <div class="flex align-items-center justify-content-center h-screen bg-gray-100">
      <p-toast></p-toast>
      <p-card header="Welcome Back" subheader="Sign in to continue" [style]="{width: '400px', padding: '1rem'}">
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="flex flex-column gap-3">
          
          <div class="field">
            <label for="email" class="block mb-2">Email</label>
            <input 
              id="email" 
              type="email" 
              pInputText 
              formControlName="email" 
              class="w-full mb-1" 
              autofocus />
            <div *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.dirty">
              <p-message severity="error" text="Valid email is required"></p-message>
            </div>
          </div>

          <div class="field">
            <label for="password" class="block mb-2">Password</label>
            <p-password 
              id="password" 
              formControlName="password" 
              [toggleMask]="true" 
              [feedback]="false"
              styleClass="w-full"
              inputStyleClass="w-full mb-1">
            </p-password>
            <div *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.dirty">
              <p-message severity="error" text="Password is required"></p-message>
            </div>
          </div>

          <div class="flex justify-content-between align-items-center mb-4 mt-2">
             <a routerLink="/auth/forgot-password" class="text-primary no-underline font-medium">Forgot Password?</a>
          </div>

          <p-button 
            type="submit" 
            label="Log In" 
            icon="pi pi-sign-in" 
            styleClass="w-full p-button-primary mb-3"
            [disabled]="loginForm.invalid || authService.isAuthLoading()">
          </p-button>
          
          <div class="text-center">
            <span class="text-color-secondary">Don't have an account? </span>
            <a routerLink="/auth/signup" class="text-primary no-underline font-medium">Sign up</a>
          </div>
        </form>
      </p-card>
    </div>
  `,
  providers: [MessageService],
  styles: [`
    .h-screen { min-height: 100vh; }
    .flex { display: flex; }
    .flex-column { flex-direction: column; }
    .align-items-center { align-items: center; }
    .justify-content-center { justify-content: center; }
    .justify-content-between { justify-content: space-between; }
    .w-full { width: 100%; }
    .mb-1 { margin-bottom: 0.25rem; }
    .mb-2 { margin-bottom: 0.5rem; }
    .mb-3 { margin-bottom: 1rem; }
    .mb-4 { margin-bottom: 1.5rem; }
    .mt-2 { margin-top: 0.5rem; }
    .block { display: block; }
    .text-center { text-align: center; }
    .text-primary { color: var(--primary-color); }
    .text-color-secondary { color: var(--text-color-secondary); }
    .no-underline { text-decoration: none; }
    .font-medium { font-weight: 500; }
    .gap-3 { gap: 1rem; }
    .bg-gray-100 { background-color: #f3f4f6; }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  public authService = inject(AuthService);
  private messageService = inject(MessageService);

  public loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.messageService.add({severity:'success', summary:'Success', detail:'Successfully logged in!'});
        },
        error: (err) => {
           this.messageService.add({severity:'error', summary:'Error', detail: err.error?.message || 'Login failed'});
        }
      });
    }
  }
}
