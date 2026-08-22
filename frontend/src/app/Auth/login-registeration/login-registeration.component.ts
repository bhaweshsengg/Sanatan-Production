// login-registeration.component.ts
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-login-registeration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="flex justify-center items-center min-h-screen bg-gray-100">
      <div class="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
        <!-- Tabs -->
        <div class="flex justify-around mb-6 border-b border-gray-200">
          <button
            class="w-1/3 py-2 text-center font-medium transition rounded-t-lg"
            [ngClass]="
              activeTab === 'login'
                ? 'border-b-2 border-orange-500 text-orange-600'
                : 'text-gray-500'
            "
            (click)="setTab('login')"
          >
            Login
          </button>
        </div>

        <!-- Login Form -->
        <form
          *ngIf="activeTab === 'login'"
          [formGroup]="loginForm"
          (ngSubmit)="onLogin()"
          class="space-y-4"
        >
          <div>
            <input
              type="text"
              formControlName="username"
              placeholder="Username"
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
            />
            <div
              *ngIf="loginForm.get('username')?.invalid && (loginForm.get('username')?.dirty || loginForm.get('username')?.touched)"
              class="text-red-500 text-sm mt-1"
            >
              <div *ngIf="loginForm.get('username')?.errors?.['required']">
                Username is required.
              </div>
            </div>
          </div>
          <div>
            <input
              type="password"
              formControlName="password"
              placeholder="Password"
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
            />
            <div
              *ngIf="loginForm.get('password')?.invalid && (loginForm.get('password')?.dirty || loginForm.get('password')?.touched)"
              class="text-red-500 text-sm mt-1"
            >
              <div *ngIf="loginForm.get('password')?.errors?.['required']">
                Password is required.
              </div>
            </div>
          </div>
          <button
            type="submit"
            [disabled]="isLoading"
            class="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white py-2 rounded-lg transition flex justify-center items-center"
          >
            <span *ngIf="isLoading" class="mr-2">
              <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            {{ isLoading ? 'Logging in...' : 'Login' }}
          </button>
        </form>
      </div>
    </div>
    
    <!-- Toaster Message -->
    <div
      *ngIf="showToast"
      class="fixed top-4 left-1/2 -translate-x-1/2 py-2 px-4 rounded-lg shadow-xl transition-opacity duration-300 z-50"
      [ngClass]="{
        'bg-red-600 text-white': toastType === 'error',
        'bg-green-600 text-white': toastType === 'success'
      }"
    >
      {{ toastMessage }}
    </div>
  `,
  styles: [],
})
export class LoginRegisterationComponent {
  activeTab: 'login' | 'register' | 'forgot' = 'login';
  showToast: boolean = false;
  toastMessage: string = '';
  toastType: 'success' | 'error' = 'error';
  isLoading: boolean = false;

  loginForm!: FormGroup;
  registerForm!: FormGroup;
  forgotForm!: FormGroup;

  private apiUrl = `${environment.apiBaseUrl}/public/users/login`;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {
    // Updated to use username instead of email
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });

    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      role: ['', [Validators.required]],
    });

    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  setTab(tab: 'login' | 'register' | 'forgot') {
    this.activeTab = tab;
    // Reset forms and validation status when changing tabs
    this.loginForm.reset();
    this.registerForm.reset();
    this.forgotForm.reset();
    this.showToast = false;
    this.toastMessage = '';
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const loginData = {
        username: this.loginForm.value.username,
        password: this.loginForm.value.password
      };

      this.http.post<any>(this.apiUrl, loginData).subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          this.isLoading = false;
          
          // Use auth service to store token and update state
          const loginData = response?.data;
          if (!loginData?.access) {
            this.showToastMessage('Login response did not include an access token.', 'error');
            return;
          }

          this.authService.login(loginData.access, loginData);
          
          // Show success message
          this.showToastMessage('Login successful! Redirecting...to Admin', 'success');
          
          // Redirect after a short delay
          setTimeout(() => {
            this.router.navigate(['/business/admin/business-submissions']);
          }, 1500);
        },
        error: (error) => {
          console.error('Login failed:', error);
          this.isLoading = false;
          
          let errorMessage = 'Login failed. Please try again.';
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          } else if (error.status === 401) {
            errorMessage = 'Invalid username or password.';
          } else if (error.status === 0) {
            errorMessage = 'Unable to connect to server. Please check your connection.';
          }
          
          this.showToastMessage(errorMessage, 'error');
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
      this.showToastMessage('Please fill in all required fields.', 'error');
    }
  }

  onRegister() {
    if (this.registerForm.valid) {
      if (
        this.registerForm.value.password !==
        this.registerForm.value.confirmPassword
      ) {
        this.showToastMessage('Passwords do not match.', 'error');
        return;
      }
      console.log('Register Data:', this.registerForm.value);
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  onForgot() {
    if (this.forgotForm.valid) {
      console.log('Forgot Password Data:', this.forgotForm.value);
    } else {
      this.forgotForm.markAllAsTouched();
    }
  }

  showToastMessage(message: string, type: 'success' | 'error' = 'error') {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
      this.toastMessage = '';
    }, 3000);
  }
}