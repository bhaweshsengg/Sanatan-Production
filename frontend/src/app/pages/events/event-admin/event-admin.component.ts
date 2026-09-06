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
  status: 'Pending' | 'Approved' | 'Rejected' | 'Cancelled' | 'Completed';
  organizer?: { username: string; email?: string };
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
            <p class="mt-2 text-gray-600">Review submissions, approve events, and edit event details.</p>
          </div>
          <a routerLink="/business/admin/business-submissions" class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Business &amp; Temple Admin</a>
        </div>

        <div *ngIf="errorMessage" class="mb-6 rounded-md bg-red-50 p-4 text-red-700">{{ errorMessage }}</div>
        <div *ngIf="loading" class="rounded-lg bg-white p-8 text-center text-gray-600 shadow-sm">Loading event submissions...</div>

        <div *ngIf="!loading" class="overflow-hidden rounded-lg border bg-white shadow-sm">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50"><tr><th class="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">Event</th><th class="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">Organizer</th><th class="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">Schedule</th><th class="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">Status</th><th class="px-6 py-3 text-right text-xs font-semibold uppercase text-gray-500">Actions</th></tr></thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr *ngFor="let event of events">
                  <td class="px-6 py-4"><div class="font-semibold text-gray-900">{{ event.title }}</div><div class="text-sm text-gray-500">{{ event.category }} · {{ event.templeName }}</div></td>
                  <td class="px-6 py-4 text-sm text-gray-700">{{ event.organizer?.username || 'Unknown' }}</td>
                  <td class="px-6 py-4 text-sm text-gray-700">{{ event.eventDate }}<br>{{ event.startTime }} - {{ event.endTime }}</td>
                  <td class="px-6 py-4"><span class="rounded-full px-2.5 py-1 text-xs font-semibold" [ngClass]="statusClass(event.status)">{{ event.status }}</span></td>
                  <td class="px-6 py-4"><div class="flex justify-end gap-2"><button *ngIf="event.status === 'Pending'" (click)="updateStatus(event, 'Approved')" class="rounded-md bg-green-600 px-3 py-2 text-xs font-semibold text-white hover:bg-green-700">Approve</button><button *ngIf="event.status === 'Pending'" (click)="updateStatus(event, 'Rejected')" class="rounded-md bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700">Reject</button><a [routerLink]="['/admin/events/edit', event.id]" class="rounded-md border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50">Edit</a></div></td>
                </tr>
                <tr *ngIf="events.length === 0"><td colspan="5" class="px-6 py-10 text-center text-gray-500">No event submissions found.</td></tr>
              </tbody>
            </table>
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

  updateStatus(event: AdminEvent, status: 'Approved' | 'Rejected'): void {
    this.http.patch(`${this.apiUrl}/event/${event.id}/status`, { status }).subscribe({
      next: () => { event.status = status; },
      error: error => { this.errorMessage = error?.error?.message || 'Could not update event status.'; },
    });
  }

  statusClass(status: AdminEvent['status']): string {
    return status === 'Approved' ? 'bg-green-100 text-green-800' : status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800';
  }
}
