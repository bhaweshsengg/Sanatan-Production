import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../Auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface CommunityEvent {
  id: string;
  title: string;
  venue: string;
  category: string;
  categoryClass: string;
  date: string;
  time: string;
  attendees: number;
  joined: boolean;
  isCreated?: boolean;
}

@Component({
  selector: 'app-events',
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

    <!-- Delete Confirmation Dialog -->
    <div *ngIf="eventToDelete" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div class="w-full max-w-md rounded-lg bg-white p-6 shadow-xl border border-gray-200">
        <h3 class="text-lg font-bold text-gray-900 mb-2">Delete Event</h3>
        <p class="text-sm text-gray-600 mb-6">
          Are you sure you want to permanently delete <strong>"{{ eventToDelete.title }}"</strong>? This action cannot be undone and will permanently remove this event from all event listings and temple pages.
        </p>
        <div class="flex justify-end gap-3">
          <button
            type="button"
            (click)="eventToDelete = null"
            [disabled]="isDeleting"
            class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            (click)="deleteConfirmed()"
            [disabled]="isDeleting"
            class="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
          >
            {{ isDeleting ? 'Deleting...' : 'Delete Event' }}
          </button>
        </div>
      </div>
    </div>

    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <span
            class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 mb-4"
          >
            📅 Community Gatherings
          </span>
          <h2 class="text-4xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
          <p class="text-xl text-black-700 max-w-3xl mx-auto">
            Join our vibrant community in celebrating festivals, attending
            satsangs, and participating in spiritual activities across New
            Zealand.
          </p>
        </div>

        <section class="mb-12" aria-labelledby="upcoming-events-heading">
          <h2 id="upcoming-events-heading" class="mb-6 text-2xl font-bold text-gray-900">Upcoming Events</h2>
          <div class="grid md:grid-cols-3 gap-8">
            <div
              *ngFor="let event of upcomingEvents"
              class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow flex flex-col justify-between"
            >
              <div>
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-xl font-bold text-gray-900">{{ event.title }}</h3>
                  <span [class]="event.categoryClass">{{ event.category }}</span>
                </div>
                <p class="text-black-700 mb-4">{{ event.venue }}</p>

                <div class="space-y-2 mb-6">
                  <div class="flex items-center text-black-700">
                    <span class="mr-2">📅</span>
                    <span>{{ event.date }}</span>
                  </div>
                  <div class="flex items-center text-black-700">
                    <span class="mr-2">🕐</span>
                    <span>{{ event.time }}</span>
                  </div>
                  <div class="flex items-center text-black-700">
                    <span class="mr-2">👥</span>
                    <span>{{ event.attendees }} attending</span>
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="button"
                  [disabled]="event.joined"
                  [attr.aria-label]="event.joined ? 'Joined ' + event.title : 'Join ' + event.title"
                  [class.bg-gray-400]="event.joined"
                  [class.cursor-not-allowed]="event.joined"
                  [class.bg-orange-600]="!event.joined"
                  [class.hover:bg-orange-700]="!event.joined"
                  class="w-full text-white py-3 rounded-lg font-medium transition-colors"
                  (click)="joinEvent(event)"
                >
                  {{ event.joined ? '✓ Joined' : 'Join Event' }}
                </button>
                <button
                  type="button"
                  (click)="openQrModal(event)"
                  class="w-full mt-2 border border-orange-200 bg-orange-50/90 hover:bg-orange-100 text-orange-700 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <svg class="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path>
                  </svg>
                  <span>Scan to Join / QR Code</span>
                </button>
                <button
                  *ngIf="isAdmin"
                  type="button"
                  class="w-full mt-2 border border-red-300 text-red-700 py-2 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
                  (click)="confirmDeleteEvent(event)"
                >
                  Delete Event
                </button>
                <a
                  *ngIf="isAdmin"
                  routerLink="/admin/events"
                  class="block text-center mt-2 text-xs font-semibold text-orange-600 hover:text-orange-700 hover:underline"
                >
                  👥 View Attendees in Admin →
                </a>
              </div>
            </div>
          </div>
          <p *ngIf="!upcomingEvents.length" class="rounded-lg border border-dashed p-6 text-center text-gray-600">No upcoming events are available.</p>
        </section>

        <section class="mb-12 border-t border-gray-200 pt-10" aria-labelledby="past-events-heading">
          <h2 id="past-events-heading" class="mb-6 text-2xl font-bold text-gray-900">Past Events</h2>
          <div class="grid md:grid-cols-3 gap-8">
            <div *ngFor="let event of pastEvents" class="bg-gray-50 border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-xl font-bold text-gray-900">{{ event.title }}</h3>
                  <span [class]="event.categoryClass">{{ event.category }}</span>
                </div>
                <p class="text-black-700 mb-4">{{ event.venue }}</p>
                <div class="space-y-2 text-black-700">
                  <div>📅 {{ event.date }}</div>
                  <div>🕐 {{ event.time }}</div>
                  <div>👥 {{ event.attendees }} attending</div>
                </div>
              </div>
              <div class="mt-4 flex flex-col gap-2">
                <button
                  type="button"
                  (click)="openQrModal(event)"
                  class="w-full border border-gray-200 bg-white hover:bg-gray-100 text-gray-700 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <svg class="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path>
                  </svg>
                  <span>Event QR Code</span>
                </button>
                <button
                  *ngIf="isAdmin"
                  type="button"
                  class="w-full border border-red-300 text-red-700 py-2 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
                  (click)="confirmDeleteEvent(event)"
                >
                  Delete Event
                </button>
              </div>
            </div>
          </div>
          <p *ngIf="!pastEvents.length" class="rounded-lg border border-dashed p-6 text-center text-gray-600">No past events are available.</p>
        </section>

        <section class="border-t border-gray-200 pt-10 mb-12" aria-labelledby="joined-events-heading">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 id="joined-events-heading" class="text-2xl font-bold text-gray-900">My Joined Events</h2>
              <p class="text-gray-600 mt-1">Events you have joined are managed here.</p>
            </div>
            <span class="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
              {{ joinedEvents.length }} joined
            </span>
          </div>

          <div *ngIf="joinedEvents.length; else noJoinedEvents" class="space-y-3">
            <div *ngFor="let event of joinedEvents" class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div>
                <h3 class="font-semibold text-gray-900">{{ event.title }}</h3>
                <p class="text-sm text-gray-600">{{ event.date }} · {{ event.time }} · {{ event.venue }}</p>
              </div>
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  class="border border-orange-200 bg-white text-orange-700 px-3 py-2 rounded-md text-xs font-semibold hover:bg-orange-50 flex items-center gap-1.5 transition-colors cursor-pointer"
                  (click)="openQrModal(event)"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path>
                  </svg>
                  <span>QR Code</span>
                </button>
                <button type="button" class="border border-red-300 text-red-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-red-50" (click)="leaveEvent(event)">
                  Leave Event
                </button>
              </div>
            </div>
          </div>
          <ng-template #noJoinedEvents>
            <div class="border border-dashed border-gray-300 rounded-lg p-6 text-center text-gray-600">
              You have not joined any events yet.
            </div>
          </ng-template>
        </section>

        <div class="text-center">
          <a
            routerLink="/events"
            class="border-2 border-orange-600 text-orange-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-orange-50"
          >
            View All Events →
          </a>
        </div>
        <section class="bg-orange-50 py-12 mt-10">
          <div class="max-w-4xl mx-auto text-center">
            <h2 class="text-xl font-semibold text-gray-800 mb-2">
              Organizing an event?
            </h2>
            <p class="text-black-700 mb-6">
              Share your Sanatan cultural events, festivals, or community
              gatherings with the wider community. Help bring people together
              through shared celebrations and learning.
            </p>
            <button
              routerLink="/events/add-event"
              class="bg-orange-600 text-white px-6 py-3 rounded-md hover:bg-orange-700"
            >
              + Create Event
            </button>
          </div>
        </section>
      </div>

      <!-- Event QR Code Join Modal -->
      <div
        *ngIf="selectedEventForQr"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
      >
        <div class="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-gray-200 overflow-hidden flex flex-col">
          <!-- Modal Header -->
          <div class="bg-gradient-to-r from-orange-600 via-red-600 to-amber-600 p-5 text-white flex items-center justify-between">
            <div>
              <span class="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white mb-1">
                {{ selectedEventForQr.category }}
              </span>
              <h3 class="text-lg font-bold leading-snug">{{ selectedEventForQr.title }}</h3>
            </div>
            <button
              type="button"
              (click)="closeQrModal()"
              class="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>

          <!-- Modal Body -->
          <div class="p-6 text-center space-y-4">
            <p class="text-xs text-gray-500">
              Scan this QR code with any smartphone camera to view details and instantly join this event.
            </p>

            <!-- QR Code Image Container -->
            <div class="inline-block p-3 bg-white rounded-2xl border-2 border-orange-200 shadow-inner">
              <img
                [src]="getQrCodeUrl(selectedEventForQr)"
                [alt]="'QR Code to join ' + selectedEventForQr.title"
                class="w-52 h-52 mx-auto rounded-lg object-contain"
              />
            </div>

            <!-- Event Quick Metadata -->
            <div class="bg-orange-50/70 border border-orange-100 rounded-xl p-3 text-xs text-gray-700 space-y-1 text-left">
              <div><strong>📍 Venue:</strong> {{ selectedEventForQr.venue }}</div>
              <div><strong>📅 Date &amp; Time:</strong> {{ selectedEventForQr.date }} at {{ selectedEventForQr.time }}</div>
              <div><strong>👥 Attendees:</strong> {{ selectedEventForQr.attendees }} attending</div>
            </div>

            <!-- Direct URL & Copy Button -->
            <div class="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs">
              <input
                type="text"
                readonly
                [value]="getJoinUrl(selectedEventForQr)"
                class="w-full bg-transparent text-gray-600 outline-none text-[11px] truncate"
              />
              <button
                type="button"
                (click)="copyJoinUrl(selectedEventForQr)"
                class="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-md shadow-xs transition-colors flex-shrink-0 cursor-pointer"
              >
                Copy Link
              </button>
            </div>

            <!-- Join Now / Close Actions -->
            <div class="pt-2 flex gap-3">
              <button
                type="button"
                (click)="closeQrModal()"
                class="flex-1 py-2.5 px-4 rounded-xl border border-gray-300 text-gray-700 font-medium text-xs hover:bg-gray-50 transition cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                *ngIf="!selectedEventForQr.joined"
                (click)="joinEvent(selectedEventForQr); closeQrModal()"
                class="flex-1 py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow transition cursor-pointer"
              >
                Join Event Now
              </button>
              <button
                type="button"
                *ngIf="selectedEventForQr.joined"
                disabled
                class="flex-1 py-2.5 px-4 rounded-xl bg-gray-100 text-gray-500 font-bold text-xs border border-gray-200 cursor-not-allowed"
              >
                ✓ Already Joined
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class EventsComponent implements OnInit {
  private readonly apiUrl = environment.apiBaseUrl;
  readonly isAdmin: boolean;
  private readonly authService: AuthService;

  // Notification Toast State
  showToastMessage = false;
  toastMessageText = '';
  toastMessageType: 'success' | 'error' | 'info' = 'success';

  // Deletion Modal State
  eventToDelete: CommunityEvent | null = null;
  isDeleting = false;

  // QR Code Modal State
  selectedEventForQr: CommunityEvent | null = null;

  private joinedEventIds: Set<string> = new Set();

  events: CommunityEvent[] = [];

  constructor(
    authService: AuthService,
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {
    this.authService = authService;
    const user = authService.getUserData();
    this.isAdmin = user?.role === 'Admin' || user?.role === 'Super Admin';
    this.joinedEventIds = this.loadJoinedEventIds();
  }

  get upcomingEvents(): CommunityEvent[] {
    return this.events.filter(event => !this.isPastEvent(event));
  }

  get pastEvents(): CommunityEvent[] {
    return this.events.filter(event => this.isPastEvent(event));
  }

  get joinedEvents(): CommunityEvent[] {
    return this.events.filter(event => event.joined);
  }

  ngOnInit(): void {
    this.joinedEventIds = this.loadJoinedEventIds();
    this.loadEvents();
    if (this.authService.isLoggedIn()) {
      this.loadMyJoinedEvents();
    }
  }

  loadEvents(): void {
    this.http.get<any>(`${this.apiUrl}/event`).subscribe({
      next: response => {
        const approvedEvents = Array.isArray(response?.data) ? response.data.map((event: any) => this.mapApiEvent(event)) : [];
        this.events = approvedEvents;
        this.joinEventFromLogin();
      },
      error: () => {
        this.events = [];
      },
    });
  }

  loadMyJoinedEvents(): void {
    this.http.get<any>(`${this.apiUrl}/event/my-joined`).subscribe({
      next: response => {
        if (Array.isArray(response?.data)) {
          response.data.forEach((id: string) => this.joinedEventIds.add(String(id)));
          this.saveJoinedEventIds();
          this.events.forEach(ev => {
            if (this.joinedEventIds.has(ev.id)) {
              ev.joined = true;
            }
          });
        }
      },
      error: () => {},
    });
  }

  joinEvent(event: CommunityEvent): void {
    if (!event) return;
    // Check if already joined (prevent duplicate registration)
    if (event.joined || this.joinedEventIds.has(event.id)) {
      this.showToast(`You have already joined "${event.title}".`, 'info');
      return;
    }

    // Redirect to registration page if not logged in
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth/login-registeration-forget'], {
        queryParams: { returnUrl: '/events', joinEvent: event.id, tab: 'register' },
      });
      return;
    }

    this.http.post<any>(`${this.apiUrl}/event/${event.id}/join`, {}).subscribe({
      next: (response) => {
        event.joined = true;
        if (response?.data?.attendees !== undefined) {
          event.attendees = response.data.attendees;
        } else {
          event.attendees += 1;
        }
        this.joinedEventIds.add(event.id);
        this.saveJoinedEventIds();
        this.showToast(response?.message || `Successfully joined "${event.title}"! See you there.`, 'success');
      },
      error: (err) => {
        if (err?.status === 401) {
          this.router.navigate(['/auth/login-registeration-forget'], {
            queryParams: { returnUrl: '/events', joinEvent: event.id, tab: 'register' },
          });
          return;
        }
        this.showToast(err?.error?.message || 'Failed to join event. Please try again.', 'error');
      },
    });
  }

  leaveEvent(event: CommunityEvent): void {
    if (!event.joined) {
      return;
    }

    this.http.post<any>(`${this.apiUrl}/event/${event.id}/leave`, {}).subscribe({
      next: (response) => {
        event.joined = false;
        if (response?.data?.attendees !== undefined) {
          event.attendees = response.data.attendees;
        } else {
          event.attendees = Math.max(0, event.attendees - 1);
        }
        this.joinedEventIds.delete(event.id);
        this.saveJoinedEventIds();
        this.showToast(response?.message || `You have left "${event.title}".`, 'info');
      },
      error: (err) => {
        this.showToast(err?.error?.message || 'Failed to leave event. Please try again.', 'error');
      },
    });
  }

  confirmDeleteEvent(event: CommunityEvent): void {
    this.eventToDelete = event;
  }

  deleteConfirmed(): void {
    if (!this.eventToDelete) return;
    this.isDeleting = true;
    const id = this.eventToDelete.id;
    const title = this.eventToDelete.title;

    this.http.delete(`${this.apiUrl}/event/${id}`).subscribe({
      next: () => {
        this.events = this.events.filter(currentEvent => currentEvent.id !== id);
        this.joinedEventIds.delete(id);
        this.saveJoinedEventIds();
        this.isDeleting = false;
        this.eventToDelete = null;
        this.showToast(`Event "${title}" has been permanently deleted.`, 'success');
      },
      error: (error) => {
        this.isDeleting = false;
        this.eventToDelete = null;
        this.showToast(error?.error?.message || 'Failed to delete event.', 'error');
      }
    });
  }

  private showToast(message: string, type: 'success' | 'error' | 'info' = 'success'): void {
    this.toastMessageText = message;
    this.toastMessageType = type;
    this.showToastMessage = true;
    setTimeout(() => {
      this.showToastMessage = false;
    }, 3500);
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

  private mapApiEvent(event: any): CommunityEvent {
    const idStr = String(event.id);
    return {
      id: idStr,
      title: event.title,
      venue: event.hallName ? `${event.templeName} - ${event.hallName}` : event.templeName,
      category: event.category,
      categoryClass: 'bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm font-medium',
      date: event.multiDay ? `${event.eventDate} - ${event.endDate}` : event.eventDate,
      time: `${event.startTime} - ${event.endTime}`,
      attendees: event.attendees ?? 0,
      joined: this.joinedEventIds.has(idStr),
    };
  }

  private isPastEvent(event: CommunityEvent): boolean {
    const eventDate = new Date(event.date.slice(0, 10));
    return !Number.isNaN(eventDate.getTime()) && eventDate < new Date(new Date().toDateString());
  }

  private joinEventFromLogin(): void {
    const eventId = this.route.snapshot.queryParamMap.get('joinEvent');
    if (!eventId || !this.authService.isLoggedIn()) return;

    const event = this.events.find(currentEvent => currentEvent.id === eventId);
    if (event) {
      this.joinEvent(event);
      this.router.navigate(['/events'], { replaceUrl: true });
    }
  }

  openQrModal(event: CommunityEvent): void {
    this.selectedEventForQr = event;
  }

  closeQrModal(): void {
    this.selectedEventForQr = null;
  }

  getJoinUrl(event: CommunityEvent): string {
    if (!event) return '';
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://sanatan.org.nz';
    return `${origin}/events?joinEvent=${encodeURIComponent(event.id)}`;
  }

  getQrCodeUrl(event: CommunityEvent): string {
    const joinUrl = this.getJoinUrl(event);
    return `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&data=${encodeURIComponent(joinUrl)}`;
  }

  copyJoinUrl(event: CommunityEvent): void {
    const joinUrl = this.getJoinUrl(event);
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(joinUrl).then(() => {
        this.showToast('Event join link copied to clipboard!', 'success');
      }).catch(() => {
        this.showToast('Link: ' + joinUrl, 'info');
      });
    } else {
      this.showToast('Link: ' + joinUrl, 'info');
    }
  }
}
