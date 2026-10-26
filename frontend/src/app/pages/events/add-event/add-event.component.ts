import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { TempleSearchSelectComponent, TempleSelectItem } from '../../../shared/components/temple-search-select/temple-search-select.component';
import { TermsConditionsModalComponent } from '../../../shared/components/terms-conditions-modal/terms-conditions-modal.component';

interface TempleOption {
  id: number;
  mandir_name: string;
  city?: { name: string };
  full_address?: string;
}

@Component({
  selector: 'app-add-event',
  standalone: true,
  imports: [CommonModule, FormsModule, TempleSearchSelectComponent, TermsConditionsModalComponent],
  template: `
    <!-- Terms & Conditions Modal -->
    <app-terms-conditions-modal
      [isOpen]="isTermsModalOpen"
      termsType="event"
      (closed)="isTermsModalOpen = false"
      (accepted)="termsAccepted = true"
    ></app-terms-conditions-modal>

    <div class="container mx-auto mt-20 px-4 py-12">
      <div class="max-w-4xl mx-auto">
        <div class="mb-8 flex items-center justify-between">
          <h2 class="text-2xl font-bold text-gray-900">{{ editMode ? 'Edit Community Event' : 'Create Community Event' }}</h2>
          <span class="text-sm text-gray-500">{{ editMode ? 'Admin edit' : 'Submit for approval' }}</span>
        </div>
        <div *ngIf="errorMessage" class="mb-4 rounded-md bg-red-50 p-4 text-red-700">{{ errorMessage }}</div>
        <div class="rounded-lg border bg-white shadow-sm">
          <div class="p-6">
            <h3 class="text-2xl font-semibold">Event Details</h3>
            <p class="text-sm text-gray-600">Provide complete information about your event.</p>
          </div>
          <div class="p-6 pt-0">
            <form class="space-y-8" (ngSubmit)="createEvent()" #eventForm="ngForm">
              <!-- Basic Information Section -->
              <section class="space-y-6">
                <h3 class="border-b pb-2 text-lg font-semibold text-gray-900">Basic Information</h3>
                <div>
                  <label class="text-sm font-medium text-gray-700" for="title">Event Name *</label>
                  <input class="mt-2 flex h-10 w-full rounded-md border border-gray-300 px-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500" id="title" name="title" [(ngModel)]="event.title" required>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-700" for="category">Event Category *</label>
                  <select class="mt-2 flex h-10 w-full rounded-md border border-gray-300 px-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500" id="category" name="category" [(ngModel)]="event.category" required>
                    <option value="" disabled>Select event category</option>
                    <option>Festival</option>
                    <option>Major Festival</option>
                    <option>Religious Observance</option>
                    <option>Pooja</option>
                    <option>Havan/Yagna</option>
                    <option>Bhajan/Kirtan</option>
                    <option>Spiritual Discourse</option>
                    <option>Cultural Program</option>
                    <option>Youth Event</option>
                    <option>Community Service</option>
                    <option>Fundraising Event</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-700" for="description">Event Description *</label>
                  <textarea class="mt-2 min-h-24 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500" id="description" name="description" [(ngModel)]="event.description" required></textarea>
                  <p class="text-xs text-gray-500 mt-1">{{ event.description.length }}/500 characters (minimum 50)</p>
                </div>

                <!-- Event Image/Banner & Temple Selection Section -->
                <div class="grid gap-6 sm:grid-cols-2 rounded-lg border border-gray-200 bg-gray-50/50 p-4">
                  <!-- Event Image / Banner Upload & URL -->
                  <div class="space-y-3">
                    <div>
                      <label class="text-sm font-semibold text-gray-900" for="imageUrl">Event Image/Banner</label>
                      <p class="text-xs text-gray-500">Provide an image URL or upload an image file directly.</p>
                    </div>

                    <!-- URL Input (Keeps existing functionality intact) -->
                    <div>
                      <input
                        class="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                        id="imageUrl"
                        name="imageUrl"
                        type="url"
                        placeholder="https://example.com/banner.jpg"
                        [(ngModel)]="event.imageUrl"
                      />
                    </div>

                    <!-- File Upload Button & Options -->
                    <div class="flex flex-wrap items-center gap-2">
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
                        class="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 shadow-sm disabled:opacity-50"
                      >
                        <span *ngIf="!isUploadingImage">📷 Upload Image</span>
                        <span *ngIf="isUploadingImage" class="flex items-center gap-1">
                          <span class="animate-spin text-orange-600">⏳</span> Uploading...
                        </span>
                      </button>

                      <button
                        *ngIf="event.imageUrl"
                        type="button"
                        (click)="removeImage(imageFileInput)"
                        class="rounded-md border border-red-200 bg-red-50 px-2.5 py-2 text-xs font-medium text-red-700 hover:bg-red-100"
                      >
                        Remove
                      </button>
                      <span class="text-xs text-gray-400">Max 5MB (JPG, PNG, WEBP, GIF)</span>
                    </div>

                    <!-- Upload error display -->
                    <div *ngIf="imageUploadError" class="rounded-md bg-red-50 p-2 text-xs text-red-700 border border-red-200">
                      {{ imageUploadError }}
                    </div>

                    <!-- Image Preview -->
                    <div *ngIf="event.imageUrl" class="relative overflow-hidden rounded-md border border-gray-200 bg-white shadow-inner max-h-48 flex items-center justify-center p-1">
                      <img
                        [src]="getPreviewUrl(event.imageUrl)"
                        alt="Event Banner Preview"
                        class="max-h-44 w-auto object-contain rounded"
                        (error)="onPreviewError()"
                      />
                    </div>
                  </div>

                  <!-- Select Temple & Community -->
                  <div class="space-y-4">
                    <!-- Community Selection (Available when Festival category is selected) -->
                    <div *ngIf="isFestivalCategory" class="rounded-md border border-orange-200 bg-orange-50/60 p-3.5 space-y-2">
                      <div class="flex items-center justify-between">
                        <label class="text-xs font-bold text-orange-950 uppercase tracking-wide flex items-center gap-1.5" for="communityId">
                          <span>👥</span>
                          <span>Select Community Group</span>
                        </label>
                        <span class="text-[11px] bg-orange-100 text-orange-800 font-semibold px-2 py-0.5 rounded-full">Festival Feature</span>
                      </div>
                      <p class="text-xs text-gray-600">
                        Associate this festival event with a community group. Temple selection becomes optional.
                      </p>
                      <select
                        id="communityId"
                        name="communityId"
                        class="flex h-9 w-full rounded-md border border-gray-300 bg-white px-2.5 text-xs text-gray-800 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                        [(ngModel)]="selectedCommunityId"
                        (change)="onCommunitySelected(selectedCommunityId)"
                      >
                        <option [ngValue]="null">-- Select a Community Group (Optional) --</option>
                        <option *ngFor="let group of communityGroups" [ngValue]="group.id">
                          {{ group.name }} {{ group.cityName ? '(' + group.cityName + ')' : '' }}
                        </option>
                      </select>

                      <div *ngIf="!selectedCommunityId" class="pt-1">
                        <input
                          type="text"
                          placeholder="Or type custom community/society name..."
                          class="flex h-8 w-full rounded-md border border-gray-300 bg-white px-2.5 text-xs focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                          [(ngModel)]="customCommunityName"
                          name="customCommunityName"
                          (input)="onCustomCommunityChange()"
                        />
                      </div>

                      <p *ngIf="event.communityName" class="text-xs text-green-700 font-medium">
                        ✓ Host Community: <strong>{{ event.communityName }}</strong>
                      </p>
                    </div>

                    <!-- Select Temple -->
                    <div class="space-y-1">
                      <app-temple-search-select
                        [(ngModel)]="event.templeId"
                        name="templeId"
                        [label]="isFestivalCategory ? 'Select Temple (Optional for Festivals)' : 'Select Temple'"
                        [helperText]="isFestivalCategory ? 'Optional: Associate with a temple if celebrated at a mandir, or leave empty if celebrating with a community.' : 'Associate with an existing temple so this event appears on the temple page.'"
                        [allowNone]="true"
                        [noneLabel]="isFestivalCategory ? '-- No Temple (Community / Independent Festival) --' : '-- None / Custom Mandir (No Temple Link) --'"
                        [temples]="temples"
                        (templeSelected)="onTempleSelected($event)"
                      ></app-temple-search-select>

                      <p *ngIf="!event.templeId && !isFestivalCategory" class="text-xs text-gray-400 italic mt-1.5">
                        If not in the list, you can still type a custom temple name below in Location Details.
                      </p>
                      <p *ngIf="!event.templeId && isFestivalCategory" class="text-xs text-orange-600 italic mt-1.5">
                        Temple is optional for festival events. You can select a community group above.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label class="text-sm font-medium text-gray-700" for="status">Event Status</label>
                  <select class="mt-2 flex h-10 w-full rounded-md border border-gray-300 px-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500" id="status" name="status" [(ngModel)]="event.status">
                    <option>Draft</option>
                    <option>Published</option>
                    <option>Cancelled</option>
                    <option>Completed</option>
                  </select>
                </div>
              </section>

              <!-- Date & Time Section -->
              <section class="space-y-6">
                <h3 class="border-b pb-2 text-lg font-semibold text-gray-900">Date &amp; Time</h3>
                <div class="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label class="text-sm font-medium text-gray-700" for="date">Event Date *</label>
                    <input class="mt-2 flex h-10 w-full rounded-md border border-gray-300 px-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500" id="date" name="date" type="date" [(ngModel)]="event.date" required>
                  </div>
                  <div>
                    <label class="text-sm font-medium text-gray-700" for="startTime">Start Time *</label>
                    <input class="mt-2 flex h-10 w-full rounded-md border border-gray-300 px-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500" id="startTime" name="startTime" type="time" [(ngModel)]="event.startTime" required>
                  </div>
                  <div>
                    <label class="text-sm font-medium text-gray-700" for="endTime">End Time *</label>
                    <input class="mt-2 flex h-10 w-full rounded-md border border-gray-300 px-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500" id="endTime" name="endTime" type="time" [(ngModel)]="event.endTime" required>
                  </div>
                </div>
                <div class="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label class="text-sm font-medium text-gray-700" for="multiDay">Multi-Day Event</label>
                    <select class="mt-2 flex h-10 w-full rounded-md border border-gray-300 px-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500" id="multiDay" name="multiDay" [(ngModel)]="event.multiDay">
                      <option [ngValue]="false">No</option>
                      <option [ngValue]="true">Yes</option>
                    </select>
                  </div>
                  <div *ngIf="event.multiDay">
                    <label class="text-sm font-medium text-gray-700" for="endDate">End Date *</label>
                    <input class="mt-2 flex h-10 w-full rounded-md border border-gray-300 px-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500" id="endDate" name="endDate" type="date" [(ngModel)]="event.endDate" [required]="event.multiDay">
                  </div>
                </div>
                <div class="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label class="text-sm font-medium text-gray-700" for="recurring">Recurring Event</label>
                    <select class="mt-2 flex h-10 w-full rounded-md border border-gray-300 px-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500" id="recurring" name="recurring" [(ngModel)]="event.recurring">
                      <option [ngValue]="false">No</option>
                      <option [ngValue]="true">Yes</option>
                    </select>
                  </div>
                  <div *ngIf="event.recurring">
                    <label class="text-sm font-medium text-gray-700" for="frequency">Frequency</label>
                    <select class="mt-2 flex h-10 w-full rounded-md border border-gray-300 px-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500" id="frequency" name="frequency" [(ngModel)]="event.frequency">
                      <option>Daily</option>
                      <option>Weekly</option>
                      <option>Monthly</option>
                      <option>Annual</option>
                    </select>
                  </div>
                </div>
                <div class="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label class="text-sm font-medium text-gray-700" for="registrationOpens">Registration Opens</label>
                    <input class="mt-2 flex h-10 w-full rounded-md border border-gray-300 px-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500" id="registrationOpens" name="registrationOpens" type="datetime-local" [(ngModel)]="event.registrationOpens">
                  </div>
                  <div>
                    <label class="text-sm font-medium text-gray-700" for="registrationCloses">Registration Closes</label>
                    <input class="mt-2 flex h-10 w-full rounded-md border border-gray-300 px-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500" id="registrationCloses" name="registrationCloses" type="datetime-local" [(ngModel)]="event.registrationCloses">
                  </div>
                </div>
              </section>

              <!-- Location Details Section -->
              <section class="space-y-6">
                <h3 class="border-b pb-2 text-lg font-semibold text-gray-900">Location Details</h3>
                <div class="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label class="text-sm font-medium text-gray-700" for="templeName">
                      {{ isFestivalCategory ? 'Temple Name (Optional for Festivals)' : 'Temple Name *' }}
                    </label>
                    <input
                      class="mt-2 flex h-10 w-full rounded-md border border-gray-300 px-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                      id="templeName"
                      name="templeName"
                      [(ngModel)]="event.templeName"
                      [placeholder]="isFestivalCategory ? 'Optional (leave blank to use selected community)' : 'Enter temple name'"
                      [required]="!isFestivalCategory"
                    >
                    <p *ngIf="event.templeId" class="text-xs text-green-600 mt-1">✓ Auto-filled from selected temple</p>
                    <p *ngIf="isFestivalCategory && !event.templeId && (event.communityName || customCommunityName)" class="text-xs text-orange-600 mt-1">
                      ⓘ Optional for festivals. Host community <strong>{{ event.communityName || customCommunityName }}</strong> will be listed as the host.
                    </p>
                  </div>
                  <div>
                    <label class="text-sm font-medium text-gray-700" for="hallName">Hall/Room Name</label>
                    <input class="mt-2 flex h-10 w-full rounded-md border border-gray-300 px-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500" id="hallName" name="hallName" [(ngModel)]="event.hallName">
                  </div>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-700" for="address">Address</label>
                  <input class="mt-2 flex h-10 w-full rounded-md border border-gray-300 px-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500" id="address" name="address" [(ngModel)]="event.address">
                </div>
                <div class="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label class="text-sm font-medium text-gray-700" for="mapsLink">Google Maps Link</label>
                    <input class="mt-2 flex h-10 w-full rounded-md border border-gray-300 px-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500" id="mapsLink" name="mapsLink" type="url" [(ngModel)]="event.mapsLink">
                  </div>
                  <div>
                    <label class="text-sm font-medium text-gray-700" for="onlineLink">Online Event Link</label>
                    <input class="mt-2 flex h-10 w-full rounded-md border border-gray-300 px-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500" id="onlineLink" name="onlineLink" type="url" [(ngModel)]="event.onlineLink">
                  </div>
                </div>
              </section>

              <!-- Terms and Conditions Section -->
              <section class="space-y-2 pt-6 border-t">
                <div class="flex items-start gap-3 p-3.5 rounded-xl border border-orange-200/80 bg-orange-50/50">
                  <input
                    id="eventTermsAccepted"
                    name="eventTermsAccepted"
                    type="checkbox"
                    [(ngModel)]="termsAccepted"
                    class="mt-1 h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500 cursor-pointer"
                  />
                  <label for="eventTermsAccepted" class="text-xs sm:text-sm text-gray-700 leading-snug cursor-pointer select-none">
                    I agree to the
                    <button
                      type="button"
                      (click)="isTermsModalOpen = true"
                      class="text-orange-600 font-semibold underline hover:text-orange-700 cursor-pointer focus:outline-none"
                    >
                      Community Event Guidelines &amp; Terms
                    </button>
                    and confirm that all event details and venue arrangements are accurate.
                  </label>
                </div>
                <p *ngIf="submittedAttempt && !termsAccepted" class="text-xs text-red-600 font-medium pl-1">
                  You must accept the Community Event Terms before submitting.
                </p>
              </section>

              <!-- Actions Section -->
              <div class="flex justify-end gap-3 border-t pt-6">
                <button type="button" class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50" (click)="saveDraft()">
                  Save Draft
                </button>
                <button
                  type="submit"
                  class="rounded-md bg-orange-600 px-5 py-2 text-sm font-medium text-white hover:bg-orange-700 disabled:opacity-50"
                  [disabled]="isSubmitDisabled()"
                >
                  {{ editMode ? 'Save Changes' : 'Submit for Approval' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AddEventComponent implements OnInit {
  private readonly apiUrl = environment.apiBaseUrl;
  private readonly backendOrigin = environment.apiBaseUrl.replace(/\/api(\/v\d+)?(\/public)?\/?$/, '');

  editMode = false;
  eventId: number | null = null;
  isLoading = false;
  errorMessage = '';

  // Terms & Conditions State
  termsAccepted = false;
  isTermsModalOpen = false;
  submittedAttempt = false;

  // Temple selection state
  temples: TempleOption[] = [];
  templeSearchQuery = '';
  isTempleDropdownOpen = false;
  selectedTempleDisplay = '';
  isLoadingTemples = false;

  // Community selection state
  communityGroups: any[] = [];
  selectedCommunityId: number | null = null;
  customCommunityName = '';
  isLoadingCommunities = false;

  // Image upload state
  isUploadingImage = false;
  imageUploadError = '';

  event = {
    title: '',
    category: '',
    description: '',
    imageUrl: '',
    status: 'Draft',
    date: '',
    startTime: '',
    endTime: '',
    multiDay: false,
    endDate: '',
    recurring: false,
    frequency: 'Daily',
    registrationOpens: '',
    registrationCloses: '',
    templeId: null as number | null,
    templeName: '',
    communityId: null as number | null,
    communityName: '',
    hallName: '',
    address: '',
    mapsLink: '',
    onlineLink: ''
  };

  constructor(
    private readonly router: Router,
    private readonly http: HttpClient,
    private readonly route: ActivatedRoute
  ) {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editMode = true;
      this.eventId = Number(id);
    }
  }

  ngOnInit(): void {
    this.loadTemples();
    this.loadCommunityGroups();
    if (this.editMode && this.eventId) {
      this.loadEvent(this.eventId);
    }
  }

  get isFestivalCategory(): boolean {
    if (!this.event.category) return false;
    const cat = this.event.category.toLowerCase().trim();
    return cat.includes('festival') || cat === 'religious observance';
  }

  isSubmitDisabled(): boolean {
    if (this.isLoading || this.isUploadingImage || !this.termsAccepted) return true;
    if (!this.event.title.trim() || !this.event.category) return true;
    if (this.event.description.trim().length < 50) return true;
    if (!this.event.date || !this.event.startTime || !this.event.endTime) return true;
    if (this.event.multiDay && !this.event.endDate) return true;

    if (!this.isFestivalCategory) {
      return !this.event.templeName.trim();
    } else {
      const hasTemple = Boolean(this.event.templeName.trim());
      const hasCommunity = Boolean(this.event.communityName.trim() || this.customCommunityName.trim());
      const hasAddress = Boolean(this.event.address?.trim());
      return !hasTemple && !hasCommunity && !hasAddress;
    }
  }

  loadCommunityGroups(): void {
    this.isLoadingCommunities = true;
    this.http.get<any>(`${this.apiUrl}/community/groups?limit=100`).subscribe({
      next: (response) => {
        const list = response?.data ?? (Array.isArray(response) ? response : []);
        this.communityGroups = Array.isArray(list) ? list : [];
        this.isLoadingCommunities = false;
      },
      error: () => {
        this.communityGroups = [];
        this.isLoadingCommunities = false;
      }
    });
  }

  onCommunitySelected(groupId: number | null): void {
    if (!groupId) {
      this.selectedCommunityId = null;
      this.event.communityId = null;
      this.event.communityName = '';
      return;
    }
    const match = this.communityGroups.find((g) => g.id === Number(groupId));
    if (match) {
      this.selectedCommunityId = match.id;
      this.event.communityId = match.id;
      this.event.communityName = match.name;
      this.customCommunityName = '';
      if (!this.event.address && match.cityName) {
        this.event.address = match.cityName;
      }
    }
  }

  onCustomCommunityChange(): void {
    const val = this.customCommunityName.trim();
    if (val) {
      this.selectedCommunityId = null;
      this.event.communityId = null;
      this.event.communityName = val;
    } else {
      this.event.communityName = '';
    }
  }

  loadTemples(): void {
    this.isLoadingTemples = true;
    this.http.get<any>(`${this.apiUrl}/temple?status=Approved&limit=all`).subscribe({
      next: (response) => {
        const list = response?.data ?? (Array.isArray(response) ? response : []);
        this.temples = Array.isArray(list) ? list : [];
        this.isLoadingTemples = false;
        this.syncSelectedTempleDisplay();
      },
      error: () => {
        this.isLoadingTemples = false;
      }
    });
  }

  get filteredTemples(): TempleOption[] {
    if (!this.templeSearchQuery.trim()) {
      return this.temples;
    }
    const q = this.templeSearchQuery.toLowerCase().trim();
    return this.temples.filter((t) =>
      (t.mandir_name && t.mandir_name.toLowerCase().includes(q)) ||
      (t.city?.name && t.city.name.toLowerCase().includes(q)) ||
      (t.full_address && t.full_address.toLowerCase().includes(q))
    );
  }

  onTempleSelected(temple: TempleSelectItem | null): void {
    if (temple) {
      this.event.templeId = temple.id;
      this.event.templeName = temple.mandir_name;
      this.selectedTempleDisplay = temple.mandir_name + (temple.city?.name ? ` (${temple.city.name})` : '');
      if (!this.event.address && temple.full_address) {
        this.event.address = temple.full_address;
      }
    } else {
      this.event.templeId = null;
      this.selectedTempleDisplay = '';
    }
  }

  selectTemple(temple: TempleOption): void {
    this.event.templeId = temple.id;
    this.event.templeName = temple.mandir_name;
    this.selectedTempleDisplay = temple.mandir_name + (temple.city?.name ? ` (${temple.city.name})` : '');
    this.templeSearchQuery = '';
    this.isTempleDropdownOpen = false;

    if (!this.event.address && temple.full_address) {
      this.event.address = temple.full_address;
    }
  }

  clearSelectedTemple(): void {
    this.event.templeId = null;
    this.selectedTempleDisplay = '';
    this.templeSearchQuery = '';
    this.isTempleDropdownOpen = false;
  }

  syncSelectedTempleDisplay(): void {
    if (this.event.templeId && this.temples.length > 0) {
      const match = this.temples.find((t) => t.id === Number(this.event.templeId));
      if (match) {
        this.selectedTempleDisplay = match.mandir_name + (match.city?.name ? ` (${match.city.name})` : '');
        return;
      }
    }
    if (this.event.templeName) {
      this.selectedTempleDisplay = this.event.templeName;
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

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
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
          this.event.imageUrl = uploadedUrl;
        }
        input.value = '';
      },
      error: (err) => {
        this.isUploadingImage = false;
        this.imageUploadError = err?.error?.message || 'Failed to upload image. Please try again or provide an image URL.';
        input.value = '';
      }
    });
  }

  removeImage(fileInput?: HTMLInputElement): void {
    this.event.imageUrl = '';
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

  createEvent(): void {
    this.submittedAttempt = true;
    if (!this.termsAccepted) {
      this.errorMessage = 'You must agree to the Terms and Conditions before submitting.';
      return;
    }

    const isFestival = this.isFestivalCategory;
    const effectiveCommunity = this.event.communityName?.trim() || this.customCommunityName?.trim() || '';
    const effectiveTemple = this.event.templeName?.trim() || '';

    if (!isFestival && !effectiveTemple) {
      this.errorMessage = 'Please provide a Temple Name for regular events.';
      return;
    }

    if (isFestival && !effectiveTemple && !effectiveCommunity && !this.event.address?.trim()) {
      this.errorMessage = 'Please select a Community or Temple, or provide a venue location for this festival.';
      return;
    }

    if (
      !this.event.title.trim() ||
      !this.event.category ||
      this.event.description.trim().length < 50 ||
      !this.event.date ||
      !this.event.startTime ||
      !this.event.endTime ||
      (this.event.multiDay && !this.event.endDate)
    ) {
      return;
    }

    this.isLoading = true;
    const request = this.editMode && this.eventId
      ? this.http.put(`${this.apiUrl}/event/${this.eventId}`, this.toApiPayload())
      : this.http.post(`${this.apiUrl}/event`, this.toApiPayload());

    request.subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate([this.editMode ? '/admin/events' : (isFestival ? '/festival' : '/events')]);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error?.error?.message || 'Could not save event.';
      }
    });
  }

  saveDraft(): void {
    localStorage.setItem('sanatan-event-draft', JSON.stringify(this.event));
  }

  private toApiPayload() {
    const isFestival = this.isFestivalCategory;
    const effectiveCommunity = this.event.communityName?.trim() || this.customCommunityName?.trim() || '';
    const effectiveTemple = this.event.templeName.trim() || (isFestival ? (effectiveCommunity || this.event.address?.trim() || 'Sanatan Community') : '');

    return {
      title: this.event.title.trim(),
      category: this.event.category,
      description: this.event.description.trim(),
      imageUrl: this.event.imageUrl || null,
      eventDate: this.event.date,
      startTime: this.event.startTime,
      endTime: this.event.endTime,
      multiDay: this.event.multiDay,
      endDate: this.event.endDate,
      recurring: this.event.recurring,
      frequency: this.event.recurring ? this.event.frequency : '',
      registrationOpens: this.event.registrationOpens,
      registrationCloses: this.event.registrationCloses,
      templeId: this.event.templeId ? Number(this.event.templeId) : null,
      templeName: effectiveTemple,
      communityId: this.selectedCommunityId ? Number(this.selectedCommunityId) : null,
      communityName: effectiveCommunity || null,
      hallName: this.event.hallName,
      address: this.event.address,
      mapsLink: this.event.mapsLink,
      onlineLink: this.event.onlineLink,
      termsAccepted: true,
      termsAcceptedAt: new Date().toISOString(),
    };
  }

  private loadEvent(id: number): void {
    this.isLoading = true;
    this.http.get<any>(`${this.apiUrl}/event/admin/${id}`).subscribe({
      next: (response) => {
        const event = response?.data;
        if (event) {
          this.event = {
            ...this.event,
            ...event,
            templeId: event.templeId ?? event.temple?.id ?? null,
            date: event.eventDate,
          };
          this.syncSelectedTempleDisplay();
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Could not load event.';
      }
    });
  }
}
