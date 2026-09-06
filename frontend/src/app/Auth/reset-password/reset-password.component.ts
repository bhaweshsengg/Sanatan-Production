import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-[calc(100vh-80px)] bg-gray-50 flex items-center justify-center p-4">
      <div class="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <!-- Toast Notification -->
        <div *ngIf="showToast" 
             [ngClass]="toastType === 'success' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'"
             class="fixed top-24 right-4 p-4 rounded-md shadow-md border z-50 transition-all duration-300 transform translate-y-0 opacity-100">
          <div class="flex items-center gap-2">
            <svg *ngIf="toastType === 'success'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            <svg *ngIf="toastType === 'error'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            <span>{{ toastMessage }}</span>
          </div>
        </div>

        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-gray-900 mb-2">Reset Password</h2>
          <p class="text-gray-600">Enter your new password below</p>
        </div>

        <form [formGroup]="resetForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <div class="relative">
              <input 
                [type]="showPassword ? 'text' : 'password'"
                formControlName="password"
                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                [ngClass]="{'border-red-500': resetForm.get('password')?.touched && resetForm.get('password')?.invalid}"
                placeholder="Enter new password">
              <button type="button" 
                      (click)="showPassword = !showPassword"
                      class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                <svg *ngIf="!showPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path><line x1="2" y1="2" x2="22" y2="22"></line></svg>
                <svg *ngIf="showPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              </button>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <div class="relative">
              <input 
                [type]="showConfirmPassword ? 'text' : 'password'"
                formControlName="confirmPassword"
                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                [ngClass]="{'border-red-500': resetForm.get('confirmPassword')?.touched && resetForm.get('confirmPassword')?.invalid}"
                placeholder="Confirm new password">
              <button type="button" 
                      (click)="showConfirmPassword = !showConfirmPassword"
                      class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                <svg *ngIf="!showConfirmPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path><line x1="2" y1="2" x2="22" y2="22"></line></svg>
                <svg *ngIf="showConfirmPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              </button>
            </div>
          </div>

          <button type="submit" 
                  [disabled]="isLoading"
                  class="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            <span *ngIf="!isLoading">Reset Password</span>
            <span *ngIf="isLoading" class="flex items-center justify-center gap-2">
              <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Processing...
            </span>
          </button>
        </form>

        <p class="mt-6 text-center text-sm text-gray-600">
          Remember your password? 
          <a routerLink="/auth/login-registeration-forget" class="text-orange-600 hover:text-orange-700 font-medium">Login here</a>
        </p>
      </div>
    </div>
  `
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  token: string | null = null;
  isLoading = false;
  showPassword = false;
  showConfirmPassword = false;
  
  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token');
    if (!this.token) {
      this.showToastMessage('Invalid or missing reset token.', 'error');
    }
  }

  onSubmit() {
    if (!this.token) {
      this.showToastMessage('Invalid or missing reset token.', 'error');
      return;
    }

    if (this.resetForm.valid) {
      if (this.resetForm.value.password !== this.resetForm.value.confirmPassword) {
        this.showToastMessage('Passwords do not match.', 'error');
        return;
      }

      this.isLoading = true;
      this.http.post<any>(`${environment.apiBaseUrl}/public/users/reset-password`, {
        token: this.token,
        newPassword: this.resetForm.value.password
      }).subscribe({
        next: () => {
          this.isLoading = false;
          this.showToastMessage('Password reset successfully. Redirecting to login...', 'success');
          setTimeout(() => {
            this.router.navigate(['/auth/login-registeration-forget']);
          }, 2000);
        },
        error: (err) => {
          this.isLoading = false;
          this.showToastMessage(err.error?.message || 'Failed to reset password', 'error');
        }
      });
    } else {
      this.resetForm.markAllAsTouched();
    }
  }

  showToastMessage(message: string, type: 'success' | 'error') {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }
}
