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
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-signup',
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
    ToastModule
  ],
  template: `
    <div class="flex items-center justify-center min-h-screen bg-gray-50 py-8">
      <p-toast></p-toast>
      <p-card header="Create an Account" subheader="Sign up to get started" [style]="{width: '400px', padding: '1rem'}">
        <form [formGroup]="signupForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
          
          <div class="flex flex-col">
            <label for="name" class="block mb-2 font-medium text-gray-700">Name</label>
            <input 
              id="name" 
              type="text" 
              pInputText 
              formControlName="name" 
              class="w-full" 
              autofocus />
            <div *ngIf="signupForm.get('name')?.invalid && signupForm.get('name')?.dirty" class="mt-1">
              <p-message severity="error" text="Name is required"></p-message>
            </div>
          </div>

          <div class="flex flex-col">
            <label for="email" class="block mb-2 font-medium text-gray-700">Email</label>
            <input 
              id="email" 
              type="email" 
              pInputText 
              formControlName="email" 
              class="w-full" />
            <div *ngIf="signupForm.get('email')?.invalid && signupForm.get('email')?.dirty" class="mt-1">
              <p-message severity="error" text="Valid email is required"></p-message>
            </div>
          </div>

          <div class="flex flex-col">
            <label for="password" class="block mb-2 font-medium text-gray-700">Password</label>
            <p-password 
              id="password" 
              formControlName="password" 
              [toggleMask]="true" 
              [feedback]="true"
              styleClass="w-full"
              inputStyleClass="w-full">
            </p-password>
            <div *ngIf="signupForm.get('password')?.invalid && signupForm.get('password')?.dirty" class="mt-1">
              <p-message severity="error" text="Password must be at least 6 characters"></p-message>
            </div>
          </div>

          <p-button 
            type="submit" 
            label="Sign Up" 
            icon="pi pi-user-plus" 
            styleClass="w-full bg-blue-600 hover:bg-blue-700 border-none shadow-none text-white py-2 transition-colors mb-2 mt-4"
            [disabled]="signupForm.invalid || authService.isAuthLoading()">
          </p-button>
          
          <div class="text-center text-gray-500 mt-4">
            <span>Already have an account? </span>
            <a routerLink="/login" class="text-blue-600 hover:text-blue-700 no-underline font-medium transition-colors">Log In</a>
          </div>
        </form>
      </p-card>
    </div>
  `,
  providers: [MessageService]
})
export class Signup {
  private fb = inject(FormBuilder);
  public authService = inject(AuthService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  public signupForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if (this.signupForm.valid) {
      this.authService.signUp(this.signupForm.value).subscribe({
        next: () => {
          this.messageService.add({severity:'success', summary:'Success', detail:'Successfully signed up! Please log in.'});
          setTimeout(() => this.router.navigate(['/login']), 1500);
        },
        error: (err) => {
           this.messageService.add({severity:'error', summary:'Error', detail: err.error?.message || 'Sign up failed'});
        }
      });
    }
  }
}
