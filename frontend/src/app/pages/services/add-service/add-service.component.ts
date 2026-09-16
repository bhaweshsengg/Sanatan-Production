import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonService } from 'src/app/shared/common.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-service',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gradient-to-b from-orange-50/40 via-white to-gray-50 font-['Inter'] py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-3xl mx-auto">
        <!-- Breadcrumb / Back Link -->
        <div class="mb-6 flex items-center justify-between">
          <a
            routerLink="/services"
            class="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-orange-600 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Services Directory</span>
          </a>
          <span class="text-xs font-semibold uppercase tracking-wider text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
            Community Directory
          </span>
        </div>

        <!-- Form Card Container -->
        <div class="bg-white rounded-3xl shadow-xl border border-gray-200/80 overflow-hidden">
          <!-- Card Header Banner -->
          <div class="bg-gradient-to-r from-orange-600 via-red-600 to-amber-600 px-6 sm:px-10 py-8 text-white">
            <div class="flex items-center gap-3 mb-2">
              <div class="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-xl shadow-inner">
                🕉️
              </div>
              <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Add Community Service
              </h1>
            </div>
            <p class="text-sm sm:text-base text-orange-100 font-light max-w-xl">
              List your religious, spiritual, or cultural service in the Sanatan New Zealand community directory to connect with devotees across the country.
            </p>
          </div>

          <!-- Form Body -->
          <form (ngSubmit)="onSubmit()" #serviceForm="ngForm" class="p-6 sm:p-10 space-y-6">
            <!-- Toast Feedback Banner -->
            <div
              *ngIf="toastMessage"
              class="p-4 rounded-xl text-sm font-medium flex items-center gap-3 transition-all"
              [ngClass]="{
                'bg-emerald-50 text-emerald-800 border border-emerald-200': toastType === 'success',
                'bg-rose-50 text-rose-800 border border-rose-200': toastType === 'error'
              }"
            >
              <span class="text-lg">{{ toastType === 'success' ? '✅' : '⚠️' }}</span>
              <span>{{ toastMessage }}</span>
            </div>

            <!-- SERVICE CATEGORY -->
            <div>
              <label class="block text-sm font-bold text-gray-900 mb-1.5">
                Service Category <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <select
                  [(ngModel)]="category"
                  name="category"
                  required
                  class="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition shadow-sm font-medium cursor-pointer"
                >
                  <option value="" disabled selected>Select a Service Category</option>
                  <option *ngFor="let cat of categories" [value]="cat">
                    {{ cat }}
                  </option>
                </select>
              </div>
              <p class="text-xs text-gray-500 mt-1">Select the category that best matches your service.</p>
            </div>

            <!-- NAME ROW: First Name & Last Name -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label class="block text-sm font-bold text-gray-900 mb-1.5">
                  First Name <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  [(ngModel)]="firstName"
                  name="firstName"
                  required
                  placeholder="e.g. Rajesh"
                  class="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition shadow-sm"
                />
              </div>

              <div>
                <label class="block text-sm font-bold text-gray-900 mb-1.5">
                  Last Name <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  [(ngModel)]="lastName"
                  name="lastName"
                  required
                  placeholder="e.g. Sharma"
                  class="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition shadow-sm"
                />
              </div>
            </div>

            <!-- EMAIL -->
            <div>
              <label class="block text-sm font-bold text-gray-900 mb-1.5">
                Email Address <span class="text-red-500">*</span>
              </label>
              <input
                type="email"
                [(ngModel)]="email"
                name="email"
                required
                placeholder="e.g. rajesh.sharma@example.com"
                class="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition shadow-sm"
              />
            </div>

            <!-- LOCATION ROW: Address & City -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label class="block text-sm font-bold text-gray-900 mb-1.5">
                  Street Address <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  [(ngModel)]="address"
                  name="address"
                  required
                  placeholder="e.g. 123 Dominion Road, Mount Eden"
                  class="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition shadow-sm"
                />
              </div>

              <div>
                <label class="block text-sm font-bold text-gray-900 mb-1.5">
                  City <span class="text-red-500">*</span>
                </label>
                <select
                  [(ngModel)]="city"
                  name="city"
                  required
                  class="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition shadow-sm font-medium cursor-pointer"
                >
                  <option value="" disabled selected>Select a City</option>
                  <option *ngFor="let c of cities" [value]="c">
                    {{ c }}
                  </option>
                </select>
              </div>
            </div>

            <!-- PHONE ROW: Mobile & Phone No -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label class="block text-sm font-bold text-gray-900 mb-1.5">
                  Mobile <span class="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  [(ngModel)]="mobile"
                  name="mobile"
                  required
                  placeholder="e.g. +64 21 000 0000"
                  class="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition shadow-sm"
                />
              </div>

              <div>
                <label class="block text-sm font-bold text-gray-900 mb-1.5">
                  Phone No.
                </label>
                <input
                  type="tel"
                  [(ngModel)]="phoneNo"
                  name="phoneNo"
                  placeholder="e.g. +64 9 000 0000 (optional)"
                  class="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition shadow-sm"
                />
              </div>
            </div>

            <!-- IMAGE UPLOAD -->
            <div>
              <label class="block text-sm font-bold text-gray-900 mb-1.5">
                Service Image
              </label>
              <div class="border-2 border-dashed border-gray-300 hover:border-orange-400 rounded-2xl p-6 text-center transition-colors bg-gray-50/50">
                <div *ngIf="!imagePreview" class="space-y-2">
                  <div class="text-3xl text-gray-400">📷</div>
                  <div class="text-sm text-gray-600 font-medium">
                    <label class="cursor-pointer text-orange-600 hover:text-orange-700 font-semibold focus-within:outline-none">
                      <span>Click to upload an image</span>
                      <input
                        type="file"
                        accept="image/*"
                        (change)="onFileChange($event)"
                        class="sr-only"
                      />
                    </label>
                    <span class="text-gray-500"> or drag and drop</span>
                  </div>
                  <p class="text-xs text-gray-400">PNG, JPG, WEBP up to 5MB</p>
                </div>

                <!-- Selected Image Preview -->
                <div *ngIf="imagePreview" class="relative inline-block mt-2">
                  <img
                    [src]="imagePreview"
                    alt="Preview"
                    class="h-44 w-auto max-w-full rounded-xl object-cover shadow-md border border-gray-200 mx-auto"
                  />
                  <button
                    type="button"
                    (click)="removeImage()"
                    class="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1.5 shadow-lg transition"
                    title="Remove image"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>

            <!-- DESCRIPTION -->
            <div>
              <label class="block text-sm font-bold text-gray-900 mb-1.5">
                Description <span class="text-red-500">*</span>
              </label>
              <textarea
                [(ngModel)]="description"
                name="description"
                required
                rows="5"
                placeholder="Describe your service offerings, qualifications, experience, availability, languages, and rituals performed..."
                class="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition shadow-sm leading-relaxed"
              ></textarea>
              <p class="text-xs text-gray-500 mt-1">Provide helpful details so community devotees can understand your offerings.</p>
            </div>

            <!-- SUBMIT BUTTON -->
            <div class="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <a
                routerLink="/services"
                class="text-sm font-semibold text-gray-600 hover:text-gray-900 transition"
              >
                Cancel
              </a>

              <button
                type="submit"
                [disabled]="isSubmitting || !serviceForm.form.valid"
                class="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <svg *ngIf="isSubmitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{{ isSubmitting ? 'Registering Service...' : 'Publish Service to Directory' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class AddServiceComponent implements OnInit {
  category = '';
  firstName = '';
  lastName = '';
  email = '';
  address = '';
  city = '';
  mobile = '';
  phoneNo = '';
  description = '';

  selectedImage: File | null = null;
  imagePreview: string | null = null;

  isSubmitting = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  categories: string[] = [
    'Priest / Purohit / Pandit Services',
    'Pooja & Ritual Services',
    'Astrology & Vastu Shastra',
    'Catering & Prasad / Food',
    'Wedding & Event Services',
    'Music, Bhajan & Cultural Arts',
    'Traditional Attire & Puja Items',
    'Education, Yoga & Sanskrit',
    'Health & Ayurveda Wellness',
    'Community Welfare & Volunteer',
    'IT & Professional Services',
    'Other Community Services'
  ];

  cities: string[] = [
    'Auckland',
    'Wellington',
    'Christchurch',
    'Hamilton',
    'Tauranga',
    'Napier-Hastings',
    'Dunedin',
    'Palmerston North',
    'Nelson',
    'Rotorua',
    'New Plymouth',
    'Whangarei',
    'Invercargill',
    'Queenstown'
  ];

  constructor(
    private commonService: CommonService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCities();
  }

  loadCities(): void {
    this.commonService.getCities().subscribe({
      next: (data: any[]) => {
        if (Array.isArray(data) && data.length > 0) {
          const cityNames = data
            .map((c) => (typeof c === 'string' ? c : c.city || c.name))
            .filter(Boolean);
          if (cityNames.length > 0) {
            this.cities = Array.from(new Set([...cityNames, ...this.cities]));
          }
        }
      },
      error: () => {
        // Fallback already pre-populated
      }
    });
  }

  onFileChange(event: any): void {
    const file = event.target.files?.[0];
    if (file) {
      this.selectedImage = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.selectedImage = null;
    this.imagePreview = null;
  }

  onSubmit(): void {
    if (
      !this.category ||
      !this.firstName.trim() ||
      !this.lastName.trim() ||
      !this.email.trim() ||
      !this.address.trim() ||
      !this.city ||
      !this.mobile.trim() ||
      !this.description.trim()
    ) {
      this.showToast('Please fill out all required fields marked with *', 'error');
      return;
    }

    this.isSubmitting = true;
    const formData = new FormData();
    formData.append('category', this.category);
    formData.append('firstName', this.firstName.trim());
    formData.append('lastName', this.lastName.trim());
    formData.append('ownerName', `${this.firstName.trim()} ${this.lastName.trim()}`);
    formData.append('businessName', `${this.firstName.trim()} ${this.lastName.trim()} - ${this.category}`);
    formData.append('email', this.email.trim());
    formData.append('ownerEmail', this.email.trim());
    formData.append('address', this.address.trim());
    formData.append('city', this.city);
    formData.append('mobile', this.mobile.trim());
    formData.append('phone', this.phoneNo.trim() || this.mobile.trim());
    formData.append('phoneNo', this.phoneNo.trim() || this.mobile.trim());
    formData.append('ownerPhone', this.mobile.trim());
    formData.append('description', this.description.trim());
    formData.append('status', 'Approved');

    if (this.selectedImage) {
      formData.append('image', this.selectedImage, this.selectedImage.name);
      formData.append('images', this.selectedImage, this.selectedImage.name);
    }

    this.commonService.addBusiness(formData).subscribe({
      next: (res: any) => {
        this.isSubmitting = false;
        this.showToast('Service listed successfully! Redirecting to directory...', 'success');
        setTimeout(() => {
          this.router.navigate(['/services']);
        }, 1500);
      },
      error: (err: any) => {
        this.isSubmitting = false;
        const msg = err?.error?.message || err?.message || 'Failed to submit service. Please try again.';
        this.showToast(msg, 'error');
      }
    });
  }

  private showToast(msg: string, type: 'success' | 'error' = 'success'): void {
    this.toastMessage = msg;
    this.toastType = type;
    setTimeout(() => {
      this.toastMessage = '';
    }, 4000);
  }
}
