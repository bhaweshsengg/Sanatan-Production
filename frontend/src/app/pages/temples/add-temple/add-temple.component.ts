// add-temple.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CommonService,
  Temple,
  City,
  Deity,
} from 'src/app/shared/common.service';

@Component({
  selector: 'app-add-temple',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div
      *ngIf="showToast"
      [ngClass]="toastType === 'success' ? 'toast-success' : 'toast-error'"
      class="toast"
    >
      {{ toastMessage }}
    </div>
    <div class="min-h-screen bg-gray-50">
      <header class="border-b bg-white">
        <div class="container mx-auto px-4 py-4">
          <a class="flex items-center space-x-2" href="/temples">
            <div
              class="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center"
            >
              <span class="text-white font-bold text-lg">🕉</span>
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900">
                Sanatan New Zealand
              </h1>
              <p class="text-sm text-black-700">
                {{ isEditMode ? 'Edit Mandir' : 'Add Mandir' }}
              </p>
            </div>
          </a>
        </div>
      </header>
      <div class="container mx-auto px-4 py-12">
        <div class="max-w-3xl mx-auto">
          <div class="text-center mb-12">
            <div
              class="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-map-pin h-10 w-10 text-white"
              >
                <path
                  d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"
                ></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <h2 class="text-4xl font-bold text-gray-900 mb-4">
              {{ isEditMode ? 'Edit Sanatan Mandir' : 'Add a Sanatan Mandir' }}
            </h2>
            <p class="text-xl text-black-700">
              Help fellow devotees discover sacred spaces by adding mandir
              information to our directory
            </p>
          </div>
          <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div class="flex flex-col space-y-1.5 p-6">
              <div class="text-2xl font-semibold leading-none tracking-tight">
                Mandir Information
              </div>
              <div class="text-sm text-muted-foreground">
                Please provide accurate and complete information about the
                mandir. All submissions are reviewed before being published.
              </div>
            </div>
            <div class="p-6 pt-0">
              <form
                class="space-y-8"
                (ngSubmit)="onSubmit()"
                #templeForm="ngForm"
              >
                <!-- Image Upload Section -->
                <div class="space-y-6">
                  <h3 class="text-lg font-semibold text-gray-900 border-b pb-2">
                    Mandir Photos (Optional)
                  </h3>
                  <div class="space-y-4">
                    <div class="text-sm text-black-700">
                      Upload photos of the mandir<br />
                      PNG, JPG up to 10MB each. Maximum 5 photos.
                    </div>

                    <div
                      class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center"
                    >
                      <input
                        type="file"
                        id="imageUpload"
                        (change)="onFileSelected($event)"
                        accept="image/*"
                        multiple
                        class="hidden"
                        #fileInput
                      />
                      <label for="imageUpload" class="cursor-pointer">
                        <svg
                          class="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                        <div class="mt-4 flex text-sm text-black-700">
                          <span
                            class="relative font-medium text-orange-600 bg-white rounded-md focus-within:outline-none"
                          >
                            Choose Files
                          </span>
                          <p class="pl-1">or drag and drop</p>
                        </div>
                        <p class="text-xs text-gray-500">
                          PNG, JPG up to 10MB each
                        </p>
                      </label>
                    </div>

                    <!-- Error messages -->
                    <div
                      *ngIf="uploadError"
                      class="text-red-500 text-sm p-2 bg-red-50 rounded-md"
                    >
                      {{ uploadError }}
                    </div>

                    <!-- Image previews -->
                    <div *ngIf="uploadedImages.length > 0" class="mt-6">
                      <h4 class="text-sm font-medium text-gray-900 mb-3">
                        Uploaded Photos ({{ uploadedImages.length }}/5)
                      </h4>
                      <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <div
                          *ngFor="let image of uploadedImages; let i = index"
                          class="relative group"
                        >
                          <img
                            [src]="image.preview"
                            alt="Preview"
                            class="h-32 w-full object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            (click)="removeImage(i)"
                            class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                          <div class="text-xs text-gray-500 mt-1 truncate">
                            {{ image.name }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="space-y-6">
                  <h3 class="text-lg font-semibold text-gray-900 border-b pb-2">
                    Basic Information
                  </h3>
                  <div class="space-y-2">
                    <label
                      class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      for="name"
                      >Mandir Name *</label
                    >
                    <input
                      class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      id="name"
                      required
                      placeholder="e.g., Shri Sanatan Dharm Mandir"
                      [(ngModel)]="temple.mandir_name"
                      name="name"
                      #name="ngModel"
                    />
                    <div
                      *ngIf="name.invalid && (name.dirty || name.touched)"
                      class="text-red-500 text-sm"
                    >
                      <div *ngIf="name.errors?.['required']">
                        Mandir name is required
                      </div>
                    </div>
                  </div>
                  <div class="space-y-2">
                    <label
                      class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      for="address"
                      >Full Address *</label
                    >
                    <input
                      class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      id="address"
                      required
                      placeholder="e.g., 98 Balmoral Road, Mount Eden"
                      [(ngModel)]="temple.full_address"
                      name="address"
                      #address="ngModel"
                    />
                    <div
                      *ngIf="
                        address.invalid && (address.dirty || address.touched)
                      "
                      class="text-red-500 text-sm"
                    >
                      <div *ngIf="address.errors?.['required']">
                        Address is required
                      </div>
                    </div>
                  </div>
                  <div class="grid md:grid-cols-2 gap-4">
                    <div class="space-y-2">
                      <label
                        class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        for="city"
                        >City *</label
                      >
                      <select
                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        id="city"
                        required
                        [(ngModel)]="temple.city_id"
                        name="city"
                        #city="ngModel"
                      >
                        <option value="" disabled [selected]="!temple.city_id">
                          Select city
                        </option>
                        <option
                          *ngFor="let cityOption of cities"
                          [value]="cityOption.id"
                        >
                          {{ cityOption.name }}
                        </option>
                      </select>
                      <div
                        *ngIf="city.invalid && (city.dirty || city.touched)"
                        class="text-red-500 text-sm"
                      >
                        <div *ngIf="city.errors?.['required']">
                          City is required
                        </div>
                      </div>
                    </div>
                    <div class="space-y-2">
                      <label
                        class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        for="established"
                        >Year Established</label
                      >
                      <input
                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        id="established"
                        min="1800"
                        max="2025"
                        placeholder="e.g., 1992"
                        type="number"
                        [(ngModel)]="temple.year_established"
                        name="established"
                      />
                    </div>
                  </div>
                  <div class="space-y-2">
                    <label
                      class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      for="mainDeity"
                      >Main Deity *</label
                    >
                    <select
                      class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      id="mainDeity"
                      required
                      [(ngModel)]="temple.main_deity_id"
                      name="mainDeity"
                      #mainDeity="ngModel"
                    >
                      <option
                        value=""
                        disabled
                        [selected]="!temple.main_deity_id"
                      >
                        Select main deity
                      </option>
                      <option *ngFor="let deity of deities" [value]="deity.id">
                        {{ deity.name }}
                      </option>
                    </select>
                    <div
                      *ngIf="
                        mainDeity.invalid &&
                        (mainDeity.dirty || mainDeity.touched)
                      "
                      class="text-red-500 text-sm"
                    >
                      <div *ngIf="mainDeity.errors?.['required']">
                        Main deity is required
                      </div>
                    </div>
                  </div>
                  <div class="space-y-2">
                    <label
                      class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      for="description"
                      >Description *</label
                    >
                    <textarea
                      class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      id="description"
                      required
                      placeholder="Provide a brief description of the mandir, its history, and significance..."
                      rows="4"
                      [(ngModel)]="temple.description"
                      name="description"
                      #description="ngModel"
                    ></textarea>
                    <div
                      *ngIf="
                        description.invalid &&
                        (description.dirty || description.touched)
                      "
                      class="text-red-500 text-sm"
                    >
                      <div *ngIf="description.errors?.['required']">
                        Description is required
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Contact Information Section -->
                <div class="space-y-6">
                  <h3 class="text-lg font-semibold text-gray-900 border-b pb-2">
                    Contact Information
                  </h3>
                  <div class="grid md:grid-cols-2 gap-4">
                    <div class="space-y-2">
                      <label
                        class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        for="phone"
                        >Phone Number *</label
                      >
                      <input
                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        id="phone"
                        required
                        placeholder="+64 9 630 5540"
                        type="tel"
                        [(ngModel)]="temple.phone_no"
                        name="phone"
                        #phone="ngModel"
                      />
                      <div
                        *ngIf="phone.invalid && (phone.dirty || phone.touched)"
                        class="text-red-500 text-sm"
                      >
                        <div *ngIf="phone.errors?.['required']">
                          Phone number is required
                        </div>
                      </div>
                    </div>
                    <div class="space-y-2">
                      <label
                        class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        for="email"
                        >Email Address</label
                      >
                      <input
                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        id="email"
                        placeholder="info@mandir.org.nz"
                        type="email"
                        [(ngModel)]="temple.email"
                        name="email"
                      />
                    </div>
                  </div>

                  <div class="grid md:grid-cols-2 gap-4">
                    <div class="space-y-2">
                      <label
                        class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        for="location"
                        >Location URL *</label
                      >
                      <input
                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        id="location"
                        required
                        placeholder="Enter Google Maps URL"
                        type="url"
                        [(ngModel)]="temple.location"
                        name="location"
                        #location="ngModel"
                      />
                      <div
                        *ngIf="
                          location.invalid &&
                          (location.dirty || location.touched)
                        "
                        class="text-red-500 text-sm"
                      >
                        <div *ngIf="location.errors?.['required']">
                          Location is required
                        </div>
                      </div>
                    </div>
                    <div class="space-y-2">
                      <label
                        class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        for="rating"
                        >Rating</label
                      >
                      <input
                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        id="rating"
                        placeholder="4.5"
                        type="number"
                        min="0"
                        max="5"
                        step="0.1"
                        [(ngModel)]="temple.rating"
                        name="rating"
                      />
                    </div>
                  </div>

                  <div class="space-y-2">
                    <label
                      class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      for="reviews"
                      >Number of Reviews</label
                    >
                    <input
                      class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      id="reviews"
                      placeholder="150"
                      type="number"
                      min="0"
                      [(ngModel)]="temple.review"
                      name="reviews"
                    />
                  </div>

                  <div class="space-y-2">
                    <label
                      class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      for="website"
                      >Website</label
                    >
                    <input
                      class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      id="website"
                      placeholder="https://www.mandir.org.nz"
                      type="url"
                      [(ngModel)]="temple.website"
                      name="website"
                    />
                  </div>
                  <div class="space-y-2">
                    <label
                      class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      for="timings"
                      >Opening Hours *</label
                    >
                    <input
                      class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      id="timings"
                      required
                      placeholder="e.g., 06:00 - 20:00 or 6:00 AM - 8:00 PM"
                      [(ngModel)]="temple.opening_hours"
                      name="timings"
                      #timings="ngModel"
                    />
                    <div
                      *ngIf="
                        timings.invalid && (timings.dirty || timings.touched)
                      "
                      class="text-red-500 text-sm"
                    >
                      <div *ngIf="timings.errors?.['required']">
                        Opening hours are required
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Services Offered Section -->
                <!-- Services Offered Section -->
                <div class="space-y-6">
                  <h3 class="text-lg font-semibold text-gray-900 border-b pb-2">
                    Services Offered
                  </h3>
                  <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div
                      class="flex items-center space-x-2"
                      *ngFor="let service of servicesList"
                    >
                      <input
                        type="checkbox"
                        [id]="service.code"
                        [value]="service.code"
                        [checked]="
                          temple.service_offered.includes(service.code)
                        "
                        (change)="onServiceChange($event)"
                        class="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                      <label
                        class="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm"
                        [for]="service.code"
                        >{{ service.name }}</label
                      >
                    </div>
                  </div>
                </div>

                <!-- Facilities Available Section -->
                <!-- Facilities Available Section -->
                <div class="space-y-6">
                  <h3 class="text-lg font-semibold text-gray-900 border-b pb-2">
                    Facilities Available
                  </h3>
                  <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div
                      class="flex items-center space-x-2"
                      *ngFor="let facility of facilitiesList"
                    >
                      <input
                        type="checkbox"
                        [id]="facility.code"
                        [value]="facility.code"
                        [checked]="
                          temple.facilities_offered.includes(facility.code)
                        "
                        (change)="onFacilityChange($event)"
                        class="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                      <label
                        class="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm"
                        [for]="facility.code"
                        >{{ facility.name }}</label
                      >
                    </div>
                  </div>
                </div>

                <!-- Your Information Section -->
                <div class="space-y-6">
                  <h3 class="text-lg font-semibold text-gray-900 border-b pb-2">
                    Your Information
                  </h3>
                  <div class="grid md:grid-cols-2 gap-4">
                    <div class="space-y-2">
                      <label
                        class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        for="contactPerson"
                        >Your Name *</label
                      >
                      <input
                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        id="contactPerson"
                        required
                        placeholder="Your full name"
                        [(ngModel)]="temple.your_name"
                        name="contactPerson"
                        #contactPerson="ngModel"
                      />
                      <div
                        *ngIf="
                          contactPerson.invalid &&
                          (contactPerson.dirty || contactPerson.touched)
                        "
                        class="text-red-500 text-sm"
                      >
                        <div *ngIf="contactPerson.errors?.['required']">
                          Your name is required
                        </div>
                      </div>
                    </div>
                    <div class="space-y-2">
                      <label
                        class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        for="contactRole"
                        >Your Role/Relationship to Mandir *</label
                      >
                      <input
                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        id="contactRole"
                        required
                        placeholder="e.g., Committee Member, Devotee"
                        [(ngModel)]="temple.contactRole"
                        name="contactRole"
                        #contactRole="ngModel"
                      />
                      <div
                        *ngIf="
                          contactRole.invalid &&
                          (contactRole.dirty || contactRole.touched)
                        "
                        class="text-red-500 text-sm"
                      >
                        <div *ngIf="contactRole.errors?.['required']">
                          Your role is required
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="space-y-2">
                    <label
                      class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      for="contactEmail"
                      >Your Email *</label
                    >
                    <input
                      class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      id="contactEmail"
                      required
                      placeholder="your.email@example.com"
                      type="email"
                      [(ngModel)]="temple.your_email"
                      name="contactEmail"
                      #contactEmail="ngModel"
                    />
                    <div
                      *ngIf="
                        contactEmail.invalid &&
                        (contactEmail.dirty || contactEmail.touched)
                      "
                      class="text-red-500 text-sm"
                    >
                      <div *ngIf="contactEmail.errors?.['required']">
                        Your email is required
                      </div>
                      <div *ngIf="contactEmail.errors?.['email']">
                        Please enter a valid email
                      </div>
                    </div>
                  </div>
                </div>
                <div class="flex justify-end gap-2 pt-6 border-t">
                  <button
                    type="button"
                    class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                    (click)="onCancel()"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 text-white h-10 px-4 py-2 bg-orange-600 hover:bg-orange-700"
                    [disabled]="templeForm.invalid || isLoading"
                  >
                    {{
                      isLoading
                        ? 'Processing...'
                        : isEditMode
                        ? 'Update Mandir'
                        : 'Submit Mandir Information'
                    }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .toast {
        position: fixed !important;
        bottom: 20px !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
        padding: 1rem 1.5rem !important;
        border-radius: 8px !important;
        color: #fff !important;
        z-index: 10000 !important;
        min-width: 300px !important;
        text-align: center !important;
        font-weight: 500 !important;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
          0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
        transition: all 0.3s ease-in-out !important;
      }

      .toast-success {
        background-color: #10b981 !important;
      }

      .toast-error {
        background-color: #ef4444 !important;
      }
    `,
  ],
})
export class AddTempleComponent implements OnInit {
  isEditMode = false;
  isLoading = false;
  templeId: number | null = null;
  uploadError: string = '';

  // Fixed property initialization
  toastMessage: string = '';
  toastType: 'success' | 'error' = 'success';
  showToast: boolean = false;
  uploadedImages: { file: File; preview: string; name: string }[] = [];
  cities: City[] = [];
  deities: Deity[] = [];

  temple: Temple = {
    message: '',
    mandir_name: '',
    full_address: '',
    city_id: 0,
    year_established: '',
    main_deity_id: 0,
    service_offered: [],
    facilities_offered: [],
    phone_no: '',
    email: '',
    website: '',
    opening_hours: '',
    your_name: '',
    your_email: '',
    rating: 0,
    description: '',
    location: '',
    review: '',
    contactRole: '',
  };

  servicesList = [
    { code: 'daily_aarti', name: 'Daily Aarti' },
    { code: 'weekly_bhajan', name: 'Weekly Bhajan' },
    { code: 'festival_celebrations', name: 'Festival Celebrations' },
    { code: 'wedding_ceremonies', name: 'Wedding Ceremonies' },
    { code: 'naming_ceremonies', name: 'Naming Ceremonies' },
    { code: 'thread_ceremonies', name: 'Thread Ceremonies' },
    { code: 'funeral_services', name: 'Funeral Services' },
    { code: 'sanskrit_classes', name: 'Sanskrit Classes' },
    { code: 'yoga_classes', name: 'Yoga Classes' },
    { code: 'cultural_programs', name: 'Cultural Programs' },
    { code: 'community_kitchen', name: 'Community Kitchen' },
    { code: 'religious_counseling', name: 'Religious Counseling' },
  ];

  facilitiesList = [
    { code: 'parking', name: 'Parking Available' },
    { code: 'wheelchair', name: 'Wheelchair Accessible' },
    { code: 'community_hall', name: 'Community Hall' },
    { code: 'kitchen', name: 'Kitchen Facilities' },
    { code: 'library', name: 'Library' },
    { code: 'bookstore', name: 'Bookstore' },
    { code: 'audio_visual', name: 'Audio/Visual Equipment' },
    { code: 'ac', name: 'Air Conditioning' },
    { code: 'shoe_storage', name: 'Shoe Storage' },
    { code: 'restrooms', name: 'Restrooms' },
    { code: 'children_area', name: "Children's Area" },
    { code: 'garden', name: 'Garden/Outdoor Space' },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    this.loadCities();
    this.loadDeities();

    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.isEditMode = true;
        this.templeId = +params['id'];
        this.loadTemple(this.templeId);
      }
    });
  }

  loadCities() {
    this.commonService.getCities().subscribe({
      next: (cities) => {
        this.cities = cities;
      },
      error: (error) => {
        console.error('Error loading cities:', error);
      },
    });
  }

  loadDeities() {
    this.commonService.getDeities().subscribe({
      next: (deities) => {
        this.deities = deities;
      },
      error: (error) => {
        console.error('Error loading deities:', error);
      },
    });
  }

  loadTemple(id: number) {
    this.isLoading = true;
    this.commonService.getTemplebyId(id).subscribe({
      next: (temple) => {
        this.temple = temple;
        // If there are existing image, populate the uploadedImages array
        if (temple.uploaded_images && temple.uploaded_images.length > 0) {
          temple.uploaded_images.forEach((img, index) => {
            this.uploadedImages.push({
              file: new File([], `existing-image-${index}`),
              preview: img.file,
              name: `Existing Image ${index + 1}`,
            });
          });
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading temple:', error);
        this.isLoading = false;
      },
    });
  }

  onFileSelected(event: any) {
    this.uploadError = '';
    const files = event.target.files;

    if (!files || files.length === 0) return;

    // Check if adding these files would exceed the maximum of 5
    if (this.uploadedImages.length + files.length > 5) {
      this.uploadError = 'Maximum 5 photos allowed';
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Check file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        this.uploadError = `File "${file.name}" exceeds 10MB size limit`;
        continue;
      }

      // Check file type
      if (!file.type.match(/image\/(jpeg|png|jpg)/)) {
        this.uploadError = `File "${file.name}" is not a JPG or PNG image`;
        continue;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.uploadedImages.push({
          file: file,
          preview: e.target.result,
          name: file.name,
        });
      };
      reader.readAsDataURL(file);
    }

    // Reset the file input
    event.target.value = '';
  }

  removeImage(index: number) {
    this.uploadedImages.splice(index, 1);
  }

  onServiceChange(event: any) {
    const service = event.target.value;
    if (event.target.checked) {
      if (!this.temple.service_offered.includes(service)) {
        this.temple.service_offered.push(service);
      }
    } else {
      this.temple.service_offered = this.temple.service_offered.filter(
        (s) => s !== service
      );
    }
  }

  onFacilityChange(event: any) {
    const facility = event.target.value;
    if (event.target.checked) {
      if (!this.temple.facilities_offered.includes(facility)) {
        this.temple.facilities_offered.push(facility);
      }
    } else {
      this.temple.facilities_offered = this.temple.facilities_offered.filter(
        (f) => f !== facility
      );
    }
  }

async onSubmit() {
  // Format opening hours to HH:MM format expected by backend
  this.temple.opening_hours = this.formatOpeningHours(
    this.temple.opening_hours
  );

  // Create FormData object
  const formData = new FormData();

  // Add all simple fields to FormData
  formData.append('mandir_name', this.temple.mandir_name);
  formData.append('full_address', this.temple.full_address);
  formData.append('city_id', this.temple.city_id.toString());
  const yearEstablished = Number(this.temple.year_established);
  formData.append(
    'year_established',
    Number.isInteger(yearEstablished) && yearEstablished > 0
      ? yearEstablished.toString()
      : new Date().getFullYear().toString()
  );
  formData.append('main_deity_id', this.temple.main_deity_id.toString());
  formData.append('phone_no', this.temple.phone_no);
  formData.append('opening_hours', this.temple.opening_hours);
  formData.append('your_name', this.temple.your_name);
  formData.append('your_email', this.temple.your_email);
  formData.append('description', this.temple.description);
  formData.append('location', this.temple.location);

  // Use the submitter email when the temple does not have a separate email.
  formData.append('email', this.temple.email || this.temple.your_email);
  formData.append('website', this.temple.website || '');
  if (this.temple.rating) {
    formData.append('rating', this.temple.rating.toString());
  }
  if (this.temple.review) {
    formData.append('review', this.temple.review);
  }
  if (this.temple.contactRole) {
    formData.append('contactRole', this.temple.contactRole);
  }

  // Add array fields (services and facilities)
  if (this.temple.service_offered && this.temple.service_offered.length > 0) {
    this.temple.service_offered.forEach(service => {
      formData.append('service_offered', service);
    });
  }

  if (this.temple.facilities_offered && this.temple.facilities_offered.length > 0) {
    this.temple.facilities_offered.forEach(facility => {
      formData.append('facilities_offered', facility);
    });
  }

  // Add uploaded images to FormData
  if (this.uploadedImages.length > 0) {
    for (let i = 0; i < this.uploadedImages.length; i++) {
      const img = this.uploadedImages[i];
      
      // Only add new files (not existing ones from edit mode)
      if (img.file.size > 0) {
        formData.append('uploaded_images', img.file, img.name || `image_${i}`);
      } else if (this.isEditMode && img.preview) {
        // For existing images in edit mode, send the URL as a string
        // Make sure img.preview is a string, not an object
        if (typeof img.preview === 'string') {
          formData.append('existing_images', img.preview);
        }
      }
    }
  }

  this.isLoading = true;

  if (this.isEditMode && this.templeId) {
    this.commonService.updateTemple(this.templeId, formData).subscribe({
      next: (response) => {
        this.isLoading = false;
        const message = response?.message || 'Temple updated successfully!';
        this.showToastMessage(message, 'success');
        
        // Delay navigation to allow toast to be visible
        setTimeout(() => {
          this.router.navigate(['/temples']);
        }, 1500);
      },
      error: (error) => {
        console.error('Error updating temple:', error);
        this.isLoading = false;
        const message = error?.error?.message || error.message || 'Error updating temple';
        this.showToastMessage(message, 'error');
      },
    });
  } else {
    this.commonService.createTemple(formData).subscribe({
      next: (response) => {
        this.isLoading = false;
        const message = response?.message || 'Temple submitted successfully!';
        this.showToastMessage(message, 'success');
        
        // Delay navigation to allow toast to be visible
        setTimeout(() => {
          this.router.navigate(['/temples']);
        }, 1500);
      },
      error: (error) => {
        console.error('Error creating temple:', error);
        this.isLoading = false;
        const message = error?.error?.message || error.message || 'Something went wrong';
        this.showToastMessage(message, 'error');
      },
    });
  }
}

  convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }

  onCancel() {
    this.router.navigate(['/temples']);
  }
  formatOpeningHours(hours: string): string {
    // Example conversion: "6:00 AM - 8:00 PM" → "06:00-20:00"
    // You might need a more sophisticated parser based on your input format
    if (hours.includes('AM') || hours.includes('PM')) {
      // Convert 12-hour format to 24-hour format
      const [start, end] = hours.split('-').map((part) => part.trim());

      const convertTo24Hour = (timeStr: string): string => {
        const [time, modifier] = timeStr.split(' ');
        let [hours, minutes] = time.split(':');

        if (modifier === 'PM' && hours !== '12') {
          hours = (parseInt(hours, 10) + 12).toString();
        } else if (modifier === 'AM' && hours === '12') {
          hours = '00';
        }

        return `${hours.padStart(2, '0')}:${minutes || '00'}`;
      };

      return `${convertTo24Hour(start)}-${convertTo24Hour(end)}`;
    }

    return hours; // Return as is if already in 24-hour format
  }
  // Enhanced showToastMessage method
  showToastMessage(message: string, type: 'success' | 'error' = 'error') {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;

    // Auto-hide toast after 3 seconds
    setTimeout(() => {
      this.showToast = false;
      this.toastMessage = '';
    }, 3000);
  }
}
