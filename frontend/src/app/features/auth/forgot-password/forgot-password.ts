import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

// PrimeNG
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    MessageModule,
    ToastModule,
    InputGroupModule,
    InputGroupAddonModule
  ],
  template: `
    <div class="flex items-center justify-center min-h-screen bg-gray-50 py-8">
      <p-toast></p-toast>
      <p-card header="Forgot Password" subheader="Enter your email to reset your password" [style]="{width: '400px', padding: '1rem'}">
        <form [formGroup]="forgotForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
          
          <div class="flex flex-col">
            <label for="email" class="block mb-2 font-medium text-gray-700">Email Address</label>
            <p-inputgroup>
                <p-inputgroup-addon>
                    <i class="pi pi-envelope"></i>
                </p-inputgroup-addon>
                <input 
                  id="email" 
                  type="email" 
                  pInputText 
                  formControlName="email" 
                  class="w-full" 
                  autofocus />
            </p-inputgroup>
            <div *ngIf="forgotForm.get('email')?.invalid && forgotForm.get('email')?.dirty" class="mt-1">
              <p-message severity="error" text="Valid email is required"></p-message>
            </div>
          </div>

          <p-button 
            type="submit" 
            [label]="authService.isAuthLoading() ? 'Sending...' : 'Send Reset Link'" 
            [icon]="authService.isAuthLoading() ? 'pi pi-spin pi-spinner' : 'pi pi-send'" 
            styleClass="w-full bg-blue-600 hover:bg-blue-700 border-none shadow-none text-white py-2 transition-colors mb-2 mt-4"
            [disabled]="forgotForm.invalid || authService.isAuthLoading()">
          </p-button>
          
          <div class="text-center text-gray-500 mt-4">
            <a routerLink="/login" class="flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 no-underline font-medium transition-colors">
              <i class="pi pi-arrow-left text-sm"></i> Back to Log In
            </a>
          </div>
        </form>
      </p-card>
    </div>
  `,
  providers: [MessageService]
})
export class ForgotPassword {
  private fb = inject(FormBuilder);
  public authService = inject(AuthService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  public forgotForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  onSubmit() {
    if (this.forgotForm.valid) {
      this.authService.forgotPassword(this.forgotForm.value).subscribe({
        next: () => {
          this.messageService.add({severity:'success', summary:'Success', detail:'If your email exists, a reset link has been sent!'});
          setTimeout(() => this.router.navigate(['/login']), 2500);
        },
        error: (err) => {
           this.messageService.add({severity:'error', summary:'Error', detail: err.error?.message || 'Failed to send reset link.'});
        }
      });
    }
  }
}
