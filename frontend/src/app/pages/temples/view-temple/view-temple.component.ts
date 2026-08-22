import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CommonService, Temple } from 'src/app/shared/common.service';
interface ApiTemple {
  id: number;
  mandir_name: string;
  full_address: string;
  city: {
    id: number;
    name: string;
  };
  year_established: number;
  main_deity: {
    id: number;
    name: string;
  };
  description: string;
  service_offered: string[];
  facilities_offered: string[];
  images: {
    file: string;
  }[];
  phone_no: string;
  email: string;
  website: string;
  opening_hours: string;
  your_name: string;
  your_email: string;
  rating: number;
  location: string;
}
@Component({
  selector: 'app-view-temple',
  standalone: true,
  imports: [CommonModule],
  template: `
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
              <p class="text-sm text-black-700">Mandir Details</p>
            </div>
          </a>
        </div>
      </header>
      <div class="container mx-auto px-4 py-8">
        <div class="max-w-6xl mx-auto">
          <div class="grid lg:grid-cols-2 gap-8 mb-8">
            <div class="space-y-4">
              <div class="relative h-80 rounded-lg overflow-hidden">
                <img
                  [alt]="temple?.mandir_name"
                  loading="lazy"
                  decoding="async"
                  class="object-cover w-full h-full"
                  [src]="temple?.images?.[0]?.file"
                />
                <div
                  class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent text-primary-foreground hover:bg-primary/80 absolute top-4 left-4 bg-orange-600"
                >
                  Featured Mandir
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4" *ngIf="temple?.images">
                <div class="relative h-32 rounded-lg overflow-hidden" *ngFor="let image of temple?.images">
                  <img
                    [alt]="temple?.mandir_name"
                    loading="lazy"
                    decoding="async"
                    class="object-cover w-full h-full"
                    [src]="image.file"
                  />
                </div>
              </div>
            </div>
            <div class="space-y-6">
              <div>
                <div class="flex items-center justify-between mb-2">
                  <h1 class="text-3xl font-bold text-gray-900">
                    {{ temple?.mandir_name }}
                  </h1>
                  <div class="flex items-center space-x-2">
                    <button
                      class="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
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
                        class="lucide lucide-heart h-4 w-4"
                      >
                        <path
                          d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
                        ></path>
                      </svg>
                    </button>
                    <button
                      class="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
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
                        class="lucide lucide-share2 h-4 w-4"
                      >
                        <circle cx="18" cy="5" r="3"></circle>
                        <circle cx="6" cy="12" r="3"></circle>
                        <circle cx="18" cy="19" r="3"></circle>
                        <line x1="8.59" x2="15.42" y1="13.51" y2="17.49"></line>
                        <line x1="15.41" x2="8.59" y1="6.51" y2="10.49"></line>
                      </svg>
                    </button>
                  </div>
                </div>
                <div class="flex items-center space-x-4 mb-4">
                  <div class="flex items-center">
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
                      class="lucide lucide-star h-5 w-5 text-yellow-500 mr-1"
                    >
                      <path
                        d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.770-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"
                      ></path>
                    </svg>
                    <span class="font-medium">{{ temple?.rating || 'N/A' }}</span>
                    <span class="!text-gray-500 ml-1">(112 reviews)</span>
                  </div>
                  <div
                    class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  >
                    {{ temple?.main_deity?.name || 'Hindu Temple' }}
                  </div>
                  <span class="text-sm !text-gray-500" *ngIf="temple?.year_established">Est. {{ temple?.year_established }}</span>
                </div>
                <p class="text-black-700 leading-relaxed">
                  {{ temple?.description || 'No description available.' }}
                </p>
              </div>
              <div
                class="rounded-lg border bg-card text-card-foreground shadow-sm"
              >
                <div class="p-4 space-y-3">
                  <div class="flex items-center">
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
                      class="lucide lucide-map-pin h-5 w-5 text-gray-400 mr-3"
                    >
                      <path
                        d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"
                      ></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span class="text-sm">{{ temple?.full_address || 'Address not available' }}</span>
                  </div>
                  <div class="flex items-center" *ngIf="temple?.phone_no">
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
                      class="lucide lucide-phone h-5 w-5 text-gray-400 mr-3"
                    >
                      <path
                        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
                      ></path>
                    </svg>
                    <span class="text-sm">{{ temple?.phone_no }}</span>
                  </div>
                  <div class="flex items-center" *ngIf="temple?.opening_hours">
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
                      class="lucide lucide-clock h-5 w-5 text-gray-400 mr-3"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span class="text-sm">Open: {{ temple?.opening_hours }}</span>
                  </div>
                  <div class="flex items-center" *ngIf="temple?.email">
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
                      class="lucide lucide-mail h-5 w-5 text-gray-400 mr-3"
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                      <path
                        d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"
                      ></path>
                    </svg>
                    <span class="text-sm">{{ temple?.email }}</span>
                  </div>
                  <div class="flex items-center" *ngIf="temple?.website">
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
                      class="lucide lucide-globe h-5 w-5 text-gray-400 mr-3"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <path
                        d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"
                      ></path>
                      <path d="M2 12h20"></path>
                    </svg>
                    <a
                      [href]="temple?.website"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-sm text-orange-600 hover:underline"
                      >Visit Website</a
                    >
                  </div>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <a
                  target="_blank"
                  class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-primary-foreground h-10 px-4 py-2 bg-orange-600 hover:bg-orange-700"
                  [href]="'https://maps.google.com/?q=' + (temple?.full_address || '')"
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
                    class="lucide lucide-navigation mr-2 h-4 w-4"
                  >
                    <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
                  </svg>
                  Get Directions
                </a>
                <a
                  class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                  [href]="'tel:' + temple?.phone_no"
                  *ngIf="temple?.phone_no"
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
                    class="lucide lucide-phone mr-2 h-4 w-4"
                  >
                    <path
                      d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
                    ></path>
                  </svg>
                  Call Mandir
                </a>
              </div>
            </div>
          </div>
          <div class="grid lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2 space-y-8">
              <div
                class="rounded-lg border bg-card text-card-foreground shadow-sm"
                *ngIf="temple?.service_offered && temple?.service_offered"
              >
                <div class="flex flex-col space-y-1.5 p-6">
                  <div
                    class="text-2xl font-semibold leading-none tracking-tight"
                  >
                    Services Offered
                  </div>
                  <div class="text-sm text-muted-foreground">
                    Religious and cultural services available at this Mandir
                  </div>
                </div>
                <div class="p-6 pt-0">
                  <div class="grid grid-cols-2 gap-3">
                    <div class="flex items-center space-x-2" *ngFor="let service of temple?.service_offered">
                      <div class="w-2 h-2 bg-orange-600 rounded-full"></div>
                      <span class="text-sm">{{ formatServiceName(service) }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="rounded-lg border bg-card text-card-foreground shadow-sm"
                *ngIf="temple?.facilities_offered && temple?.facilities_offered"
              >
                <div class="flex flex-col space-y-1.5 p-6">
                  <div
                    class="text-2xl font-semibold leading-none tracking-tight"
                  >
                    Facilities & Amenities
                  </div>
                  <div class="text-sm text-muted-foreground">
                    Available facilities and accessibility features
                  </div>
                </div>
                <div class="p-6 pt-0">
                  <div class="grid grid-cols-2 gap-3">
                    <div class="flex items-center space-x-2" *ngFor="let facility of temple?.facilities_offered">
                      <div class="w-2 h-2 bg-green-600 rounded-full"></div>
                      <span class="text-sm">{{ formatFacilityName(facility) }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="rounded-lg border bg-card text-card-foreground shadow-sm"
              >
                <div class="flex flex-col space-y-1.5 p-6">
                  <div
                    class="text-2xl font-semibold leading-none tracking-tight"
                  >
                    History & Background
                  </div>
                </div>
                <div class="p-6 pt-0">
                  <p class="text-black-700 leading-relaxed">
                    {{ temple?.description || 'No historical information available.' }}
                  </p>
                </div>
              </div>
            </div>
            <div class="space-y-6">
              <div
                class="rounded-lg border bg-card text-card-foreground shadow-sm"
              >
                <div class="flex flex-col space-y-1.5 p-6">
                  <div
                    class="text-2xl font-semibold leading-none tracking-tight flex items-center"
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
                      class="lucide lucide-calendar mr-2 h-5 w-5"
                    >
                      <path d="M8 2v4"></path>
                      <path d="M16 2v4"></path>
                      <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                      <path d="M3 10h18"></path>
                    </svg>
                    Upcoming Events
                  </div>
                </div>
                <div class="p-6 pt-0 space-y-4">
                  <div class="p-3 bg-orange-50 rounded-lg">
                    <h4 class="font-medium text-gray-900">Ganesh Chaturthi</h4>
                    <p class="text-sm text-black-700">Fri, 22 Nov at 6:00 PM</p>
                  </div>
                  <div class="p-3 bg-orange-50 rounded-lg">
                    <h4 class="font-medium text-gray-900">Monthly Bhajan</h4>
                    <p class="text-sm text-black-700">Tue, 19 Nov at 7:00 PM</p>
                  </div>
                  <a
                    class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full bg-transparent"
                    href="/events"
                    >View All Events</a
                  >
                </div>
              </div>
              <div
                class="rounded-lg border bg-card text-card-foreground shadow-sm"
              >
                <div class="flex flex-col space-y-1.5 p-6">
                  <div
                    class="text-2xl font-semibold leading-none tracking-tight"
                  >
                    Quick Actions
                  </div>
                </div>
                <div class="p-6 pt-0 space-y-3">
                  <button
                    class="inline-flex items-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full justify-start bg-transparent"
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
                      class="lucide lucide-users mr-2 h-4 w-4"
                    >
                      <path
                        d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
                      ></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    Join Mandir Community
                  </button>
                  <button
                    class="inline-flex items-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus:visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full justify-start bg-transparent"
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
                      class="lucide lucide-calendar mr-2 h-4 w-4"
                    >
                      <path d="M8 2v4"></path>
                      <path d="M16 2v4"></path>
                      <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                      <path d="M3 10h18"></path>
                    </svg>
                    Book Event Space
                  </button>
                  <button
                    class="inline-flex items-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full justify-start bg-transparent"
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
                      class="lucide lucide-heart mr-2 h-4 w-4"
                    >
                      <path
                        d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 极速 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c极速 0 2.3 1.5 4.05 3 5.5l7 7Z"
                      ></path>
                    </svg>
                    Make Donation
                  </button>
                </div>
              </div>
              <div
                class="rounded-lg border bg-card text-card-foreground shadow-sm"
              >
                <div class="flex flex-col space-y-1.5 p-6">
                  <div
                    class="text-2xl font-semibold leading-none tracking-tight"
                  >
                    Contact Information
                  </div>
                </div>
                <div class="p-6 pt-0 space-y-3">
                  <div *ngIf="temple?.full_address">
                    <label
                      class="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-medium text-gray-700"
                      >Address</label
                    >
                    <p class="text-sm text-black-700">
                      {{ temple?.full_address }}
                    </p>
                  </div>
                  <div *ngIf="temple?.phone_no">
                    <label
                      class="peer-disabled:cursor-not-allowed peer极速:opacity-70 text-sm font-medium text-gray-700"
                      >Phone</label
                    >
                    <p class="text-sm text-black-700">{{ temple?.phone_no }}</p>
                  </div>
                  <div *ngIf="temple?.opening_hours">
                    <label
                      class="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-medium text-gray-700"
                      >Hours</label
                    >
                    <p class="text-sm text-black-700">
                      {{ temple?.opening_hours }}
                    </p>
                  </div>
                  <div *ngIf="temple?.email">
                    <label
                      class="peer-disabled:cursor-not-allowed peer-disabled:opacity-70极速 text-sm font-medium text-gray极速"
                      >Email</label
                    >
                    <p class="text-sm text-black-700">
                      {{ temple?.email }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ViewTempleComponent implements OnInit {
  temple: Temple | null = null;
  toastMessage: any;
  toastType: any;
  showToast: any;

  constructor(
    private templeService: CommonService,
    private route: ActivatedRoute
  ) {}


  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.getTemple(+id);
    }
  }

  getTemple(id: number): void {
    this.templeService.getTemplebyId(id).subscribe({
      next: (temple) => {
        this.temple = temple;
      },
      error: (error) => {
        console.error('Error fetching temple:', error);
      }
    });
  }
private showToastMessage(message: string, type: 'success' | 'error' = 'error') {
    this.toastMessage.set(message);
    this.toastType.set(type);
    this.showToast.set(true);
    
    setTimeout(() => {
      this.showToast.set(false);
      this.toastMessage.set('');
    }, 3000);
  }
  formatServiceName(service: string): string {
    // Convert snake_case to Title Case
    return service.split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  formatFacilityName(facility: string): string {
    // Convert snake_case to Title Case
    return facility.split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}