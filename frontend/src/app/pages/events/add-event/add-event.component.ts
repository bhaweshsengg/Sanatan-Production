import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-add-event',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mx-auto mt-20 px-4 py-12">
      <div class="max-w-4xl mx-auto">
        <div class="mb-8 flex items-center justify-between">
          <h2 class="text-2xl font-bold text-gray-900">{{ editMode ? 'Edit Community Event' : 'Create Community Event' }}</h2>
          <span class="text-sm text-gray-500">{{ editMode ? 'Admin edit' : 'Submit for approval' }}</span>
        </div>
        <div *ngIf="errorMessage" class="mb-4 rounded-md bg-red-50 p-4 text-red-700">{{ errorMessage }}</div>
        <div class="rounded-lg border bg-white shadow-sm">
          <div class="p-6"><h3 class="text-2xl font-semibold">Event Details</h3><p class="text-sm text-gray-600">Provide complete information about your event.</p></div>
          <div class="p-6 pt-0">
            <form class="space-y-8" (ngSubmit)="createEvent()" #eventForm="ngForm">
              <section class="space-y-6"><h3 class="border-b pb-2 text-lg font-semibold">Basic Information</h3>
                <div><label class="text-sm font-medium" for="title">Event Name *</label><input class="mt-2 flex h-10 w-full rounded-md border px-3" id="title" name="title" [(ngModel)]="event.title" required></div>
                <div><label class="text-sm font-medium" for="category">Event Category *</label><select class="mt-2 flex h-10 w-full rounded-md border px-3" id="category" name="category" [(ngModel)]="event.category" required><option value="" disabled>Select event category</option><option>Festival</option><option>Pooja</option><option>Havan/Yagna</option><option>Bhajan/Kirtan</option><option>Spiritual Discourse</option><option>Cultural Program</option><option>Youth Event</option><option>Community Service</option><option>Fundraising Event</option><option>Other</option></select></div>
                <div><label class="text-sm font-medium" for="description">Event Description *</label><textarea class="mt-2 min-h-24 w-full rounded-md border px-3 py-2" id="description" name="description" [(ngModel)]="event.description" required></textarea><p class="text-sm text-gray-500">{{ event.description.length }}/500 characters (minimum 50)</p></div>
                <div><label class="text-sm font-medium" for="imageUrl">Event Image/Banner</label><input class="mt-2 flex h-10 w-full rounded-md border px-3" id="imageUrl" name="imageUrl" type="url" [(ngModel)]="event.imageUrl"></div>
                <div><label class="text-sm font-medium" for="status">Event Status</label><select class="mt-2 flex h-10 w-full rounded-md border px-3" id="status" name="status" [(ngModel)]="event.status"><option>Draft</option><option>Published</option><option>Cancelled</option><option>Completed</option></select></div>
              </section>
              <section class="space-y-6"><h3 class="border-b pb-2 text-lg font-semibold">Date &amp; Time</h3>
                <div class="grid gap-4 sm:grid-cols-3"><div><label class="text-sm font-medium" for="date">Event Date *</label><input class="mt-2 flex h-10 w-full rounded-md border px-3" id="date" name="date" type="date" [(ngModel)]="event.date" required></div><div><label class="text-sm font-medium" for="startTime">Start Time *</label><input class="mt-2 flex h-10 w-full rounded-md border px-3" id="startTime" name="startTime" type="time" [(ngModel)]="event.startTime" required></div><div><label class="text-sm font-medium" for="endTime">End Time *</label><input class="mt-2 flex h-10 w-full rounded-md border px-3" id="endTime" name="endTime" type="time" [(ngModel)]="event.endTime" required></div></div>
                <div class="grid gap-4 sm:grid-cols-2"><div><label class="text-sm font-medium" for="multiDay">Multi-Day Event</label><select class="mt-2 flex h-10 w-full rounded-md border px-3" id="multiDay" name="multiDay" [(ngModel)]="event.multiDay"><option [ngValue]="false">No</option><option [ngValue]="true">Yes</option></select></div><div *ngIf="event.multiDay"><label class="text-sm font-medium" for="endDate">End Date *</label><input class="mt-2 flex h-10 w-full rounded-md border px-3" id="endDate" name="endDate" type="date" [(ngModel)]="event.endDate" [required]="event.multiDay"></div></div>
                <div class="grid gap-4 sm:grid-cols-2"><div><label class="text-sm font-medium" for="recurring">Recurring Event</label><select class="mt-2 flex h-10 w-full rounded-md border px-3" id="recurring" name="recurring" [(ngModel)]="event.recurring"><option [ngValue]="false">No</option><option [ngValue]="true">Yes</option></select></div><div *ngIf="event.recurring"><label class="text-sm font-medium" for="frequency">Frequency</label><select class="mt-2 flex h-10 w-full rounded-md border px-3" id="frequency" name="frequency" [(ngModel)]="event.frequency"><option>Daily</option><option>Weekly</option><option>Monthly</option><option>Annual</option></select></div></div>
                <div class="grid gap-4 sm:grid-cols-2"><div><label class="text-sm font-medium" for="registrationOpens">Registration Opens</label><input class="mt-2 flex h-10 w-full rounded-md border px-3" id="registrationOpens" name="registrationOpens" type="datetime-local" [(ngModel)]="event.registrationOpens"></div><div><label class="text-sm font-medium" for="registrationCloses">Registration Closes</label><input class="mt-2 flex h-10 w-full rounded-md border px-3" id="registrationCloses" name="registrationCloses" type="datetime-local" [(ngModel)]="event.registrationCloses"></div></div>
              </section>
              <section class="space-y-6"><h3 class="border-b pb-2 text-lg font-semibold">Location Details</h3>
                <div class="grid gap-4 sm:grid-cols-2"><div><label class="text-sm font-medium" for="templeName">Temple Name *</label><input class="mt-2 flex h-10 w-full rounded-md border px-3" id="templeName" name="templeName" [(ngModel)]="event.templeName" required></div><div><label class="text-sm font-medium" for="hallName">Hall/Room Name</label><input class="mt-2 flex h-10 w-full rounded-md border px-3" id="hallName" name="hallName" [(ngModel)]="event.hallName"></div></div>
                <div><label class="text-sm font-medium" for="address">Address</label><input class="mt-2 flex h-10 w-full rounded-md border px-3" id="address" name="address" [(ngModel)]="event.address"></div>
                <div class="grid gap-4 sm:grid-cols-2"><div><label class="text-sm font-medium" for="mapsLink">Google Maps Link</label><input class="mt-2 flex h-10 w-full rounded-md border px-3" id="mapsLink" name="mapsLink" type="url" [(ngModel)]="event.mapsLink"></div><div><label class="text-sm font-medium" for="onlineLink">Online Event Link</label><input class="mt-2 flex h-10 w-full rounded-md border px-3" id="onlineLink" name="onlineLink" type="url" [(ngModel)]="event.onlineLink"></div></div>
              </section>
              <div class="flex justify-end gap-3 border-t pt-6"><button type="button" class="rounded-md border px-4 py-2" (click)="saveDraft()">Save Draft</button><button type="submit" class="rounded-md bg-orange-600 px-4 py-2 text-white" [disabled]="isLoading || eventForm.invalid || event.description.trim().length < 50 || (event.multiDay && !event.endDate)">{{ editMode ? 'Save Changes' : 'Submit for Approval' }}</button></div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AddEventComponent {
  private readonly apiUrl = environment.apiBaseUrl;
  editMode = false;
  eventId: number | null = null;
  isLoading = false;
  errorMessage = '';
  event = { title: '', category: '', description: '', imageUrl: '', status: 'Draft', date: '', startTime: '', endTime: '', multiDay: false, endDate: '', recurring: false, frequency: 'Daily', registrationOpens: '', registrationCloses: '', templeName: '', hallName: '', address: '', mapsLink: '', onlineLink: '' };

  constructor(private readonly router: Router, private readonly http: HttpClient, private readonly route: ActivatedRoute) {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) { this.editMode = true; this.eventId = Number(id); this.loadEvent(this.eventId); }
  }

  createEvent(): void {
    if (!this.event.title.trim() || !this.event.category || this.event.description.trim().length < 50 || !this.event.date || !this.event.startTime || !this.event.endTime || (this.event.multiDay && !this.event.endDate) || !this.event.templeName.trim()) return;
    this.isLoading = true;
    const request = this.editMode && this.eventId ? this.http.put(`${this.apiUrl}/event/${this.eventId}`, this.toApiPayload()) : this.http.post(`${this.apiUrl}/event`, this.toApiPayload());
    request.subscribe({ next: () => { this.isLoading = false; this.router.navigate([this.editMode ? '/admin/events' : '/events']); }, error: error => { this.isLoading = false; this.errorMessage = error?.error?.message || 'Could not save event.'; } });
  }

  saveDraft(): void { localStorage.setItem('sanatan-event-draft', JSON.stringify(this.event)); }

  private toApiPayload() { return { title: this.event.title.trim(), category: this.event.category, description: this.event.description.trim(), imageUrl: this.event.imageUrl, eventDate: this.event.date, startTime: this.event.startTime, endTime: this.event.endTime, multiDay: this.event.multiDay, endDate: this.event.endDate, recurring: this.event.recurring, frequency: this.event.recurring ? this.event.frequency : '', registrationOpens: this.event.registrationOpens, registrationCloses: this.event.registrationCloses, templeName: this.event.templeName.trim(), hallName: this.event.hallName, address: this.event.address, mapsLink: this.event.mapsLink, onlineLink: this.event.onlineLink }; }

  private loadEvent(id: number): void { this.isLoading = true; this.http.get<any>(`${this.apiUrl}/event/admin/${id}`).subscribe({ next: response => { const event = response?.data; if (event) this.event = { ...this.event, ...event, date: event.eventDate }; this.isLoading = false; }, error: () => { this.isLoading = false; this.errorMessage = 'Could not load event.'; } }); }
}
