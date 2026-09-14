import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';

interface TempleOption {
  id: number;
  mandir_name: string;
}

@Component({
  selector: 'app-mandir-user-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-slate-100 px-4 py-10">
      <div class="mx-auto max-w-3xl rounded-2xl bg-white shadow-lg overflow-hidden">
        <div class="border-b border-slate-200 bg-gradient-to-r from-orange-50 to-amber-50 p-6 sm:p-8">
          <div class="flex items-center justify-between gap-4">
            <div>
              <p class="text-xs font-bold uppercase tracking-[0.2em] text-orange-600">Temple Access</p>
              <h1 class="mt-1 text-2xl sm:text-3xl font-bold text-slate-900">Temple Devotee Registration</h1>
              <p class="mt-1 text-sm text-slate-600">Apply to become a Temple Devotee for your selected temple</p>
            </div>
            <a routerLink="/" class="shrink-0 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition">
              Home
            </a>
          </div>
        </div>

        <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-6 p-6 sm:p-8">
          <div class="grid gap-6 md:grid-cols-2">
            <!-- First Name -->
            <div>
              <label class="mb-1.5 block text-sm font-semibold text-slate-700">First Name <span class="text-red-500">*</span></label>
              <input
                type="text"
                formControlName="firstName"
                class="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                placeholder="First Name"
              />
              <div *ngIf="form.get('firstName')?.touched && form.get('firstName')?.invalid" class="mt-1 text-xs text-red-600">
                First name is required (at least 2 characters).
              </div>
            </div>

            <!-- Last Name -->
            <div>
              <label class="mb-1.5 block text-sm font-semibold text-slate-700">Last Name <span class="text-red-500">*</span></label>
              <input
                type="text"
                formControlName="lastName"
                class="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                placeholder="Last Name"
              />
              <div *ngIf="form.get('lastName')?.touched && form.get('lastName')?.invalid" class="mt-1 text-xs text-red-600">
                Last name is required.
              </div>
            </div>

            <!-- Email -->
            <div>
              <label class="mb-1.5 block text-sm font-semibold text-slate-700">Email Address <span class="text-red-500">*</span></label>
              <input
                type="email"
                formControlName="email"
                class="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                placeholder="devotee@example.com"
              />
              <div *ngIf="form.get('email')?.touched && form.get('email')?.invalid" class="mt-1 text-xs text-red-600">
                Please enter a valid email address.
              </div>
            </div>

            <!-- Mobile -->
            <div>
              <label class="mb-1.5 block text-sm font-semibold text-slate-700">Mobile Number <span class="text-red-500">*</span></label>
              <input
                type="tel"
                formControlName="mobile"
                class="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                placeholder="+64 21 000 0000"
              />
              <div *ngIf="form.get('mobile')?.touched && form.get('mobile')?.invalid" class="mt-1 text-xs text-red-600">
                A valid mobile number is required.
              </div>
            </div>

            <!-- Password -->
            <div>
              <label class="mb-1.5 block text-sm font-semibold text-slate-700">Password <span class="text-red-500">*</span></label>
              <div class="relative">
                <input
                  [type]="showPassword ? 'text' : 'password'"
                  formControlName="password"
                  class="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 pr-10 text-slate-900 placeholder-slate-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  placeholder="At least 6 characters"
                />
                <button
                  type="button"
                  (click)="togglePasswordVisibility()"
                  class="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                  tabindex="-1"
                >
                  <svg *ngIf="!showPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <svg *ngIf="showPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                </button>
              </div>
              <div *ngIf="form.get('password')?.touched && form.get('password')?.invalid" class="mt-1 text-xs text-red-600">
                Password must be at least 6 characters.
              </div>
            </div>

            <!-- Temple (Dropdown) -->
            <div>
              <label class="mb-1.5 block text-sm font-semibold text-slate-700">Temple <span class="text-red-500">*</span></label>
              <select
                formControlName="mandirId"
                class="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
              >
                <option value="">-- Select Temple to Join --</option>
                <option *ngFor="let temple of temples" [value]="temple.id">
                  {{ temple.mandir_name }}
                </option>
              </select>
              <div *ngIf="form.get('mandirId')?.touched && form.get('mandirId')?.invalid" class="mt-1 text-xs text-red-600">
                Please select a temple.
              </div>
            </div>

            <!-- Subscription (Dropdown) -->
            <div>
              <label class="mb-1.5 block text-sm font-semibold text-slate-700">Subscription <span class="text-red-500">*</span></label>
              <select
                formControlName="subscription"
                class="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
              <p class="mt-1 text-xs text-slate-500">Opt-in to temple community updates &amp; newsletters.</p>
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 border-t border-slate-200 pt-6">
            <button
              type="button"
              (click)="cancel()"
              class="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
            >
              Reset
            </button>
            <button
              type="submit"
              [disabled]="submitting || form.invalid"
              class="rounded-lg bg-orange-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-orange-700 transition disabled:cursor-not-allowed disabled:bg-orange-300"
            >
              {{ submitting ? 'Submitting Registration...' : 'Register as Devotee' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Toast Notification -->
      <div
        *ngIf="message"
        class="fixed bottom-5 right-5 z-50 max-w-md rounded-xl px-5 py-3.5 text-sm font-medium shadow-2xl transition-all duration-300"
        [ngClass]="messageType === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'"
      >
        {{ message }}
      </div>
    </div>
  `,
})
export class MandirUserRegistrationComponent implements OnInit {
  private readonly apiUrl = `${environment.apiBaseUrl}`;

  form: FormGroup;
  temples: TempleOption[] = [];
  submitting = false;
  showPassword = false;
  message = '';
  messageType: 'success' | 'error' = 'success';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      mobile: ['', [Validators.required, Validators.pattern(/^[+()\d\s-]+$/)]],
      mandirId: ['', [Validators.required]],
      subscription: ['No', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadMandirs();
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  loadMandirs(): void {
    this.http.get<any>(`${this.apiUrl}/public/temple`).subscribe({
      next: (response) => {
        const data = Array.isArray(response) ? response : response?.data ?? [];
        this.temples = data
          .map((temple: any) => ({
            id: Number(temple.id),
            mandir_name: temple.mandir_name,
          }))
          .sort((a: TempleOption, b: TempleOption) =>
            a.mandir_name.localeCompare(b.mandir_name)
          );
      },
      error: () => {
        this.showMessage('Unable to load temples list.', 'error');
      },
    });
  }

  cancel(): void {
    this.form.reset({
      subscription: 'No',
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const formVal = this.form.value;
    const payload = {
      firstName: formVal.firstName.trim(),
      lastName: formVal.lastName.trim(),
      email: formVal.email.trim(),
      password: formVal.password,
      mobile: formVal.mobile.trim(),
      mandirId: Number(formVal.mandirId),
      subscription: formVal.subscription,
    };

    this.http
      .post(`${this.apiUrl}/public/user-registration`, payload, {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      })
      .subscribe({
        next: () => {
          this.submitting = false;
          this.form.reset({ subscription: 'No' });
          this.showMessage(
            'Registration submitted successfully! It is pending admin approval.',
            'success'
          );
        },
        error: (error) => {
          this.submitting = false;
          const errMessage =
            error?.error?.message ||
            error?.error?.error ||
            'Could not save your registration.';
          this.showMessage(errMessage, 'error');
        },
      });
  }

  private showMessage(value: string, type: 'success' | 'error'): void {
    this.message = value;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
    }, 4500);
  }
}
