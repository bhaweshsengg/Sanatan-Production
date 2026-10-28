import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { TermsConditionsModalComponent } from '../../../shared/components/terms-conditions-modal/terms-conditions-modal.component';

@Component({
  selector: 'app-add-festival',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TermsConditionsModalComponent],
  template: `
    <!-- Terms & Conditions Modal -->
    <app-terms-conditions-modal
      [isOpen]="isTermsModalOpen"
      termsType="event"
      (closed)="isTermsModalOpen = false"
      (accepted)="termsAccepted = true"
    ></app-terms-conditions-modal>

    <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 mt-14">
      <div class="max-w-4xl mx-auto">
        <!-- Top Navigation / Back link -->
        <div class="mb-6 flex items-center justify-between">
          <a
            routerLink="/festival"
            class="inline-flex items-center gap-1.5 text-sm font-medium text-orange-600 hover:text-orange-700 transition"
          >
            <span>←</span>
            <span>Back to Festivals Calendar</span>
          </a>
          <span class="text-xs bg-orange-100 text-orange-800 font-semibold px-2.5 py-1 rounded-full">
            🪔 Sanatan Festival Creation
          </span>
        </div>

        <!-- Header Card -->
        <div class="mb-8 rounded-2xl bg-gradient-to-r from-orange-600 via-orange-500 to-red-600 p-6 sm:p-8 text-white shadow-lg">
          <div class="flex items-center gap-3 mb-2">
            <span class="text-3xl">🪔</span>
            <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {{ editMode ? 'Edit Festival Celebration' : 'Create a Sanatan Festival' }}
            </h1>
          </div>
          <p class="text-sm sm:text-base text-orange-100 max-w-2xl font-light">
            List a sacred festival, deepotsav, pooja, or cultural observance across New Zealand.
          </p>
        </div>

        <div *ngIf="errorMessage" class="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700 border border-red-200">
          {{ errorMessage }}
        </div>

        <div class="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div class="p-6 sm:p-8">
            <form class="space-y-8" (ngSubmit)="createFestival()" #festivalForm="ngForm">
              
              <!-- Festival Basics -->
              <section class="space-y-6">
                <div class="border-b border-gray-200 pb-3 flex items-center justify-between">
                  <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <span>🌸</span>
                    <span>Festival Information</span>
                  </h3>
                  <span class="text-xs text-gray-400">* Required fields</span>
                </div>

                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-1" for="title">
                    Festival Name *
                  </label>
                  <input
                    class="w-full h-11 rounded-lg border border-gray-300 px-3.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    id="title"
                    name="title"
                    placeholder="e.g. Maha Shivaratri Celebration, Deepavali Mahotsav, Krishna Janmashtami"
                    [(ngModel)]="festival.title"
                    required
                  />
                </div>

                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-1" for="category">
                    Festival Sanatan Dharma *
                  </label>
                  <select
                    class="w-full h-11 rounded-lg border border-gray-300 px-3.5 text-sm bg-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    id="category"
                    name="category"
                    [(ngModel)]="festival.category"
                    required
                  >
                    <option value="" disabled>Select Sanatan Dharma tradition</option>
                    <option value="Hindu">Hindu</option>
                    <option value="Jain">Jain</option>
                    <option value="Sikh">Sikh</option>
                    <option value="Baudh">Baudh</option>
                    <!-- Fallback for legacy categories so editing existing records retains value safely -->
                    <option *ngIf="isLegacyCategory(festival.category)" [value]="festival.category">
                      {{ festival.category }} (Legacy)
                    </option>
                  </select>
                </div>

                <!-- Significance / Description -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-1" for="description">
                    Spiritual Significance &amp; Celebration Details *
                  </label>
                  <textarea
                    class="w-full min-h-28 rounded-lg border border-gray-300 p-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    id="description"
                    name="description"
                    placeholder="Explain the spiritual significance of the festival, schedule of ceremonies, mahaprasad arrangements, and who can participate..."
                    [(ngModel)]="festival.description"
                    required
                  ></textarea>
                  <div class="flex items-center justify-between text-xs text-gray-500 mt-1">
                    <span>Minimum 50 characters</span>
                    <span [ngClass]="{'text-green-600': festival.description.trim().length >= 50, 'text-gray-400': festival.description.trim().length < 50}">
                      {{ festival.description.trim().length }}/50 minimum
                    </span>
                  </div>
                </div>

                <!-- Banner / Image Upload -->
                <div class="rounded-xl border border-gray-200 bg-gray-50/60 p-4 space-y-3">
                  <div>
                    <label class="block text-sm font-semibold text-gray-800" for="imageUrl">
                      Festival Banner / Image
                    </label>
                    <p class="text-xs text-gray-500 mt-0.5">Upload a celebration photo or provide an image URL.</p>
                  </div>

                  <input
                    class="w-full h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    id="imageUrl"
                    name="imageUrl"
                    type="url"
                    placeholder="https://example.com/festival-banner.jpg"
                    [(ngModel)]="festival.imageUrl"
                  />

                  <div class="flex flex-wrap items-center gap-2 pt-1">
                    <input
                      type="file"
                      #imageFileInput
                      accept="image/png,image/jpeg,image/webp,image/gif"
                      (change)="onFileSelected($event)"
                      class="hidden"
                    />
                    <button
                      type="button"
                      (click)="imageFileInput.click()"
                      [disabled]="isUploadingImage"
                      class="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 shadow-sm disabled:opacity-50"
                    >
                      <span *ngIf="!isUploadingImage">📷 Upload Image</span>
                      <span *ngIf="isUploadingImage" class="flex items-center gap-1">
                        <span class="animate-spin text-orange-600">⏳</span> Uploading...
                      </span>
                    </button>
                    <button
                      *ngIf="festival.imageUrl"
                      type="button"
                      (click)="removeImage(imageFileInput)"
                      class="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-100"
                    >
                      Remove
                    </button>
                    <span class="text-xs text-gray-400">Max 5MB (PNG, JPG, WEBP)</span>
                  </div>

                  <div *ngIf="imageUploadError" class="rounded-md bg-red-50 p-2 text-xs text-red-700 border border-red-200">
                    {{ imageUploadError }}
                  </div>

                  <div *ngIf="festival.imageUrl" class="relative overflow-hidden rounded-lg border border-gray-200 bg-white max-h-44 flex items-center justify-center p-1">
                    <img
                      [src]="getPreviewUrl(festival.imageUrl)"
                      alt="Festival Preview"
                      class="max-h-40 w-auto object-contain rounded"
                      (error)="onPreviewError()"
                    />
                  </div>
                </div>
              </section>

              <!-- Date & Schedule Section -->
              <section class="space-y-6">
                <div class="border-b border-gray-200 pb-3">
                  <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <span>📅</span>
                    <span>Date &amp; Schedule</span>
                  </h3>
                </div>

                <div class="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-1" for="eventDate">
                      Festival Date *
                    </label>
                    <input
                      class="w-full h-10 rounded-lg border border-gray-300 px-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                      id="eventDate"
                      name="eventDate"
                      type="date"
                      [(ngModel)]="festival.eventDate"
                      required
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-1" for="startTime">
                      Start Time *
                    </label>
                    <input
                      class="w-full h-10 rounded-lg border border-gray-300 px-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                      id="startTime"
                      name="startTime"
                      type="time"
                      [(ngModel)]="festival.startTime"
                      required
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-1" for="endTime">
                      End Time *
                    </label>
                    <input
                      class="w-full h-10 rounded-lg border border-gray-300 px-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                      id="endTime"
                      name="endTime"
                      type="time"
                      [(ngModel)]="festival.endTime"
                      required
                    />
                  </div>
                </div>
              </section>

              <!-- Terms and Conditions Section -->
              <section class="space-y-2 pt-6 border-t border-gray-200">
                <div class="flex items-start gap-3 p-3.5 rounded-xl border border-orange-200 bg-orange-50/50">
                  <input
                    id="festivalTermsAccepted"
                    name="festivalTermsAccepted"
                    type="checkbox"
                    [(ngModel)]="termsAccepted"
                    class="mt-1 h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500 cursor-pointer"
                  />
                  <label for="festivalTermsAccepted" class="text-xs sm:text-sm text-gray-700 leading-snug cursor-pointer select-none">
                    I agree to the
                    <button
                      type="button"
                      (click)="isTermsModalOpen = true"
                      class="text-orange-600 font-semibold underline hover:text-orange-700 cursor-pointer focus:outline-none"
                    >
                      Community Festival Guidelines &amp; Terms
                    </button>
                    and confirm that festival information and seva arrangements are accurate.
                  </label>
                </div>
                <p *ngIf="submittedAttempt && !termsAccepted" class="text-xs text-red-600 font-medium pl-1">
                  You must accept the Festival Terms before submitting.
                </p>
              </section>

              <!-- Actions Section -->
              <div class="flex items-center justify-between border-t border-gray-200 pt-6">
                <a
                  routerLink="/festival"
                  class="rounded-lg border border-gray-300 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </a>
                <button
                  type="submit"
                  class="rounded-lg bg-orange-600 hover:bg-orange-700 px-6 py-2.5 text-xs font-bold text-white shadow-sm transition disabled:opacity-50 inline-flex items-center gap-1.5"
                  [disabled]="isSubmitDisabled()"
                >
                  <span>🪔</span>
                  <span>{{ isLoading ? 'Creating...' : (editMode ? 'Save Changes' : 'Create Festival') }}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AddFestivalComponent implements OnInit {
  private readonly apiUrl = environment.apiBaseUrl;
  private readonly backendOrigin = environment.apiBaseUrl.replace(/\/api(\/v\d+)?(\/public)?\/?$/, '');

  editMode = false;
  festivalId: number | null = null;
  isLoading = false;
  errorMessage = '';

  // Terms modal
  termsAccepted = false;
  isTermsModalOpen = false;
  submittedAttempt = false;

  // Image upload
  isUploadingImage = false;
  imageUploadError = '';

  festival = {
    title: '',
    category: 'Hindu',
    description: '',
    imageUrl: '',
    status: 'Published',
    eventDate: '',
    startTime: '10:00',
    endTime: '13:00',
    multiDay: false,
    endDate: '',
    recurring: false,
    frequency: 'Annual',
    registrationOpens: '',
    registrationCloses: '',
    templeId: null as number | null,
    templeName: '',
    communityId: null as number | null,
    communityName: '',
    hallName: '',
    address: '',
    mapsLink: '',
    onlineLink: '',
  };

  constructor(
    private readonly router: Router,
    private readonly http: HttpClient,
    private readonly route: ActivatedRoute
  ) {
    const id = this.route?.snapshot?.queryParamMap?.get('id') || this.route?.snapshot?.paramMap?.get('id');
    if (id) {
      this.editMode = true;
      this.festivalId = Number(id);
    }
  }

  ngOnInit(): void {
    if (this.editMode && this.festivalId) {
      this.loadFestival(this.festivalId);
    }
  }

  onFileSelected(e: Event): void {
    const input = e.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    this.imageUploadError = '';

    if (!file.type || !file.type.startsWith('image/')) {
      this.imageUploadError = 'Please select a valid image file (JPEG, PNG, WEBP, GIF).';
      input.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.imageUploadError = 'Image size must be less than 5MB.';
      input.value = '';
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    this.isUploadingImage = true;
    this.http.post<any>(`${this.apiUrl}/event/upload-image`, formData).subscribe({
      next: (response) => {
        this.isUploadingImage = false;
        const uploadedUrl = response?.data?.url || response?.url;
        if (uploadedUrl) {
          this.festival.imageUrl = uploadedUrl;
        }
        input.value = '';
      },
      error: (err) => {
        this.isUploadingImage = false;
        this.imageUploadError = err?.error?.message || 'Failed to upload image.';
        input.value = '';
      },
    });
  }

  removeImage(fileInput?: HTMLInputElement): void {
    this.festival.imageUrl = '';
    this.imageUploadError = '';
    if (fileInput) fileInput.value = '';
  }

  getPreviewUrl(url: string | null | undefined): string {
    if (!url) return '';
    if (/^https?:\/\//i.test(url) || url.startsWith('data:')) return url;
    const clean = url.startsWith('/') ? url : `/${url}`;
    return `${this.backendOrigin}${clean}`;
  }

  onPreviewError(): void {
    this.imageUploadError = 'Could not load image from the provided URL or upload.';
  }

  isSubmitDisabled(): boolean {
    if (this.isLoading || this.isUploadingImage || !this.termsAccepted) return true;
    if (!this.festival.title.trim() || !this.festival.category) return true;
    if (this.festival.description.trim().length < 50) return true;
    if (!this.festival.eventDate || !this.festival.startTime || !this.festival.endTime) return true;
    return false;
  }

  createFestival(): void {
    this.submittedAttempt = true;
    if (!this.termsAccepted) {
      this.errorMessage = 'You must agree to the Festival Terms and Conditions before submitting.';
      return;
    }

    if (
      !this.festival.title.trim() ||
      !this.festival.category ||
      this.festival.description.trim().length < 50 ||
      !this.festival.eventDate ||
      !this.festival.startTime ||
      !this.festival.endTime
    ) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const payload = this.toApiPayload();
    const request = this.editMode && this.festivalId
      ? this.http.put(`${this.apiUrl}/event/${this.festivalId}`, payload)
      : this.http.post(`${this.apiUrl}/event`, payload);

    request.subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/festival']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error?.error?.message || 'Could not save festival. Please try again.';
      },
    });
  }

  private toApiPayload() {
    return {
      title: this.festival.title.trim(),
      category: this.festival.category,
      description: this.festival.description.trim(),
      imageUrl: this.festival.imageUrl || null,
      eventDate: this.festival.eventDate,
      startTime: this.festival.startTime,
      endTime: this.festival.endTime,
      multiDay: false,
      endDate: null,
      recurring: false,
      frequency: '',
      registrationOpens: null,
      registrationCloses: null,
      templeId: null,
      templeName: 'Sanatan Community',
      communityId: null,
      communityName: null,
      hallName: null,
      address: null,
      mapsLink: null,
      onlineLink: null,
      termsAccepted: true,
      termsAcceptedAt: new Date().toISOString(),
    };
  }

  isLegacyCategory(cat: string | null | undefined): boolean {
    if (!cat) return false;
    return !['Hindu', 'Jain', 'Sikh', 'Baudh'].includes(cat);
  }

  private loadFestival(id: number): void {
    this.isLoading = true;
    this.http.get<any>(`${this.apiUrl}/event/admin/${id}`).subscribe({
      next: (res) => {
        const ev = res?.data;
        if (ev) {
          this.festival = {
            ...this.festival,
            ...ev,
            category: ev.category || 'Hindu',
            eventDate: ev.eventDate,
          };
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Could not load festival details.';
      },
    });
  }
}
