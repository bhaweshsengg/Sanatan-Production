import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { environment } from '../../../../environments/environment';

interface AdminEvent {
  id: number;
  title: string;
  category: string;
  description: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  templeName: string;
  attendees?: number;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Cancelled' | 'Completed';
  organizer?: { username: string; email?: string };
}

interface EventAttendeeDetail {
  id: number;
  userId: number;
  name: string;
  email: string;
  role: string;
  joinedAt: string;
}

@Component({
  selector: 'app-event-admin',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <main class="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-7xl">
        <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p class="text-sm font-semibold uppercase tracking-wide text-orange-600">Admin</p>
            <h1 class="mt-2 text-3xl font-bold text-gray-900">Event Management</h1>
            <p class="mt-2 text-gray-600">Review submissions, approve events, edit event details, manage attendees, and delete events.</p>
          </div>
          <a routerLink="/business/admin/business-submissions" class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Business &amp; Temple Admin</a>
        </div>

        <div *ngIf="successMessage" class="mb-6 rounded-md bg-green-50 p-4 text-green-700 border border-green-200">{{ successMessage }}</div>
        <div *ngIf="errorMessage" class="mb-6 rounded-md bg-red-50 p-4 text-red-700">{{ errorMessage }}</div>
        <div *ngIf="loading" class="rounded-lg bg-white p-8 text-center text-gray-600 shadow-sm">Loading event submissions...</div>

        <div *ngIf="!loading" class="overflow-hidden rounded-lg border bg-white shadow-sm">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">Event</th>
                  <th class="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">Organizer</th>
                  <th class="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">Schedule</th>
                  <th class="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">Attendees</th>
                  <th class="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">Status</th>
                  <th class="px-6 py-3 text-right text-xs font-semibold uppercase text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr *ngFor="let event of events">
                  <td class="px-6 py-4">
                    <div class="font-semibold text-gray-900">{{ event.title }}</div>
                    <div class="text-sm text-gray-500">{{ event.category }} · {{ event.templeName }}</div>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-700">{{ event.organizer?.username || 'Unknown' }}</td>
                  <td class="px-6 py-4 text-sm text-gray-700">{{ event.eventDate }}<br>{{ event.startTime }} - {{ event.endTime }}</td>
                  <td class="px-6 py-4">
                    <button
                      type="button"
                      (click)="viewAttendees(event)"
                      class="inline-flex items-center gap-1.5 rounded-md border border-orange-200 bg-orange-50 px-2.5 py-1.5 text-xs font-semibold text-orange-800 hover:bg-orange-100 transition-colors shadow-sm"
                      title="Click to view attendee details"
                    >
                      <span>👥</span>
                      <span>{{ event.attendees ?? 0 }} Joined</span>
                      <span class="text-orange-500">→</span>
                    </button>
                  </td>
                  <td class="px-6 py-4"><span class="rounded-full px-2.5 py-1 text-xs font-semibold" [ngClass]="statusClass(event.status)">{{ event.status }}</span></td>
                  <td class="px-6 py-4">
                    <div class="flex justify-end gap-2">
                      <button *ngIf="event.status === 'Pending'" (click)="updateStatus(event, 'Approved')" class="rounded-md bg-green-600 px-3 py-2 text-xs font-semibold text-white hover:bg-green-700">Approve</button>
                      <button *ngIf="event.status === 'Pending'" (click)="updateStatus(event, 'Rejected')" class="rounded-md bg-yellow-600 px-3 py-2 text-xs font-semibold text-white hover:bg-yellow-700">Reject</button>
                      <a [routerLink]="['/admin/events/edit', event.id]" class="rounded-md border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50">Edit</a>
                      <button type="button" (click)="confirmDelete(event)" class="rounded-md bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700">Delete</button>
                    </div>
                  </td>
                </tr>
                <tr *ngIf="events.length === 0"><td colspan="6" class="px-6 py-10 text-center text-gray-500">No event submissions found.</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- View Attendees Modal -->
        <div *ngIf="selectedEventForAttendees" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div class="w-full max-w-2xl rounded-xl bg-white p-6 shadow-2xl border border-gray-200 max-h-[90vh] flex flex-col">
            <div class="flex items-center justify-between pb-4 border-b border-gray-200">
              <div>
                <div class="flex items-center gap-2">
                  <h3 class="text-xl font-bold text-gray-900">Event Attendees</h3>
                  <span class="rounded-full bg-orange-100 text-orange-800 px-2.5 py-0.5 text-xs font-semibold">
                    {{ attendeeList.length }} Total
                  </span>
                </div>
                <p class="text-sm text-gray-600 mt-1">
                  <strong>{{ selectedEventForAttendees.title }}</strong> · {{ selectedEventForAttendees.eventDate }} ({{ selectedEventForAttendees.startTime }} - {{ selectedEventForAttendees.endTime }})
                </p>
              </div>
              <button
                type="button"
                (click)="closeAttendeesModal()"
                class="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
                title="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Modal Content -->
            <div class="flex-1 overflow-y-auto py-4">
              <div *ngIf="loadingAttendees" class="py-12 text-center text-gray-500">
                <div class="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-orange-600 border-r-transparent mb-2"></div>
                <p>Loading attendees list...</p>
              </div>

              <div *ngIf="attendeesError" class="rounded-md bg-red-50 p-4 text-sm text-red-700 border border-red-200">
                {{ attendeesError }}
              </div>

              <div *ngIf="!loadingAttendees && !attendeesError">
                <div *ngIf="attendeeList.length === 0" class="py-12 text-center text-gray-500 rounded-lg border border-dashed border-gray-200">
                  <p class="text-3xl mb-2">👥</p>
                  <p class="font-medium text-gray-800">No attendees have joined this event yet.</p>
                  <p class="text-xs text-gray-400 mt-1">When users click "Join Event", their details will appear here.</p>
                </div>

                <div *ngIf="attendeeList.length > 0" class="overflow-x-auto rounded-lg border border-gray-200">
                  <table class="min-w-full divide-y divide-gray-200 text-sm">
                    <thead class="bg-gray-50 text-xs font-semibold uppercase text-gray-500">
                      <tr>
                        <th class="px-4 py-2.5 text-left">#</th>
                        <th class="px-4 py-2.5 text-left">User Name</th>
                        <th class="px-4 py-2.5 text-left">Email</th>
                        <th class="px-4 py-2.5 text-left">Role</th>
                        <th class="px-4 py-2.5 text-left">Joined Date &amp; Time</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100 bg-white">
                      <tr *ngFor="let attendee of attendeeList; let i = index" class="hover:bg-gray-50">
                        <td class="px-4 py-3 text-gray-400 font-mono text-xs">{{ i + 1 }}</td>
                        <td class="px-4 py-3 font-medium text-gray-900">
                          <div class="flex items-center gap-2">
                            <div class="w-7 h-7 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-xs uppercase">
                              {{ (attendee.name || 'U').charAt(0) }}
                            </div>
                            <span>{{ attendee.name }}</span>
                          </div>
                        </td>
                        <td class="px-4 py-3 text-gray-600">{{ attendee.email }}</td>
                        <td class="px-4 py-3">
                          <span class="inline-flex items-center rounded px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-800">
                            {{ attendee.role }}
                          </span>
                        </td>
                        <td class="px-4 py-3 text-gray-500 text-xs">
                          {{ attendee.joinedAt | date:'medium' }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="pt-4 border-t border-gray-200 flex justify-between items-center">
              <span class="text-xs text-gray-500">
                {{ attendeeList.length }} attendee{{ attendeeList.length === 1 ? '' : 's' }} recorded
              </span>
              <button
                type="button"
                (click)="closeAttendeesModal()"
                class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <div *ngIf="eventToDelete" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div class="w-full max-w-md rounded-lg bg-white p-6 shadow-xl border border-gray-200">
            <h3 class="text-lg font-bold text-gray-900 mb-2">Delete Event</h3>
            <p class="text-sm text-gray-600 mb-6">
              Are you sure you want to permanently delete <strong>"{{ eventToDelete.title }}"</strong>? This action cannot be undone and will permanently remove this event from all event listings and temple details.
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
      </div>
    </main>
  `,
})
export class EventAdminComponent implements OnInit {
  private readonly apiUrl = environment.apiBaseUrl;
  events: AdminEvent[] = [];
  loading = true;
  errorMessage = '';
  successMessage = '';

  eventToDelete: AdminEvent | null = null;
  isDeleting = false;

  selectedEventForAttendees: AdminEvent | null = null;
  attendeeList: EventAttendeeDetail[] = [];
  loadingAttendees = false;
  attendeesError = '';

  constructor(private readonly http: HttpClient) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.loading = true;
    this.http.get<any>(`${this.apiUrl}/event/admin`).subscribe({
      next: response => { this.events = response?.data ?? []; this.loading = false; },
      error: error => { this.errorMessage = error?.error?.message || 'Could not load events.'; this.loading = false; },
    });
  }

  viewAttendees(event: AdminEvent): void {
    this.selectedEventForAttendees = event;
    this.attendeeList = [];
    this.attendeesError = '';
    this.loadingAttendees = true;

    this.http.get<any>(`${this.apiUrl}/event/admin/${event.id}/attendees`).subscribe({
      next: (response) => {
        this.attendeeList = response?.data?.attendees || [];
        this.loadingAttendees = false;
      },
      error: (error) => {
        this.attendeesError = error?.error?.message || 'Could not load event attendees.';
        this.loadingAttendees = false;
      }
    });
  }

  closeAttendeesModal(): void {
    this.selectedEventForAttendees = null;
    this.attendeeList = [];
    this.attendeesError = '';
  }

  updateStatus(event: AdminEvent, status: 'Approved' | 'Rejected'): void {
    this.http.patch(`${this.apiUrl}/event/${event.id}/status`, { status }).subscribe({
      next: () => { event.status = status; },
      error: error => { this.errorMessage = error?.error?.message || 'Could not update event status.'; },
    });
  }

  confirmDelete(event: AdminEvent): void {
    this.eventToDelete = event;
  }

  deleteConfirmed(): void {
    if (!this.eventToDelete) return;
    this.isDeleting = true;
    const id = this.eventToDelete.id;
    const title = this.eventToDelete.title;

    this.http.delete(`${this.apiUrl}/event/${id}`).subscribe({
      next: () => {
        this.events = this.events.filter(e => e.id !== id);
        this.isDeleting = false;
        this.eventToDelete = null;
        this.successMessage = `Event "${title}" has been permanently deleted.`;
        setTimeout(() => { this.successMessage = ''; }, 4000);
      },
      error: error => {
        this.isDeleting = false;
        this.errorMessage = error?.error?.message || 'Could not delete event.';
        this.eventToDelete = null;
      }
    });
  }

  statusClass(status: AdminEvent['status']): string {
    return status === 'Approved' ? 'bg-green-100 text-green-800' : status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800';
  }
}
