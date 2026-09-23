import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';
import { TempleSearchSelectComponent } from '../../shared/components/temple-search-select/temple-search-select.component';
import { TermsConditionsModalComponent } from '../../shared/components/terms-conditions-modal/terms-conditions-modal.component';

interface TempleOption {
  id: number;
  mandir_name: string;
  full_address?: string;
  city?: { id?: number; name?: string };
  main_deity?: { id?: number; name?: string };
}

@Component({
  selector: 'app-mandir-user-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TempleSearchSelectComponent, TermsConditionsModalComponent],
  template: `
    <div class="min-h-screen bg-slate-50 px-3 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div class="mx-auto max-w-3xl rounded-2xl bg-white shadow-xl ring-1 ring-slate-200/80 overflow-hidden">
        <!-- Header Banner -->
        <div class="border-b border-slate-200 bg-gradient-to-r from-orange-600 via-amber-600 to-red-600 p-6 sm:p-8 text-white relative">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div class="flex items-center gap-3.5">
              <div class="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-inner shrink-0 border border-white/30">
                ॐ
              </div>
              <div>
                <p class="text-xs font-bold uppercase tracking-[0.2em] text-orange-100">Sanatan Community Platform</p>
                <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Temple Devotee Registration</h1>
                <p class="mt-0.5 text-xs sm:text-sm text-orange-100">Apply to join your local Mandir community as a registered Devotee</p>
              </div>
            </div>
            <div class="flex items-center gap-2 self-start sm:self-auto shrink-0">
              <a
                routerLink="/temples"
                class="rounded-full bg-white/15 hover:bg-white/25 px-3.5 py-1.5 text-xs font-semibold text-white border border-white/25 backdrop-blur-sm transition-all"
              >
                ← All Temples
              </a>
              <a
                routerLink="/"
                class="rounded-full bg-white/15 hover:bg-white/25 px-3.5 py-1.5 text-xs font-semibold text-white border border-white/25 backdrop-blur-sm transition-all"
              >
                Home
              </a>
            </div>
          </div>
        </div>

        <!-- SUCCESS CONFIRMATION STATE -->
        <div *ngIf="isSubmitted" class="p-6 sm:p-10 space-y-6 text-center animate-fade-in">
          <div class="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl shadow-sm ring-8 ring-emerald-50">
            ✓
          </div>

          <div class="space-y-2">
            <span class="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
              Application Submitted
            </span>
            <h2 class="text-2xl sm:text-3xl font-bold text-slate-900">Devotee Application Received!</h2>
            <p class="text-slate-600 max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
              Thank you, <strong class="text-slate-900 font-semibold">{{ submittedDevoteeName }}</strong>. Your devotee application has been safely submitted and is now awaiting review by the Mandir administration.
            </p>
          </div>

          <!-- Application Summary Card -->
          <div class="max-w-md mx-auto bg-slate-50 rounded-xl p-5 border border-slate-200 text-left space-y-2.5 text-sm">
            <div class="flex justify-between items-center pb-2 border-b border-slate-200">
              <span class="text-slate-500 font-medium">Selected Temple:</span>
              <span class="font-bold text-slate-900 text-right">{{ submittedTempleName }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-slate-500 font-medium">Devotee Email:</span>
              <span class="font-semibold text-slate-800 text-right">{{ submittedEmail }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-slate-500 font-medium">Mobile Number:</span>
              <span class="font-semibold text-slate-800 text-right">{{ submittedMobile }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-slate-500 font-medium">Community Updates:</span>
              <span class="font-semibold text-slate-800 text-right">{{ submittedSubscription }}</span>
            </div>
            <div class="flex justify-between items-center pt-2 border-t border-slate-200">
              <span class="text-slate-500 font-medium">Review Status:</span>
              <span class="inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-700 ring-1 ring-inset ring-amber-600/20">
                Pending Admin Approval
              </span>
            </div>
          </div>

          <!-- Informational Notice -->
          <div class="max-w-md mx-auto bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg text-left">
            <p class="text-xs text-blue-900 leading-relaxed">
              <strong>What happens next?</strong> The Temple Committee will review your application. Once approved, your devotee account will be activated and you will be able to log in to participate in temple seva, events, and community discussions.
            </p>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              *ngIf="submittedMandirId"
              [routerLink]="['/temples/view-temple', submittedMandirId]"
              class="rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-orange-700 transition"
            >
              View Temple Page
            </a>
            <a
              routerLink="/temples"
              class="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition"
            >
              Browse All Temples
            </a>
            <button
              type="button"
              (click)="resetForNewRegistration()"
              class="rounded-xl border border-orange-300 bg-orange-50 px-5 py-2.5 text-sm font-semibold text-orange-700 hover:bg-orange-100 transition"
            >
              Register Another Devotee
            </button>
          </div>
        </div>

        <!-- REGISTRATION FORM STATE -->
        <form *ngIf="!isSubmitted" [formGroup]="form" (ngSubmit)="submit()" class="space-y-6 p-6 sm:p-8">
          <!-- Pre-selected Temple Info Banner -->
          <div *ngIf="selectedTemple" class="rounded-xl bg-orange-50 border border-orange-200 p-4 flex items-start gap-3">
            <div class="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 mt-0.5 font-bold text-sm">
              🏛️
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-xs font-semibold text-orange-700 uppercase tracking-wider">Joining Community</p>
              <h2 class="text-base font-bold text-slate-900 truncate">{{ selectedTemple.mandir_name }}</h2>
              <p *ngIf="selectedTemple.full_address" class="text-xs text-slate-600 truncate mt-0.5">{{ selectedTemple.full_address }}</p>
            </div>
          </div>

          <div class="grid gap-5 md:grid-cols-2">
            <!-- First Name -->
            <div>
              <label class="mb-1.5 block text-sm font-semibold text-slate-700">
                First Name <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                formControlName="firstName"
                [class.border-red-500]="form.get('firstName')?.touched && form.get('firstName')?.invalid"
                class="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition"
                placeholder="e.g. Ramesh"
              />
              <div *ngIf="form.get('firstName')?.touched && form.get('firstName')?.invalid" class="mt-1 text-xs text-red-600 font-medium">
                First name is required (at least 2 characters).
              </div>
            </div>

            <!-- Last Name -->
            <div>
              <label class="mb-1.5 block text-sm font-semibold text-slate-700">
                Last Name <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                formControlName="lastName"
                [class.border-red-500]="form.get('lastName')?.touched && form.get('lastName')?.invalid"
                class="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition"
                placeholder="e.g. Sharma"
              />
              <div *ngIf="form.get('lastName')?.touched && form.get('lastName')?.invalid" class="mt-1 text-xs text-red-600 font-medium">
                Last name is required.
              </div>
            </div>

            <!-- Email -->
            <div>
              <label class="mb-1.5 block text-sm font-semibold text-slate-700">
                Email Address <span class="text-red-500">*</span>
              </label>
              <input
                type="email"
                formControlName="email"
                [class.border-red-500]="form.get('email')?.touched && form.get('email')?.invalid"
                class="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition"
                placeholder="devotee@example.com"
              />
              <div *ngIf="form.get('email')?.touched && form.get('email')?.invalid" class="mt-1 text-xs text-red-600 font-medium">
                Please enter a valid email address.
              </div>
            </div>

            <!-- Mobile -->
            <div>
              <label class="mb-1.5 block text-sm font-semibold text-slate-700">
                Mobile Number <span class="text-red-500">*</span>
              </label>
              <input
                type="tel"
                formControlName="mobile"
                [class.border-red-500]="form.get('mobile')?.touched && form.get('mobile')?.invalid"
                class="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition"
                placeholder="+64 21 000 0000"
              />
              <p class="mt-1 text-xs text-slate-500">Include your country code (e.g. +64 for NZ).</p>
              <div *ngIf="form.get('mobile')?.touched && form.get('mobile')?.invalid" class="mt-1 text-xs text-red-600 font-medium">
                A valid mobile number is required (8-25 characters).
              </div>
            </div>

            <!-- Password -->
            <div>
              <label class="mb-1.5 block text-sm font-semibold text-slate-700">
                Create Password <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <input
                  [type]="showPassword ? 'text' : 'password'"
                  formControlName="password"
                  [class.border-red-500]="form.get('password')?.touched && form.get('password')?.invalid"
                  class="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 pr-11 text-sm text-slate-900 placeholder-slate-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition"
                  placeholder="At least 6 characters"
                />
                <button
                  type="button"
                  (click)="togglePasswordVisibility()"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none p-1"
                  tabindex="-1"
                  aria-label="Toggle password visibility"
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
              <div *ngIf="form.get('password')?.touched && form.get('password')?.invalid" class="mt-1 text-xs text-red-600 font-medium">
                Password must be at least 6 characters.
              </div>
            </div>

            <!-- Temple Selection (Searchable) -->
            <div>
              <app-temple-search-select
                formControlName="mandirId"
                label="Select Temple"
                [required]="true"
                [temples]="temples"
                [isInvalid]="(form.get('mandirId')?.touched && form.get('mandirId')?.invalid) ?? false"
              ></app-temple-search-select>
              <div *ngIf="form.get('mandirId')?.touched && form.get('mandirId')?.invalid" class="mt-1 text-xs text-red-600 font-medium">
                Please select the Mandir you wish to join.
              </div>
            </div>

            <!-- Subscription (Dropdown) -->
            <div class="md:col-span-2">
              <label class="mb-1.5 block text-sm font-semibold text-slate-700">
                Community Updates &amp; Newsletter
              </label>
              <select
                formControlName="subscription"
                class="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition cursor-pointer"
              >
                <option value="Yes">Yes - Receive mandir announcements, festival reminders, and newsletters</option>
                <option value="No">No - Only send critical account and application updates</option>
              </select>
              <p class="mt-1 text-xs text-slate-500">You can update your communication preferences at any time.</p>
            </div>

            <!-- Terms and Conditions Checkbox -->
            <div class="md:col-span-2 pt-2 border-t border-slate-200">
              <div class="flex items-start gap-3 bg-orange-50/50 p-3.5 rounded-xl border border-orange-200/60">
                <input
                  type="checkbox"
                  id="devoteeTermsAccepted"
                  formControlName="termsAccepted"
                  class="mt-1 h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500 cursor-pointer"
                />
                <label for="devoteeTermsAccepted" class="text-xs sm:text-sm text-slate-700 leading-relaxed select-none cursor-pointer">
                  I have read and agree to the
                  <button
                    type="button"
                    (click)="openTermsModal($event)"
                    class="font-bold text-orange-600 hover:text-orange-700 underline focus:outline-none"
                  >
                    Terms and Conditions
                  </button>
                  for temple devotee registration, code of conduct, and community guidelines.
                  <span class="text-red-500 font-bold ml-0.5">*</span>
                </label>
              </div>
              <div
                *ngIf="form.get('termsAccepted')?.invalid && (form.get('termsAccepted')?.dirty || form.get('termsAccepted')?.touched)"
                class="mt-1.5 text-xs text-red-600 font-medium pl-1"
              >
                You must agree to the Terms and Conditions to register as a devotee.
              </div>
            </div>
          </div>

          <!-- Bottom Action Buttons -->
          <div class="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-slate-200 pt-6">
            <div class="text-xs text-slate-500 text-center sm:text-left">
              Already registered?
              <a routerLink="/auth/login-registeration-forget" class="text-orange-600 font-bold hover:underline">
                Log in here &rarr;
              </a>
            </div>

            <div class="flex items-center justify-end gap-3">
              <button
                type="button"
                (click)="cancel()"
                [disabled]="submitting"
                class="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition disabled:opacity-50"
              >
                Reset
              </button>
              <button
                type="submit"
                [disabled]="submitting"
                class="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-orange-600 to-red-600 px-6 py-2.5 text-sm font-bold text-white shadow-md hover:from-orange-700 hover:to-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
              >
                <svg *ngIf="submitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <span>{{ submitting ? 'Submitting Registration...' : 'Register as Devotee' }}</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      <!-- Toast Notification -->
      <div
        *ngIf="message"
        class="fixed bottom-5 right-5 z-50 max-w-md rounded-2xl p-4 text-sm font-semibold shadow-2xl transition-all duration-300 flex items-start gap-3 border"
        [ngClass]="messageType === 'success' ? 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-900/20' : 'bg-red-600 text-white border-red-500 shadow-red-900/20'"
      >
        <span class="text-lg leading-none mt-0.5">{{ messageType === 'success' ? '✓' : '⚠️' }}</span>
        <div class="flex-1">{{ message }}</div>
        <button (click)="message = ''" class="text-white/80 hover:text-white text-lg leading-none font-bold ml-2">×</button>
      </div>

      <!-- Terms and Conditions Modal -->
      <app-terms-conditions-modal
        [isOpen]="isTermsModalOpen"
        termsType="devotee"
        (closed)="closeTermsModal()"
        (accepted)="onTermsAccepted()"
      ></app-terms-conditions-modal>
    </div>
  `,
})
export class MandirUserRegistrationComponent implements OnInit {
  private readonly apiUrl = `${environment.apiBaseUrl}`;

  form: FormGroup;
  temples: TempleOption[] = [];
  loadingTemples = true;
  submitting = false;
  showPassword = false;
  preselectedMandirId: number | null = null;
  isTermsModalOpen = false;

  // Success State
  isSubmitted = false;
  submittedDevoteeName = '';
  submittedTempleName = '';
  submittedEmail = '';
  submittedMobile = '';
  submittedSubscription = '';
  submittedMandirId: number | null = null;

  // Toast
  message = '';
  messageType: 'success' | 'error' = 'success';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
      lastName: ['', [Validators.required, Validators.maxLength(80)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      mobile: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(25), Validators.pattern(/^[+()\d\s-]+$/)]],
      mandirId: ['', [Validators.required]],
      subscription: ['Yes', [Validators.required]],
      termsAccepted: [false, [Validators.requiredTrue]],
    });
  }

  ngOnInit(): void {
    // Read pre-selected temple from route query parameters if provided
    this.route.queryParams.subscribe((params) => {
      const mandirIdParam = params['mandirId'] || params['templeId'];
      if (mandirIdParam) {
        this.preselectedMandirId = Number(mandirIdParam);
        this.form.patchValue({ mandirId: this.preselectedMandirId });
      }
    });

    this.loadMandirs();
  }

  get selectedTemple(): TempleOption | undefined {
    const id = Number(this.form.get('mandirId')?.value);
    return id ? this.temples.find((t) => t.id === id) : undefined;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  loadMandirs(): void {
    this.loadingTemples = true;
    this.http.get<any>(`${this.apiUrl}/public/temple?status=Approved&limit=all`).subscribe({
      next: (response) => {
        this.loadingTemples = false;
        const data = Array.isArray(response) ? response : response?.data ?? [];
        this.temples = data
          .filter((temple: any) => !temple.status || temple.status === 'Approved')
          .map((temple: any) => ({
            id: Number(temple.id),
            mandir_name: temple.mandir_name || temple.name || 'Sanatan Mandir',
            full_address: temple.full_address || '',
            city: temple.city,
            main_deity: temple.main_deity || temple.mainDeity,
          }))
          .sort((a: TempleOption, b: TempleOption) =>
            a.mandir_name.localeCompare(b.mandir_name)
          );

        // Apply preselected temple if present
        if (this.preselectedMandirId) {
          const matched = this.temples.find((t) => t.id === this.preselectedMandirId);
          if (matched) {
            this.form.patchValue({ mandirId: this.preselectedMandirId });
          }
        }
      },
      error: () => {
        this.loadingTemples = false;
        this.showMessage('Unable to load approved temples. Please try again.', 'error');
      },
    });
  }

  cancel(): void {
    this.form.reset({
      subscription: 'Yes',
      mandirId: this.preselectedMandirId || '',
      termsAccepted: false,
    });
  }

  resetForNewRegistration(): void {
    this.isSubmitted = false;
    this.form.reset({
      subscription: 'Yes',
      mandirId: this.preselectedMandirId || '',
      termsAccepted: false,
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.showMessage('Please complete all required fields correctly before submitting.', 'error');
      return;
    }

    this.submitting = true;
    const formVal = this.form.value;
    const templeObj = this.temples.find((t) => t.id === Number(formVal.mandirId));
    const templeName = templeObj?.mandir_name || 'Selected Mandir';

    const payload = {
      firstName: formVal.firstName.trim(),
      lastName: formVal.lastName.trim(),
      email: formVal.email.trim(),
      password: formVal.password,
      mobile: formVal.mobile.trim(),
      mandirId: Number(formVal.mandirId),
      subscription: formVal.subscription || 'No',
      termsAccepted: true,
      termsAcceptedAt: new Date().toISOString(),
    };

    this.http
      .post<any>(`${this.apiUrl}/public/user-registration`, payload, {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      })
      .subscribe({
        next: (response) => {
          this.submitting = false;
          this.isSubmitted = true;
          this.submittedDevoteeName = `${payload.firstName} ${payload.lastName}`;
          this.submittedTempleName = templeName;
          this.submittedEmail = payload.email;
          this.submittedMobile = payload.mobile;
          this.submittedSubscription = payload.subscription;
          this.submittedMandirId = payload.mandirId;

          this.showMessage(
            response?.message || 'Registration submitted successfully! Pending admin approval.',
            'success'
          );
        },
        error: (error) => {
          this.submitting = false;
          let errMessage =
            error?.error?.message ||
            error?.error?.error ||
            'Could not submit your devotee registration. Please try again.';

          // Extract granular field-level validation errors if present
          if (error?.error?.data?.fieldErrors) {
            const fieldEntries = Object.entries(error.error.data.fieldErrors);
            const messages = fieldEntries
              .map(([field, msgs]: [string, any]) => {
                const label = field.replace(/([A-Z])/g, ' $1').toLowerCase();
                const text = Array.isArray(msgs) ? msgs.join(', ') : String(msgs);
                return `${label}: ${text}`;
              })
              .join(' | ');

            if (messages) {
              errMessage = messages;
            }
          }

          this.showMessage(errMessage, 'error');
        },
      });
  }

  openTermsModal(event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.isTermsModalOpen = true;
  }

  closeTermsModal(): void {
    this.isTermsModalOpen = false;
  }

  onTermsAccepted(): void {
    this.form.patchValue({ termsAccepted: true });
    this.form.get('termsAccepted')?.markAsTouched();
    this.form.get('termsAccepted')?.updateValueAndValidity();
  }

  private showMessage(value: string, type: 'success' | 'error'): void {
    this.message = value;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
    }, 5500);
  }
}
