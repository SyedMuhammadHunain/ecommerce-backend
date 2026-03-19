import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

// PrimeNG
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    CardModule,
    ButtonModule,
    PasswordModule,
    MessageModule,
    ToastModule,
    InputGroupModule,
    InputGroupAddonModule
  ],
  template: `
    <div class="flex items-center justify-center min-h-screen bg-gray-50 py-8">
      <p-toast></p-toast>
      <p-card header="Reset Password" subheader="Enter your new password below" [style]="{width: '400px', padding: '1rem'}">
        <form [formGroup]="resetForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
          
          <div class="flex flex-col">
            <label for="password" class="block mb-2 font-medium text-gray-700">New Password</label>
            <p-inputgroup>
                <p-inputgroup-addon>
                    <i class="pi pi-lock"></i>
                </p-inputgroup-addon>
                <p-password 
                  id="password" 
                  formControlName="password" 
                  [toggleMask]="true" 
                  [feedback]="true"
                  styleClass="w-full"
                  inputStyleClass="w-full">
                </p-password>
            </p-inputgroup>
            <div *ngIf="resetForm.get('password')?.invalid && resetForm.get('password')?.dirty" class="mt-1">
              <p-message severity="error" text="Password must be at least 6 characters"></p-message>
            </div>
          </div>

          <p-button 
            type="submit" 
            [label]="authService.isAuthLoading() ? 'Saving...' : 'Save Password'" 
            [icon]="authService.isAuthLoading() ? 'pi pi-spin pi-spinner' : 'pi pi-check'" 
            styleClass="w-full bg-blue-600 hover:bg-blue-700 border-none shadow-none text-white py-2 transition-colors mb-2 mt-4"
            [disabled]="resetForm.invalid || authService.isAuthLoading()">
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
export class ResetPassword implements OnInit {
  private fb = inject(FormBuilder);
  public authService = inject(AuthService);
  private messageService = inject(MessageService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  private token: string = '';

  public resetForm: FormGroup = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  ngOnInit() {
    this.token = this.route.snapshot.paramMap.get('token') || '';
    if (!this.token) {
      this.messageService.add({severity:'error', summary:'Error', detail:'Invalid or missing reset token.'});
      setTimeout(() => this.router.navigate(['/login']), 2000);
    }
  }

  onSubmit() {
    if (this.resetForm.valid && this.token) {
      this.authService.resetPassword(this.token, this.resetForm.value).subscribe({
        next: () => {
          this.messageService.add({severity:'success', summary:'Success', detail:'Password successfully updated! Please login.'});
          setTimeout(() => this.router.navigate(['/login']), 2500);
        },
        error: (err) => {
           this.messageService.add({severity:'error', summary:'Error', detail: err.error?.message || 'Failed to update password.'});
        }
      });
    }
  }
}
