import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../Auth/auth.service';

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

        <div class="grid md:grid-cols-3 gap-8 mb-12">
          <div
            *ngFor="let event of events"
            class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow"
          >
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xl font-bold text-gray-900">{{ event.title }}</h3>
              <span
                [class]="event.categoryClass"
                >{{ event.category }}</span
              >
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

            <button
              type="button"
              [disabled]="event.joined"
              [attr.aria-label]="event.joined ? 'Joined ' + event.title : 'Join ' + event.title"
              [class.bg-gray-400]="event.joined"
              [class.cursor-not-allowed]="event.joined"
              [class.bg-orange-600]="!event.joined"
              [class.hover:bg-orange-700]="!event.joined"
              class="w-full text-white py-3 rounded-lg font-medium"
              (click)="joinEvent(event)"
            >
              {{ event.joined ? 'Joined' : 'Join Event' }}
            </button>
            <button
              *ngIf="isAdmin && event.isCreated"
              type="button"
              class="w-full mt-2 border border-red-300 text-red-700 py-2 rounded-lg text-sm font-medium hover:bg-red-50"
              (click)="removeEvent(event)"
            >
              Remove Event
            </button>
          </div>
        </div>

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
              <button type="button" class="border border-red-300 text-red-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-red-50" (click)="leaveEvent(event)">
                Leave Event
              </button>
            </div>
          </div>
          <ng-template #noJoinedEvents>
            <div class="border border-dashed border-gray-300 rounded-lg p-6 text-center text-gray-600">
              You have not joined any events yet.
            </div>
          </ng-template>
        </section>

        <div class="text-center">
          <button
            class="border-2 border-orange-600 text-orange-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-orange-50"
          >
            View All Events →
          </button>
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
              *ngIf="isAdmin"
              routerLink="/events/add-event"
              class="bg-orange-600 text-white px-6 py-3 rounded-md hover:bg-orange-700"
            >
              + Create Event
            </button>
          </div>
        </section>
      </div>
    </section>
  `,
})
export class EventsComponent {
  private readonly storageKey = 'sanatan-joined-events';
  private readonly joinedEventIds = this.loadJoinedEventIds();
  readonly isAdmin: boolean;

  constructor(authService: AuthService) {
    const user = authService.getUserData();
    this.isAdmin = user?.role === 'Admin' || user?.role === 'Super Admin';
  }

  events: CommunityEvent[] = [
    {
      id: 'janmashtami',
      title: 'Janmashtami Celebration',
      venue: 'ISKCON Auckland',
      category: 'Festival',
      categoryClass: 'bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm font-medium',
      date: 'Monday, August 26',
      time: '18:00',
      attendees: 250,
      joined: this.joinedEventIds.has('janmashtami'),
    },
    {
      id: 'ganesha-chaturthi',
      title: 'Ganesha Chaturthi',
      venue: 'Ganesh Temple',
      category: 'Puja',
      categoryClass: 'bg-pink-100 text-pink-800 px-2 py-1 rounded text-sm font-medium',
      date: 'Saturday, September 7',
      time: '10:00',
      attendees: 180,
      joined: this.joinedEventIds.has('ganesha-chaturthi'),
    },
    {
      id: 'gita-study',
      title: 'Bhagavad Gita Study',
      venue: 'Community Center',
      category: 'Satsang',
      categoryClass: 'bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm font-medium',
      date: 'Tuesday, August 20',
      time: '19:00',
      attendees: 45,
      joined: this.joinedEventIds.has('gita-study'),
    },
    ...this.loadCreatedEvents(),
  ];

  get joinedEvents(): CommunityEvent[] {
    return this.events.filter(event => event.joined);
  }

  joinEvent(event: CommunityEvent): void {
    if (event.joined) {
      return;
    }

    event.joined = true;
    event.attendees += 1;
    this.joinedEventIds.add(event.id);
    this.saveJoinedEventIds();
  }

  leaveEvent(event: CommunityEvent): void {
    if (!event.joined) {
      return;
    }

    event.joined = false;
    event.attendees = Math.max(0, event.attendees - 1);
    this.joinedEventIds.delete(event.id);
    this.saveJoinedEventIds();
  }

  removeEvent(event: CommunityEvent): void {
    if (!this.isAdmin || !event.isCreated) {
      return;
    }

    this.events = this.events.filter(currentEvent => currentEvent.id !== event.id);
    this.joinedEventIds.delete(event.id);
    this.saveJoinedEventIds();

    try {
      const storedEvents = JSON.parse(localStorage.getItem('sanatan-created-events') ?? '[]');
      const remainingEvents = Array.isArray(storedEvents)
        ? storedEvents.filter(storedEvent => storedEvent?.id !== event.id)
        : [];
      localStorage.setItem('sanatan-created-events', JSON.stringify(remainingEvents));
    } catch {
      localStorage.removeItem('sanatan-created-events');
    }
  }

  private loadJoinedEventIds(): Set<string> {
    if (typeof localStorage === 'undefined') {
      return new Set<string>();
    }

    try {
      const storedIds = JSON.parse(localStorage.getItem(this.storageKey) ?? '[]');
      return new Set(Array.isArray(storedIds) ? storedIds : []);
    } catch {
      return new Set<string>();
    }
  }

  private saveJoinedEventIds(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.storageKey, JSON.stringify([...this.joinedEventIds]));
    }
  }

  private loadCreatedEvents(): CommunityEvent[] {
    try {
      const storedEvents = JSON.parse(localStorage.getItem('sanatan-created-events') ?? '[]');
      if (!Array.isArray(storedEvents)) {
        return [];
      }

      return storedEvents
        .filter((event): event is Record<string, unknown> =>
          typeof event?.id === 'string' &&
          typeof event?.title === 'string' &&
          typeof event?.category === 'string'
        )
        .map(event => ({
          id: event['id'] as string,
          title: event['title'] as string,
          venue: typeof event['venue'] === 'string' ? event['venue'] : 'Community gathering',
          category: event['category'] as string,
          categoryClass: 'bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm font-medium',
          date: typeof event['date'] === 'string' ? event['date'] : 'Date to be announced',
          time: typeof event['time'] === 'string' ? event['time'] : 'Time to be announced',
          attendees: typeof event['attendees'] === 'number' ? event['attendees'] : 0,
          joined: this.joinedEventIds.has(event['id'] as string),
          isCreated: true,
        }));
    } catch {
      return [];
    }
  }
}
