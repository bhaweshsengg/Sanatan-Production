import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../Auth/auth.service';

export interface EventDetail {
  id: number | string;
  title: string;
  category: string;
  description: string;
  imageUrl?: string | null;
  status: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  multiDay?: boolean;
  endDate?: string | null;
  recurring?: boolean;
  frequency?: string | null;
  venue?: string;
  templeId?: number | null;
  templeName?: string;
  temple?: {
    id: number;
    publicId?: string;
    mandir_name: string;
    full_address?: string;
    phone_no?: string;
    email?: string;
  } | null;
  communityId?: number | null;
  communityName?: string | null;
  communityGroup?: {
    id: number;
    name: string;
    slug?: string;
    cityName?: string;
  } | null;
  hallName?: string | null;
  address?: string | null;
  mapsLink?: string | null;
  onlineLink?: string | null;
  attendees: number;
  joined?: boolean;
  organizer?: {
    id: number;
    username: string;
    email?: string;
  } | null;
}

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- Floating Notification Toast -->
    <div
      *ngIf="showToastMessage"
      class="fixed top-24 left-1/2 -translate-x-1/2 py-3 px-6 rounded-lg shadow-2xl z-50 text-white text-sm font-medium transition-all duration-300"
      [ngClass]="{
        'bg-green-600': toastMessageType === 'success',
        'bg-red-600': toastMessageType === 'error',
        'bg-orange-600': toastMessageType === 'info'
      }"
    >
      {{ toastMessageText }}
    </div>

    <!-- QR Code Modal -->
    <div
      *ngIf="showQrModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
    >
      <div class="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-gray-200 overflow-hidden flex flex-col">
        <div class="bg-gradient-to-r from-orange-600 via-red-600 to-amber-600 p-5 text-white flex items-center justify-between">
          <div>
            <span class="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white mb-1">
              {{ event?.category || 'Event' }}
            </span>
            <h3 class="text-lg font-bold leading-snug">{{ event?.title }}</h3>
          </div>
          <button
            type="button"
            (click)="showQrModal = false"
            class="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div class="p-6 text-center space-y-4">
          <p class="text-xs text-gray-500">
            Scan this QR code with any smartphone camera to view event details and join.
          </p>

          <div class="inline-block p-3 bg-white rounded-2xl border-2 border-orange-200 shadow-inner">
            <img
              [src]="qrCodeUrl"
              [alt]="'QR Code to join ' + (event?.title || 'Event')"
              class="w-52 h-52 mx-auto rounded-lg object-contain"
            />
          </div>

          <div class="bg-orange-50/70 border border-orange-100 rounded-xl p-3 text-xs text-gray-700 space-y-1 text-left">
            <div><strong>📍 Venue:</strong> {{ getVenueDisplay() }}</div>
            <div><strong>📅 Date:</strong> {{ getFormattedDate() }} · {{ event?.startTime }}{{ event?.endTime ? ' - ' + event?.endTime : '' }}</div>
            <div><strong>👥 Attendees:</strong> {{ event?.attendees || 0 }} attending</div>
          </div>

          <div class="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs">
            <input
              type="text"
              readonly
              [value]="currentUrl"
              class="w-full bg-transparent text-gray-600 outline-none text-[11px] truncate"
            />
            <button
              type="button"
              (click)="copyLink()"
              class="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-md shadow-xs transition-colors flex-shrink-0 cursor-pointer"
            >
              Copy Link
            </button>
          </div>

          <div class="pt-2 flex gap-3">
            <button
              type="button"
              (click)="showQrModal = false"
              class="flex-1 py-2.5 px-4 rounded-xl border border-gray-300 text-gray-700 font-medium text-xs hover:bg-gray-50 transition cursor-pointer"
            >
              Close
            </button>
            <button
              *ngIf="!event?.joined"
              type="button"
              (click)="joinEvent(); showQrModal = false"
              class="flex-1 py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow transition cursor-pointer"
            >
              Join Event Now
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Page Container -->
    <div class="min-h-screen bg-gray-50 pb-20">
      <!-- Top Navigation & Breadcrumb -->
      <header class="border-b bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div class="flex items-center justify-between">
            <nav class="flex items-center gap-2 text-sm text-gray-600">
              <a routerLink="/" class="text-orange-600 hover:underline">Home</a>
              <span class="text-gray-400">/</span>
              <a routerLink="/events" class="text-orange-600 hover:underline">Events</a>
              <span class="text-gray-400">/</span>
              <span class="text-gray-900 font-medium truncate max-w-xs sm:max-w-md">{{ event?.title || 'Event Details' }}</span>
            </nav>
            <a
              routerLink="/events"
              class="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-600 hover:text-orange-600 transition"
            >
              <span>←</span>
              <span>All Events</span>
            </a>
          </div>
        </div>
      </header>

      <!-- Loading State -->
      <div *ngIf="isLoading" class="py-24 text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent mb-4"></div>
        <p class="text-gray-600 font-medium">Loading event details...</p>
      </div>

      <!-- Error / Not Found State -->
      <div *ngIf="!isLoading && (!event || errorMessage)" class="max-w-2xl mx-auto px-4 py-20 text-center">
        <div class="text-5xl mb-4">📅</div>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h2>
        <p class="text-gray-600 mb-6">{{ errorMessage || 'We could not locate this event. It may have been updated or removed.' }}</p>
        <a
          routerLink="/events"
          class="inline-block bg-orange-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-orange-700 shadow-sm transition"
        >
          Explore All Events
        </a>
      </div>

      <!-- Event Details Content -->
      <div *ngIf="!isLoading && event" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <!-- Hero Header -->
        <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-8">
          <div class="grid lg:grid-cols-12 gap-0">
            <!-- Left / Top: Event Image -->
            <div class="lg:col-span-5 relative bg-gradient-to-br from-orange-100 via-amber-50 to-orange-50 aspect-[16/10] lg:aspect-auto min-h-[260px] lg:min-h-full overflow-hidden">
              <img
                *ngIf="event.imageUrl && !imageFailed"
                [src]="resolveImageUrl(event.imageUrl)"
                [alt]="event.title"
                class="w-full h-full object-cover"
                (error)="imageFailed = true"
              />
              <div
                *ngIf="!event.imageUrl || imageFailed"
                class="w-full h-full flex flex-col items-center justify-center p-8 text-orange-400"
              >
                <span class="text-6xl mb-2">🪔</span>
                <span class="text-sm font-semibold uppercase tracking-wider text-orange-700">Sanatan Community Event</span>
              </div>
              <!-- Status Badge -->
              <span
                class="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-md"
                [ngClass]="{
                  'bg-emerald-600 text-white': event.status === 'Approved',
                  'bg-amber-500 text-white': event.status === 'Pending',
                  'bg-red-600 text-white': event.status === 'Rejected' || event.status === 'Cancelled'
                }"
              >
                {{ event.status }}
              </span>
            </div>

            <!-- Right: Event Title, Badges & Action Bar -->
            <div class="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <!-- Category and Host Badges -->
                <div class="flex flex-wrap items-center gap-2 mb-3">
                  <span class="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                    {{ event.category }}
                  </span>
                  <span *ngIf="event.communityName" class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <span>👥</span>
                    <span>Host: {{ event.communityName }}</span>
                  </span>
                  <span *ngIf="isPastEvent()" class="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full text-xs font-medium">
                    Past Event
                  </span>
                </div>

                <!-- Event Title -->
                <h1 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
                  {{ event.title }}
                </h1>

                <!-- Key Meta Quick Facts -->
                <div class="space-y-2.5 text-sm sm:text-base text-gray-700 mb-6">
                  <div class="flex items-center gap-2.5 text-orange-700 font-semibold">
                    <span class="text-lg">📅</span>
                    <span>{{ getFormattedDate() }}</span>
                  </div>
                  <div class="flex items-center gap-2.5 text-gray-600">
                    <span class="text-lg">🕐</span>
                    <span>{{ event.startTime }}{{ event.endTime ? ' - ' + event.endTime : '' }}</span>
                  </div>
                  <div class="flex items-start gap-2.5 text-gray-600">
                    <span class="text-lg">📍</span>
                    <span>{{ getVenueDisplay() }}</span>
                  </div>
                  <div class="flex items-center gap-2.5 text-gray-600">
                    <span class="text-lg">👥</span>
                    <span><strong>{{ event.attendees }}</strong> devotees attending</span>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="pt-4 border-t border-gray-100 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  [disabled]="event.joined"
                  (click)="joinEvent()"
                  [ngClass]="{
                    'bg-gray-400 text-white cursor-not-allowed': event.joined,
                    'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-md hover:shadow-lg': !event.joined
                  }"
                  class="px-6 py-3 rounded-xl font-bold text-sm sm:text-base transition-all duration-200 inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>{{ event.joined ? '✓ Already Joined' : 'Join Event' }}</span>
                </button>

                <button
                  type="button"
                  (click)="showQrModal = true"
                  class="px-4 py-3 rounded-xl border border-orange-200 bg-orange-50 hover:bg-orange-100 text-orange-700 font-semibold text-sm inline-flex items-center gap-2 transition cursor-pointer"
                >
                  <svg class="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path>
                  </svg>
                  <span>QR Code</span>
                </button>

                <button
                  type="button"
                  (click)="shareEvent()"
                  class="px-4 py-3 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium text-sm inline-flex items-center gap-2 transition cursor-pointer"
                >
                  <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="18" cy="5" r="3"></circle>
                    <circle cx="6" cy="12" r="3"></circle>
                    <circle cx="18" cy="19" r="3"></circle>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                  </svg>
                  <span>Share</span>
                </button>

                <a
                  *ngIf="isAdmin"
                  [routerLink]="['/admin/events/edit', event.id]"
                  class="px-4 py-3 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800 font-semibold text-sm transition"
                >
                  ✏️ Edit (Admin)
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Detailed Information Grid -->
        <div class="grid lg:grid-cols-3 gap-8">
          <!-- Left 2 Cols: Description & Program Information -->
          <div class="lg:col-span-2 space-y-8">
            <!-- Description Card -->
            <div class="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
              <h2 class="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                <span>📖</span>
                <span>About this Event</span>
              </h2>
              <div class="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                {{ event.description || 'No detailed description provided for this event.' }}
              </div>
            </div>

            <!-- Schedule & Timing Card -->
            <div class="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
              <h2 class="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                <span>⏰</span>
                <span>Date &amp; Schedule Details</span>
              </h2>
              <div class="grid sm:grid-cols-2 gap-4 text-sm">
                <div class="p-4 bg-orange-50/60 rounded-xl border border-orange-100">
                  <div class="font-bold text-orange-950 mb-1">Event Date</div>
                  <div class="text-gray-700">{{ getFormattedDate() }}</div>
                  <div *ngIf="event.multiDay" class="text-xs text-orange-700 mt-1 font-medium">✨ Multi-day celebration</div>
                </div>
                <div class="p-4 bg-orange-50/60 rounded-xl border border-orange-100">
                  <div class="font-bold text-orange-950 mb-1">Timing</div>
                  <div class="text-gray-700">{{ event.startTime }}{{ event.endTime ? ' to ' + event.endTime : '' }}</div>
                  <div *ngIf="event.recurring" class="text-xs text-orange-700 mt-1 font-medium">🔁 Recurring: {{ event.frequency || 'Regular' }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Col: Temple, Venue, Host & Organizer Cards -->
          <div class="space-y-6">
            <!-- Temple / Mandir Card -->
            <div class="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 class="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                <span>🕉️</span>
                <span>Mandir / Temple</span>
              </h3>
              <div class="space-y-3">
                <div>
                  <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Temple Name</div>
                  <div class="text-base font-bold text-gray-900">{{ event.templeName || event.temple?.mandir_name || 'Sanatan Mandir' }}</div>
                </div>
                <div *ngIf="event.hallName">
                  <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Prayer Hall / Room</div>
                  <div class="text-sm text-gray-800 font-medium">{{ event.hallName }}</div>
                </div>
                <div *ngIf="event.address || event.temple?.full_address">
                  <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Address</div>
                  <div class="text-sm text-gray-700">{{ event.address || event.temple?.full_address }}</div>
                </div>
                <div class="pt-2 flex flex-col gap-2">
                  <a
                    *ngIf="event.templeId"
                    [routerLink]="['/temples/view-temple', event.temple?.publicId || event.templeId]"
                    class="w-full text-center py-2 px-3 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-bold transition border border-orange-200"
                  >
                    View Temple Details →
                  </a>
                  <a
                    *ngIf="getDirectionsUrl()"
                    [href]="getDirectionsUrl()"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="w-full text-center py-2 px-3 rounded-lg bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold transition border border-gray-300 inline-flex items-center justify-center gap-1.5"
                  >
                    <span>🗺️</span>
                    <span>Get Directions in Maps</span>
                  </a>
                  <a
                    *ngIf="event.onlineLink"
                    [href]="event.onlineLink"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="w-full text-center py-2 px-3 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold transition border border-blue-200 inline-flex items-center justify-center gap-1.5"
                  >
                    <span>🌐</span>
                    <span>Join Online Meeting</span>
                  </a>
                </div>
              </div>
            </div>

            <!-- Host Community Group Card -->
            <div *ngIf="event.communityName || event.communityGroup" class="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 class="text-lg font-bold text-gray-900 mb-3 pb-2 border-b border-gray-100 flex items-center gap-2">
                <span>👥</span>
                <span>Host Community Group</span>
              </h3>
              <p class="text-base font-bold text-orange-950 mb-1">
                {{ event.communityName || event.communityGroup?.name }}
              </p>
              <p *ngIf="event.communityGroup?.cityName" class="text-xs text-gray-500">
                📍 {{ event.communityGroup?.cityName }}
              </p>
              <a
                routerLink="/community"
                class="inline-block mt-3 text-xs font-semibold text-orange-600 hover:text-orange-700 hover:underline"
              >
                Explore Community Groups →
              </a>
            </div>

            <!-- Organizer & Submission Card -->
            <div class="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm text-sm space-y-3">
              <h3 class="text-lg font-bold text-gray-900 pb-2 border-b border-gray-100 flex items-center gap-2">
                <span>👤</span>
                <span>Organizer &amp; Status</span>
              </h3>
              <div>
                <span class="text-xs text-gray-500 block font-semibold uppercase tracking-wider">Submitted By</span>
                <span class="font-medium text-gray-800">{{ event.organizer?.username || 'Community Member' }}</span>
              </div>
              <div>
                <span class="text-xs text-gray-500 block font-semibold uppercase tracking-wider">Verification Status</span>
                <span class="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full"
                  [ngClass]="{
                    'bg-emerald-100 text-emerald-800': event.status === 'Approved',
                    'bg-amber-100 text-amber-800': event.status === 'Pending',
                    'bg-red-100 text-red-800': event.status === 'Rejected'
                  }">
                  {{ event.status === 'Approved' ? '✓ Verified & Approved' : event.status }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class EventDetailComponent implements OnInit {
  private readonly apiUrl = environment.apiBaseUrl;
  event: EventDetail | null = null;
  isLoading = true;
  errorMessage = '';
  imageFailed = false;
  showQrModal = false;
  showToastMessage = false;
  toastMessageText = '';
  toastMessageType: 'success' | 'error' | 'info' = 'success';
  isAdmin = false;

  private joinedEventIds: Set<string> = new Set();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
    private titleService: Title
  ) {
    this.isAdmin = this.authService.isAdmin();
    this.joinedEventIds = this.loadJoinedEventIds();
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadEvent(id);
    } else {
      this.isLoading = false;
      this.errorMessage = 'No event ID was provided.';
    }
  }

  loadEvent(id: string): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.http.get<any>(`${this.apiUrl}/event/${id}`).subscribe({
      next: (response) => {
        const raw = response?.data || response;
        if (!raw) {
          this.errorMessage = 'Event not found.';
          this.isLoading = false;
          return;
        }

        const idStr = String(raw.id);
        this.event = {
          ...raw,
          id: idStr,
          joined: this.joinedEventIds.has(idStr),
          attendees: raw.attendees ?? 0,
        };

        if (this.event?.title) {
          this.titleService.setTitle(`${this.event.title} | Sanatan New Zealand`);
        }

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading event detail:', err);
        this.errorMessage = err?.error?.message || 'Unable to load event details.';
        this.isLoading = false;
      },
    });
  }

  getFormattedDate(): string {
    if (!this.event?.eventDate) return 'Date TBA';
    try {
      const parts = String(this.event.eventDate).split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        const d = new Date(year, month, day);
        const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        const formatted = d.toLocaleDateString('en-NZ', options);

        if (this.event.multiDay && this.event.endDate) {
          const endParts = String(this.event.endDate).split('-');
          if (endParts.length === 3) {
            const endD = new Date(parseInt(endParts[0], 10), parseInt(endParts[1], 10) - 1, parseInt(endParts[2], 10));
            return `${formatted} – ${endD.toLocaleDateString('en-NZ', options)}`;
          }
        }
        return formatted;
      }
    } catch {}
    return this.event.eventDate;
  }

  getVenueDisplay(): string {
    if (!this.event) return '';
    const templeName = this.event.templeName || this.event.temple?.mandir_name || '';
    const hall = this.event.hallName;
    const address = this.event.address || this.event.temple?.full_address || '';

    if (templeName && hall) {
      return `${templeName} (${hall})`;
    }
    if (templeName) {
      return address ? `${templeName}, ${address}` : templeName;
    }
    return address || 'New Zealand';
  }

  getDirectionsUrl(): string {
    if (!this.event) return '';
    if (this.event.mapsLink) return this.event.mapsLink;
    const addr = this.event.address || this.event.temple?.full_address || this.event.templeName || '';
    return addr ? `https://maps.google.com/?q=${encodeURIComponent(addr)}` : '';
  }

  isPastEvent(): boolean {
    if (!this.event?.eventDate) return false;
    const dateToCheck = this.event.endDate || this.event.eventDate;
    const eventDate = new Date(dateToCheck.slice(0, 10));
    return !Number.isNaN(eventDate.getTime()) && eventDate < new Date(new Date().toDateString());
  }

  joinEvent(): void {
    if (!this.event) return;
    if (this.event.joined || this.joinedEventIds.has(String(this.event.id))) {
      this.showToast(`You have already joined "${this.event.title}".`, 'info');
      return;
    }

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth/login-registeration-forget'], {
        queryParams: { returnUrl: `/events/${this.event.id}`, joinEvent: this.event.id, tab: 'register' },
      });
      return;
    }

    this.http.post<any>(`${this.apiUrl}/event/${this.event.id}/join`, {}).subscribe({
      next: (response) => {
        if (!this.event) return;
        this.event.joined = true;
        if (response?.data?.attendees !== undefined) {
          this.event.attendees = response.data.attendees;
        } else {
          this.event.attendees += 1;
        }
        this.joinedEventIds.add(String(this.event.id));
        this.saveJoinedEventIds();
        this.showToast(response?.message || `Successfully joined "${this.event.title}"! See you there.`, 'success');
      },
      error: (err) => {
        if (err?.status === 401) {
          this.router.navigate(['/auth/login-registeration-forget'], {
            queryParams: { returnUrl: `/events/${this.event?.id}`, tab: 'register' },
          });
          return;
        }
        this.showToast(err?.error?.message || 'Failed to join event. Please try again.', 'error');
      },
    });
  }

  shareEvent(): void {
    const url = this.currentUrl;
    const title = this.event?.title || 'Sanatan Event';
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({ title, text: `Join ${title} on Sanatan New Zealand!`, url }).catch(() => {});
    } else {
      this.copyLink();
    }
  }

  copyLink(): void {
    const url = this.currentUrl;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        this.showToast('Event link copied to clipboard!', 'success');
      }).catch(() => {
        this.showToast('Link: ' + url, 'info');
      });
    } else {
      this.showToast('Link: ' + url, 'info');
    }
  }

  get currentUrl(): string {
    if (typeof window !== 'undefined') {
      return window.location.href;
    }
    return `https://sanatan.org.nz/events/${this.event?.id || ''}`;
  }

  get qrCodeUrl(): string {
    const joinUrl = this.currentUrl;
    return `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&data=${encodeURIComponent(joinUrl)}`;
  }

  private showToast(message: string, type: 'success' | 'error' | 'info' = 'success'): void {
    this.toastMessageText = message;
    this.toastMessageType = type;
    this.showToastMessage = true;
    setTimeout(() => {
      this.showToastMessage = false;
    }, 3500);
  }

  resolveImageUrl(url: string | null | undefined): string {
    if (!url) return '';
    if (/^https?:\/\//i.test(url)) return url;
    const clean = url.replace(/\\/g, '/').replace(/^\/+/, '');
    const backendOrigin = environment.apiBaseUrl.replace(/\/api(\/v\d+)?(\/public)?\/?$/, '');
    return `${backendOrigin}/${clean}`;
  }

  private getStorageKey(): string {
    const user = this.authService.getUserData();
    const userKey = user?.id ? `user_${user.id}` : user?.username ? `user_${user.username}` : 'guest';
    return `sanatan-joined-events-${userKey}`;
  }

  private loadJoinedEventIds(): Set<string> {
    if (typeof localStorage === 'undefined') {
      return new Set<string>();
    }
    try {
      const storedIds = JSON.parse(localStorage.getItem(this.getStorageKey()) ?? '[]');
      return new Set(Array.isArray(storedIds) ? storedIds : []);
    } catch {
      return new Set<string>();
    }
  }

  private saveJoinedEventIds(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.getStorageKey(), JSON.stringify([...this.joinedEventIds]));
    }
  }
}
