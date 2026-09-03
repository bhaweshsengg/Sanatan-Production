import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule for form directives
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-event',
  standalone: true, // Mark the component as standalone
  imports: [CommonModule, FormsModule], // Import necessary modules for standalone components
  template: `
    <div class="container mx-auto mt-20 px-4 py-12">
      <div class="max-w-4xl mx-auto">
        <div class="mb-8">
          <div class="flex items-center justify-between mb-2">
            <h2 class="text-2xl font-bold text-gray-900">Create Community Event</h2>
            <span class="text-sm text-gray-500">Event Details</span>
          </div>
          <div aria-valuemax="100" aria-valuemin="0" role="progressbar" data-state="indeterminate" data-max="100" class="relative w-full overflow-hidden rounded-full bg-secondary h-2">
            <div data-state="indeterminate" data-max="100" class="h-full w-full flex-1 bg-primary transition-all" style="transform: translateX(-83.3333%);"></div>
          </div>
        </div>
        <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div class="flex flex-col space-y-1.5 p-6">
            <div class="text-2xl font-semibold leading-none tracking-tight">Event Details</div>
            <div class="text-sm text-muted-foreground">Provide complete information about your event to help community members understand and participate.</div>
          </div>
          <div class="p-6 pt-0">
            <form class="space-y-8" (ngSubmit)="createEvent()" #eventForm="ngForm">
              <div class="space-y-6">
                <h3 class="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h3>
                <div class="space-y-2">
                  <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" for="title">Event Title *</label>
                  <input class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm" id="title" name="title" placeholder="e.g., Diwali Celebration 2024" [(ngModel)]="event.title" required>
                </div>
                <div class="space-y-2">
                  <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" for="category">Category *</label>         
                  <!-- The hidden select element from the original HTML is replaced with a visible one for direct interaction -->
                  <select class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm" id="category" name="category" [(ngModel)]="event.category" required>
                    <option value="" disabled>Select event category</option>
                    <option value="Festival">Festival</option>
                    <option value="Pooja">Pooja</option>
                    <option value="Havan/Yagna">Havan/Yagna</option>
                    <option value="Bhajan/Kirtan">Bhajan/Kirtan</option>
                    <option value="Spiritual Discourse">Spiritual Discourse</option>
                    <option value="Cultural Program">Cultural Program</option>
                    <option value="Youth Event">Youth Event</option>
                    <option value="Community Service">Community Service</option>
                    <option value="Fundraising Event">Fundraising Event</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div class="space-y-2">
                  <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" for="description">Event Description *</label>
                  <textarea class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm" id="description" name="description" placeholder="Describe your event, what participants can expect, and any special highlights..." rows="4" [(ngModel)]="event.description" required></textarea>
                  <p class="text-sm text-gray-500">{{ event.description.length }}/500 characters (minimum 50)</p>
                </div>
                <div class="space-y-2">
                  <label class="text-sm font-medium" for="imageUrl">Event Image/Banner</label>
                  <input class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" id="imageUrl" name="imageUrl" type="url" placeholder="https://example.com/event-banner.jpg" [(ngModel)]="event.imageUrl">
                </div>
                <div class="space-y-2">
                  <label class="text-sm font-medium" for="status">Event Status</label>
                  <select class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" id="status" name="status" [(ngModel)]="event.status">
                    <option>Draft</option><option>Published</option><option>Cancelled</option><option>Completed</option>
                  </select>
                </div>
              </div>
              <div class="space-y-6">
                <h3 class="text-lg font-semibold text-gray-900 border-b pb-2">Date &amp; Time</h3>
                <div class="grid sm:grid-cols-3 gap-4">
                  <div class="space-y-2"><label class="text-sm font-medium" for="date">Event Date *</label><input class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" id="date" name="date" type="date" [(ngModel)]="event.date" required></div>
                  <div class="space-y-2"><label class="text-sm font-medium" for="startTime">Start Time *</label><input class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" id="startTime" name="startTime" type="time" [(ngModel)]="event.startTime" required></div>
                  <div class="space-y-2"><label class="text-sm font-medium" for="endTime">End Time *</label><input class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" id="endTime" name="endTime" type="time" [(ngModel)]="event.endTime" required></div>
                </div>
                <div class="grid sm:grid-cols-2 gap-4">
                  <div class="space-y-2"><label class="text-sm font-medium" for="multiDay">Multi-Day Event</label><select class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" id="multiDay" name="multiDay" [(ngModel)]="event.multiDay"><option [ngValue]="false">No</option><option [ngValue]="true">Yes</option></select></div>
                  <div class="space-y-2" *ngIf="event.multiDay"><label class="text-sm font-medium" for="endDate">End Date *</label><input class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" id="endDate" name="endDate" type="date" [(ngModel)]="event.endDate" [required]="event.multiDay"></div>
                </div>
                <div class="grid sm:grid-cols-2 gap-4">
                  <div class="space-y-2"><label class="text-sm font-medium" for="recurring">Recurring Event</label><select class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" id="recurring" name="recurring" [(ngModel)]="event.recurring"><option [ngValue]="false">No</option><option [ngValue]="true">Yes</option></select></div>
                  <div class="space-y-2" *ngIf="event.recurring"><label class="text-sm font-medium" for="frequency">Frequency</label><select class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" id="frequency" name="frequency" [(ngModel)]="event.frequency"><option>Daily</option><option>Weekly</option><option>Monthly</option><option>Annual</option></select></div>
                </div>
                <div class="grid sm:grid-cols-2 gap-4"><div class="space-y-2"><label class="text-sm font-medium" for="registrationOpens">Registration Opens</label><input class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" id="registrationOpens" name="registrationOpens" type="datetime-local" [(ngModel)]="event.registrationOpens"></div><div class="space-y-2"><label class="text-sm font-medium" for="registrationCloses">Registration Closes</label><input class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" id="registrationCloses" name="registrationCloses" type="datetime-local" [(ngModel)]="event.registrationCloses"></div></div>
              </div>
              <div class="space-y-6">
                <h3 class="text-lg font-semibold text-gray-900 border-b pb-2">Location Details</h3>
                <div class="grid sm:grid-cols-2 gap-4"><div class="space-y-2"><label class="text-sm font-medium" for="templeName">Temple Name *</label><input class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" id="templeName" name="templeName" placeholder="Temple or organization name" [(ngModel)]="event.templeName" required></div><div class="space-y-2"><label class="text-sm font-medium" for="hallName">Hall/Room Name</label><input class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" id="hallName" name="hallName" placeholder="Optional hall or room" [(ngModel)]="event.hallName"></div></div>
                <div class="space-y-2"><label class="text-sm font-medium" for="address">Address</label><input class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" id="address" name="address" placeholder="Full event address" [(ngModel)]="event.address"></div>
                <div class="grid sm:grid-cols-2 gap-4"><div class="space-y-2"><label class="text-sm font-medium" for="mapsLink">Google Maps Link</label><input class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" id="mapsLink" name="mapsLink" type="url" placeholder="https://maps.google.com/..." [(ngModel)]="event.mapsLink"></div><div class="space-y-2"><label class="text-sm font-medium" for="onlineLink">Online Event Link (if virtual)</label><input class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" id="onlineLink" name="onlineLink" type="url" placeholder="https://meet.example.com/..." [(ngModel)]="event.onlineLink"></div></div>
              </div>
              <div class="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                <div class="flex gap-2 flex-1">
                  <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 border border-input hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 ml-auto bg-transparent" type="button" (click)="saveDraft()">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-save mr-2 h-4 w-4"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"></path><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"></path><path d="M7 3v4a1 1 0 0 0 1 1h7"></path></svg>
                    Save Draft
                  </button>
                </div>
                <div class="flex gap-2">
                  <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 text-primary-foreground h-10 px-4 py-2 bg-orange-600 hover:bg-orange-700" type="submit" [disabled]="eventForm.invalid || event.description.trim().length < 50 || (event.multiDay && !event.endDate)">Create Event</button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div class="text-center mt-8">
          <p class="text-black-700">Questions about creating events? <a class="text-orange-600 hover:underline" href="/help">Check our guidelines</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [] // Tailwind CSS classes are used, so no additional inline styles are needed.
})
export class AddEventComponent {
  private readonly storageKey = 'sanatan-created-events';
  event = {
    title: '', category: '', description: '', imageUrl: '', status: 'Draft',
    date: '', startTime: '', endTime: '', multiDay: false, endDate: '',
    recurring: false, frequency: 'Daily', registrationOpens: '', registrationCloses: '',
    templeName: '', hallName: '', address: '', mapsLink: '', onlineLink: '',
  };

  constructor(private readonly router: Router) {}

  createEvent(): void {
    if (!this.event.title.trim() || !this.event.category || this.event.description.trim().length < 50 ||
      !this.event.date || !this.event.startTime || !this.event.endTime ||
      (this.event.multiDay && !this.event.endDate) || !this.event.templeName.trim()) {
      return;
    }

    const createdEvents = this.loadCreatedEvents();
    createdEvents.push({
      id: `created-${Date.now()}`,
      title: this.event.title.trim(),
      venue: this.event.hallName.trim() ? `${this.event.templeName.trim()} - ${this.event.hallName.trim()}` : this.event.templeName.trim(),
      category: this.event.category,
      date: this.event.multiDay ? `${this.event.date} - ${this.event.endDate}` : this.event.date,
      time: `${this.event.startTime} - ${this.event.endTime}`,
      description: this.event.description.trim(),
      attendees: 0,
      imageUrl: this.event.imageUrl,
      status: this.event.status,
      address: this.event.address,
      mapsLink: this.event.mapsLink,
      onlineLink: this.event.onlineLink,
      recurring: this.event.recurring,
      frequency: this.event.recurring ? this.event.frequency : '',
      registrationOpens: this.event.registrationOpens,
      registrationCloses: this.event.registrationCloses,
    });
    localStorage.setItem(this.storageKey, JSON.stringify(createdEvents));
    this.router.navigate(['/events']);
  }

  saveDraft(): void {
    localStorage.setItem('sanatan-event-draft', JSON.stringify(this.event));
  }

  private loadCreatedEvents(): Array<Record<string, unknown>> {
    try {
      const storedEvents = JSON.parse(localStorage.getItem(this.storageKey) ?? '[]');
      return Array.isArray(storedEvents) ? storedEvents : [];
    } catch {
      return [];
    }
  }
}
