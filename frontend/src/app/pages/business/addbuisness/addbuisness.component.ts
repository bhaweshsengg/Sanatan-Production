import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule for ngClass
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel
import { Business, CommonService } from 'src/app/shared/common.service';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-addbuisness',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div
      class="rounded-lg border bg-card text-card-foreground max-w-2xl mx-auto shadow-lg font-['Inter']"
    >
      <div class="flex flex-col space-y-1.5 p-6 text-center">
        <h3 class="tracking-tight text-3xl font-bold text-gray-900">
          Register Your Business
        </h3>
        <p class="text-sm text-gray-600">
          List your Sanatan-owned business in our directory to connect with the
          community.
        </p>
        <div class="flex justify-center mt-4">
          <div
            class="flex items-center"
            [ngClass]="{
              'text-orange-600': step() === 1,
              'text-gray-400': step() !== 1
            }"
          >
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center font-bold"
              [ngClass]="{
                'bg-orange-600 text-white': step() >= 1,
                'bg-gray-200 text-gray-400': step() < 1
              }"
            >
              1
            </div>
            <div
              class="flex-1 h-1 mx-2"
              [ngClass]="{
                'bg-orange-600': step() > 1,
                'bg-gray-200': step() <= 1
              }"
            ></div>
          </div>
          <div
            class="flex items-center"
            [ngClass]="{
              'text-orange-600': step() === 2,
              'text-gray-400': step() !== 2
            }"
          >
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center font-bold"
              [ngClass]="{
                'bg-orange-600 text-white': step() >= 2,
                'bg-gray-200 text-gray-400': step() < 2
              }"
            >
              2
            </div>
            <div
              class="flex-1 h-1 mx-2"
              [ngClass]="{
                'bg-orange-600': step() > 2,
                'bg-gray-200': step() <= 2
              }"
            ></div>
          </div>
          <div
            class="flex items-center"
            [ngClass]="{
              'text-orange-600': step() === 3,
              'text-gray-400': step() !== 3
            }"
          >
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center font-bold"
              [ngClass]="{
                'bg-orange-600 text-white': step() === 3,
                'bg-gray-200 text-gray-400': step() < 3
              }"
            >
              3
            </div>
          </div>
        </div>
      </div>
      <div class="p-6">
        @if (step() === 1) {
        <div class="space-y-6">
          <h2 class="text-2xl font-bold text-gray-900">1. Business Details</h2>
          <p class="text-gray-600">Tell us about your business.</p>
          <form class="grid gap-4" (ngSubmit)="onNext()">
            <div class="space-y-2">
              <label
                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                for="business_name"
                >Business Name <span class="text-red-500">*</span></label
              >
              <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                id="business_name"
                required
                [value]="businessName()"
                (input)="businessName.set($any($event.target).value)"
              />
            </div>
            <div class="space-y-2 relative">
              <label
                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                for="category"
                >Category <span class="text-red-500">*</span></label
              >
              <button
                type="button"
                role="combobox"
                aria-expanded="false"
                aria-autocomplete="none"
                dir="ltr"
                [attr.data-state]="isCategoryDropdownOpen() ? 'open' : 'closed'"
                class="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&amp;>span]:line-clamp-1"
                (click)="toggleCategoryDropdown()"
              >
                <span>{{ category() || 'Select a category' }}</span>
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
                  class="lucide lucide-chevron-down h-4 w-4 opacity-50"
                  aria-hidden="true"
                >
                  <path d="m6 9 6 6 6-6"></path>
                </svg>
              </button>
              @if (isCategoryDropdownOpen()) {
              <ul
                class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
              >
                @for (cat of categories(); track cat) {
                <li
                  (click)="selectCategory(cat)"
                  class="px-3 py-2 cursor-pointer hover:bg-gray-100"
                >
                  {{ cat }}
                </li>
                }
              </ul>
              }
            </div>
            <div class="space-y-2">
              <label
                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                for="description"
                >Description <span class="text-red-500">*</span></label
              >
              <textarea
                class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                id="description"
                required
                rows="4"
                [value]="description()"
                (input)="description.set($any($event.target).value)"
              ></textarea>
            </div>
            <div class="space-y-2">
              <label
                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                for="address"
                >Address <span class="text-red-500">*</span></label
              >
              <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                id="address"
                required
                [value]="address()"
                (input)="address.set($any($event.target).value)"
              />
            </div>
            <div class="space-y-2 relative">
              <label
                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                for="city"
                >City <span class="text-red-500">*</span></label
              >

              <button
                type="button"
                role="combobox"
                aria-expanded="false"
                aria-autocomplete="none"
                dir="ltr"
                [attr.data-state]="isCityDropdownOpen() ? 'open' : 'closed'"
                class="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&amp;>span]:line-clamp-1"
                (click)="toggleCityDropdown()"
              >
                <span *ngIf="!loadingCities()">{{
                  city() || 'Select city'
                }}</span>
                <span *ngIf="loadingCities()">Loading...</span>
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
                  class="lucide lucide-chevron-down h-4 w-4 opacity-50"
                  aria-hidden="true"
                >
                  <path d="m6 9 6 6 6-6"></path>
                </svg>
              </button>

              @if (isCityDropdownOpen()) {
              <ul
                class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
              >
                @for (c of cities(); track c) {
                <li
                  (click)="selectCity(c)"
                  class="px-3 py-2 cursor-pointer hover:bg-gray-100"
                >
                  {{ c }}
                </li>
                }
              </ul>
              }
            </div>
            <div class="space-y-2">
              <label
                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                for="phone"
                >Phone <span class="text-red-500">*</span></label
              >
              <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                id="phone"
                required
                type="tel"
                [value]="phone()"
                (input)="phone.set($any($event.target).value)"
              />
            </div>
            <div class="space-y-2">
              <label
                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                for="review"
                >Review <span class="text-red-500">*</span></label
              >
              <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                id="review"
                required
                type="tel"
                [value]="review()"
                (input)="review.set($any($event.target).value)"
              />
            </div>
            <div class="space-y-2">
              <label
                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                for="email"
                >Email <span class="text-red-500">*</span></label
              >
              <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                id="email"
                required
                type="email"
                [value]="email()"
                (input)="email.set($any($event.target).value)"
              />
            </div>
            <div class="space-y-2">
              <label
                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                for="website"
                >Website (Optional)</label
              >
              <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                id="website"
                placeholder="https://www.example.com"
                type="url"
                [value]="website()"
                (input)="website.set($any($event.target).value)"
              />
            </div>
            <button
              type="submit"
              [class]="
                isFormValid()
                  ? 'bg-orange-600 hover:bg-orange-700'
                  : 'bg-gray-400 cursor-not-allowed'
              "
              [disabled]="!isFormValid()"
              class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-primary-foreground h-10 px-4 py-2 w-full"
            >
              Next
            </button>
          </form>
        </div>
        } @else if (step() === 2) {
        <div class="space-y-6">
          <h2 class="text-2xl font-bold text-gray-900">
            2. Owner & Additional Details
          </h2>
          <p class="text-gray-600">
            Provide contact information and other relevant details.
          </p>
          <form class="grid gap-4" (ngSubmit)="onNext()">
            <div class="space-y-2">
              <label
                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                for="owner_name"
                >Your Name (Owner/Contact Person)
                <span class="text-red-500">*</span></label
              >
              <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                id="owner_name"
                required
                [value]="ownerName()"
                (input)="ownerName.set($any($event.target).value)"
              />
            </div>
            <div class="space-y-2">
              <label
                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                for="owner_email"
                >Your Email <span class="text-red-500">*</span></label
              >
              <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                id="owner_email"
                required
                type="email"
                [value]="ownerEmail()"
                (input)="ownerEmail.set($any($event.target).value)"
              />
            </div>
            <div class="space-y-2">
              <label
                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                for="owner_phone"
                >Your Phone <span class="text-red-500">*</span></label
              >
              <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                id="owner_phone"
                required
                type="tel"
                [value]="ownerPhone()"
                (input)="ownerPhone.set($any($event.target).value)"
              />
            </div>
            <div class="space-y-2">
              <label
                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                for="services"
                >Services Offered (Comma-separated, e.g., Catering, Event
                Planning)</label
              >
              <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                id="services"
                placeholder="e.g., Catering, Event Planning, Photography"
                [value]="services()"
                (input)="services.set($any($event.target).value)"
              />
            </div>
            <div class="space-y-2">
              <label
                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                for="hours"
                >Operating Hours (e.g., Mon-Fri: 9 AM - 5 PM, Sat: 10 AM - 2
                PM)</label
              >
              <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                id="hours"
                [value]="operatingHours()"
                (input)="operatingHours.set($any($event.target).value)"
              />
            </div>
            <div class="space-y-2">
              <label
                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                for="offers"
                >Special Offers/Promotions (Optional)</label
              >
              <textarea
                class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                id="offers"
                rows="4"
                [value]="specialOffers()"
                (input)="specialOffers.set($any($event.target).value)"
              ></textarea>
            </div>
            <div class="space-y-2">
              <label
                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >Social Media Links (Optional)</label
              >
<input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm mb-2"
                id="facebook"
                placeholder="Facebook URL"
                type="url"
                [value]="linkedInUrl()"
                (input)="linkedInUrl.set($any($event.target).value)"
              />
              <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm mb-2"
                id="facebook"
                placeholder="Facebook URL"
                type="url"
                [value]="facebookUrl()"
                (input)="facebookUrl.set($any($event.target).value)"
              />
              <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm mb-2"
                id="instagram"
                placeholder="Instagram URL"
                type="url"
                [value]="instagramUrl()"
                (input)="instagramUrl.set($any($event.target).value)"
              />
              <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                id="twitter"
                placeholder="X (Twitter) URL"
                type="url"
                [value]="twitterUrl()"
                (input)="twitterUrl.set($any($event.target).value)"
              />
            </div>
            <div class="space-y-2">
              <label
                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                for="images"
                >Upload Images (Optional, Max 5)</label
              >
              <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                id="images"
                type="file"
                multiple
                accept="image/*"
                (change)="onFileChange($event)"
              />
              @if(selectedImageCount() > 0) {
              <p class="text-sm text-gray-500">
                {{ selectedImageCount() }} file(s) selected.
              </p>
              }
            </div>
            <div class="flex justify-between mt-6">
              <button
                type="button"
                (click)="onBack()"
                class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-gray-200 text-gray-800 hover:bg-gray-300"
              >
                Back
              </button>
              <button
                type="submit"
                [class]="
                  isStep2Valid()
                    ? 'bg-orange-600 hover:bg-orange-700'
                    : 'bg-gray-400 cursor-not-allowed'
                "
                [disabled]="!isStep2Valid()"
                class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-primary-foreground h-10 px-4 py-2"
              >
                Next
              </button>
            </div>
          </form>
        </div>
        } @else if (step() === 3) {
        <div class="space-y-6">
          <h2 class="text-2xl font-bold text-gray-900">3. Review & Submit</h2>
          <p class="text-gray-600">
            Please review your submission before finalizing.
          </p>
          <div class="rounded-lg border bg-gray-50 p-6 space-y-4">
            <h3 class="text-lg font-bold">Business Details</h3>
            <div class="grid gap-2 text-sm">
              <p><strong>Name:</strong> {{ businessName() }}</p>
              <p><strong>Category:</strong> {{ category() }}</p>
              <p><strong>Description:</strong> {{ description() }}</p>
              <p><strong>Address:</strong> {{ address() }}, {{ city() }}</p>
              <p><strong>Contact:</strong> {{ phone() }}, {{ email() }}</p>
            </div>
            <h3 class="text-lg font-bold mt-4">Owner/Contact Details</h3>
            <div class="grid gap-2 text-sm">
              <p><strong>Owner Name:</strong> {{ ownerName() }}</p>
              <p><strong>Owner Email:</strong> {{ ownerEmail() }}</p>
              <p><strong>Owner Phone:</strong> {{ ownerPhone() }}</p>
              @if (services()) {
              <p><strong>Services:</strong> {{ services() }}</p>
              } @if (operatingHours()) {
              <p><strong>Operating Hours:</strong> {{ operatingHours() }}</p>
              } @if (specialOffers()) {
              <p><strong>Special Offers:</strong> {{ specialOffers() }}</p>
              } @if (selectedImageCount() > 0) {
              <p>
                <strong>Images:</strong> {{ selectedImageCount() }} selected
              </p>
              }
            </div>
          </div>
          <div
            class="bg-yellow-100 text-yellow-800 p-4 rounded-md text-sm mt-4 flex items-start space-x-2"
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
              class="h-5 w-5 flex-shrink-0 text-yellow-500"
            >
              <path
                d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
              ></path>
              <path d="M12 9v4"></path>
              <path d="M12 17h.01"></path>
            </svg>
            <p>
              Your submission will be reviewed by our team. We will notify you
              via email once it has been approved and published in the
              directory.
            </p>
          </div>
          <div class="flex items-center space-x-2 mt-4">
            <input
              type="checkbox"
              id="terms"
              class="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              [(ngModel)]="agreedToTerms"
            />
            <label
              for="terms"
              class="text-sm font-medium leading-none text-gray-700"
              >I have read and agree to the
              <a href="#" class="text-blue-500 hover:underline"
                >disclaimer and terms</a
              >
              regarding business listings.</label
            >
          </div>
          <div class="flex justify-between mt-6">
            <button
              type="button"
              (click)="onBack()"
              class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-gray-200 text-gray-800 hover:bg-gray-300"
            >
              Back
            </button>
            <button
              type="button"
              [class]="
                agreedToTerms() && !isSubmitting()
                  ? 'bg-orange-600 hover:bg-orange-700'
                  : 'bg-gray-400 cursor-not-allowed'
              "
              [disabled]="!agreedToTerms() || isSubmitting()"
              (click)="onSubmit()"
              class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-primary-foreground h-10 px-4 py-2"
            >
              @if (isSubmitting()) { Submitting... } @else { Submit Business }
            </button>
          </div>
        </div>
        }
      </div>
    </div>
<div *ngIf="showToast" [ngClass]="toastType === 'success' ? 'toast-success' : 'toast-error'" class="toast">
  {{ toastMessage }}
</div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
.toast {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 1rem 1.5rem;
  border-radius: 5px;
  color: #fff;
  z-index: 9999;
}

.toast-success {
  background-color: #4caf50;
}

.toast-error {
  background-color: #f44336;
}

      /* No custom styles needed, all styling handled by Tailwind CSS classes */
    `,
  ],
})
export class AddbuisnessComponent {
  toastMessage!: string;
  toastType!: string;
  showToast!: boolean;
  // Inject the BusinessService
  constructor(private businessService: CommonService, private router: Router) {}

  // Signals for multi-step form and data
  step = signal(1);
  businessName = signal('');
  category = signal('');
  description = signal('');
  address = signal('');
  city = signal('');
  review = signal('');
  phone = signal('');
  email = signal('');
  website = signal('');

  ownerName = signal('');
  ownerEmail = signal('');
  ownerPhone = signal('');
  services = signal('');
  operatingHours = signal('');
  specialOffers = signal('');

  // Add social media URL signals
  facebookUrl = signal('');
  linkedInUrl = signal('');
  instagramUrl = signal('');
  twitterUrl = signal('');

  images: File[] = [];
  selectedImageCount = signal(0);
  agreedToTerms = signal(false);
  isSubmitting = signal(false);

  // Signals for dropdown state
  isCategoryDropdownOpen = signal(false);
  isCityDropdownOpen = signal(false);

  // Sample data for dropdowns
  categories = signal([
    'Restaurants & Food',
    'IT Solutions',
    'Consulting',
    'Health & Wellness',
    'Other',
  ]);
  cities = signal<string[]>([]); // ✅ Updated to a string array
  loadingCities = signal(false);
  // ✅ Implement ngOnInit to fetch cities on component load
  ngOnInit(): void {
    this.loadingCities.set(true);
    this.businessService
      .getCities()
      .pipe(
        catchError((err) => {
          console.error('Failed to load cities:', err);
          this.loadingCities.set(false);
          this.showToastMessage(
            'Failed to load cities. Please try again later.',
            'error'
          );
          return of([]); // Return an empty observable to prevent the app from crashing
        })
      )
      .subscribe((cityData: any) => {
        // Type as `any` or the correct type from your API
        if (cityData && Array.isArray(cityData)) {
          const cityNames = cityData.map((city) => city.name); // ✅ Assuming your API returns an array of objects with a 'name' property
          this.cities.set(cityNames);
          console.log('Cities loaded from API:', this.cities());
        }
        this.loadingCities.set(false);
      });
  }
  // Computed signal to check if the step 1 form is valid
  isFormValid = computed(() => {
    return (
      this.businessName() &&
      this.category() &&
      this.description() &&
      this.address() &&
      this.city() &&
      this.phone() &&
      this.email()
    );
  });

  // Computed signal to check if the step 2 form is valid
  isStep2Valid = computed(() => {
    return this.ownerName() && this.ownerEmail() && this.ownerPhone();
  });

  // Method to toggle the category dropdown
  toggleCategoryDropdown() {
    this.isCategoryDropdownOpen.update((value) => !value);
    this.isCityDropdownOpen.set(false);
  }

  // Method to select a category
  selectCategory(selectedCategory: string) {
    this.category.set(selectedCategory);
    this.isCategoryDropdownOpen.set(false);
  }

  // Method to toggle the city dropdown
  toggleCityDropdown() {
    this.isCityDropdownOpen.update((value) => !value);
    this.isCategoryDropdownOpen.set(false);
  }

  // Method to select a city
  selectCity(selectedCity: string) {
    this.city.set(selectedCity);
    this.isCityDropdownOpen.set(false);
  }

  // Method to handle file selection
  onFileChange(event: any) {
    const files = event.target.files as FileList;
    this.images = Array.from(files).slice(0, 5) as File[]; // Cast to File[]
    this.selectedImageCount.set(this.images.length);
  }

  // Method to handle form submission (Next button)
  onNext() {
    // Check which step we are on and advance if valid
    if (this.step() === 1 && this.isFormValid()) {
      this.step.set(2);
    } else if (this.step() === 2 && this.isStep2Valid()) {
      this.step.set(3);
    }
  }

  // Method to go back to the previous step
  onBack() {
    this.step.update((currentStep) => currentStep - 1);
  }

  // Method to handle final submission
  onSubmit() {
    if (this.agreedToTerms()) {
      this.isSubmitting.set(true);

      const formData = new FormData();
      formData.append('businessName', this.businessName());
      formData.append('category', this.category());
      formData.append('description', this.description());
      formData.append('address', this.address());
      formData.append('city', this.city());
      formData.append('review', this.review());
      formData.append('phone', this.phone());
      formData.append('email', this.email());
      formData.append('website', this.website());
      formData.append('ownerName', this.ownerName());
      formData.append('ownerEmail', this.ownerEmail());
      formData.append('ownerPhone', this.ownerPhone());
      formData.append('services', this.services());
      formData.append('operatingHours', this.operatingHours());
      formData.append('specialOffers', this.specialOffers());
      formData.append('facebookUrl', this.facebookUrl());
      formData.append('linkedInUrl', this.linkedInUrl());
      formData.append('instagramUrl', this.instagramUrl());
      formData.append('twitterUrl', this.twitterUrl());

      // ✅ Send status along with form
      formData.append('status', 'Pending');

      // ✅ Attach images
      this.images.forEach((file) => {
        formData.append('images', file, file.name);
      });

      this.businessService.addBusiness(formData).subscribe({
        next: (response: any) => {
          this.isSubmitting.set(false);

          // use API message if available, fallback otherwise
          const message =
            response?.message || 'Business submitted successfully!';
          this.showToastMessage(message, 'success');
          // ✅ Navigate after short delay (so user sees toast)
          setTimeout(() => {
            this.router.navigate(['/business/directory']);
          }, 1000);
        },
        error: (err) => {
          this.isSubmitting.set(false);

          // if backend sends error message, use it, else fallback
          const message =
            err?.error?.message || err.message || 'Something went wrong';
          this.showToastMessage(message, 'error');
        },
      });
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
