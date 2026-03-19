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
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';

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
    ToastModule,
    InputGroupModule,
    InputGroupAddonModule
  ],
  template: `
    <div class="flex items-center justify-center min-h-screen bg-gray-50">
      <p-toast></p-toast>
      <p-card header="Welcome Back" subheader="Sign in to continue" [style]="{width: '400px', padding: '1rem'}">
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
          
          <div class="flex flex-col">
            <label for="email" class="block mb-2 font-medium text-gray-700">Email</label>
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
            <div *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.dirty" class="mt-1">
              <p-message severity="error" text="Valid email is required"></p-message>
            </div>
          </div>

          <div class="flex flex-col">
            <label for="password" class="block mb-2 font-medium text-gray-700">Password</label>
            <p-inputgroup>
                <p-inputgroup-addon>
                    <i class="pi pi-lock"></i>
                </p-inputgroup-addon>
                <p-password 
                  id="password" 
                  formControlName="password" 
                  [toggleMask]="true" 
                  [feedback]="false"
                  styleClass="w-full"
                  inputStyleClass="w-full">
                </p-password>
            </p-inputgroup>
            <div *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.dirty" class="mt-1">
              <p-message severity="error" text="Password is required"></p-message>
            </div>
          </div>

          <div class="flex flex-col">
            <div class="flex justify-between items-center mb-2">
              <label for="code" class="block font-medium text-gray-700">OTP Code</label>
              <button type="button" (click)="resendOtp()" [disabled]="loginForm.get('email')?.invalid || isResending" class="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 disabled:text-gray-400 bg-transparent border-none cursor-pointer p-0 font-medium transition-colors">
                <i class="pi" [ngClass]="isResending ? 'pi-spin pi-spinner' : 'pi-sync'" style="font-size: 0.875rem"></i>
                {{ isResending ? 'Sending...' : 'Resend OTP' }}
              </button>
            </div>
            <p-inputgroup>
                <p-inputgroup-addon>
                    <i class="pi pi-key"></i>
                </p-inputgroup-addon>
                <input 
                  id="code" 
                  type="text" 
                  pInputText 
                  formControlName="code" 
                  class="w-full" 
                  placeholder="Check your email for the code" />
            </p-inputgroup>
            <div *ngIf="loginForm.get('code')?.invalid && loginForm.get('code')?.dirty" class="mt-1">
              <p-message severity="error" text="Code should not be empty"></p-message>
            </div>
          </div>

          <div class="flex justify-end items-center mt-2 mb-4">
             <a routerLink="/forgot-password" class="text-blue-600 hover:text-blue-700 no-underline font-medium transition-colors">Forgot Password?</a>
          </div>

          <p-button 
            type="submit" 
            [label]="authService.isAuthLoading() ? 'Logging in...' : 'Log In'" 
            [icon]="authService.isAuthLoading() ? 'pi pi-spin pi-spinner' : 'pi pi-sign-in'" 
            styleClass="w-full bg-blue-600 hover:bg-blue-700 border-none shadow-none text-white py-2 transition-colors mb-4"
            [disabled]="loginForm.invalid || authService.isAuthLoading()">
          </p-button>
          
          <div class="text-center text-gray-500">
            <span>Don't have an account? </span>
            <a routerLink="/signup" class="text-blue-600 hover:text-blue-700 no-underline font-medium transition-colors">Sign up</a>
          </div>
        </form>
      </p-card>
    </div>
  `,
  providers: [MessageService]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  public authService = inject(AuthService);
  private messageService = inject(MessageService);

  public isResending = false;

  public loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    code: ['', [Validators.required]]
  });

  resendOtp() {
    const emailControl = this.loginForm.get('email');
    if (emailControl?.valid) {
      this.isResending = true;
      this.authService.resendOtp({ email: emailControl.value }).subscribe({
        next: () => {
          this.isResending = false;
          this.messageService.add({severity:'success', summary:'Success', detail:'OTP successfully resent to your email!'});
        },
        error: (err) => {
          this.isResending = false;
          this.messageService.add({severity:'error', summary:'Error', detail: err.error?.message || 'Failed to resend OTP.'});
        }
      });
    } else {
      this.messageService.add({severity:'warn', summary:'Warning', detail:'Please enter a valid email address first.'});
      emailControl?.markAsDirty();
    }
  }

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
